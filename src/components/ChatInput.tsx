'use client';

import { PostConversation } from '@/actions/conversations';
import AudioRecorder from '@/components/AudioRecorder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ROLES, useConversationsStore } from '@/stores/useConverstionsStore';
import { ArrowRight, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const options = [
  {
    id: 1,
    title: 'Research',
    value: 'deep-research',
  },
  {
    id: 2,
    title: 'Task',
    value: 'task-automation',
  },
  {
    id: 3,
    title: 'Code',
    value: 'code-generation',
  },
  {
    id: 4,
    title: 'Image',
    value: 'image-generation',
  },
  {
    id: 6,
    title: 'Video',
    value: 'video-generation',
  },
];

const ChatInput = ({ conversationId }: { conversationId?: string }) => {
  const router = useRouter();
  const { data } = useSession();
  const { updateActiveConversation, setLoadingResponse } =
    useConversationsStore();

  const [message, setMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelectOption = (value: string) => {
    if (selectedOption === value) {
      setSelectedOption(null);
    } else {
      setSelectedOption(value);
    }
  };

  const handleSubmit = async () => {
    if (message.trim() === '') return;
    updateActiveConversation(message, ROLES.USER);
    setMessage('');

    setLoadingResponse(true);

    try {
      if (data?.accessToken) {
        const response = await PostConversation(
          message,
          data.accessToken,
          conversationId === 'new-chat' ? undefined : conversationId,
        );
        if (response.data.responseMessage.answer) {
          if (conversationId === 'new-chat') {
            updateActiveConversation(
              message,
              ROLES.USER,
              response.data.conversationId,
            );
          }
          const newId =
            conversationId === 'new-chat'
              ? response.data.conversationId
              : conversationId;
          updateActiveConversation(
            response.data.responseMessage.answer,
            ROLES.ASSISTANT,
            newId,
          );
          if (conversationId === 'new-chat')
            router.replace(`/c/${response.data.conversationId}`);
        }

        setLoadingResponse(false);
      }
    } catch (error) {
      console.log({ error });
    }

    if (message.trim()) {
      setMessage('');
    }

    setLoadingResponse(false);
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
