'use client';

import { getTenantMembers, getPendingInvitations } from '@/actions/memberActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useModalStore } from '@/stores/useModalStore';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { MembersList } from '@/components/organizations/MembersList';
import { PendingInvitations } from '@/components/organizations/PendingInvitations';
import type { TenantMember, TenantInvitation } from '@/types/tenant';

export default function OrganizationMembersPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = use(params);
  const { data: session } = useSession();
  const { onOpen } = useModalStore();
  const [members, setMembers] = useState<TenantMember[]>([]);
  const [invitations, setInvitations] = useState<TenantInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!session?.accessToken) return;

    setIsLoading(true);
    try {
      const [membersResponse, invitationsResponse] = await Promise.all([
        getTenantMembers(),
        getPendingInvitations(),
      ]);

      if (membersResponse.success && membersResponse.data) {
        setMembers(membersResponse.data);
      }

      if (invitationsResponse.success && invitationsResponse.data) {
        setInvitations(invitationsResponse.data);
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

  const handleInviteMember = () => {
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
        <Button onClick={handleInviteMember}>
          <UserPlus className="size-4 mr-2" />
          Invite Member
        </Button>
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
            <CardTitle>Team Members ({members.length})</CardTitle>
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
