'use client';
import ChatInput from '@/components/ChatInput';
import CopyButton from '@/components/CopyButton';
import { ConfigForm } from '@/components/documents/ConfigForm';
import { ModeSelector } from '@/components/documents/ModeSelector';
import { ImageGenConfirmation } from '@/components/ImageGenConfirmation';
import { ImageGenSuggestions } from '@/components/ImageGenSuggestions';
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
import { EllipsisVertical, Share, Trash2, ThumbsUp, ThumbsDown, Brain, Check, RefreshCw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Streamdown } from 'streamdown';
import ReferencesList from './ReferenceList';
import TelemetryConsole from '@/components/research/TelemetryConsole';
import InteractiveTopology from '@/components/research/InteractiveTopology';
import { useBotsStore } from '@/stores/useBotsStore';

import FileDownloadCard from './FileDownloadCard';
import VideoComponent from './VideoComponent';
import VideoComponentForContent from './YoutubePlayer';
import FinancialWidget from './FinancialWidget';
import SportsWidget from './SportsWidget';
import RealEstateWidget from './RealEstateWidget';
import SecurityVulnerabilityWidget from './SecurityVulnerabilityWidget';

import { BrainstormData } from './BrainstormData';
import { PlanDataComponent } from './PlanData';
import { useBrainstorm } from '@/hooks/useBrainstorm';
import { useContractReview } from '@/hooks/useContractReview';
import { usePlanGeneration } from '@/hooks/usePlanGeneration';
import { useReportGeneration } from '@/hooks/useReportGeneration';
import PresentationLoadingCard from './PresentationLoadingCard';
import { getPresentationStatus } from '@/actions/presentationActions';

const RLFeedbackBar = ({ messageId, bot, editBot }: { messageId: number; bot: any; editBot: any }) => {
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);
  const [showTuningOptions, setShowTuningOptions] = useState(false);
  const [isTuning, setIsTuning] = useState(false);
  const [selectedTuning, setSelectedTuning] = useState<string | null>(null);

  const botRlScore = bot.alignmentScore !== undefined ? bot.alignmentScore : 98.4;
  const botEvolutionLevel = bot.evolutionLevel || 4;

  const handleThumbsUp = () => {
    if (feedbackGiven) return;
    setFeedbackGiven('up');
    const newScore = parseFloat((botRlScore + 0.1).toFixed(1));
    editBot(bot.id, { 
      alignmentScore: newScore,
      evolutionLevel: newScore >= 99.0 ? botEvolutionLevel + 1 : botEvolutionLevel
    });
  };

  const handleTuningSelect = (tuningType: string) => {
    if (isTuning) return;
    setSelectedTuning(tuningType);
    setIsTuning(true);
    setTimeout(() => {
      setIsTuning(false);
      setFeedbackGiven('down');
      setShowTuningOptions(false);
      const newScore = parseFloat((botRlScore + 0.2).toFixed(1));
      editBot(bot.id, { 
        alignmentScore: newScore,
        evolutionLevel: newScore >= 99.0 ? botEvolutionLevel + 1 : botEvolutionLevel
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-black/5 dark:border-white/5 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 text-xs">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
          <Brain className="size-3 text-blue-500" /> RLHF Feedback Loop:
        </span>
        
        {feedbackGiven === null ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleThumbsUp}
              className="flex items-center gap-1 px-2 py-0.5 rounded border border-black/5 hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/30 text-gray-500 transition-all duration-150"
              title="Reinforce Output (Thumbs Up)"
            >
              <ThumbsUp className="size-3" />
              <span>Good</span>
            </button>
            <button
              onClick={() => setShowTuningOptions(!showTuningOptions)}
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded border transition-all duration-150 text-gray-500",
                showTuningOptions 
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-600" 
                  : "border-black/5 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30"
              )}
              title="Calibrate Model Alignment (Thumbs Down)"
            >
              <ThumbsDown className="size-3" />
              <span>Needs Tuning</span>
            </button>
          </div>
        ) : feedbackGiven === 'up' ? (
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            <Check className="size-3" />
            Reinforcement synced (+0.1% Alignment)
          </span>
        ) : (
          <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
            <Check className="size-3" />
            Corrective Tuning aligned (+0.2% Alignment)
          </span>
        )}
      </div>

      {/* Dropdown Options for corrective tuning */}
      {showTuningOptions && (
        <div className="flex flex-col gap-1.5 p-2.5 rounded-xl border border-blue-500/10 bg-white/70 dark:bg-zinc-900/60 shadow-xs backdrop-blur-md max-w-sm mt-1 animate-in slide-in-from-top-1 duration-200">
          <p className="text-[10px] font-bold text-gray-750 dark:text-zinc-300">How should the model self-correct?</p>
          
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'relevance', label: '🎯 Calibrate Relevance', desc: 'Boost context recall' },
              { id: 'brevity', label: '⚡ Refine Conciseness', desc: 'Reduce verbosity' },
              { id: 'structure', label: '🐍 Optimize Structure', desc: 'Improve code/format' },
              { id: 'tone', label: '🖋️ Tone Adaptation', desc: 'Match user formality' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleTuningSelect(opt.id)}
                disabled={isTuning}
                className={cn(
                  "flex flex-col items-start p-1.5 rounded-lg border text-left transition-all",
                  selectedTuning === opt.id
                    ? "bg-blue-600 border-blue-700 text-white"
                    : "border-black/5 hover:bg-black/5 hover:border-black/10 dark:border-white/5 dark:hover:bg-white/5"
                )}
              >
                <span className="text-[9px] font-bold">{opt.label}</span>
                <span className={cn("text-[7px]", selectedTuning === opt.id ? "text-blue-100" : "text-gray-400")}>{opt.desc}</span>
              </button>
            ))}
          </div>

          {isTuning && (
            <div className="flex items-center justify-center gap-1.5 text-[9px] text-blue-600 font-bold mt-1 bg-blue-500/5 py-1 rounded border border-blue-500/10">
              <RefreshCw className="size-3 animate-spin" />
              Tuning prompt weights in real-time...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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

  const { bots, activeBotId, editBot } = useBotsStore();
  const activeBot = bots.find((b) => b.id === activeBotId);

  const { onOpen } = useModalStore();

  const { drafting, review } = useDocumentStore();
  const { translationMode } = useTranslation();
  const { brainstormMode } = useBrainstorm();
  const { planGenerationMode } = usePlanGeneration();
  const { contractReviewMode } = useContractReview();
  const { reportGenerationMode } = useReportGeneration();

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

  // Track which conversation's presentation metadata we've already processed
  const processedPresentationRef = useRef<string | null>(null);

  // Check presentation metadata on conversation load (page refresh / reopen)
  useEffect(() => {
    if (!queryConversation?.metadata?.presentation_metadata) return;

    const presMeta = queryConversation.metadata.presentation_metadata;
    const convId = queryConversation.conversationId || conversationId;

    // Skip if we already processed this conversation's metadata
    if (processedPresentationRef.current === convId) return;
    // Don't override if we already have a task in progress from this session
    if (presentationTask) return;

    if (presMeta.status === 'pending' && presMeta.taskId) {
      // Resume polling for pending task
      processedPresentationRef.current = convId;
      setPresentationTask({
        taskId: presMeta.taskId,
        conversationId: convId,
        status: 'pending',
        message: 'Resuming generation...',
      });
    } else if (presMeta.status === 'completed' && presMeta.publicUrl) {
      // Mark as processed immediately to prevent loops
      processedPresentationRef.current = convId;

      // Check if last assistant message already has the document
      const lastAssistantMsg = queryConversation.messages
        ?.filter((m: any) => m.role === 'assistant')
        .pop();

      if (!lastAssistantMsg?.metadata?.document) {
        // Add download card to conversation
        updateActiveConversation(
          'Your presentation is ready! Click below to download.',
          'assistant' as any,
          convId,
          {
            document: {
              url: presMeta.publicUrl,
              file: {
                fileName:
                  presMeta.publicUrl.split('/').pop() || 'Presentation.pptx',
                format: 'pptx',
              },
              metadata: {
                title: 'Generated Presentation',
                documentType: 'PPTX',
              },
            },
          },
        );
      }
    }
  }, [
    queryConversation,
    conversationId,
    presentationTask,
    setPresentationTask,
    updateActiveConversation,
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasScrolledToUserMessage = useRef(false);
  const isFirstLoad = useRef(true);

  // Auto-scroll to bottom function
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  const scrollToLastUserMessage = () => {
    if (messagesContainerRef.current && lastMessageRef.current) {
      const container = messagesContainerRef.current;
      const element = lastMessageRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop = elementRect.top - containerRect.top + container.scrollTop;

      container.scrollTo({
        top: relativeTop,
        behavior: 'smooth',
      });
    }
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Helper functions for ModeSelector
  const getCurrentMode = (): 'assistant' | 'direct' | null => {
    if (drafting.isActive) {
      return drafting.mode === 'select_mode'
        ? null
        : (drafting.mode as 'assistant' | 'direct');
    }

    switch (selectedOption) {
      case OPTIONS.REWRITE:
        return rewriteMode === 'select_mode' || rewriteMode === 'chat'
          ? null
          : (rewriteMode as 'assistant' | 'direct');
      case OPTIONS.TRANSLATE_DOCUMENTS:
        return translationMode === 'select_mode' || translationMode === 'chat'
          ? null
          : (translationMode as 'assistant' | 'direct');
      case OPTIONS.BRAINSTORM:
        return brainstormMode === 'select_mode'
          ? null
          : (brainstormMode as 'assistant' | 'direct');
      case OPTIONS.GENERATE_PLAN:
        return planGenerationMode === 'select_mode'
          ? null
          : (planGenerationMode as 'assistant' | 'direct');
      case OPTIONS.REVIEW_CONTRACT:
        return contractReviewMode === 'select_mode'
          ? null
          : (contractReviewMode as 'assistant' | 'direct');
      case OPTIONS.GENERATE_REPORT:
        return reportGenerationMode === 'select_mode'
          ? null
          : (reportGenerationMode as 'assistant' | 'direct');
      default:
        // Default fallback to review mode (legacy behavior)
        return review.mode === 'select_mode'
          ? null
          : (review.mode as 'assistant' | 'direct');
    }
  };

  const getModeContext = () => {
    if (drafting.isActive) return 'draft';
    switch (selectedOption) {
      case OPTIONS.REWRITE:
        return 'rewrite';
      case OPTIONS.TRANSLATE_DOCUMENTS:
        return 'translate';
      case OPTIONS.BRAINSTORM:
        return 'brainstorm';
      case OPTIONS.GENERATE_PLAN:
        return 'plan-generation';
      case OPTIONS.REVIEW_CONTRACT:
        return 'contract-review';
      case OPTIONS.GENERATE_REPORT:
        return 'report-generation';
      default:
        return 'review';
    }
  };

  const shouldHideModeSelector = () => {
    const isExistingConversation =
      activeConversation?.conversationId &&
      activeConversation?.conversationId !== 'new-chat';

    if (!isExistingConversation) return false;

    switch (selectedOption) {
      case OPTIONS.REWRITE:
        return rewriteMode !== 'select_mode';
      case OPTIONS.TRANSLATE_DOCUMENTS:
        return translationMode !== 'select_mode';
      case OPTIONS.BRAINSTORM:
        return brainstormMode !== 'select_mode';
      case OPTIONS.GENERATE_PLAN:
        return planGenerationMode !== 'select_mode';
      case OPTIONS.REVIEW_CONTRACT:
        return contractReviewMode !== 'select_mode';
      case OPTIONS.GENERATE_REPORT:
        // Always show mode selector to allow switching between assistant/direct
        return false;
      default:
        return false;
    }
  };

  const shouldShowConfigForm = () => {
    // Special case: hide if file selected in rewrite mode
    if (selectedOption === OPTIONS.REWRITE && selectedFiles.length > 0) return false;

    if (drafting.isActive) {
      return drafting.mode === 'direct';
    }

    if (review && review.isActive) {
      return review.mode === 'direct';
    }

    switch (selectedOption) {
      case OPTIONS.REWRITE:
        return rewriteMode === 'direct' || rewriteMode === 'assistant';
      case OPTIONS.TRANSLATE_DOCUMENTS:
        return translationMode === 'direct' || translationMode === 'assistant';
      case OPTIONS.BRAINSTORM:
        return brainstormMode === 'structured';
      case OPTIONS.GENERATE_PLAN:
        return planGenerationMode === 'direct';
      case OPTIONS.REVIEW_CONTRACT:
        return contractReviewMode === 'direct';
      case OPTIONS.GENERATE_REPORT:
        return (
          reportGenerationMode === 'direct' ||
          reportGenerationMode === 'assistant'
        );
      default:
        return false;
    }
  };

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

  const hasMessages = !!activeConversation?.messages?.length;

  return (
    <div
      className={cn(
        'flex w-full flex-col',
        (activeConversation?.messages?.length || isLoadingResponse) &&
          'h-[calc(100vh-70px)] lg:h-screen',
        isLoading && activeConversation?.messages?.length && 'h-[calc(100vh-70px)] lg:h-screen',
      )}
    >
      <div
        className={cn(
          'sticky top-2 right-4 z-10 flex items-center justify-end pr-4',
          (pathname === '/' || pathname === '/assistant' || pathname.startsWith('/my-chatbots') || pathname.startsWith('/workflows')) && 'hidden',
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
          className="bg-white/80 dark:bg-zinc-900/80 border border-black/5 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/95 transition-all shadow-sm rounded-xl font-semibold gap-1.5"
        >
          <Share className="size-4" /> Share
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-hidden p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all">
            <EllipsisVertical className="size-5 rotate-90 text-zinc-600 dark:text-zinc-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-5 rounded-2xl backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 border border-black/10 dark:border-zinc-800 shadow-xl">
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
 
            {/* <DropdownMenuSeparator /> */}
 
            <DropdownMenuItem
              className="rounded-xl focus:bg-red-500/10 focus:text-red-600 dark:focus:bg-red-500/20 dark:focus:text-red-400"
              onClick={() => {
                if (queryConversation?._id) {
                  onOpen({
                    type: 'delete-conversation',
                    actionId: queryConversation._id,
                  });
                }
              }}
            >
              <Trash2 className="size-4 text-red-500 dark:text-red-400" />{' '}
              <span className="text-red-500 dark:text-red-400 font-medium">Delete</span>
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
        selectedOption === OPTIONS.BRAINSTORM ||
        selectedOption === OPTIONS.GENERATE_PLAN ||
        selectedOption === OPTIONS.REVIEW_CONTRACT ||
        selectedOption === OPTIONS.GENERATE_REPORT) && (
        <div
          className="flex-grow overflow-y-auto px-4 sm:px-6 lg:px-8 bg-zinc-50/50 dark:bg-zinc-950/20 transition-colors duration-300"
          ref={messagesContainerRef}
        >
          <div
            className={cn(
              'mx-auto w-full max-w-[796px] space-y-6 py-6 px-0',
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
                          'w-fit max-w-[85%] rounded-2xl bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 border border-black/5 dark:border-white/5 shadow-sm transition-colors duration-300 leading-relaxed text-sm font-medium',
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
                      <div className="text-zinc-850 dark:text-zinc-200 space-y-2">
                        {containsYouTubeUrl(message.content) ? (
                          <VideoComponentForContent content={message.content} />
                        ) : (
                          <div className="relative group">
                            <Streamdown className="w-full rounded-lg leading-relaxed text-sm">
                              {message.content}
                            </Streamdown>
 
                            <CopyButton content={message.content} />
                          </div>
                        )}

                        {activeBot && (
                          <RLFeedbackBar 
                            messageId={idx} 
                            bot={activeBot} 
                            editBot={editBot} 
                          />
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
                      className="max-w-full rounded-lg shadow-md border border-black/5 dark:border-white/5"
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
                    <>
                      <ReferencesList 
                        references={message.metadata.reference} 
                        webSearchQueries={(message.metadata as any).webSearchQueries}
                        searchEntryPoint={(message.metadata as any).searchEntryPoint}
                      />
                      <InteractiveTopology sources={message.metadata.reference} knowledgeGraph={(message.metadata as any).knowledgeGraph} />
                    </>
                  )}
                  {message.metadata?.financialTicker && (
                    <FinancialWidget 
                      ticker={message.metadata.financialTicker} 
                      liveData={message.metadata} 
                    />
                  )}

                  {((message.metadata as any)?.domain === 'sports_odds' || (message.metadata as any)?.homeTeam) && (
                    <SportsWidget sportsData={message.metadata} />
                  )}

                  {((message.metadata as any)?.domain === 'real_estate' || (message.metadata as any)?.domain === 'census_bps' || (message.metadata as any)?.address) && (
                    <RealEstateWidget realEstateData={message.metadata} />
                  )}

                  {((message.metadata as any)?.domain === 'cisa_kev' || (message.metadata as any)?.domain === 'nist_nvd_cve' || (message.metadata as any)?.cveId) && (
                    <SecurityVulnerabilityWidget vulnerabilityData={message.metadata} />
                  )}

                  {message.metadata?.brainstormData && (
                    <BrainstormData
                      data={message.metadata.brainstormData}
                      analysis={message.metadata.ideaAnalysis}
                    />
                  )}
                  {message.metadata?.planData && (
                    <PlanDataComponent
                      plan={message.metadata.planData}
                      analysis={message.metadata.planAnalysis}
                      brainstorm={message.metadata.planBrainstorm}
                    />
                  )}
                </div>
              ))}
            {/* Presentation Loading Card - shown during polling */}
            {presentationTask && presentationTask.status === 'pending' && (
              <PresentationLoadingCard message={presentationTask.message} />
            )}
            {/* Image Generation UI */}
            {shouldShowConfirmation && (
              <ImageGenConfirmation onConfirm={handleUserConfirmation} />
            )}
            {isCollectingDetails && <ImageGenSuggestions />}
            {/* Document Drafting/Review/Rewrite/Translate/Brainstorm/Plan Generation/Report Generation UI */}
            {(drafting.isActive ||
              selectedOption === OPTIONS.REWRITE ||
              selectedOption === OPTIONS.TRANSLATE_DOCUMENTS ||
              selectedOption === OPTIONS.BRAINSTORM ||
              selectedOption === OPTIONS.GENERATE_PLAN ||
              selectedOption === OPTIONS.REVIEW_CONTRACT ||
              selectedOption === OPTIONS.GENERATE_REPORT) &&
              !isLoadingResponse && (
                <>
                  {!shouldHideModeSelector() && (
                    <ModeSelector
                       currentMode={getCurrentMode()}
                      modeContext={getModeContext()}
                    />
                  )}
 
                  {shouldShowConfigForm() && (
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
              selectedOption === OPTIONS.RESEARCH ? (
                <TelemetryConsole
                  conversationId={activeConversation?.conversationId || 'new-chat'}
                  active={isLoadingResponse}
                />
              ) : (
                <div className="flex items-center justify-start py-4">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                    <span>{getStatusMessage()}</span>
                  </div>
                </div>
              )
            )}
            <div
              className={cn(
                showStartLastMessage &&
                  isLoadingResponse &&
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
            'flex h-[calc()100vh_-110px] flex-grow items-center justify-center py-4 bg-zinc-50/50 dark:bg-zinc-950/20',
          )}
        >
          <div className="flex items-center space-x-2.5 text-zinc-500 dark:text-zinc-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500/10 border-t-indigo-500"></div>
            <span className="text-xs font-semibold">loading chat...</span>
          </div>
        </div>
      )}
 
      {/* {error && !isHomePage && (
        <div className="my-6 text-center">{error.message}</div>
      )} */}
 
      {/* Sticky chat input at bottom */}
      {/* <div className="sticky bottom-0 bg-white px-4 pb-4"> */}
      <div
        className={cn(
          'sticky bottom-0 z-10 w-full px-4 transition-all duration-300 sm:px-6 lg:px-8',
          hasMessages
            ? 'flex h-20 items-center justify-center py-1.5 border-t border-black/5 dark:border-zinc-800/80 backdrop-blur-xl bg-[#FCFCFC]/70 dark:bg-zinc-950/70'
            : 'py-4 bg-transparent border-t-0',
        )}
      >
        <div className="mx-auto w-full max-w-[796px]">
          <ChatInput
            conversationId={conversationId}
            imageGenHook={imageGenHook}
            selectedFiles={selectedFiles}
            onFilesChange={setSelectedFiles}
          />
        </div>
      </div>
    </div>
  );
};

export default FullConversation;
