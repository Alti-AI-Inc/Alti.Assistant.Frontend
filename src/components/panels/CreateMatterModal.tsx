'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface CreateMatterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateMatter: (matterName: string) => void;
  isLoading?: boolean;
}

export const CreateMatterModal = ({
  open,
  onOpenChange,
  onCreateMatter,
  isLoading = false,
}: CreateMatterModalProps) => {
  const [matterName, setMatterName] = useState('');

  const handleCreate = () => {
    if (matterName.trim()) {
      onCreateMatter(matterName);
      setMatterName('');
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setMatterName('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Matter</DialogTitle>
          <DialogDescription>
            Enter the name of the new matter you want to create.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="matter-name" className="text-right">
              Matter Name
            </Label>
            <Input
              id="matter-name"
              placeholder="Enter matter name..."
              value={matterName}
              onChange={e => setMatterName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleCreate();
                }
              }}
              disabled={isLoading}
              className="col-span-3"
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!matterName.trim() || isLoading}
          >
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMatterModal;
