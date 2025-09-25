'use client';

import AudioRecorder from '@/components/AudioRecorder';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ArrowRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { chatbots } from '../../page';

function ChatbotPromptBox({ slug }: { slug: string }) {
  const [message, setMessage] = useState('');
  // const { data } = useSession();
  // console.log(data?.accessToken);
  const title = chatbots.filter(chatbot => chatbot.slug === slug)[0].title;

  return (
    <div className={cn('flex h-screen flex-col items-center justify-center')}>
      <h1 className="mb-8 text-4xl font-medium">{title}</h1>

      <div className="sticky bottom-0 bg-white px-4 pb-4">
        <div className="mx-auto w-[796px] space-y-6 bg-white px-4 lg:px-0">
          <div className="rounded-2xl border-2 border-gray-200 px-3 shadow-sm sm:px-4">
            <Textarea
              name="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              // onChange={e => setMessage(e.target.value)}
              // onKeyPress={e => {
              //   if (e.key === 'Enter' && !e.shiftKey) {
              //     e.preventDefault();
              //     handleSubmit();
              //   }
              // }}
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
              </div>

              {/* Right: Mic or send button */}
              <div className="flex items-center">
                {message ? (
                  <ArrowRight
                    // onClick={handleSubmit}
                    className="size-7 flex-none cursor-pointer rounded-full border-2 border-gray-300 bg-black p-1 text-white"
                  />
                ) : (
                  <AudioRecorder setMessage={setMessage} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPromptBox;
