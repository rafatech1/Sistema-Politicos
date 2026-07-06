# syntax=docker/dockerfile:1

# ============================================================
#  Sistema-Politicos — Next.js 14 (App Router) + Prisma
#  Multi-stage: dev (hot reload) e produção (standalone)
# ============================================================

# ---------- base ----------
FROM node:20-alpine AS base
# libc6-compat: dependências nativas | openssl: engine do Prisma no Alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# ---------- deps ----------
# Instala dependências. O schema é copiado antes do install para o caso de
# haver "postinstall": "prisma generate" no package.json.
FROM base AS deps
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

# ---------- dev ----------
# Alvo usado pelo docker-compose no ambiente local.
# O código real é montado por bind mount pelo compose (hot reload).
FROM base AS dev
ENV NODE_ENV=development
# Polling garante hot-reload confiável sobre bind mount no Windows/WSL2
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---------- builder (produção) ----------
FROM base AS builder
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# `next build` chama "collect page data" em toda rota para decidir se é
# estática ou dinâmica — isso executa o import-time do app, incluindo
# src/lib/env.ts (valida DATABASE_URL/JWT_*_SECRET via Zod e lança erro se
# faltar). Nenhuma rota faz query real nesta fase, só placeholders com o
# formato/tamanho exigido bastam. Os valores reais de produção vêm do
# ambiente do container em runtime (env_file/secrets do orquestrador),
# nunca destes ARGs — eles não são copiados para o estágio `runner`.
ARG DATABASE_URL=postgresql://build:build@localhost:5432/build
ARG JWT_ACCESS_SECRET=build-time-placeholder-not-a-real-secret-0000
ARG JWT_REFRESH_SECRET=build-time-placeholder-not-a-real-secret-1111
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---------- runner (produção / self-host) ----------
# Requer output: 'standalone' no next.config.js
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Prisma: schema + client gerado para permitir "migrate deploy" em runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
