import Link from 'next/link';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/constants';

/** CareerSync mark — a stylised suspension bridge (the "bridge" between
 *  students and internships). Inherits color via `currentColor`. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* deck */}
      <path d="M2 16h20" />
      {/* towers */}
      <path d="M8 16V6" />
      <path d="M16 16V6" />
      {/* draped cable */}
      <path d="M2 13Q5 6 8 6Q11 6 12 11Q13 6 16 6Q19 6 22 13" />
    </svg>
  );
}

export function Brand({
  href = '/',
  className,
  collapsed,
}: {
  href?: string;
  className?: string;
  collapsed?: boolean;
}) {
  return (
    <Link href={href} className={cn('flex items-center gap-2 font-bold', className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-indigo-500 text-primary-foreground shadow-sm">
        <BrandMark className="h-5 w-5" />
      </span>
      {!collapsed && (
        <span className="text-lg tracking-tight">
          Career<span className="text-primary">Sync</span>
        </span>
      )}
      <span className="sr-only">{APP_NAME}</span>
    </Link>
  );
}
