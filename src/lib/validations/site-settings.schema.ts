import { z } from 'zod';
import { HOME_SECTION_KEYS } from '@/lib/home-sections';
import { optionalImagePath } from '@/lib/validations/zod-helpers';

const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Cor deve ser um hexadecimal válido (#RRGGBB)');

const optionalUrl = z.string().url('URL inválida').optional().nullable();
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
  accentColor: hexColor.optional().nullable(),

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
  contactEmail: z.string().email().optional().nullable(),
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
  ogImageUrl: optionalUrl,
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
