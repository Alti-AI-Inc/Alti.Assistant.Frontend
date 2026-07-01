'use client';

import { useTenant } from '@/contexts/TenantContext';
import { OrganizationTenantOverview } from '@/components/organizations/OrganizationTenantOverview';
import { useModalStore } from '@/stores/useModalStore';
import { Button } from '@/components/ui/button';
import { Building2, Plus, ArrowRight } from 'lucide-react';

export default function AdminMembersPage() {
  const { currentTenant, tenants, switchToTenantMode, isLoading } = useTenant();
  const { onOpen } = useModalStore();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#e1e1e1] dark:bg-gray-950">
        <span className="text-gray-500 text-sm">Loading organization details...</span>
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
          Invite
        </h1>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
        <OrganizationTenantOverview fixedTenantId={currentTenant.id} view="invite" />
      </div>
    </div>
  );
}

