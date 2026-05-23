'use client';

import { Suspense } from 'react';
import LeftSideNav from '@/components/LeftSideNav';
import LeftSideNavMobile from '@/components/LeftSideNavMobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ✅ Hook must be called inside component
  const { isLeftSidebarOpen } = useSidebarStore();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header - Mobile only */}
      <header className="bg-secondary text-foreground fixed top-0 left-0 z-50 flex w-full items-center justify-between px-4 py-3 md:hidden">
        {/* Mobile Drawer (Sheet) */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="rounded-md p-2">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-secondary w-64">
            <SheetHeader>
              <SheetTitle>
                <Image
                  src="/assets/logo-icon.png"
                  alt="logo"
                  height={30}
                  width={30}
                />
              </SheetTitle>
            </SheetHeader>
            <Suspense fallback={null}>
              <LeftSideNavMobile />
            </Suspense>
          </SheetContent>
        </Sheet>
        <Link href="/">
          <Image
            src="/assets/logo-icon.png"
            alt="logo"
            height={26}
            width={26}
            className="max-lg:-translate-x-5"
          />
        </Link>
        <div /> {/* placeholder for spacing */}
      </header>

      <div className="flex flex-1 pt-[56px] md:pt-0">
        {/* Sidebar - Desktop only */}
        <div
          className={cn(
            'bg-secondary sticky top-0 left-0 hidden h-screen flex-col transition-all duration-300 ease-in-out md:flex',
            !isLeftSidebarOpen ? 'w-10' : 'w-68',
          )}
          style={{ backgroundColor: '#F2F3F5' }}
        >
          <Suspense fallback={null}>
            <LeftSideNav />
          </Suspense>
        </div>

        {/* Main content */}
        <main className="bg-background w-full flex-1">{children}</main>
      </div>
    </div>
  );
}
