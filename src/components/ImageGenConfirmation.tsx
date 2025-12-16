'use client';

import { Button } from '@/components/ui/button';
import { useImageGenStore } from '@/stores/useImageGenStore';
import { Check, Plus } from 'lucide-react';

interface ImageGenConfirmationProps {
  onConfirm: (wantsMoreDetails: boolean) => void;
}

/**
 * Displays Yes/No confirmation when prompt score is >= 65.
 * Asks user if they want to add more details or proceed to generation.
 */
export function ImageGenConfirmation({ onConfirm }: ImageGenConfirmationProps) {
  const promptScore = useImageGenStore(state => state.promptScore);
  const workflow = useImageGenStore(state => state.workflow);
  const isLoading = workflow === 'finalizing' || workflow === 'generating';

  return (
    <div className="mx-auto mb-4 w-full max-w-[750px] rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
          <Check className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            Prompt Ready! (Score: {promptScore}/100)
          </p>
          <p className="text-xs text-gray-500">
            Would you like to add more details to improve the image?
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onConfirm(true)}
          disabled={isLoading}
          className="flex-1"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add details
        </Button>
        <Button
          size="sm"
          onClick={() => onConfirm(false)}
          disabled={isLoading}
          className="flex-1 bg-black text-white hover:bg-gray-800"
        >
          Generate now
        </Button>
      </div>
    </div>
  );
}
