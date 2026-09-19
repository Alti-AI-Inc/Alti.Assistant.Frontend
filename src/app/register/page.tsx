'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RegisterRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams?.get('code');

  useEffect(() => {
    if (code) {
      router.replace(`/?auth=register&code=${code}`);
    } else {
      router.replace('/?auth=register');
    }
  }, [router, code]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black" />
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-black" />}>
      <RegisterRedirect />
    </Suspense>
  );
}
