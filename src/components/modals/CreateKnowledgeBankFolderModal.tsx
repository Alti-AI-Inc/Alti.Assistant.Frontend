'use client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  useKnowledgeBankCreateFolderMutation,
  useKnowledgeBankGetFoldersQuery,
  useKnowledgeBankUpdateFolderMutation,
} from '@/hooks/useKnowledgeBank';
import { useModalStore } from '@/stores/useModalStore';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const CreateKnowledgeBankFolderModal = () => {
  const { isOpen, onClose, actionId } = useModalStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { mutate, isPending } = useKnowledgeBankCreateFolderMutation(onClose);
  const { mutate: rename, isPending: renamePending } =
    useKnowledgeBankUpdateFolderMutation(onClose);

  const { data: knowledgeBankFolders, isLoading: foldersLoading } =
    useKnowledgeBankGetFoldersQuery();

  useEffect(() => {
    if (actionId && knowledgeBankFolders) {
      const folder = knowledgeBankFolders.find(f => f.id === actionId);
      if (folder) {
        setName(folder.name);
        setDescription(folder.description || '');
      }
    } else {
      // Reset when creating new
      setName('');
      setDescription('');
    }
  }, [actionId, knowledgeBankFolders]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionId ? 'Update' : 'Create new '} knowledge bank folder
          </DialogTitle>
        </DialogHeader>
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          type="text"
          disabled={isPending || renamePending || foldersLoading}
          autoFocus
          placeholder="Name"
          className="w-full px-3 py-2 shadow-none focus:ring-0 focus-visible:ring-0"
        />
        <Input
          value={description}
          onChange={e => setDescription(e.target.value)}
          type="text"
          disabled={isPending || renamePending || foldersLoading}
          placeholder="Description"
          className="w-full px-3 py-2 shadow-none focus:ring-0 focus-visible:ring-0"
        />
        <DialogFooter className="justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-700 hover:bg-blue-800 disabled:opacity-100"
            onClick={() =>
              actionId
                ? rename({ name, description, folderId: actionId })
                : mutate({ name, description })
            }
            disabled={
              isPending ||
              renamePending ||
              foldersLoading ||
              !name?.trim() ||
              !description?.trim()
            }
          >
            {(isPending || renamePending) && (
              <LoaderCircle className="mr-2 animate-spin" />
            )}
            {isPending
              ? 'Saving...'
              : renamePending
                ? 'Updating...'
                : actionId
                  ? 'Update'
                  : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateKnowledgeBankFolderModal;
