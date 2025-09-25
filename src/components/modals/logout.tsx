'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModalStore } from '@/stores/useModalStore';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Logout() {
  const { onClose, isOpen } = useModalStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogOut = async () => {
    setIsLoading(true);
    await signOut({
      redirect: false,
    });
    router.push('/login');
    onClose();
    
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none ring-0 outline-none sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 pt-4">
          <h1 className="">Are you sure you want to logout?</h1>
          <div className="mt-4 flex w-full justify-end gap-4">
            <Button
              variant="outline"
              className="focus-visible:ring-0"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={handleLogOut}>
              {isLoading && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
              )}
              Logout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
