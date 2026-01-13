'use client';
import ChatInput from '@/components/ChatInput';
import CopyButton from '@/components/CopyButton';
import { ConfigForm } from '@/components/documents/ConfigForm';
import { ModeSelector } from '@/components/documents/ModeSelector';
import { ImageGenConfirmation } from '@/components/ImageGenConfirmation';
import { ImageGenSuggestions } from '@/components/ImageGenSuggestions';
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
import { cn, containsYouTubeUrl } from '@/lib/utils';
import { OPTIONS, useConversationsStore } from '@/stores/useConverstionsStore';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { useModalStore } from '@/stores/useModalStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useQueryClient } from '@tanstack/react-query';
import { EllipsisVertical, Share, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Streamdown } from 'streamdown';
import ReferencesList from './ReferenceList';

import FileDownloadCard from './FileDownloadCard';
import VideoComponent from './VideoComponent';
import VideoComponentForContent from './YoutubePlayer';

import { BrainstormData } from './BrainstormData';
import { useBrainstorm } from '@/hooks/useBrainstorm';
import PresentationLoadingCard from './PresentationLoadingCard';
import { getPresentationStatus } from '@/actions/presentationActions';

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
    selectedOption,
    rewriteMode,
    presentationTask,
    setPresentationTask,
    updateActiveConversation,
  } = useConversationsStore();

  const { onOpen } = useModalStore();

  const { drafting, review } = useDocumentStore();
  const { translationMode } = useTranslation();
  const { brainstormMode } = useBrainstorm();

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
    if (queryConversation && !showStartLastMessage) {
      setActiveConversation(queryConversation);
    }
  }, [queryConversation, setActiveConversation, showStartLastMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasScrolledToUserMessage = useRef(false);
  const isFirstLoad = useRef(true);

  // Auto-scroll to bottom function
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (behavior === 'auto' && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const scrollToLastUserMessage = () => {
    lastMessageRef.current?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  };

  // Auto-scroll when messages change or loading state changes
  useEffect(() => {
    if (showStartLastMessage || hasScrolledToUserMessage.current) return;

    if (activeConversation?.messages?.length) {
      if (isFirstLoad.current) {
        // Handle lazy images/content
        // Scrolling every 200ms for 2 seconds
        let attempts = 0;
        const maxAttempts = 10;

        const forceScrollLoop = () => {
          scrollToBottom('smooth');
          attempts++;

          if (attempts < maxAttempts) {
            console.log('Scrolling...', attempts);
            setTimeout(forceScrollLoop, 200);
          } else {
            isFirstLoad.current = false;
          }
        };

        forceScrollLoop();
      } else {
        scrollToBottom('smooth');
      }
    }
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
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  // Presentation task polling effect
  // Use ref to track current task to avoid re-triggering effect on message updates
  const presentationTaskRef = useRef(presentationTask);
  presentationTaskRef.current = presentationTask;

  // Only depend on taskId to prevent infinite loop when message updates
  const taskId = presentationTask?.taskId;
  const taskStatus = presentationTask?.status;

  useEffect(() => {
    // Guard: only run if we have a pending task
    if (!taskId || taskStatus !== 'pending') return;
    if (!data?.accessToken) return;

    let isCancelled = false;

    const pollStatus = async () => {
      const currentTask = presentationTaskRef.current;
      if (!currentTask || isCancelled) return;

      const result = await getPresentationStatus(
        currentTask.taskId,
        currentTask.conversationId,
        data.accessToken,
        data.user?.id,
      );

      if (isCancelled) return;

      if (!result.success) {
        console.error('[FullConversation] Polling error:', result.debugMessage);
        return;
      }

      if (result.data?.status === 'completed' && result.data.publicUrl) {
        // Update conversation with download card
        updateActiveConversation(
          'Your presentation is ready! Click below to download.',
          'assistant' as any,
          currentTask.conversationId,
          {
            document: {
              url: result.data.publicUrl,
              file: {
                fileName: 'Presentation.pptx',
                format: 'pptx',
              },
              metadata: {
                title: 'Generated Presentation',
                documentType: 'PPTX',
              },
            },
          },
        );
        setPresentationTask(null);
      } else if (result.data?.status === 'failed') {
        updateActiveConversation(
          result.data.error || 'Presentation generation failed.',
          'assistant' as any,
          currentTask.conversationId,
        );
        setPresentationTask(null);
      } else {
        // Update status message (ref prevents effect re-trigger)
        setPresentationTask({
          ...currentTask,
          message: result.data?.message || currentTask.message,
        });
      }
    };

    // Initial poll
    pollStatus();

    // Poll every 30 seconds
    const interval = setInterval(pollStatus, 30000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [
    taskId,
    taskStatus,
    data?.accessToken,
    data?.user?.id,
    setPresentationTask,
    updateActiveConversation,
  ]);

  return (
    <div
      className={cn(
        'flex w-full flex-col',
        // (activeConversation?.messages.length || drafting.isActive) &&
        activeConversation?.messages.length &&
          'h-[calc(100vh-70px)] lg:h-screen',
        isLoading && 'h-[calc(100vh-70px)] lg:h-screen',
        // conversationId !== 'new-chat' && 'pb-24',
        // pathname === '/' && !activeConversation?.messages.length && 'pb-24',
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
      {(!!activeConversation?.messages.length ||
        drafting.isActive ||
        (review && review.isActive) ||
        selectedOption === OPTIONS.REWRITE ||
        selectedOption === OPTIONS.TRANSLATE_DOCUMENTS ||
        selectedOption === OPTIONS.BRAINSTORM) && (
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
                      !message.content?.trim() && !message.metadata?.imageUrl
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
                  {message.metadata?.brainstormData && (
                    <BrainstormData
                      data={message.metadata.brainstormData}
                      analysis={message.metadata.ideaAnalysis}
                    />
                  )}
                </div>
              ))}
            {/* Presentation Loading Card - shown during polling */}
            {presentationTask && presentationTask.status === 'pending' && (
              <PresentationLoadingCard message={presentationTask.message} />
            )}
            {/* Image Generation UI - Integrated inline */}
            {shouldShowConfirmation && (
              <ImageGenConfirmation onConfirm={handleUserConfirmation} />
            )}
            {isCollectingDetails && <ImageGenSuggestions />}
            {/* Document Drafting/Review/Rewrite/Translate/Brainstorm UI */}
            {(drafting.isActive ||
              selectedOption === OPTIONS.REWRITE ||
              selectedOption === OPTIONS.TRANSLATE_DOCUMENTS ||
              selectedOption === OPTIONS.BRAINSTORM) &&
              !isLoadingResponse && (
                <>
                  {!(
                    (selectedOption === OPTIONS.REWRITE &&
                      activeConversation?.conversationId &&
                      activeConversation?.conversationId !== 'new-chat' &&
                      rewriteMode !== 'select_mode') ||
                    (selectedOption === OPTIONS.TRANSLATE_DOCUMENTS &&
                      activeConversation?.conversationId &&
                      activeConversation?.conversationId !== 'new-chat' &&
                      translationMode !== 'select_mode') ||
                    (selectedOption === OPTIONS.BRAINSTORM &&
                      activeConversation?.conversationId &&
                      activeConversation?.conversationId !== 'new-chat' &&
                      brainstormMode !== 'select_mode')
                  ) && (
                    <ModeSelector
                      currentMode={
                        drafting.isActive
                          ? drafting.mode === 'select_mode'
                            ? null
                            : (drafting.mode as 'assistant' | 'direct')
                          : selectedOption === OPTIONS.REWRITE
                            ? rewriteMode === 'select_mode'
                              ? null
                              : rewriteMode === 'chat'
                                ? null
                                : (rewriteMode as 'assistant' | 'direct')
                            : selectedOption === OPTIONS.TRANSLATE_DOCUMENTS
                              ? translationMode === 'select_mode'
                                ? null
                                : translationMode === 'chat'
                                  ? null
                                  : (translationMode as 'assistant' | 'direct')
                              : selectedOption === OPTIONS.BRAINSTORM
                                ? brainstormMode === 'select_mode'
                                  ? null
                                  : (brainstormMode as 'assistant' | 'direct')
                                : review.mode === 'select_mode'
                                  ? null
                                  : (review.mode as 'assistant' | 'direct')
                      }
                      modeContext={
                        drafting.isActive
                          ? 'draft'
                          : selectedOption === OPTIONS.REWRITE
                            ? 'rewrite'
                            : selectedOption === OPTIONS.TRANSLATE_DOCUMENTS
                              ? 'translate'
                              : selectedOption === OPTIONS.BRAINSTORM
                                ? 'brainstorm'
                                : 'review'
                      }
                    />
                  )}

                  {((drafting.isActive && drafting.mode === 'direct') ||
                    (review && review.isActive && review.mode === 'direct') ||
                    (selectedOption === OPTIONS.REWRITE &&
                      (rewriteMode === 'direct' ||
                        rewriteMode === 'assistant')) ||
                    (selectedOption === OPTIONS.TRANSLATE_DOCUMENTS &&
                      (translationMode === 'direct' ||
                        translationMode === 'assistant')) ||
                    (selectedOption === OPTIONS.BRAINSTORM &&
                      brainstormMode === 'structured')) &&
                    // HIDE CONFIG FORM IF FILE IS SELECTED IN REWRITE MODE
                    !(selectedOption === OPTIONS.REWRITE && selectedFile) && (
                      <div
                        className={cn(
                          isLoadingResponse && 'pointer-events-none opacity-50',
                        )}
                      >
                        <ConfigForm />
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
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
          />
        </div>
      </div>
    </div>
  );
};

export default FullConversation;
