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
    <div className="flex gap-4">
      {units.map(([label, value]) => (
        <div key={label} className="flex flex-col items-center rounded-lg bg-white/10 px-4 py-3 backdrop-blur">
          <span className="text-2xl font-bold tabular-nums text-white">{String(value).padStart(2, '0')}</span>
          <span className="text-xs uppercase tracking-wide text-white/70">{label}</span>
        </div>
      ))}
    </div>
  );
}
