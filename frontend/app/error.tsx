'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Route-segment error boundary. Catches render/runtime errors in any nested
// page and offers recovery without a full reload.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this should report to an error-monitoring service
    // (Sentry/Datadog). Kept as a single sink so wiring is one line.
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Route error boundary:', error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="max-w-sm text-muted-foreground">
        An unexpected error occurred. You can try again or head back home.
        {error.digest && (
          <span className="mt-2 block text-xs text-muted-foreground/70">
            Ref: {error.digest}
          </span>
        )}
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>
          <RotateCw className="mr-1 h-4 w-4" /> Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-1 h-4 w-4" /> Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
