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

export function InviteFriends() {
  const { onClose, isOpen } = useModalStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogOut = async () => {
    setIsLoading(true);

    onClose();

  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none ring-0 outline-none sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Invite Friends</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 pt-4">
          <h1 className="">Invite a friend and get $20 for you and $20 for your friend.</h1>
        </div>
      </DialogContent>
    </Dialog>
  );
}
