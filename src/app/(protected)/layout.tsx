'use client';

import LeftSideNav from '@/components/LeftSideNav';
import RightSideNav from '@/components/RightSideNav';
import { Menu, PanelLeftClose, PanelRightClose } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import LeftSideNavMobile from '@/components/LeftSideNavMobile';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { isLeftSidebarOpen } = useSidebarStore();

  // Drawer state for workflows
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Swipe left to close drawer
  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;

    let startX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) {
        setDrawerOpen(false);
      }
    };

    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header - Mobile only */}
      <header className="bg-secondary text-foreground sticky top-0 z-50 flex items-center justify-between px-4 py-3 md:hidden">
        {/* Left Sidebar Mobile Drawer */}
        <Sheet>
          <SheetTrigger asChild>
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
          <Image src="/assets/logo-icon.png" alt="logo" height={20} width={20} />
        </Link>

        {/* Right Sidebar (mobile) only when /workflows */}
        {pathname === '/workflows' ? (
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="rounded-md p-2"
          >
            {/* <Menu className="h-6 w-6" /> */}
          </button>
        ) : (
          <div />
        )}
      </header>

      {/* Body */}
      <div className="flex flex-1 relative">
        {/* Left Sidebar - Desktop */}
        <div
          className={cn(
            'bg-secondary sticky top-0 left-0 sm:hidden h-screen flex-col transition-all duration-300 ease-in-out hidden md:flex',
            isLeftSidebarOpen ? 'w-68' : 'w-16',
          )}
        >
          <LeftSideNav />
        </div>

        {/* Main content */}
        <main className="bg-background w-full flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Workflow Drawer - Desktop & Mobile */}
        {pathname === '/workflows' && (
          <div
            ref={drawerRef}
            className={cn(
              'absolute md:fixed top-[0px] md:top-0 right-0 h-[calc(100vh-56px)] md:h-screen bg-secondary shadow-lg transition-all duration-300 ease-in-out z-40',
              drawerOpen ? 'w-64' : 'w-10'
            )}
          >
            {/* Toggle button */}
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="absolute -left-4 top-4 p-1"
            >
              {drawerOpen ? (
                <PanelRightClose
                  size={20}
                  className="size-6 cursor-pointer p-0.5 text-gray-500 transition-transform duration-300"
                />
              ) : (
                <PanelLeftClose
                  size={20}
                  className="size-6 cursor-pointer p-0.5 text-gray-500 transition-transform duration-300"
                />
              )}
            </button>

            {/* Drawer content */}
            <div className="overflow-y-auto h-full p-2 pt-8">
              <RightSideNav isOpen={drawerOpen} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
