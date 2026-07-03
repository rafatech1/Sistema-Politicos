# Sistema Políticos — Template de Site para Candidato

Template reutilizável de site institucional para candidatos políticos brasileiros. Modelo de negócio: **deploy individual por cliente** — cada candidato tem seu próprio clone deste repositório, seu próprio banco de dados e seu próprio deploy. Nada de identidade do candidato fica no código: tudo vive em `.env` (segredos/infraestrutura) ou na tabela `site_settings` (conteúdo editável pelo painel admin).

> **Status atual**: schema completo do banco, autenticação/RBAC, configuração/tematização (`site_settings`), site público e painel admin (CRUDs de conteúdo com editor rich text e upload de imagem, log de auditoria, sitemap/robots, banner de cookies) já implementados. Itens restantes do roadmap em [Roadmap](#roadmap--próximos-módulos).

## Stack Tecnológica

- **Frontend + Backend**: Next.js 14 (App Router) + API Routes, React, Tailwind CSS
- **Banco**: PostgreSQL + Prisma ORM (uma instância por candidato)
- **Busca**: full-text search nativo do Postgres (`tsvector`, dicionário `portuguese`)
- **Autenticação**: JWT (access token curto) + refresh token opaco rotativo, senhas com `bcryptjs`
- **Upload de mídia**: disco local em dev, com abstração pronta para S3-compatível (Cloudflare R2 / Backblaze)
- **Deploy**: frontend na Vercel, banco no Railway (um projeto por candidato)

## Pré-requisitos

- Node.js 20+
- npm
- PostgreSQL 14+ (local via Docker ou instância gerenciada)

## Setup Local

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Copie o arquivo de ambiente e preencha `DATABASE_URL`:
   ```bash
   cp .env.example .env
   ```
3. Suba um Postgres local (opcional, se não tiver um já):
   ```bash
   docker compose up -d
   ```
4. Rode o setup interativo — aplica as migrations, cria o usuário admin e configura os dados básicos do candidato:
   ```bash
   npm run setup
   ```
5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
6. Acesse `http://localhost:3000/admin/login` com o e-mail/senha criados no passo 4.

### Comandos úteis

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm run start` | Build e start de produção |
| `npm run setup` | Onboarding interativo de um novo cliente (migrations + admin + `site_settings`) |
| `npm run db:migrate` | Cria/aplica migrations em desenvolvimento (`prisma migrate dev`) |
| `npm run db:migrate:deploy` | Aplica migrations já commitadas (usado em produção/CI) |
| `npm run db:studio` | Abre o Prisma Studio para inspecionar o banco |
| `npm run db:seed` | Popula um candidato fictício de demonstração (**dev/demo only**, nunca rodar em produção) |
| `npm run typecheck` / `npm run lint` | Checagem de tipos e lint |

## Estrutura de Pastas

```
prisma/
  schema.prisma        Schema completo do domínio
  seed.ts               Seed de demonstração comercial (dev only)
  migrations/
scripts/
  setup.ts               Onboarding interativo (npm run setup)
src/
  middleware.ts           Gate de UX (Edge) para rotas /admin/*
  lib/
    auth/                 Password hashing, JWT, refresh token, RBAC, sessão, rate limit de login
    audit/                 Audit log genérico (writeAuditLog / withAudit)
    media/                 Abstração de storage (local hoje, S3-compatível depois)
    services/              Regras de negócio (user, site-settings) — única fonte usada por API e scripts
    validations/           Schemas zod de entrada
    utils/                  Helpers (slugify, respostas de API, metadados de request)
  app/
    (public)/              Site público do candidato
    admin/
      (auth)/login/         Login (fora do gate de autenticação)
      (dashboard)/           Área autenticada: dashboard, CRUDs de conteúdo, configurações, usuários, auditoria
    api/
      auth/                  login, refresh, logout, me
      admin/                 settings, users, media (upload), audit-logs, CRUDs de conteúdo
      health/
    sitemap.ts / robots.ts  Special files do Next.js (SEO)
  components/
    admin/                  ResourceForm/ResourceTable genéricos + RichTextEditor (Tiptap) + ImageUploadField
    public/                 Header, footer, seções da Home, CookieBanner etc.
```

## Autenticação e Papéis (RBAC)

- **Admin**: controle total — conteúdo, configurações do site, usuários da equipe.
- **Editor**: cria e edita conteúdo, sem acesso a configurações do site nem a usuários.

A permissão é **sempre validada no servidor** (`src/lib/auth/rbac.ts`, chamada por toda rota `/api/admin/*` e por Server Components do admin) — o frontend nunca é a fonte de verdade. O `middleware.ts` no Edge Runtime apenas redireciona usuários sem JWT válido para `/admin/login`; ele não consegue verificar estado do banco (usuário desativado, papel alterado), por isso a checagem real acontece em `requireUser()`/`requirePermission()` no servidor.

Tokens: access token JWT de 15 minutos em cookie httpOnly + refresh token opaco (30 dias) armazenado como hash no banco, com rotação a cada uso e revogação em cadeia caso um token já revogado seja reapresentado (sinal de roubo).

## Configurações do Site (`site_settings`)

Linha única (`id = 1`) editável em `/admin/settings` por administradores, cobrindo: identidade (nome, número, partido, cargo, slogan), cores/logos/favicon/foto, redes sociais, WhatsApp, contador regressivo de eleição, e campos de conformidade legal (identificação TSE, CNPJ de campanha, política de privacidade). A mesma função de serviço (`src/lib/services/site-settings.service.ts`) é usada tanto pela API do painel quanto pelo `npm run setup`, evitando lógica duplicada.

**Importante**: os textos de identificação eleitoral e política de privacidade vêm com um placeholder de aviso — devem ser revisados pela assessoria jurídica de cada campanha antes da publicação (Lei 9.504/97 + LGPD).

## Banco de Dados / Prisma

O `prisma/schema.prisma` já modela todo o domínio do produto (propostas, projetos, agenda, notícias, galeria, leads, biografia), mesmo que a UI/API desses módulos ainda não exista — evita migrations quebradas conforme os módulos forem implementados.

### Busca full-text (tsvector)

As colunas `search_vector` de `propostas` e `posts` são geridas via SQL puro (coluna **gerada/STORED** com `to_tsvector('portuguese', ...)` + índice GIN), não pelo Prisma Client. Ao criar novas migrations que envolvam essas tabelas, **nunca use `prisma db push`** — sempre `prisma migrate dev`/`deploy`. Buscas devem usar `prisma.$queryRaw` com `search_vector @@ plainto_tsquery('portuguese', $1)`, nunca o query builder tipado.

## Upload de Mídia

Interface `StorageAdapter` (`src/lib/media/storage.ts`) com duas implementações:
- `LocalStorageAdapter`: grava em `public/uploads/` — **apenas para desenvolvimento** (o filesystem da Vercel é efêmero em produção).
- `S3StorageAdapter`: armazenamento S3-compatível (Cloudflare R2, Backblaze B2) via `@aws-sdk/client-s3`. Selecionado com `MEDIA_STORAGE_PROVIDER=s3` no `.env` — nesse modo, `S3_ENDPOINT`/`S3_REGION`/`S3_BUCKET`/`S3_ACCESS_KEY_ID`/`S3_SECRET_ACCESS_KEY`/`S3_PUBLIC_BASE_URL` passam a ser obrigatórios (validado em `src/lib/env.ts`, falha no boot se faltar algum).

O upload em si passa por `POST /api/admin/media` (multipart/form-data, campo `file`; PNG/JPEG/WebP/GIF até 5MB), usado tanto pelo editor rich text (`RichTextEditor`) quanto pelo campo de imagem (`ImageUploadField`) — ambos em `src/components/admin/`.

## Segurança

- Senhas com `bcryptjs` (12 salt rounds).
- JWT assinado com `jose` (compatível com Edge Runtime), refresh token opaco com hash SHA-256 no banco.
- Rate limiting do login via contagem de tentativas falhas no `AuditLog` (sem necessidade de Redis nesta fase). Formulários públicos de alto tráfego (voluntário/contato), quando implementados, devem usar um limitador dedicado.
- Headers de segurança (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) configurados em `next.config.mjs`.
- Toda entrada de API validada com `zod`.

## Auditoria

Toda alteração relevante é registrada em `AuditLog` (`entityType`, `entityId`, `action`, `beforeJson`, `afterJson`, `userId`, timestamps). Use `writeAuditLog()` ou o wrapper `withAudit()` (`src/lib/audit/audit-log.ts`) em qualquer novo CRUD para manter o padrão sem repetir boilerplate. Visualização em `/admin/auditoria` (permissão `audit:read`, só ADMIN), com filtros por entidade/ação e diff antes/depois.

## SEO e Compliance

- `src/app/sitemap.ts` e `src/app/robots.ts` (special files do Next.js) geram `/sitemap.xml` e `/robots.txt` a partir do conteúdo publicado e do modo do site (Campanha/Mandato).
- Banner de cookies (LGPD) em `src/components/public/cookie-banner.tsx`, montado no layout público — consentimento simples (aceitar) persistido em `localStorage`, sem categorias (o site hoje só usa cookies funcionais).

## Checklist de Deploy — Vercel + Railway

> Objetivo: colocar um novo cliente no ar em 1–2 horas.

1. **Railway (banco)**
   - Criar um novo projeto Railway dedicado ao cliente.
   - Provisionar um serviço PostgreSQL.
   - Copiar a `DATABASE_URL` gerada.
2. **Repositório**
   - Clonar/forkar este template para o repositório do cliente (não commitar `.env`).
3. **Vercel (frontend)**
   - Criar um novo projeto Vercel apontando para o repositório do cliente.
   - Configurar as variáveis de ambiente (ver tabela abaixo), incluindo a `DATABASE_URL` do Railway.
   - Definir o domínio do cliente.
4. **Onboarding**
   - Rodar `npm run setup` (localmente, apontando para a `DATABASE_URL` de produção, ou via um job de deploy) para aplicar migrations, criar o admin e preencher os dados básicos do candidato.
   - Fazer o deploy na Vercel.
5. **Pós-deploy**
   - Login em `/admin/login`, revisar/completar `site_settings` (logos, redes sociais, textos legais).
   - Validar com a assessoria jurídica da campanha os textos de identificação TSE e política de privacidade.
   - Configurar backups automáticos do Postgres no Railway.

## Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string do Postgres |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Segredos JWT (gerados automaticamente pelo `npm run setup` se ausentes) |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site (metadata, links absolutos) |
| `MEDIA_STORAGE_PROVIDER` | `local` (dev) ou `s3` (produção) |
| `S3_*` (`ENDPOINT`, `REGION`, `BUCKET`, `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY`, `PUBLIC_BASE_URL`) | Configuração do storage S3-compatível — **obrigatórias** quando `MEDIA_STORAGE_PROVIDER=s3` |

## Como Personalizar para um Novo Cliente

1. Clone este repositório-template para o repositório do cliente.
2. Configure `.env` com a `DATABASE_URL` e domínio do cliente.
3. Rode `npm run setup` para o onboarding (admin + `site_settings`).
4. Ajuste conteúdo visual/textual pelo painel admin — **não edite código específico do cliente no template**, para manter os `git merge` de melhorias do template para os forks de clientes ativos sem conflito.

## Roadmap / Próximos Módulos

- Galeria de mídia central (biblioteca reutilizável de imagens entre Post/Proposta/Projeto — hoje cada campo de imagem faz upload avulso via `/api/admin/media`), Agenda de Campanha.
- Conformidade: widget VLibras, revisão de acessibilidade WCAG AA.
- Suíte de testes automatizados (auth/RBAC/`crud-route-factory`) — maior ponto cego hoje, nenhum módulo tem cobertura.

### Concluído nesta rodada
- Editor rich text (Tiptap) e upload de imagem (local + `S3StorageAdapter` real) nos campos de conteúdo e em `site_settings`.
- Visualizador de log de auditoria (`/admin/auditoria`), `sitemap.xml`/`robots.txt`, banner de cookies (LGPD).
