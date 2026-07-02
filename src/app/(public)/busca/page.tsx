import Link from 'next/link';
import type { Metadata } from 'next';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { searchContent } from '@/lib/search';

export const metadata: Metadata = { title: 'Busca' };

export default async function BuscaPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q ?? '';
  const settings = await getCachedSiteSettings();
  const results = query ? await searchContent(query, settings.mode) : [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Busca</h1>

      <form action="/busca" method="GET" className="mt-6">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Buscar notícias, propostas..."
          className="w-full rounded-full border border-slate-300 px-5 py-3 text-sm focus:border-primary focus:outline-none"
        />
      </form>

      {query && (
        <p className="mt-6 text-sm text-slate-500">
          {results.length} resultado{results.length === 1 ? '' : 's'} para &ldquo;{query}&rdquo;
        </p>
      )}

      <ul className="mt-6 space-y-6">
        {results.map((result) => (
          <li key={`${result.type}-${result.id}`} className="border-b border-slate-100 pb-6">
            <Link href={result.href} className="font-semibold text-slate-900 hover:text-primary">
              {result.title}
            </Link>
            {result.summary && <p className="mt-1 line-clamp-2 text-sm text-slate-600">{result.summary}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
