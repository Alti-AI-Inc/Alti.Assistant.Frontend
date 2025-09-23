'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider, useSession } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

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
          <AuthWatcher>{children}</AuthWatcher>
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

  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (status === 'loading') return; // wait until session is resolved

    if (publicPaths.includes(pathname)) {
      if (session?.accessToken && !session?.isTokenExpired) {
        setRedirecting(true);
        router.push('/');
      }
      return;
    }

    if (!session?.accessToken || session?.isTokenExpired) {
      setRedirecting(true);
      router.push('/login');
    }
  }, [pathname, session, status, router, publicPaths]);

  if (status === 'loading' || redirecting) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
