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
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
    const r = role.toLowerCase();
    if (r === 'admin' || r === 'owner') return 'default';
    if (r === 'manager') return 'secondary';
    return 'outline';
  };

  let normalizedRole = String(currentRole ?? 'user').toLowerCase();
  if (normalizedRole === 'owner') normalizedRole = 'admin';
  if (normalizedRole === 'member') normalizedRole = 'user';

  /** Tenant supports admin + manager + user; legacy values map to user for the control. */
  const supportedTenantRoles = new Set(['admin', 'manager', 'user']);
  const selectValue = supportedTenantRoles.has(normalizedRole)
    ? normalizedRole
    : 'user';

  // We removed the restriction that only owners can edit admins/owners.
  // The backend will enforce actual permissions.

  const formatRoleLabel = (role: string) => {
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
          <SelectItem value={TenantRole.USER}>
            <span className="capitalize">User</span>
          </SelectItem>
          <SelectItem value={TenantRole.ADMIN}>
            <span className="capitalize">Admin</span>
          </SelectItem>
          <SelectItem value={TenantRole.MANAGER}>
            <span className="capitalize">Manager</span>
          </SelectItem>
        </SelectContent>
      </Select>

      <Dialog
        open={!!pendingRole}
        onOpenChange={open => !open && setPendingRole(null)}
      >
        <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[380px] sm:max-w-[380px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
          {/* Centered Content Section */}
          <div className="px-5 pt-5 pb-4 text-center">
            <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
              Change Role
            </h2>
            <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1 whitespace-nowrap">
              Are you sure you want to change this member role?
            </p>
          </div>

          {/* Extended Border & iOS Layout Action Buttons */}
          <div className="border-t border-black/10 dark:border-white/10 flex h-11">
            {/* Cancel Option */}
            <button
              type="button"
              disabled={isChanging}
              onClick={() => setPendingRole(null)}
              className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none"
            >
              Cancel
            </button>
            
            {/* Confirm Option */}
            <button
              type="button"
              disabled={isChanging}
              onClick={handleRoleChange}
              className="flex-1 text-[15px] font-medium text-primary hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center disabled:opacity-50 outline-none"
            >
              {isChanging ? (
                <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                'Change'
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
