'use client';
import ChatInput from '@/components/ChatInput';
import CopyButton from '@/components/CopyButton';
import { ConfigForm } from '@/components/documents/ConfigForm';
import { ModeSelector } from '@/components/documents/ModeSelector';
import { ImageGenConfirmation } from '@/components/ImageGenConfirmation';
import { ImageGenSuggestions } from '@/components/ImageGenSuggestions';
import { useActiveConversation } from '@/hooks/useConversations';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useTranslation } from '@/hooks/useTranslation';
import { cn, containsYouTubeUrl } from '@/lib/utils';
import { OPTIONS, useConversationsStore } from '@/stores/useConversationsStore';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { useModalStore } from '@/stores/useModalStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Code, Download, Edit3, ShieldCheck, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Streamdown } from 'streamdown';
import ReferencesList from './ReferenceList';
import DynamicWidgetRenderer from './DynamicWidgetRenderer';
import SpaceSearchPanel from './SpaceSearchPanel';
import { ConversationMessage, ROLES } from '@/types/conversation';

import { useBotsStore } from '@/stores/useBotsStore';
import { toast } from 'sonner';
import CodeIDEWidget from './CodeIDEWidget';
import DesignStudioWidget from './DesignStudioWidget';
import { VideoStudioWidget } from './VideoStudioWidget';

import AudioComponent from './AudioComponent';
import FileDownloadCard from './FileDownloadCard';
import FinancialWidget from './FinancialWidget';
import RealEstateWidget from './RealEstateWidget';
import AcademicWidget from './AcademicWidget';
import LegalWidget from './LegalWidget';
import MedicalWidget from './MedicalWidget';
import CensusWidget from './CensusWidget';
import SecurityVulnerabilityWidget from './SecurityVulnerabilityWidget';
import SportsWidget from './SportsWidget';
import VideoComponent from './VideoComponent';
import VideoComponentForContent from './YoutubePlayer';
import InlineCitation from './InlineCitation';
import { renderContentWithCitations } from './CitationProcessor';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MessageSkeleton } from '@/components/MessageSkeleton';

import { getPresentationStatus } from '@/actions/presentationActions';
import { useBrainstorm } from '@/hooks/useBrainstorm';
import { useContractReview } from '@/hooks/useContractReview';
import { usePlanGeneration } from '@/hooks/usePlanGeneration';
import { useReportGeneration } from '@/hooks/useReportGeneration';
import { BrainstormData } from './BrainstormData';
import InteractiveFormWidget from './InteractiveFormWidget';
import InteractiveTableWidget from './InteractiveTableWidget';
import { PlanDataComponent } from './PlanData';
import PresentationLoadingCard from './PresentationLoadingCard';
import ReportData from './ReportData';
import UniversalChartWidget from './UniversalChartWidget';

interface ParsedCode {
  language: string;
  code: string;
  leftText: string;
  guideText?: string;
  isComplete: boolean;
}

function parseCodeFromMessage(content: string): ParsedCode | null {
  if (!content) return null;

  // Regex for closed code block
  const closedRegex = /```(\w*)\n([\s\S]*?)```/;
  const closedMatch = closedRegex.exec(content);
  if (closedMatch) {
    const language = closedMatch[1] || 'javascript';
    const code = closedMatch[2];
    const before = content.substring(0, closedMatch.index);
    const after = content.substring(closedMatch.index + closedMatch[0].length);
    return {
      language,
      code,
      leftText: (before.trim() + '\n\n' + after.trim()).trim(),
      guideText: after.trim() || undefined,
      isComplete: true,
    };
  }

  // Check for open code block (streaming)
  const openIndex = content.indexOf('```');
  if (openIndex !== -1) {
    const rest = content.substring(openIndex + 3);
    const firstNewLine = rest.indexOf('\n');
    if (firstNewLine !== -1) {
      const language = rest.substring(0, firstNewLine).trim() || 'javascript';
      const code = rest.substring(firstNewLine + 1);
      const before = content.substring(0, openIndex);
      return {
        language,
        code,
        leftText: before.trim(),
        guideText: undefined,
        isComplete: false,
      };
    }
  }

  return null;
}

const FullConversation = ({
  conversationId,
  isStudio,
}: {
  conversationId: string;
  isStudio?: boolean;
}) => {
  const { data } = useSession();
  const pathname = usePathname();
  const router = useRouter(); // Explicit usage for imageGen
  const queryClient = useQueryClient();

  const { data: queryConversation, isLoading } = useActiveConversation(
    conversationId,
    data?.accessToken,
  );
  const { isLeftSidebarOpen, isAccountActive } = useSidebarStore();

  const {
    setActiveConversation,
    showStartLastMessage,
    activeConversation,
    isLoadingResponse,
    selectedOption,
    setSelectedOption,
    rewriteMode,
    presentationTask,
    setPresentationTask,
    updateActiveConversation,
    setLoadingResponse,
  } = useConversationsStore();

  const { bots, activeBotId, editBot } = useBotsStore();
  const isNewChatRoute =
    conversationId === 'new-chat' ||
    conversationId === 'new-search' ||
    conversationId === 'new-research' ||
    conversationId === 'new-monitor' ||
    pathname === '/' ||
    pathname === '/c/new-chat' ||
    pathname === '/c/new-search' ||
    pathname === '/c/new-research' ||
    pathname === '/c/new-monitor';

  const expectedOption =
    conversationId === 'new-search' || pathname === '/c/new-search'
      ? OPTIONS.SEARCH
      : conversationId === 'new-research' || pathname === '/c/new-research'
        ? OPTIONS.RESEARCH
        : conversationId === 'new-monitor' || pathname === '/c/new-monitor'
          ? OPTIONS.MONITOR
          : null;

  useEffect(() => {
    if (isNewChatRoute && selectedOption !== expectedOption) {
      setSelectedOption(expectedOption);
    }
  }, [isNewChatRoute, selectedOption, expectedOption, setSelectedOption]);
  const activeBot = bots.find(b => b.id === activeBotId);

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
        return 'Evaluating...';
      case 'finalizing':
        return 'Finalizing...';
      case 'generating':
        return 'Generating...';
      default:
        return 'Thinking...';
    }
  };

  // ─── Real-time Tool Status (driven by SSE metadata.status) ──────
  const [toolStatusHistory, setToolStatusHistory] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoadingResponse) {
      setToolStatusHistory([]);
      return;
    }
    // Track tool status updates from the agent's SSE stream
    const lastMsg = activeConversation?.messages
      ?.filter((m: ConversationMessage) => m.role === ROLES.ASSISTANT)
      ?.pop();
    const status = lastMsg?.metadata?.status;
    if (status && typeof status === 'string' && status !== 'thinking...') {
      setToolStatusHistory(prev => {
        if (prev[prev.length - 1] === status) return prev;
        return [...prev.slice(-4), status]; // keep last 5
      });
    }
  }, [isLoadingResponse, activeConversation?.messages]);

  // Sync query result into Zustand
  useEffect(() => {
    if (queryConversation && !showStartLastMessage && !isLoadingResponse) {
      const queryLen = queryConversation.messages?.length || 0;
      const activeLen = activeConversation?.messages?.length || 0;
      if (
        (queryConversation.conversationId !==
          activeConversation?.conversationId &&
          queryLen > 0) ||
        (queryLen >= activeLen && queryLen > 0) ||
        (!activeLen && queryLen > 0)
      ) {
        setActiveConversation(queryConversation);
      }
    }
  }, [
    queryConversation,
    setActiveConversation,
    showStartLastMessage,
    isLoadingResponse,
    activeConversation?.conversationId,
    activeConversation?.messages?.length,
  ]);

  // Reset active conversation state when entering new-chat routes to prevent race conditions
  useEffect(() => {
    if (
      !isLoadingResponse &&
      (conversationId === 'new-chat' ||
        conversationId === 'new-search' ||
        conversationId === 'new-research' ||
        conversationId === 'new-monitor')
    ) {
      setActiveConversation(null);
      if (conversationId === 'new-search') {
        setSelectedOption(OPTIONS.SEARCH);
      } else if (conversationId === 'new-research') {
        setSelectedOption(OPTIONS.RESEARCH);
      } else if (conversationId === 'new-monitor') {
        setSelectedOption(OPTIONS.MONITOR);
      }
    }
  }, [conversationId, setActiveConversation, setSelectedOption, isLoadingResponse]);

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
        ?.filter((m: ConversationMessage) => m.role === ROLES.ASSISTANT)
        .pop();

      if (!lastAssistantMsg?.metadata?.document) {
        // Add download card to conversation
        updateActiveConversation(
          'Your presentation is ready! Click below to download.',
          ROLES.ASSISTANT,
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
  const isFirstLoad = useRef(true);
  const prevShowStartLastMessage = useRef(showStartLastMessage);

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
    setTimeout(() => {
      if (messagesContainerRef.current && lastMessageRef.current) {
        const container = messagesContainerRef.current;
        const element = lastMessageRef.current;
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const relativeTop =
          elementRect.top - containerRect.top + container.scrollTop;

        container.scrollTo({
          top: relativeTop,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  // Auto-scroll when messages change or loading state changes
  useEffect(() => {
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
            setTimeout(forceScrollLoop, 200);
          } else {
            isFirstLoad.current = false;
          }
        };

        forceScrollLoop();
      } else {
        // Only scroll to bottom if we are not loading/streaming a response
        if (!isLoadingResponse && !showStartLastMessage) {
          scrollToBottom('smooth');
        }
      }
    }
  }, [activeConversation?.messages, isLoadingResponse, showStartLastMessage]);

  // When response finishes loading, ensure we scroll to see the new content
  useEffect(() => {
    if (!isLoadingResponse && activeConversation?.messages?.length) {
      // Small delay to let the DOM update with the new assistant message
      const timer = setTimeout(() => scrollToBottom('smooth'), 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isLoadingResponse, activeConversation?.messages?.length]);

  // When showStartLastMessage transitions from true -> false (response arrived),
  // scroll to bottom so the user can see the assistant response
  useEffect(() => {
    if (prevShowStartLastMessage.current && !showStartLastMessage) {
      const timer = setTimeout(() => scrollToBottom('smooth'), 150);
      prevShowStartLastMessage.current = showStartLastMessage;
      return () => clearTimeout(timer);
    }
    prevShowStartLastMessage.current = showStartLastMessage;
    return undefined;
  }, [showStartLastMessage]);

  // When showStartLastMessage is set, scroll to the user's message
  useEffect(() => {
    if (showStartLastMessage) {
      scrollToLastUserMessage();
    }
  }, [activeConversation?.messages, showStartLastMessage]);

  const messagesList = activeConversation?.messages || [];
  const lastUserMessageIndex = (() => {
    for (let i = messagesList.length - 1; i >= 0; i--) {
      if (messagesList[i].role === 'user') return i;
    }
    return -1;
  })();

  //
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
    if (selectedOption === OPTIONS.REWRITE && selectedFiles.length > 0)
      return false;

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

  const lastAssistantMessage = activeConversation?.messages
    ?.filter((m: ConversationMessage) => m.role === ROLES.ASSISTANT)
    ?.pop();

  const codeData =
    selectedOption === OPTIONS.CODE && lastAssistantMessage
      ? parseCodeFromMessage(lastAssistantMessage.content)
      : null;

  const hasImageContent =
    !!imageGenHook.imageBase64 ||
    !!(
      lastAssistantMessage?.metadata?.imageUrl ||
      lastAssistantMessage?.metadata?.images
    ) ||
    isImageGenLoading;
  const hasVideoContent =
    !!lastAssistantMessage?.metadata?.video ||
    (selectedOption === OPTIONS.VIDEO && isLoadingResponse);

  const isSplitScreen =
    !!codeData ||
    ((selectedOption === OPTIONS.IMAGE ||
      selectedOption === OPTIONS.EDIT_IMAGE) &&
      hasImageContent) ||
    (selectedOption === OPTIONS.VIDEO && hasVideoContent);

  const handleDownloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success('Image download started!');
    } catch (err) {
      console.error('Failed to download image:', err);
      window.open(url, '_blank');
    }
  };

  const handleEditImage = async (url: string) => {
    try {
      toast.loading('Loading image into editing canvas...');

      const img = new Image();
      img.crossOrigin = 'anonymous';

      const base64 = await new Promise<string>((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } else {
            reject(new Error('Failed to get canvas 2d context'));
          }
        };
        img.onerror = () =>
          reject(new Error('Failed to load image into image element'));
        img.src = url;
      }).catch(async () => {
        // Fallback to fetch
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });

      imageGenHook.setImageBase64(base64);
      setSelectedOption(OPTIONS.EDIT_IMAGE);
      toast.dismiss();
      toast.success(
        'Image loaded! Describe the changes you want to make in the chat.',
      );
    } catch (err) {
      console.error('Error loading image for editing:', err);
      toast.dismiss();
      toast.error('Failed to load image for editing.');
    }
  };

  const renderMessagesContent = (isSplit: boolean) => {
    const mcpServerId =
      activeConversation?.metadata?.customData?.mcpServerId ||
      queryConversation?.metadata?.customData?.mcpServerId;
    const showMessages =
      !!activeConversation?.messages.length ||
      drafting.isActive ||
      (review && review.isActive) ||
      selectedOption === OPTIONS.REWRITE ||
      selectedOption === OPTIONS.TRANSLATE_DOCUMENTS ||
      selectedOption === OPTIONS.BRAINSTORM ||
      selectedOption === OPTIONS.GENERATE_PLAN ||
      selectedOption === OPTIONS.REVIEW_CONTRACT ||
      selectedOption === OPTIONS.GENERATE_REPORT;

    if (!showMessages) {
      return <div ref={messagesEndRef} />;
    }

    return (
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'mx-auto w-full space-y-6 py-6',
            isSplit ? '' : 'max-w-4xl',
          )}
        >
          {mcpServerId && (
            <div className="animate-in fade-in mb-6 flex items-start gap-3.5 rounded-2xl border border-indigo-200/50 bg-indigo-50/50 p-4 shadow-xs duration-300 dark:border-indigo-900/50 dark:bg-indigo-950/20">
              <div className="text-indigo-650 flex size-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-400">
                <ShieldCheck className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-indigo-950 uppercase dark:text-indigo-100">
                  Direct Local Security Badging
                  <span className="inline-flex items-center rounded-full border border-emerald-200/50 bg-emerald-100 px-1.5 py-0.5 text-[9px] font-medium text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-950/30 dark:text-emerald-400">
                    Active
                  </span>
                </h4>
                <p className="text-xs leading-relaxed font-medium text-indigo-950/80 dark:text-indigo-300">
                  This chat space is 100% isolated and direct-connected to your
                  local{' '}
                  <span className="font-extrabold text-indigo-700 uppercase dark:text-indigo-400">
                    {mcpServerId}
                  </span>{' '}
                  client. All operations and credential handshakes occur locally
                  with no middleware, ensuring absolute data sovereignty.
                </p>
              </div>
            </div>
          )}
          {activeConversation?.messages.length &&
            activeConversation.messages.map((message, idx) => {
              const isLastAssistant = message === lastAssistantMessage;
              const rawContent =
                isLastAssistant && codeData
                  ? codeData.leftText
                  : message.content;
              const displayContent =
                message.role === 'assistant' && rawContent
                  ? rawContent
                      .replace(
                        /^[\*\#\-\s]*(?:summary|answer|direct answer|quick answer|overview|result)[\*\#\s]*[:\-]+[\*\#\s]*/i,
                        '',
                      )
                      .replace(
                        /\s*(?:[\.\;\,\-]\s*)?(?:key\s*note|note|side\s*note|important\s*note|fun\s*fact|takeaway|key\s*takeaway|additional\s*note|fyi)\s*[:\-].*$/i,
                        '.',
                      )
                      .replace(/^[:\-\*\#\s]+/, '')
                  : rawContent;
              const isContentEmpty = !displayContent?.trim();

              return (
                <div key={idx} className="space-y-4">
                  {message.role === 'user' && (
                    <div
                      className="flex items-center justify-end"
                      data-role="user"
                      ref={idx === lastUserMessageIndex ? lastMessageRef : null}
                    >
                      <div
                        className={cn(
                          'w-fit max-w-[85%] rounded-[5px] border border-black/10 bg-white px-4 py-2.5 text-sm leading-relaxed font-medium text-zinc-900 shadow-sm transition-colors duration-300 dark:bg-white dark:text-zinc-900',
                          showStartLastMessage && 'mt-8',
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  )}

                  {message.role === 'assistant' &&
                    // Skip rendering if content is empty and there's no image/video/doc/reference/ticker
                    !(
                      isContentEmpty &&
                      !message.metadata?.imageUrl &&
                      !message.metadata?.images &&
                      !message.metadata?.video?.name &&
                      !message.metadata?.document &&
                      !message.metadata?.reference?.length &&
                      !message.metadata?.financialTicker &&
                      !(message.metadata as any)?.domain &&
                      !(message.metadata as any)?.homeTeam &&
                      !(message.metadata as any)?.address &&
                      !message.metadata?.brainstormData &&
                      !message.metadata?.planData &&
                      !message.metadata?.tableData &&
                      !message.metadata?.chartData &&
                      !message.metadata?.formData &&
                      !message.metadata?.reportData
                    ) && (
                      <div className="text-zinc-850 space-y-2 dark:text-zinc-200">
                        {containsYouTubeUrl(displayContent) ? (
                          <VideoComponentForContent content={displayContent} />
                        ) : (
                          <div className="group relative">
                            <Streamdown className="w-full rounded-lg text-sm leading-relaxed">
                              {displayContent}
                            </Streamdown>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                              <CopyButton content={displayContent} />

                              {/* ─── Inline Citation Badges (Perplexity-style) ──── */}
                              {(() => {
                                const refs = message.metadata?.reference ||
                                  message.metadata?.sources ||
                                  message.metadata?.citations ||
                                  (message as any)?.reference ||
                                  (message as any)?.sources ||
                                  (message as any)?.citations ||
                                  [];
                                if (!refs.length) return null;
                                return (
                                  <div className="flex flex-wrap items-center gap-1">
                                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mr-1 font-medium">Sources:</span>
                                    {refs.slice(0, 8).map((ref: any, i: number) => (
                                      <InlineCitation
                                        key={`src-${i}`}
                                        index={i + 1}
                                        title={ref.title}
                                        url={ref.url || ref.link}
                                        snippet={ref.snippet || ref.description || ref.text}
                                        source={ref.source}
                                      />
                                    ))}
                                  </div>
                                );
                              })()}

                              {!!(
                                message.metadata?.reference?.length ||
                                message.metadata?.sources?.length ||
                                message.metadata?.citations?.length ||
                                (message as any)?.reference?.length ||
                                (message as any)?.sources?.length ||
                                (message as any)?.citations?.length
                              ) && (
                                <ReferencesList
                                  references={
                                    message.metadata?.reference ||
                                    message.metadata?.sources ||
                                    message.metadata?.citations ||
                                    (message as any)?.reference ||
                                    (message as any)?.sources ||
                                    (message as any)?.citations ||
                                    []
                                  }
                                  webSearchQueries={
                                    (message.metadata as any).webSearchQueries
                                  }
                                  searchEntryPoint={
                                    (message.metadata as any).searchEntryPoint
                                  }
                                />
                              )}

                              {displayContent?.includes('```') && (
                                <button
                                  onClick={() => {
                                    setSelectedOption(OPTIONS.CODE);
                                    toast.success('Code opened in Sandbox!');
                                  }}
                                  className="flex items-center gap-1 rounded-[5px] px-2 py-1 text-[11px] font-semibold text-zinc-500 transition-all duration-200 hover:bg-black/5 dark:text-zinc-400 dark:hover:bg-white/5"
                                  title="Open in Sandbox"
                                >
                                  <Code className="size-3.5" />
                                  <span>Open in Sandbox</span>
                                </button>
                              )}
                            </div>

                            {/* ─── Perplexity-style Follow-Up Suggestion Chips ─── */}
                            {(() => {
                              const followUps: string[] =
                                (message.metadata as any)?.followUps ||
                                (message as any)?.followUps ||
                                (message.metadata as any)?.responseMessage?.followUps ||
                                [];
                              if (!followUps.length) return null;
                              return (
                                <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 space-y-2">
                                  <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                                    <Sparkles className="size-3 text-blue-500" />
                                    Related Questions
                                  </p>
                                  <div className="flex flex-col gap-1.5">
                                    {followUps.map((q: string, idx: number) => (
                                      <button
                                        key={`fu-${idx}`}
                                        onClick={() => {
                                          const inputEl = document.querySelector('textarea') as HTMLTextAreaElement | null;
                                          if (inputEl) {
                                            inputEl.value = q;
                                            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                                            inputEl.focus();
                                          }
                                        }}
                                        className="text-left text-xs text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] px-3 py-2 rounded-lg border border-black/5 dark:border-white/5 transition-all flex items-center justify-between group"
                                      >
                                        <span>{q}</span>
                                        <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 shrink-0 ml-2" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}

                  {(message.metadata?.imageUrl || message.metadata?.images) && (
                    <div className="group relative max-w-full overflow-hidden rounded-lg border border-black/5 shadow-md dark:border-white/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={(() => {
                          const img =
                            message.metadata?.imageUrl ||
                            message.metadata?.images;
                          if (typeof img === 'string') return img;
                          if (Array.isArray(img))
                            return typeof img[0] === 'string'
                              ? img[0]
                              : (img as any[])[0]?.url;
                          return (img as any)?.url;
                        })()}
                        alt={message.metadata?.type || 'Generated image'}
                        className="max-h-[500px] w-full object-contain"
                        onError={e => {
                          console.error(
                            '[FullConversation] Image failed to load:',
                            message.metadata?.imageUrl ||
                              message.metadata?.images,
                          );
                          console.error('Error details:', e);
                        }}
                      />
                      {/* Hover Overlay — always visible on mobile, hover on desktop */}
                      <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-100 md:opacity-0 backdrop-blur-xs transition-all duration-300 md:group-hover:opacity-100">
                        <button
                          onClick={() => {
                            const img =
                              message.metadata?.imageUrl ||
                              message.metadata?.images;
                            const imageUrl =
                              typeof img === 'string'
                                ? img
                                : Array.isArray(img)
                                  ? typeof img[0] === 'string'
                                    ? img[0]
                                    : (img as any[])[0]?.url
                                  : (img as any)?.url;
                            handleDownloadImage(
                              imageUrl,
                              message.metadata?.type || 'generated-image',
                            );
                          }}
                          className="flex transform cursor-pointer items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95"
                        >
                          <Download className="size-4" />
                          Download
                        </button>

                        <button
                          onClick={() => {
                            const img =
                              message.metadata?.imageUrl ||
                              message.metadata?.images;
                            const imageUrl =
                              typeof img === 'string'
                                ? img
                                : Array.isArray(img)
                                  ? typeof img[0] === 'string'
                                    ? img[0]
                                    : (img as any[])[0]?.url
                                  : (img as any)?.url;
                            handleEditImage(imageUrl);
                          }}
                          className="flex transform cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-indigo-500 active:scale-95"
                        >
                          <Edit3 className="size-4" />
                          Edit Image
                        </button>
                      </div>
                    </div>
                  )}
                  {message.metadata?.video?.name && (
                    <VideoComponent
                      operationId={message.metadata?.video?.name}
                    />
                  )}

                  {message.metadata?.audioUrl && (
                    <AudioComponent audioUrl={message.metadata.audioUrl} />
                  )}

                  {message.metadata?.document && (
                    <FileDownloadCard document={message.metadata.document} />
                  )}
                  {isContentEmpty &&
                    !!(
                      message.metadata?.reference?.length ||
                      message.metadata?.sources?.length ||
                      message.metadata?.citations?.length
                    ) && (
                    <ReferencesList
                      references={
                        message.metadata.reference ||
                        message.metadata.sources ||
                        message.metadata.citations ||
                        []
                      }
                      webSearchQueries={
                        (message.metadata as any).webSearchQueries
                      }
                      searchEntryPoint={
                        (message.metadata as any).searchEntryPoint
                      }
                    />
                  )}
                  <ErrorBoundary label="Widget">
                    <DynamicWidgetRenderer metadata={message.metadata} />
                  </ErrorBoundary>
                  {message.metadata?.planData && (
                    <PlanDataComponent
                      plan={message.metadata.planData}
                      analysis={message.metadata.planAnalysis}
                      brainstorm={message.metadata.planBrainstorm}
                    />
                  )}
                  {message.metadata?.tableData && (
                    <InteractiveTableWidget
                      tableData={message.metadata.tableData}
                    />
                  )}
                  {message.metadata?.chartData && (
                    <UniversalChartWidget
                      chartData={message.metadata.chartData}
                    />
                  )}
                  {message.metadata?.formData && (
                    <InteractiveFormWidget
                      formData={message.metadata.formData}
                    />
                  )}
                  {message.metadata?.reportData && (
                    <ReportData report={message.metadata.reportData} />
                  )}
                </div>
              );
            })}
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
              <div className="flex items-start gap-2.5 px-1 py-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-[#0000ff]"
                        style={{ animationDelay: '0ms' }}
                      />
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-[#0000ff]"
                        style={{ animationDelay: '150ms' }}
                      />
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-[#0000ff]"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Aphura is {lastAssistantMessage?.metadata?.status || 'thinking...'}
                    </span>
                  </div>
                  {toolStatusHistory.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 ml-7">
                      {toolStatusHistory.map((s, i) => (
                        <span key={i} className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                          {i === toolStatusHistory.length - 1 ? '→' : '✓'} {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    );
  };

  const hasMessages = activeConversation?.conversationId === conversationId && !!activeConversation?.messages?.length;
  const showAsNewChat = !hasMessages && !isLoadingResponse;

  if (
    selectedOption === OPTIONS.INSTRUCTIONS ||
    selectedOption === OPTIONS.GUARDRAILS ||
    selectedOption === OPTIONS.KNOWLEDGE
  ) {
    return null;
  }

  if (isAccountActive) {
    return (
      <div className="dark:bg-zinc-955 flex h-full w-full flex-1 flex-col items-center justify-center bg-[#e1e1e1] select-none">
        <img
          src="/assets/logo-icon.png"
          alt="logo"
          className="h-20 w-20 animate-pulse opacity-20"
          style={{ animationDuration: '4s' }}
        />
      </div>
    );
  }

  // Space workspace: search-anything-in-space UI replaces the normal conversation view
  if (activeBot && pathname.startsWith('/spaces')) {
    return <SpaceSearchPanel spaceId={activeBot.id} />;
  }

  return (
    <div
      className={cn(
        'flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#e1e1e1] dark:bg-zinc-950',
        showAsNewChat ? 'items-center pt-[30vh]' : '',
      )}
    >
      {isLoading &&
      !isNewChatRoute &&
      !activeConversation?.messages?.length ? (
        <div className="flex flex-grow flex-col gap-1 bg-transparent px-4 py-6">
          <MessageSkeleton />
          <MessageSkeleton />
          <MessageSkeleton />
        </div>
      ) : selectedOption === OPTIONS.TASK ? (
        <div
          className={cn(
            'min-h-0 w-full bg-transparent',
            showAsNewChat ? 'flex-none' : 'flex-grow',
          )}
        />
      ) : isSplitScreen ? (
        <div className="relative flex min-h-0 flex-grow flex-col md:flex-row bg-transparent transition-colors duration-300">
          {/* Left Column: Chat history */}
          <div
            className="flex min-h-0 w-full md:w-[45%] flex-col overflow-y-auto border-b md:border-b-0 md:border-r border-black/5 dark:border-zinc-800/80 max-h-[50vh] md:max-h-none md:h-full"
            ref={messagesContainerRef}
          >
            {renderMessagesContent(true)}
          </div>
          {/* Right Column: IDE panel */}
          <div className="flex min-h-0 w-full md:w-[55%] flex-col justify-start overflow-y-auto bg-zinc-950/20 p-4 md:p-6 flex-1 md:h-full">
            {codeData ? (
              <CodeIDEWidget
                code={codeData.code}
                language={codeData.language}
                guideText={codeData.guideText}
              />
            ) : selectedOption === OPTIONS.IMAGE ||
              selectedOption === OPTIONS.EDIT_IMAGE ? (
              <DesignStudioWidget
                currentImageUrl={
                  imageGenHook.imageBase64 ||
                  (() => {
                    const img =
                      lastAssistantMessage?.metadata?.imageUrl ||
                      lastAssistantMessage?.metadata?.images;
                    return typeof img === 'string'
                      ? img
                      : Array.isArray(img)
                        ? typeof img[0] === 'string'
                          ? img[0]
                          : (img as any[])[0]?.url
                        : (img as any)?.url;
                  })()
                }
                onUpload={file => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    imageGenHook.setImageBase64(reader.result as string);
                    setSelectedOption(OPTIONS.EDIT_IMAGE);
                  };
                  reader.readAsDataURL(file);
                }}
                isGenerating={isImageGenLoading}
              />
            ) : selectedOption === OPTIONS.VIDEO ? (
              <VideoStudioWidget
                currentVideoUrl={(() => {
                  const video = lastAssistantMessage?.metadata?.video as any;
                  return typeof video === 'string'
                    ? video
                    : video?.url || video?.name || null;
                })()}
                status={isLoadingResponse ? 'processing' : 'idle'}
                progress={isLoadingResponse ? 45 : 0}
              />
            ) : null}
          </div>
        </div>
      ) : (
        /* Standard Column: full scroll container */
        <div
          className={cn(
            'relative flex min-h-0 flex-col overflow-y-auto bg-transparent transition-colors duration-300',
            showAsNewChat ? 'flex-none' : 'flex-grow',
          )}
          ref={messagesContainerRef}
        >
          {renderMessagesContent(false)}
        </div>
      )}

      {/* Chat input - OUTSIDE scroll container, fixed at bottom as flex sibling */}
      <div
        className={cn(
          'w-full shrink-0 px-4 transition-all duration-300 sm:px-6 lg:px-8',
          !showAsNewChat
            ? 'mt-auto flex min-h-[64px] items-center justify-center border-t border-black/10 bg-[#e1e1e1] py-0 dark:border-zinc-800/60 dark:bg-zinc-950'
            : 'border-t-0 bg-transparent pt-3 pb-0',
        )}
      >
        <div
          className={cn(
            'mx-auto w-full transition-all duration-300',
            showAsNewChat ? 'max-w-[796px]' : 'max-w-4xl',
          )}
        >
          {showAsNewChat && (
            <div className="mb-6 flex justify-center items-center min-h-[60px]">
              {selectedOption === OPTIONS.RESEARCH ? (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h1 className="text-[2.5rem] font-semibold tracking-tight text-zinc-900 dark:text-white select-none">
                    Deep Research
                  </h1>
                </div>
              ) : selectedOption === OPTIONS.MONITOR ? (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h1 className="text-[2.5rem] font-semibold tracking-tight text-zinc-900 dark:text-white select-none">
                    Monitor Changes
                  </h1>
                </div>
              ) : selectedOption === OPTIONS.WORKFLOW ? (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h1 className="text-[2.5rem] font-semibold tracking-tight text-zinc-900 dark:text-white select-none">
                    Automate Workflows
                  </h1>
                </div>
              ) : selectedOption === OPTIONS.CODE ? (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h1 className="text-[2.5rem] font-semibold tracking-tight text-zinc-900 dark:text-white select-none">
                    Code Agent
                  </h1>
                </div>
              ) : selectedOption === OPTIONS.DESIGN ? (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h1 className="text-[2.5rem] font-semibold tracking-tight text-zinc-900 dark:text-white select-none">
                    Design Studio
                  </h1>
                </div>
              ) : selectedOption === OPTIONS.VIDEO ? (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h1 className="text-[2.5rem] font-semibold tracking-tight text-zinc-900 dark:text-white select-none">
                    Video Director
                  </h1>
                </div>
              ) : selectedOption === OPTIONS.DRAFT_DOCUMENT ? (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h1 className="text-[2.5rem] font-semibold tracking-tight text-zinc-900 dark:text-white select-none">
                    Writing Agent
                  </h1>
                </div>
              ) : (
                <img
                  src="/assets/aphura-logo.png"
                  alt="aphura"
                  className="h-12 w-auto object-contain select-none md:h-14 dark:invert"
                />
              )}
            </div>
          )}
          <ChatInput
            conversationId={conversationId}
            imageGenHook={imageGenHook}
            selectedFiles={selectedFiles}
            onFilesChange={setSelectedFiles}
            isStudio={isStudio}
            isConversationLoading={isLoading}
            showAsNewChat={showAsNewChat}
          />
        </div>
      </div>
    </div>
  );
};

export default FullConversation;
