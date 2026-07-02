import 'dotenv/config';
import { existsSync, appendFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { execSync } from 'node:child_process';
import path from 'node:path';
import * as p from '@clack/prompts';

const ENV_PATH = path.join(process.cwd(), '.env');
const CARGO_OPTIONS = [
  'Prefeito',
  'Vice-Prefeito',
  'Vereador',
  'Deputado Estadual',
  'Deputado Federal',
  'Senador',
  'Governador',
  'Vice-Governador',
  'Presidente',
  'Vice-Presidente',
  'Outro',
];

function ensureEnvFile(): void {
  if (!existsSync(ENV_PATH)) {
    p.log.error(
      'Arquivo .env não encontrado. Copie .env.example para .env e preencha DATABASE_URL antes de rodar o setup.',
    );
    process.exit(1);
  }
}

function ensureJwtSecrets(): void {
  const missing: string[] = [];
  if (!process.env.JWT_ACCESS_SECRET) missing.push('JWT_ACCESS_SECRET');
  if (!process.env.JWT_REFRESH_SECRET) missing.push('JWT_REFRESH_SECRET');
  if (missing.length === 0) return;

  let appended = '\n';
  for (const key of missing) {
    const value = randomBytes(48).toString('hex');
    process.env[key] = value;
    appended += `${key}="${value}"\n`;
  }
  appendFileSync(ENV_PATH, appended);
  p.log.success(`Segredos gerados automaticamente: ${missing.join(', ')}`);
}

async function main() {
  p.intro('Setup — Sistema de Site para Candidato Político');

  ensureEnvFile();

  if (!process.env.DATABASE_URL) {
    p.log.error('DATABASE_URL ausente no .env. Preencha antes de continuar.');
    process.exit(1);
  }

  ensureJwtSecrets();

  // Importados dinamicamente após garantir DATABASE_URL/segredos no process.env.
  const { prisma } = await import('../src/lib/prisma');
  const { createUser } = await import('../src/lib/services/user.service');
  const { upsertSiteSettings } = await import('../src/lib/services/site-settings.service');
  const { writeAuditLog } = await import('../src/lib/audit/audit-log');
  const { siteSettingsOnboardingSchema } = await import('../src/lib/validations/site-settings.schema');
  const { createUserSchema } = await import('../src/lib/validations/user.schema');

  const dbSpinner = p.spinner();
  dbSpinner.start('Testando conexão com o banco de dados');
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbSpinner.stop('Conexão com o banco OK.');
  } catch (err) {
    dbSpinner.stop('Falha ao conectar no banco.');
    p.log.error(
      `Não foi possível conectar usando DATABASE_URL. Verifique se o Postgres está no ar.\n${String(err)}`,
    );
    process.exit(1);
  }

  const migrateSpinner = p.spinner();
  migrateSpinner.start('Aplicando migrations (prisma migrate deploy)');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'pipe' });
    migrateSpinner.stop('Migrations aplicadas.');
  } catch (err) {
    migrateSpinner.stop('Falha ao aplicar migrations.');
    p.log.error(String(err));
    process.exit(1);
  }

  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    const proceed = await p.confirm({
      message: 'Setup já foi executado antes (já existem usuários). Reconfigurar mesmo assim?',
      initialValue: false,
    });
    if (p.isCancel(proceed) || !proceed) {
      p.outro('Setup cancelado. Nenhuma alteração adicional foi feita.');
      process.exit(0);
    }
  }

  p.log.step('Dados do candidato');

  const modeChoice = await p.select({
    message: 'Modo do site',
    options: [
      { value: 'CAMPAIGN', label: 'Campanha (propostas, agenda, voluntariado)' },
      { value: 'MANDATE', label: 'Mandato (projetos de lei, emendas, prestação de contas)' },
    ],
  });
  if (p.isCancel(modeChoice)) return cancelSetup();
  const mode = modeChoice as 'CAMPAIGN' | 'MANDATE';

  const candidateName = await p.text({
    message: 'Nome do candidato',
    validate: (v) => (v.trim().length < 2 ? 'Informe o nome completo' : undefined),
  });
  if (p.isCancel(candidateName)) return cancelSetup();

  const candidateNumber = await p.text({
    message: 'Número do candidato',
    validate: (v) => (v.trim().length === 0 ? 'Informe o número' : undefined),
  });
  if (p.isCancel(candidateNumber)) return cancelSetup();

  const partyAcronym = await p.text({
    message: 'Sigla do partido',
    validate: (v) => (v.trim().length === 0 ? 'Informe a sigla' : undefined),
  });
  if (p.isCancel(partyAcronym)) return cancelSetup();

  const partyName = await p.text({ message: 'Nome do partido (opcional)' });
  if (p.isCancel(partyName)) return cancelSetup();

  const positionChoice = await p.select({
    message: 'Cargo pretendido',
    options: CARGO_OPTIONS.map((c) => ({ value: c, label: c })),
  });
  if (p.isCancel(positionChoice)) return cancelSetup();

  let position = positionChoice as string;
  if (position === 'Outro') {
    const customPosition = await p.text({ message: 'Informe o cargo' });
    if (p.isCancel(customPosition)) return cancelSetup();
    position = customPosition;
  }

  const slogan = await p.text({ message: 'Slogan de campanha (opcional)' });
  if (p.isCancel(slogan)) return cancelSetup();

  const primaryColor = await p.text({
    message: 'Cor primária (hex)',
    initialValue: '#0F172A',
    validate: (v) => (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v) ? undefined : 'Use um hex válido, ex: #0F172A'),
  });
  if (p.isCancel(primaryColor)) return cancelSetup();

  const secondaryColor = await p.text({
    message: 'Cor secundária (hex)',
    initialValue: '#2563EB',
    validate: (v) => (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v) ? undefined : 'Use um hex válido, ex: #2563EB'),
  });
  if (p.isCancel(secondaryColor)) return cancelSetup();

  const whatsappNumber = await p.text({ message: 'WhatsApp de contato (opcional, com DDI/DDD)' });
  if (p.isCancel(whatsappNumber)) return cancelSetup();

  p.log.step('Usuário administrador');

  const adminName = await p.text({
    message: 'Nome do administrador',
    validate: (v) => (v.trim().length < 2 ? 'Informe o nome' : undefined),
  });
  if (p.isCancel(adminName)) return cancelSetup();

  const adminEmail = await p.text({
    message: 'E-mail do administrador',
    validate: (v) => (/^\S+@\S+\.\S+$/.test(v) ? undefined : 'E-mail inválido'),
  });
  if (p.isCancel(adminEmail)) return cancelSetup();

  const autoGeneratePassword = await p.confirm({
    message: 'Gerar senha segura automaticamente?',
    initialValue: true,
  });
  if (p.isCancel(autoGeneratePassword)) return cancelSetup();

  let adminPassword: string;
  if (autoGeneratePassword) {
    adminPassword = generateStrongPassword();
  } else {
    const typed = await p.password({
      message: 'Senha do administrador (mín. 8 caracteres, com maiúscula/minúscula/número)',
      validate: (v) =>
        /[a-z]/.test(v) && /[A-Z]/.test(v) && /[0-9]/.test(v) && v.length >= 8
          ? undefined
          : 'A senha deve ter 8+ caracteres, com maiúscula, minúscula e número',
    });
    if (p.isCancel(typed)) return cancelSetup();
    adminPassword = typed;
  }

  const siteSettingsData = siteSettingsOnboardingSchema.parse({
    candidateName,
    candidateNumber,
    partyAcronym,
    position,
  });

  const userData = createUserSchema.parse({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: 'ADMIN',
  });

  const finishSpinner = p.spinner();
  finishSpinner.start('Criando usuário administrador e salvando configurações');

  const admin = await createUser(userData);

  await upsertSiteSettings(
    {
      ...siteSettingsData,
      mode,
      partyName: partyName || null,
      slogan: slogan || null,
      primaryColor,
      secondaryColor,
      whatsappNumber: whatsappNumber || null,
      tseIdentification:
        'REVISAR COM A ASSESSORIA JURÍDICA: identificação exigida pelo TSE para propaganda eleitoral na internet (Lei 9.504/97).',
      privacyPolicyText:
        'REVISAR COM A ASSESSORIA JURÍDICA: política de privacidade (LGPD) da campanha.',
    },
    admin.id,
  );

  await writeAuditLog({
    entityType: 'User',
    entityId: admin.id,
    action: 'CREATE',
    afterJson: admin,
    userId: admin.id,
    userEmailSnapshot: admin.email,
  });

  finishSpinner.stop('Setup concluído.');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const summaryLines = [
    `Login: ${siteUrl}/admin/login`,
    `E-mail: ${admin.email}`,
    autoGeneratePassword ? `Senha (anote agora, não será mostrada de novo): ${adminPassword}` : 'Senha: a que você digitou.',
    '',
    'Próximos passos:',
    '- Revise os textos legais (TSE/LGPD) em Configurações > Rodapé legal.',
    '- Preencha logos, redes sociais e demais dados em Configurações.',
    '- Veja o checklist de deploy no README (Vercel + Railway).',
  ];
  p.note(summaryLines.join('\n'), 'Resumo');

  p.outro('Tudo pronto! Rode "npm run dev" para acessar o painel.');
  await prisma.$disconnect();
}

function generateStrongPassword(): string {
  // Regenera até satisfazer maiúscula+minúscula+número (evita a rara chance
  // de um base64url aleatório cair só em uma classe de caractere).
  let candidate: string;
  do {
    candidate = randomBytes(9).toString('base64url');
  } while (!(/[a-z]/.test(candidate) && /[A-Z]/.test(candidate) && /[0-9]/.test(candidate)));
  return candidate;
}

function cancelSetup(): never {
  p.cancel('Setup cancelado.');
  process.exit(0);
}

main().catch((err) => {
  p.log.error(String(err));
  process.exit(1);
});
