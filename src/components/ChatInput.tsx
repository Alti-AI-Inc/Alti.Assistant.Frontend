'use client';

import { PostConversation } from '@/actions/conversationsAction';
import AudioRecorder from '@/components/AudioRecorder';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import {
  OPTIONS,
  ROLES,
  useConversationsStore,
} from '@/stores/useConverstionsStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Code, Image as ImageIcon, Microscope } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Textarea } from './ui/textarea';

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

  const apiUrl =
    selectedOption === OPTIONS.IMAGE
      ? `${process.env.NEXT_PUBLIC_API_URL}/image/generate`
      : selectedOption === OPTIONS.CODE
        ? `${process.env.NEXT_PUBLIC_API_URL}/code/assistant`
        : selectedOption === OPTIONS.RESEARCH
          ? `${process.env.NEXT_PUBLIC_API_URL}/deep-research/assistant`
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
      );
    },
    onMutate: userMessage => {
      updateActiveConversation(userMessage, ROLES.USER);
      setLoadingResponse(true);
    },
    onSuccess: (response, userMessage) => {
      if (!response?.data?.responseMessage) return;

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
        selectedOption === OPTIONS.IMAGE
          ? response.data.responseMessage.text
          : selectedOption === OPTIONS.CODE
            ? response.data.responseMessage
            : response.data.responseMessage.answer,
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

  return (
    <div className="mx-auto w-full max-w-[796px] space-y-6 bg-white px-4 lg:px-0">
      <div className="rounded-2xl border-2 border-gray-200 px-3 shadow-sm sm:px-4">
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
          placeholder="Chat with alti"
          className="max-h-[500px] min-h-12 w-full resize-none overflow-y-auto border-none px-2 pt-3 shadow-none outline-none placeholder:text-sm focus-visible:ring-0"
        />
        {/* Responsive container */}
        <div className="flex items-end justify-between gap-2 py-2">
          {/* Desktop layout */}
          <div className="flex items-center gap-2">
            {/* All options as buttons */}
            <Tooltip>
              <TooltipTrigger>
                <Microscope
                  onClick={() => handleSelectOption(OPTIONS.RESEARCH)}
                  className={cn(
                    'size-6 flex-none cursor-pointer rounded-full border-2 border-gray-300 bg-white p-1 text-black',
                    selectedOption === OPTIONS.RESEARCH &&
                      'bg-black text-white',
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Deep Research</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <ImageIcon
                  onClick={() => handleSelectOption(OPTIONS.IMAGE)}
                  className={cn(
                    'size-6 flex-none cursor-pointer rounded-full border-2 border-gray-300 bg-white p-1 text-black',
                    selectedOption === OPTIONS.IMAGE && 'bg-black text-white',
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Image Generation</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Code
                  onClick={() => handleSelectOption(OPTIONS.CODE)}
                  className={cn(
                    'size-6 flex-none cursor-pointer rounded-full border-2 border-gray-300 bg-white p-1 text-black',
                    selectedOption === OPTIONS.CODE && 'bg-black text-white',
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Code Generation</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Right: Mic or send button */}
          <div className="flex items-center">
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
