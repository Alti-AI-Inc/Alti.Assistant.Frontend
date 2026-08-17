'use client';

import { useTenant } from '@/contexts/TenantContext';
import { OrganizationTenantOverview } from '@/components/organizations/OrganizationTenantOverview';
import { useState } from 'react';

export default function AdminTeamMembersPage() {
  const { currentTenant, isLoading } = useTenant();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#e1e1e1] dark:bg-gray-955">
        <span className="text-gray-550 text-sm text-gray-500">Loading team details...</span>
      </div>
    );
  }

  if (!currentTenant) {
    return (
      <div className="h-full flex items-center justify-center bg-[#e1e1e1] dark:bg-gray-955">
        <span className="text-gray-500 text-sm">Loading workspace details...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#e1e1e1] dark:bg-gray-955 overflow-hidden">
      {/* Dynamic Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-950">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Members
        </h1>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
        <OrganizationTenantOverview
          fixedTenantId={currentTenant.id}
          view="members"
          currentPage={currentPage}
          onTotalPagesChange={setTotalPages}
        />
      </div>

      {/* Fixed Bottom Bar */}
      {totalPages > 1 && (
        <div className="h-[52px] border-t border-black/10 dark:border-white/10 flex items-center justify-between px-8 flex-none bg-white dark:bg-gray-950 z-20">
          <button
            type="button"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="text-xs font-semibold text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 disabled:opacity-40 transition-all cursor-pointer bg-transparent border-none outline-none focus:outline-none"
          >
            Back
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="text-xs font-semibold text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 disabled:opacity-40 transition-all cursor-pointer bg-transparent border-none outline-none focus:outline-none"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
