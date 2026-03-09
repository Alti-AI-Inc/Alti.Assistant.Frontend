'use client';

import { getCurrentTenant, getTenantById } from '@/actions/tenantActions';
import { getTenantMembers } from '@/actions/memberActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/contexts/TenantContext';
import {
  ArrowLeft,
  Building2,
  CreditCard,
  Settings,
  UserPlus,
  Users,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import type { Tenant, TenantMember } from '@/types/tenant';

export default function OrganizationDashboardPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const { switchToTenantMode } = useTenant();
  const [organization, setOrganization] = useState<Tenant | null>(null);
  const [members, setMembers] = useState<TenantMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.accessToken) return;

      setIsLoading(true);
      try {
        // Switch to tenant mode
        await switchToTenantMode(tenantId);

        // Fetch organization data
        const [orgResponse, membersResponse] = await Promise.all([
          getTenantById(tenantId),
          getTenantMembers(),
        ]);
        console.log('Organization response:', orgResponse);
        if (orgResponse.success && orgResponse.data) {
          setOrganization(orgResponse.data);
        }

        if (membersResponse.success && membersResponse.data) {
          setMembers(membersResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch organization data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tenantId, session?.accessToken, switchToTenantMode]);

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <p className="text-center text-muted-foreground">Organization not found</p>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <Link
        href="/organizations"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to Organizations
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="size-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{organization.name}</h1>
            <p className="text-muted-foreground">
              {organization.subdomain}.alti.ai
            </p>
          </div>
          <Badge variant="outline" className="capitalize">
            {organization.subscription?.price?.displayName || organization.plan}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/organizations/${tenantId}/settings`)}
          >
            <Settings className="size-4 mr-2" />
            Settings
          </Button>
          <Button
            onClick={() => router.push(`/organizations/${tenantId}/members`)}
          >
            <UserPlus className="size-4 mr-2" />
            Invite Members
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-muted-foreground">
              Active team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{organization.subscription?.price?.displayName || organization.plan}</div>
            <Button
              variant="link"
              className="px-0 h-auto text-xs"
              onClick={() => router.push(`/organizations/${tenantId}/billing`)}
            >
              Manage billing →
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Building2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {(organization.subscription?.price?.plan || organization.plan) === 'free' ? 'Trial' : 'Active'}
            </div>
            <p className="text-xs text-muted-foreground">
              Organization status
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for managing your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={() => router.push(`/organizations/${tenantId}/members`)}
          >
            <Users className="size-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Manage Members</div>
              <div className="text-xs text-muted-foreground">
                Invite, remove, or change member roles
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={() => router.push(`/organizations/${tenantId}/billing`)}
          >
            <CreditCard className="size-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Billing & Usage</div>
              <div className="text-xs text-muted-foreground">
                View subscription and usage details
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={() => router.push(`/organizations/${tenantId}/settings`)}
          >
            <Settings className="size-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Organization Settings</div>
              <div className="text-xs text-muted-foreground">
                Configure organization preferences
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={() => router.push(`/organizations/${tenantId}/members`)}
          >
            <UserPlus className="size-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Invite Team Members</div>
              <div className="text-xs text-muted-foreground">
                Add new people to your organization
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
