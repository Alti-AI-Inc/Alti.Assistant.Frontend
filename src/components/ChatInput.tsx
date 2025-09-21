'use client';

import { PostConversation } from '@/actions/conversations';
import AudioRecorder from '@/components/AudioRecorder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  OPTIONS,
  ROLES,
  useConversationsStore,
} from '@/stores/useConverstionsStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const options = [
  {
    id: 1,
    title: 'Research',
    value: OPTIONS.RESEARCH,
  },
  {
    id: 2,
    title: 'Task',
    value: OPTIONS.TASK,
  },
  {
    id: 3,
    title: 'Code',
    value: OPTIONS.CODE,
  },
  {
    id: 4,
    title: 'Image',
    value: OPTIONS.IMAGE,
  },
  {
    id: 6,
    title: 'Video',
    value: OPTIONS.VIDEO,
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
  } = useConversationsStore();

  const [message, setMessage] = useState('');
  // const [selectedOption, setSelectedOption] = useState<OPTIONS | null>(null);

  const handleSelectOption = (value: OPTIONS) => {
    if (selectedOption === value) {
      setSelectedOption(null);
    } else {
      setSelectedOption(value);
    }
  };

  // research-agent
  //video-assistant
  //image-assistant

  const apiUrl =
    selectedOption === OPTIONS.IMAGE
      ? `${process.env.NEXT_PUBLIC_API_URL}/image/generate`
      : selectedOption === OPTIONS.VIDEO
        ? `${process.env.NEXT_PUBLIC_API_URL}/video/generate`
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

      // if new conversation, update state with id
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
      // add assistant's response
      updateActiveConversation(
        selectedOption === OPTIONS.IMAGE || selectedOption === OPTIONS.VIDEO
          ? response.data.responseMessage.text
          : response.data.responseMessage.answer,
        ROLES.ASSISTANT,
        newId,
        {
          ...(images && { images }),
          ...(name && { videoName: name }),
        },
      );

      if (response?.data) {
        // refresh sidebar conversations
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
      setMessage('');
      setLoadingResponse(false);
    },
  });

  const handleSubmit = () => {
    if (message.trim() === '') return;
    mutation.mutate(message);
    setMessage('');
  };

  return (
  <div className="mx-auto w-full max-w-[780px] bg-white px-2 sm:px-4">
    <div className="rounded-2xl border-2 border-gray-200 px-3 sm:px-4 shadow-sm">
      <Input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            handleSubmit();
          }
        }}
        placeholder="Chat with alti"
        className="min-h-12 w-full border-none px-2 py-2 shadow-none outline-none placeholder:text-sm focus-visible:ring-0"
      />

      {/* Responsive container */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between py-2 gap-2">
        {/* Options Section */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex justify-center">
            <label htmlFor="file-input-alt" className="">
              <Plus className="size-6 cursor-pointer rounded-full border-2 border-gray-300 p-0.5" />
            </label>
            <Input
              type="file"
              className="hidden"
              id="file-input-alt"
            />
          </div>

          {options.map(option => (
            <Button
              key={option.id}
              className={cn(
                'h-7 rounded-full border border-gray-300 bg-white px-3 text-xs sm:text-sm font-normal text-black hover:text-white',
                {
                  'bg-black text-white': option.value === selectedOption,
                },
              )}
              onClick={() => handleSelectOption(option.value)}
            >
              {option.title}
            </Button>
          ))}
        </div>

        {/* Action Section */}
        <div className="flex w-full sm:w-40 items-center justify-end space-x-2">
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
