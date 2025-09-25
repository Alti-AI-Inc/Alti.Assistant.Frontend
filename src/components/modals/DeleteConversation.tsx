'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteConversation } from '@/hooks/useConversations';
import { useModalStore } from '@/stores/useModalStore';
import { LoaderCircle } from 'lucide-react';

export function DeleteConversation() {
  const { onClose, isOpen, actionId } = useModalStore();

  const deleteMutation = useDeleteConversation();
  const handleDelete = async () => {
    if (actionId) deleteMutation.mutate(actionId);

    // onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none ring-0 outline-none sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 pt-4">
          <h1 className="">
            Are you sure you want to delete this conversation?
          </h1>
          <div className="mt-4 flex w-full justify-end gap-4">
            <Button
              variant="outline"
              className="focus-visible:ring-0"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && (
                <LoaderCircle className="animate-spin" />
              )}
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
