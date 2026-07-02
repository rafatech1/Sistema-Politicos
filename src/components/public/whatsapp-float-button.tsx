import { FaWhatsapp } from 'react-icons/fa6';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';

export async function WhatsAppFloatButton() {
  const settings = await getCachedSiteSettings();
  if (!settings.whatsappNumber) return null;

  const digits = settings.whatsappNumber.replace(/\D/g, '');
  const message = settings.whatsappDefaultMessage || `Olá! Quero saber mais sobre a campanha de ${settings.candidateName}.`;
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}
