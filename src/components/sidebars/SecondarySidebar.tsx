'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { ChevronRight, Layers3 } from 'lucide-react';

const SecondarySidebar = () => {
  const { isLeftSidebar2Open, toggleLeftSidebar2 } = useSidebarStore();

  return (
    <>
      {/* Collapse/Expand Toggle Button */}
      <div className="absolute top-4 -right-6 z-40">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLeftSidebar2}
          className="h-8 w-8 rounded-md p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
          title={isLeftSidebar2Open ? 'Collapse' : 'Expand'}
        >
          <ChevronRight
            className={cn(
              'h-4 w-4 transition-transform duration-300',
              !isLeftSidebar2Open && 'rotate-180',
            )}
          />
        </Button>
      </div>

      {/* Sidebar Container */}
      <div
        className={cn(
          'relative flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950',
          isLeftSidebar2Open ? 'w-64' : 'w-0',
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Layers3 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Filters
            </h2>
          </div>
        </div>

        {/* Sidebar Content - Scrollable */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="space-y-4 p-4">
            {/* Filter sections */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                Status
              </h3>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded"
                    defaultChecked
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Active
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded"
                    defaultChecked
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Archived
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Draft
                  </span>
                </label>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-gray-800" />

            {/* Sort section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                Sort By
              </h3>
              <select className="w-full rounded border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                <option>Recent</option>
                <option>Oldest</option>
                <option>A-Z</option>
                <option>Z-A</option>
              </select>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-gray-800" />

            {/* Tags section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                Tags
              </h3>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Important
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    In Progress
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Review
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecondarySidebar;
