'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services';
import { useAuthStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';
import { tokenStore } from '@/lib/token';
import { Loader } from '@/components/ui/loader';

// Bootstraps the session on first load: tries to refresh the access token from
// the httpOnly cookie, then hydrates the current user. Also wires the global
// "unauthorized" handler so an unrecoverable 401 logs the user out cleanly.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const reset = useAuthStore((s) => s.reset);
  const resetUser = useUserStore((s) => s.reset);
  const [booting, setBooting] = useState(true);
  const ran = useRef(false);

  useEffect(() => {
    tokenStore.setUnauthorizedHandler(() => {
      reset();
      resetUser();
      router.replace('/login');
    });
  }, [reset, resetUser, router]);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const token = await authService.refresh();
        if (token) {
          setToken(token);
          const { user } = await authService.me();
          setUser(user);
        } else {
          reset();
        }
      } catch {
        reset();
      } finally {
        setBooting(false);
      }
    })();
  }, [setToken, setUser, reset]);

  if (booting) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader label="Starting CareerSync…" />
      </div>
    );
  }

  return <>{children}</>;
}
