'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export function ChangePassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start">Change Password</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-2xl font-bold">
          Change Password
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-right">
              Current Password
            </Label>
            <Input
              id="name"
              type="password"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-right">
              New Password
            </Label>
            <Input
              id="username"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Confirm New Password</Label>
            <Input
              id="username"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full" type="submit">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
