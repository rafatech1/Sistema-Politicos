import type { Metadata } from 'next';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { sanitizeRichText } from '@/lib/utils/sanitize-html';

export const metadata: Metadata = { title: 'Política de Privacidade' };

export default async function PoliticaDePrivacidadePage() {
  const settings = await getCachedSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Política de Privacidade</h1>
      {settings.privacyPolicyText ? (
        <div
          className="prose prose-slate mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeRichText(settings.privacyPolicyText) }}
        />
      ) : (
        <p className="mt-8 text-slate-500">A política de privacidade ainda não foi publicada.</p>
      )}
    </div>
  );
}
