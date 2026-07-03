'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { ImageUploadField } from '@/components/admin/image-upload-field';

export interface FormFieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'checkbox' | 'select' | 'date' | 'number' | 'richtext' | 'image';
  options?: { value: string; label: string }[];
  required?: boolean;
  helpText?: string;
}

function buildInitialState(fields: FormFieldConfig[], initialData?: Record<string, unknown>) {
  const state: Record<string, unknown> = {};
  for (const field of fields) {
    const value = initialData?.[field.name];
    if (field.type === 'checkbox') {
      state[field.name] = Boolean(value);
    } else if (field.type === 'date' && typeof value === 'string') {
      state[field.name] = value.substring(0, 10);
    } else {
      state[field.name] = value ?? '';
    }
  }
  return state;
}

export function ResourceForm({
  fields,
  initialData,
  apiPath,
  itemId,
  redirectTo,
}: {
  fields: FormFieldConfig[];
  initialData?: Record<string, unknown>;
  apiPath: string;
  itemId?: string;
  redirectTo: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<Record<string, unknown>>(() => buildInitialState(fields, initialData));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function setFieldValue(name: string, value: string) {
    setData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const method = itemId ? 'PATCH' : 'POST';
      const url = itemId ? `${apiPath}/${itemId}` : apiPath;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? 'Erro ao salvar.');
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-1">
          <label htmlFor={field.name} className="text-sm font-medium text-slate-700">
            {field.label}
            {field.required && ' *'}
          </label>

          {field.type === 'richtext' ? (
            <RichTextEditor
              value={String(data[field.name] ?? '')}
              onChange={(html) => setFieldValue(field.name, html)}
            />
          ) : field.type === 'image' ? (
            <ImageUploadField
              value={String(data[field.name] ?? '')}
              onChange={(url) => setFieldValue(field.name, url)}
            />
          ) : field.type === 'checkbox' ? (
            <input
              id={field.name}
              name={field.name}
              type="checkbox"
              checked={Boolean(data[field.name])}
              onChange={handleChange}
              className="ml-2"
            />
          ) : field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              rows={8}
              required={field.required}
              value={String(data[field.name] ?? '')}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm focus:border-slate-500 focus:outline-none"
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              required={field.required}
              value={String(data[field.name] ?? '')}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            >
              <option value="">—</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? 'text'}
              required={field.required}
              value={String(data[field.name] ?? '')}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          )}
          {field.helpText && <p className="text-xs text-slate-400">{field.helpText}</p>}
        </div>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {saving ? 'Salvando…' : 'Salvar'}
      </button>
    </form>
  );
}
