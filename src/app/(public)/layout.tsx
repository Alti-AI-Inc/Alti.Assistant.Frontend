'use client';

import LeftSideNav from '@/components/LeftSideNav';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/useSidebarStore';

export default function PublicLayout({
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
            'bg-secondary sticky top-0 left-0 flex h-screen w-68 flex-col transition-all duration-300 ease-in-out',
            !isLeftSidebarOpen ? 'w-10' : 'w-68',
          )}
        >
          <LeftSideNav />
        </div>
        <main className="bg-background w-full flex-1">{children}</main>
      </div>
    </div>
  );
}
