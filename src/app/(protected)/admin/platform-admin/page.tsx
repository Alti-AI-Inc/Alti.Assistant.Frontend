'use client';

import Image from 'next/image';

export default function PlatformAdminLandingPage() {
  return (
    <div className="h-full flex flex-col bg-[#e1e1e1] dark:bg-gray-955 overflow-hidden">
      {/* Dynamic Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-950">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Platform Admin
        </h1>
      </div>

      {/* Main Centered Logo */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 select-none pointer-events-none">
        <Image
          src="/assets/logo-icon.png"
          alt="Inso AI Logo"
          width={120}
          height={120}
          className="opacity-15 grayscale contrast-50 dark:opacity-10 dark:invert transition-all duration-300"
        />
      </div>
    </div>
  );
}
