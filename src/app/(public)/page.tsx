import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { resolveHomeSections, type HomeSectionKey } from '@/lib/home-sections';
import { HeroSection } from '@/components/public/home/hero-section';
import { NewsSection } from '@/components/public/home/news-section';
import { HighlightsSection } from '@/components/public/home/highlights-section';
import { AboutSection } from '@/components/public/home/about-section';
import { BeliefsSection } from '@/components/public/home/beliefs-section';
import { VideosSection } from '@/components/public/home/videos-section';
import { InstagramSection } from '@/components/public/home/instagram-section';
import { OfficeSection } from '@/components/public/home/office-section';
import { ContactSection } from '@/components/public/home/contact-section';

function renderSection(key: HomeSectionKey, socialData: Parameters<typeof ContactSection>[0]['socialData']) {
  switch (key) {
    case 'NEWS':
      return <NewsSection key="news" />;
    case 'HIGHLIGHTS':
      return <HighlightsSection key="highlights" />;
    case 'ABOUT':
      return <AboutSection key="about" />;
    case 'BELIEFS':
      return <BeliefsSection key="beliefs" />;
    case 'VIDEOS':
      return <VideosSection key="videos" />;
    case 'INSTAGRAM':
      return <InstagramSection key="instagram" />;
    case 'OFFICE':
      return <OfficeSection key="office" />;
    case 'CONTACT':
      return <ContactSection key="contact" socialData={socialData} />;
    case 'HERO':
    default:
      return null;
  }
}

export default async function HomePage() {
  const settings = await getCachedSiteSettings();
  const sections = resolveHomeSections(settings.homeSections);

  const heroEnabled = sections.find((s) => s.key === 'HERO')?.enabled ?? true;
  const restSections = sections.filter((s) => s.key !== 'HERO' && s.enabled);

  const socialData = {
    facebookUrl: settings.facebookUrl,
    instagramUrl: settings.instagramUrl,
    twitterUrl: settings.twitterUrl,
    youtubeUrl: settings.youtubeUrl,
    tiktokUrl: settings.tiktokUrl,
    linkedinUrl: settings.linkedinUrl,
    telegramUrl: settings.telegramUrl,
    kwaiUrl: settings.kwaiUrl,
    whatsappNumber: settings.whatsappNumber,
    whatsappDefaultMessage: settings.whatsappDefaultMessage,
  };

  return (
    <>
      {heroEnabled && <HeroSection />}
      <div id="seguinte">{restSections.map((section) => renderSection(section.key, socialData))}</div>
    </>
  );
}
