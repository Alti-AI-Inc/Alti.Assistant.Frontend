'use client';

import {
  getPendingInvitations,
  getTenantMemberByTenantId,
  getTenantMembers,
} from '@/actions/memberActions';
import {
  getCurrentTenant,
  getTenantById,
  getTenantUsage,
} from '@/actions/tenantActions';
import { MembersList } from '@/components/organizations/MembersList';
import { PendingInvitations } from '@/components/organizations/PendingInvitations';
import { Button } from '@/components/ui/button';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTenant } from '@/contexts/TenantContext';
import { useModalStore } from '@/stores/useModalStore';
import type {
  Tenant,
  TenantInvitation,
  TenantMember,
  TenantUsage,
  UserTenant,
} from '@/types/tenant';
import {
  Activity,
  ArrowRight,
  Building2,
  CreditCard,
  HardDrive,
  Lock,
  UserPlus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

export interface OrganizationTenantOverviewProps {
  /** Org picker list; omit when `fixedTenantId` is set */
  organizations?: UserTenant[];
  /** Lock to one tenant (no switcher). Use on `/organizations/[tenantId]/members`. */
  fixedTenantId?: string;
}

/** Handles `{ data: Tenant }` or `{ data: { tenant: Tenant } }` from the API */
function normalizeTenantPayload(data: unknown): Tenant | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  if ('id' in d && typeof d.id === 'string') return data as Tenant;
  if (
    'tenant' in d &&
    d.tenant &&
    typeof d.tenant === 'object' &&
    (d.tenant as Tenant).id
  ) {
    return d.tenant as Tenant;
  }
  return null;
}

function formatUsageValue(key: string, value: unknown): string {
  if (value === undefined || value === null) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') {
    if (key.toLowerCase().includes('storage') && value > 1024 * 1024) {
      const gb = value / (1024 * 1024 * 1024);
      if (gb >= 1) return `${gb.toFixed(2)} GB`;
      const mb = value / (1024 * 1024);
      return `${mb.toFixed(1)} MB`;
    }
    return value.toLocaleString();
  }
  if (typeof value === 'string') return value;
  return String(value);
}

export function OrganizationTenantOverview({
  organizations = [],
  fixedTenantId,
}: OrganizationTenantOverviewProps) {
  const { data: session, status: sessionStatus } = useSession();
  const { mode, currentTenant, switchToTenantMode } = useTenant();
  const { onOpen } = useModalStore();

  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [organization, setOrganization] = useState<Tenant | null>(null);
  const [members, setMembers] = useState<TenantMember[]>([]);
  const [invitations, setInvitations] = useState<TenantInvitation[]>([]);
  const [usage, setUsage] = useState<TenantUsage | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  /** Ignore late results if user switched org or navigated away mid-flight */
  const latestTenantLoadRef = useRef<string | null>(null);

  useEffect(() => {
    if (fixedTenantId) {
      setSelectedTenantId(fixedTenantId);
      return;
    }

    if (organizations.length === 0) {
      setSelectedTenantId('');
      return;
    }

    const preferred =
      mode === 'tenant' &&
      currentTenant &&
      organizations.some(o => o.id === currentTenant.id)
        ? currentTenant.id
        : (organizations[0]?.id ?? '');

    setSelectedTenantId(prev => {
      if (prev && organizations.some(o => o.id === prev)) return prev;
      return preferred;
    });
  }, [fixedTenantId, organizations, mode, currentTenant]);

  const loadTenantDashboard = useCallback(
    async (tenantId: string) => {
      if (!tenantId || !session?.accessToken) {
        setOrganization(null);
        setMembers([]);
        setInvitations([]);
        setUsage(null);
        setIsLoadingDashboard(false);
        return;
      }

      latestTenantLoadRef.current = tenantId;
      setIsLoadingDashboard(true);

      const isStale = () => latestTenantLoadRef.current !== tenantId;

      try {
        await switchToTenantMode(tenantId);
      } catch {
        if (!isStale()) {
          setOrganization(null);
          setMembers([]);
          setInvitations([]);
          setUsage(null);
          setIsLoadingDashboard(false);
        }
        return;
      }

      if (isStale()) return;

      /**
       * After `session.update({ accessToken })`, parallel server actions can still
       * read the previous cookie for `auth()`. Run members first in its own request,
       * then fan out the rest.
       */
      let membersList: TenantMember[] = [];
      try {
        const membersRes = await getTenantMembers();
        if (
          !isStale() &&
          membersRes.success &&
          Array.isArray(membersRes.data)
        ) {
          membersList = membersRes.data;
        }
      } catch (e) {
        console.warn('getTenantMembers failed:', e);
      }

      if (!isStale() && membersList.length === 0) {
        try {
          const alt = await getTenantMemberByTenantId(tenantId);
          if (
            !isStale() &&
            alt.success &&
            Array.isArray(alt.data) &&
            alt.data.length
          ) {
            membersList = alt.data;
          }
        } catch (e) {
          console.warn('getTenantMemberByTenantId fallback failed:', e);
        }
      }

      if (
        !isStale() &&
        fixedTenantId === tenantId &&
        membersList.length === 0
      ) {
        await new Promise(r => setTimeout(r, 200));
        if (!isStale()) {
          try {
            const retry = await getTenantMembers();
            if (
              retry.success &&
              Array.isArray(retry.data) &&
              retry.data.length
            ) {
              membersList = retry.data;
            }
          } catch {
            /* ignore */
          }
        }
      }

      if (!isStale()) {
        setMembers(membersList);
      }

      const isMembersRoute = Boolean(
        fixedTenantId && fixedTenantId === tenantId,
      );
      if (isMembersRoute && !isStale()) {
        setIsLoadingDashboard(false);
      }

      if (isStale()) return;

      const [currentSettled, byIdSettled, invitationsSettled, usageSettled] =
        await Promise.allSettled([
          getCurrentTenant(),
          getTenantById(tenantId),
          getPendingInvitations(),
          getTenantUsage(),
        ]);

      if (isStale()) return;

      let organizationData: Tenant | null = null;
      if (
        currentSettled.status === 'fulfilled' &&
        currentSettled.value.success &&
        currentSettled.value.data
      ) {
        organizationData = normalizeTenantPayload(currentSettled.value.data);
      }
      if (
        !organizationData &&
        byIdSettled.status === 'fulfilled' &&
        byIdSettled.value.success &&
        byIdSettled.value.data
      ) {
        organizationData = normalizeTenantPayload(byIdSettled.value.data);
      }
      setOrganization(organizationData);

      if (
        invitationsSettled.status === 'fulfilled' &&
        invitationsSettled.value.success &&
        invitationsSettled.value.data
      ) {
        setInvitations(
          Array.isArray(invitationsSettled.value.data)
            ? invitationsSettled.value.data
            : [],
        );
      } else {
        if (invitationsSettled.status === 'rejected') {
          console.warn(
            'getPendingInvitations failed:',
            invitationsSettled.reason,
          );
        }
        setInvitations([]);
      }

      if (
        usageSettled.status === 'fulfilled' &&
        usageSettled.value.success &&
        usageSettled.value.data
      ) {
        setUsage(usageSettled.value.data);
      } else {
        if (usageSettled.status === 'rejected') {
          console.warn('getTenantUsage failed:', usageSettled.reason);
        }
        setUsage(null);
      }

      if (!isMembersRoute && !isStale()) {
        setIsLoadingDashboard(false);
      }
    },
    [session?.accessToken, switchToTenantMode, fixedTenantId],
  );

  const loadTenantDashboardRef = useRef(loadTenantDashboard);
  loadTenantDashboardRef.current = loadTenantDashboard;

  const hasAccessToken = Boolean(session?.accessToken);

  useEffect(() => {
    if (
      sessionStatus !== 'authenticated' ||
      !selectedTenantId ||
      !hasAccessToken
    )
      return;
    void loadTenantDashboardRef.current(selectedTenantId);
    // Omit raw accessToken: JWT rotates after switchTenant; `hasAccessToken` covers login.
  }, [selectedTenantId, sessionStatus, hasAccessToken, fixedTenantId]);

  const seatUsage = useMemo(() => {
    const maxSeats =
      organization?.settings?.maxMembers ?? organization?.limits?.maxUsers ?? 0;
    const usedSeats = members.length;
    const percentage =
      maxSeats > 0
        ? Math.min(100, Math.round((usedSeats / maxSeats) * 100))
        : 0;

    return { maxSeats, usedSeats, percentage };
  }, [organization, members.length]);

  const planName =
    organization?.subscription?.price?.displayName || organization?.plan || '—';
  const status = organization?.status || '—';

  const displayTenantName = useMemo(() => {
    return (
      organization?.name ??
      organizations.find(o => o.id === selectedTenantId)?.name ??
      session?.user?.tenants?.find(t => t.id === selectedTenantId)?.name ??
      'Organization'
    );
  }, [
    organization?.name,
    organizations,
    selectedTenantId,
    session?.user?.tenants,
  ]);

  const canInvite = useMemo(() => {
    if (!selectedTenantId) return false;
    const role = session?.user?.tenants?.find(
      t => t.id === selectedTenantId,
    )?.role;
    return role === 'owner';
  }, [session?.user?.tenants, selectedTenantId]);

  const canInviteTeam =
    organization?.subscription?.price?.features?.canInviteTeam ?? true;
  const maxMembers = organization?.settings?.maxMembers;

  const reloadDashboard = useCallback((): Promise<void> => {
    if (!selectedTenantId) return Promise.resolve();
    return loadTenantDashboard(selectedTenantId);
  }, [selectedTenantId, loadTenantDashboard]);

  const handleInviteMember = () => {
    if (!selectedTenantId) return;
    if (maxMembers !== undefined && members.length >= maxMembers) {
      toast.error(
        'Member limit reached. Upgrade your plan to add more members.',
        {
          action: {
            label: 'Manage Billing',
            onClick: () =>
              window.location.assign(
                `/organizations/${selectedTenantId}/billing`,
              ),
          },
        },
      );
      return;
    }

    onOpen({
      type: 'invite-member',
      actionId: selectedTenantId,
      onConfirm: reloadDashboard,
    });
  };

  if (!fixedTenantId && organizations.length === 0) {
    return null;
  }

  return (
    <section className={fixedTenantId ? 'space-y-6' : 'mt-10 space-y-6'}>
      {!fixedTenantId && (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Organization overview
            </h2>
            <p className="text-muted-foreground text-sm">
              Members, invitations, and usage for the selected organization
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 md:max-w-sm">
            <label className="text-sm font-medium">Organization</label>
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
        </div>
      )}

      {isLoadingDashboard && fixedTenantId ? (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 max-w-full" />
              <Skeleton className="mt-2 h-4 w-72 max-w-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      ) : isLoadingDashboard ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : selectedTenantId ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardDescription>Organization</CardDescription>
                  <CardTitle className="text-xl">{displayTenantName}</CardTitle>
                </div>
                <Building2 className="text-muted-foreground size-5" />
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardDescription>Total members</CardDescription>
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
                <CardTitle className="text-2xl capitalize">{status}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-xs">
                {seatUsage.maxSeats > 0
                  ? `${seatUsage.usedSeats} / ${seatUsage.maxSeats} seats used`
                  : `${seatUsage.usedSeats} active seats`}
              </CardContent>
            </Card>
          </div>

          {usage && (
            <div>
              <h3 className="text-muted-foreground mb-3 text-sm font-medium">
                Usage statistics
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <CardDescription>Members</CardDescription>
                    <Users className="text-muted-foreground size-4" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">
                      {formatUsageValue(
                        'memberCount',
                        usage.memberCount ??
                          (usage as { usersCount?: number }).usersCount,
                      )}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <CardDescription>Storage</CardDescription>
                    <HardDrive className="text-muted-foreground size-4" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">
                      {formatUsageValue(
                        'storageUsed',
                        usage.storageUsed ?? organization?.usage?.storageUsed,
                      )}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <CardDescription>API calls</CardDescription>
                    <Activity className="text-muted-foreground size-4" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">
                      {formatUsageValue(
                        'apiCalls',
                        usage.apiCalls ?? organization?.usage?.apiCallsUsed,
                      )}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div />
            <div className="flex flex-wrap items-center gap-2">
              {canInvite &&
                (canInviteTeam ? (
                  <Button type="button" onClick={handleInviteMember}>
                    <UserPlus className="mr-2 size-4" />
                    Invite member
                  </Button>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0}>
                          <Button
                            type="button"
                            disabled
                            className="pointer-events-none"
                          >
                            <Lock className="mr-2 size-4" />
                            Invite member
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upgrade your plan to invite members</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              {!fixedTenantId && (
                <Button variant="outline" asChild>
                  <Link href={`/organizations/${selectedTenantId}/members`}>
                    Full members page
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {invitations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pending invitations</CardTitle>
                <CardDescription>
                  Invitations waiting to be accepted
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PendingInvitations
                  invitations={invitations}
                  onUpdate={reloadDashboard}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                Team members ({members.length}
                {maxMembers !== undefined ? ` / ${maxMembers}` : ''})
              </CardTitle>
              <CardDescription>
                People with access to this organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MembersList
                members={members}
                tenantId={selectedTenantId}
                onUpdate={reloadDashboard}
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <p className="text-muted-foreground text-sm">
          Select an organization to load details.
        </p>
      )}
    </section>
  );
}
