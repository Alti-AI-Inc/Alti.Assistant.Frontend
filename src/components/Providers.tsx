'use client';

import { TenantProvider } from '@/contexts/TenantContext';
import { useContextSwitch } from '@/hooks/useContextSwitch';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { ThemeProvider } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then(
      mod => mod.ReactQueryDevtools,
    ),
  { ssr: false },
);

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
        {process.env.NODE_ENV === 'development' ? (
          <ReactQueryDevtools initialIsOpen={false} />
        ) : null}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function AuthWatcher({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const publicPaths = useMemo(() => ['/', '/accept-invite'], []);

  // Listen for context switches and clear stores
  useContextSwitch();

  useEffect(() => {
    if (publicPaths.includes(pathname)) {
      return;
    }

    if (session?.accessToken && session?.isTokenExpired) {
      console.log('isTokenExpired', session?.isTokenExpired);
      router.push('/');
    }
  }, [pathname, session, status, router, publicPaths]);

  return <>{children}</>;
}
