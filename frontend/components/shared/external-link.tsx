import { ExternalLink as ExternalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  showIcon?: boolean;
}

/**
 * Safe external link. Always sets rel="noopener noreferrer" to prevent
 * reverse-tabnabbing (OWASP) and referrer leakage. Use this for any
 * user-supplied or off-origin URL instead of a raw <a>/<Link target="_blank">.
 */
export function ExternalLink({
  href,
  children,
  className,
  showIcon,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('inline-flex items-center gap-1', className)}
      {...props}
    >
      {children}
      {showIcon && <ExternalIcon className="h-3.5 w-3.5" />}
    </a>
  );
}
