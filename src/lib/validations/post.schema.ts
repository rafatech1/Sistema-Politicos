import { z } from 'zod';
import { optionalEnum, optionalSlug } from '@/lib/validations/zod-helpers';

export const createPostSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  slug: optionalSlug,
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  coverImageUrl: z.string().url().optional().nullable().or(z.literal('')),
  status: optionalEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'], 'DRAFT'),
  isFeatured: z.boolean().default(false),
  categoryId: z.string().optional().nullable().or(z.literal('')),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
