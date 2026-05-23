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
    <section className="space-y-6">
      {isLoadingDashboard ? (
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-[200px] rounded-lg" />
        </div>
      ) : selectedTenantId ? (
        <>
          {/* Vercel-style Header (Title on left, Invite button on right) */}
          <div className="flex items-center justify-between border-b border-black/10 pb-5">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-black">
                Team Members
              </h2>
              <p className="text-gray-500 text-xs mt-1">
                Manage your team members and their roles.
              </p>
            </div>
            <div>
              {canInvite &&
                (canInviteTeam ? (
                  <Button type="button" onClick={handleInviteMember} className="bg-black text-white hover:bg-black/90 text-xs h-9">
                    <UserPlus className="mr-2 size-4" />
                    Invite Member
                  </Button>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0}>
                          <Button
                            type="button"
                            disabled
                            className="pointer-events-none text-xs h-9"
                          >
                            <Lock className="mr-2 size-4" />
                            Invite Member
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Upgrade your plan to invite members</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
            </div>
          </div>

          {/* Pending Invitations Section */}
          {invitations.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-black">Pending Invitations</h3>
              <div className="rounded-lg border border-black/10 bg-white p-4">
                <PendingInvitations
                  invitations={invitations}
                  onUpdate={reloadDashboard}
                />
              </div>
            </div>
          )}

          {/* Team Members List Table (Simple table without nested Card) */}
          <div className="space-y-2 pt-2">
            <MembersList
              members={members}
              tenantId={selectedTenantId}
              onUpdate={reloadDashboard}
            />
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-xs">
          Select an organization to load details.
        </p>
      )}
    </section>
  );
}
