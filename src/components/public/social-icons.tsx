import type { IconType } from 'react-icons';
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaTiktok,
  FaXTwitter,
  FaTelegram,
  FaLinkedinIn,
  FaWhatsapp,
  FaVideo,
} from 'react-icons/fa6';

// Kwai não tem um ícone de marca nos sets disponíveis no react-icons; usamos
// um ícone genérico de vídeo como fallback.
const SiKwai = FaVideo;

export interface SocialLinksData {
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  youtubeUrl?: string | null;
  tiktokUrl?: string | null;
  linkedinUrl?: string | null;
  telegramUrl?: string | null;
  kwaiUrl?: string | null;
  whatsappNumber?: string | null;
  whatsappDefaultMessage?: string | null;
}

const SOCIAL_ENTRIES: Array<{
  key: keyof SocialLinksData;
  icon: IconType;
  label: string;
  toHref: (value: string) => string;
}> = [
  { key: 'instagramUrl', icon: FaInstagram, label: 'Instagram', toHref: (v) => v },
  { key: 'facebookUrl', icon: FaFacebookF, label: 'Facebook', toHref: (v) => v },
  { key: 'youtubeUrl', icon: FaYoutube, label: 'YouTube', toHref: (v) => v },
  { key: 'tiktokUrl', icon: FaTiktok, label: 'TikTok', toHref: (v) => v },
  { key: 'twitterUrl', icon: FaXTwitter, label: 'X (Twitter)', toHref: (v) => v },
  { key: 'linkedinUrl', icon: FaLinkedinIn, label: 'LinkedIn', toHref: (v) => v },
  { key: 'telegramUrl', icon: FaTelegram, label: 'Telegram', toHref: (v) => v },
  { key: 'kwaiUrl', icon: SiKwai, label: 'Kwai', toHref: (v) => v },
  {
    key: 'whatsappNumber',
    icon: FaWhatsapp,
    label: 'WhatsApp',
    toHref: (v) => `https://wa.me/${v.replace(/\D/g, '')}`,
  },
];

export function SocialIcons({
  data,
  className,
  iconClassName,
}: {
  data: SocialLinksData;
  className?: string;
  iconClassName?: string;
}) {
  const active = SOCIAL_ENTRIES.filter((entry) => data[entry.key]);
  if (active.length === 0) return null;

  return (
    <div className={className ?? 'flex items-center gap-3'}>
      {active.map(({ key, icon: Icon, label, toHref }) => (
        <a
          key={key}
          href={toHref(data[key] as string)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={
            iconClassName ??
            'flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition-all hover:-translate-y-0.5 hover:opacity-80'
          }
        >
          <Icon size={16} />
        </a>
      ))}
    </div>
  );
}
