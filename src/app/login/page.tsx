'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/?auth=login');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black" />
  );
}
