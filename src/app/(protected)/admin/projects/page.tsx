'use client';

import { AdminProjectsEditor } from '@/components/admin/AdminProjects';

export default function AdminProjectsPage() {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
      {/* Dynamic Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-950">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Projects
        </h1>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <AdminProjectsEditor />
      </div>
    </div>
  );
}
