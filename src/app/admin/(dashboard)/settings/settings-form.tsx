'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { HomeSectionsEditor } from '@/components/admin/home-sections-editor';
import { resolveHomeSections, type HomeSectionConfig } from '@/lib/home-sections';

interface SiteSettingsFormData {
  mode: 'CAMPAIGN' | 'MANDATE';
  candidateName: string;
  candidateNumber: string;
  partyAcronym: string;
  partyName: string | null;
  position: string;
  slogan: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  profilePhotoUrl: string | null;
  heroBackgroundImageUrl: string | null;
  aboutTagline: string | null;
  aboutShortText: string | null;
  aboutFullText: string | null;
  officeAddress: string | null;
  officeMapEmbedUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
  linkedinUrl: string | null;
  telegramUrl: string | null;
  kwaiUrl: string | null;
  whatsappNumber: string | null;
  whatsappDefaultMessage: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  tseIdentification: string | null;
  campaignCnpj: string | null;
  footerText: string | null;
  privacyPolicyText: string | null;
  termsOfServiceText: string | null;
  electionCountdownEnabled: boolean;
  electionDate: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  homeSections?: unknown;
}

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  disabled,
  textarea,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  disabled: boolean;
  textarea?: boolean;
}) {
  const commonProps = {
    id: name,
    name,
    value,
    onChange,
    disabled,
    className:
      'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100',
  };

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {textarea ? (
        <textarea rows={3} {...commonProps} />
      ) : (
        <input type={type} {...commonProps} />
      )}
    </div>
  );
}

function RichTextField({
  label,
  name,
  value,
  onChange,
  disabled,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <RichTextEditor value={value} onChange={(html) => onChange(name, html)} disabled={disabled} />
    </div>
  );
}

function ImageField({
  label,
  name,
  value,
  onChange,
  disabled,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <ImageUploadField value={value} onChange={(url) => onChange(name, url)} disabled={disabled} />
    </div>
  );
}

export function SettingsForm({
  initialSettings,
  canEdit,
}: {
  initialSettings: SiteSettingsFormData;
  canEdit: boolean;
}) {
  const [data, setData] = useState<SiteSettingsFormData>(initialSettings);
  const [sections, setSections] = useState<HomeSectionConfig[]>(() =>
    resolveHomeSections(initialSettings.homeSections),
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, homeSections: sections }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setMessage({ type: 'error', text: body.error ?? 'Erro ao salvar.' });
        return;
      }

      const updated = await res.json();
      setData(updated);
      setSections(resolveHomeSections(updated.homeSections));
      setMessage({ type: 'success', text: 'Configurações salvas com sucesso.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <fieldset disabled={!canEdit} className="space-y-8">
        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Modo do site</h2>
          <p className="text-xs text-slate-500">
            Campanha: propostas, agenda e voluntariado. Mandato: projetos de lei, emendas
            parlamentares e prestação de contas. Os módulos são os mesmos — o modo só define quais
            seções aparecem na Home e os rótulos usados.
          </p>
          <div className="max-w-xs space-y-1">
            <label htmlFor="mode" className="text-sm font-medium text-slate-700">
              Modo
            </label>
            <select
              id="mode"
              name="mode"
              value={data.mode}
              onChange={handleChange}
              disabled={!canEdit}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100"
            >
              <option value="CAMPAIGN">Campanha</option>
              <option value="MANDATE">Mandato</option>
            </select>
          </div>
        </section>

        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Identidade</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome do candidato" name="candidateName" value={data.candidateName} onChange={handleChange} disabled={!canEdit} />
            <Field label="Número" name="candidateNumber" value={data.candidateNumber} onChange={handleChange} disabled={!canEdit} />
            <Field label="Sigla do partido" name="partyAcronym" value={data.partyAcronym} onChange={handleChange} disabled={!canEdit} />
            <Field label="Nome do partido" name="partyName" value={data.partyName ?? ''} onChange={handleChange} disabled={!canEdit} />
            <Field label="Cargo pretendido" name="position" value={data.position} onChange={handleChange} disabled={!canEdit} />
            <Field label="Slogan (Hero)" name="slogan" value={data.slogan ?? ''} onChange={handleChange} disabled={!canEdit} />
          </div>
        </section>

        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Cores e imagens</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Field label="Cor primária" name="primaryColor" value={data.primaryColor} onChange={handleChange} disabled={!canEdit} />
              </div>
              <span
                className="mb-1 h-9 w-9 flex-shrink-0 rounded-md border border-slate-300"
                style={{ backgroundColor: data.primaryColor }}
              />
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Field label="Cor secundária" name="secondaryColor" value={data.secondaryColor} onChange={handleChange} disabled={!canEdit} />
              </div>
              <span
                className="mb-1 h-9 w-9 flex-shrink-0 rounded-md border border-slate-300"
                style={{ backgroundColor: data.secondaryColor }}
              />
            </div>
            <ImageField label="Logo" name="logoUrl" value={data.logoUrl ?? ''} onChange={setFieldValue} disabled={!canEdit} />
            <ImageField label="Favicon" name="faviconUrl" value={data.faviconUrl ?? ''} onChange={setFieldValue} disabled={!canEdit} />
            <ImageField label="Foto de perfil (seção Sobre)" name="profilePhotoUrl" value={data.profilePhotoUrl ?? ''} onChange={setFieldValue} disabled={!canEdit} />
            <ImageField label="Foto de fundo do Hero" name="heroBackgroundImageUrl" value={data.heroBackgroundImageUrl ?? ''} onChange={setFieldValue} disabled={!canEdit} />
          </div>
        </section>

        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Sobre / Biografia resumida</h2>
          <Field label="Tagline (ex: Cristão, conservador e defensor da família)" name="aboutTagline" value={data.aboutTagline ?? ''} onChange={handleChange} disabled={!canEdit} />
          <Field label="Resumo curto (exibido na Home)" name="aboutShortText" value={data.aboutShortText ?? ''} onChange={handleChange} disabled={!canEdit} textarea />
          <RichTextField label="Texto completo (página /sobre)" name="aboutFullText" value={data.aboutFullText ?? ''} onChange={setFieldValue} disabled={!canEdit} />
        </section>

        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Gabinete / Comitê</h2>
          <Field label="Endereço" name="officeAddress" value={data.officeAddress ?? ''} onChange={handleChange} disabled={!canEdit} />
          <Field label="URL de embed do Google Maps" name="officeMapEmbedUrl" value={data.officeMapEmbedUrl ?? ''} onChange={handleChange} disabled={!canEdit} />
        </section>

        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Redes sociais e contato</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Instagram" name="instagramUrl" value={data.instagramUrl ?? ''} onChange={handleChange} disabled={!canEdit} />
            <Field label="Facebook" name="facebookUrl" value={data.facebookUrl ?? ''} onChange={handleChange} disabled={!canEdit} />
            <Field label="YouTube" name="youtubeUrl" value={data.youtubeUrl ?? ''} onChange={handleChange} disabled={!canEdit} />
            <Field label="TikTok" name="tiktokUrl" value={data.tiktokUrl ?? ''} onChange={handleChange} disabled={!canEdit} />
            <Field label="X (Twitter)" name="twitterUrl" value={data.twitterUrl ?? ''} onChange={handleChange} disabled={!canEdit} />
            <Field label="Telegram" name="telegramUrl" value={data.telegramUrl ?? ''} onChange={handleChange} disabled={!canEdit} />
            <Field label="Kwai" name="kwaiUrl" value={data.kwaiUrl ?? ''} onChange={handleChange} disabled={!canEdit} />
            <Field label="WhatsApp (número)" name="whatsappNumber" value={data.whatsappNumber ?? ''} onChange={handleChange} disabled={!canEdit} />
            <Field label="Mensagem padrão do WhatsApp" name="whatsappDefaultMessage" value={data.whatsappDefaultMessage ?? ''} onChange={handleChange} disabled={!canEdit} />
            <Field label="E-mail de contato" name="contactEmail" value={data.contactEmail ?? ''} onChange={handleChange} disabled={!canEdit} />
            <Field label="Telefone de contato" name="contactPhone" value={data.contactPhone ?? ''} onChange={handleChange} disabled={!canEdit} />
          </div>
        </section>

        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Contador de eleição</h2>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="electionCountdownEnabled"
              checked={data.electionCountdownEnabled}
              onChange={handleChange}
              disabled={!canEdit}
            />
            Exibir contador regressivo no Hero
          </label>
          <Field
            label="Data da eleição"
            name="electionDate"
            type="date"
            value={data.electionDate ? data.electionDate.substring(0, 10) : ''}
            onChange={handleChange}
            disabled={!canEdit}
          />
        </section>

        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Rodapé legal (TSE / LGPD)</h2>
          <p className="text-xs text-slate-500">
            Os textos exigidos para propaganda eleitoral na internet (Lei 9.504/97) devem ser
            validados com a assessoria jurídica da campanha antes de publicar.
          </p>
          <Field label="CNPJ da campanha" name="campaignCnpj" value={data.campaignCnpj ?? ''} onChange={handleChange} disabled={!canEdit} />
          <Field label="Identificação TSE (rodapé)" name="tseIdentification" value={data.tseIdentification ?? ''} onChange={handleChange} disabled={!canEdit} textarea />
          <Field label="Texto do rodapé" name="footerText" value={data.footerText ?? ''} onChange={handleChange} disabled={!canEdit} />
          <RichTextField label="Política de privacidade (LGPD)" name="privacyPolicyText" value={data.privacyPolicyText ?? ''} onChange={setFieldValue} disabled={!canEdit} />
          <RichTextField label="Termos de uso" name="termsOfServiceText" value={data.termsOfServiceText ?? ''} onChange={setFieldValue} disabled={!canEdit} />
        </section>

        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Curadoria da Home</h2>
          <p className="text-xs text-slate-500">
            Escolha quais seções aparecem na página inicial e em que ordem. O Hero segue sempre no
            topo quando visível.
          </p>
          <HomeSectionsEditor sections={sections} onChange={setSections} disabled={!canEdit} />
        </section>

        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">SEO</h2>
          <Field label="Meta título" name="metaTitle" value={data.metaTitle ?? ''} onChange={handleChange} disabled={!canEdit} />
          <Field label="Meta descrição" name="metaDescription" value={data.metaDescription ?? ''} onChange={handleChange} disabled={!canEdit} textarea />
        </section>
      </fieldset>

      {message && (
        <p className={message.type === 'success' ? 'text-sm text-green-600' : 'text-sm text-red-600'}>
          {message.text}
        </p>
      )}

      {canEdit && (
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Salvando…' : 'Salvar configurações'}
        </button>
      )}
    </form>
  );
}
