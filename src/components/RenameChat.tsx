import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const RenameChat = ({
  open,
  setOpen,
  title,
  setTitle,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  setTitle: (title: string) => void;
}) => {
  const [value, setValue] = useState(title);

  const handleClose = () => {
    setTitle(value);
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Chat</DialogTitle>
        </DialogHeader>
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          type="text"
          placeholder="Chat Name"
          className="w-full border-0 px-3 py-2 shadow-none selection:bg-transparent selection:text-black focus:ring-0 focus-visible:ring-0"
        />
        <Button className="ml-auto" type="submit" onClick={handleClose}>Rename</Button>
      </DialogContent>
    </Dialog>
  );
};

export default RenameChat;
