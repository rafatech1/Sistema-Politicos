'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Sempre nasce visível (SSR e no-JS incluídos) para nunca esconder conteúdo
 * permanentemente caso o JS falhe/trave. Só entra em modo "animar" quando o
 * próprio JS confirma, no mount, que o elemento nasce fora da viewport —
 * conteúdo já visível na primeira dobra nunca é ocultado à espera do
 * IntersectionObserver.
 */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight * 0.9;
    if (alreadyInView) return;

    setVisible(false);
    setAnimated(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${
        animated
          ? 'transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100'
          : ''
      } ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
    >
      {children}
    </div>
  );
}
