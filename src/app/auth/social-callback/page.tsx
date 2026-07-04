'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

/**
 * This page runs inside the Google OAuth popup window.
 * It receives the token from the backend redirect, posts it
 * to the parent window via postMessage, then closes itself.
 * The parent (AuthModal) handles the signIn call — no page navigation.
 */
function PopupCallbackHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (window.opener) {
      // Running inside popup — relay to parent and close
      window.opener.postMessage(
        { type: 'alti-google-auth', token, error },
        window.location.origin,
      );
      window.close();
    } else {
      // Fallback: not in a popup (e.g. user opened URL directly)
      window.location.href = '/';
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
    </div>
  );
}

export default function SocialCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
        </div>
      }
    >
      <PopupCallbackHandler />
    </Suspense>
  );
}
