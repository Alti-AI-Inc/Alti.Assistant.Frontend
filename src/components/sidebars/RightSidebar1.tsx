'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { ChevronRight, Clock, FileText, Users } from 'lucide-react';

const RightSidebar1 = () => {
  const { isLeftSidebar3Open, toggleLeftSidebar3 } = useSidebarStore();

  return (
    <>
      {/* Collapse/Expand Toggle Button */}
      <div className="absolute top-4 -left-6 z-40">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLeftSidebar3}
          className="h-8 w-8 rounded-md p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
          title={isLeftSidebar3Open ? 'Collapse' : 'Expand'}
        >
          <ChevronRight
            className={cn(
              'h-4 w-4 transition-transform duration-300',
              isLeftSidebar3Open && 'rotate-180',
            )}
          />
        </Button>
      </div>

      {/* Sidebar Container */}
      <div
        className={cn(
          'relative flex flex-col border-l border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950',
          isLeftSidebar3Open ? 'w-72' : 'w-0',
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Details
            </h2>
          </div>
        </div>

        {/* Sidebar Content - Scrollable */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="space-y-4 p-4">
            {/* Info section */}
            <div className="space-y-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <FileText className="h-4 w-4" />
                <span>Type: Workspace</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Created: Mar 15, 2024</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span>Members: 5</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-gray-800" />

            {/* Metadata section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                Metadata
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Owner
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    John Doe
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Description
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    Main workspace for project management
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-gray-800" />

            {/* Statistics section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded bg-blue-50 p-2 dark:bg-blue-950">
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Items
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    24
                  </div>
                </div>
                <div className="rounded bg-green-50 p-2 dark:bg-green-950">
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Activity
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    8
                  </div>
                </div>
              </div>
            </div>

            {/* Actions section */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-sm"
              >
                Edit Workspace
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm"
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar1;
