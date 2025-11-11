'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import DashboardLeftSideNav from './_components/DashboardLeftSideNav';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // const pathname=usePathname()
  // const [visibleRightSidebar, setVisibleRightSidebar] = useState(false);

  return (
    <div className="flex">
      <DashboardLeftSideNav />
      <div className={cn('w-full')}>
        <main className="h-screen overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
