'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import DashboardLeftSideNav from './_components/DashboardLeftSideNav';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-black/10 dark:border-zinc-800 flex shrink-0 items-center justify-between px-4 py-3 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="rounded-md p-2">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-white dark:bg-zinc-900 w-64 p-0 border-r border-black/10 dark:border-zinc-800">
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
            <div className="[&>div]:!flex [&>div]:!relative [&>div]:!h-full [&>div]:!w-full">
              <DashboardLeftSideNav />
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/">
          <Image
            src="/assets/logo-icon.png"
            alt="logo"
            height={26}
            width={26}
          />
        </Link>
        <div className="w-10" />
      </header>

      {/* Desktop sidebar */}
      <DashboardLeftSideNav />

      {/* Main content */}
      <div className={cn('w-full md:pl-64')}>
        <main className="h-screen overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
