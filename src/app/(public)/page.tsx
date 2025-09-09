'use client';

import ChatInput from '@/components/ChatInput';
import { cn } from '@/lib/utils';
import { useUserChatStore } from '@/stores/chatStore';
import { useEffect, useRef } from 'react';
import { Streamdown } from 'streamdown';

function App() {
  const { modalResponses } = useUserChatStore();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [modalResponses]);

  return (
    <div
      className={cn(
        '-mt-10 flex min-h-[calc(100vh-20px)] flex-col items-center justify-center',
        modalResponses.length && 'mt-0 p-10',
      )}
    >
      {/* Chat messages */}
      <div
        className={cn(
          'hidden w-full max-w-3xl flex-1 space-y-6 overflow-y-auto px-4 py-6',
          modalResponses.length && 'block',
        )}
      >
        {modalResponses.length &&
          modalResponses.map((response, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex justify-end">
                <div className="w-fit max-w-[85%] rounded-2xl bg-gray-100 px-4 py-2 text-black shadow">
                  {response.prompt}
                </div>
              </div>

              <div className="flex justify-start">
                <div className="w-fit max-w-[85%] rounded-lg">
                  <Streamdown>{response.reply}</Streamdown>
                </div>
              </div>
            </div>
          ))}
        <div ref={chatEndRef} />
      </div>

      {!modalResponses.length && (
        <h1 className="mb-8 text-4xl font-medium">How can I help you?</h1>
      )}

      <ChatInput />

      {!modalResponses.length && (
        <p className="absolute bottom-3 text-xs text-neutral-500">
          We don’t train on your data. Your chats stay private.
        </p>
      )}
    </div>
  );
}

export default App;
