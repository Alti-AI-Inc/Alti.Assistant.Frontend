'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

export function Logout() {
  const router = useRouter();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start">Logout</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <h1 className="text-center">
            Are you sure you want to logout your account?
          </h1>
          <div className="flex w-full justify-center gap-4">
            <Button onClick={() => router.push('/')}>Logout</Button>
            <Button variant="destructive">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
