'use client';

import { getUserTenants } from '@/actions/tenantActions';
import { OrganizationTenantOverview } from '@/components/organizations/OrganizationTenantOverview';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserTenant } from '@/types/tenant';
import { Building2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function OrganizationsDashboardPage() {
  const { data: session } = useSession();
  const [organizations, setOrganizations] = useState<UserTenant[]>([]);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      if (!session?.accessToken) return;

      setIsLoadingOrganizations(true);
      try {
        const response = await getUserTenants();
        if (response.success && response.data) {
          setOrganizations(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      } finally {
        setIsLoadingOrganizations(false);
      }
    };

    fetchOrganizations();
  }, [session?.accessToken]);

  if (isLoadingOrganizations) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="mb-8 h-8 w-80" />
        <Skeleton className="h-10 w-72" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
        <section>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage organization
          </h1>
          <p className="text-muted-foreground">
            Members, invitations, and usage for your organizations.
          </p>
        </section>

        {organizations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <div className="bg-muted mb-4 flex size-16 items-center justify-center rounded-full">
              <Building2 className="text-muted-foreground size-8" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">No organizations yet</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Create an organization to invite team members and track usage.
            </p>
            <Link
              href="/organizations/create"
              className="text-primary font-medium underline underline-offset-4"
            >
              Create organization
            </Link>
          </div>
        ) : (
          <OrganizationTenantOverview organizations={organizations} />
        )}
      </div>
    </div>
  );
}
