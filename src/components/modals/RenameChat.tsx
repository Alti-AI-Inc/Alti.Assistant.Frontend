'use client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { renameConversationAction } from '@/actions/conversationsAction';
import { useModalStore } from '@/stores/useModalStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const RenameChat = () => {
  const { data: session } = useSession();
  const { isOpen, onClose, actionId, title: currentTitle } = useModalStore();
  const [title, setTitle] = useState(currentTitle || '');

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      if (!session?.accessToken || !actionId) {
        console.error('Id not found');
        return Promise.reject(new Error('Id or Token not found'));
      }
      return renameConversationAction(actionId, title, session.accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: q =>
          q.queryKey[0] === 'conversations' ||
          q.queryKey[0] === 'saved-conversations',
      });
      onClose();
      setTitle('');
    },
    onError: error => {
      console.error('Rename failed', error);
    },
  });

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
          className="w-full px-3 py-2 shadow-none focus:ring-0 focus-visible:ring-0"
          onKeyPress={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              mutate();
            }
          }}
        />
        <DialogFooter className="justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => mutate()}
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
