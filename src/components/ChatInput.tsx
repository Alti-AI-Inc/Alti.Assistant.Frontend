'use client';
import { ImageGenConfirmation } from '@/components/ImageGenConfirmation';
import { ImageGenSuggestions } from '@/components/ImageGenSuggestions';
import { cn } from '@/lib/utils';

import {
  PostConversation,
  PostConversationStream,
  PostConversationWithFile,
  Conversation,
  ConversationListResponse,
  ApiResponse,
} from '@/actions/conversationsAction';
import { createSpaceSearchAction } from '@/actions/spaceSearchActions';
import { createSpaceResearchAction } from '@/actions/spaceResearchActions';
import { getOrEnsureSpaceId } from '@/lib/space-utils';
import { extractDirectSearchAnswer } from '@/lib/search-answer';
import {
  saveLocalConversation,
  removeLocalConversation,
} from '@/hooks/useConversations';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

import { useBrainstorm } from '@/hooks/useBrainstorm';
import { useContractReview } from '@/hooks/useContractReview';
import { useDocument } from '@/hooks/useDocument';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { usePlanGeneration } from '@/hooks/usePlanGeneration';
import { useReportGeneration } from '@/hooks/useReportGeneration';
import { useRewrite } from '@/hooks/useRewrite';
import { useSubscription } from '@/hooks/useSubscription';
import { useTranslation } from '@/hooks/useTranslation';
import {
  OPTIONS,
  ROLES,
  useConversationsStore,
} from '@/stores/useConversationsStore';
import { useBotsStore } from '@/stores/useBotsStore';
import { useModalStore } from '@/stores/useModalStore';
import { createFileChangeHandler } from '@/utils/fileChangeHandler';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowUp,
  File,
  FileSpreadsheet,
  FileText,
  FileType,
  Code,
  Palette,
  Video,
  PenTool,
  MessageSquare,
  Microscope,
  PenLine,
  Image as ImageIcon,
  Paperclip,
  Plus,
  Presentation,
  X,
  Check,
  Workflow,
  Headphones,
  ListTodo,
  Clock,
  ChevronDown,
  Repeat,
  CalendarClock,
  Zap,
  SlidersHorizontal,
  Mic,
  Search,
  Globe,
  Square,
Activity,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ALLOWED_DOC_EXTENSIONS } from './constants';
import { PENDING_MONITOR_DRAFT_KEY } from './monitors/monitor-utils';
import { Textarea } from './ui/textarea';
import { WarningMessageModal } from './WarningMessageModal';
import PreFlightPanel, { PreFlightSettings } from './research/PreFlightPanel';
import { isHarmfulContent, SAFETY_REFUSAL_MESSAGE } from '@/lib/safety';

import {
  ChatInputProps,
  isNewChatId,
  extractDomainFromUrl,
  deduplicateReferences,
  getFileIcon,
  getFileExtension,
} from './chat-input/utils';
import { FileAttachmentPreview } from './chat-input/FileAttachmentPreview';
import { useSpeechRecognition } from './chat-input/useSpeechRecognition';
import { useTaskCreation } from './chat-input/useTaskCreation';
import { useSearchHandler } from './chat-input/useSearchHandler';

export default function ChatInput({
  conversationId,
  imageGenHook: externalImageGenHook,
  selectedFiles: externalSelectedFiles,
  onFilesChange,
  isStudio,
  isConversationLoading,
  showAsNewChat: propShowAsNewChat,
}: ChatInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const appParam = searchParams.get('app');
  const { data } = useSession();

  const queryClient = useQueryClient();

  const {
    updateActiveConversation,
    setLoadingResponse,
    isLoadingResponse,
    selectedOption,
    setSelectedOption,
    researchTier,
    setResearchTier,
    activeConversation,
    userMessage: message,
    setUserMessage: setMessage,
    setShowStartLastMessage,
    showStartLastMessage,
  } = useConversationsStore();

  const { bots, activeBotId } = useBotsStore();
  const activeBot = bots.find(b => b.id === activeBotId);

  // Custom files state for docs (controlled or uncontrolled)
  const [internalSelectedFiles, setInternalSelectedFiles] = useState<File[]>(
    [],
  );
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  
  // ─── Stream Cancellation ────────────────────────────────────────────
  const abortControllerRef = useRef<AbortController | null>(null);
  const stopGenerating = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoadingResponse(false);
  }, [setLoadingResponse]);

  const { isListening, startListening, stopListening, toggleListening } = useSpeechRecognition({ setMessage });
  const [researchSettings, setResearchSettings] = useState<PreFlightSettings>({
    depth: 'thorough',
    consensusLevel: 'majority',
    boardPersonas: [
      'McKinsey Strategy Partner',
      'Gartner Research Director',
      'YC Technical Architect',
    ],
  });

  const selectedFiles =
    externalSelectedFiles !== undefined
      ? externalSelectedFiles
      : internalSelectedFiles;
  const setSelectedFiles = (files: File[]) => {
    if (onFilesChange) {
      onFilesChange(files);
    } else {
      setInternalSelectedFiles(files);
    }
  };

  const selectedFile = selectedFiles[0] || undefined;
  const setSelectedFile = (file: File | undefined) => {
    if (file === undefined) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles([file]);
    }
  };

  // Image generation hook - pass router and queryClient for URL redirect and query invalidation
  const internalImageGenHook = useImageGeneration({ router, queryClient });
  const {
    workflow: imageWorkflow,
    shouldShowConfirmation,
    isCollectingDetails,
    isImageWorkflowActive,
    handleImageRequest,
    handleUserConfirmation,
    handleAddDetail,
    reset: resetImageGen,
    imageBase64,
    setImageBase64,
  } = externalImageGenHook || internalImageGenHook;

  const [isDragging, setIsDragging] = useState(false);

  // Monitor scan frequency state
  const [monitorFrequency, setMonitorFrequency] = useState<string>('Frequency');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const { onOpen } = useModalStore();
  
  const {
    taskType,
    setTaskType,
    triggerType,
    setTriggerType,
    scheduledTime,
    setScheduledTime,
    eventTrigger,
    setEventTrigger,
    handleCreateTask,
  } = useTaskCreation({
    message,
    data,
    onOpen,
    setMessage,
    stopListening,
    activeBotId,
  });

  const { handleSearchOrResearch } = useSearchHandler();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const filesArray = Array.from(e.dataTransfer.files);

        if (
          selectedOption === OPTIONS.IMAGE ||
          selectedOption === OPTIONS.EDIT_IMAGE
        ) {
          const imageFiles = filesArray.filter(file =>
            file.type.startsWith('image/'),
          );
          if (imageFiles.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setImageBase64(reader.result as string);
              setSelectedOption(OPTIONS.EDIT_IMAGE);
            };
            reader.readAsDataURL(imageFiles[0]);
          } else {
            const validFiles = filesArray.filter(file => {
              const ext = '.' + file.name.split('.').pop()?.toLowerCase();
              return ALLOWED_DOC_EXTENSIONS.includes(ext);
            });
            if (validFiles.length > 0) {
              setSelectedFiles([...(selectedFiles || []), ...validFiles]);
            } else {
              toast.error(
                'Only image or supported document files are allowed.',
              );
            }
          }
        } else {
          const validFiles = filesArray.filter(file => {
            const ext = '.' + file.name.split('.').pop()?.toLowerCase();
            return ALLOWED_DOC_EXTENSIONS.includes(ext);
          });

          if (validFiles.length > 0) {
            setSelectedFiles([...(selectedFiles || []), ...validFiles]);
          } else {
            toast.error(
              'Supported document types: PDF, DOCX, XLSX, CSV, PPTX.',
            );
          }
        }
      }
    },
    [
      selectedOption,
      selectedFiles,
      setSelectedFiles,
      setImageBase64,
      setSelectedOption,
    ],
  );

  // Document hook
  const {
    drafting,
    startDrafting,
    handleDirectDrafting,
    handleAssistantDrafting,
    resetDrafting,
    review,
    startReview,
    handleDirectReview,
    handleAssistantReview,
    resetReview,
  } = useDocument();

  const {
    rewriteConfig,
    rewriteMode,
    setRewriteMode,
    handleDirectRewrite,
    handleAssistantRewrite,
    resetRewriteConfig,
  } = useRewrite();

  const {
    translationConfig,
    translationMode,
    setTranslationMode,
    resetTranslationConfig,
    handleDirectTranslate,
    handleAssistantTranslate,
  } = useTranslation();

  const {
    brainstormMode,
    setBrainstormMode,
    resetBrainstormConfig,
    handleAssistantBrainstorm,
    handleStructuredGeneration,
  } = useBrainstorm();

  const {
    planGenerationMode,
    setPlanGenerationMode,
    resetPlanGenerationConfig,
    handleAssistantPlanGeneration,
    handleDirectPlanGeneration,
  } = usePlanGeneration();

  const {
    contractReviewMode,
    setContractReviewMode,
    resetContractReviewConfig,
    handleAssistantContractReview,
    handleDirectContractReview,
  } = useContractReview();

  const {
    reportGenerationMode,
    setReportGenerationMode,
    resetReportGenerationConfig,
    handleAssistantReportGeneration,
    handleDirectReportGeneration,
  } = useReportGeneration();

  const { isFreeUser } = useSubscription();

  const hasStartedChat =
    activeConversation?.messages && activeConversation.messages.length > 0;

  const isExistingConversation =
    (activeConversation?.conversationId &&
      !isNewChatId(activeConversation.conversationId) &&
      pathname?.startsWith('/c/') &&
      pathname !== '/c/new-chat' &&
      pathname !== '/c/new-search' &&
      pathname !== '/c/new-research' &&
      pathname !== '/c/new-monitor' && pathname !== '/c/new-workflow') ||
    (conversationId && !isNewChatId(conversationId)) ||
    hasStartedChat ||
    isLoadingResponse;

  const isNewChat =
    propShowAsNewChat !== undefined
      ? propShowAsNewChat
      : !isExistingConversation;

  useEffect(() => {
    if (!isExistingConversation) {
      if (conversationId === 'new-search' || pathname === '/c/new-search') {
        setSelectedOption(OPTIONS.SEARCH);
      } else if (
        conversationId === 'new-research' ||
        pathname === '/c/new-research'
      ) {
        setSelectedOption(OPTIONS.RESEARCH);
      } else if (
        conversationId === 'new-monitor' ||
        pathname === '/c/new-monitor'
      ) {
        setSelectedOption(OPTIONS.MONITOR);
      } else if (
        conversationId === 'new-workflow' ||
        pathname === '/c/new-workflow'
      ) {
        setSelectedOption(OPTIONS.WORKFLOW);
      } else if (
        conversationId === 'new-code' ||
        pathname === '/c/new-code'
      ) {
        setSelectedOption(OPTIONS.CODE);
      } else if (
        conversationId === 'new-design' ||
        pathname === '/c/new-design'
      ) {
        setSelectedOption(OPTIONS.DESIGN);
      } else if (
        conversationId === 'new-video' ||
        pathname === '/c/new-video'
      ) {
        setSelectedOption(OPTIONS.VIDEO);
      } else if (
        conversationId === 'new-writing' ||
        pathname === '/c/new-writing'
      ) {
        setSelectedOption(OPTIONS.DRAFT_DOCUMENT);
      } else {
        setSelectedOption(null);
      }
    }
  }, [isExistingConversation, conversationId, pathname, setSelectedOption]);



  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSelectOption = useCallback(
    (value: OPTIONS) => {
      const isDeselecting = selectedOption === value;
      const nextOption = isDeselecting ? null : value;

      // Reset image generation state when switching options
      if (
        (selectedOption === OPTIONS.IMAGE ||
          selectedOption === OPTIONS.EDIT_IMAGE) &&
        nextOption !== OPTIONS.IMAGE &&
        nextOption !== OPTIONS.EDIT_IMAGE
      ) {
        resetImageGen();
      }

      // Reset drafting state if switching away from TEXT (Draft Document)
      if (
        selectedOption === OPTIONS.DRAFT_DOCUMENT &&
        nextOption !== OPTIONS.DRAFT_DOCUMENT
      ) {
        resetDrafting();
      }

      // Start drafting if switching TO TEXT
      if (nextOption === OPTIONS.DRAFT_DOCUMENT) {
        startDrafting();
      }

      // Reset review if switching away
      if (
        selectedOption === OPTIONS.REVIEW_DOCUMENTS &&
        nextOption !== OPTIONS.REVIEW_DOCUMENTS
      ) {
        resetReview();
        setSelectedFile(undefined); // Clear file
      }

      // Start review if switching TO Review
      if (nextOption === OPTIONS.REVIEW_DOCUMENTS) {
        startReview();
      }

      // Reset rewrite if switching away
      if (
        selectedOption === OPTIONS.REWRITE &&
        nextOption !== OPTIONS.REWRITE
      ) {
        resetRewriteConfig();
        setSelectedFile(undefined);
      }

      // 4. Default to 'select_mode' for Rewrite always
      if (nextOption === OPTIONS.REWRITE) {
        setRewriteMode('select_mode');
      }

      // Reset translation if switching away
      if (
        selectedOption === OPTIONS.TRANSLATE_DOCUMENTS &&
        nextOption !== OPTIONS.TRANSLATE_DOCUMENTS
      ) {
        resetTranslationConfig();
        setSelectedFile(undefined);
      }

      // Default to 'select_mode' for Translation
      if (nextOption === OPTIONS.TRANSLATE_DOCUMENTS) {
        setTranslationMode('select_mode');
      }

      // Reset Brainstorm if switching away
      if (
        selectedOption === OPTIONS.BRAINSTORM &&
        nextOption !== OPTIONS.BRAINSTORM
      ) {
        resetBrainstormConfig();
      }

      // Brainstorm Mode Logic:
      if (nextOption === OPTIONS.BRAINSTORM) {
        if (isExistingConversation) {
          setBrainstormMode('select_mode');
        }
      }

      // Reset Plan Generation if switching away
      if (
        selectedOption === OPTIONS.GENERATE_PLAN &&
        nextOption !== OPTIONS.GENERATE_PLAN
      ) {
        resetPlanGenerationConfig();
      }

      // Plan Generation Mode Logic:
      if (nextOption === OPTIONS.GENERATE_PLAN) {
        if (isExistingConversation) {
          setPlanGenerationMode('select_mode');
        }
      }

      // Reset Contract Review if switching away
      if (
        selectedOption === OPTIONS.REVIEW_CONTRACT &&
        nextOption !== OPTIONS.REVIEW_CONTRACT
      ) {
        resetContractReviewConfig();
      }

      // Contract Review Mode Logic:
      if (nextOption === OPTIONS.REVIEW_CONTRACT) {
        if (isExistingConversation) {
          setContractReviewMode('select_mode');
        }
      }

      // Reset Report Generation if switching away
      if (
        selectedOption === OPTIONS.GENERATE_REPORT &&
        nextOption !== OPTIONS.GENERATE_REPORT
      ) {
        resetReportGenerationConfig();
      }

      // Report Generation Mode Logic:
      // Always default to 'assistant' mode (conversational assistant)
      if (nextOption === OPTIONS.GENERATE_REPORT) {
        setReportGenerationMode('assistant');
      }

      setSelectedOption(nextOption);
    },
    [
      selectedOption,
      setSelectedOption,
      resetImageGen,
      resetDrafting,
      startDrafting,
      resetReview,
      startReview,
      resetRewriteConfig,
      setRewriteMode,
      resetTranslationConfig,
      setTranslationMode,
      isExistingConversation,
    ],
  );

  const getApiEndpoint = () => {
    if (activeConversation?.knowledgebaseId) return '/knowledgebase/chat';

    switch (selectedOption) {
      case OPTIONS.CREATIVE_WRITING:
        return '/writing/execute';
      case OPTIONS.PRESENTATION:
        return '/presentation/assistant';
      case OPTIONS.WRITE_CONTRACT:
        return '/legal-contract/assistant';
      case OPTIONS.CODE:
        return '/code/execute';
      case OPTIONS.AUDIO:
        return '/audio/execute';
      case OPTIONS.VIDEO:
        return '/video/execute';
      case OPTIONS.DRAFT_DOCUMENT:
        return '/write/stream';
      case OPTIONS.RESEARCH:
        return '/research/stream';
      case OPTIONS.SEARCH:
        return '/search/stream';
      case OPTIONS.MONITOR:
        return '/monitor/execute';
      case OPTIONS.WORKFLOW:
        return '/workflow/execute';
      case OPTIONS.CODE:
        return '/code/stream';
      case OPTIONS.DESIGN:
        return '/design/stream';
      case OPTIONS.DRAFT_DOCUMENT:
        return '/documents/assistant';
      case OPTIONS.IMAGE:
        return '/image/execute';
      default:
        return '/orchestrator/route-prompt'; // Master Intelligence Router
    }
  };

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${getApiEndpoint()}`;
  const mutation = useMutation({
    mutationFn: async ({
      message: userMessage,
      file,
      files,
      immediateId,
    }: {
      message: string;
      file?: File;
      files?: File[];
      immediateId?: string;
    }) => {
      const isHomePage = pathname === '/';

      if (isHarmfulContent(userMessage)) {
        return {
          success: true,
          message: 'Success',
          isStreamed: false,
          data: {
            conversationId:
              immediateId ||
              (isNewChatId(conversationId)
                ? `chat-${Date.now()}`
                : conversationId),
            responseMessage: {
              answer: SAFETY_REFUSAL_MESSAGE,
              reference: [],
            },
          },
        };
      }

      const accessToken = data?.accessToken;

      if (!accessToken) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('pending_prompt', userMessage.trim());
        }
        onOpen({ type: 'auth-modal', actionId: 'register' });
        return {
          success: false,
          message: 'Please sign up or log in to continue.',
        };
      }

      const getCategoryFromOption = (
        opt: OPTIONS | null,
      ): string | undefined => {
        if (!opt) return 'search';
        switch (opt) {
          case OPTIONS.MONITOR:
            return 'monitor';
          case OPTIONS.RESEARCH:
            return 'search';
          case OPTIONS.CODE:
          case OPTIONS.DEBUG_CODE:
            return 'code';
          case OPTIONS.IMAGE:
          case OPTIONS.EDIT_IMAGE:
            return 'image_generation';
          case OPTIONS.AUDIO:
            return 'audio';
          case OPTIONS.VIDEO:
            return 'video';
          case OPTIONS.TASK:
          case OPTIONS.Transcribe:
            return 'task';
          case OPTIONS.DRAFT_DOCUMENT:
            return 'document_drafting';
          case OPTIONS.REWRITE:
            return 'rewrite';
          case OPTIONS.TRANSLATE_DOCUMENTS:
            return 'translation';
          case OPTIONS.BRAINSTORM:
            return 'brainstorm';
          case OPTIONS.GENERATE_PLAN:
            return 'plan_generation';
          case OPTIONS.REVIEW_CONTRACT:
          case OPTIONS.WRITE_CONTRACT:
            return 'legal_contract';
          case OPTIONS.GENERATE_REPORT:
            return 'report';
          case OPTIONS.PRESENTATION:
            return 'presentation';
          case OPTIONS.CREATIVE_WRITING:
            return 'creative_writing';
          case OPTIONS.ARTICLE:
            return 'article_writer';
          case OPTIONS.SUMMARIZE:
          case OPTIONS.EXTRACT_DATA:
            return 'document_analysis';
          default:
            return 'search';
        }
      };

      if ((files && files.length > 0) || file) {
        const formData = new FormData();
        formData.append('message', userMessage);
        if (files && files.length > 0) {
          files.forEach(f => {
            formData.append('file', f);
          });
        } else if (file) {
          formData.append('file', file);
        }
        const convId = isNewChatId(conversationId)
          ? activeConversation?.conversationId || undefined
          : conversationId;
        if (convId) formData.append('conversationId', convId);

        const categoryVal = appParam
          ? 'mcp'
          : getCategoryFromOption(selectedOption);
        if (categoryVal) formData.append('category', categoryVal);
        if (appParam) {
          formData.append(
            'metadata',
            JSON.stringify({
              customData: { mcpServerId: appParam.toLowerCase() },
            }),
          );
        }

        // Stream file upload response
        const fileController = new AbortController();
        abortControllerRef.current = fileController;

        let fileConversationId = convId || '';
        useConversationsStore
          .getState()
          .streamActiveConversation('', fileConversationId || undefined);

        const fileResult = await PostConversationWithFile(
          formData,
          data.accessToken,
          chunk => {
            if (chunk.type === 'connected' && chunk.conversationId) {
              fileConversationId = chunk.conversationId;
            } else if (chunk.type === 'text' && chunk.content) {
              setLoadingResponse(false);
              useConversationsStore
                .getState()
                .streamActiveConversation(chunk.content, fileConversationId);
            } else if (chunk.type === 'metadata') {
              const metadataChunk = chunk as any;
              const metaPayload: any = {};
              if (metadataChunk.reference || metadataChunk.references) {
                metaPayload.reference = deduplicateReferences(metadataChunk.reference || metadataChunk.references || []);
              }
              if (metadataChunk.citations) {
                metaPayload.citations = deduplicateReferences(metadataChunk.citations || []);
              }
              if (metadataChunk.status) {
                metaPayload.status = metadataChunk.status;
              }
              useConversationsStore
                .getState()
                .streamActiveConversation('', fileConversationId, metaPayload);
            }
          },
          fileController.signal,
        );
        abortControllerRef.current = null;
        return fileResult;
      }

      const userTimeZone =
        typeof window !== 'undefined'
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : 'America/New_York';
      const userContext = {
        timezone: userTimeZone,
        localDate: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        localTime: new Date().toLocaleTimeString('en-US'),
      };

      const searchOrResearchResult = await handleSearchOrResearch({
        selectedOption,
        conversationId,
        pathname,
        accessToken,
        userMessage,
        immediateId,
        userContext,
        userTimeZone,
      });

      if (searchOrResearchResult) {
        return searchOrResearchResult;
      }

      const isKbId =
        activeBot?.data && /^[0-9a-fA-F]{24}$/.test(activeBot.data);
      const targetApiUrl =
        isKbId || activeConversation?.knowledgebaseId
          ? `${process.env.NEXT_PUBLIC_API_URL}/knowledgebase/chat`
          : apiUrl;
      const targetKbId =
        (isKbId ? activeBot.data : activeConversation?.knowledgebaseId) ||
        undefined;

      const extraParams: Record<string, any> = {};
      const categoryVal = appParam
        ? 'mcp'
        : getCategoryFromOption(selectedOption);
      if (categoryVal) {
        extraParams.category = categoryVal;
      }
      if (appParam) {
        extraParams.metadata = {
          customData: {
            mcpServerId: appParam.toLowerCase(),
          },
        };
      }

      const isOrchestrator = targetApiUrl.endsWith(
        '/orchestrator/route-prompt',
      );
      const isSearchStream = targetApiUrl.endsWith('/search/stream');

      if (isOrchestrator || isSearchStream) {
        let resolvedConversationId =
          (isNewChatId(conversationId) ? immediateId : conversationId) || '';
        // Seed initial empty assistant response placeholder in store so we can stream into it
        useConversationsStore
          .getState()
          .streamActiveConversation(
            '',
            isNewChatId(resolvedConversationId)
              ? undefined
              : resolvedConversationId,
          );

        // Create AbortController for stream cancellation
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const result = await PostConversationStream(
          targetApiUrl,
          userMessage,
          data.accessToken,
          isNewChatId(conversationId)
            ? activeConversation?.conversationId || undefined
            : conversationId,
          targetKbId,
          extraParams,
          chunk => {
            if (chunk.type === 'connected' && chunk.conversationId) {
              resolvedConversationId = chunk.conversationId;
            } else if (chunk.type === 'text' && chunk.content) {
              setLoadingResponse(false);
              useConversationsStore
                .getState()
                .streamActiveConversation(
                  chunk.content,
                  resolvedConversationId,
                );
            } else if (chunk.type === 'tool_status' || chunk.type === 'tool_call') {
              // Real tool execution telemetry from the agent
              const toolChunk = chunk as any;
              useConversationsStore
                .getState()
                .streamActiveConversation('', resolvedConversationId, {
                  status: toolChunk.tool ? `Using ${toolChunk.tool}...` : (toolChunk.status || toolChunk.content || 'Processing...'),
                });
            } else if (chunk.type === 'metadata') {
              const metaPayload: any = {};
              const metadataChunk = chunk as any;
              if (metadataChunk.reference || metadataChunk.references) {
                metaPayload.reference = deduplicateReferences(metadataChunk.reference || metadataChunk.references || []);
              }
              if (metadataChunk.citations) {
                metaPayload.citations = deduplicateReferences(metadataChunk.citations || []);
              }
              if (metadataChunk.status) {
                metaPayload.status = metadataChunk.status;
              }

              useConversationsStore
                .getState()
                .streamActiveConversation('', resolvedConversationId, metaPayload);
            }
          },
          controller.signal,
        );

        abortControllerRef.current = null;

        if (!result.success) {
          return result;
        }

        const messages =
          useConversationsStore.getState().activeConversation?.messages || [];
        const lastMessage = messages[messages.length - 1];

        return {
          success: true,
          message: 'Success',
          isStreamed: true,
          data: {
            conversationId: resolvedConversationId || immediateId,
            responseMessage: {
              answer: lastMessage?.content || '',
              reference: deduplicateReferences(
                lastMessage?.metadata?.reference || [],
              ),
            },
          },
        };
      }

      return await PostConversation(
        targetApiUrl,
        userMessage,
        data.accessToken,
        isNewChatId(conversationId)
          ? activeConversation?.conversationId || undefined
          : conversationId,
        targetKbId,
        extraParams,
      );
    },
    onMutate: ({ message: userMessage, immediateId }) => {
      const isNew = isNewChatId(conversationId);
      const generatedId =
        immediateId ||
        (isNew
          ? selectedOption === OPTIONS.SEARCH ||
            conversationId === 'new-search' ||
            pathname === '/c/new-search'
            ? `search-${Date.now()}`
            : selectedOption === OPTIONS.RESEARCH ||
                conversationId === 'new-research' ||
                pathname === '/c/new-research'
              ? `research-${Date.now()}`
              : `chat-${Date.now()}`
          : conversationId || `chat-${Date.now()}`);

      const chatTitle = userMessage.trim().slice(0, 45) || 'New Chat';

      const initialEntry = {
        _id: generatedId,
        conversationId: generatedId,
        title: chatTitle,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        status: 'active' as const,
        messageCount: 1,
        isPublic: false,
        is_deep_search: selectedOption === OPTIONS.RESEARCH,
        lastActivity: new Date().toISOString(),
        messages: [
          {
            role: ROLES.USER,
            content: userMessage,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      if (isNew) {
        saveLocalConversation(initialEntry);

        queryClient.setQueriesData<InfiniteData<ConversationListResponse>>(
          { queryKey: ['conversations'] },
          (oldData) => {
            if (!oldData || !oldData.pages || oldData.pages.length === 0) {
              return {
                pageParams: [1],
                pages: [
                  {
                    conversations: [initialEntry],
                    pagination: {
                      page: 1,
                      limit: 20,
                      total: 1,
                      pages: 1,
                      hasNext: false,
                      hasPrev: false,
                    },
                  },
                ],
              };
            }
            return {
              ...oldData,
              pages: oldData.pages.map((page, index: number) => {
                if (index === 0) {
                  const remaining = (page.conversations || []).filter(
                    (c: Conversation) =>
                      c &&
                      c._id !== generatedId &&
                      c.conversationId !== generatedId,
                  );
                  return {
                    ...page,
                    conversations: [initialEntry, ...remaining],
                  };
                }
                return page;
              }),
            };
          },
        );
      }

      updateActiveConversation(userMessage, ROLES.USER, generatedId);
      setLoadingResponse(true);

      return { immediateId: generatedId, chatTitle };
    },
    onSuccess: (
      response: ApiResponse,
      { message: userMessage, immediateId },
      context: { immediateId?: string; chatTitle?: string } | undefined,
    ) => {
      const initId = immediateId || context?.immediateId;
      const newId =
        response?.data?.conversationId ||
        initId ||
        (isNewChatId(conversationId) ? `chat-${Date.now()}` : conversationId);

      if (!response || !response.success) {
        console.warn(
          'PostConversation failed:',
          response?.debugMessage || 'Unknown error',
        );
        if (response?.statusCode === 429) {
          toast.error('Daily request limit reached', {
            description: response.message,
            action: {
              label: 'Upgrade Plan',
              onClick: () => router.push('/upgrade'),
            },
          });
        }
        const displayError =
          response?.message === 'Not found' ||
          response?.message === 'Api not found'
            ? 'Service is temporarily unavailable. Please try again shortly.'
            : response?.message || 'An unexpected error occurred.';
        updateActiveConversation(displayError, ROLES.ASSISTANT, newId);

        if (initId) {
          const errorConv = {
            _id: newId,
            conversationId: newId,
            title: userMessage.slice(0, 45) || 'New Chat',
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            status: 'active' as const,
            messageCount: 2,
            isPublic: false,
            is_deep_search: selectedOption === OPTIONS.RESEARCH,
            lastActivity: new Date().toISOString(),
            messages: [
              {
                role: ROLES.USER,
                content: userMessage,
                timestamp: new Date().toISOString(),
              },
              {
                role: ROLES.ASSISTANT,
                content: displayError,
                timestamp: new Date().toISOString(),
              },
            ],
          };
          saveLocalConversation(errorConv);
        }

        setShowStartLastMessage(false);
        setLoadingResponse(false);
        
        if (isNewChatId(conversationId)) {
          if (activeBotId && isStudio) {
            router.replace(`/spaces?bot=${activeBotId}&thread=${newId}`);
          } else {
            if (typeof window !== 'undefined') {
              window.history.replaceState(null, '', `/c/${newId}`);
            }
            router.replace(`/c/${newId}`, { scroll: false });
          }
        }
        
        return;
      }
      if (!response?.data) {
        setShowStartLastMessage(false);
        setLoadingResponse(false);
        return;
      }
      // Extract media and attachments based on the new agent JSON schemas or legacy schema
      let imageUrl =
        response.data?.responseMessage?.images?.[0] ||
        response.data?.responseMessage?.imageUrl;
      if (response.data?.imageUrl) {
        imageUrl = response.data.imageUrl;
      }

      let name = response.data?.responseMessage?.video?.name;
      if (response.data?.videoUrl) {
        name = response.data.videoUrl;
      }

      let audioUrl = response.data?.responseMessage?.audioUrl;
      if (response.data?.audioBase64) {
        audioUrl = `data:audio/mp3;base64,${response.data.audioBase64}`;
      }

      let rawReference =
        response.data?.responseMessage?.reference ||
        response.data?.reference ||
        response.data?.citations;
      if (response.data?.sources) {
        rawReference = response.data.sources;
      }
      if (
        (!rawReference || rawReference.length === 0) &&
        Array.isArray(response.data?.results)
      ) {
        rawReference = response.data.results
          .filter((r: { url?: string }) => !r.url?.toLowerCase().includes('exa.ai'))
          .map((r: { title?: string; url?: string; summary?: string; favicon?: string }) => ({
            title: r.title || r.url,
            url: r.url,
            summary: r.summary,
            favicon: r.favicon,
          }));
      }
      const reference = deduplicateReferences(rawReference || []);

      const document =
        response.data?.document || response.data?.responseMessage?.document;

      // Determine the appropriate response text based on the context
      const getResponseText = () => {
        if (response.data?.responseMessage?.answer === SAFETY_REFUSAL_MESSAGE) {
          return SAFETY_REFUSAL_MESSAGE;
        }

        const isKbId =
          activeBot?.data && /^[0-9a-fA-F]{24}$/.test(activeBot.data);
        if (activeConversation?.knowledgebaseId || isKbId) {
          return response.data?.message;
        }

        // If gathering details from LangGraph agent, return the reply
        if (response.data?.status === 'gathering_details') {
          return response.data?.reply;
        }

        switch (selectedOption) {
          case OPTIONS.SEARCH:
          case OPTIONS.MONITOR:
return (
              response.data?.responseMessage?.answer ||
              response.data?.content ||
              response.data?.summary ||
              ''
            );
          case OPTIONS.IMAGE:
          case OPTIONS.AUDIO:
          case OPTIONS.VIDEO:
            return (
              response.data?.content ||
              response.data?.prompt ||
              response.data?.responseMessage?.text
            );
          case OPTIONS.CREATIVE_WRITING:
            return response.data?.content || response.data?.response;
          case OPTIONS.CODE:
            if (response.data?.code) {
              const { code, language, explanation } = response.data;
              return `${explanation || 'Here is the code:'}\n\n\`\`\`${language || 'javascript'}\n${code}\n\`\`\``;
            }
            if (response.data?.fixedCode) {
              const { fixedCode,
  Palette,
  Video,
  PenTool, explanation } = response.data;
              return `${explanation || 'Here is the fixed code:'}\n\n\`\`\`javascript\n${fixedCode}\n\`\`\``;
            }
            return response.data?.responseMessage?.answer;
          case OPTIONS.RESEARCH:
            return (
              response.data?.responseMessage?.answer ||
              response.data?.synthesis ||
              response.data?.content ||
              ''
            );
          case OPTIONS.PRESENTATION:
            return response.data?.message;
          case OPTIONS.WRITE_CONTRACT:
            return response.data?.contract;
          default:
            return (
              response.data?.content || response.data?.responseMessage?.answer
            );
        }
      };

      const assistantText = getResponseText();

      if (!response.isStreamed) {
        updateActiveConversation(assistantText, ROLES.ASSISTANT, newId, {
          ...(imageUrl && { imageUrl }),
          ...(name && { video: { name } }),
          ...(reference && { reference }),
          ...(document && { document }),
          ...(audioUrl && { audioUrl }),
        });
      }

      if (response?.data) {
        if (initId && initId !== newId) {
          removeLocalConversation(initId);
        }

        const convData = {
          _id: newId,
          conversationId: newId,
          title: userMessage.slice(0, 45) || 'New Chat',
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          status: 'active' as const,
          messageCount: 2,
          isPublic: false,
          is_deep_search: selectedOption === OPTIONS.RESEARCH,
          lastActivity: new Date().toISOString(),
          messages: [
            {
              role: ROLES.USER,
              content: userMessage,
              timestamp: new Date().toISOString(),
            },
            {
              role: ROLES.ASSISTANT,
              content: assistantText,
              metadata: {
                ...(imageUrl && { imageUrl }),
                ...(name && { video: { name } }),
                ...(reference && { reference }),
                ...(document && { document }),
                ...(audioUrl && { audioUrl }),
              },
              timestamp: new Date().toISOString(),
            },
          ],
        };
        saveLocalConversation(convData);
        queryClient.setQueryData(
          ['activeConversation', newId, data?.accessToken],
          convData,
        );

        // Update React Query's conversations cache directly
        queryClient.setQueriesData<InfiniteData<ConversationListResponse>>(
          { queryKey: ['conversations'] },
          (oldData) => {
            if (!oldData || !oldData.pages) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page, idx: number) => {
                if (idx === 0) {
                  const remaining = (page.conversations || []).filter(
                    (c: Conversation) =>
                      c &&
                      c._id !== newId &&
                      c.conversationId !== newId &&
                      (initId
                        ? c._id !== initId && c.conversationId !== initId
                        : true),
                  );
                  return {
                    ...page,
                    conversations: [convData, ...remaining],
                  };
                }
                return page;
              }),
            };
          },
        );

        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ['conversations'],
          });
        }, 2000);

        if (isNewChatId(conversationId) && newId) {
          if (activeBotId && pathname.startsWith('/spaces')) {
            useBotsStore
              .getState()
              .addThread(
                activeBotId,
                newId,
                userMessage.slice(0, 50) || 'New Chat',
              );
            router.replace(`/spaces?bot=${activeBotId}&thread=${newId}`);
          } else {
            if (typeof window !== 'undefined') {
              window.history.replaceState(null, '', `/c/${newId}`);
            }
            router.replace(`/c/${newId}`, { scroll: false });
          }
        }
      }
      setShowStartLastMessage(false);
      setLoadingResponse(false);
    },
    onError: (error, { message: userMessage, immediateId }: { message?: string; immediateId?: string }) => {
      console.warn('Message post failed:', error);
      setShowStartLastMessage(false);
      setLoadingResponse(false);
    },
    onSettled: () => {
      setShowStartLastMessage(false);
      setLoadingResponse(false);
    },
  });

  const handleSubmit = async () => {
    // Stop recording/listening if active
    stopListening();

    // Prevent submission if response is loading or message is empty
    if (isLoadingResponse) return;

    if (!message?.trim()) return;

    if (!data?.accessToken) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pending_prompt', message.trim());
      }
      onOpen({ type: 'auth-modal', actionId: 'register' });
      return;
    }

    if (selectedOption === OPTIONS.MONITOR && !pathname.startsWith('/spaces')) {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(
          PENDING_MONITOR_DRAFT_KEY,
          message.trim(),
        );
      }

      setMessage('');
      setShowStartLastMessage(false);

      const destination = activeBotId
        ? `/spaces?bot=${activeBotId}&section=monitor`
        : '/spaces?section=monitor';

      router.push(destination);
      toast.info('Monitor draft moved to your selected space.');
      return;
    }

    setShowStartLastMessage(true);

    const handleImageWorkflow = async () => {
      if (isCollectingDetails) {
        // We're in detail collection phase - add detail
        await handleAddDetail(message);
      } else {
        // Start new image generation flow
        await handleImageRequest(
          message,
          selectedOption === OPTIONS.EDIT_IMAGE || !!imageBase64,
          imageBase64 || undefined,
          activeConversation?.conversationId,
        );
      }
    };

    switch (selectedOption) {
      case OPTIONS.IMAGE:
        await handleImageWorkflow();
        break;

      case OPTIONS.EDIT_IMAGE:
        if (!imageBase64) {
          // Warning is shown via UI component
          return;
        }
        await handleImageWorkflow();
        break;

      case OPTIONS.DRAFT_DOCUMENT:
        if (drafting.mode === 'direct') {
          await handleDirectDrafting(message);
        } else if (drafting.mode === 'assistant') {
          await handleAssistantDrafting(message);
        } else {
          // Default to assistant if mode not explicitly selected but user submitted
          await handleAssistantDrafting(message);
        }
        break;

      case OPTIONS.REVIEW_DOCUMENTS:
        if (!isExistingConversation && !selectedFile) {
          // Warning is shown via UI component
          return;
        }

        // Pattern matches DRAFT_DOCUMENT workflow
        if (review.mode === 'direct') {
          // Direct mode ALWAYS requires a file
          if (!selectedFile) {
            alert(
              'Direct review mode requires a document. Please upload a file.',
            );
            return;
          }
          await handleDirectReview(selectedFile, message);
          setSelectedFile(undefined);
        } else if (review.mode === 'assistant') {
          // Assistant mode - check if file is needed for new conversations

          // handleAssistantReview handles both new and continue internally
          if (selectedFile) {
            await handleAssistantReview(selectedFile, message);
            setSelectedFile(undefined);
          } else {
            // Continue existing conversation without file (reuse drafting handler)
            await handleAssistantDrafting(message);
          }
        } else {
          // Default to assistant mode (fallback like DRAFT_DOCUMENT does)

          if (selectedFile) {
            await handleAssistantReview(selectedFile, message);
            setSelectedFile(undefined);
          } else {
            await handleAssistantDrafting(message);
          }
        }
        break;

      case OPTIONS.REWRITE:
        if (rewriteMode === 'select_mode') {
          return;
        }

        if (rewriteMode === 'direct') {
          await handleDirectRewrite(message);
        } else if (rewriteMode === 'chat') {
          // Chat mode (continued conversation)
          await handleAssistantRewrite(
            message,
            undefined, // No text content needed for continue
            selectedFile,
          );
        } else {
          // Assistant mode (default)
          const hasContent = rewriteConfig.textContent?.trim() || selectedFile;
          //

          if (!hasContent) {
            if (isExistingConversation) {
              // Allow continue without specific rewrite content
              await handleAssistantRewrite(message);
              return;
            }
            return;
          }

          await handleAssistantRewrite(
            message,
            rewriteConfig.textContent,
            selectedFile,
          );
        }
        break;

      case OPTIONS.TRANSLATE_DOCUMENTS:
        if (translationMode === 'select_mode') {
          return;
        }

        if (translationMode === 'direct') {
          // Check if we have message (since config text is removed)
          if (!message?.trim()) {
            // UI typically handles empty message button state, but good to have safety
            return;
          }
          // If translating, check if target lang is set
          if (
            !translationConfig.isDetectMode &&
            !translationConfig.targetLanguage
          ) {
            alert('Please select a target language.');
            return;
          }
          await handleDirectTranslate(message);
        } else {
          // Assistant Mode or Chat Mode (handled same for now)
          await handleAssistantTranslate(message, selectedFile);
        }
        break;

      case OPTIONS.BRAINSTORM:
        if (brainstormMode === 'select_mode') {
          return;
        }

        const brainstormMessage = message;
        setMessage('');

        if (brainstormMode === 'structured') {
          // In structured mode, 'message' might be the idea if user typed one
          // ConfigForm handles configuration
          if (!brainstormMessage?.trim()) {
            // UI usually disables button, but just in case
            return;
          }
          await handleStructuredGeneration(
            brainstormMessage,
            isExistingConversation
              ? activeConversation?.conversationId
              : undefined,
          );
        } else {
          // Assistant mode (default)
          await handleAssistantBrainstorm(
            brainstormMessage,
            isExistingConversation
              ? activeConversation?.conversationId
              : undefined,
          );
        }
        break;

      case OPTIONS.GENERATE_PLAN:
        if (planGenerationMode === 'select_mode') {
          return;
        }

        const planMessage = message;
        setMessage('');

        if (planGenerationMode === 'direct') {
          // Direct mode uses config form parameters
          if (!planMessage?.trim()) {
            return;
          }
          await handleDirectPlanGeneration(planMessage);
        } else {
          // Assistant mode (default) - supports file upload
          await handleAssistantPlanGeneration(
            planMessage,
            isExistingConversation
              ? activeConversation?.conversationId
              : undefined,
            selectedFile,
          );
          if (selectedFile) {
            setSelectedFile(undefined);
          }
        }
        break;

      case OPTIONS.REVIEW_CONTRACT:
        if (contractReviewMode === 'select_mode') {
          return;
        }

        const contractMessage = message;
        setMessage('');

        if (contractReviewMode === 'direct') {
          // Direct mode requires file upload
          if (!selectedFile) {
            // Warning is shown via UI component
            return;
          }
          await handleDirectContractReview(selectedFile);
          setSelectedFile(undefined);
        } else {
          // Assistant mode - file is optional
          await handleAssistantContractReview(
            contractMessage,
            isExistingConversation
              ? activeConversation?.conversationId
              : undefined,
            selectedFile,
          );
          if (selectedFile) {
            setSelectedFile(undefined);
          }
        }
        break;

      case OPTIONS.GENERATE_REPORT:
        const reportMessage = message;
        setMessage('');

        // Fallback: if somehow still in select_mode, default to assistant
        const effectiveReportMode =
          reportGenerationMode === 'select_mode' || !reportGenerationMode
            ? 'assistant'
            : reportGenerationMode;

        if (effectiveReportMode === 'direct') {
          await handleDirectReportGeneration(reportMessage);
          if (selectedFile) setSelectedFile(undefined);
        } else {
          // Assistant mode (default) - supports file upload
          await handleAssistantReportGeneration(
            reportMessage,
            isExistingConversation
              ? activeConversation?.conversationId
              : undefined,
            selectedFile,
          );
          if (selectedFile) {
            setSelectedFile(undefined);
          }
        }
        break;

      default:
        // Use regular mutation for options that just need a standardized API call
        // The specific URL is already determined by getApiEndpoint()
        const isNew = isNewChatId(conversationId);
        const immediateId = isNew
          ? selectedOption === OPTIONS.SEARCH ||
            conversationId === 'new-search' ||
            pathname === '/c/new-search'
            ? `search-${Date.now()}`
            : selectedOption === OPTIONS.RESEARCH ||
                conversationId === 'new-research' ||
                pathname === '/c/new-research'
              ? `research-${Date.now()}`
              : `chat-${Date.now()}`
          : conversationId || `chat-${Date.now()}`;

        mutation.mutate({
          message,
          file: selectedFile || undefined,
          files: selectedFiles,
          immediateId,
        });
        setSelectedFiles([]);
    }

    setMessage('');
  };
  const {
    data: knowledgeBases,
    isLoading,

    // error,
  } = useKnowledgeBases(data?.accessToken);

  const activeKnowledgeBaseName = knowledgeBases?.find(
    kb => kb.id === activeConversation?.knowledgebaseId,
  )?.name;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    if (data?.accessToken && typeof window !== 'undefined') {
      const pendingPrompt = sessionStorage.getItem('pending_prompt');
      if (pendingPrompt) {
        setMessage(pendingPrompt);
        sessionStorage.removeItem('pending_prompt');
      }
    }
  }, [data?.accessToken]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Use extracted file change handler
  const handleFileChange = createFileChangeHandler({
    selectedOption,
    fileInputRef,
    selectedFiles,
    setSelectedFiles,
    setImageBase64,
    setSelectedOption,
    allowedDocExtensions: ALLOWED_DOC_EXTENSIONS,
  });

  const handleRemoveImage = () => {
    setImageBase64(null);
    if (selectedOption === OPTIONS.EDIT_IMAGE) {
      setSelectedOption(null);
    }
  };

  const warningConfig = useMemo(
    () => [
      {
        condition: selectedOption === OPTIONS.EDIT_IMAGE && !imageBase64,
        title: 'Upload Image',
        description: 'Please upload an image to continue with editing.',
      },
      {
        condition:
          selectedOption === OPTIONS.REWRITE &&
          rewriteMode === 'select_mode' &&
          (isNewChatId(activeConversation?.conversationId) ||
            activeConversation?.conversationId === undefined),
        title: 'Select Rewrite Mode',
        description: 'Please select a rewrite mode to continue.',
      },
      {
        condition:
          selectedOption === OPTIONS.REWRITE &&
          rewriteMode === 'assistant' &&
          !rewriteConfig.textContent &&
          !selectedFile &&
          !isExistingConversation,
        title: 'Add Content',
        description: 'Please enter text or upload a file to rewrite.',
      },
      {
        condition:
          selectedOption === OPTIONS.REVIEW_CONTRACT &&
          contractReviewMode === 'direct' &&
          !selectedFile,
        title: 'Upload Contract',
        description: 'Please upload a contract file to review.',
      },
    ],
    [
      selectedOption,
      selectedFile,
      isExistingConversation,
      imageBase64,
      rewriteMode,
      activeConversation?.conversationId,
      rewriteConfig.textContent,
      contractReviewMode,
    ],
  );

  const activeWarning = warningConfig.find(w => w.condition);

  const hasMessages =
    activeConversation?.messages && activeConversation.messages.length > 0;

  const attachmentsPreview = (
    <FileAttachmentPreview
      imageBase64={imageBase64}
      handleRemoveImage={handleRemoveImage}
      selectedFiles={selectedFiles}
      setSelectedFiles={setSelectedFiles}
    />
  );

  const getModeIcon = () => {
    switch (selectedOption) {
      case OPTIONS.RESEARCH: return <Microscope className="size-3.5" />;
      case OPTIONS.DRAFT_DOCUMENT: return <PenTool className="size-3.5" />;
      case OPTIONS.CODE: return <Code className="size-3.5" />;
      case OPTIONS.DESIGN: return <Palette className="size-3.5" />;
      case OPTIONS.VIDEO: return <Video className="size-3.5" />;
      default: return <Globe className="size-3.5" />;
    }
  };

  const getModeName = () => {
    switch (selectedOption) {
      case OPTIONS.RESEARCH: return 'Research';
      case OPTIONS.DRAFT_DOCUMENT: return 'Write';
      case OPTIONS.CODE: return 'Code';
      case OPTIONS.DESIGN: return 'Design';
      case OPTIONS.VIDEO: return 'Video';
      default: return 'Search';
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept={ALLOWED_DOC_EXTENSIONS.join(',')}
      />
      {/* Image Gen UI is now handled by parent in FullConversation, but kept here for fallback/other pages */}
      {!externalImageGenHook && shouldShowConfirmation && (
        <ImageGenConfirmation onConfirm={handleUserConfirmation} />
      )}

      {!externalImageGenHook && isCollectingDetails && <ImageGenSuggestions />}

      {activeWarning && (
        <WarningMessageModal
          title={activeWarning.title}
          description={activeWarning.description}
        />
      )}

      <div
        className={cn(
          'relative z-20 mx-auto w-full space-y-6 px-0 transition-all duration-300',
          isNewChat ? 'max-w-[796px]' : 'max-w-4xl',
        )}
      >
        {appParam && (
          <div className="animate-in fade-in mb-3 flex items-center justify-between rounded-xl border border-indigo-200/50 bg-indigo-50/50 px-4 py-2.5 shadow-xs duration-300 dark:border-indigo-900/50 dark:bg-indigo-950/20">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
              </span>
              <p className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">
                Isolated Chat Space:{' '}
                <span className="font-extrabold text-indigo-600 uppercase dark:text-indigo-400">
                  {appParam}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                params.delete('app');
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Exit Space
            </button>
          </div>
        )}
        {/* Unified Single-Height Prompt Box Container */}
        <div className="flex w-full flex-col gap-2 px-4 sm:px-0">
          {/* Attached files preview: shown ABOVE prompt box when in conversation */}
          {!isNewChat && attachmentsPreview}

          <div
            ref={containerRef}
            className="relative flex min-h-[52px] w-full items-center gap-1.5 rounded-[5px] border border-zinc-300 bg-white px-3 py-1.5 shadow-xs transition-all duration-300 dark:border-zinc-700/80 dark:bg-zinc-800"
          >


            {/* Attach Files Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
                  disabled={isLoadingResponse}
                  className={cn(
                    'flex size-8 sm:size-6 flex-shrink-0 cursor-pointer items-center justify-center bg-transparent text-zinc-400 transition-colors hover:text-zinc-600 focus:outline-none dark:text-zinc-500 dark:hover:text-zinc-300',
                    isLoadingResponse && 'cursor-not-allowed opacity-50',
                  )}
                  aria-label="Attach files"
                >
                  <Paperclip strokeWidth={1.5} className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Attach Files</p>
              </TooltipContent>
            </Tooltip>

            {/* Actions Dropdown Button */}


            {/* Textarea - Single height but auto-expanding */}
            <Textarea
              ref={textareaRef}
              name="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => {
                // Escape to stop generating
                if (e.key === 'Escape' && isLoadingResponse) {
                  e.preventDefault();
                  stopGenerating();
                  return;
                }
                // Enter or Cmd/Ctrl+Enter to submit
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (
                    selectedOption === OPTIONS.TASK &&
                    !hasMessages &&
                    !isExistingConversation
                  ) {
                    handleCreateTask();
                  } else {
                    handleSubmit();
                  }
                }
              }}
              placeholder={
                selectedOption === OPTIONS.TASK &&
                !hasMessages &&
                !isExistingConversation
                  ? 'Describe the task you want to automate...'
                  : selectedOption === OPTIONS.RESEARCH &&
                      !hasMessages &&
                      !isExistingConversation
                    ? 'What do you want to research?'
                    : selectedOption === OPTIONS.MONITOR &&
                        !hasMessages &&
                        !isExistingConversation
                      ? 'What do you want to monitor?'
                      : selectedOption === OPTIONS.WORKFLOW &&
                          !hasMessages &&
                          !isExistingConversation
                        ? 'What do you want to automate?'
                        : selectedOption === OPTIONS.CODE &&
                            !hasMessages &&
                            !isExistingConversation
                          ? 'What do you want to build?'
                          : selectedOption === OPTIONS.DESIGN &&
                              !hasMessages &&
                              !isExistingConversation
                            ? 'What do you want to design?'
                            : selectedOption === OPTIONS.VIDEO &&
                                !hasMessages &&
                                !isExistingConversation
                              ? 'What do you want to film?'
                              : selectedOption === OPTIONS.DRAFT_DOCUMENT &&
                                  !hasMessages &&
                                  !isExistingConversation
                                ? 'What do you want to write?'
                      : activeConversation?.knowledgebaseId && isLoading
                        ? 'Loading...'
                        : activeConversation?.knowledgebaseId &&
                            activeKnowledgeBaseName
                          ? `Chat with ${activeKnowledgeBaseName}`
                          : pathname === '/workflows' ||
                              pathname?.startsWith('/workflows')
                            ? 'Describe your workflow...'
                            : 'Enter prompt here...'
              }
              style={{ backgroundColor: 'transparent' }}
              className="max-h-[160px] min-h-[36px] w-full flex-1 resize-none border-none bg-transparent py-2 pr-1 pl-0.5 text-base leading-5 text-gray-900 shadow-none outline-none placeholder:text-sm placeholder:text-zinc-400 focus-visible:ring-0 md:text-sm dark:text-white dark:placeholder:text-zinc-500"
              autoFocus
            />

            {/* Monitor Frequency Selector */}
            {selectedOption === OPTIONS.MONITOR && (
              <div className="relative w-20 flex-shrink-0 md:w-28">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="dark:bg-zinc-955 flex h-8 w-full cursor-pointer items-center justify-between gap-1.5 rounded-[3px] border border-black/5 bg-[#e1e1e1] px-2.5 text-xs font-normal text-black transition-all select-none hover:bg-[#d0d0d0] focus:outline-none dark:border-zinc-700/50 dark:hover:bg-zinc-900"
                >
                  <span>{monitorFrequency}</span>
                  <ChevronDown className="size-3.5 flex-shrink-0 text-black" />
                </button>
                {isDropdownOpen && (
                  <div className="dark:border-zinc-850 animate-in slide-in-from-top-2 absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg duration-150 dark:bg-zinc-900">
                    <div className="flex flex-col gap-0.5 p-1.5">
                      {[
                        '1 Hour',
                        '6 Hours',
                        '12 Hours',
                        '1 Day',
                        '3 Days',
                        '7 Days',
                        '14 Days',
                        '30 Days',
                      ].map(freq => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => {
                            setMonitorFrequency(freq);
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            'cursor-pointer rounded-md px-2.5 py-1.5 text-left text-xs text-zinc-700 transition-colors hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/5',
                            monitorFrequency === freq &&
                              'bg-black/5 font-medium text-black dark:bg-white/10 dark:text-white',
                          )}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

                        <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      disabled={isLoadingResponse}
                      className={cn(
                        'flex h-10 sm:h-8 w-[120px] flex-shrink-0 cursor-pointer items-center justify-between gap-1.5 rounded-[3px] bg-zinc-100/80 px-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200 focus:outline-none dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/80',
                        isLoadingResponse && 'cursor-not-allowed opacity-50',
                      )}
                      aria-label="Select Mode"
                    >
                      <div className="flex items-center gap-1.5">
                        {getModeIcon()}
                        <span className="text-left w-[64px]">{getModeName()}</span>
                      </div>
                      <ChevronDown className="size-3 opacity-50 flex-shrink-0 mr-1" />
                    </button>
                  </DropdownMenuTrigger>
              <DropdownMenuContent align="start" alignOffset={0} sideOffset={16} className="w-36 rounded-[5px] shadow-md border-zinc-300 dark:border-zinc-700/80">
                <DropdownMenuItem className={cn("cursor-pointer flex items-center justify-between", selectedOption === OPTIONS.SEARCH && "bg-zinc-100 dark:bg-zinc-800")} onSelect={() => {
                  router.push('/c/new-search');
                  setTimeout(() => textareaRef.current?.focus(), 0);
                }}>
                  <div className="flex items-center">
                    <Globe className="mr-2 h-4 w-4" />
                    <span>Search</span>
                  </div>
                  {selectedOption === OPTIONS.SEARCH && <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-500 mr-1" />}
                </DropdownMenuItem>
                
                <DropdownMenuItem className={cn("cursor-pointer flex items-center justify-between", selectedOption === OPTIONS.RESEARCH && "bg-zinc-100 dark:bg-zinc-800")} onSelect={() => {
                  if (selectedOption === OPTIONS.RESEARCH) {
                    router.push('/c/new-search'); // Toggle off
                  } else {
                    router.push('/c/new-research');
                  }
                  setTimeout(() => textareaRef.current?.focus(), 0);
                }}>
                  <div className="flex items-center">
                    <Microscope className="mr-2 h-4 w-4" />
                    <span>Research</span>
                  </div>
                  {selectedOption === OPTIONS.RESEARCH && <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-500 mr-1" />}
                </DropdownMenuItem>

                <DropdownMenuItem className={cn("cursor-pointer flex items-center justify-between", selectedOption === OPTIONS.DRAFT_DOCUMENT && "bg-zinc-100 dark:bg-zinc-800")} onSelect={() => {
                  if (selectedOption === OPTIONS.DRAFT_DOCUMENT) {
                    router.push('/c/new-search');
                  } else {
                    router.push('/c/new-writing');
                  }
                  setTimeout(() => textareaRef.current?.focus(), 0);
                }}>
                  <div className="flex items-center">
                    <PenTool className="mr-2 h-4 w-4" />
                    <span>Write</span>
                  </div>
                  {selectedOption === OPTIONS.DRAFT_DOCUMENT && <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-500 mr-1" />}
                </DropdownMenuItem>

                <DropdownMenuItem className={cn("cursor-pointer flex items-center justify-between", selectedOption === OPTIONS.CODE && "bg-zinc-100 dark:bg-zinc-800")} onSelect={() => {
                  if (selectedOption === OPTIONS.CODE) {
                    router.push('/c/new-search');
                  } else {
                    router.push('/c/new-code');
                  }
                  setTimeout(() => textareaRef.current?.focus(), 0);
                }}>
                  <div className="flex items-center">
                    <Code className="mr-2 h-4 w-4" />
                    <span>Code</span>
                  </div>
                  {selectedOption === OPTIONS.CODE && <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-500 mr-1" />}
                </DropdownMenuItem>

                <DropdownMenuItem className={cn("cursor-pointer flex items-center justify-between", selectedOption === OPTIONS.DESIGN && "bg-zinc-100 dark:bg-zinc-800")} onSelect={() => {
                  if (selectedOption === OPTIONS.DESIGN) {
                    router.push('/c/new-search');
                  } else {
                    router.push('/c/new-design');
                  }
                  setTimeout(() => textareaRef.current?.focus(), 0);
                }}>
                  <div className="flex items-center">
                    <Palette className="mr-2 h-4 w-4" />
                    <span>Design</span>
                  </div>
                  {selectedOption === OPTIONS.DESIGN && <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-500 mr-1" />}
                </DropdownMenuItem>

                <DropdownMenuItem className={cn("cursor-pointer flex items-center justify-between", selectedOption === OPTIONS.VIDEO && "bg-zinc-100 dark:bg-zinc-800")} onSelect={() => {
                  if (selectedOption === OPTIONS.VIDEO) {
                    router.push('/c/new-search');
                  } else {
                    router.push('/c/new-video');
                  }
                  setTimeout(() => textareaRef.current?.focus(), 0);
                }}>
                  <div className="flex items-center">
                    <Video className="mr-2 h-4 w-4" />
                    <span>Video</span>
                  </div>
                  {selectedOption === OPTIONS.VIDEO && <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-500 mr-1" />}
                </DropdownMenuItem>


              </DropdownMenuContent>
            </DropdownMenu>

            {/* Send Button / Mic Button - Square style */}
            <Tooltip>
              <TooltipTrigger asChild onFocus={e => e.preventDefault()}>
                {isLoadingResponse ? (
                  <button
                    type="button"
                    onClick={stopGenerating}
                    className="text-white flex size-10 sm:size-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-[3px] border border-red-500/50 bg-red-600 hover:bg-red-700 transition-all focus:outline-none active:scale-95 animate-pulse"
                    aria-label="Stop Generating"
                  >
                    <Square strokeWidth={1.5} className="size-3 fill-current" />
                  </button>
                ) : !message?.trim() ? (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={cn(
                      'flex size-10 sm:size-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-[3px] border border-[#0000ff] bg-[#0000ff] text-white transition-all hover:bg-[#0000ff]/90 focus:outline-none active:scale-95',
                      isListening &&
                        'animate-pulse !border-red-600 !bg-red-600 text-white hover:!bg-red-700',
                    )}
                    aria-label={
                      isListening ? 'Stop listening' : 'Speech to Text'
                    }
                  >
                    <Mic strokeWidth={1.5} className="size-3.5 text-white" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={
                      selectedOption === OPTIONS.TASK &&
                      !hasMessages &&
                      !isExistingConversation
                        ? handleCreateTask
                        : handleSubmit
                    }
                    className="flex size-10 sm:size-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-[3px] border border-[#0000ff] bg-[#0000ff] text-white transition-all hover:bg-[#0000ff]/90 focus:outline-none active:scale-95"
                    aria-label="Send Prompt"
                  >
                    <ArrowUp
                      strokeWidth={1.5}
                      className="size-3.5 text-white"
                    />
                  </button>
                )}
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>
                  {isLoadingResponse
                    ? `Aphura is ${
                        activeConversation?.messages?.filter(m => m.role === ROLES.ASSISTANT).pop()?.metadata?.status || 'thinking...'
                      }`
                    : !message?.trim()
                      ? isListening
                        ? 'Stop listening'
                        : 'Speech to Text'
                      : selectedOption === OPTIONS.TASK &&
                          !hasMessages &&
                          !isExistingConversation
                        ? 'Schedule Task'
                        : 'Send Prompt'}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Attached files preview: shown BELOW prompt box on new chat */}
          {isNewChat && attachmentsPreview}

          {/* Dedicated Task Configurations Row */}
          {selectedOption === OPTIONS.TASK &&
            !hasMessages &&
            !isExistingConversation && (
              <div className="animate-in fade-in mt-1 flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-2 duration-200 sm:flex-row sm:items-center dark:border-zinc-700 dark:bg-zinc-900/30">
                {/* Frequency Section */}
                <div className="flex flex-shrink-0 items-center gap-2">
                  <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase select-none dark:text-zinc-500">
                    Frequency
                  </span>
                  <div className="flex flex-shrink-0 rounded-lg border border-black/5 bg-zinc-100 p-0.5 dark:border-zinc-700/50 dark:bg-zinc-800">
                    <button
                      type="button"
                      onClick={() => setTaskType('one-time')}
                      className={cn(
                        'flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all',
                        taskType === 'one-time'
                          ? 'bg-white text-blue-600 shadow-xs dark:bg-zinc-700 dark:text-blue-400'
                          : 'hover:text-zinc-750 text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-200',
                      )}
                    >
                      <Clock className="size-3" />
                      <span>One-time</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaskType('recurring')}
                      className={cn(
                        'flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all',
                        taskType === 'recurring'
                          ? 'bg-white text-blue-600 shadow-xs dark:bg-zinc-700 dark:text-blue-400'
                          : 'hover:text-zinc-750 text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-200',
                      )}
                    >
                      <Repeat className="size-3" />
                      <span>Recurring</span>
                    </button>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="mx-1 hidden h-5 w-px bg-black/10 sm:block dark:bg-white/10" />

                {/* Trigger Section */}
                <div className="flex min-w-0 flex-grow items-center gap-2">
                  <span className="hidden text-[10px] font-semibold tracking-wider text-zinc-400 uppercase select-none sm:inline dark:text-zinc-500">
                    Trigger
                  </span>
                  <div className="flex flex-shrink-0 rounded-lg border border-black/5 bg-zinc-100 p-0.5 dark:border-zinc-700/50 dark:bg-zinc-800">
                    <button
                      type="button"
                      onClick={() => setTriggerType('scheduled')}
                      className={cn(
                        'flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all',
                        triggerType === 'scheduled'
                          ? 'bg-white text-blue-600 shadow-xs dark:bg-zinc-700 dark:text-blue-400'
                          : 'hover:text-zinc-750 text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-200',
                      )}
                    >
                      <CalendarClock className="size-3" />
                      <span>Scheduled</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTriggerType('event')}
                      className={cn(
                        'flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all',
                        triggerType === 'event'
                          ? 'bg-white text-blue-600 shadow-xs dark:bg-zinc-700 dark:text-blue-400'
                          : 'hover:text-zinc-750 text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-200',
                      )}
                    >
                      <Zap className="size-3" />
                      <span>Event</span>
                    </button>
                  </div>

                  {/* Trigger Details Input */}
                  <div className="min-w-0 flex-grow">
                    {triggerType === 'scheduled' ? (
                      <input
                        type="text"
                        value={scheduledTime}
                        onChange={e => setScheduledTime(e.target.value)}
                        placeholder={
                          taskType === 'recurring'
                            ? 'Cron expression (e.g. Every Mon 9AM)'
                            : 'Specific date/time (e.g. Tomorrow at 3PM)'
                        }
                        className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-gray-900 shadow-xs placeholder:text-[10px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
                      />
                    ) : (
                      <input
                        type="text"
                        value={eventTrigger}
                        onChange={e => setEventTrigger(e.target.value)}
                        placeholder="Event conditions details..."
                        className="dark:placeholder:text-zinc-550 w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-gray-900 shadow-xs placeholder:text-[10px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
}
