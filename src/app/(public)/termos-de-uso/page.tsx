import type { Metadata } from 'next';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { sanitizeRichText } from '@/lib/utils/sanitize-html';

export const metadata: Metadata = { title: 'Termos de Uso' };

export default async function TermosDeUsoPage() {
  const settings = await getCachedSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Termos de Uso</h1>
      {settings.termsOfServiceText ? (
        <div
          className="prose prose-slate mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeRichText(settings.termsOfServiceText) }}
        />
      ) : (
        <p className="mt-8 text-slate-500">Os termos de uso ainda não foram publicados.</p>
      )}
    </div>
  );
}
