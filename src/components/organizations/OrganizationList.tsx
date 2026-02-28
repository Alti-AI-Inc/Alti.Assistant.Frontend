'use client';

import { OrganizationCard } from './OrganizationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2 } from 'lucide-react';
import type { UserTenant } from '@/types/tenant';

interface OrganizationListProps {
  organizations: (UserTenant & { memberCount?: number })[];
  isLoading?: boolean;
}

export function OrganizationList({
  organizations,
  isLoading = false,
}: OrganizationListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px] rounded-lg" />
        ))}
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Building2 className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No organizations</h3>
        <p className="text-muted-foreground max-w-sm">
          You don't have any organizations yet. Create one to get started with team collaboration.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {organizations.map((org) => (
        <OrganizationCard key={org.id} organization={org} />
      ))}
    </div>
  );
}
