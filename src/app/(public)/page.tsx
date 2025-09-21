'use client';

import { cn } from '@/lib/utils';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useEffect } from 'react';
import FullConversation from '../(protected)/c/[id]/_components/FullConversation';

function App() {
  const { activeConversation, setActiveConversation } = useConversationsStore();

  useEffect(() => {
    setActiveConversation(null);
  }, [setActiveConversation]);

  return (
    <div
      className={cn(
        'flex h-screen flex-col items-center justify-center px-4 sm:px-6 md:px-8'
      )}
    >
      {!activeConversation && (
        <h1 className="mb-6 text-2xl font-medium sm:mb-8 sm:text-3xl md:text-4xl">
          How can I help you?
        </h1>
      )}

      {/* Full conversation area */}
      <div className="w-full max-w-3xl flex-1 overflow-y-auto">
        <FullConversation conversationId="new-chat" />
      </div>

      {!activeConversation && (
        <p className="absolute bottom-2 px-2 text-center text-[10px] text-neutral-500 sm:bottom-3 sm:text-xs">
          We don’t train on your data. Your chats stay private.
        </p>
      )}
    </div>
  );
}

export default App;
