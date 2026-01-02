'use client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { createKnowledgeBaseAction } from '@/actions/knowledgeBaseAction';
import { useModalStore } from '@/stores/useModalStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const CreateKnowledgeBaseModal = () => {
  const { data: session } = useSession();
  const { isOpen, onClose } = useModalStore();
  const [name, setName] = useState('');

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      if (!session?.accessToken) {
        console.error('Token not found');
        return Promise.reject(new Error('Token not found'));
      }
      return createKnowledgeBaseAction(name, session.accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['knowledgeBasesList', session?.accessToken],
      });
      onClose();
      setName('');
    },
    onError: error => {
      console.error(' failed', error);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new workspace</DialogTitle>
        </DialogHeader>
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          type="text"
          disabled={isPending}
          autoFocus
          placeholder="Name"
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
            className="bg-blue-700 disabled:opacity-100"
            onClick={() => mutate()}
            disabled={isPending || !name?.trim()}
          >
            {isPending && <LoaderCircle className="mr-2 animate-spin" />}
            {isPending ? 'Saving...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateKnowledgeBaseModal;
