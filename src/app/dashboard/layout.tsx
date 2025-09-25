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
      <div
        className={cn(
          'w-full',
          // !visibleRightSidebar && pathname==="/workflows" && "pr-64"
        )}
      >
        <main className="h-screen overflow-y-auto">{children}</main>
      </div>
      {/* {pathname==="/workflows" && <RightSideBar visibleRightSidebar={visibleRightSidebar} toggleRightSidebar={toggleRightSidebar} />} */}
    </div>
  );
};

export default DashboardLayout;
