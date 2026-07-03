'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'cookie-consent-accepted';

export function CookieBanner() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    setAccepted(localStorage.getItem(STORAGE_KEY) === 'true');
  }, []);

  if (accepted) return null;

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, 'true');
    setAccepted(true);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-slate-600">
          Usamos cookies essenciais para o funcionamento do site. Ao continuar navegando, você concorda com nossa{' '}
          <Link href="/politica-de-privacidade" className="font-medium text-primary underline">
            Política de Privacidade
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={handleAccept}
          className="shrink-0 rounded-md bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}
