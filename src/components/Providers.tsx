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
