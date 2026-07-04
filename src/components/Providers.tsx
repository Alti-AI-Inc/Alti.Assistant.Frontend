'use client';

import { TenantProvider } from '@/contexts/TenantContext';
import { useContextSwitch } from '@/hooks/useContextSwitch';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { ThemeProvider } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import SecretThemeTrigger from '@/components/SecretThemeTrigger';

const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then(
      mod => mod.ReactQueryDevtools,
    ),
  { ssr: false },
);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Graceful recovery for Next.js Server Action / chunk loading mismatches during deployment
    const handleGlobalError = (event: ErrorEvent) => {
      const message = event.message || '';
      const isChunkLoadError =
        message.includes('Failed to fetch dynamically imported module') ||
        message.includes('Loading chunk') ||
        message.includes('Failed to find Server Action');

      if (isChunkLoadError) {
        console.warn(
          'Inso AI Shield: Detected chunk loading or Server Action mismatch. Performing automatic recovery refresh...',
        );
        window.location.reload();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason || '';
      const reasonStr =
        typeof reason === 'string'
          ? reason
          : reason.message || String(reason);

      const isChunkLoadError =
        reasonStr.includes('Failed to fetch dynamically imported module') ||
        reasonStr.includes('Loading chunk') ||
        reasonStr.includes('Failed to find Server Action');

      if (isChunkLoadError) {
        console.warn(
          'Inso AI Shield: Detected unhandled chunk/Server Action rejection. Performing automatic recovery refresh...',
        );
        window.location.reload();
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      themes={['light', 'dark', 'hotdog']}
    >
      <SecretThemeTrigger />
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
  const publicPaths = useMemo(() => ['/', '/accept-invite', '/login', '/register'], []);

  // Listen for context switches and clear stores
  useContextSwitch();

  useEffect(() => {
    if (publicPaths.includes(pathname)) {
      return;
    }

    if (session?.accessToken && session?.isTokenExpired) {
      console.log('isTokenExpired', session?.isTokenExpired);
      signOut({ redirect: true, callbackUrl: '/' });
    }
  }, [pathname, session, status, router, publicPaths]);

  return <>{children}</>;
}
