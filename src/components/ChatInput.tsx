'use client';
import AudioRecorder from '@/components/AudioRecorder';
import { ImageGenConfirmation } from '@/components/ImageGenConfirmation';
import { ImageGenSuggestions } from '@/components/ImageGenSuggestions';
import { cn } from '@/lib/utils';

import {
  PostConversation,
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
  Globe,
  Image as ImageIcon,
  Paperclip,
  Plus,
  Presentation,
  X,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
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

const ChatInput = ({
  conversationId,
  imageGenHook: externalImageGenHook,
  selectedFiles: externalSelectedFiles,
  onFilesChange,
}: ChatInputProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useSession();

  const queryClient = useQueryClient();

  const {
    updateActiveConversation,
    setLoadingResponse,
    isLoadingResponse,
    selectedOption,
    setSelectedOption,
    activeConversation,
    userMessage: message,
    setUserMessage: setMessage,
    setShowStartLastMessage,
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
    activeConversation?.conversationId &&
    activeConversation?.conversationId !== 'new-chat' &&
    pathname?.startsWith('/c/');

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
        return '/creative-writing/assistant';
      case OPTIONS.PRESENTATION:
        return '/presentation/assistant';
      case OPTIONS.WRITE_CONTRACT:
        return '/legal-contract/assistant';
      case OPTIONS.CODE:
        return '/code/assistant';
      case OPTIONS.VIDEO:
        return '/video/generate';
      case OPTIONS.RESEARCH:
        return '/deep-research/assistant';
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
            `${base}/openai/anonymous-response`,
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
        return await PostConversationWithFile(formData, data.accessToken);
      }
      const targetApiUrl = activeBot?.data 
        ? `${process.env.NEXT_PUBLIC_API_URL}/knowledgebase/chat` 
        : apiUrl;
      const targetKbId = activeBot?.data || activeConversation?.knowledgebaseId;

      return await PostConversation(
        targetApiUrl,
        userMessage,
        data.accessToken,
        conversationId === 'new-chat'
          ? activeConversation?.conversationId || undefined
          : conversationId,
        targetKbId,
        selectedOption === OPTIONS.RESEARCH ? researchSettings : undefined
      );
    },
    onMutate: ({ message: userMessage }) => {
      updateActiveConversation(userMessage, ROLES.USER);
      setLoadingResponse(true);
    },
    onSuccess: (response, { message: userMessage }) => {
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
        setLoadingResponse(false);
        return;
      }
      if (!response?.data) return;
      setShowStartLastMessage(false);
      const newId =
        conversationId === 'new-chat'
          ? response.data.conversationId
          : conversationId;

      if (conversationId === 'new-chat' && response.data.conversationId) {
        if (activeBotId && pathname.startsWith('/my-chatbots')) {
          useBotsStore.getState().addThread(activeBotId, response.data.conversationId, userMessage.slice(0, 50) || 'New Chat');
          router.replace(`/my-chatbots?bot=${activeBotId}&thread=${response.data.conversationId}`);
        } else {
          router.replace(`/c/${response.data.conversationId}`);
        }
      }

      const images = response.data?.responseMessage?.images;
      const name = response.data?.responseMessage?.video?.name;
      const reference = response.data?.responseMessage?.reference;
      // Extract document if it exists in the response
      const document =
        response.data?.document || response.data?.responseMessage?.document;

      console.log('full response', response);
      // Determine the appropriate response text based on the context
      const getResponseText = () => {
        if (activeConversation?.knowledgebaseId || activeBot?.data) {
          return response.data?.message;
        }

        switch (selectedOption) {
          case OPTIONS.IMAGE:
          case OPTIONS.VIDEO:
            return response.data?.responseMessage?.text;
          case OPTIONS.CREATIVE_WRITING:
            return response.data?.response;
          case OPTIONS.CODE:
          case OPTIONS.RESEARCH:
            return response.data?.responseMessage?.answer;
          case OPTIONS.PRESENTATION:
            return response.data?.message;
          case OPTIONS.WRITE_CONTRACT:
            return response.data?.contract;
          default:
            return response.data?.responseMessage?.answer;
        }
      };

      updateActiveConversation(
        getResponseText(),
        ROLES.ASSISTANT,

        newId,
        {
          ...(images && { images }),
          ...(name && { videoName: name }),
          ...(reference && { reference }),
          ...(document && { document }),
        },
      );

      if (response?.data) {
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
      }
      setLoadingResponse(false);
    },
    onError: error => {
      console.error('Message post failed:', error);
      setLoadingResponse(false);
    },
    onSettled: () => {
      // setMessage('');
      setLoadingResponse(false);
    },
  });

  const handleSubmit = async () => {
    // Prevent submission if response is loading or message is empty
    if (isLoadingResponse) return;

    console.log('ChatInput submit:', {
      selectedOption,
      conversationId,
      userId: data?.user.id,
      hasImage: !!imageBase64,
      imageWorkflow,
    });

    if (!message?.trim()) return;
    setShowStartLastMessage(true);

    const handleImageWorkflow = async () => {
      console.log('[ChatInput] Image workflow - current state:', imageWorkflow);

      if (isCollectingDetails) {
        // We're in detail collection phase - add detail
        console.log('[ChatInput] Adding detail to image prompt');
        await handleAddDetail(message);
      } else {
        // Start new image generation flow
        console.log('[ChatInput] Starting image generation flow', {
          hasImage: !!imageBase64,
        });
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
        condition:
          selectedOption === OPTIONS.REVIEW_DOCUMENTS &&
          !selectedFile &&
          !isExistingConversation,
        title: 'Add File',
        description: 'Please upload a file to continue with document review.',
      },
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

      <div className="mx-auto w-full max-w-[796px] space-y-6 px-0">
        <div
          className={cn(
            'flex flex-col rounded-2xl border border-gray-300 bg-white px-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 sm:px-4',
            activeConversation?.knowledgebaseId &&
              message.length < 100 &&
              'flex',
          )}
        >
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

          {/* Input container with Plus icon inside */}
          <div className="relative flex items-center gap-2 py-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer items-center focus:outline-none"
                  aria-label="Attach Files"
                >
                  <Paperclip className="size-7 flex-shrink-0 rounded-lg border-2 border-gray-300 bg-black p-1.5 text-white transition-colors hover:bg-gray-800" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Attach Files</p>
              </TooltipContent>
            </Tooltip>


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
            {message && !isAudioRecording ? (
              <ArrowUp
                onClick={handleSubmit}
                className={cn(
                  'size-7 flex-shrink-0 rounded-lg border-2 border-gray-300 bg-black p-1 text-white transition-opacity',
                  isLoadingResponse
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer',
                )}
              />
            ) : (
              <AudioRecorder setMessage={setMessage} setIsRecording={setIsAudioRecording} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default ChatInput;
