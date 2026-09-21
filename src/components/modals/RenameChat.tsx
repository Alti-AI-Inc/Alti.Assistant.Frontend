'use client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useModalStore } from '@/stores/useModalStore';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useRenameConversation } from '@/hooks/useConversations';

const RenameChat = () => {
  const { isOpen, onClose, actionId, title: currentTitle } = useModalStore();
  const [title, setTitle] = useState(currentTitle || '');

  useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle || '');
    }
  }, [isOpen, currentTitle]);

  const { mutate, isPending } = useRenameConversation();

  const handleRename = () => {
    const trimmed = title.trim();
    if (!trimmed || !actionId || isPending) return;
    mutate({ conversationId: actionId, newTitle: trimmed });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Chat</DialogTitle>
        </DialogHeader>
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          type="text"
          disabled={isPending}
          autoFocus
          placeholder="New title"
          className="w-full px-3 py-2 shadow-none focus:ring-0 focus-visible:ring-0 bg-white text-black"
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleRename();
            }
          }}
        />
        <DialogFooter className="justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-white text-black hover:bg-zinc-100 hover:text-black border-zinc-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRename}
            disabled={isPending || !title?.trim()}
          >
            {isPending && <LoaderCircle className="mr-2 animate-spin" />}
            {isPending ? 'Renaming...' : 'Rename'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RenameChat;
