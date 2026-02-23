'use client';

import { removeMember } from '@/actions/memberActions';
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
import { useState } from 'react';
import { toast } from 'sonner';
import { MemberRoleSelector } from './MemberRoleSelector';
import type { TenantMember } from '@/types/tenant';

interface MembersListProps {
  members: TenantMember[];
  tenantId: string;
  onUpdate: () => void;
}

export function MembersList({ members, tenantId, onUpdate }: MembersListProps) {
  const { data: session } = useSession();
  const [memberToRemove, setMemberToRemove] = useState<TenantMember | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const currentUserRole = session?.user?.tenants?.find(
    (t) => t.id === tenantId
  )?.role;

  const canManageMembers = currentUserRole === 'owner' || currentUserRole === 'admin';

  const handleRemoveMember = async () => {
    if (!memberToRemove || !session?.accessToken) return;

    setIsRemoving(true);
    try {
      const response = await removeMember(memberToRemove.userId);

      if (response.success) {
        toast.success('Member removed successfully');
        setMemberToRemove(null);
        onUpdate();
      } else {
        toast.error(response.message || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error('An error occurred while removing the member');
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
      <div className="text-center py-8 text-muted-foreground">
        No members found
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              {canManageMembers && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const isCurrentUser = member.userId === session?.user?.id;
              const canModify = canManageMembers && !isCurrentUser && member.role !== 'owner';

              return (
                <TableRow key={member.userId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div>
                        {member.firstName || member.lastName ? (
                          <div>
                            {member.firstName} {member.lastName}
                          </div>
                        ) : (
                          <div className="text-muted-foreground">No name</div>
                        )}
                        {isCurrentUser && (
                          <span className="text-xs text-muted-foreground">(You)</span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    {canModify ? (
                      <MemberRoleSelector
                        currentRole={member.role}
                        memberId={member.userId}
                        onUpdate={onUpdate}
                      />
                    ) : (
                      <Badge variant={getRoleBadgeVariant(member.role)} className="capitalize">
                        {member.role}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {member.joinedAt
                      ? new Date(member.joinedAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  {canManageMembers && (
                    <TableCell>
                      {canModify && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setMemberToRemove(member)}
                            >
                              <Trash2 className="size-4 mr-2" />
                              Remove Member
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
        onOpenChange={(open) => !open && setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberToRemove?.email} from this
              organization? They will lose access immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              disabled={isRemoving}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isRemoving ? 'Removing...' : 'Remove Member'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
