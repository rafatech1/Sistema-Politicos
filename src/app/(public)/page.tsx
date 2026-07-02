import { getSiteSettings } from '@/lib/services/site-settings.service';

// Home placeholder — o módulo completo (hero, vídeo, contador, chamadas para
// as seções) é implementado em uma rodada seguinte. Esta página já confirma
// que a tematização (site_settings) chega até o site público.
export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      {settings.profilePhotoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={settings.profilePhotoUrl}
          alt={settings.candidateName}
          className="h-32 w-32 rounded-full object-cover"
        />
      )}
      <span
        className="rounded-full px-4 py-1 text-sm font-semibold text-white"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        {settings.candidateNumber} · {settings.partyAcronym}
      </span>
      <h1 className="text-4xl font-bold" style={{ color: 'var(--color-primary)' }}>
        {settings.candidateName}
      </h1>
      <p className="text-lg text-slate-600">{settings.position}</p>
      {settings.slogan && (
        <p className="text-xl font-medium" style={{ color: 'var(--color-secondary)' }}>
          &ldquo;{settings.slogan}&rdquo;
        </p>
      )}
      <p className="mt-8 text-sm text-slate-400">
        Site em construção — módulos do site público serão adicionados nas próximas etapas.
      </p>
    </section>
  );
}
