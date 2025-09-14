'use client';

import { cn } from '@/lib/utils';
import { useConversationsStore } from '@/stores/converstionsStore';
import FullConversation from '../(protected)/c/[id]/_components/FullConversation';

function App() {
  const { activeConversation } = useConversationsStore();
  return (
    <div className={cn('flex h-screen flex-col items-center justify-center')}>
      {!activeConversation && (
        <h1 className="mb-8 text-4xl font-medium">How can I help you?</h1>
      )}

      <FullConversation conversationId="new-chat" />

      {!activeConversation && (
        <p className="absolute bottom-3 text-xs text-neutral-500">
          We don’t train on your data. Your chats stay private.
        </p>
      )}
    </div>
  );
}

export default App;
