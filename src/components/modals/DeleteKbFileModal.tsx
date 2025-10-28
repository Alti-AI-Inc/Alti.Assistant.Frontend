'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteKnowledgeBaseFile } from '@/hooks/useKnowledgeBases';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useModalStore } from '@/stores/useModalStore';
import { LoaderCircle } from 'lucide-react';

export function DeleteKnowledgeBaseFileModal() {
  const { onClose, isOpen, actionId: fileId } = useModalStore();
  const { activeConversation } = useConversationsStore();

  const deleteMutation = useDeleteKnowledgeBaseFile(
    activeConversation?.knowledgebaseId,
    onClose,
  );

  const handleDelete = async () => {
    if (fileId) deleteMutation.mutate(fileId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none ring-0 outline-none sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 pt-4">
          <h1 className="">Are you sure you want to delete file?</h1>
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
