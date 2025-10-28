'use client';

import LeftSideNav from '@/components/LeftSideNav';

import LeftSideNavMobile from '@/components/LeftSideNavMobile';
import RightSideNav from '@/components/RightSideNav';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useDrawerStore } from '@/stores/useDrawerStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { Menu, PanelLeftClose, PanelRightClose, SquarePen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isLeftSidebarOpen, isRightSidebarOpen, toggleRightSidebar } =
    useSidebarStore();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { isOpen: drawerOpen, close, open } = useDrawerStore();

  const pathname = usePathname();
  const {
    setActiveConversation,
    setShowStartLastMessage,
    setUserMessage,
    setSelectedOption,
  } = useConversationsStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        // Only close if sidebar is open
        if (isRightSidebarOpen) toggleRightSidebar();
      }
    }

    // Attach listener only when sidebar is open
    if (isRightSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRightSidebarOpen, toggleRightSidebar]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header - Mobile only */}
      <header className="bg-secondary text-foreground sticky top-0 z-50 flex items-center justify-between px-4 py-3 md:hidden">
        {/* Left Sidebar Mobile Drawer */}
        <Sheet
          open={drawerOpen}
          onOpenChange={() => (drawerOpen ? close() : open)}
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
            height={26}
            width={26}
          />
        </Link>
        <Button
          onClick={() => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(null);
            router.push('/');
            close();
          }}
          className="flex items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
        >
          <SquarePen className="size-5" />
        </Button>
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
        {pathname === '/workflows' && (
          <div
            ref={sidebarRef}
            className={cn(
              'bg-secondary fixed top-[56px] right-0 z-40 h-[calc(100vh-56px)] shadow-lg transition-all duration-300 ease-in-out md:top-0 md:h-screen',
              isRightSidebarOpen ? 'w-64' : 'w-10',
            )}
          >
            {/* Toggle button */}
            <button
              onClick={toggleRightSidebar}
              className="absolute top-4 -left-4 p-1"
            >
              {isRightSidebarOpen ? (
                <PanelRightClose
                  size={20}
                  className="ml-7 size-6 cursor-pointer p-0.5 text-gray-500 transition-transform duration-300"
                />
              ) : (
                <PanelLeftClose
                  size={20}
                  className="ml-5 size-6 cursor-pointer p-0.5 text-gray-500 transition-transform duration-300"
                />
              )}
            </button>

            {/* Drawer content */}
            <div className="h-full overflow-y-auto p-2 pt-8">
              <RightSideNav isOpen={isRightSidebarOpen} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
