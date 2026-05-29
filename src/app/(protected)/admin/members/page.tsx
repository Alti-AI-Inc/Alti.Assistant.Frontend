'use client';

import { useTenant } from '@/contexts/TenantContext';
import { OrganizationTenantOverview } from '@/components/organizations/OrganizationTenantOverview';

export default function AdminMembersPage() {
  const { currentTenant } = useTenant();

  if (!currentTenant) {
    return (
      <div className="p-8 text-center text-gray-500">
        Please select an organization to manage members.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
      {/* Dynamic Header */}
      <div className="h-[53px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-950">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Member Management
        </h1>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
        <OrganizationTenantOverview fixedTenantId={currentTenant.id} />
      </div>
    </div>
  );
}
