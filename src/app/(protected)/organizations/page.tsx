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

          const countResults = await Promise.all(
            list.map(org =>
              getTenantUserCount(org.id).then(res => ({
                id: org.id,
                usersCount: res.success ? res.data.usersCount : undefined,
              })),
            ),
          );
          const countById = new Map(
            countResults.map(r => [r.id, r.usersCount] as const),
          );
          const enriched: UserTenant[] = list.map(org => {
            const fromApi = countById.get(org.id);
            let usersCount: number | undefined;
            if (fromApi === undefined) {
              usersCount = org.usersCount;
            } else {
              usersCount = Math.max(fromApi, org.usersCount ?? 0);
            }
            return { ...org, usersCount };
          });

          setOrganizations(enriched);
          setTenants(
            enriched.map(t => ({
              id: t.id,
              name: t.name,
              role: t.role,
              subdomain: t.subdomain,
              slug: t.slug,
            })),
          );
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
  }, [pathname, session?.accessToken, setTenants, status]);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
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
            <Plus className="mr-2 size-4" />
            Create Organization
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-[200px] rounded-lg" />
          ))}
        </div>
      ) : organizations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map(org => (
            <OrganizationCard key={org.id} organization={org} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
          <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Building2 className="text-muted-foreground size-8" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">No organizations yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Organizations help you collaborate with your team. Create one to get
            started.
          </p>
          <Button onClick={() => router.push('/organizations/create')}>
            <Plus className="mr-2 size-4" />
            Create Your First Organization
          </Button>
        </div>
      )}
    </div>
  );
}
