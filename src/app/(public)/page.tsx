'use client';

import ChatInput from '@/components/ChatInput';
import { cn } from '@/lib/utils';

function App() {
  return (
    <div
      className={cn(
        '-mt-10 flex min-h-[calc(100vh-20px)] flex-col items-center justify-center',
      )}
    >
      <h1 className="mb-8 text-4xl font-medium">How can I help you?</h1>

      <ChatInput />

      <p className="absolute bottom-3 text-xs text-neutral-500">
        We don’t train on your data. Your chats stay private.
      </p>
    </div>
  );
}

export default App;
