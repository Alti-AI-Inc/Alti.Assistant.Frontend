'use client';

import { inviteMember } from '@/actions/memberActions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTenant } from '@/contexts/TenantContext';
import { useModalStore } from '@/stores/useModalStore';
import { TenantInvitation, TenantRole } from '@/types/tenant';
import { CheckCircle2, Copy, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function InviteMemberModal() {
  const { data: session } = useSession();
  const { activeTenantId, switchToTenantMode } = useTenant();
  const { isOpen, type, actionId, onClose, onConfirm } = useModalStore();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState<string>(TenantRole.USER);
  const [isInviting, setIsInviting] = useState(false);
  const [successInvitation, setSuccessInvitation] =
    useState<TenantInvitation | null>(null);

  const tenantId = actionId;
  const isModalOpen = isOpen && type === 'invite-member';

  const handleClose = () => {
    setEmail('');
    setMessage('');
    setRole(TenantRole.USER);
    setSuccessInvitation(null);
    onClose();
  };

  const handleDone = () => {
    onConfirm?.();
    handleClose();
  };

  const handleCopyLink = async (token: string) => {
    const inviteUrl = `${window.location.origin}/accept-invite/${token}`;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success('Invite link copied to clipboard');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleInvite = async () => {
    if (!tenantId || !session?.accessToken) return;

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsInviting(true);
    try {
      if (tenantId && activeTenantId !== tenantId) {
        await switchToTenantMode(tenantId);
      }

      const response = await inviteMember({
        tenantId,
        email: email.trim(),
        role,
        message: message.trim(),
      });

      if (response.success && response.data) {
        setSuccessInvitation(response.data);
      } else {
        toast.error(response.message || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Failed to invite member:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'An error occurred while sending the invitation',
      );
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        {successInvitation ? (
          /* ── Success state ── */
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <DialogTitle>Invitation Sent!</DialogTitle>
                  <DialogDescription>
                    An invitation has been sent to{' '}
                    <span className="text-foreground font-medium">
                      {successInvitation.email}
                    </span>
                    .
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-3 py-4">
              <p className="text-muted-foreground text-sm">
                Share this link directly if the email doesn&apos;t arrive:
              </p>
              <div className="bg-muted flex items-center gap-2 rounded-lg p-3">
                <code className="text-muted-foreground flex-1 truncate text-xs">
                  {`${window.location.origin}/accept-invite/${successInvitation.token}`}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  onClick={() => handleCopyLink(successInvitation.token)}
                >
                  <Copy className="size-4" />
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleDone} className="w-full">
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          /* ── Form state ── */
          <>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your organization. They&apos;ll
                receive an email with a link to accept.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  disabled={isInviting}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleInvite();
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-message">Message (optional)</Label>
                <Textarea
                  id="invite-message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Add a short note for the invitee..."
                  disabled={isInviting}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={role}
                  onValueChange={setRole}
                  disabled={isInviting}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TenantRole.USER}>
                      <div>
                        <div className="font-medium">
                          User
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Can use organization resources and tools
                        </div>
                      </div>
                    </SelectItem>

                    <SelectItem value={TenantRole.ADMIN}>
                      <div>
                        <div className="font-medium">
                          Admin
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Full control of the organization and billing
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border border-black/10 bg-black/[0.03] p-3 text-xs text-black shadow-xs">
                <p className="font-semibold text-black">
                  Billing Notice
                </p>
                <p className="mt-1 text-gray-500">
                  Adding this member will add an active seat to your organization plan. You will be billed <span className="font-semibold text-black">$25.00/month</span> for this member.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isInviting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleInvite}
                disabled={isInviting || !email.trim()}
              >
                {isInviting && <Loader2 className="mr-2 size-4 animate-spin" />}
                {isInviting ? 'Sending...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
