'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

export function Logout({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button className="w-full justify-start">Logout</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 pt-4">
          <h1 className="">
            Are you sure you want to logout?
          </h1>
          <div className="flex w-full justify-end mt-4 gap-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => router.push('/')}>Logout</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
