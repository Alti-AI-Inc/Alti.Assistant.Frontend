'use client';

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
import { useDrawerStore } from '@/stores/useDrawerStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLeftSidebarOpen } = useSidebarStore();
  const { isOpen: isDrawerOpen, close, open } = useDrawerStore();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header - Mobile only */}
      <header className="bg-secondary text-foreground sticky top-0 z-50 flex items-center justify-between px-4 py-3 md:hidden">
        {/* Left Sidebar Mobile Drawer */}
        <Sheet
          open={isDrawerOpen}
          onOpenChange={() => (isDrawerOpen ? close() : open)}
        >
          <SheetTrigger asChild onClick={open}>
            <button className="rounded-md p-2">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-secondary w-64 p-0">
            <SheetHeader>
              <SheetTitle>
                <Link href="/">
                  <Image
                    src="/assets/logo-icon.png"
                    alt="logo"
                    height={30}
                    width={30}
                  />
                </Link>
              </SheetTitle>
            </SheetHeader>
            <LeftSideNavMobile />
          </SheetContent>
        </Sheet>

        {/* Center logo */}
        <Link href="/">
          <Image
            src="/assets/logo-icon.png"
            alt="logo"
            height={20}
            width={20}
          />
        </Link>
      </header>

      {/* Body */}
      <div className="relative flex flex-1">
        {/* Left Sidebar - Desktop */}
        <div
          className={cn(
            'bg-secondary sticky top-0 left-0 hidden h-screen flex-col transition-all duration-300 ease-in-out sm:hidden md:flex',
            isLeftSidebarOpen ? 'w-68' : 'w-10',
          )}
        >
          <LeftSideNav />
        </div>

        {/* Main content */}
        <main className="bg-background w-full flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
