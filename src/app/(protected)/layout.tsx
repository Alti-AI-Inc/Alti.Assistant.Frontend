'use client';

import LeftSideNav from '@/components/LeftSideNav';

import LeftSideNavMobile from '@/components/LeftSideNavMobile';
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
import { Menu, SquarePen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isLeftSidebarOpen } = useSidebarStore();

  const { isOpen: drawerOpen, close, open } = useDrawerStore();

  const {
    setActiveConversation,
    setShowStartLastMessage,
    setUserMessage,
    setSelectedOption,
  } = useConversationsStore();

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
        <motion.div
          animate={{
            width: isLeftSidebarOpen ? '272px' : '40px',
          }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 30,
          }}
          className="sticky top-0 left-0 hidden h-screen flex-col overflow-hidden sm:hidden md:flex bg-[#F2F3F5] dark:bg-zinc-900 border-r border-black/5 dark:border-zinc-800 transition-colors duration-300"
        >
          <LeftSideNav />
        </motion.div>

        {/* Main content */}
        <main
          className="bg-background w-full flex-1 overflow-y-auto dark:bg-zinc-950 transition-colors duration-300"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
