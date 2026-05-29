'use client';

import { MessageSquare, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';

export interface ChatOption {
  id: string;
  name: string;
  createdAt: string;
  isNameFromQuestion?: boolean;
}

interface ChatOptionsSelectorProps {
  chatOptions: ChatOption[];
  selectedChatOptionId: string | undefined;
  onSelectChatOption: (id: string) => void;
  onDeleteChatOption: (id: string) => void;
}

export const ChatOptionsSelector = ({
  chatOptions,
  selectedChatOptionId,
  onSelectChatOption,
  onDeleteChatOption,
}: ChatOptionsSelectorProps) => {
  // Only show named chats (filter out empty names)
  const namedChats = chatOptions.filter(
    chat => chat.name && chat.name.trim() !== '',
  );

  return (
    <div className="border-b border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
      <h3 className="mb-2 text-xs font-semibold text-gray-700 uppercase dark:text-gray-300">
        Conversations
      </h3>

      <div className="flex flex-col gap-1">
        {namedChats.length === 0 ? (
          <p className="py-1 text-xs text-gray-400 dark:text-gray-500">
            No conversations yet
          </p>
        ) : (
          namedChats.map(option => (
            <div
              key={option.id}
              className={`group flex items-center justify-between rounded p-1.5 transition-colors ${
                selectedChatOptionId === option.id
                  ? 'bg-blue-100 dark:bg-blue-900/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <button
                onClick={() => onSelectChatOption(option.id)}
                className="flex flex-1 items-center gap-2 text-left"
              >
                <MessageSquare className="h-3 w-3 flex-shrink-0 text-gray-600 dark:text-gray-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-gray-900 dark:text-gray-100">
                    {option.name}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {new Date(option.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </button>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="hidden gap-1 rounded p-1 group-hover:flex hover:bg-red-100 dark:hover:bg-red-900/30"
                    title="Delete Conversation"
                  >
                    <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
                  </button>
                </DialogTrigger>
                <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] sm:max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
                  <div className="px-5 pt-5 pb-4 text-center">
                    <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                      Delete Conversation
                    </h2>
                    <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                      Are you sure you want to delete this conversation?
                    </p>
                  </div>
                  <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                    <DialogClose asChild>
                      <button className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none">
                        Cancel
                      </button>
                    </DialogClose>
                    <DialogClose asChild>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChatOption(option.id);
                        }}
                        className="flex-1 text-[15px] font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none"
                      >
                        Delete
                      </button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatOptionsSelector;
