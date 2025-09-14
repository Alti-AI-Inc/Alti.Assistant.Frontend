'use client';
import ChatInput from '@/components/ChatInput';
import { cn } from '@/lib/utils';
import {
  conversationHelpers,
  useConversationsStore,
} from '@/stores/converstionsStore';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { Streamdown } from 'streamdown';

const FullConversation = ({ conversationId }: { conversationId: string }) => {
  const { data } = useSession();
  const {
    activeConversation,
    error,
    isLoadingActiveConversation,
    isLoadingResponse,
  } = useConversationsStore();
  // console.log({ activeConversation });
  useEffect(() => {
    if (!data?.accessToken) return;
    if (!conversationId) return;

    // already loaded & matches active
    if (conversationId === 'new-chat') return;
    if (conversationId === activeConversation?.conversationId) return;

    conversationHelpers.loadActiveConversation(
      conversationId,
      data.accessToken,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.accessToken, conversationId]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll when messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, isLoadingResponse]);


  return (
    <div
      className={cn(
        'flex w-full flex-col',
        activeConversation?.messages.length && 'h-screen',
        isLoadingActiveConversation && 'h-screen',
      )}
    >
      {/* Messages container - takes remaining space and scrolls */}
      {activeConversation?.messages.length && (
        <div className="flex-1 overflow-y-auto" ref={messagesContainerRef}>
          <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
            {activeConversation?.messages.length &&
              activeConversation.messages.map((messages, idx) => (
                <div key={idx} className="space-y-4">
                  {messages.role === 'user' && (
                    <div className="flex items-center justify-end">
                      <div className="w-fit max-w-[85%] rounded-2xl bg-gray-100 px-4 py-2 text-black shadow">
                        {messages.content}
                      </div>
                    </div>
                  )}

                  {messages.role === 'assistant' && (
                    <Streamdown className="w-fit max-w-[85%] rounded-lg">
                      {messages.content}
                    </Streamdown>
                  )}
                </div>
              ))}

            {/* Loading message - visible in the messages area */}
            {isLoadingResponse && (
              <div
                className={cn(
                  'flex items-center py-4',
                  isLoadingResponse && 'justify-start',
                )}
              >
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                  <span>alti is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
      {isLoadingActiveConversation && (
        <div
          className={cn(
            'flex h-[calc(100vh_-110px] flex-1 items-center justify-center py-4',
          )}
        >
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
            <span>loading chat...</span>
          </div>
        </div>
      )}
      {error && <div className="my-6 text-center">{error}</div>}

      {/* Sticky chat input at bottom */}
      <div className="sticky bottom-0 bg-white px-4 pb-4">
        {/* <div className="mx-auto w-full max-w-3xl"> */}
        <ChatInput conversationId={conversationId} />
        {/* </div> */}
      </div>
    </div>
  );
};

export default FullConversation;
