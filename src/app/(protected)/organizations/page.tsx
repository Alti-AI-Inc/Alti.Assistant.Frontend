'use client';

import { getUserTenants } from '@/actions/tenantActions';
import { TenantModeSwitcher } from '@/components/TenantModeSwitcher';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { OrganizationCard } from '@/components/organizations/OrganizationCard';
import type { UserTenant } from '@/types/tenant';
import { useTenant } from '@/contexts/TenantContext';

export default function OrganizationsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { refreshTenants } = useTenant();
  const [organizations, setOrganizations] = useState<UserTenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      if (!session?.accessToken) return;
      
      setIsLoading(true);
      try {
        const response = await getUserTenants();
        if (response.success && response.data) {
          setOrganizations(response.data);
          // Refresh the TenantContext to sync the switcher
          await refreshTenants();
        }
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, [session?.accessToken, refreshTenants]);

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organizations and team workspaces
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-[240px]">
            <TenantModeSwitcher />
          </div>
          <Button onClick={() => router.push('/organizations/create')}>
            <Plus className="size-4 mr-2" />
            Create Organization
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] rounded-lg" />
          ))}
        </div>
      ) : organizations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <OrganizationCard key={org.id} organization={org} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Building2 className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No organizations yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Organizations help you collaborate with your team. Create one to get started.
          </p>
          <Button onClick={() => router.push('/organizations/create')}>
            <Plus className="size-4 mr-2" />
            Create Your First Organization
          </Button>
        </div>
      )}
    </div>
  );
}
