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
import CopyButton from '../CopyButton';
import SendInviteButton from '../SendInviteButton';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

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
          <div className='relative'>
            <Input
              type="text"
              placeholder="Enter email"
              className="mt-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0  flex items-center">
              <SendInviteButton content={email} className="mr-1" onClose={onClose}/>
            </div>
          </div>
          <div className='bg-gray-100 rounded-sm px-2 py-4 mt-6'>

            <div className="grid flex-1 gap-2">
              <Label htmlFor="link2" className="sr-only">
                Copy link and share with others
              </Label>
              <div className="relative">
                <Input
                  id="link2"
                  value='https://www.altiassistant.com/invite?inviteCode=e26b78ad-21c7-4558-af8d-6351f8e53a7f'
                  readOnly
                  className="pr-12 selection:bg-transparent selection:text-black truncate" // Add padding for the button
                />
                <div className="absolute inset-y-0 right-0 -mt-1 flex items-center">
                  <CopyButton content='https://www.altiassistant.com/invite?inviteCode=e26b78ad-21c7-4558-af8d-6351f8e53a7f' className="mr-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
