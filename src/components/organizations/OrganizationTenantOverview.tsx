'use client';

import {
  getPendingInvitations,
  getTenantMemberByTenantId,
  getTenantMembers,
  inviteMember,
} from '@/actions/memberActions';
// Unused tenant actions removed to boost performance
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
import { Loader2, ArrowUp, ChevronDown } from 'lucide-react';
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
  currentPage?: number;
  onTotalPagesChange?: (total: number) => void;
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
  currentPage = 1,
  onTotalPagesChange = () => {},
}: OrganizationTenantOverviewProps) {
  const { data: session, status: sessionStatus } = useSession();
  const { mode, currentTenant, switchToTenantMode } = useTenant();

  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [members, setMembers] = useState<TenantMember[]>([]);
  const [invitations, setInvitations] = useState<TenantInvitation[]>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  /** Ignore late results if user switched org or navigated away mid-flight */
  const latestTenantLoadRef = useRef<string | null>(null);

  // Form states for the permanent invite box
  const [inviteFirstName, setInviteFirstName] = useState('');
  const [inviteLastName, setInviteLastName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPlanDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getPlanDisplay = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('200')) return '$200';
    if (r.includes('100')) return '$100';
    if (r.includes('50')) return '$50';
    if (r.includes('20')) return '$20';
    if (r.includes('10')) return '$10';
    return 'Select Plan';
  };

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
        setMembers([]);
        setInvitations([]);
        setIsLoadingDashboard(false);
        return;
      }

      latestTenantLoadRef.current = tenantId;
      setIsLoadingDashboard(true);

      const isStale = () => latestTenantLoadRef.current !== tenantId;

      // Skip context switcher call if we are already in the correct tenant
      if (currentTenant?.id !== tenantId) {
        try {
          await switchToTenantMode(tenantId);
        } catch {
          if (!isStale()) {
            setMembers([]);
            setInvitations([]);
            setIsLoadingDashboard(false);
          }
          return;
        }
      }

      if (isStale()) return;

      // For Invite tab only, we don't render members list or pending invitations.
      // So we can completely skip backend member queries and load instantly!
      if (view === 'invite') {
        if (!isStale()) {
          setIsLoadingDashboard(false);
        }
        return;
      }

      // Fetch only members and pending invitations in parallel
      const [membersSettled, invitationsSettled] = await Promise.allSettled([
        getTenantMembers(),
        getPendingInvitations(),
      ]);

      if (isStale()) return;

      let membersList: TenantMember[] = [];
      if (
        membersSettled.status === 'fulfilled' &&
        membersSettled.value.success &&
        Array.isArray(membersSettled.value.data)
      ) {
        membersList = membersSettled.value.data;
      }

      // Quick fallback if primary members check is empty
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

      if (!isStale()) {
        setMembers(membersList);
      }

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

      if (!isStale()) {
        setIsLoadingDashboard(false);
      }
    },
    [session?.accessToken, switchToTenantMode, currentTenant, view],
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
    return role === 'admin' || role === 'manager';
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
      {/* 1. Invite bar at the very top (above page title) */}
      {selectedTenantId && (view === 'both' || view === 'members' || view === 'invite') && (
        <div className="relative w-full h-12 flex-none flex items-center bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl shadow-sm pr-2 pl-4 transition-all gap-3">
          <input
            id="first-name"
            type="text"
            placeholder="First Name"
            value={inviteFirstName}
            onChange={(e) => setInviteFirstName(e.target.value)}
            disabled={isInviting}
            className="flex-1 min-w-0 h-full bg-transparent border-none py-0 text-sm text-gray-800 placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="h-6 w-[1px] bg-black/10 dark:bg-white/10 flex-none" />
          <input
            id="last-name"
            type="text"
            placeholder="Last Name"
            value={inviteLastName}
            onChange={(e) => setInviteLastName(e.target.value)}
            disabled={isInviting}
            className="flex-1 min-w-0 h-full bg-transparent border-none py-0 text-sm text-gray-800 placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="h-6 w-[1px] bg-black/10 dark:bg-white/10 flex-none" />
          <input
            id="email-address"
            type="email"
            placeholder="Email Address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            disabled={isInviting}
            className="flex-[1.2] min-w-0 h-full bg-transparent border-none py-0 text-sm text-gray-800 placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="h-6 w-[1px] bg-black/10 dark:bg-white/10 flex-none" />
          
          {/* Relative wrapper container for Select Plan and Send Invite */}
          <div ref={dropdownRef} className="relative flex items-center h-full flex-none">
            <button
              type="button"
              onClick={() => setIsPlanDropdownOpen(!isPlanDropdownOpen)}
              disabled={isInviting}
              className="h-full border-none border-0 shadow-none bg-transparent hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none rounded-none text-sm text-gray-800 dark:text-gray-100 w-[120px] px-3 font-normal py-0 flex items-center justify-between cursor-pointer select-none"
            >
              <span className={!inviteRole ? "text-gray-400 dark:text-gray-400" : ""}>
                {inviteRole ? getPlanDisplay(inviteRole) : 'Select Plan'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
            
            <div className="h-6 w-[1px] bg-black/10 dark:bg-white/10 flex-none" />
            
            <button
              type="button"
              onClick={handleSendInvite}
              disabled={isInviting || !inviteEmail.trim() || !inviteRole}
              className="flex-none h-full px-4 text-sm text-gray-800 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-300 disabled:opacity-40 transition-all cursor-pointer bg-transparent border-none outline-none focus:outline-none font-normal"
            >
              {isInviting ? 'Inviting' : 'Send Invite'}
            </button>

            {isPlanDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-955 border border-black/10 dark:border-white/10 rounded-xl shadow-lg z-50 overflow-hidden animate-in slide-in-from-top-2 duration-150 min-w-[260px]">
                <div className="flex flex-col p-1.5 gap-0.5 bg-white dark:bg-zinc-955">
                  {[
                    { val: 'plan-10', price: '$10/month', desc: '500 Search · 5 Research · 5 Monitor' },
                    { val: 'plan-20', price: '$20/month', desc: '1,000 Search · 10 Research · 10 Monitor' },
                    { val: 'plan-50', price: '$50/month', desc: '2,500 Search · 25 Research · 25 Monitor' },
                    { val: 'plan-100', price: '$100/month', desc: '5,000 Search · 50 Research · 50 Monitor' },
                    { val: 'plan-200', price: '$200/month', desc: '10,000 Search · 100 Research · 100 Monitor' },
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => {
                        setInviteRole(p.val);
                        setIsPlanDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex flex-col cursor-pointer ${
                        inviteRole === p.val ? 'bg-black/5 dark:bg-white/10' : ''
                      }`}
                    >
                      <span className="font-bold text-gray-900 dark:text-white text-xs">{p.price}</span>
                      <span className="font-normal text-zinc-500 dark:text-zinc-400 text-[10px] mt-0.5">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}



      {/* 3. Loading state / Members List below */}
      {isLoadingDashboard ? (
        <div className="space-y-4 pt-4">
          <Skeleton className="h-[200px] rounded-lg" />
        </div>
      ) : selectedTenantId ? (
        <>
          {(view === 'both' || view === 'members') && (
            <div className="space-y-2 pt-2">
              <MembersList
                members={combinedMembers}
                tenantId={selectedTenantId}
                onUpdate={reloadDashboard}
                currentPage={currentPage}
                onTotalPagesChange={onTotalPagesChange}
              />
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-xs pt-4">
          Select an organization to load details.
        </p>
      )}
    </section>
  );
}
