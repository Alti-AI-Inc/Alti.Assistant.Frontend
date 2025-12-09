'use client';

import AudioRecorder from '@/components/AudioRecorder';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { PostConversation } from '@/actions/conversationsAction';
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
  BrainCircuit,
  ChartArea,
  ChartNoAxesGantt,
  Code,
  FileCheck,
  File as FileIcon,
  FileMinus,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  ImageUp,
  Languages,
  Microscope,
  Minimize,
  NotebookPen,
  PencilLine,
  Plus,
  Presentation,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
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
    label: 'Generate Image',
    Icon: ImageIcon,
  },
  {
    type: OPTIONS.EDIT_IMAGE,
    label: 'Edit Image',
    Icon: ImageUp,
  },
  {
    type: OPTIONS.CODE,
    label: 'Generate Code',
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
    type: OPTIONS.GENERATE_SPREADSHEET,
    label: 'Generate Spreadsheet',
    Icon: FileSpreadsheet,
  },
  {
    type: OPTIONS.GENERATE_CHART,
    label: 'Generate Chart',
    Icon: ChartArea,
  },
  {
    type: OPTIONS.GENERATE_MINDMAP,
    label: 'Generate Mindmap',
    Icon: BrainCircuit,
  },
  {
    type: OPTIONS.GENERATE_TIMELINE,
    label: 'Generate Timeline',
    Icon: ChartNoAxesGantt,
  },
  {
    type: OPTIONS.GENERATE_FLAYER,
    label: 'Generate Flyer',
    Icon: FileIcon,
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
    type: OPTIONS.SUMMARIZE,
    label: 'Summarize Document',
    Icon: FileCheck,
  },
  {
    type: OPTIONS.TRANSLATE_DOCUMENTS,
    label: 'Translate Document',
    Icon: Languages,
  },
  {
    type: OPTIONS.EXTRACT_DATA,
    label: 'Analyze Document',
    Icon: Minimize,
  },
];

const ChatInput = ({ conversationId }: { conversationId?: string }) => {
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

  // const [message, setMessage] = useState('');

  const handleSelectOption = (value: OPTIONS) => {
    setSelectedOption(selectedOption === value ? null : value);
  };

  const apiUrl = activeConversation?.knowledgebaseId
    ? `${process.env.NEXT_PUBLIC_API_URL}/knowledgebase/chat`
    : selectedOption === OPTIONS.IMAGE
      ? `${process.env.NEXT_PUBLIC_API_URL}/image/generate`
      : selectedOption === OPTIONS.CODE
        ? `${process.env.NEXT_PUBLIC_API_URL}/search/code`
        : selectedOption === OPTIONS.RESEARCH
          ? `${process.env.NEXT_PUBLIC_API_URL}/deep-research/assistant`
          : selectedOption === OPTIONS.TEXT
            ? `${process.env.NEXT_PUBLIC_API_URL}/search/writing`
            : `${process.env.NEXT_PUBLIC_API_URL}/search/assistant`;

  const mutation = useMutation({
    mutationFn: async (userMessage: string) => {
      if (!data?.accessToken) throw new Error('No access token');
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

  const handleSubmit = () => {
    if (message.trim() === '') return;
    setShowStartLastMessage(true);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) console.log({ file });
  };

  return (
    <div className="mx-auto w-full max-w-[796px] space-y-6 bg-white px-4 lg:px-0">
      <div
        className={cn(
          'rounded-2xl border-2 border-gray-200 px-3 shadow-sm sm:px-4',
          activeConversation?.knowledgebaseId && message.length < 100 && 'flex',
        )}
      >
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
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Upload Files</p>
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
  );
};
export default ChatInput;
