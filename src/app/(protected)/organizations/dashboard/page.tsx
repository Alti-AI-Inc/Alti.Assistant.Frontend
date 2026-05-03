'use client';

import {
  getPendingInvitations,
  getTenantMembers,
} from '@/actions/memberActions';
import { getTenantById, getUserTenants } from '@/actions/tenantActions';
import { StaticOrganizationWidgets } from '@/components/organizations/StaticOrganizationWidgets';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTenant } from '@/contexts/TenantContext';
import { useModalStore } from '@/stores/useModalStore';
import type {
  Tenant,
  TenantInvitation,
  TenantMember,
  UserTenant,
} from '@/types/tenant';
import { Building2, CreditCard, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';

export default function OrganizationsDashboardPage() {
  const { data: session } = useSession();
  const { mode, currentTenant, switchToTenantMode } = useTenant();
  const { onOpen } = useModalStore();

  const [organizations, setOrganizations] = useState<UserTenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');
  const [organization, setOrganization] = useState<Tenant | null>(null);
  const [members, setMembers] = useState<TenantMember[]>([]);
  const [invitations, setInvitations] = useState<TenantInvitation[]>([]);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(true);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      if (!session?.accessToken) return;

      setIsLoadingOrganizations(true);
      try {
        const response = await getUserTenants();
        if (response.success && response.data) {
          setOrganizations(response.data);

          const currentTenantId =
            mode === 'tenant' && currentTenant ? currentTenant.id : undefined;
          const initialTenantId = currentTenantId || response.data[0]?.id || '';
          setSelectedTenantId(initialTenantId);
        }
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      } finally {
        setIsLoadingOrganizations(false);
      }
    };

    fetchOrganizations();
  }, [session?.accessToken, mode, currentTenant]);

  const loadTenantDashboard = async (tenantId: string) => {
    if (!tenantId) {
      setOrganization(null);
      setMembers([]);
      setInvitations([]);
      setIsLoadingDashboard(false);
      return;
    }

    setIsLoadingDashboard(true);
    try {
      // Keep tenant context synced so existing invite/remove actions work.
      await switchToTenantMode(tenantId);

      const [organizationResponse, membersResponse, invitationsResponse] =
        await Promise.all([
          getTenantById(tenantId),
          getTenantMembers(),
          getPendingInvitations(),
        ]);

      if (organizationResponse.success && organizationResponse.data) {
        setOrganization(organizationResponse.data);
      } else {
        setOrganization(null);
      }

      if (membersResponse.success && membersResponse.data) {
        setMembers(
          Array.isArray(membersResponse.data) ? membersResponse.data : [],
        );
      } else {
        setMembers([]);
      }

      if (invitationsResponse.success && invitationsResponse.data) {
        setInvitations(
          Array.isArray(invitationsResponse.data)
            ? invitationsResponse.data
            : [],
        );
      } else {
        setInvitations([]);
      }
    } catch (error) {
      console.error('Failed to load organization dashboard:', error);
      setOrganization(null);
      setMembers([]);
      setInvitations([]);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  useEffect(() => {
    if (!session?.accessToken || !selectedTenantId) return;
    loadTenantDashboard(selectedTenantId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken, selectedTenantId]);

  const seatUsage = useMemo(() => {
    const maxSeats =
      organization?.settings?.maxMembers ?? organization?.limits?.maxUsers ?? 0;
    const usedSeats = members.length;
    const percentage =
      maxSeats > 0
        ? Math.min(100, Math.round((usedSeats / maxSeats) * 100))
        : 0;

    return {
      maxSeats,
      usedSeats,
      percentage,
    };
  }, [organization, members.length]);

  const planName =
    organization?.subscription?.price?.displayName || organization?.plan || '-';
  const status = organization?.status || '-';
  const canManageMembers = useMemo(() => {
    if (!selectedTenantId) return false;
    const role = session?.user?.tenants?.find(
      t => t.id === selectedTenantId,
    )?.role;
    return role === 'owner' || role === 'admin';
  }, [session?.user?.tenants, selectedTenantId]);

  const handleInvite = () => {
    if (!selectedTenantId) return;
    onOpen({
      type: 'invite-member',
      actionId: selectedTenantId,
      onConfirm: () => loadTenantDashboard(selectedTenantId),
    });
  };

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
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Manage Organization
            </h1>
            <p className="text-muted-foreground">
              Manage organization members and monitor key organization metrics.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-[320px]">
            <label className="text-sm font-medium">Select Organization</label>
            <Select
              value={selectedTenantId}
              onValueChange={setSelectedTenantId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map(org => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Static widgets for demo purposes */}
        <StaticOrganizationWidgets />

        {isLoadingDashboard ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : selectedTenantId && organization ? (
          <>
            {/* Statistic cards at the very top */}
            <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardDescription>Organization</CardDescription>
                    <CardTitle className="text-xl">
                      {organization.name}
                    </CardTitle>
                  </div>
                  <Building2 className="text-muted-foreground size-5" />
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardDescription>Total Members</CardDescription>
                    <CardTitle className="text-2xl">{members.length}</CardTitle>
                  </div>
                  <Users className="text-muted-foreground size-5" />
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardDescription>Plan</CardDescription>
                    <CardTitle className="text-2xl capitalize">
                      {planName}
                    </CardTitle>
                  </div>
                  <CreditCard className="text-muted-foreground size-5" />
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="space-y-1 pb-2">
                  <CardDescription>Status</CardDescription>
                  <CardTitle className="text-2xl capitalize">
                    {status}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-xs">
                  {seatUsage.maxSeats > 0
                    ? `${seatUsage.usedSeats} / ${seatUsage.maxSeats} seats used`
                    : `${seatUsage.usedSeats} active seats`}
                </CardContent>
              </Card>
            </section>

            {/* Full-width static members table and widgets */}
            <div className="w-full">
              <StaticOrganizationWidgets />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
