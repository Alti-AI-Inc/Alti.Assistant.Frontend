'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModalStore } from '@/stores/useModalStore';
import { useRouter } from 'next/navigation';

export function Logout() {
  const { onClose, isOpen } = useModalStore();
  const router = useRouter();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger asChild>
        <Button className="w-full justify-start">Logout</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 pt-4">
          <h1 className="">Are you sure you want to logout?</h1>
          <div className="mt-4 flex w-full justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                router.push('/');
                onClose();
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
