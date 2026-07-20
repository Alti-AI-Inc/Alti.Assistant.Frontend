'use client';
import { ImageGenConfirmation } from '@/components/ImageGenConfirmation';
import { ImageGenSuggestions } from '@/components/ImageGenSuggestions';
import { cn } from '@/lib/utils';

import {
  PostConversation,
  PostConversationStream,
  PostConversationWithFile,
} from '@/actions/conversationsAction';
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
} from '@/stores/useConverstionsStore';
import { useBotsStore } from '@/stores/useBotsStore';
import { useModalStore } from '@/stores/useModalStore';
import { createFileChangeHandler } from '@/utils/fileChangeHandler';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowUp,
  File,
  FileSpreadsheet,
  FileText,
  FileType,
  Code,
  MessageSquare,
  Microscope,
  PenLine,
  Image as ImageIcon,
  Paperclip,
  Plus,
  Presentation,
  X,
  Check,
  Headphones,
  ListTodo,
  Clock,
  Repeat,
  CalendarClock,
  Zap,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ALLOWED_DOC_EXTENSIONS } from './constants';
import { Textarea } from './ui/textarea';
import { WarningMessageModal } from './WarningMessageModal';
import PreFlightPanel, { PreFlightSettings } from './research/PreFlightPanel';

interface ChatInputProps {
  conversationId?: string;
  imageGenHook?: ReturnType<typeof useImageGeneration>;
  selectedFiles?: File[];
  onFilesChange?: (files: File[]) => void;
  isStudio?: boolean;
  isConversationLoading?: boolean;
}

// Helper function to get file icon based on extension
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return <FileText className="size-5 text-red-500" />;
    case 'doc':
    case 'docx':
      return <FileType className="size-5 text-blue-500" />;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <FileSpreadsheet className="size-5 text-green-600" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return <ImageIcon className="size-5 text-purple-500" />;
    case 'ppt':
    case 'pptx':
      return <Presentation className="size-5 text-orange-500" />;
    default:
      return <File className="size-5 text-gray-500" />;
  }
};

// Helper function to get file extension
const getFileExtension = (fileName: string) => {
  return fileName.split('.').pop()?.toUpperCase() || 'FILE';
};

const ANONYMOUS_PROMPT_LIMIT = 10;
const ANONYMOUS_PROMPT_COUNT_KEY = 'anonymous-prompt-count';

const extractAssistantText = (payload: any): string => {
  const target = payload?.data || payload;

  if (typeof target === 'string') return target;
  if (!target || typeof target !== 'object') return '';

  // Handle common API response shapes first.
  if (typeof target.reply === 'string') return target.reply;
  if (typeof target.answer === 'string') return target.answer;
  if (typeof target.response === 'string') return target.response;
  if (typeof target.message === 'string') return target.message;
  if (typeof target.text === 'string') return target.text;
  if (typeof target.content === 'string') return target.content;

  if (typeof target.data?.reply === 'string') return target.data.reply;
  if (typeof target.data?.answer === 'string') return target.data.answer;
  if (typeof target.data?.response === 'string') return target.data.response;
  if (typeof target.data?.message === 'string') return target.data.message;
  if (typeof target.data?.text === 'string') return target.data.text;
  if (typeof target.data?.content === 'string') return target.data.content;

  return JSON.stringify(target);
};

export default function ChatInput({
  conversationId,
  imageGenHook: externalImageGenHook,
  selectedFiles: externalSelectedFiles,
  onFilesChange,
  isStudio,
  isConversationLoading,
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
  const activeBot = bots.find((b) => b.id === activeBotId);

  // Custom files state for docs (controlled or uncontrolled)
  const [internalSelectedFiles, setInternalSelectedFiles] = useState<File[]>([]);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [researchSettings, setResearchSettings] = useState<PreFlightSettings>({
    depth: 'thorough',
    consensusLevel: 'majority',
    boardPersonas: ['McKinsey Strategy Partner', 'Gartner Research Director', 'YC Technical Architect']
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

  // Tasks form states
  const [taskType, setTaskType] = useState<'one-time' | 'recurring'>('one-time');
  const [triggerType, setTriggerType] = useState<'scheduled' | 'event'>('scheduled');
  const [scheduledTime, setScheduledTime] = useState('');
  const [eventTrigger, setEventTrigger] = useState('');

  const handleCreateTask = () => {
    if (!message.trim()) return;
    const taskName = message.trim();
    const runId = Math.random().toString(36).substring(7);
    const newRun = {
      id: runId,
      taskName,
      timestamp: new Date().toISOString(),
      status: 'running' as const,
      summary: `Initiating workflow: "${taskName}" using triggers: [Type: ${taskType}, Trigger: ${triggerType === 'scheduled' ? scheduledTime : eventTrigger}]`,
      botId: activeBotId || undefined
    };

    const existing = localStorage.getItem('alti_task_runs');
    const runsList = existing ? JSON.parse(existing) : [];
    runsList.unshift(newRun);
    localStorage.setItem('alti_task_runs', JSON.stringify(runsList));

    toast.success('Task scheduled successfully', {
      description: 'You can monitor execution logs in the sidebar Inbox tab.'
    });

    setMessage('');
    setScheduledTime('');
    setEventTrigger('');

    // Simulate completion
    setTimeout(() => {
      const currentRuns = JSON.parse(localStorage.getItem('alti_task_runs') || '[]');
      const targetRun = currentRuns.find((r: any) => r.id === runId);
      if (targetRun) {
        targetRun.status = 'success';
        targetRun.duration = 2450;
        targetRun.summary = `Successfully executed task automation pipeline. Verified triggers, loaded task inputs, and completed task: "${taskName}".`;
        localStorage.setItem('alti_task_runs', JSON.stringify(currentRuns));
      }
    }, 3000);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      
      if (selectedOption === OPTIONS.IMAGE || selectedOption === OPTIONS.EDIT_IMAGE) {
        const imageFiles = filesArray.filter(file => file.type.startsWith('image/'));
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
            toast.error('Only image or supported document files are allowed.');
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
          toast.error('Supported document types: PDF, DOCX, XLSX, CSV, PPTX.');
        }
      }
    }
  }, [selectedOption, selectedFiles, setSelectedFiles, setImageBase64, setSelectedOption]);


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

  const isExistingConversation =
    (activeConversation?.conversationId &&
      activeConversation?.conversationId !== 'new-chat' &&
      pathname?.startsWith('/c/')) ||
    (conversationId && conversationId !== 'new-chat');

  useEffect(() => {
    if (!isExistingConversation) {
      setSelectedOption(null);
    }
  }, [isExistingConversation, setSelectedOption]);

  const { onOpen } = useModalStore();

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // const [message, setMessage] = useState('');

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
      case OPTIONS.RESEARCH:
        return '/deep-research/execute';
      // case OPTIONS.GENERATE_PLAN:
      //   return '/search/plan';
      // case OPTIONS.GENERATE_REPORT:
      //   return '/search/report';
      // case OPTIONS.DRAFT_EMAIL:
      //   return '/search/email';
      // case OPTIONS.SUMMARIZE:
      //   return '/search/summarize';
      // case OPTIONS.EXTRACT_DATA:
      //   return '/search/extract';
      // case OPTIONS.Transcribe:
      //   return '/search/transcribe';
      case OPTIONS.DRAFT_DOCUMENT:
        return '/documents/assistant';
      case OPTIONS.IMAGE:
        return '/image/execute';
      default:
        return '/orchestrator/route-prompt'; // Master Intelligence Router
    }
  };

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${getApiEndpoint()}`;
  // console.log('apiUrl', apiUrl);
  // console.log('token', data?.accessToken);
  // console.log('userid', data?.user);
  // console.log('knowledgebaseId', activeConversation?.knowledgebaseId);
  const mutation = useMutation({
    mutationFn: async ({
      message: userMessage,
      file,
      files,
    }: {
      message: string;
      file?: File;
      files?: File[];
    }) => {
      const isHomePage = pathname === '/';
      const accessToken = data?.accessToken;

      if (!accessToken) {
        if (!isHomePage) {
          console.error('No access token');
          router.push('/login');
          return null;
        }

        const currentPromptCount = Number(
          localStorage.getItem(ANONYMOUS_PROMPT_COUNT_KEY) || '0',
        );

        if (currentPromptCount >= ANONYMOUS_PROMPT_LIMIT) {
          router.push('/register');
          return {
            success: false,
            message:
              'You have reached the 10 prompt limit. Please register to continue chatting.',
          };
        }

        try {
          const base = process.env.NEXT_PUBLIC_API_URL || 'https://altihq.com/api/v1';
          const res = await fetch(
            `${base}/vertex/anonymous-response`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ prompt: userMessage }),
            },
          );
          const resData = await res.json();
          const answerText = extractAssistantText(resData);

          localStorage.setItem(
            ANONYMOUS_PROMPT_COUNT_KEY,
            String(currentPromptCount + 1),
          );

          return {
            success: true,
            message: 'Success',
            data: {
              conversationId:
                conversationId === 'new-chat' ? undefined : conversationId,
              responseMessage: { answer: answerText },
            },
          };
        } catch (err: any) {
          console.error('Anonymous chat API failed', err);
          return {
            success: false,
            message: 'Anonymous chat API failed: ' + err.message,
          };
        }
      }

      const getCategoryFromOption = (opt: OPTIONS | null): string | undefined => {
        if (!opt) return 'search';
        switch (opt) {
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
        const convId =
          conversationId === 'new-chat'
            ? activeConversation?.conversationId || undefined
            : conversationId;
        if (convId) formData.append('conversationId', convId);
        
        const categoryVal = appParam ? 'mcp' : getCategoryFromOption(selectedOption);
        if (categoryVal) formData.append('category', categoryVal);
        if (appParam) {
          formData.append('metadata', JSON.stringify({
            customData: { mcpServerId: appParam.toLowerCase() }
          }));
        }

        return await PostConversationWithFile(formData, data.accessToken);
      }
      const isKbId = activeBot?.data && /^[0-9a-fA-F]{24}$/.test(activeBot.data);
      const targetApiUrl = isKbId || activeConversation?.knowledgebaseId
        ? `${process.env.NEXT_PUBLIC_API_URL}/knowledgebase/chat` 
        : apiUrl;
      const targetKbId = (isKbId ? activeBot.data : activeConversation?.knowledgebaseId) || undefined;

      const extraParams: Record<string, any> = {};
      if (selectedOption === OPTIONS.RESEARCH) {
        Object.assign(extraParams, researchSettings);
        extraParams.researchTier = researchTier;
      }
      const categoryVal = appParam ? 'mcp' : getCategoryFromOption(selectedOption);
      if (categoryVal) {
        extraParams.category = categoryVal;
      }
      if (appParam) {
        extraParams.metadata = {
          customData: {
            mcpServerId: appParam.toLowerCase()
          }
        };
      }

      const isOrchestrator = targetApiUrl.endsWith('/orchestrator/route-prompt');

      if (isOrchestrator) {
        let resolvedConversationId = conversationId;
        // Seed initial empty assistant response placeholder in store so we can stream into it
        useConversationsStore.getState().streamActiveConversation('', resolvedConversationId === 'new-chat' ? undefined : resolvedConversationId);

        const result = await PostConversationStream(
          targetApiUrl,
          userMessage,
          data.accessToken,
          conversationId === 'new-chat'
            ? activeConversation?.conversationId || undefined
            : conversationId,
          targetKbId,
          extraParams,
          (chunk) => {
            if (chunk.type === 'connected' && chunk.conversationId) {
              resolvedConversationId = chunk.conversationId;
            } else if (chunk.type === 'text' && chunk.content) {
              setLoadingResponse(false);
              useConversationsStore.getState().streamActiveConversation(chunk.content, resolvedConversationId);
            } else if (chunk.type === 'metadata') {
              useConversationsStore.getState().streamActiveConversation('', resolvedConversationId, {
                reference: chunk.reference,
                citations: chunk.citations
              });
            }
          }
        );

        if (!result.success) {
          return result;
        }

        const messages = useConversationsStore.getState().activeConversation?.messages || [];
        const lastMessage = messages[messages.length - 1];

        return {
          success: true,
          message: 'Success',
          isStreamed: true,
          data: {
            conversationId: resolvedConversationId,
            responseMessage: {
              answer: lastMessage?.content || '',
              reference: lastMessage?.metadata?.reference || [],
            }
          }
        };
      }

      return await PostConversation(
        targetApiUrl,
        userMessage,
        data.accessToken,
        conversationId === 'new-chat'
          ? activeConversation?.conversationId || undefined
          : conversationId,
        targetKbId,
        extraParams
      );
    },
    onMutate: ({ message: userMessage }) => {
      updateActiveConversation(userMessage, ROLES.USER);
      setLoadingResponse(true);
    },
    onSuccess: (response: any, { message: userMessage }) => {
      if (!response || !response.success) {
        console.error(
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
        updateActiveConversation(
          response?.message || 'An unexpected error occurred.',
          ROLES.ASSISTANT,
        );
        setShowStartLastMessage(false);
        setLoadingResponse(false);
        return;
      }
      if (!response?.data) {
        setShowStartLastMessage(false);
        setLoadingResponse(false);
        return;
      }
      setShowStartLastMessage(false);
      const newId =
        conversationId === 'new-chat'
          ? response.data.conversationId
          : conversationId;

      if (conversationId === 'new-chat' && response.data.conversationId) {
        if (activeBotId && pathname.startsWith('/spaces')) {
          useBotsStore.getState().addThread(activeBotId, response.data.conversationId, userMessage.slice(0, 50) || 'New Chat');
          router.replace(`/spaces?bot=${activeBotId}&thread=${response.data.conversationId}`);
        } else {
          router.replace(`/c/${response.data.conversationId}`);
        }
      }

      // Extract media and attachments based on the new agent JSON schemas or legacy schema
      let imageUrl = response.data?.responseMessage?.images?.[0] || response.data?.responseMessage?.imageUrl;
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
      
      let reference = response.data?.responseMessage?.reference || response.data?.reference || response.data?.citations;
      if (response.data?.sources) {
        reference = response.data.sources;
      }
      
      const document =
        response.data?.document || response.data?.responseMessage?.document;

      // Determine the appropriate response text based on the context
      const getResponseText = () => {
        const isKbId = activeBot?.data && /^[0-9a-fA-F]{24}$/.test(activeBot.data);
        if (activeConversation?.knowledgebaseId || isKbId) {
          return response.data?.message;
        }

        // If gathering details from LangGraph agent, return the reply
        if (response.data?.status === 'gathering_details') {
          return response.data?.reply;
        }

        switch (selectedOption) {
          case OPTIONS.IMAGE:
          case OPTIONS.AUDIO:
          case OPTIONS.VIDEO:
            return response.data?.content || response.data?.prompt || response.data?.responseMessage?.text;
          case OPTIONS.CREATIVE_WRITING:
            return response.data?.content || response.data?.response;
          case OPTIONS.CODE:
            if (response.data?.code) {
              const { code, language, explanation } = response.data;
              return `${explanation || 'Here is the code:'}\n\n\`\`\`${language || 'javascript'}\n${code}\n\`\`\``;
            }
            if (response.data?.fixedCode) {
              const { fixedCode, explanation } = response.data;
              return `${explanation || 'Here is the fixed code:'}\n\n\`\`\`javascript\n${fixedCode}\n\`\`\``;
            }
            return response.data?.responseMessage?.answer;
          case OPTIONS.RESEARCH:
            return response.data?.synthesis || response.data?.content || response.data?.responseMessage?.answer;
          case OPTIONS.PRESENTATION:
            return response.data?.message;
          case OPTIONS.WRITE_CONTRACT:
            return response.data?.contract;
          default:
            return response.data?.content || response.data?.responseMessage?.answer;
        }
      };

      if (!response.isStreamed) {
        updateActiveConversation(
          getResponseText(),
          ROLES.ASSISTANT,
          newId,
          {
            ...(imageUrl && { imageUrl }),
            ...(name && { video: { name } }),
            ...(reference && { reference }),
            ...(document && { document }),
            ...(audioUrl && { audioUrl }),
          },
        );
      }

      if (response?.data) {
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ['conversations', data?.accessToken],
          });
          const targetId =
            conversationId === 'new-chat'
              ? response.data.conversationId
              : conversationId;
          if (targetId) {
            queryClient.invalidateQueries({
              queryKey: ['activeConversation', targetId, data?.accessToken],
            });
          }
        }, 1000);
      }
      setLoadingResponse(false);
    },
    onError: error => {
      console.error('Message post failed:', error);
      setShowStartLastMessage(false);
      setLoadingResponse(false);
    },
    onSettled: () => {
      setShowStartLastMessage(false);
      setLoadingResponse(false);
    },
  });

  const handleSubmit = async () => {
    // Prevent submission if response is loading or message is empty
    if (isLoadingResponse) return;

    if (!message?.trim()) return;
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
          // console.log('hasContent', rewriteConfig.textContent);

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
        mutation.mutate({
          message,
          file: selectedFile || undefined,
          files: selectedFiles,
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
          (activeConversation?.conversationId === 'new-chat' ||
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

  const hasMessages = activeConversation?.messages && activeConversation.messages.length > 0;

  return (
    <>
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

      <div className="mx-auto w-full max-w-[796px] space-y-6 px-0 relative z-20">
        {!isExistingConversation && !hasMessages && !showStartLastMessage && !isLoadingResponse && !isConversationLoading && (
          <div className="flex flex-col items-center gap-6 w-full mb-6">
              {/* Child Toggle */}
              <div 
                className="w-auto bg-white dark:bg-zinc-900/80 backdrop-blur-md p-1.5 rounded-[1.5rem] shadow-sm border border-gray-200/50 dark:border-zinc-800/50 gap-2 overflow-x-auto transition-opacity duration-300 flex"
              >
                {[
                  { id: 'search', name: 'Chat', icon: MessageSquare, value: null },
                  { id: 'research', name: 'Research', icon: Microscope, value: OPTIONS.RESEARCH },
                  { id: 'write', name: 'Write', icon: PenLine, value: OPTIONS.DRAFT_DOCUMENT },
                  { id: 'review', name: 'Review', icon: FileText, value: OPTIONS.REVIEW_DOCUMENTS }
                ].map((tab) => {
                  const isSelected = selectedOption === tab.value;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedOption(tab.value)}
                      className={cn(
                        'flex items-center gap-2 px-5 py-2 rounded-2xl transition-all duration-200 ease-out font-medium text-sm whitespace-nowrap',
                        isSelected 
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                          : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                      )}
                    >
                      <tab.icon className={cn("size-4", isSelected ? "text-blue-500" : "")} />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>
          </div>
        )}



        {selectedOption === OPTIONS.TASK ? (
          <div className="relative flex flex-col rounded-2xl border bg-white shadow-sm border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 transition-all duration-300">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the task you want to automate..."
              style={{ backgroundColor: 'transparent' }}
              className="min-h-[72px] w-full flex-1 resize-none border-none bg-transparent px-4 py-4 shadow-none outline-none placeholder:text-sm focus-visible:ring-0 text-gray-900 dark:text-white"
            />

            <div className="px-4 pb-4 pt-1 border-t border-black/5 dark:border-white/5">
              <div className="flex flex-col gap-3">
                
                {/* Controls Toggle Row */}
                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Task Type Switcher */}
                  <div className="flex bg-gray-100 dark:bg-zinc-955 p-0.5 rounded-xl border border-black/5 dark:border-zinc-800/80">
                    <button
                      type="button"
                      onClick={() => setTaskType('one-time')}
                      className={cn(
                        'px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1.5',
                        taskType === 'one-time'
                          ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      )}
                    >
                      <Clock className="size-3" />
                      One-time
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaskType('recurring')}
                      className={cn(
                        'px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1.5',
                        taskType === 'recurring'
                          ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      )}
                    >
                      <Repeat className="size-3" />
                      Recurring
                    </button>
                  </div>

                  {/* Trigger Type Switcher */}
                  <div className="flex bg-gray-100 dark:bg-zinc-955 p-0.5 rounded-xl border border-black/5 dark:border-zinc-800/80">
                    <button
                      type="button"
                      onClick={() => setTriggerType('scheduled')}
                      className={cn(
                        'px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1.5',
                        triggerType === 'scheduled'
                          ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      )}
                    >
                      <CalendarClock className="size-3" />
                      Scheduled
                    </button>
                    <button
                      type="button"
                      onClick={() => setTriggerType('event')}
                      className={cn(
                        'px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1.5',
                        triggerType === 'event'
                          ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      )}
                    >
                      <Zap className="size-3" />
                      Event
                    </button>
                  </div>

                </div>

                {/* Input Row */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    {triggerType === 'scheduled' ? (
                      <input
                        type="text"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        placeholder={taskType === 'recurring' ? 'Cron expression (e.g. Every Monday at 9AM)' : 'Execution time (e.g. Tomorrow 3PM)'}
                        className="w-full bg-gray-50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    ) : (
                      <input
                        type="text"
                        value={eventTrigger}
                        onChange={(e) => setEventTrigger(e.target.value)}
                        placeholder="Trigger event (e.g. When a new email arrives from @client.com)"
                        className="w-full bg-gray-50 dark:bg-zinc-955/50 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleCreateTask}
                    disabled={!message.trim()}
                    className="bg-[#0c1120] hover:bg-[#0c1120]/90 disabled:bg-[#0c1120] disabled:opacity-100 text-white rounded-xl h-[36px] w-[36px] p-0 flex items-center justify-center transition-transform active:scale-95 disabled:active:scale-100"
                  >
                    <ArrowUp className="size-4 text-white" />
                  </button>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <>
            {appParam && (
              <div className="mb-3 px-4 py-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/50 flex items-center justify-between shadow-xs animate-in fade-in duration-300">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600 dark:bg-indigo-400"></span>
                  </span>
                  <p className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">
                    Isolated Chat Space: <span className="font-extrabold uppercase text-indigo-600 dark:text-indigo-400">{appParam}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const params = new URLSearchParams(window.location.search);
                    params.delete('app');
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                  className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors uppercase tracking-wider"
                >
                  Exit Space
                </button>
              </div>
            )}
            <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'relative flex flex-col rounded-2xl border bg-white px-3 shadow-sm sm:px-4 transition-all duration-300',
              isDragging 
                ? 'border-indigo-500 border-dashed bg-indigo-50/30 dark:bg-indigo-950/20 scale-[1.01]' 
                : 'border-gray-300 dark:border-zinc-700 dark:bg-zinc-800',
              activeConversation?.knowledgebaseId &&
                message.length < 100 &&
                'flex',
            )}
          >
            {isDragging && (
              <div className="absolute inset-0 flex items-center justify-center bg-indigo-500/10 backdrop-blur-xs rounded-2xl pointer-events-none z-50 animate-in fade-in duration-200">
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Paperclip className="size-3.5 animate-bounce" />
                  Drop files to upload
                </span>
              </div>
            )}
            {/* Mode Badge Preview */}
            {selectedOption && (selectedOption === OPTIONS.CODE || selectedOption === OPTIONS.IMAGE) && (
              <div className="mt-3 flex items-center justify-between rounded-lg bg-zinc-50 dark:bg-zinc-850/60 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800/80 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  {selectedOption === OPTIONS.CODE ? (
                    <Code className="size-4 text-black dark:text-white" />
                  ) : (
                    <ImageIcon className="size-4 text-black dark:text-white" />
                  )}
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {selectedOption === OPTIONS.CODE ? 'Code Generation Mode' : 'Image Generation Mode'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOption(null)}
                  className="rounded-full hover:bg-black/5 dark:hover:bg-white/5 p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                  title="Exit mode"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}
            {/* Image Preview */}
            {imageBase64 && (
              <div className="relative mt-2 w-fit">
                <img
                  src={imageBase64}
                  alt="Uploaded preview"
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 rounded-full bg-red-400 p-1 text-white hover:bg-red-600"
                >
                  <Plus className="bold size-3 rotate-45" />
                </button>
              </div>
            )}

            {/* Hidden file input - must be outside Popover to persist */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={(() => {
                switch (selectedOption) {
                  case OPTIONS.IMAGE:
                  case OPTIONS.EDIT_IMAGE:
                    return 'image/*';
                  default:
                    return ALLOWED_DOC_EXTENSIONS.join(',');
                }
              })()}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* File Cards Preview - Shows above input field next to each other */}
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div 
                    key={index}
                    className="inline-flex max-w-[140px] items-center gap-2 rounded-lg border border-black/10 px-2.5 py-1.5 shadow-xs animate-in fade-in duration-200"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    {/* File Type Icon */}
                    <FileText className="size-4 flex-shrink-0 text-gray-500" />

                    {/* File Info */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-xs font-semibold text-gray-700" title={file.name}>
                        {file.name}
                      </span>
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = selectedFiles.filter((_, i) => i !== index);
                        setSelectedFiles(updated);
                      }}
                      className="flex-shrink-0 rounded-md p-0.5 text-gray-400 transition-colors hover:bg-black/5 hover:text-gray-600"
                      title="Remove file"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input container with active icon inside */}
            <div className="relative flex items-center gap-2 py-2">
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild onFocus={(e) => e.preventDefault()}>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex size-7 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-[#0000ff] bg-[#0000ff] p-1 text-white transition-opacity hover:opacity-80 focus:outline-none"
                        aria-label="More Options"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>More Options</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent className="w-52 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl shadow-xl p-1" align="start" side="bottom" sideOffset={8}>
                  <DropdownMenuLabel className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Actions
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                  >
                    <Paperclip className="size-4 text-zinc-500" />
                    <span>Attach Files</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setSelectedOption(OPTIONS.CODE)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                  >
                    <Code className="size-4 text-black dark:text-white" />
                    <span>Code Generation</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedOption(OPTIONS.IMAGE)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                  >
                    <ImageIcon className="size-4 text-black dark:text-white" />
                    <span>Image Generation</span>
                  </DropdownMenuItem>

                  {isExistingConversation && (
                    <>
                      <DropdownMenuSeparator className="bg-black/5 dark:bg-white/5" />
                      <DropdownMenuLabel className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        Select Mode
                      </DropdownMenuLabel>
                      {[
                        { name: 'Chat Mode', icon: MessageSquare, value: null },
                        { name: 'Research Mode', icon: Microscope, value: OPTIONS.RESEARCH },
                        { name: 'Write Mode', icon: PenLine, value: OPTIONS.DRAFT_DOCUMENT },
                        { name: 'Review Mode', icon: FileText, value: OPTIONS.REVIEW_DOCUMENTS }
                      ].map((tab) => {
                        const isSelected = selectedOption === tab.value;
                        return (
                          <DropdownMenuItem
                            key={tab.name}
                            onClick={() => setSelectedOption(tab.value)}
                            className={cn(
                              "flex items-center justify-between px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors",
                              isSelected && "bg-zinc-50 dark:bg-zinc-800/50 font-medium text-zinc-900 dark:text-zinc-100"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <tab.icon className={cn("size-4", isSelected ? "text-blue-500" : "text-zinc-500")} />
                              <span>{tab.name}</span>
                            </div>
                            {isSelected && <Check className="size-4 text-blue-500" />}
                          </DropdownMenuItem>
                        );
                      })}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Textarea
                name="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder={
                  activeConversation?.knowledgebaseId && isLoading
                    ? 'Loading...'
                    : activeConversation?.knowledgebaseId &&
                        activeKnowledgeBaseName
                      ? `Chat with ${activeKnowledgeBaseName}`
                      : (pathname === '/workflows' || pathname?.startsWith('/workflows')
                        ? 'Describe your workflow...'
                        : 'Enter prompt here...')
                }
                style={{ backgroundColor: 'transparent' }}
                className="min-h-8 w-full flex-1 resize-none border-none bg-transparent px-2 py-2 shadow-none outline-none placeholder:text-sm focus-visible:ring-0"
                autoFocus
              />
              <Tooltip>
                <TooltipTrigger asChild onFocus={(e) => e.preventDefault()}>
                  <ArrowUp
                    onClick={handleSubmit}
                    className={cn(
                      'size-7 flex-shrink-0 rounded-lg border-2 border-gray-300 bg-[#0c1120] p-1 text-white transition-opacity focus:outline-none',
                      (isLoadingResponse || !message?.trim())
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer hover:opacity-80',
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Send Prompt</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </>
      )}
      </div>
    </>
  );
}
