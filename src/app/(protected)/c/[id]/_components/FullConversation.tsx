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
import { LineChart, Table, Network, FileText, Settings } from 'lucide-react';
import { useBrainstorm } from '@/hooks/useBrainstorm';
import { useContractReview } from '@/hooks/useContractReview';
import { usePlanGeneration } from '@/hooks/usePlanGeneration';
import { useReportGeneration } from '@/hooks/useReportGeneration';
import PresentationLoadingCard from './PresentationLoadingCard';
import { getPresentationStatus } from '@/actions/presentationActions';

const SIMULATION_CHIPS = [
  {
    title: 'Market Report & Charts',
    description: 'Simulate live stock trading visual area charts & fundamentals grid.',
    prompt: '📈 Generate Real-Time Market Report for NVDA with interactive charts',
    icon: <LineChart className="h-4 w-4" />,
  },
  {
    title: 'Sales Analytics & Grid',
    description: 'Simulate paginated searchable data table & SVG area growth curve.',
    prompt: '📊 Analyze Q2 regional sales performance metrics in a searchable grid',
    icon: <Table className="h-4 w-4" />,
  },
  {
    title: 'Cluster Topic Topology',
    description: 'Simulate interactive reference topological network map.',
    prompt: '🕸️ Generate interactive topic topology map from Kubernetes microservices',
    icon: <Network className="h-4 w-4" />,
  },
  {
    title: 'Business Printable Report',
    description: 'Simulate multisection printable report with dynamic client PDF export.',
    prompt: '📄 Generate comprehensive business executive summary with printable PDF download',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: 'Interactive Settings Form',
    description: 'Simulate form config widget that saves agent variables in chat bubble.',
    prompt: '🛠️ Configure dedicated agent variables with interactive settings form',
    icon: <Settings className="h-4 w-4" />,
  },
];

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

  const handleSendMockPrompt = (prompt: string) => {
    updateActiveConversation(prompt, 'user' as any);
    setLoadingResponse(true);

    setTimeout(() => {
      let mockExtras: any = {};
      let mockAnswerText = '';

      if (prompt.includes('Market Report')) {
        mockAnswerText = "### Market Analysis: NVDA Real-Time Analytical Feed\n\nI have fetched the real-time tick feeds and technical summaries for **NVDA**. Technical indicators show a strong bullish reversal pattern (golden cross) on the daily timeframe, supported by high relative volume. Below is the interactive live chart widget and fundamental metrics grid for detailed audit.";
        mockExtras = {
          financialTicker: { symbol: 'NVDA', type: 'stock' },
          price: 135.42,
          bid: 135.40,
          ask: 135.45,
          volume: 48920150,
          source: 'NASDAQ Real-Time Tick'
        };
      } else if (prompt.includes('Sales Analytics')) {
        mockAnswerText = "### Sales Analytics: Q2 Performance Audit\n\nI have consolidated the regional sales performance metrics for Q2. Global revenue increased by **18.4%** quarter-over-quarter, driven primarily by the Enterprise Cloud segment. Below is the fully interactive searchable dataset table and the consolidated SVG performance chart.";
        mockExtras = {
          tableData: {
            title: 'Q2 Regional Revenue Breakdown',
            columns: [
              { key: 'region', label: 'Region' },
              { key: 'revenue', label: 'Revenue ($)' },
              { key: 'growth', label: 'Growth' },
              { key: 'agents', label: 'Active Agents' }
            ],
            rows: [
              { region: 'North America', revenue: 4500000, growth: '+22.4%', agents: 44 },
              { region: 'Europe (EMEA)', revenue: 3100000, growth: '+14.2%', agents: 32 },
              { region: 'Asia Pacific', revenue: 2800000, growth: '+28.1%', agents: 28 },
              { region: 'Latin America', revenue: 1200000, growth: '+8.6%', agents: 15 }
            ]
          },
          chartData: {
            title: 'Monthly Growth Curve (USD Millions)',
            type: 'area',
            series: [
              { label: 'Jan', value: 2.1 },
              { label: 'Feb', value: 2.5 },
              { label: 'Mar', value: 3.4 },
              { label: 'Apr', value: 3.8 },
              { label: 'May', value: 4.5 },
              { label: 'Jun', value: 5.2 }
            ],
            yLabel: 'Revenue ($M)'
          }
        };
      } else if (prompt.includes('Infrastructure Graph')) {
        mockAnswerText = "### System Infrastructure Topology Map\n\nI have generated the interactive network diagram mapped from your Kubernetes microservice cluster. Click on any node in the reference visualizer on the right side to inspect service health indices, active connections, and latency metrics.";
        mockExtras = {
          reference: [
            { title: 'api-gateway', url: '#', snippet: 'Entrypoint router. Health: 100%. Latency: 12ms.' },
            { title: 'auth-service', url: '#', snippet: 'JWT Token compiler. Health: 100%. Latency: 25ms.' },
            { title: 'payment-engine', url: '#', snippet: 'Stripe transaction hub. Health: 99.4%. Latency: 42ms.' },
            { title: 'mongodb-cluster', url: '#', snippet: 'Atlas Sharded replica. Health: 100%. Latency: 8ms.' }
          ],
          knowledgeGraph: {
            nodes: [
              { id: 'center', label: 'API Gateway', type: 'theme', score: 100 },
              { id: 'src-0', label: 'Auth Service', type: 'source', score: 100, snippet: 'JWT Token compiler. Latency: 25ms.' },
              { id: 'src-1', label: 'Payment Engine', type: 'source', score: 99, snippet: 'Stripe transaction hub. Latency: 42ms.' },
              { id: 'src-2', label: 'MongoDB Replica', type: 'source', score: 100, snippet: 'Atlas Sharded replica. Latency: 8ms.' }
            ],
            links: [
              { source: 'center', target: 'src-0' },
              { source: 'center', target: 'src-1' },
              { source: 'center', target: 'src-2' }
            ]
          }
        };
      } else if (prompt.includes('Executive Summary')) {
        mockAnswerText = "### Business Executive Summary: Platform Operations Report\n\nHere is the multi-section business operational report summarizing Q1 results, strategic milestones, and capital allocations. Below, you can explore the report section-by-section and trigger high-fidelity client-side PDF downloads.";
        mockExtras = {
          reportData: {
            reportId: 'rep-q1-2026',
            title: 'Q1 2026 Strategic Operational Audit',
            outputFormat: 'pdf',
            filePath: '/reports/q1_2026.pdf',
            downloadUrl: '#',
            publicUrl: '#',
            gcsPath: '',
            sections: [
              {
                title: '1. Executive Summary',
                content: 'In Q1 2026, Alti Platform completed its core infrastructure overhaul, achieving a sustained 35% reduction in API response latency across sharded MongoDB Atlas query loops. SaaS subscription conversion increased by 14.8% following Stripe integration, matching executive expectations. Enterprise churn remains sub-1%, validating product-market fit.'
              },
              {
                title: '2. Strategic Operational Milestones',
                content: 'Key operational achievements include the completion of the unified inbox architecture, deployment of sharded user notification feeds, and rollout of client-side dynamic visualization widgets. Submodule tracking remote branches have been consolidated, ensuring seamless CI/CD synchronization.'
              },
              {
                title: '3. Financial & Capital Allocations',
                content: 'A total of $1.2M in capital was allocated during the quarter, divided into Research & Development (45%), Cloud Infrastructure (30%), and Go-To-Market Operations (25%). The business maintained a positive free cash flow, ending the quarter with $4.6M in liquid reserves.'
              }
            ],
            metadata: {
              reportType: 'executive_summary',
              tone: 'Professional & Analytical',
              generatedAt: new Date().toISOString()
            }
          }
        };
      } else if (prompt.includes('Configuration Form')) {
        mockAnswerText = "### Interactive Configuration Questionnaire\n\nTo align on custom workspace settings and security guardrails for your dedicated agents, please fill out the interactive configuration form widget below. Submitting the form will immediately sync parameters with active agents.";
        mockExtras = {
          formData: {
            title: 'Agent Persona Custom Configuration',
            description: 'Define cognitive variables and execution parameters for workspace workflows.',
            submitLabel: 'Compile Workspace Settings',
            fields: [
              {
                id: 'agent_name',
                label: 'Cognitive Agent Name',
                type: 'text',
                placeholder: 'e.g. Alti Business Analyst',
                required: true
              },
              {
                id: 'execution_model',
                label: 'Execution Model Foundation',
                type: 'select',
                options: ['Gemini 1.5 Pro (Autonomous)', 'GPT-4o (Complex Tasks)', 'Claude 3.5 Sonnet (Coding)'],
                required: true
              },
              {
                id: 'temperature',
                label: 'Creativity Scale (Temperature)',
                type: 'radio',
                options: ['0.0 (Precise)', '0.5 (Balanced)', '1.0 (Creative)'],
                required: true
              },
              {
                id: 'features',
                label: 'Permitted Skill Operations',
                type: 'checkbox',
                options: ['Web Browsing', 'Code Sandbox', 'RAG Search', 'Stripe Ledger Sync'],
                required: false
              }
            ]
          }
        };
      }

      updateActiveConversation(
        mockAnswerText,
        'assistant' as any,
        activeConversation?.conversationId || 'mock-chat-id',
        mockExtras
      );
      setLoadingResponse(false);
    }, 1200);
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

      {!hasMessages && !isLoading && (
        <div className="flex-grow flex flex-col items-center justify-center px-4 py-8 relative z-20">
          <div className="mx-auto w-full max-w-[796px] text-center space-y-6">
            <p className="text-xs font-bold text-zinc-450 dark:text-zinc-500 max-w-md mx-auto">
              Select a task chip below to immediately experience and test every advanced interactive output format:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto px-4">
              {SIMULATION_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMockPrompt(chip.prompt)}
                  className="flex items-center space-x-3.5 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850/40 hover:border-zinc-350 dark:hover:border-zinc-700 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-left shadow-xs group cursor-pointer"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400 font-bold group-hover:scale-105 transition-transform">
                    {chip.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block leading-tight">{chip.title}</span>
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-500 block mt-1">{chip.description}</span>
                  </div>
                </button>
              ))}
            </div>
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
