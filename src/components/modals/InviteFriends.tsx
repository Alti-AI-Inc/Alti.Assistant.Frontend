'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useModalStore } from '@/stores/useModalStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SendInviteButton from '../SendInviteButton';
import { Input } from '../ui/input';

export function InviteFriends() {
  const { onClose, isOpen } = useModalStore();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogOut = async () => {
    setIsLoading(true);

    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none ring-0 outline-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Friend</DialogTitle>
        </DialogHeader>
        <div className="">
          <h1 className="">Invite a friend to join the alti assistant.</h1>
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter email"
              className="mt-4"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <SendInviteButton
                content={email}
                className="mr-1"
                onClose={onClose}
              />
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
