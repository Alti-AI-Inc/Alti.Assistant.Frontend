'use client';

// import LeftSideNav from '@/components/LeftSideNav';
import RightSideNav from '@/components/RightSideNav';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import LeftSideNavMobile from '@/components/LeftSideNavMobile';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { isLeftSidebarOpen, isRightSidebarOpen } = useSidebarStore();

  // Local state for mobile toggle
  const [isMobileLeftOpen, setMobileLeftOpen] = useState(false);
  const [isMobileRightOpen, setMobileRightOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header - Mobile only */}
      <header className="bg-secondary text-foreground flex items-center justify-between px-4 py-3 md:hidden">
        <button
          className="rounded-md p-2"
          onClick={() => setMobileLeftOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        {pathname === '/workflows' ? (
          <button
            className="rounded-md p-2"
            onClick={() => setMobileRightOpen(true)}
          >
            <Menu className="h-6 w-6 rotate-180" />
          </button>
        ) : (
          <div /> // spacer
        )}
      </header>

      <div className="flex flex-1">
        {/* Left Sidebar - Desktop */}
        <div
          className={cn(
            'bg-secondary sticky top-0 left-0 hidden h-screen flex-none flex-col transition-all duration-300 ease-in-out md:flex',
            !isLeftSidebarOpen ? 'w-10' : 'w-68',
          )}
        >
          <LeftSideNavMobile />
        </div>

        {/* Left Sidebar - Mobile */}
        <div
          className={cn(
            'bg-secondary fixed top-0 left-0 z-40 h-screen w-64 transform transition-transform duration-300 ease-in-out md:hidden',
            isMobileLeftOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <LeftSideNavMobile />
        </div>
        {isMobileLeftOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setMobileLeftOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="bg-background w-full flex-1">{children}</main>

        {/* Right Sidebar - Desktop (only for workflows) */}
        {pathname === '/workflows' && (
          <div
            className={cn(
              'bg-secondary sticky top-0 right-0 hidden h-screen flex-none flex-col transition-all duration-300 ease-in-out md:flex',
              !isRightSidebarOpen ? 'w-10' : 'w-68',
            )}
          >
            <RightSideNav />
          </div>
        )}

        {/* Right Sidebar - Mobile (only for workflows) */}
        {pathname === '/workflows' && (
          <>
            <div
              className={cn(
                'bg-secondary fixed top-0 right-0 z-40 h-screen w-64 transform transition-transform duration-300 ease-in-out md:hidden',
                isMobileRightOpen ? 'translate-x-0' : 'translate-x-full',
              )}
            >
              <RightSideNav />
            </div>
            {isMobileRightOpen && (
              <div
                className="fixed inset-0 z-30 bg-black/50 md:hidden"
                onClick={() => setMobileRightOpen(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
