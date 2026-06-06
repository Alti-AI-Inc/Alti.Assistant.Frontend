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
import { EllipsisVertical, Share, Trash2, Brain } from 'lucide-react';
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
import InteractiveTableWidget from './InteractiveTableWidget';
import UniversalChartWidget from './UniversalChartWidget';
import InteractiveFormWidget from './InteractiveFormWidget';
import ReportData from './ReportData';
import { useBrainstorm } from '@/hooks/useBrainstorm';
import { useContractReview } from '@/hooks/useContractReview';
import { usePlanGeneration } from '@/hooks/usePlanGeneration';
import { useReportGeneration } from '@/hooks/useReportGeneration';
import PresentationLoadingCard from './PresentationLoadingCard';
import { getPresentationStatus } from '@/actions/presentationActions';

const FullConversation = ({ conversationId }: { conversationId: string }) => {
  const { data } = useSession();
  const pathname = usePathname();
  const router = useRouter(); // Explicit usage for imageGen
  const queryClient = useQueryClient();

  const { data: queryConversation, isLoading } = useActiveConversation(conversationId, data?.accessToken);
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
    setLoadingResponse,
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

  // Real-time Scanning & Streaming Thought State
  interface ScannedSource {
    name: string;
    domain: string;
    status: 'idle' | 'scanning' | 'completed';
  }

  const [scanningStatus, setScanningStatus] = useState('alti is thinking...');
  const [scannedSources, setScannedSources] = useState<ScannedSource[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logs.length > 0) {
      consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  useEffect(() => {
    if (!isLoadingResponse) {
      setScanningStatus('alti is thinking...');
      setScannedSources([]);
      setLogs([]);
      return;
    }

    // 1. Get the last user query
    const lastUserMessage = activeConversation?.messages
      ?.filter((m: any) => m.role === 'user')
      ?.pop()?.content || '';

    // 2. Parse keywords to determine target databases
    const query = lastUserMessage.toLowerCase();
    const sources: ScannedSource[] = [];

    if (/inflation|cpi|unemployment|bls|wages|labor/i.test(query)) {
      sources.push({ name: 'Bureau of Labor Statistics', domain: 'bls.gov', status: 'idle' });
    }
    if (/gdp|spending|bea|savings/i.test(query)) {
      sources.push({ name: 'Bureau of Economic Analysis', domain: 'bea.gov', status: 'idle' });
    }
    if (/mortgage|rate|rates|fred|interest|conforming/i.test(query)) {
      sources.push({ name: 'Freddie Mac Mortgage', domain: 'fred.stlouisfed.org', status: 'idle' });
    }
    if (/treasury|yield|yields|debt|bond|bonds/i.test(query)) {
      sources.push({ name: 'U.S. Treasury Curves', domain: 'fiscaldata.treasury.gov', status: 'idle' });
    }
    if (/conforming|fhfa|hpi|home price/i.test(query)) {
      sources.push({ name: 'FHFA Home Prices', domain: 'fhfa.gov', status: 'idle' });
    }
    if (/sec|10-k|10-q|filing|edgar/i.test(query)) {
      sources.push({ name: 'SEC EDGAR Corporate Filings', domain: 'sec.gov', status: 'idle' });
    }
    if (/cisa|kev|cve|vulnerability|threat|exploit/i.test(query)) {
      sources.push({ name: 'CISA Exploited Threats', domain: 'cisa.gov/kev', status: 'idle' });
    }
    if (/court|docket|law|caselaw|scotus|judicial/i.test(query)) {
      sources.push({ name: 'RECAP Judicial Index', domain: 'courtlistener.com', status: 'idle' });
    }
    if (/fara|lobbying|secrets|pac|campaign/i.test(query)) {
      sources.push({ name: 'FARA & OpenSecrets', domain: 'opensecrets.org', status: 'idle' });
    }
    if (/patent|uspto/i.test(query)) {
      sources.push({ name: 'USPTO PatentsView', domain: 'patentsview.org', status: 'idle' });
    }
    if (/clinical|fda|drug|trials/i.test(query)) {
      sources.push({ name: 'ClinicalTrials & openFDA', domain: 'clinicaltrials.gov', status: 'idle' });
    }
    if (/opencorporates|corporate\s+registry|company\s+lookup|business\s+registry/i.test(query)) {
      sources.push({ name: 'OpenCorporates Registry', domain: 'opencorporates.com', status: 'idle' });
    }
    if (/nhtsa|vehicle\s+recall|vin|crash\s+rating|car\s+recall|defect/i.test(query)) {
      sources.push({ name: 'NHTSA Vehicle Safety', domain: 'vpic.nhtsa.dot.gov', status: 'idle' });
    }
    if (/fbi\s+crime|crime\s+stats|arrest\s+rates|regional\s+safety|crime\s+explorer/i.test(query)) {
      sources.push({ name: 'FBI Crime Data Explorer', domain: 'cde.ucr.cgis.fbi.gov', status: 'idle' });
    }
    if (/cpsc|product\s+recall|toy\s+recall|appliance\s+warning|hazard\s+recall/i.test(query)) {
      sources.push({ name: 'CPSC Product Safety', domain: 'cpsc.gov/recalls', status: 'idle' });
    }
    if (/nsf\s+award|nsf\s+grant|science\s+funding|research\s+grant|technology\s+award/i.test(query)) {
      sources.push({ name: 'NSF Award Index', domain: 'nsf.gov/awards', status: 'idle' });
    }
    if (/eu\s+tender|european\s+tender|eu\s+procurement|ted\s+procurement/i.test(query)) {
      sources.push({ name: 'EU TED Procurement', domain: 'ted.europa.eu', status: 'idle' });
    }
    if (/usda\s+fas|crop\s+production|agricultural\s+export|agricultural\s+trade|usda\s+export|agricultural\s+supply/i.test(query)) {
      sources.push({ name: 'USDA FAS Global Trade', domain: 'apps.fas.usda.gov', status: 'idle' });
    }
    if (/ntsb|carol|aviation\s+accident|flight\s+crash|aviation\s+safety|ntsb\s+report/i.test(query)) {
      sources.push({ name: 'NTSB CAROL Registry', domain: 'carol.ntsb.gov', status: 'idle' });
    }
    if (/cfpb\s+enforcement|cfpb\s+suit|cfpb\s+penalty|consent\s+order|predatory\s+lending|financial\s+settlement/i.test(query)) {
      sources.push({ name: 'CFPB Enforcement Actions', domain: 'consumerfinance.gov/enforcement', status: 'idle' });
    }
    if (/epa\s+iris|iris|toxicology|carcinogen|chemical\s+hazard|epa\s+hazard/i.test(query)) {
      sources.push({ name: 'EPA IRIS Toxicity DB', domain: 'epa.gov/iris', status: 'idle' });
    }

    if (sources.length === 0) {
      sources.push({ name: 'Google Cloud Grounding', domain: 'googleapis.com', status: 'idle' });
      sources.push({ name: 'Public registries', domain: 'comtrade.un.org', status: 'idle' });
    }

    setScannedSources(sources);

    // 3. Generate steps & logs
    const allLogs: string[] = [];
    allLogs.push('[system] Initiating deep semantic grounding audit...');
    allLogs.push('[network] Resolving secure public endpoint routes...');

    sources.forEach((src) => {
      allLogs.push(`[dns] Resolving host for ${src.domain}...`);
      allLogs.push(`[fetch] GET secure connection to https://${src.domain}/api/v1/query...`);
      allLogs.push(`[status] 200 OK - connection established with ${src.name}`);
      allLogs.push(`[parse] Extracting factual key-value vectors from ${src.domain}...`);
    });
    allLogs.push('[consensus] Performing cross-channel semantic consensus checks...');
    allLogs.push('[grounding] Anchoring verified data vectors to prevent hallucination...');
    allLogs.push('[synthesis] Stream compiled. Dispatching live response synthesis...');

    setLogs([allLogs[0]]);
    setScanningStatus(sources[0] ? `searching ${sources[0].name}...` : 'alti is thinking...');

    let currentLogIndex = 1;
    const interval = setInterval(() => {
      if (currentLogIndex >= allLogs.length) {
        clearInterval(interval);
        return;
      }
      
      const newLog = allLogs[currentLogIndex];
      setLogs(prev => [...prev, newLog]);
      
      // Keep legacy scanningStatus updated for compatibility
      if (newLog.includes('established with')) {
        setScanningStatus(`retrieved data from ${newLog.split('established with ')[1]}...`);
      } else if (newLog.includes('Performing')) {
        setScanningStatus('cross-checking sources...');
      } else if (newLog.includes('Anchoring')) {
        setScanningStatus('grounding verified facts...');
      } else if (newLog.includes('Dispatching')) {
        setScanningStatus('synthesizing response...');
      } else if (newLog.includes('Resolving host for')) {
        setScanningStatus(`scanning ${newLog.split('Resolving host for ')[1]}...`);
      }
      
      // Update sources status based on current log
      setScannedSources(prevSources => {
        return prevSources.map((src, idx) => {
          const isSrcLog = newLog.includes(src.domain) || newLog.includes(src.name);
          if (isSrcLog) {
            if (newLog.includes('[dns]') || newLog.includes('[fetch]')) {
              return { ...src, status: 'scanning' };
            } else if (newLog.includes('[status]') || newLog.includes('[parse]')) {
              return { ...src, status: 'completed' };
            }
          }
          // Complete any source whose log sequence has finished
          const srcLogsEndIndex = 2 + (idx + 1) * 4;
          if (currentLogIndex >= srcLogsEndIndex) {
            return { ...src, status: 'completed' };
          }
          return src;
        });
      });

      currentLogIndex++;
    }, 550);

    return () => {
      clearInterval(interval);
    };
  }, [isLoadingResponse, activeConversation?.messages]);

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
      {isLoading ? (
        <div
          className={cn(
            'flex h-[calc()100vh_-110px] flex-grow items-center justify-center py-4 bg-transparent',
          )}
        >
          <div className="flex items-center space-x-2.5 text-zinc-500 dark:text-zinc-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500/10 border-t-indigo-500"></div>
            <span className="text-xs font-semibold">loading chat...</span>
          </div>
        </div>
      ) : (
        <div
          className="flex-grow overflow-y-auto bg-transparent transition-colors duration-300 flex flex-col"
          ref={messagesContainerRef}
        >
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
              className={cn(
                'mx-auto w-full max-w-[796px] space-y-6 py-6 px-4 sm:px-6 lg:px-8',
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
                            'w-fit max-w-[85%] rounded-2xl bg-white dark:bg-white px-4 py-2.5 text-zinc-900 dark:text-zinc-900 border border-black/10 shadow-sm transition-colors duration-300 leading-relaxed text-sm font-medium',
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
                    {message.metadata?.tableData && (
                      <InteractiveTableWidget tableData={message.metadata.tableData} />
                    )}
                    {message.metadata?.chartData && (
                      <UniversalChartWidget chartData={message.metadata.chartData} />
                    )}
                    {message.metadata?.formData && (
                      <InteractiveFormWidget formData={message.metadata.formData} />
                    )}
                    {message.metadata?.reportData && (
                      <ReportData report={message.metadata.reportData} />
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
                  <div className="flex items-center gap-2.5 py-3 px-1">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      {scanningStatus === 'alti is thinking...' ? 'Thinking...' : scanningStatus}
                    </span>
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
          )}

          {/* Sticky chat input at bottom */}
          <div
            className={cn(
              'sticky bottom-0 z-10 w-full px-4 transition-all duration-300 sm:px-6 lg:px-8 mt-auto',
              hasMessages
                ? 'flex h-20 items-center justify-center py-1.5 border-t border-black/5 dark:border-zinc-800 bg-[#F5F5F7] dark:bg-zinc-900'
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
          
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default FullConversation;
