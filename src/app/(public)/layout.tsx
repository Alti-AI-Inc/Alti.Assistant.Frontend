'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import LeftSideNav from '@/components/LeftSideNav';
import { Menu } from 'lucide-react';
import LeftSideNavMobile from '@/components/LeftSideNavMobile';
import Image from 'next/image';
import Link from 'next/link';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header - Mobile only */}
      <header className="bg-secondary text-foreground flex items-center justify-between px-4 py-3 md:hidden">
        <button
          className="rounded-md p-2"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link href="/">
          <Image
            src="/assets/logo-icon.png"
            alt="logo"
            height={20}
            width={20}
          />
        </Link>
        <div /> {/* placeholder for spacing */}
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <div className="bg-secondary sticky top-0 left-0 hidden h-screen w-68 flex-col md:flex">
          <LeftSideNav />
        </div>

        {/* Sidebar - Mobile */}
        <div
          className={cn(
            'bg-secondary fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out md:hidden',
            isMobileSidebarOpen
              ? 'w-64 translate-x-0'
              : 'w-64 -translate-x-full',
          )}
        >
          <LeftSideNavMobile />
        </div>

        {/* Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="bg-background w-full flex-1">{children}</main>
      </div>
    </div>
  );
}
