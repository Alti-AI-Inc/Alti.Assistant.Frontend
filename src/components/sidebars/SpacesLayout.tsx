'use client';

import { cn } from '@/lib/utils';
import ColumnPanelsContainer from '../panels/ColumnPanelsContainer';

interface SpacesLayoutProps {
  children: React.ReactNode;
  showColumnPanels?: boolean;
}

export const SpacesLayout = ({
  children,
  showColumnPanels = true,
}: SpacesLayoutProps) => {
  return (
    <div className="flex h-full w-full bg-gray-50 dark:bg-gray-900">
      {/* Main Content Area with Column Panels */}
      <main
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out',
          'bg-white dark:bg-gray-955',
        )}
      >
        {showColumnPanels ? (
          // Column Panels Layout
          <ColumnPanelsContainer />
        ) : (
          // Regular Content Layout
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">{children}</div>
        )}
      </main>
    </div>
  );
};

export default SpacesLayout;
