'use client';
import ChatInput from '@/components/ChatInput';
import CopyButton from '@/components/CopyButton';
import { ImageGenConfirmation } from '@/components/ImageGenConfirmation';
import { ImageGenSuggestions } from '@/components/ImageGenSuggestions';
import { DocumentModeSelector } from '@/components/documents/DocumentModeSelector';
import { DocumentDraftingForm } from '@/components/documents/DocumentDraftingForm';
import SaveConversation from '@/components/SaveConversation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useActiveConversation } from '@/hooks/useConversations';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { cn, containsYouTubeUrl } from '@/lib/utils';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useModalStore } from '@/stores/useModalStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useQueryClient } from '@tanstack/react-query';
import { EllipsisVertical, Share, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Streamdown } from 'streamdown';
import ReferencesList from './ReferenceList';

import VideoComponent from './VideoComponent';
import VideoComponentForContent from './YoutubePlayer';
import FileDownloadCard from './FileDownloadCard';

const FullConversation = ({ conversationId }: { conversationId: string }) => {
  const { data } = useSession();
  const pathname = usePathname();
  const router = useRouter(); // Explicit usage for imageGen
  const queryClient = useQueryClient();

  const {
    data: queryConversation,
    isLoading,
    // error,
  } = useActiveConversation(conversationId, data?.accessToken);
  const { isLeftSidebarOpen } = useSidebarStore();

  const {
    setActiveConversation,
    showStartLastMessage,
    activeConversation,
    isLoadingResponse,
  } = useConversationsStore();

  const { onOpen } = useModalStore();

  const { drafting } = useDocumentStore();

  // Initialize Image Generation Hook
  const imageGenHook = useImageGeneration({ router, queryClient });
  const {
    workflow,
    shouldShowConfirmation,
    isCollectingDetails,
    handleUserConfirmation,
    isLoading: isImageGenLoading,
  } = imageGenHook;

  // Helper to determine status message
  const getStatusMessage = () => {
    switch (workflow) {
      case 'evaluating':
        return 'alti is evaluating...';
      case 'finalizing':
        return 'alti is finalizing...';
      case 'generating':
        return 'alti is generating...';
      default:
        return 'alti is thinking...';
    }
  };

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

  // console.log('activeConversation?.messages', activeConversation?.messages);
  // const lastMessageRole = activeConversation?.messages.at(-1)?.role;
  return (
    <div
      className={cn(
        'flex w-full flex-col',
        // (activeConversation?.messages.length || drafting.isActive) &&
        activeConversation?.messages.length &&
          'h-[calc(100vh-70px)] lg:h-screen',
        isLoading && 'h-[calc(100vh-70px)] lg:h-screen',
        // conversationId !== 'new-chat' && 'pb-24',
        pathname === '/' && !activeConversation?.messages.length && 'pb-24',
      )}
    >
      <div
        className={cn(
          'sticky top-2 right-4 z-10 flex items-center justify-end pr-4',
          pathname === '/' && 'hidden',
        )}
      >
        <Button
          onClick={() =>
            onOpen({
              type: 'share-conversation',
              actionId: queryConversation._id,
            })
          }
          variant="ghost"
          className="bg-white"
        >
          <Share /> Share
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-hidden">
            <EllipsisVertical className="size-5 rotate-90" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-5 rounded-2xl">
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}

            {/* <DropdownMenuSeparator /> */}

            {activeConversation?.conversationId && (
              <DropdownMenuItem onSelect={e => e.preventDefault()}>
                <SaveConversation
                  conversationId={activeConversation?.conversationId}
                />
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Trash2 className="text-black" />{' '}
              <span className="text-black">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Messages container - takes remaining space and scrolls */}
      {/* {!!activeConversation?.messages.length && ( */}
      {(!!activeConversation?.messages.length || drafting.isActive) && (
        <div className="flex-1 overflow-y-auto" ref={messagesContainerRef}>
          <div
            className={cn(
              'mx-auto w-full max-w-[796px] space-y-6 px-4 py-6 lg:px-2 lg:pr-1',
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
                    // Skip rendering if content is empty and there's no image
                    !(
                      message.content.trim() === '' &&
                      !message.metadata?.imageUrl
                    ) && (
                      <div>
                        {containsYouTubeUrl(message.content) ? (
                          <VideoComponentForContent content={message.content} />
                        ) : (
                          <div>
                            <Streamdown className="w-full rounded-lg">
                              {message.content}
                            </Streamdown>

                            <CopyButton content={message.content} />
                          </div>
                        )}
                      </div>
                    )}

                  {message.metadata?.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        typeof message.metadata.imageUrl === 'string'
                          ? message.metadata.imageUrl
                          : (message.metadata.imageUrl as any)?.url
                      }
                      alt={message.metadata.type || 'Generated image'}
                      className="max-w-full rounded-lg shadow-md"
                      onError={e => {
                        console.error(
                          '[FullConversation] Image failed to load:',
                          message.metadata!.imageUrl,
                        );
                        console.error('Error details:', e);
                      }}
                    />
                  )}
                  {message.metadata?.video?.name && (
                    <VideoComponent
                      operationId={message.metadata?.video?.name}
                    />
                  )}
                  {message.metadata?.document && (
                    <FileDownloadCard document={message.metadata.document} />
                  )}
                  {!!message.metadata?.reference?.length && (
                    <ReferencesList references={message.metadata.reference} />
                  )}
                </div>
              ))}
            {/* Image Generation UI - Integrated inline */}
            {shouldShowConfirmation && (
              <ImageGenConfirmation onConfirm={handleUserConfirmation} />
            )}
            {isCollectingDetails && <ImageGenSuggestions />}
            {/* Document Drafting UI */}
            {drafting.isActive && (
              <>
                {(drafting.mode === 'select_mode' ||
                  drafting.mode === 'assistant') && (
                  <DocumentModeSelector
                    currentMode={
                      drafting.mode === 'assistant' ? 'assistant' : undefined
                    }
                  />
                )}
                {drafting.mode === 'direct' && (
                  <div
                    className={cn(
                      isLoadingResponse && 'pointer-events-none opacity-50',
                    )}
                  >
                    <DocumentDraftingForm />
                  </div>
                )}
              </>
            )}
            {/* Loading message - visible in the messages area */}
            {isLoadingResponse && (
              <div className="flex items-center justify-start py-4">
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                  <span>{getStatusMessage()}</span>
                </div>
              </div>
            )}
            <div
              className={cn(
                // idx === activeConversation.messages.length - 1 &&
                // activeConversation?.messages[
                //   activeConversation?.messages.length - 1
                // ]?.role === 'user' &&
                showStartLastMessage &&
                  // lastMessageRole === 'user' &&
                  'h-[50dvh] md:h-[65dvh] lg:h-[70dvh]',
              )}
            ></div>
          </div>
          <div ref={messagesEndRef} />
        </div>
      )}
      {isLoading && (
        <div
          className={cn(
            'flex h-[calc()100vh_-110px] flex-1 items-center justify-center py-4',
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
      {/* <div className="sticky bottom-0 bg-white px-4 pb-4"> */}
      <div className="sticky bottom-0 z-10 w-full bg-white p-4">
        <div className="mx-auto max-w-[796px]">
          <ChatInput
            conversationId={conversationId}
            imageGenHook={imageGenHook}
          />
        </div>
      </div>
    </div>
  );
};

export default FullConversation;
