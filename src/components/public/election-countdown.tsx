'use client';

import { useEffect, useState } from 'react';

function getRemaining(targetIso: string) {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function ElectionCountdown({ electionDateIso }: { electionDateIso: string }) {
  const [remaining, setRemaining] = useState(() => getRemaining(electionDateIso));

  useEffect(() => {
    const interval = setInterval(() => setRemaining(getRemaining(electionDateIso)), 1000);
    return () => clearInterval(interval);
  }, [electionDateIso]);

  if (!remaining) return null;

  const units: Array<[string, number]> = [
    ['dias', remaining.days],
    ['horas', remaining.hours],
    ['min', remaining.minutes],
    ['seg', remaining.seconds],
  ];

  return (
    <div className="flex gap-3">
      {units.map(([label, value]) => (
        <div
          key={label}
          className="flex min-w-[3.25rem] flex-col items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2"
        >
          <span className="font-display text-xl font-black tabular-nums text-white">
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-white/70">{label}</span>
        </div>
      ))}
    </div>
  );
}
