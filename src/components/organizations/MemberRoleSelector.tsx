'use client';

import { updateMemberRole } from '@/actions/memberActions';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { TenantRole } from '@/types/tenant';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface MemberRoleSelectorProps {
  currentRole: TenantRole | string;
  memberId: string;
  onUpdate: () => void;
}

export function MemberRoleSelector({
  currentRole,
  memberId,
  onUpdate,
}: MemberRoleSelectorProps) {
  const { data: session } = useSession();
  const [isChanging, setIsChanging] = useState(false);
  const [pendingRole, setPendingRole] = useState<string | null>(null);

  const handleRoleChange = async () => {
    if (!pendingRole || !session?.accessToken) return;

    setIsChanging(true);
    try {
      const response = await updateMemberRole(memberId, pendingRole);

      if (response.success) {
        toast.success('Member role updated successfully');
        setPendingRole(null);
        onUpdate();
      } else {
        toast.error(response.message || 'Failed to update role');
      }
    } catch (error) {
      console.error('Failed to update role:', error);
      toast.error('An error occurred while updating the role');
    } finally {
      setIsChanging(false);
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

  // If member is owner, show badge only (owners can't be changed)
  if (currentRole === TenantRole.OWNER || currentRole === 'owner') {
    return (
      <Badge variant={getRoleBadgeVariant(currentRole)} className="capitalize">
        {currentRole}
      </Badge>
    );
  }

  return (
    <>
      <Select
        value={currentRole}
        onValueChange={(value) => setPendingRole(value)}
        disabled={isChanging}
      >
        <SelectTrigger className="w-[120px] h-8">
          <SelectValue>
            <span className="capitalize">{currentRole}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TenantRole.ADMIN}>
            <span className="capitalize">{TenantRole.ADMIN}</span>
          </SelectItem>
          <SelectItem value={TenantRole.MEMBER}>
            <span className="capitalize">{TenantRole.MEMBER}</span>
          </SelectItem>
        </SelectContent>
      </Select>

      <AlertDialog
        open={!!pendingRole}
        onOpenChange={(open) => !open && setPendingRole(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Member Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this member&apos;s role to{' '}
              <span className="font-semibold capitalize">{pendingRole}</span>?
              This will change their permissions immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isChanging}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRoleChange} disabled={isChanging}>
              {isChanging ? 'Updating...' : 'Change Role'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
