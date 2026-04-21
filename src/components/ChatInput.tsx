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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { createFileChangeHandler } from '@/utils/fileChangeHandler';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, ArrowUp, FileText, Microscope, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ALLOWED_DOC_EXTENSIONS } from './constants';
import { Textarea } from './ui/textarea';
import { WarningMessageModal } from './WarningMessageModal';

interface ChatInputProps {
  conversationId?: string;
  imageGenHook?: ReturnType<typeof useImageGeneration>;
  selectedFile?: File | undefined;
  onFileSelect?: (file: File | undefined) => void;
}

const ChatInput = ({
  conversationId,
  imageGenHook: externalImageGenHook,
  selectedFile: externalSelectedFile,
  onFileSelect,
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

  // Custom file state for docs (controlled or uncontrolled)
  const [internalSelectedFile, setInternalSelectedFile] = useState<
    File | undefined
  >(undefined);

  const selectedFile =
    externalSelectedFile !== undefined
      ? externalSelectedFile
      : internalSelectedFile;
  const setSelectedFile = (file: File | undefined) => {
    if (onFileSelect) {
      onFileSelect(file);
    } else {
      setInternalSelectedFile(file);
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

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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
      // case OPTIONS.CODE:
      //   return '/search/code';
      // case OPTIONS.RESEARCH:
      //   return '/deep-research/assistant';
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
        return '/search/assistant';
    }
  };

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${getApiEndpoint()}`;
  // console.log('apiUrl', apiUrl);
  console.log('token', data?.accessToken);
  // console.log('userid', data?.user);
  // console.log('knowledgebaseId', activeConversation?.knowledgebaseId);
  const mutation = useMutation({
    mutationFn: async ({
      message: userMessage,
      file,
    }: {
      message: string;
      file?: File;
    }) => {
      if (!data?.accessToken) {
        console.error('No access token1');
        return null;
      }
      if (file) {
        const formData = new FormData();
        formData.append('message', userMessage);
        formData.append('file', file);
        const convId =
          conversationId === 'new-chat'
            ? activeConversation?.conversationId || undefined
            : conversationId;
        if (convId) formData.append('conversationId', convId);
        return await PostConversationWithFile(formData, data.accessToken);
      }
      return await PostConversation(
        apiUrl,
        userMessage,
        data.accessToken,
        conversationId === 'new-chat'
          ? activeConversation?.conversationId || undefined
          : conversationId,
        activeConversation?.knowledgebaseId,
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
      // setShowStartLastMessage(false);
      const newId =
        conversationId === 'new-chat'
          ? response.data.conversationId
          : conversationId;

      if (conversationId === 'new-chat') {
        // updateActiveConversation(
        //   userMessage,
        //   ROLES.USER,
        //   response.data.conversationId,
        // );
        router.replace(`/c/${response.data.conversationId}`);
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
        if (activeConversation?.knowledgebaseId) {
          return response.data?.message;
        }

        switch (selectedOption) {
          case OPTIONS.IMAGE:
            return response.data?.responseMessage?.text;
          case OPTIONS.CREATIVE_WRITING:
            return response.data?.response;
          case OPTIONS.CODE:
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
        mutation.mutate({ message, file: selectedFile || undefined });
        if (selectedFile) setSelectedFile(undefined);
    }

    setMessage('');
  };
  const {
    data: knowledgeBases,
    isLoading,

    // error,
  } = useKnowledgeBases(data?.accessToken);

  const activeKnowledgeBaseName = knowledgeBases?.filter(
    kb => kb.id === activeConversation?.knowledgebaseId,
  )[0]?.name;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use extracted file change handler
  const handleFileChange = createFileChangeHandler({
    selectedOption,
    fileInputRef,
    setSelectedFile,
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

      <div className="mx-auto w-full max-w-[796px] space-y-6 lg:px-0">
        <div
          className={cn(
            'flex flex-col rounded-2xl border border-gray-200 bg-white px-3 shadow-sm sm:px-4',
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

          {/* Document Preview */}
          {selectedFile && (
            <div className="relative mt-2 flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
              <FileText className="size-8 text-gray-500" />
              <div className="flex flex-col">
                <span className="max-w-[150px] truncate text-xs font-medium">
                  {selectedFile.name}
                </span>
                <span className="text-[10px] text-gray-400">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                onClick={() => setSelectedFile(undefined)}
                className="absolute -top-2 -right-2 rounded-full bg-red-400 p-1 text-white hover:bg-red-600"
              >
                <Plus className="bold size-3 rotate-45" />
              </button>
            </div>
          )}

          {/* Input container with Plus icon inside */}
          <div className="relative flex items-center gap-2 py-2">
            {!activeConversation?.knowledgebaseId && (
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <div className="flex cursor-pointer items-center">
                    <Plus className="size-5 flex-shrink-0 rounded-full border-2 border-gray-300 p-[2px]" />
                  </div>
                </PopoverTrigger>
                <PopoverContent side="top" align="start" className="w-48 p-2">
                  <div className="flex flex-col gap-1">
                    <div
                      onClick={() => {
                        if (isFreeUser) {
                          toast.error(
                            'File upload is not available on the free plan',
                            {
                              action: {
                                label: 'Upgrade Plan',
                                onClick: () => router.push('/upgrade'),
                              },
                            },
                          );
                          setIsPopoverOpen(false);
                          return;
                        }
                        fileInputRef.current?.click();
                        setIsPopoverOpen(false);
                      }}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100"
                    >
                      <FileText className="size-4" />
                      <span className="text-sm">Add File</span>
                    </div>
                    <div
                      onClick={() => {
                        handleSelectOption(OPTIONS.RESEARCH);
                        setIsPopoverOpen(false);
                      }}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100',
                        selectedOption === OPTIONS.RESEARCH &&
                          'bg-black text-white hover:bg-black',
                      )}
                    >
                      <Microscope className="size-4" />
                      <span className="text-sm">Deep Research</span>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
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
                </PopoverContent>
              </Popover>
            )}
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
                    : selectedOption === OPTIONS.IMAGE
                      ? 'Describe the image you want to create...'
                      : selectedOption === OPTIONS.EDIT_IMAGE
                        ? 'Describe how you want to edit the image...'
                        : 'Chat with alti'
              }
              className="min-h-8 w-full flex-1 resize-none border-none px-2 py-2 shadow-none outline-none placeholder:text-sm focus-visible:ring-0"
              autoFocus
            />
            {message ? (
              <ArrowUp
                onClick={handleSubmit}
                className={cn(
                  'size-6 flex-shrink-0 rounded-full border-2 border-gray-300 bg-black p-1 text-white transition-opacity',
                  isLoadingResponse
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer',
                )}
              />
            ) : (
              <AudioRecorder setMessage={setMessage} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default ChatInput;
