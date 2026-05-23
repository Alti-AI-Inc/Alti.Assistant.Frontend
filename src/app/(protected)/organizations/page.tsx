'use client';

import { getUserTenants, createTenant } from '@/actions/tenantActions';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { OrganizationTenantOverview } from '@/components/organizations/OrganizationTenantOverview';

export default function OrganizationsPage() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [activeTenantId, setActiveTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pathname !== '/organizations') return;

    if (status === 'loading') {
      return;
    }

    if (!session?.accessToken) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const initializeTenant = async () => {
      setIsLoading(true);
      try {
        const response = await getUserTenants();
        if (cancelled) return;

        if (response.success) {
          const list = Array.isArray(response.data) ? response.data : [];

          if (list.length > 0) {
            setActiveTenantId(list[0].id);
            setIsLoading(false);
            return;
          }

          // If no team exists, automatically create one in the background
          try {
            const uniqueSlug = `team-${Math.random().toString(36).substring(2, 8)}`;
            const createRes = await createTenant({
              name: 'My Workspace',
              slug: uniqueSlug,
              subdomain: uniqueSlug,
            });
            if (!cancelled && createRes.success && createRes.data) {
              setActiveTenantId(createRes.data.id);
            }
          } catch (err) {
            console.error('Failed to auto-create default team:', err);
          }
        }
      } catch (error) {
        console.error('Failed to initialize tenant:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void initializeTenant();

    return () => {
      cancelled = true;
    };
  }, [pathname, session?.accessToken, status]);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-[200px] rounded-lg" />
        </div>
      ) : activeTenantId ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Members</h1>
            <p className="text-muted-foreground mt-1">
              Team members, invitations, and usage for this organization
            </p>
          </div>
          <OrganizationTenantOverview fixedTenantId={activeTenantId} />
        </>
      ) : (
        <div className="text-center py-16 text-muted-foreground text-sm">
          Failed to load organization workspace. Please try reloading the page.
        </div>
      )}
    </div>
  );
}

