'use client';

import { MessageSquare, Trash2 } from 'lucide-react';

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
              <button
                onClick={() => onDeleteChatOption(option.id)}
                className="hidden gap-1 rounded p-1 group-hover:flex hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatOptionsSelector;
