'use client';

import { Suspense } from 'react';
import ChangePassword from '@/components/ChangePassword';
import { KeyRound } from 'lucide-react';

const ChangePasswordContent = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F5F5F7] dark:bg-gray-955">
      {/* Top Navbar / Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-955 justify-between">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Change Password
        </h1>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6 flex justify-center">
        <div className="w-full max-w-md space-y-6">
          {/* Card description */}
          <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                <KeyRound className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Update Password</h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Maintain account security by regularly changing your password. Enter your current password and your new password below.
            </p>
          </div>

          {/* Form wrapper */}
          <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-2xl p-6 shadow-xs">
            <ChangePassword />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<div className="flex-1 h-full flex items-center justify-center text-sm text-gray-555">Loading change password form...</div>}>
      <ChangePasswordContent />
    </Suspense>
  );
}
