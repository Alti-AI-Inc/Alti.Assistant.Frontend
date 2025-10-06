'use client';
import CopyButton from '@/components/CopyButton';
import {
  useActiveBaseConversation,
  useKnowledgeBases,
} from '@/hooks/useKnowledgeBases';
import { cn } from '@/lib/utils';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { Streamdown } from 'streamdown';
import ChatInput from './ChatInput';

const FullConversation = ({
  conversationId,
  baseId,
}: {
  conversationId: string;
  baseId: string;
}) => {
  const { data } = useSession();
  const {
    data: queryConversation,
    isLoading,
    // error,
  } = useActiveBaseConversation(conversationId, data?.accessToken);
  const {
    data: knowledgeBases,

    // error,
  } = useKnowledgeBases(data?.accessToken);

  const activeKnowledgeBase = knowledgeBases?.filter(kb => kb.id === baseId)[0];
  console.log({ activeKnowledgeBase });

  const {
    setActiveConversation,
    showStartLastMessage,
    activeConversation,
    isLoadingResponse,
  } = useConversationsStore();

  // Sync query result into Zustand
  useEffect(() => {
    if (queryConversation) {
      setActiveConversation(queryConversation);
    }
  }, [queryConversation, setActiveConversation]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLastUserMessage = () => {
    lastMessageRef.current?.scrollIntoView();
  };

  // Auto-scroll when messages change or loading state changes
  useEffect(() => {
    if (showStartLastMessage) return;
    scrollToBottom();
  }, [activeConversation?.messages, showStartLastMessage]);

  useEffect(() => {
    if (showStartLastMessage) {
      scrollToLastUserMessage();
    }
  }, [activeConversation?.messages, showStartLastMessage]);

  const lastUserMessage = activeConversation?.messages
    .filter(message => message.role === 'user')
    .pop();

  return (
    <div
      className={cn(
        'flex w-full flex-col',
        activeConversation?.messages.length &&
          'h-[calc(100vh-70px)] lg:h-screen',
        isLoading && 'h-[calc(100vh-70px)] lg:h-screen',
      )}
    >
      {/* Messages container - takes remaining space and scrolls */}
      {activeConversation?.messages.length && (
        <div className="flex-1 overflow-y-auto" ref={messagesContainerRef}>
          <div
            className={cn(
              'mx-auto w-full max-w-[796px] space-y-6 px-4 py-6 lg:pr-2',
            )}
          >
            {activeConversation?.messages.length &&
              activeConversation.messages.map((message, idx) => (
                <div key={idx} className="space-y-4">
                  {message.role === 'user' && (
                    <div
                      className="flex items-center justify-end"
                      ref={
                        message.content === lastUserMessage?.content
                          ? lastMessageRef
                          : null
                      }
                    >
                      <div
                        className={cn(
                          'w-fit max-w-[85%] rounded-2xl bg-gray-100 px-4 py-2 text-black shadow',
                          showStartLastMessage && 'mt-8',
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  )}

                  {message.role === 'assistant' &&
                    message.content !== 'Image generated successfully' &&
                    message.content !== 'Video generated successfully' && (
                      <div>
                        <Streamdown className="w-full max-w-[85%] rounded-lg">
                          {message.content}
                        </Streamdown>

                        <CopyButton content={message.content} />
                      </div>
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
            <div
              className={cn(
                // idx === activeConversation.messages.length - 1 &&
                showStartLastMessage && 'h-[65dvh]',
              )}
            ></div>
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

      {/* {error && !isHomePage && (
        <div className="my-6 text-center">{error.message}</div>
      )} */}

      {/* Sticky chat input at bottom */}
      <div className="sticky bottom-0 bg-white px-4 pb-4">
        {/* <div className="mx-auto w-full max-w-3xl"> */}
        <ChatInput conversationId={conversationId} baseId={baseId} />
        {/* </div> */}
      </div>
    </div>
  );
};

export default FullConversation;
