'use client';

import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

const options = [
  {
    id: 1,
    title: 'Buy',
    value: 'buy',
  },
  {
    id: 2,
    title: 'Sell',
    value: 'sell',
  },
  {
    id: 3,
    title: 'Mortgage',
    value: 'mortgage',
  },
];

export function ChatInputComponent() {
  const [message, setMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState(options[0].value);

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
          <input
            className="min-h-12 w-full border-none px-2 py-2 shadow-none outline-none focus-visible:ring-0"
            placeholder="Chat with real home"
          />
          <div className="flex items-end justify-between py-2">
            <div className="flex items-center space-x-2">
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
