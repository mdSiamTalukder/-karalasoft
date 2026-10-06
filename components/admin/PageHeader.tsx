import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export function PageHeader({
  title,
  description,
  backHref,
  backLabel,
  actions,
}: {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-8">
      {backHref ? (
        <Link
          href={backHref}
          className="mb-4 inline-flex items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-white"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          {backLabel ?? 'Back'}
        </Link>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="m-0 mb-1.5 text-[30px] leading-tight tracking-[-0.03em] sm:text-[34px]">
            {title}
          </h1>
          {description ? <p className="m-0 text-[15px] text-muted">{description}</p> : null}
        </div>
        {actions}
      </div>
    </header>
  );
}