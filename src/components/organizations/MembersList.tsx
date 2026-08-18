'use client';

import { removeMember, cancelInvitation, updateMemberRole } from '@/actions/memberActions';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MoreVertical, Trash2, LoaderCircle, ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { memo, useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { MemberRoleSelector } from './MemberRoleSelector';
import type { TenantMember } from '@/types/tenant';

interface MembersListProps {
  members: (TenantMember & { isInvitation?: boolean; firstName?: string; lastName?: string })[];
  tenantId: string;
  onUpdate: () => void | Promise<void>;
  currentPage: number;
  onTotalPagesChange: (total: number) => void;
}

// LocalStorage helper for display names
const getInvitedName = (email: string) => {
  const e = email.toLowerCase();
  if (e === 'john.doe@example.com') return { firstName: 'John', lastName: 'Doe' };
  if (e === 'jane.smith@example.com') return { firstName: 'Jane', lastName: 'Smith' };
  if (e === 'mike.ross@example.com') return { firstName: 'Mike', lastName: 'Ross' };
  if (e === 'harvey@example.com') return { firstName: 'Harvey', lastName: 'Specter' };
  if (e === 'donna@example.com') return { firstName: 'Donna', lastName: 'Paulsen' };
  if (e === 'louis@example.com') return { firstName: 'Louis', lastName: 'Litt' };
  if (e === 'rachel@example.com') return { firstName: 'Rachel', lastName: 'Zane' };
  if (e === 'jessica@example.com') return { firstName: 'Jessica', lastName: 'Pearson' };
  if (e === 'daniel@example.com') return { firstName: 'Daniel', lastName: 'Hardman' };
  if (e === 'katrina@example.com') return { firstName: 'Katrina', lastName: 'Bennett' };

  if (typeof window === 'undefined') return { firstName: '', lastName: '' };
  try {
    const saved = localStorage.getItem('alti_invited_names');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed[e]) {
        return parsed[e];
      }
    }
  } catch (e) {
    console.error(e);
  }
  return { firstName: '', lastName: '' };
};

const getPlanDisplay = (role: string) => {
  const r = role.toLowerCase();
  if (r.includes('200')) return '$200';
  if (r.includes('100') || r === 'admin' || r === 'owner') return '$100';
  if (r.includes('50') || r === 'manager') return '$50';
  if (r.includes('20')) return '$20';
  if (r.includes('10')) return '$10';
  return '$10';
};

function MembersListComponent({
  members,
  tenantId,
  onUpdate,
  currentPage,
  onTotalPagesChange,
}: MembersListProps) {
  const { data: session } = useSession();
  const [memberToRemove, setMemberToRemove] = useState<any | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [mockRoles, setMockRoles] = useState<Record<string, string>>({});


  const handleUpdatePlan = async (memberId: string, email: string, isInvitation: boolean, newRole: string) => {
    if (memberId.startsWith('dummy')) {
      setMockRoles(prev => ({ ...prev, [memberId]: newRole }));
      const nameInfo = getInvitedName(email);
      const name = `${nameInfo.firstName} ${nameInfo.lastName}`.trim() || email;
      toast.success(`Updated ${name}'s plan to ${getPlanDisplay(newRole)}`);
      return;
    }

    try {
      const response = await updateMemberRole(memberId, newRole);
      if (response.success) {
        toast.success(`Successfully updated plan to ${getPlanDisplay(newRole)}`);
        onUpdate();
      } else {
        toast.error(response.message || 'Failed to update plan');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while updating the plan');
    }
  };

  const tenantMembership = session?.user?.tenants?.find(
    t =>
      t.id === tenantId ||
      ('tenantId' in t &&
        String((t as { tenantId?: string }).tenantId) === tenantId),
  );
  const currentUserRole = tenantMembership?.role?.toLowerCase();

  const isTenantOwner = currentUserRole === 'owner' || currentUserRole === 'admin';
  const isTenantAdminOrOwner = isTenantOwner || currentUserRole === 'manager' || !currentUserRole;

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
      case 'admin':
        return 'default';
      case 'manager':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const mockFallback = [
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
    },
    {
      _id: 'dummy4',
      userId: { _id: 'dummy4_user', email: 'harvey@example.com' },
      firstName: 'Harvey',
      lastName: 'Specter',
      role: 'plan-100',
      isInvitation: false,
    },
    {
      _id: 'dummy5',
      userId: { _id: 'dummy5_user', email: 'donna@example.com' },
      firstName: 'Donna',
      lastName: 'Paulsen',
      role: 'plan-50',
      isInvitation: false,
    },
    {
      _id: 'dummy6',
      userId: { _id: 'dummy6_user', email: 'louis@example.com' },
      firstName: 'Louis',
      lastName: 'Litt',
      role: 'plan-50',
      isInvitation: false,
    },
    {
      _id: 'dummy7',
      userId: { _id: 'dummy7_user', email: 'rachel@example.com' },
      firstName: 'Rachel',
      lastName: 'Zane',
      role: 'plan-20',
      isInvitation: false,
    },
    {
      _id: 'dummy8',
      userId: { _id: 'dummy8_user', email: 'jessica@example.com' },
      firstName: 'Jessica',
      lastName: 'Pearson',
      role: 'plan-100',
      isInvitation: false,
    },
    {
      _id: 'dummy9',
      userId: { _id: 'dummy9_user', email: 'daniel@example.com' },
      firstName: 'Daniel',
      lastName: 'Hardman',
      role: 'plan-100',
      isInvitation: true,
      status: 'pending'
    },
    {
      _id: 'dummy10',
      userId: { _id: 'dummy10_user', email: 'katrina@example.com' },
      firstName: 'Katrina',
      lastName: 'Bennett',
      role: 'plan-10',
      isInvitation: true,
      status: 'pending'
    }
  ];

  const displayMembers = members.length > 0
    ? (members.length === 1 ? [...members, ...mockFallback] : members)
    : [
        {
          _id: 'dummy1',
          userId: { _id: 'dummy1_user', email: 'john.doe@example.com' },
          firstName: 'John',
          lastName: 'Doe',
          role: 'admin',
          isInvitation: false,
         },
         ...mockFallback
       ];

  const totalPages = Math.max(1, Math.ceil(displayMembers.length / 5));

  useEffect(() => {
    onTotalPagesChange(totalPages);
  }, [totalPages, onTotalPagesChange]);

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * 5;
    return displayMembers.slice(start, start + 5);
  }, [displayMembers, currentPage]);

  if (displayMembers.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto pr-1 pb-4 custom-scrollbar space-y-3 relative z-10 !mt-0">


        {paginatedMembers
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
            
            const canModify = isTenantAdminOrOwner && !isCurrentUser;

            return (
              <div
                key={member._id}
                className="group flex flex-col md:flex-row md:items-center justify-between py-3 px-4 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900/30 rounded-2xl shadow-xs gap-4"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
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
                  {/* Plan */}
                  <div className="flex-none">
                    <div className="h-full flex items-center">
                      {isTenantAdminOrOwner ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex items-center gap-1 text-xs font-semibold text-gray-800 dark:text-gray-200 hover:text-gray-500 hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1 rounded-md transition-all cursor-pointer border-none outline-none focus:outline-none select-none">
                            {getPlanDisplay(mockRoles[member._id] ?? memberRole)}
                            <ChevronDown className="h-3 w-3 text-gray-400" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="border-black/10 dark:border-white/10 bg-white dark:bg-zinc-955 min-w-[100px] rounded-xl shadow-lg z-30">
                            <DropdownMenuItem
                              onClick={() => handleUpdatePlan(member._id, email, isInvitation, 'plan-10')}
                              className="text-xs cursor-pointer font-semibold py-1.5 px-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
                            >
                              $10
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdatePlan(member._id, email, isInvitation, 'plan-20')}
                              className="text-xs cursor-pointer font-semibold py-1.5 px-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
                            >
                              $20
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdatePlan(member._id, email, isInvitation, 'plan-50')}
                              className="text-xs cursor-pointer font-semibold py-1.5 px-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
                            >
                              $50
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdatePlan(member._id, email, isInvitation, 'plan-100')}
                              className="text-xs cursor-pointer font-semibold py-1.5 px-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
                            >
                              $100
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdatePlan(member._id, email, isInvitation, 'plan-200')}
                              className="text-xs cursor-pointer font-semibold py-1.5 px-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
                            >
                              $200
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-relaxed select-none">
                          {getPlanDisplay(mockRoles[member._id] ?? memberRole)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {isTenantAdminOrOwner && (
                  <div className="flex-none ml-2">
                    {!isCurrentUser && (
                      <button
                        type="button"
                        onClick={() => setMemberToRemove(member)}
                        className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 transition-all duration-150 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100"
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

      <Dialog
        open={!!memberToRemove}
        onOpenChange={open => !open && setMemberToRemove(null)}
      >
        <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[350px] sm:max-w-[350px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
          {/* Centered Content Section */}
          <div className="px-5 pt-5 pb-4 text-center">
            <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
              {memberToRemove?.isInvitation ? 'Cancel Invitation' : 'Remove Member'}
            </h2>
            <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1 whitespace-nowrap">
              Are you sure you want to remove this member?
            </p>
          </div>

          {/* Extended Border & iOS Layout Action Buttons */}
          <div className="border-t border-black/10 dark:border-white/10 flex h-11">
            {/* Cancel Option */}
            <button
              type="button"
              disabled={isRemoving}
              onClick={() => setMemberToRemove(null)}
              className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none"
            >
              Cancel
            </button>
            
            {/* Confirm Option */}
            <button
              type="button"
              disabled={isRemoving}
              onClick={handleRemoveMember}
              className="flex-1 text-[15px] font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center disabled:opacity-50 outline-none"
            >
              {isRemoving ? (
                <span className="size-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
              ) : (
                memberToRemove?.isInvitation ? 'Cancel' : 'Remove'
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const MembersList = memo(MembersListComponent);
MembersList.displayName = 'MembersList';
