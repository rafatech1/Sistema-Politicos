'use client';

import { useState, type FormEvent } from 'react';
import { SocialIcons, type SocialLinksData } from '@/components/public/social-icons';
import { SectionHeading } from './section-heading';

export function ContactSection({ socialData }: { socialData: SocialLinksData }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    consent: false,
    website: '', // honeypot: campo escondido, só bots preenchem
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CONTACT',
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          message: form.message,
          consentLGPD: form.consent,
          website: form.website,
        }),
      });

      if (!res.ok) {
        setStatus('error');
        return;
      }

      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '', consent: false, website: '' });
    } catch {
      setStatus('error');
    }
  }

  const fieldClassName =
    'w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';
  const labelClassName = 'mb-1.5 block text-sm font-medium text-slate-700';

  return (
    <section id="contato" className="bg-slate-50 px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-2 sm:items-start">
        <div>
          <SectionHeading eyebrow="Fale comigo" title="Contato" />
          <p className="leading-relaxed text-slate-600">
            Fale diretamente pelo formulário ou pelas redes sociais.
          </p>
          <SocialIcons
            data={socialData}
            className="mt-6 flex items-center gap-3"
            iconClassName="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-all hover:-translate-y-0.5 hover:opacity-80"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8"
        >
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div>
            <label htmlFor="contact-name" className={labelClassName}>
              Nome
            </label>
            <input
              id="contact-name"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={fieldClassName}
            />
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClassName}>
              E-mail
            </label>
            <input
              id="contact-email"
              required
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={fieldClassName}
            />
          </div>

          <div>
            <label htmlFor="contact-phone" className={labelClassName}>
              Telefone <span className="font-normal text-slate-400">(opcional)</span>
            </label>
            <input
              id="contact-phone"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className={fieldClassName}
            />
          </div>

          <div>
            <label htmlFor="contact-message" className={labelClassName}>
              Mensagem
            </label>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className={fieldClassName}
            />
          </div>

          <label className="flex items-start gap-2 text-xs text-slate-500">
            <input
              required
              type="checkbox"
              checked={form.consent}
              onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
              className="mt-0.5"
            />
            Concordo com o uso dos meus dados para retorno de contato, conforme a{' '}
            <a href="/politica-de-privacidade" className="underline">
              Política de Privacidade
            </a>
            .
          </label>

          {status === 'success' && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Mensagem enviada! Retornaremos em breve.
            </div>
          )}
          {status === 'error' && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0">
                <path
                  d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1 1 0 003 19.7h18a1 1 0 00.89-1.66L13.71 3.86a1 1 0 00-1.72 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Não foi possível enviar. Tente novamente em instantes.
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
          >
            {status === 'sending' ? 'Enviando…' : 'Enviar mensagem'}
          </button>
        </form>
      </div>
    </section>
  );
}
