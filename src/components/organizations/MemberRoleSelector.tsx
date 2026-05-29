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
  /** When true, owner may assign the owner role via PATCH /tenant/members/:id/role */
  viewerIsOwner?: boolean;
  onUpdate: () => void | Promise<void>;
}

export function MemberRoleSelector({
  currentRole,
  memberId,
  viewerIsOwner = false,
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
        await onUpdate();
      } else {
        toast.error(response.message || 'Failed to update role');
      }
    } catch (error) {
      console.error('Failed to update role:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'An error occurred while updating the role',
      );
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

  const normalizedRole = String(currentRole ?? 'member').toLowerCase();
  /** Tenant supports owner + admin + member; legacy values map to member for the control. */
  const supportedTenantRoles = new Set(['owner', 'admin', 'member']);
  const selectValue = supportedTenantRoles.has(normalizedRole)
    ? normalizedRole
    : 'member';

  // We removed the restriction that only owners can edit admins/owners.
  // The backend will enforce actual permissions.

  const formatRoleLabel = (role: string) => {
    if (role.toLowerCase() === 'member') return 'user';
    return role;
  };

  return (
    <>
      <Select
        key={`${memberId}-${selectValue}`}
        value={selectValue}
        onValueChange={value => {
          if (value === selectValue) return;
          setPendingRole(value);
        }}
        disabled={isChanging}
      >
        <SelectTrigger className="h-auto p-0 border-0 bg-transparent shadow-none hover:bg-transparent focus:ring-0 focus:outline-none focus:border-none focus:ring-offset-0 focus-visible:ring-0 w-auto gap-1">
          <SelectValue>
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-relaxed capitalize">
              {formatRoleLabel(
                supportedTenantRoles.has(normalizedRole)
                  ? normalizedRole
                  : selectValue
              )}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TenantRole.MEMBER}>
            <span className="capitalize">User</span>
          </SelectItem>
          <SelectItem value={TenantRole.ADMIN}>
            <span className="capitalize">Admin</span>
          </SelectItem>
          <SelectItem value={TenantRole.OWNER}>
            <span className="capitalize">Owner</span>
          </SelectItem>
        </SelectContent>
      </Select>

      <AlertDialog
        open={!!pendingRole}
        onOpenChange={open => !open && setPendingRole(null)}
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
