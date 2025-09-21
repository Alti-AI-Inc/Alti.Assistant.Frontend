'use client';

import LeftSideNav from '@/components/LeftSideNav';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/useSidebarStore';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLeftSidebarOpen } = useSidebarStore();
  return (
    <div>
      <div className="flex flex-wrap">
        <div
          className={cn(
            'bg-secondary sticky top-0 left-0 flex h-screen w-68 flex-none flex-col transition-all duration-300 ease-in-out',
            !isLeftSidebarOpen ? 'w-10' : 'w-68',
          )}
        >
          <LeftSideNav />
        </div>
        <main className="bg-background w-full flex-1">{children}</main>
        {/* {pathname === '/workflows' && (
          <div
            className={cn(
              'bg-secondary sticky top-0 right-0 flex h-screen w-68 flex-none flex-col transition-all duration-300 ease-in-out',
              !isRightSidebarOpen ? 'w-10' : 'w-68',
            )}
          >
            <RightSideNav />
          </div>
        )} */}
      </div>
    </div>
  );
}
