'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
      <DialogContent className="sm:max-w-[400px]">
        <div className="mb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Create New Matter
          </DialogTitle>
          <DialogDescription className="mt-2 text-gray-600">
            Enter the name of the new matter you want to create.
          </DialogDescription>
        </div>

        <div className="space-y-4">
          <Input
            id="matter-name-input"
            placeholder="Enter matter name..."
            value={matterName}
            onChange={e => setMatterName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && matterName.trim()) {
                handleCreate();
              }
            }}
            disabled={isLoading}
            className="w-full rounded-lg border border-gray-600 bg-white px-4 py-3 text-black placeholder-gray-500 transition-all duration-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none h-12"
            autoFocus
          />
        </div>

        <div className="mt-2 pt-4">
          <Button
            onClick={handleCreate}
            disabled={!matterName.trim() || isLoading}
            className="w-full rounded-lg bg-gray-700 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 "
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-black"></span>
                Creating Matter...
              </span>
            ) : (
              'Create Matter'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMatterModal;
