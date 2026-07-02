import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { createUser, findUserByEmail } from '../src/lib/services/user.service';
import { upsertSiteSettings } from '../src/lib/services/site-settings.service';

// Seed de DEMONSTRAÇÃO COMERCIAL: candidato fictício com dados fake, para uso
// em vendas/demo. NUNCA é disparado automaticamente pelo `npm run setup`
// (que faz o onboarding real de um cliente) — rode manualmente com
// `npm run db:seed` apenas em um banco de demo/dev.
const DEMO_ADMIN_EMAIL = 'demo@candidato.example';
const DEMO_ADMIN_PASSWORD = 'Demo12345!';

async function main() {
  console.log('Seeding banco de demonstração...');

  const existingAdmin = await findUserByEmail(DEMO_ADMIN_EMAIL);
  const admin = existingAdmin
    ? existingAdmin
    : await createUser({
        name: 'Equipe Demo',
        email: DEMO_ADMIN_EMAIL,
        password: DEMO_ADMIN_PASSWORD,
        role: 'ADMIN',
      });

  console.log(
    existingAdmin
      ? 'Usuário admin de demo já existe, pulando.'
      : `Usuário admin de demo criado: ${DEMO_ADMIN_EMAIL} / ${DEMO_ADMIN_PASSWORD}`,
  );

  await upsertSiteSettings(
    {
      candidateName: 'Ana Silva',
      candidateNumber: '45123',
      partyAcronym: 'PDC',
      partyName: 'Partido Democrático do Cidadão',
      position: 'Vereadora',
      slogan: 'Coragem para mudar, compromisso para servir',
      primaryColor: '#1D4ED8',
      secondaryColor: '#F59E0B',
      instagramUrl: 'https://instagram.com/anasilva45',
      facebookUrl: 'https://facebook.com/anasilva45',
      youtubeUrl: 'https://youtube.com/@anasilva45',
      whatsappNumber: '5511999999999',
      whatsappDefaultMessage: 'Olá! Quero saber mais sobre a campanha da Ana Silva 45.',
      contactEmail: 'contato@anasilva45.example',
      campaignCnpj: '00.000.000/0001-00',
      tseIdentification:
        'Material de campanha - Ana Silva 45 - Eleições 2026. Conteúdo de responsabilidade do candidato.',
      footerText: 'Ana Silva 45 — Eleições 2026',
      privacyPolicyText:
        'Texto de exemplo de política de privacidade (LGPD) para fins de demonstração comercial.',
      electionCountdownEnabled: true,
      electionDate: new Date('2026-10-04'),
      metaTitle: 'Ana Silva 45 — Vereadora',
      metaDescription: 'Site oficial da campanha de Ana Silva, candidata a vereadora em 2026.',
    },
    admin.id,
  );

  console.log('Seed concluído.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
