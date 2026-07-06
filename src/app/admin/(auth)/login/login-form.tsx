'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export function LoginForm({
  candidateName,
  logoUrl,
}: {
  candidateName: string;
  logoUrl: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? 'Não foi possível entrar.');
        return;
      }

      const redirectTo = searchParams.get('redirect') || '/admin';
      router.push(redirectTo);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const fieldClassName =
    'w-full rounded-md border-2 border-slate-900 px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-primary opacity-20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-secondary opacity-20 blur-3xl"
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm space-y-5 border-2 border-slate-900 bg-white p-8 shadow-hard"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={candidateName}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full border-2 border-slate-900 object-cover"
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-900 bg-primary text-lg font-black text-white">
              {candidateName.slice(0, 2).toUpperCase()}
            </span>
          )}
          <div>
            <p className="font-display text-lg font-black uppercase leading-tight text-slate-900">
              {candidateName}
            </p>
            <p className="mt-1.5 inline-block -rotate-1 border-2 border-slate-900 bg-accent px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-900">
              Painel Administrativo
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-bold uppercase tracking-wide text-slate-700">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            autoFocus
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClassName}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-bold uppercase tracking-wide text-slate-700">
            Senha
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClassName}
          />
        </div>

        {error && (
          <p role="alert" className="border-2 border-red-600 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full border-2 border-slate-900 bg-accent px-4 py-2.5 text-sm font-black uppercase tracking-wide text-slate-900 shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
