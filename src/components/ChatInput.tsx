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

  const apiUrl =
    selectedOption === OPTIONS.IMAGE
      ? `${process.env.NEXT_PUBLIC_API_URL}/image/generate`
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
      // optimistic update: add user message immediately
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

      // add assistant's response

      if (selectedOption === OPTIONS.IMAGE) {
        updateActiveConversation(
          response.data.responseMessage.text,
          ROLES.ASSISTANT,
          newId,
          response.data.responseMessage.images,
        );
        setSelectedOption(OPTIONS.IMAGE);
      } else {
        updateActiveConversation(
          response.data.responseMessage.answer,
          ROLES.ASSISTANT,
          newId,
        );
      }

      if (conversationId === 'new-chat') {
        // refresh sidebar conversations
        queryClient.invalidateQueries({
          queryKey: ['conversations', data?.accessToken],
        });
      }

      // refresh active conversation
      // if (newId) {
      //   queryClient.invalidateQueries({
      //     queryKey: ['activeConversation', newId],
      //   });
      // }

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
    <div className="mx-auto w-full max-w-[780px] bg-white">
      {/* <form> */}
      <div className="rounded-2xl border-2 border-gray-200 px-4 shadow-sm">
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
        <div className="flex items-end justify-between py-2">
          <div className="flex items-center space-x-2">
            <div className="flex justify-center">
              <label htmlFor="file-input-alt" className="">
                <Plus className="size-6 cursor-pointer rounded-full border-2 border-gray-300 p-0.5" />
              </label>
              <Input
                type="file"
                className="hidden placeholder:hidden"
                placeholder=""
                id="file-input-alt"
              />
            </div>

            {options.map(option => (
              <Button
                key={option.id}
                className={cn(
                  'h-6 rounded-full border border-gray-300 bg-white py-1 text-sm font-normal text-black hover:text-white',

                  {
                    'bg-black text-sm text-white':
                      option.value === selectedOption,
                  },
                )}
                onClick={() => handleSelectOption(option.value)}
              >
                {option.title}
              </Button>
            ))}
          </div>

          <div className="flex w-40 items-center justify-end space-x-2">
            {message ? (
              <ArrowRight
                onClick={handleSubmit}
                // type="submit"
                className="size-6 flex-none cursor-pointer rounded-full border-2 border-gray-300 bg-black p-0.5 text-white"
              />
            ) : (
              <AudioRecorder setMessage={setMessage} />
            )}
          </div>
        </div>
      </div>
      {/* </form> */}
    </div>
  );
};

export default ChatInput;
