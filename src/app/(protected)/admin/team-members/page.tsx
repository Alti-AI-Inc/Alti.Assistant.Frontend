'use client';

import { useTenant } from '@/contexts/TenantContext';
import { OrganizationTenantOverview } from '@/components/organizations/OrganizationTenantOverview';

export default function AdminTeamMembersPage() {
  const { currentTenant, isLoading } = useTenant();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F5F5F7] dark:bg-gray-955">
        <span className="text-gray-550 text-sm text-gray-500">Loading team details...</span>
      </div>
    );
  }

  if (!currentTenant) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F5F5F7] dark:bg-gray-955">
        <span className="text-gray-500 text-sm">Loading workspace details...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-gray-955 overflow-hidden">
      {/* Dynamic Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-[#F5F5F7] dark:bg-gray-955">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Members
        </h1>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
        <OrganizationTenantOverview fixedTenantId={currentTenant.id} view="members" />
      </div>
    </div>
  );
}
