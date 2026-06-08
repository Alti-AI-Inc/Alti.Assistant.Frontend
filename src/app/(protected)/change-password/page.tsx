'use client';

import { Suspense } from 'react';
import ChangePassword from '@/components/ChangePassword';

const ChangePasswordContent = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
      {/* Main Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
        <ChangePassword />
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
