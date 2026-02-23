'use client';

import { cancelInvitation } from '@/actions/memberActions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Clock, Copy, MoreVertical, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import type { TenantInvitation } from '@/types/tenant';

interface PendingInvitationsProps {
  invitations: TenantInvitation[];
  onUpdate: () => void;
}

export function PendingInvitations({
  invitations,
  onUpdate,
}: PendingInvitationsProps) {
  const { data: session } = useSession();

  const handleCopyLink = (token: string) => {
    const inviteUrl = `${window.location.origin}/accept-invite/${token}`;
    navigator.clipboard.writeText(inviteUrl);
    toast.success('Invitation link copied to clipboard');
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (!session?.accessToken) return;

    try {
      const response = await cancelInvitation(invitationId);

      if (response.success) {
        toast.success('Invitation cancelled successfully');
        onUpdate();
      } else {
        toast.error(response.message || 'Failed to cancel invitation');
      }
    } catch (error) {
      console.error('Failed to cancel invitation:', error);
      toast.error('An error occurred while cancelling the invitation');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'expired':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (invitations.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        No pending invitations
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => {
            const expired = isExpired(invitation.expiresAt);

            return (
              <TableRow key={invitation.id}>
                <TableCell className="font-medium">{invitation.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {invitation.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      expired
                        ? 'destructive'
                        : getStatusBadgeVariant(invitation.status)
                    }
                    className="capitalize"
                  >
                    {expired ? 'Expired' : invitation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="size-3.5" />
                    {invitation.expiresAt
                      ? new Date(invitation.expiresAt).toLocaleDateString()
                      : 'Never'}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleCopyLink(invitation.token)}
                      >
                        <Copy className="size-4 mr-2" />
                        Copy Invite Link
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleCancelInvitation(invitation.id)}
                      >
                        <Trash2 className="size-4 mr-2" />
                        Cancel Invitation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
