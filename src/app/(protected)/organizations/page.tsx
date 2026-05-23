'use client';

import { getTenantUserCount, getUserTenants } from '@/actions/tenantActions';
import { TenantModeSwitcher } from '@/components/TenantModeSwitcher';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { OrganizationCard } from '@/components/organizations/OrganizationCard';
import type { UserTenant } from '@/types/tenant';
import useTenantStore from '@/stores/useTenantStore';

export default function OrganizationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const setTenants = useTenantStore(s => s.setTenants);
  const [organizations, setOrganizations] = useState<UserTenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pathname !== '/organizations') return;

    if (status === 'loading') {
      return;
    }

    if (!session?.accessToken) {
      setIsLoading(false);
      setOrganizations([]);
      return;
    }

    let cancelled = false;

    const fetchOrganizations = async () => {
      setIsLoading(true);
      try {
        const response = await getUserTenants();
        if (cancelled) return;

        if (response.success) {
          const list = Array.isArray(response.data) ? response.data : [];

          if (list.length > 0) {
            router.replace(`/organizations/${list[0].id}/members`);
            return;
          }

          setOrganizations([]);
        } else {
          setOrganizations([]);
        }
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
        if (!cancelled) setOrganizations([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void fetchOrganizations();

    return () => {
      cancelled = true;
    };
  }, [pathname, session?.accessToken, setTenants, status, router]);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-[120px] rounded-lg" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
          <div className="bg-muted mb-6 flex h-16 w-16 items-center justify-center rounded-full">
            <Building2 className="text-muted-foreground size-8" />
          </div>
          <h3 className="mb-2 text-2xl font-bold tracking-tight">Create a Team</h3>
          <p className="text-muted-foreground mb-8 max-w-sm text-sm">
            Create an organization team to invite users and collaborate in a shared workspace.
          </p>
          <Button onClick={() => router.push('/organizations/create')} className="bg-black text-white hover:bg-black/90">
            <Plus className="mr-2 size-4" />
            Create Team
          </Button>
        </div>
      )}
    </div>
  );
}
