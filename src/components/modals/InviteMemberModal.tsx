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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useModalStore } from '@/stores/useModalStore';
import { TenantRole } from '@/types/tenant';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function InviteMemberModal() {
  const { data: session } = useSession();
  const { isOpen, type, actionId, onClose, onConfirm } = useModalStore();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>(TenantRole.MEMBER);
  const [isInviting, setIsInviting] =useState(false);

  const tenantId = actionId;
  const isModalOpen = isOpen && type === 'invite-member';

  const handleClose = () => {
    setEmail('');
    setRole(TenantRole.MEMBER);
    onClose();
  };

  const handleInvite = async () => {
    if (!tenantId || !session?.accessToken) return;

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsInviting(true);
    try {
      const response = await inviteMember({
        email: email.trim(),
        role,
      });

      if (response.success) {
        toast.success('Invitation sent successfully');
        handleClose();
        onConfirm?.();
      } else {
        toast.error(response.message || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Failed to invite member:', error);
      toast.error('An error occurred while sending the invitation');
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your organization. They&apos;ll receive an email
            with a link to accept.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              disabled={isInviting}
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleInvite();
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={role} onValueChange={setRole} disabled={isInviting}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TenantRole.ADMIN}>
                  <div>
                    <div className="font-medium capitalize">{TenantRole.ADMIN}</div>
                    <div className="text-xs text-muted-foreground">
                      Can manage members and settings
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value={TenantRole.MEMBER}>
                  <div>
                    <div className="font-medium capitalize">{TenantRole.MEMBER}</div>
                    <div className="text-xs text-muted-foreground">
                      Can use organization resources
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isInviting}>
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            disabled={isInviting || !email.trim()}
          >
            {isInviting && <Loader2 className="size-4 mr-2 animate-spin" />}
            {isInviting ? 'Sending...' : 'Send Invitation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
