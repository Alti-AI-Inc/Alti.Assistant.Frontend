'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useModalStore } from '@/stores/useModalStore';
import { useBotsStore } from '@/stores/useBotsStore';
import { useRouter } from 'next/navigation';

export function DeleteChatbotModal() {
  const { onClose, isOpen, type, actionId } = useModalStore();
  const { bots, deleteBot } = useBotsStore();
  const router = useRouter();

  const bot = bots.find((b) => b.id === actionId);

  if (type !== 'delete-chatbot' || !bot) return null;

  const handleDelete = () => {
    deleteBot(bot.id);
    router.push('/my-chatbots');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] border-none bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-950 dark:text-gray-50 flex items-center gap-2">
            Delete Agent
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            This action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Are you sure you want to delete the agent <strong className="text-black dark:text-white">"{bot.name}"</strong>? All conversation threads associated with this agent will be permanently deleted as well.
          </p>
        </div>

        <DialogFooter className="mt-4 gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="rounded-xl px-5 text-xs font-semibold"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 text-xs font-semibold"
          >
            Delete Agent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
