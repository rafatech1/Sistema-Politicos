import { prisma } from '@/lib/prisma';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { extractYouTubeId, getYouTubeThumbnailUrl } from '@/lib/utils/youtube';
import { YouTubeFacade } from '@/components/public/youtube-facade';
import { SectionHeading } from '@/components/public/section-heading';

export async function VideosSection() {
  const [videos, settings] = await Promise.all([
    prisma.video.findMany({ orderBy: { order: 'asc' }, take: 3 }),
    getCachedSiteSettings(),
  ]);
  if (videos.length === 0) return null;

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
        <div className="grid gap-6 sm:grid-cols-3">
          {videos.map((video) => {
            const videoId = extractYouTubeId(video.youtubeUrl);
            const thumbnailUrl = getYouTubeThumbnailUrl(video.youtubeUrl);
            if (!videoId || !thumbnailUrl) return null;

            return (
              <div
                key={video.id}
                className="overflow-hidden border-2 border-slate-900 bg-white shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard"
              >
                <YouTubeFacade videoId={videoId} title={video.title} thumbnailUrl={thumbnailUrl} />
                <p className="border-t-2 border-slate-900 p-4 font-display text-sm font-bold text-slate-800">
                  {video.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
