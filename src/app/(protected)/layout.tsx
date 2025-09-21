'use client';

import LeftSideNav from '@/components/LeftSideNav';
import RightSideNav from '@/components/RightSideNav';
import { Menu } from 'lucide-react';
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

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { isLeftSidebarOpen, isRightSidebarOpen } = useSidebarStore();

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
                <Image
                  src="/assets/logo-icon.png"
                  alt="logo"
                  height={30}
                  width={30}
                />
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

        {/* Right Sidebar (mobile) only when /workflows */}
        {pathname === '/workflows' ? (
          <Sheet>
            <SheetTrigger asChild>
              <button className="rounded-md p-2">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-secondary w-64 p-0">
              <SheetHeader>
                <SheetTitle>Workflow Tools</SheetTitle>
              </SheetHeader>
              <RightSideNav />
            </SheetContent>
          </Sheet>
        ) : (
          <div /> 
        )}
      </header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Left Sidebar - Desktop */}
        <div
          className={cn(
            'bg-secondary sticky top-0 left-0 hidden h-screen flex-col transition-all duration-300 ease-in-out md:flex',
            isLeftSidebarOpen ? 'w-68' : 'w-16',
          )}
        >
          <LeftSideNav />
        </div>

        {/* Main content */}
        <main className="bg-background w-full flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Right Sidebar - Desktop only when /workflows */}
        {pathname === '/workflows' && (
          <div
            className={cn(
              'bg-secondary sticky top-0 right-0 hidden h-screen flex-col transition-all duration-300 ease-in-out md:flex',
              isRightSidebarOpen ? 'w-68' : 'w-16',
            )}
          >
            <RightSideNav />
          </div>
        )}
      </div>
    </div>
  );
}
