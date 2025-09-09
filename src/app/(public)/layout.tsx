'use client';

import SideNav from '@/components/side-nav';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [hideSidebar, toggleSidebar] = useState(false);
  return (
    <div>
      <div className="flex flex-wrap">
        <div
          className={cn(
            'sticky top-0 left-0 flex h-screen bg-secondary w-68 flex-none flex-col transition-all duration-300 ease-in-out',
            hideSidebar ? 'w-10' : 'w-68',
          )}
        >
          <SideNav hideSidebar={hideSidebar} toggleSidebar={toggleSidebar} />
        </div>
        <main className="w-full bg-background flex-1">{children}</main>
      </div>
    </div>
  );
}
