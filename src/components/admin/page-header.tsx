'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';
import { getAdminNavIcon } from '@/lib/admin/nav-icons';

export function AdminPageHeader({
  title,
  description,
  backHref,
}: {
  title: string;
  description?: string;
  backHref?: string;
}) {
  const pathname = usePathname();
  const Icon = getAdminNavIcon(pathname);

  return (
    <div className="space-y-2 border-b border-slate-200 pb-5">
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-primary"
        >
          <FaArrowLeft size={12} />
          Voltar
        </Link>
      )}
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
            <Icon size={17} />
          </span>
        )}
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-900">{title}</h1>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      </div>
    </div>
  );
}
