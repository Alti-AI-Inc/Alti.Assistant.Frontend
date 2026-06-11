'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export function AddMemberModal() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="default">Add Member</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
            <DialogDescription>
              Add below details of the member
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">First name</Label>
              <Input id="name-1" name="firstName" placeholder="Pedro" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name-2">Last name</Label>
              <Input id="name-2" name="lastName" placeholder="Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" placeholder="example@xyz.com" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={() => setIsOpen(false)}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
