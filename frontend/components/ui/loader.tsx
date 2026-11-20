import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Loader({
  label,
  className,
  size = 24,
}: {
  label?: string;
  className?: string;
  size?: number;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-8', className)}>
      <Loader2 className="animate-spin text-primary" style={{ width: size, height: size }} />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-4 w-4 animate-spin', className)} />;
}
