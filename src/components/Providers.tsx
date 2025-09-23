'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider, useSession } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

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
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const publicPaths = ['/login', '/register'];

  if (publicPaths.includes(pathname)) {
    if (session?.accessToken && !session?.isTokenExpired) {
      // already logged in -> redirect home
      router.push('/');
      return null;
    }
    // no token or expired -> allow them to see login/register
    return <>{children}</>;
  }

  // CASE 2: User is on a protected page
  if (!session?.accessToken || session?.isTokenExpired) {
    router.push('/login');
    return null;
  }

  return <>{children}</>;
}
