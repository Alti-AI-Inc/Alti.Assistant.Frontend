'use client';

import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function ChatWithProperty() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  };

  console.log({ isSubmitting });

  return (
    <div
      className={cn(
        'flex h-[calc(100vh-28px)] w-5/12 flex-col justify-center overflow-y-scroll rounded-md bg-gray-100 p-4 transition-all duration-300',
        isSubmitting && 'justify-end',
      )}
    >
      <form className="space-y-4">
        <h2
          className={cn(
            'mb-4 text-center text-2xl font-semibold',
            isSubmitting && 'hidden',
          )}
        >
          Chat with this property
        </h2>
        <div className="rounded-2xl border-2 border-gray-200 bg-white px-4 shadow-sm">
          <input
            className="min-h-12 w-full border-none px-2 py-2 shadow-none outline-none focus-visible:ring-0"
            placeholder="Enter message"
          />
          <div onClick={handleFormSubmit} className="flex w-full items-end justify-end py-2">
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
