import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';

export function AdminPageHeader({
  title,
  description,
  backHref,
}: {
  title: string;
  description?: string;
  backHref?: string;
}) {
  return (
    <div className="space-y-1">
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-primary"
        >
          <FaArrowLeft size={12} />
          Voltar
        </Link>
      )}
      <h1 className="font-display text-2xl font-semibold text-slate-900">{title}</h1>
      {description && <p className="text-sm text-slate-500">{description}</p>}
    </div>
  );
}
