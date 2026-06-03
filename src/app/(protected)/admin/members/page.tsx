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
      <div className="h-full flex items-center justify-center bg-[#F5F5F7] dark:bg-gray-950">
        <span className="text-gray-500 text-sm">Loading organization details...</span>
      </div>
    );
  }

  if (!currentTenant) {
    return (
      <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-gray-950 overflow-hidden">
        {/* Dynamic Header */}
        <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-[#F5F5F7] dark:bg-gray-955">
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">
            Members & Teams
          </h1>
        </div>

        {/* Main Workspace Body */}
        <div className="flex-1 overflow-y-auto min-h-0 px-8 py-12 flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-black/10 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm text-center space-y-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Building2 className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Personal Mode (No Team)
              </h2>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                You are currently using your personal account. To invite and manage team members, please select or create an organization.
              </p>
            </div>

            {tenants.length > 0 ? (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider text-left">
                  Your Organizations
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-black/5 dark:border-zinc-800 rounded-lg p-1">
                  {tenants.map((tenant) => (
                    <button
                      key={tenant.id}
                      onClick={() => switchToTenantMode(tenant.id)}
                      className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-sm text-left transition-colors"
                    >
                      <span className="font-medium text-gray-950 dark:text-white truncate">
                        {tenant.name}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="default"
                onClick={() => onOpen({ type: 'create-organization' })}
                className="w-full gap-2 bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black"
              >
                <Plus className="h-4 w-4" />
                Create New Organization
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-gray-955 overflow-hidden">
      {/* Dynamic Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-[#F5F5F7] dark:bg-gray-955">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Invite Members
        </h1>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
        <OrganizationTenantOverview fixedTenantId={currentTenant.id} view="invite" />
      </div>
    </div>
  );
}

