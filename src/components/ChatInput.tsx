'use client';

import AudioRecorder from '@/components/AudioRecorder';
import { ImageGenConfirmation } from '@/components/ImageGenConfirmation';
import { ImageGenSuggestions } from '@/components/ImageGenSuggestions';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { PostConversation } from '@/actions/conversationsAction';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import {
  OPTIONS,
  ROLES,
  useConversationsStore,
} from '@/stores/useConverstionsStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowRight,
  AudioLines,
  Brain,
  Code,
  FileCheck,
  FileMinus,
  FileText,
  Image as ImageIcon,
  ImageUp,
  Languages,
  Mail,
  Microscope,
  Minimize,
  NotebookPen,
  PencilLine,
  PencilRuler,
  Plus,
  Presentation
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';
import { Textarea } from './ui/textarea';

const TOOLBAR_ITEMS = [
  {
    type: OPTIONS.RESEARCH,
    label: 'Deep Research',
    Icon: Microscope,
  },
  {
    type: OPTIONS.Transcribe,
    label: 'Transcribe Audio',
    Icon: AudioLines,
  },
  {
    type: OPTIONS.IMAGE,
    label: 'Create Image',
    Icon: ImageIcon,
  },
  {
    type: OPTIONS.EDIT_IMAGE,
    label: 'Edit Image',
    Icon: ImageUp,
  },
  {
    type: OPTIONS.CODE,
    label: 'Write Code',
    Icon: Code,
  },

  {
    type: OPTIONS.GENERATE_PLAN,
    label: 'Generate Plan',
    Icon: NotebookPen,
  },
  {
    type: OPTIONS.PRESENTATION,
    label: 'Generate Presentation',
    Icon: Presentation,
  },
  {
    type: OPTIONS.GENERATE_REPORT,
    label: 'Generate Report',
    Icon: FileMinus,
  },
  {
    type: OPTIONS.TEXT,
    label: 'Draft Document',
    Icon: PencilLine,
  },
  {
    type: OPTIONS.REVIEW_DOCUMENTS,
    label: 'Review Document',
    Icon: FileText,
  },
  {
    type: OPTIONS.DRAFT_EMAIL,
    label: 'Draft Email',
    Icon: Mail,
  },

  {
    type: OPTIONS.SUMMARIZE,
    label: 'Summarize',
    Icon: FileCheck,
  },
  {
    type: OPTIONS.TRANSLATE_DOCUMENTS,
    label: 'Translate',
    Icon: Languages,
  },
  {
    type: OPTIONS.EXTRACT_DATA,
    label: 'Analyze',
    Icon: Minimize,
  },
  {
    type: OPTIONS.REWRITE,
    label: 'Rewrite',
    Icon: PencilRuler,
  },
  {
    type: OPTIONS.BRAINSTORM,
    label: 'Brainstorm',
    Icon: Brain,
  },
];

interface ChatInputProps {
  conversationId?: string;
  imageGenHook?: ReturnType<typeof useImageGeneration>;
}

const ChatInput = ({
  conversationId,
  imageGenHook: externalImageGenHook,
}: ChatInputProps) => {
  const router = useRouter();
  const { data } = useSession();

  const queryClient = useQueryClient();

  const {
    updateActiveConversation,
    setLoadingResponse,
    selectedOption,
    setSelectedOption,
    activeConversation,
    userMessage: message,
    setUserMessage: setMessage,
    setShowStartLastMessage,
  } = useConversationsStore();

  // Image generation hook - pass router and queryClient for URL redirect and query invalidation
  // Image generation hook - use external if provided, otherwise create internal instance
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

  // const [message, setMessage] = useState('');

  const handleSelectOption = useCallback(
    (value: OPTIONS) => {
      // Reset image generation state when switching options
      if (
        (selectedOption === OPTIONS.IMAGE ||
          selectedOption === OPTIONS.EDIT_IMAGE) &&
        value !== OPTIONS.IMAGE &&
        value !== OPTIONS.EDIT_IMAGE
      ) {
        resetImageGen();
      }
      setSelectedOption(selectedOption === value ? null : value);
    },
    [selectedOption, setSelectedOption, resetImageGen],
  );

  const apiUrl = activeConversation?.knowledgebaseId
    ? `${process.env.NEXT_PUBLIC_API_URL}/knowledgebase/chat`
    : selectedOption === OPTIONS.IMAGE
      ? `${process.env.NEXT_PUBLIC_API_URL}/enhanced-image/analyze-intent`
      : selectedOption === OPTIONS.CODE
        ? `${process.env.NEXT_PUBLIC_API_URL}/search/code`
        : selectedOption === OPTIONS.RESEARCH
          ? `${process.env.NEXT_PUBLIC_API_URL}/deep-research/assistant`
          : selectedOption === OPTIONS.TEXT
            ? `${process.env.NEXT_PUBLIC_API_URL}/search/writing`
            : `${process.env.NEXT_PUBLIC_API_URL}/search/assistant`;

  const mutation = useMutation({
    mutationFn: async (userMessage: string) => {
      if (!data?.accessToken) throw new Error('No access token1');
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
    onMutate: userMessage => {
      updateActiveConversation(userMessage, ROLES.USER);
      setLoadingResponse(true);
    },
    onSuccess: (response, userMessage) => {
      if (!response?.data) return;
      // setShowStartLastMessage(false);
      const newId =
        conversationId === 'new-chat'
          ? response.data.conversationId
          : conversationId;

      if (conversationId === 'new-chat') {
        updateActiveConversation(
          userMessage,
          ROLES.USER,
          response.data.conversationId,
        );
        router.replace(`/c/${response.data.conversationId}`);
      }

      const images = response.data?.responseMessage?.images;
      const name = response.data?.responseMessage?.video?.name;
      const reference = response.data?.responseMessage?.reference;

      updateActiveConversation(
        activeConversation?.knowledgebaseId
          ? response.data?.message
          : selectedOption === OPTIONS.IMAGE
            ? response.data?.responseMessage?.text
            : selectedOption === OPTIONS.CODE
              ? response.data?.responseMessage?.answer
              : response.data?.responseMessage?.answer,
        ROLES.ASSISTANT,

        newId,
        {
          ...(images && { images }),
          ...(name && { videoName: name }),
          ...(reference && { reference }),
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
    console.log('ChatInput submit:', {
      selectedOption,
      conversationId,
      userId: data?.user.id,
      hasImage: !!imageBase64,
      imageWorkflow,
    });

    if (message.trim() === '') return;
    setShowStartLastMessage(true);

    // Use image generation workflow for IMAGE option
    if (
      selectedOption === OPTIONS.IMAGE ||
      selectedOption === OPTIONS.EDIT_IMAGE
    ) {
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
          activeConversation?.conversationId
        );
      }
      setMessage('');
      return;
    }

    // Use regular mutation for other options
    mutation.mutate(message);
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

  const compressImage = (
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1920,
    quality: number = 0.8,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

          console.log('[ChatInput] Image compression:', {
            originalSize: file.size,
            originalDimensions: `${img.width}x${img.height}`,
            newDimensions: `${width}x${height}`,
            originalBase64Length: (event.target?.result as string).length,
            compressedBase64Length: compressedDataUrl.length,
            compressionRatio:
              (
                (((event.target?.result as string).length -
                  compressedDataUrl.length) /
                  (event.target?.result as string).length) *
                100
              ).toFixed(2) + '%',
          });

          resolve(compressedDataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        console.error('Only image files are supported');
        return;
      }

      try {
        // Compress the image before storing
        const compressedDataUrl = await compressImage(file);
        setImageBase64(compressedDataUrl);
        setSelectedOption(OPTIONS.EDIT_IMAGE);
      } catch (error) {
        console.error('[ChatInput] Error compressing image:', error);
      }
    }
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImageBase64(null);
    if (selectedOption === OPTIONS.EDIT_IMAGE) {
      setSelectedOption(null);
    }
  };

  return (
    <>
      {/* Image Gen UI is now handled by parent in FullConversation, but kept here for fallback/other pages */}
      {!externalImageGenHook && shouldShowConfirmation && (
        <ImageGenConfirmation onConfirm={handleUserConfirmation} />
      )}

      {!externalImageGenHook && isCollectingDetails && <ImageGenSuggestions />}

      <div className="mx-auto w-full max-w-[796px] space-y-6 bg-white px-4 lg:px-0">
        <div
          className={cn(
            'flex flex-col rounded-2xl border-2 border-gray-200 px-3 shadow-sm sm:px-4',
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

          <Textarea
            name="message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={
              activeConversation?.knowledgebaseId && isLoading
                ? 'Loading...'
                : activeConversation?.knowledgebaseId && activeKnowledgeBaseName
                  ? `Chat with ${activeKnowledgeBaseName}`
                  : selectedOption === OPTIONS.IMAGE
                    ? 'Describe the image you want to create...'
                    : selectedOption === OPTIONS.EDIT_IMAGE
                      ? 'Describe how you want to edit the image...'
                      : 'Chat with alti'
            }
            className="max-h-[500px] min-h-12 w-full resize-none overflow-y-auto border-none px-2 pt-3 shadow-none outline-none placeholder:text-sm focus-visible:ring-0"
            autoFocus
          />
          {/* Responsive container */}
          <div className="flex items-end justify-between gap-2 py-2">
            {/* Desktop layout */}
            <div
              className={cn(
                'flex items-center gap-2',
                activeConversation?.knowledgebaseId && 'hidden',
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative flex cursor-pointer items-center"
                  >
                    <Plus className="size-6 rounded-full border-2 border-gray-300 p-[3px]" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Upload Image</p>
                </TooltipContent>
              </Tooltip>
              {/* options */}
              {TOOLBAR_ITEMS.map(({ type, label, Icon }) => (
                <Tooltip key={type}>
                  <TooltipTrigger>
                    <Icon
                      onClick={() => handleSelectOption(type)}
                      className={cn(
                        'size-6 flex-none cursor-pointer rounded-full border-2 border-gray-300 bg-white p-[3px] text-black',
                        selectedOption === type && 'bg-black text-white',
                      )}
                    />
                  </TooltipTrigger>

                  <TooltipContent side="bottom">
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Aspect ratio selector - shown for image options */}
            {/* {(selectedOption === OPTIONS.IMAGE ||
              selectedOption === OPTIONS.EDIT_IMAGE) && (
              <AspectRatioSelector className="mr-2" />
            )} */}

            {/* Right: Mic or send button */}
            <div className="ml-auto flex items-center">
              {message ? (
                <ArrowRight
                  onClick={handleSubmit}
                  className="size-6 flex-none cursor-pointer rounded-full border-2 border-gray-300 bg-black p-1 text-white"
                />
              ) : (
                <AudioRecorder setMessage={setMessage} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ChatInput;
