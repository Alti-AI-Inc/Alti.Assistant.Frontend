'use client';

import { OrganizationTenantOverview } from '@/components/organizations/OrganizationTenantOverview';
import { use } from 'react';
import SpacesLayout from '@/components/sidebars/SpacesLayout';

const OrganizationMembersPageContent = ({ tenantId }: { tenantId: string }) => {
  return (
    <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-gray-950 overflow-hidden">
      {/* Dynamic Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-[#F5F5F7] dark:bg-gray-950">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Team Members
        </h1>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
        <OrganizationTenantOverview fixedTenantId={tenantId} view="members" />
      </div>
    </div>
  );
};

export default function OrganizationMembersPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = use(params);

  return (
    <SpacesLayout showColumnPanels={false}>
      <OrganizationMembersPageContent tenantId={tenantId} />
    </SpacesLayout>
  );
}
