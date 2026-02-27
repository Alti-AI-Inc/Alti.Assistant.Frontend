'use client';

import { getTenantMembers, getPendingInvitations } from '@/actions/memberActions';
import { getCurrentTenant } from '@/actions/tenantActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTenant } from '@/contexts/TenantContext';
import { useModalStore } from '@/stores/useModalStore';
import { ArrowLeft, Lock, UserPlus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MembersList } from '@/components/organizations/MembersList';
import { PendingInvitations } from '@/components/organizations/PendingInvitations';
import type { Tenant, TenantMember, TenantInvitation } from '@/types/tenant';

export default function OrganizationMembersPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = use(params);
  const { data: session } = useSession();
  const { onOpen } = useModalStore();
  const { switchToTenantMode } = useTenant();
  const [members, setMembers] = useState<TenantMember[]>([]);
  const [invitations, setInvitations] = useState<TenantInvitation[]>([]);
  const [organization, setOrganization] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!session?.accessToken) return;

    setIsLoading(true);
    try {
      // Ensure tenant context is set in the JWT before hitting tenant-scoped endpoints
      await switchToTenantMode(tenantId);

      const [membersResponse, invitationsResponse, orgResponse] = await Promise.all([
        getTenantMembers(),
        getPendingInvitations(),
        getCurrentTenant(),
      ]);

      if (membersResponse.success && membersResponse.data) {
        setMembers(Array.isArray(membersResponse.data) ? membersResponse.data : []);
      }

      if (invitationsResponse.success && invitationsResponse.data) {
        setInvitations(Array.isArray(invitationsResponse.data) ? invitationsResponse.data : []);
      }

      if (orgResponse.success && orgResponse.data) {
        setOrganization(orgResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch members data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId, session?.accessToken]);

  // ── Access control ──────────────────────────────────────────────
  const currentUserRole = session?.user?.tenants?.find(
    (t) => t.id === tenantId
  )?.role;
  const canInvite = currentUserRole === 'owner' || currentUserRole === 'admin';
  const canInviteTeam = organization?.subscription?.price?.features?.canInviteTeam ?? true;
  const maxMembers = organization?.settings?.maxMembers;

  const handleInviteMember = () => {
    // Member limit pre-check
    if (maxMembers !== undefined && members.length >= maxMembers) {
      toast.error('Member limit reached. Upgrade your plan to add more members.', {
        action: {
          label: 'Manage Billing',
          onClick: () => window.location.assign(`/organizations/${tenantId}/billing`),
        },
      });
      return;
    }

    onOpen({
      type: 'invite-member',
      actionId: tenantId,
      onConfirm: fetchData,
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <Skeleton className="h-8 w-64 mb-8" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <Link
        href={`/organizations/${tenantId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage team members and invitations
          </p>
        </div>

        {/* Invite button — hidden for non-admin/owner, disabled tooltip for plan restriction */}
        {canInvite && (
          canInviteTeam ? (
            <Button onClick={handleInviteMember}>
              <UserPlus className="size-4 mr-2" />
              Invite Member
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0}>
                    <Button disabled className="pointer-events-none">
                      <Lock className="size-4 mr-2" />
                      Invite Member
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upgrade your plan to invite members</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        )}
      </div>

      <div className="space-y-6">
        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                Invitations waiting to be accepted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PendingInvitations
                invitations={invitations}
                onUpdate={fetchData}
              />
            </CardContent>
          </Card>
        )}

        {/* Active Members */}
        <Card>
          <CardHeader>
            <CardTitle>
              Team Members ({members.length}
              {maxMembers !== undefined ? ` / ${maxMembers}` : ''})
            </CardTitle>
            <CardDescription>
              People who have access to this organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MembersList
              members={members}
              tenantId={tenantId}
              onUpdate={fetchData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
