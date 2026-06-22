'use client';

import { Suspense } from 'react';
import LeftSideNav from '@/components/LeftSideNav';
import LeftSideNavMobile from '@/components/LeftSideNavMobile';
import AdminSecondarySidebar from '@/components/sidebars/AdminSecondarySidebar';
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
import { useSession } from 'next-auth/react';

export default function ProtectedLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === 'super_admin';
  const { isLeftSidebarOpen } = useSidebarStore();

  const { isOpen: drawerOpen, close, open } = useDrawerStore();

  const {
    setActiveConversation,
    setShowStartLastMessage,
    setUserMessage,
    setSelectedOption,
  } = useConversationsStore();

  return (
    <div className="flex h-screen h-[100dvh] flex-col overflow-hidden">
      {/* Header - Mobile only */}
      <header className="bg-white dark:bg-zinc-900 border-b border-black/10 dark:border-zinc-800 text-foreground sticky top-0 z-50 flex shrink-0 items-center justify-between px-4 py-3 md:hidden">
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
            <Suspense fallback={null}>
              <LeftSideNavMobile />
            </Suspense>
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
        {isSuperAdmin ? (
          <div className="w-10" />
        ) : (
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
        )}
      </header>

      {/* Body */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar - Desktop */}
        {!isSuperAdmin && (
          <div
            className={cn(
              'sticky top-0 left-0 hidden h-full flex-col transition-all duration-300 ease-in-out sm:hidden md:flex border-r border-black/10 shrink-0 z-20',
              isLeftSidebarOpen ? 'w-76' : 'w-10',
            )}
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <Suspense fallback={null}>
              <LeftSideNav />
            </Suspense>
          </div>
        )}

        {/* Administrative Secondary Left Sidebar */}
        <Suspense fallback={null}>
          <AdminSecondarySidebar />
        </Suspense>

        {/* Main content */}
        <main
          className="bg-background w-full flex-1 min-w-0 overflow-hidden flex flex-col"
          style={{ backgroundColor: '#F5F5F7' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
