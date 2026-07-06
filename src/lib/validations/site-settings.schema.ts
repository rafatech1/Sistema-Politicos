import { z } from 'zod';
import { HOME_SECTION_KEYS } from '@/lib/home-sections';
import { optionalImagePath } from '@/lib/validations/zod-helpers';

const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Cor deve ser um hexadecimal válido (#RRGGBB)');

// Campos opcionais com formato (hex/URL/e-mail): o admin "desmarca" um campo
// limpando o input no formulário, o que envia '' — sem o .or(z.literal(''))
// isso cairia na regex/url/email e falharia a validação em vez de limpar o
// campo. O transform normaliza '' para null antes de chegar no Prisma.
const optionalHexColor = hexColor
  .or(z.literal(''))
  .optional()
  .nullable()
  .transform((v) => (v === '' ? null : v));
const optionalUrl = z
  .string()
  .url('URL inválida')
  .or(z.literal(''))
  .optional()
  .nullable()
  .transform((v) => (v === '' ? null : v));
const optionalEmail = z
  .string()
  .email('E-mail inválido')
  .or(z.literal(''))
  .optional()
  .nullable()
  .transform((v) => (v === '' ? null : v));
const optionalText = z.string().optional().nullable();

const extraLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

const homeSectionSchema = z.object({
  key: z.enum(HOME_SECTION_KEYS),
  enabled: z.boolean(),
  order: z.number().int(),
});

export const siteSettingsSchema = z.object({
  mode: z.enum(['CAMPAIGN', 'MANDATE']).optional(),

  candidateName: z.string().min(1).optional(),
  candidateNumber: z.string().min(1).optional(),
  partyAcronym: z.string().min(1).optional(),
  partyName: optionalText,
  position: z.string().min(1).optional(),
  slogan: optionalText,

  primaryColor: hexColor.optional(),
  secondaryColor: hexColor.optional(),
  accentColor: optionalHexColor,

  logoUrl: optionalImagePath,
  logoDarkUrl: optionalImagePath,
  faviconUrl: optionalImagePath,
  profilePhotoUrl: optionalImagePath,
  heroBackgroundImageUrl: optionalImagePath,

  aboutTagline: optionalText,
  aboutShortText: optionalText,
  aboutFullText: optionalText,

  officeAddress: optionalText,
  officeMapEmbedUrl: optionalUrl,

  homeSections: z.array(homeSectionSchema).optional().nullable(),

  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  twitterUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  telegramUrl: optionalUrl,
  kwaiUrl: optionalUrl,
  extraLinks: z.array(extraLinkSchema).optional().nullable(),

  whatsappNumber: optionalText,
  whatsappDefaultMessage: optionalText,
  contactEmail: optionalEmail,
  contactPhone: optionalText,

  tseIdentification: optionalText,
  campaignCnpj: optionalText,
  footerText: optionalText,
  privacyPolicyText: optionalText,
  termsOfServiceText: optionalText,

  electionCountdownEnabled: z.boolean().optional(),
  electionDate: z.coerce.date().optional().nullable(),

  metaTitle: optionalText,
  metaDescription: optionalText,
  ogImageUrl: optionalImagePath,
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

// Campos mínimos exigidos no onboarding interativo (npm run setup).
export const siteSettingsOnboardingSchema = siteSettingsSchema
  .pick({
    candidateName: true,
    candidateNumber: true,
    partyAcronym: true,
    position: true,
  })
  .required();
