'use client';

import { PostConversation } from '@/actions/conversations';
import AudioRecorder from '@/components/AudioRecorder';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import {
  OPTIONS,
  ROLES,
  useConversationsStore,
} from '@/stores/useConverstionsStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Menu, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Textarea } from './ui/textarea';

const options = [
  { id: 1, title: 'Research', value: OPTIONS.RESEARCH },
  // { id: 2, title: 'Task', value: OPTIONS.TASK },
  { id: 3, title: 'Code', value: OPTIONS.CODE },
  { id: 4, title: 'Image', value: OPTIONS.IMAGE },
  //   { id: 6, title: 'Video', value: OPTIONS.VIDEO },
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
    userMessage:message,
    setUserMessage:setMessage,
    setShowStartLastMessage,
  } = useConversationsStore();

  // const [message, setMessage] = useState('');

  const handleSelectOption = (value: OPTIONS) => {
    setSelectedOption(selectedOption === value ? null : value);
  };

  const apiUrl =
    selectedOption === OPTIONS.IMAGE
      ? `${process.env.NEXT_PUBLIC_API_URL}/image/generate`
      : selectedOption === OPTIONS.VIDEO
        ? `${process.env.NEXT_PUBLIC_API_URL}/video/generate`
        : selectedOption === OPTIONS.CODE
          ? `${process.env.NEXT_PUBLIC_API_URL}/code/assistant`
          : selectedOption === OPTIONS.RESEARCH
            ? `${process.env.NEXT_PUBLIC_API_URL}/deep-research/assistant`
            : selectedOption === OPTIONS.TASK
              ? `${process.env.NEXT_PUBLIC_API_URL}/composio_v2/classify-and-execute`
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
      console.log('refrences--->', response.data?.responseMessage);
      console.log('reponse data--->', response.data);
      const reference = response.data?.responseMessage?.reference;

      updateActiveConversation(
        selectedOption === OPTIONS.IMAGE || selectedOption === OPTIONS.VIDEO
          ? response.data.responseMessage.text
          : selectedOption === OPTIONS.CODE
            ? response.data.responseMessage
            : selectedOption === OPTIONS.TASK
              ? response.data.responseMessage.message
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
    <div className="mx-auto w-full max-w-[796px] space-y-6 px-4 lg:px-0 bg-white">
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
        <div className="flex gap-2 py-2 sm:flex-row sm:items-end sm:justify-between">
          {/* Desktop layout */}
          <div className="hidden items-center gap-2 sm:flex">
            {/* File upload */}
            <label htmlFor="file-input-alt">
              <Plus className="size-6 cursor-pointer rounded-full border-2 border-gray-300 p-0.5" />
            </label>
            <Input type="file" className="hidden" id="file-input-alt" />

            {/* All options as buttons */}
            {options.map(option => (
              <Button
                key={option.id}
                className={cn(
                  'h-7 rounded-full border border-gray-300 bg-white px-3 text-xs font-normal text-black hover:text-white sm:text-sm',
                  { 'bg-black text-white': option.value === selectedOption },
                )}
                onClick={() => handleSelectOption(option.value)}
              >
                {option.title}
              </Button>
            ))}
          </div>

          {/* Mobile layout */}
          <div className="flex w-full items-center justify-between gap-2 sm:hidden">
            <div className="flex items-center gap-2">
              <label htmlFor="file-input-alt-mobile">
                <Plus className="size-6 cursor-pointer rounded-full border-2 border-gray-300 p-0.5" />
              </label>
              <Input
                type="file"
                className="hidden"
                id="file-input-alt-mobile"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-full px-2"
                  >
                    <Menu className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {options.map(option => (
                    <DropdownMenuItem
                      key={option.id}
                      onClick={() => handleSelectOption(option.value)}
                      className={cn(
                        'cursor-pointer',
                        option.value === selectedOption &&
                          'bg-black text-white',
                      )}
                    >
                      {option.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* Right: Mic or send button */}
          <div className="flex items-center">
            {message ? (
              <ArrowRight
                onClick={handleSubmit}
                className="size-7 flex-none cursor-pointer rounded-full border-2 border-gray-300 bg-black p-1 text-white"
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
