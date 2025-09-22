'use client';

import LeftSideNav from '@/components/LeftSideNav';
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

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header - Mobile only */}
      <header className="bg-secondary text-foreground fixed top-0 left-0 z-50 flex w-full items-center justify-between px-4 py-3 md:hidden ">
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
            <LeftSideNavMobile />
          </SheetContent>
        </Sheet>

        <Link href="/">
          <Image src="/assets/logo-icon.png" alt="logo" height={20} width={20} />
        </Link>

        <div /> {/* placeholder for spacing */}
      </header>

      <div className="flex flex-1 pt-[56px] md:pt-0">
        {/* Sidebar - Desktop only */}
        <div className="bg-secondary sticky top-0 left-0 hidden h-screen w-68 flex-col md:flex">
          <LeftSideNav />
        </div>

        {/* Main content */}
        <main className="bg-background w-full flex-1">{children}</main>
      </div>
    </div>
  );
}
