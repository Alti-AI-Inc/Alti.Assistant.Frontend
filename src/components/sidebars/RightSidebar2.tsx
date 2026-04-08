'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/useSidebarStore';
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';

const RightSidebar2 = () => {
  const { isRightSidebar2Open, toggleRightSidebar2 } = useSidebarStore();

  return (
    <>
      {/* Collapse/Expand Toggle Button */}
      <div className="absolute top-4 -left-6 z-40">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleRightSidebar2}
          className="h-8 w-8 rounded-md p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
          title={isRightSidebar2Open ? 'Collapse' : 'Expand'}
        >
          <ChevronRight
            className={cn(
              'h-4 w-4 transition-transform duration-300',
              isRightSidebar2Open && 'rotate-180',
            )}
          />
        </Button>
      </div>

      {/* Sidebar Container */}
      <div
        className={cn(
          'relative flex flex-col border-l border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950',
          isRightSidebar2Open ? 'w-80' : 'w-0',
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Activity & Alerts
            </h2>
          </div>
          <span className="inline-flex transform items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs leading-none font-semibold text-white">
            3
          </span>
        </div>

        {/* Sidebar Content - Scrollable */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="space-y-2 p-3">
            {/* Notification Item 1 - Success */}
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 transition-shadow hover:shadow-md dark:border-green-800 dark:bg-green-950">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-green-900 dark:text-green-100">
                    Workspace Synced
                  </h4>
                  <p className="mt-0.5 text-xs text-green-700 dark:text-green-300">
                    All changes have been saved
                  </p>
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                    2 minutes ago
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Item 2 - Warning */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 transition-shadow hover:shadow-md dark:border-amber-800 dark:bg-amber-950">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    Member Joined
                  </h4>
                  <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-300">
                    Sarah Mitchell joined the workspace
                  </p>
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    15 minutes ago
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Item 3 - Message */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 transition-shadow hover:shadow-md dark:border-blue-800 dark:bg-blue-950">
              <div className="flex gap-3">
                <MessageSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    New Comment
                  </h4>
                  <p className="mt-0.5 text-xs text-blue-700 dark:text-blue-300">
                    Someone commented on your workspace
                  </p>
                  <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                    1 hour ago
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-2 h-px bg-gray-200 dark:bg-gray-800" />

            {/* View All Button */}
            <Button
              variant="ghost"
              className="w-full justify-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              View All Notifications
            </Button>

            {/* Divider */}
            <div className="my-2 h-px bg-gray-200 dark:bg-gray-800" />

            {/* Quick Actions section */}
            <div className="space-y-2 pt-2">
              <h3 className="px-1 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                Quick Actions
              </h3>
              <Button
                variant="outline"
                className="w-full justify-start text-sm"
              >
                Invite Members
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm"
              >
                Export Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm"
              >
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar2;
