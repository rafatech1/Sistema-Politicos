'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/admin/badge';

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
    'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-primary opacity-10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-secondary opacity-10 blur-3xl"
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-card"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={candidateName}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full border border-slate-200 object-cover"
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
              {candidateName.slice(0, 2).toUpperCase()}
            </span>
          )}
          <div>
            <p className="font-display text-lg font-semibold leading-tight text-slate-900">{candidateName}</p>
            <p className="mt-1.5 inline-block">
              <Badge tone="accent">Painel Administrativo</Badge>
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
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
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
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
          <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
