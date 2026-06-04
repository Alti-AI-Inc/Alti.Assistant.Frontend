'use client';

import { AdminGuardrailsEditor } from '@/components/admin/AdminEditors';

export default function AdminGuardrailsPage() {
  return (
    <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-gray-955 overflow-hidden">
      {/* Dynamic Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-[#F5F5F7] dark:bg-gray-955">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Guardrails
        </h1>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <AdminGuardrailsEditor />
      </div>
    </div>
  );
}
