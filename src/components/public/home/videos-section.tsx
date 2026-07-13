import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { extractYouTubeId, getYouTubeThumbnailUrl } from '@/lib/utils/youtube';
import { YouTubeFacade } from '@/components/public/youtube-facade';
import { SectionHeading } from '@/components/public/section-heading';

const getVideos = unstable_cache(
  () => prisma.video.findMany({ orderBy: { order: 'asc' }, take: 3 }),
  ['home-videos'],
  { tags: ['home-videos'], revalidate: 3600 },
);

/**
 * O 1º vídeo (order asc) vira o player em destaque; os demais ficam
 * empilhados ao lado, como uma fila de "assista a seguir".
 */
export async function VideosSection() {
  const [videos, settings] = await Promise.all([getVideos(), getCachedSiteSettings()]);

  const playable = videos
    .map((video) => ({
      ...video,
      videoId: extractYouTubeId(video.youtubeUrl),
      thumbnailUrl: getYouTubeThumbnailUrl(video.youtubeUrl),
    }))
    .filter((v): v is typeof v & { videoId: string; thumbnailUrl: string } => Boolean(v.videoId && v.thumbnailUrl));

  if (playable.length === 0) return null;

  const [featured, ...rest] = playable;
  if (!featured) return null;

  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Mídia"
          title="Vídeos"
          ctaLabel={settings.youtubeUrl ? 'Acessar canal' : undefined}
          ctaHref={settings.youtubeUrl}
          ctaExternal
        />

        <div className={`grid gap-6 ${rest.length > 0 ? 'sm:grid-cols-[1.5fr_1fr]' : ''}`}>
          <div className="overflow-hidden border-2 border-slate-900 bg-white shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard">
            <YouTubeFacade videoId={featured.videoId} title={featured.title} thumbnailUrl={featured.thumbnailUrl} />
            <p className="border-t-2 border-slate-900 p-4 font-display font-black uppercase leading-tight text-slate-900 sm:p-5">
              {featured.title}
            </p>
          </div>

          {rest.length > 0 && (
            <div className="flex flex-col gap-6">
              {rest.map((video) => (
                <div
                  key={video.id}
                  className="flex-1 overflow-hidden border-2 border-slate-900 bg-white shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard"
                >
                  <YouTubeFacade videoId={video.videoId} title={video.title} thumbnailUrl={video.thumbnailUrl} />
                  <p className="border-t-2 border-slate-900 p-3.5 font-display text-sm font-bold text-slate-800">
                    {video.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
