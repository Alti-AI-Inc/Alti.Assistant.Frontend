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
import { useRef, useEffect } from 'react';
import { useDrawerStore } from '@/stores/useDrawerStore';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { isLeftSidebarOpen } = useSidebarStore();

  // Drawer state for workflows
  // const [drawerOpen, setDrawerOpen] = useState(false);
  const { isOpen: drawerOpen, toggle, close } = useDrawerStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Swipe left to close drawer
  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;

    let startX = 0;
    const handleTouchStart = (e: TouchEvent) => (startX = e.touches[0].clientX);
    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) close(); // use store
    };

    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchend', handleTouchEnd);
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [close]);

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
          <Image
            src="/assets/logo-icon.png"
            alt="logo"
            height={20}
            width={20}
          />
        </Link>

        {/* Right Sidebar (mobile) only when /workflows */}
        {pathname === '/workflows' ? (
          <button onClick={toggle} className="rounded-md p-2">
            {/* <Menu className="h-6 w-6" /> */}
          </button>
        ) : (
          <div />
        )}
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

        {/* Workflow Drawer - Desktop & Mobile */}
        {/* Workflow Drawer - Desktop & Mobile */}
        {pathname === '/workflows' && (
          <div
            ref={drawerRef}
            className={cn(
              'bg-secondary fixed top-[56px] right-0 z-40 h-[calc(100vh-56px)] shadow-lg transition-all duration-300 ease-in-out md:top-0 md:h-screen',
              drawerOpen ? 'w-64' : 'w-10',
            )}
          >
            {/* Toggle button */}
            <button onClick={toggle} className="absolute top-4 -left-4 p-1">
              {drawerOpen ? (
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
              <RightSideNav isOpen={drawerOpen} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
