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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-[200px] rounded-lg" />
        ))}
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Building2 className="text-muted-foreground size-8" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">No organizations</h3>
        <p className="text-muted-foreground max-w-sm">
          You don't have any organizations yet. Create one to get started with
          team collaboration.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {organizations.map(org => (
        <OrganizationCard key={org.id} organization={org} />
      ))}
    </div>
  );
}
