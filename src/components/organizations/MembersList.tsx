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

  const displayMembers = members.length > 0 ? members : [
    {
      _id: 'dummy1',
      userId: { _id: 'dummy1_user', email: 'john.doe@example.com' },
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      isInvitation: false,
    },
    {
      _id: 'dummy2',
      userId: { _id: 'dummy2_user', email: 'jane.smith@example.com' },
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'member',
      isInvitation: true,
      status: 'pending'
    },
    {
      _id: 'dummy3',
      userId: { _id: 'dummy3_user', email: 'mike.ross@example.com' },
      firstName: 'Mike',
      lastName: 'Ross',
      role: 'member',
      isInvitation: false,
    }
  ] as any;

  if (displayMembers.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto pr-1 pb-4 custom-scrollbar space-y-3 relative z-10 !mt-0">
        {/* Title Bar */}
        <div className="hidden md:flex items-center justify-between py-2 px-4 gap-4 sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-20 border-b border-black/10 dark:border-white/10 mb-4 rounded-t-lg">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">First Name</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Last Name</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email Address</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Role Type</span>
            </div>
          </div>
          {isTenantOwner && <div className="flex-none ml-2 w-7"></div>}
        </div>

        {displayMembers
          .filter((member: any) => member?.userId?._id)
          .map((member: any) => {
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
              <div
                key={member._id}
                className="group flex flex-col md:flex-row md:items-center justify-between py-3 px-4 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900/30 rounded-2xl shadow-xs transition-all duration-150 hover:bg-black/5 dark:hover:bg-white/5 gap-4"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
                  {/* First Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-relaxed">
                      {firstName}
                    </p>
                  </div>
                  {/* Last Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-relaxed">
                      {lastName}
                    </p>
                  </div>
                  {/* Email */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-relaxed">
                        {email}
                      </p>
                      {isCurrentUser && (
                        <span className="text-[10px] bg-black/5 text-black px-1.5 py-0.5 rounded-full font-medium shrink-0">
                          You
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Role */}
                  <div className="flex-1 min-w-0">
                    <div className="h-full flex items-center">
                      {canModify ? (
                        <MemberRoleSelector
                          currentRole={memberRole}
                          memberId={userId}
                          viewerIsOwner
                          onUpdate={onUpdate}
                        />
                      ) : (
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-relaxed capitalize">
                          {memberRole === 'member' ? 'user' : memberRole}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {isTenantOwner && (
                  <div className="flex-none ml-2">
                    {!isCurrentUser && (
                      <button
                        type="button"
                        onClick={() => setMemberToRemove(member)}
                        className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 transition-colors duration-150 flex items-center justify-center cursor-pointer"
                        title={isInvitation ? "Cancel Invitation" : "Remove Member"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
