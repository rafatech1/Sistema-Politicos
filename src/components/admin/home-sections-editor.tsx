'use client';

import { HOME_SECTION_LABELS, type HomeSectionConfig } from '@/lib/home-sections';

export function HomeSectionsEditor({
  sections,
  onChange,
  disabled,
}: {
  sections: HomeSectionConfig[];
  onChange: (sections: HomeSectionConfig[]) => void;
  disabled: boolean;
}) {
  const ordered = [...sections].sort((a, b) => a.order - b.order);

  function toggle(key: string) {
    onChange(ordered.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= ordered.length) return;

    const reordered = [...ordered];
    const current = reordered[index]!;
    const swapped = reordered[target]!;
    reordered[index] = swapped;
    reordered[target] = current;
    onChange(reordered.map((section, i) => ({ ...section, order: i })));
  }

  return (
    <ul className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200">
      {ordered.map((section, index) => (
        <li key={section.key} className="flex items-center gap-4 bg-white px-4 py-3">
          <div className="flex shrink-0 flex-col">
            <button
              type="button"
              disabled={disabled || index === 0}
              onClick={() => move(index, -1)}
              aria-label="Mover para cima"
              className="text-slate-400 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-30"
            >
              ▲
            </button>
            <button
              type="button"
              disabled={disabled || index === ordered.length - 1}
              onClick={() => move(index, 1)}
              aria-label="Mover para baixo"
              className="text-slate-400 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-30"
            >
              ▼
            </button>
          </div>

          <span className="flex-1 text-sm font-medium text-slate-800">
            {HOME_SECTION_LABELS[section.key] ?? section.key}
          </span>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={section.enabled}
              disabled={disabled}
              onChange={() => toggle(section.key)}
            />
            Visível
          </label>
        </li>
      ))}
    </ul>
  );
}
