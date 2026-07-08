'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface EventoCarouselItem {
  id: string;
  slug: string;
  title: string;
  location: string | null;
  startAtIso: string;
}

function formatDay(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(date);
}

function formatMonthAbbr(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date).replace('.', '').toUpperCase();
}

function formatWeekdayTime(date: Date) {
  const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date).replace('.', '');
  const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date);
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} · ${time}`;
}

const AUTOPLAY_INTERVAL_MS = 5000;

export function AgendaCarousel({ eventos }: { eventos: EventoCarouselItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index];
    if (!track || !(slide instanceof HTMLElement)) return;
    track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const next = (index + eventos.length) % eventos.length;
      setActiveIndex(next);
      scrollToIndex(next);
    },
    [eventos.length, scrollToIndex],
  );

  // Autoplay — pausa em hover/foco (usuário navegando pelos links) e
  // respeita prefers-reduced-motion.
  useEffect(() => {
    if (eventos.length <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setInterval(() => {
      if (pausedRef.current) return;
      setActiveIndex((current) => {
        const next = (current + 1) % eventos.length;
        scrollToIndex(next);
        return next;
      });
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(id);
  }, [eventos.length, scrollToIndex]);

  // Mantém os "pingos" sincronizados quando o usuário arrasta/rola manualmente.
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;
      let closest = 0;
      let closestDistance = Infinity;
      Array.from(track.children).forEach((child, index) => {
        if (!(child instanceof HTMLElement)) return;
        const distance = Math.abs(child.offsetLeft - track.scrollLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = index;
        }
      });
      setActiveIndex(closest);
    }, 120);
  }, []);

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label="Próximos eventos"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onFocus={() => (pausedRef.current = true)}
      onBlur={() => (pausedRef.current = false)}
    >
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {eventos.map((evento) => {
            const startAt = new Date(evento.startAtIso);
            return (
              <Link
                key={evento.id}
                href={`/agenda/${evento.slug}`}
                className="group flex w-[85%] shrink-0 snap-start overflow-hidden border-2 border-slate-900 bg-white shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <div className="flex w-20 shrink-0 flex-col items-center justify-center gap-0.5 border-r-2 border-dashed border-slate-900 bg-primary py-6 text-white transition-colors group-hover:bg-accent group-hover:text-slate-900">
                  <span className="font-display text-3xl font-black leading-none">{formatDay(startAt)}</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest">{formatMonthAbbr(startAt)}</span>
                </div>
                <div className="flex flex-1 flex-col justify-center p-5">
                  <span className="text-xs font-bold uppercase tracking-wide text-primary">
                    {formatWeekdayTime(startAt)}
                  </span>
                  <h3 className="mt-1.5 font-display font-black uppercase leading-tight text-slate-900">
                    {evento.title}
                  </h3>
                  {evento.location && <p className="mt-2 line-clamp-1 text-sm text-slate-600">{evento.location}</p>}
                  <span
                    aria-hidden
                    className="mt-3 inline-flex w-fit items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-400 transition-all group-hover:gap-2 group-hover:text-primary"
                  >
                    Ver detalhes <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {eventos.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Evento anterior"
              onClick={() => goTo(activeIndex - 1)}
              className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-slate-900 bg-white text-slate-900 transition-colors hover:bg-accent"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              {eventos.map((evento, index) => (
                <button
                  key={evento.id}
                  type="button"
                  aria-label={`Ir para evento ${index + 1}`}
                  aria-current={index === activeIndex}
                  onClick={() => goTo(index)}
                  className={`h-2.5 w-2.5 rounded-full border border-slate-900 transition-colors ${
                    index === activeIndex ? 'bg-slate-900' : 'bg-white'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Próximo evento"
              onClick={() => goTo(activeIndex + 1)}
              className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-slate-900 bg-white text-slate-900 transition-colors hover:bg-accent"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
