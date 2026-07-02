import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { sanitizeRichText } from '@/lib/utils/sanitize-html';

function formatDate(date: Date | null) {
  if (!date) return '';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({ where: { slug }, include: { category: true } });
  if (!post || post.status !== 'PUBLISHED') return null;
  return post;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
      type: 'article',
    },
  };
}

export default async function NoticiaPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {post.category && (
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">{post.category.name}</span>
      )}
      <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-slate-500">{formatDate(post.publishedAt)}</p>

      {post.coverImageUrl && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl bg-slate-100">
          <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <div
        className="prose prose-slate mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizeRichText(post.content) }}
      />
    </article>
  );
}
