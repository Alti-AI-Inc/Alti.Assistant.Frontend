'use client';

import { removeMember, cancelInvitation } from '@/actions/memberActions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreVertical, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { memo, useState } from 'react';
import { toast } from 'sonner';
import { MemberRoleSelector } from './MemberRoleSelector';
import type { TenantMember } from '@/types/tenant';

interface MembersListProps {
  members: (TenantMember & { isInvitation?: boolean; firstName?: string; lastName?: string })[];
  tenantId: string;
  onUpdate: () => void | Promise<void>;
}

// LocalStorage helper for display names
const getInvitedName = (email: string) => {
  if (typeof window === 'undefined') return { firstName: '', lastName: '' };
  try {
    const saved = localStorage.getItem('alti_invited_names');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed[email.toLowerCase()]) {
        return parsed[email.toLowerCase()];
      }
    }
  } catch (e) {
    console.error(e);
  }
  return { firstName: '', lastName: '' };
};

function MembersListComponent({
  members,
  tenantId,
  onUpdate,
}: MembersListProps) {
  const { data: session } = useSession();
  const [memberToRemove, setMemberToRemove] = useState<any | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const tenantMembership = session?.user?.tenants?.find(
    t =>
      t.id === tenantId ||
      ('tenantId' in t &&
        String((t as { tenantId?: string }).tenantId) === tenantId),
  );
  const currentUserRole = tenantMembership?.role?.toLowerCase();

  /** Only organization owners may remove members or change roles (admins/members cannot). */
  const isTenantOwner = currentUserRole === 'owner';

  const handleRemoveMember = async () => {
    if (!memberToRemove || !session?.accessToken) return;

    setIsRemoving(true);
    try {
      let response;
      if (memberToRemove.isInvitation) {
        response = await cancelInvitation(memberToRemove._id);
      } else {
        response = await removeMember(memberToRemove.userId._id);
      }

      if (response.success) {
        toast.success(memberToRemove.isInvitation ? 'Invitation canceled successfully' : 'Member removed successfully');
        setMemberToRemove(null);
        onUpdate();
      } else {
        toast.error(response.message || 'Failed to remove');
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error('An error occurred while removing');
    } finally {
      setIsRemoving(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
        return 'default';
      case 'admin':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (members.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center text-xs">
        No members found
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-black/10 bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-black/[0.02]">
            <TableRow className="border-black/5">
              <TableHead className="text-black font-semibold text-xs py-3">First Name</TableHead>
              <TableHead className="text-black font-semibold text-xs py-3">Last Name</TableHead>
              <TableHead className="text-black font-semibold text-xs py-3">Email Address</TableHead>
              <TableHead className="text-black font-semibold text-xs py-3">User Role</TableHead>
              {isTenantOwner && <TableHead className="w-[50px] py-3"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members
              .filter(member => member?.userId?._id)
              .map(member => {
                const userId = member.userId._id;
                const email = member.userId.email;
                const isCurrentUser = userId === session?.user?.id;
                const isInvitation = member.isInvitation || member.status === 'pending';
                const memberRole = String(
                  member.tenantRole ?? member.role ?? 'member',
                ).toLowerCase();
                
                // Retrieve names with lookups
                const nameInfo = getInvitedName(email);
                const firstName = member.firstName || nameInfo.firstName || (isCurrentUser ? session?.user?.name?.split(' ')[0] : '') || '—';
                const lastName = member.lastName || nameInfo.lastName || (isCurrentUser ? session?.user?.name?.split(' ').slice(1).join(' ') : '') || '—';
                
                const canModify = isTenantOwner && !isCurrentUser && !isInvitation;

                return (
                  <TableRow key={member._id} className="border-black/5 hover:bg-black/[0.01] transition-colors">
                    <TableCell className="font-medium text-xs text-black py-3">
                      {firstName}
                    </TableCell>
                    <TableCell className="font-medium text-xs text-black py-3">
                      {lastName}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 py-3">
                      <div className="flex items-center gap-2">
                        <span>{email}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] bg-black/5 text-black px-1.5 py-0.5 rounded-full font-medium shrink-0">
                            You
                          </span>
                        )}
                        {isInvitation && (
                          <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200/50 px-1.5 py-0.5 rounded-full font-medium shrink-0">
                            Pending
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      {canModify ? (
                        <MemberRoleSelector
                          currentRole={memberRole}
                          memberId={userId}
                          viewerIsOwner
                          onUpdate={onUpdate}
                        />
                      ) : (
                        <Badge
                          variant={getRoleBadgeVariant(memberRole)}
                          className="capitalize text-[10px] px-2 py-0.5"
                        >
                          {memberRole === 'member' ? 'user' : memberRole}
                        </Badge>
                      )}
                    </TableCell>
                    {isTenantOwner && (
                      <TableCell className="py-3">
                        {!isCurrentUser && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 hover:bg-black/5 rounded-md"
                              >
                                <MoreVertical className="size-4 text-gray-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="border-black/10">
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 text-xs cursor-pointer"
                                onClick={() => setMemberToRemove(member)}
                              >
                                <Trash2 className="mr-2 size-4" />
                                {isInvitation ? 'Cancel Invitation' : 'Remove Member'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={open => !open && setMemberToRemove(null)}
      >
        <AlertDialogContent className="border-black/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black font-semibold">
              {memberToRemove?.isInvitation ? 'Cancel Invitation' : 'Remove Member'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 text-xs">
              Are you sure you want to {memberToRemove?.isInvitation ? 'cancel the invitation for' : 'remove'} {memberToRemove?.userId.email}?
              {!memberToRemove?.isInvitation && ' They will lose access to this organization immediately.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving} className="text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              disabled={isRemoving}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium"
            >
              {isRemoving ? 'Processing...' : (memberToRemove?.isInvitation ? 'Cancel Invitation' : 'Remove Member')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const MembersList = memo(MembersListComponent);
MembersList.displayName = 'MembersList';
