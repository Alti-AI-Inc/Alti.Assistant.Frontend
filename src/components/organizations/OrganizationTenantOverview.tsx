'use client';

import {
  getPendingInvitations,
  getTenantMemberByTenantId,
  getTenantMembers,
  inviteMember,
} from '@/actions/memberActions';
import {
  getCurrentTenant,
  getTenantById,
  getTenantUsage,
} from '@/actions/tenantActions';
import { MembersList } from '@/components/organizations/MembersList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTenant } from '@/contexts/TenantContext';
import type {
  Tenant,
  TenantInvitation,
  TenantMember,
  TenantUsage,
  UserTenant,
} from '@/types/tenant';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

export interface OrganizationTenantOverviewProps {
  /** Org picker list; omit when `fixedTenantId` is set */
  organizations?: UserTenant[];
  /** Lock to one tenant (no switcher). Use on `/organizations/[tenantId]/members`. */
  fixedTenantId?: string;
  /** View mode to show only form, only list, or both */
  view?: 'invite' | 'members' | 'both';
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

export function OrganizationTenantOverview({
  organizations = [],
  fixedTenantId,
  view = 'both',
}: OrganizationTenantOverviewProps) {
  const { data: session, status: sessionStatus } = useSession();
  const { mode, currentTenant, switchToTenantMode } = useTenant();

  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [organization, setOrganization] = useState<Tenant | null>(null);
  const [members, setMembers] = useState<TenantMember[]>([]);
  const [invitations, setInvitations] = useState<TenantInvitation[]>([]);
  const [usage, setUsage] = useState<TenantUsage | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  /** Ignore late results if user switched org or navigated away mid-flight */
  const latestTenantLoadRef = useRef<string | null>(null);

  // Form states for the permanent invite box
  const [inviteFirstName, setInviteFirstName] = useState('');
  const [inviteLastName, setInviteLastName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [isInviting, setIsInviting] = useState(false);

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
        setInvitations([]);
      }

      if (
        usageSettled.status === 'fulfilled' &&
        usageSettled.value.success &&
        usageSettled.value.data
      ) {
        setUsage(usageSettled.value.data);
      } else {
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
  }, [selectedTenantId, sessionStatus, hasAccessToken, fixedTenantId]);

  const canInvite = useMemo(() => {
    if (!selectedTenantId) return false;
    const role = session?.user?.tenants?.find(
      t => t.id === selectedTenantId,
    )?.role;
    return role === 'owner' || role === 'admin';
  }, [session?.user?.tenants, selectedTenantId]);

  const reloadDashboard = useCallback((): Promise<void> => {
    if (!selectedTenantId) return Promise.resolve();
    return loadTenantDashboard(selectedTenantId);
  }, [selectedTenantId, loadTenantDashboard]);

  const handleSendInvite = async () => {
    if (!selectedTenantId || !session?.accessToken) return;

    if (!inviteEmail.trim()) {
      toast.error('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsInviting(true);
    try {
      const response = await inviteMember({
        tenantId: selectedTenantId,
        email: inviteEmail.trim(),
        role: inviteRole || 'member',
        message: '',
      });

      if (response.success && response.data) {
        // Save the invited name locally
        if (typeof window !== 'undefined') {
          try {
            const saved = localStorage.getItem('alti_invited_names') || '{}';
            const parsed = JSON.parse(saved);
            parsed[inviteEmail.toLowerCase().trim()] = {
              firstName: inviteFirstName.trim(),
              lastName: inviteLastName.trim(),
            };
            localStorage.setItem('alti_invited_names', JSON.stringify(parsed));
          } catch (e) {
            console.error(e);
          }
        }

        toast.success('Invitation sent successfully!');
        setInviteFirstName('');
        setInviteLastName('');
        setInviteEmail('');
        setInviteRole('');
        void reloadDashboard();
      } else {
        toast.error(response.message || 'Failed to send invitation');
      }
    } catch (error: any) {
      console.error('Failed to invite member:', error);
      toast.error(error?.message || 'An error occurred while sending the invitation');
    } finally {
      setIsInviting(false);
    }
  };

  // Combine active members and pending invitations for the unified list table
  const combinedMembers = useMemo(() => {
    const active = members.map(m => ({
      ...m,
      isInvitation: false,
    }));
    const pending = invitations.map(inv => ({
      _id: inv.id,
      userId: {
        _id: `invite-${inv.id}`,
        email: inv.email,
      },
      tenantId: inv.tenantId || selectedTenantId,
      role: inv.role,
      tenantRole: inv.role,
      status: 'pending',
      joinedAt: undefined,
      isInvitation: true,
    }));
    return [...active, ...pending];
  }, [members, invitations]);

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
          {(view === 'both' || view === 'invite') && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Row 1: First Name & Last Name */}
              <Input
                id="first-name"
                type="text"
                placeholder="Enter First Name"
                value={inviteFirstName}
                onChange={(e) => setInviteFirstName(e.target.value)}
                className="h-10 text-xs md:text-sm border border-zinc-200 dark:border-zinc-800 !bg-white dark:!bg-zinc-900 focus:!bg-white dark:focus:!bg-zinc-900 focus-visible:!bg-white dark:focus-visible:!bg-zinc-900 active:!bg-white dark:active:!bg-zinc-900 autofill:!bg-white dark:autofill:!bg-zinc-900 autofill:shadow-[0_0_0_1000px_white_inset] dark:autofill:shadow-[0_0_0_1000px_#18181b_inset] focus:outline-none focus-visible:outline-none focus:ring-1 focus:ring-black/20 focus:shadow-sm focus-visible:ring-1 focus-visible:ring-black/20 focus-visible:shadow-sm rounded-lg"
                disabled={isInviting}
              />
              <Input
                id="last-name"
                type="text"
                placeholder="Enter Last Name"
                value={inviteLastName}
                onChange={(e) => setInviteLastName(e.target.value)}
                className="h-10 text-xs md:text-sm border border-zinc-200 dark:border-zinc-800 !bg-white dark:!bg-zinc-900 focus:!bg-white dark:focus:!bg-zinc-900 focus-visible:!bg-white dark:focus-visible:!bg-zinc-900 active:!bg-white dark:active:!bg-zinc-900 autofill:!bg-white dark:autofill:!bg-zinc-900 autofill:shadow-[0_0_0_1000px_white_inset] dark:autofill:shadow-[0_0_0_1000px_#18181b_inset] focus:outline-none focus-visible:outline-none focus:ring-1 focus:ring-black/20 focus:shadow-sm focus-visible:ring-1 focus-visible:ring-black/20 focus-visible:shadow-sm rounded-lg"
                disabled={isInviting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Row 2: Email & Role */}
              <Input
                id="email-address"
                type="email"
                placeholder="Enter Email Address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-10 text-xs md:text-sm border border-zinc-200 dark:border-zinc-800 !bg-white dark:!bg-zinc-900 focus:!bg-white dark:focus:!bg-zinc-900 focus-visible:!bg-white dark:focus-visible:!bg-zinc-900 active:!bg-white dark:active:!bg-zinc-900 autofill:!bg-white dark:autofill:!bg-zinc-900 autofill:shadow-[0_0_0_1000px_white_inset] dark:autofill:shadow-[0_0_0_1000px_#18181b_inset] focus:outline-none focus-visible:outline-none focus:ring-1 focus:ring-black/20 focus:shadow-sm focus-visible:ring-1 focus-visible:ring-black/20 focus-visible:shadow-sm rounded-lg"
                disabled={isInviting}
              />
              <Select
                value={inviteRole}
                onValueChange={setInviteRole}
                disabled={isInviting}
              >
                <SelectTrigger id="invite-role" className="!h-10 text-xs md:text-sm border border-zinc-200 dark:border-zinc-800 !bg-white dark:!bg-zinc-900 focus:!bg-white dark:focus:!bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-black/20 rounded-lg w-full">
                  <SelectValue placeholder="Select Role Type" />
                </SelectTrigger>
                <SelectContent className="border-black/10">
                  <SelectItem value="member" className="text-xs">User</SelectItem>
                  <SelectItem value="owner" className="text-xs">Manager</SelectItem>
                  <SelectItem value="admin" className="text-xs">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <div className="text-[10px] text-gray-500 max-w-none">
                <span className="font-semibold text-black dark:text-gray-300">Billing notice:</span> Adding a new team member adds an active seat to your plan at $25.00/month.
              </div>
              {canInvite && (
                <Button
                  onClick={handleSendInvite}
                  disabled={isInviting || !inviteEmail.trim()}
                  className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 text-xs h-10 px-6 rounded-lg shadow-md hover:shadow-lg transition-all shrink-0"
                >
                  {isInviting && <Loader2 className="mr-2 size-4 animate-spin shrink-0" />}
                  {isInviting ? 'Inviting...' : 'Invite Member'}
                </Button>
              )}
            </div>
          </div>
          )}

          {/* Unified Team Members List Table */}
          {(view === 'both' || view === 'members') && (
          <div className="space-y-2 pt-4">

            <MembersList
              members={combinedMembers}
              tenantId={selectedTenantId}
              onUpdate={reloadDashboard}
            />
          </div>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-xs">
          Select an organization to load details.
        </p>
      )}
    </section>
  );
}
