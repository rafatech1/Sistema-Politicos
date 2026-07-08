import type { IconType } from 'react-icons';
import {
  FaGaugeHigh,
  FaNewspaper,
  FaCalendarDays,
  FaTags,
  FaLightbulb,
  FaLayerGroup,
  FaScaleBalanced,
  FaMoneyBillWave,
  FaUserGroup,
  FaClockRotateLeft,
  FaAward,
  FaHeart,
  FaYoutube,
  FaInstagram,
  FaInbox,
  FaGear,
  FaUsers,
  FaClipboardList,
} from 'react-icons/fa6';

// Espelha os hrefs+ícones de admin-shell.tsx (fonte da navegação da sidebar),
// mas como uma lista plana sem rótulo/permissão — só para o AdminPageHeader
// resolver qual ícone mostrar a partir da rota atual, sem precisar que cada
// uma das ~40 páginas passe o ícone manualmente.
const ADMIN_NAV_ICONS: { href: string; icon: IconType }[] = [
  { href: '/admin/noticias', icon: FaNewspaper },
  { href: '/admin/agenda', icon: FaCalendarDays },
  { href: '/admin/categorias', icon: FaTags },
  { href: '/admin/propostas', icon: FaLightbulb },
  { href: '/admin/eixos-tematicos', icon: FaLayerGroup },
  { href: '/admin/projetos-de-lei', icon: FaScaleBalanced },
  { href: '/admin/emendas', icon: FaMoneyBillWave },
  { href: '/admin/comissoes', icon: FaUserGroup },
  { href: '/admin/biografia', icon: FaClockRotateLeft },
  { href: '/admin/badges', icon: FaAward },
  { href: '/admin/crencas', icon: FaHeart },
  { href: '/admin/videos', icon: FaYoutube },
  { href: '/admin/instagram', icon: FaInstagram },
  { href: '/admin/leads', icon: FaInbox },
  { href: '/admin/settings', icon: FaGear },
  { href: '/admin/users', icon: FaUsers },
  { href: '/admin/auditoria', icon: FaClipboardList },
  { href: '/admin', icon: FaGaugeHigh },
];

/** '/admin' (dashboard) só bate exato; as demais usam prefixo (cobre /novo e /[id]). */
export function getAdminNavIcon(pathname: string): IconType | null {
  const match = ADMIN_NAV_ICONS.find((item) =>
    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href),
  );
  return match?.icon ?? null;
}
