'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useModalStore } from '@/stores/useModalStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const RenameChat = () => {
  const { isOpen, onClose } = useModalStore();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Chat</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Chat Name"
          className="w-full border-0 px-3 py-2 shadow-none focus:ring-0 focus-visible:ring-0"
        />
        <Button className="ml-auto" type="submit" onClick={onClose}>
          Rename
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RenameChat;
