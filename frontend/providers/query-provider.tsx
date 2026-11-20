'use client';

import { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
  QueryCache,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'sonner';
import { normalizeError } from '@/lib/api-error';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            gcTime: 5 * 60_000,
            retry: (failureCount, error) => {
              const { status } = normalizeError(error);
              // Don't retry client errors (auth, validation, not found).
              if (status && status >= 400 && status < 500) return false;
              return failureCount < 2;
            },
            refetchOnWindowFocus: false,
          },
          mutations: { retry: 0 },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            const { status, message } = normalizeError(error);
            // 401s are handled by the axios refresh flow; stay quiet here.
            if (status !== 401) toast.error(message);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            const { message } = normalizeError(error);
            toast.error(message);
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}
