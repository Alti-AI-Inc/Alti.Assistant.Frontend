'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider, useSession } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { TenantProvider } from '@/contexts/TenantContext';
import { useContextSwitch } from '@/hooks/useContextSwitch';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <TenantProvider>
            <AuthWatcher>{children}</AuthWatcher>
          </TenantProvider>
        </SessionProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function AuthWatcher({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const publicPaths = useMemo(() => ['/login', '/register'], []);

  // Listen for context switches and clear stores
  useContextSwitch();

  useEffect(() => {
    if (publicPaths.includes(pathname)) {
      return;
    }

    if (session?.accessToken && session?.isTokenExpired) {
      console.log('isTokenExpired', session?.isTokenExpired);
      router.push('/login');
    }
  }, [pathname, session, status, router, publicPaths]);

  return <>{children}</>;
}
