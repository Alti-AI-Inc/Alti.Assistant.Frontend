'use client';
import ChatInput from '@/components/ChatInput';
import { useActiveConversation } from '@/hooks/useConversations';
import { cn } from '@/lib/utils';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Streamdown } from 'streamdown';
import ReferencesList from './ReferenceList';
import VideoComponent from './VideoComponent';

const FullConversation = ({ conversationId }: { conversationId: string }) => {
  const { data } = useSession();
  const pathname = usePathname();
  const {
    data: queryConversation,
    isLoading,
    error,
  } = useActiveConversation(conversationId, data?.accessToken);

  const { setActiveConversation, activeConversation, isLoadingResponse } =
    useConversationsStore();

  // Sync query result into Zustand
  useEffect(() => {
    if (queryConversation) {
      setActiveConversation(queryConversation);
    }
  }, [queryConversation, setActiveConversation]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll when messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const isHomePage = pathname === '/';
  return (
    <div
      className={cn(
        'flex w-full flex-col',
        activeConversation?.messages.length && 'h-screen',
        isLoading && 'h-screen',
      )}
    >
      {/* Messages container - takes remaining space and scrolls */}
      {activeConversation?.messages.length && (
        <div className="flex-1 overflow-y-auto" ref={messagesContainerRef}>
          <div className="mx-auto w-full max-w-[796px] space-y-6 px-4 py-6 lg:pr-2">
            {activeConversation?.messages.length &&
              activeConversation.messages.map((message, idx) => (
                <div key={idx} className="space-y-4">
                  {message.role === 'user' && (
                    <div className="flex items-center justify-end">
                      <div className="w-fit max-w-[85%] rounded-2xl bg-gray-100 px-4 py-2 text-black shadow">
                        {message.content}
                      </div>
                    </div>
                  )}

                  {message.role === 'assistant' &&
                    message.content !== 'Image generated successfully' &&
                    message.content !== 'Video generated successfully' && (
                      <Streamdown className="w-fit max-w-[85%] rounded-lg">
                        {message.content}
                      </Streamdown>
                    )}
                  {message.metadata?.images && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={message.metadata.images}
                      alt={message.metadata.type}
                    />
                  )}
                  {message.metadata?.video?.name && (
                    <VideoComponent
                      operationId={message.metadata?.video?.name}
                    />
                  )}
                  {message.metadata?.reference?.length && (
                    <ReferencesList references={message.metadata.reference} />
                  )}
                </div>
              ))}

            {/* Loading message - visible in the messages area */}
            {isLoadingResponse && (
              <div className="flex items-center justify-start py-4">
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                  <span>alti is thinking...</span>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      )}
      {isLoading && (
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

      {error && !isHomePage && (
        <div className="my-6 text-center">{error.message}</div>
      )}

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
