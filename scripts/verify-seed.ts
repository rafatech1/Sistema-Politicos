import 'dotenv/config';
import { createUser, findUserByEmail } from '../src/lib/services/user.service';
import { upsertSiteSettings } from '../src/lib/services/site-settings.service';
import { prisma } from '../src/lib/prisma';

async function main() {
  const existing = await findUserByEmail('admin@verify.test');
  const admin =
    existing ??
    (await createUser({
      name: 'Admin Verify',
      email: 'admin@verify.test',
      password: 'Verify123!',
      role: 'ADMIN',
    }));

  await upsertSiteSettings(
    {
      mode: 'CAMPAIGN',
      candidateName: 'Candidato Teste',
      candidateNumber: '12345',
      partyAcronym: 'PT1',
      position: 'Vereador',
    },
    admin.id,
  );

  console.log('OK', admin.email);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
