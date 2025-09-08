'use client';

import { cn } from '@/lib/utils';
import { ArrowRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const options = [
  {
    id: 1,
    title: 'Deep research',
    value: 'deep-research',
  },
  {
    id: 2,
    title: 'Code generation',
    value: 'code-generation',
  },
  {
    id: 3,
    title: 'Task automation',
    value: 'task-automation',
  },
];

export function ChatInputComponent() {
  const [message, setMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl border-2 border-gray-200 px-4 shadow-sm">
          <Input
            type="text"
            placeholder='Chat with alti'
            className="min-h-12 w-full border-none px-2 py-2 shadow-none outline-none focus-visible:ring-0"
          />
          <div className="flex items-end justify-between py-2">
            <div className="flex items-center space-x-2">
              <div className="flex justify-center">
                <label htmlFor="file-input-alt" className="">
                  <Plus className="cursor-pointer rounded-full border-2 border-gray-300 p-0.5" />
                </label>
                <Input
                  type="file"
                  // multiple
                  // onChange={handleFileSelect}
                  className="hidden placeholder:hidden"
                  placeholder=''
                  id="file-input-alt"
                />
              </div>
              {/* <Plus className="cursor-pointer rounded-full border-2 border-gray-300 p-0.5" /> */}
              {options.map(option => (
                <Button
                  key={option.id}
                  className={cn(
                    'h-auto rounded-full border border-gray-300 bg-white py-1 text-black hover:text-white',

                    {
                      'bg-black text-white': option.value === selectedOption,
                    },
                  )}
                  onClick={() => setSelectedOption(option.value)}
                >
                  {option.title}
                </Button>
              ))}
            </div>
            <ArrowRight
              type="submit"
              className="cursor-pointer rounded-full border-2 border-gray-300 bg-black p-0.5 text-white"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
