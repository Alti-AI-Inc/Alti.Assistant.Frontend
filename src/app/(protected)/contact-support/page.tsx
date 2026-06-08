'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const SupportContent = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call to send support message
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success('Your message has been sent to our support team.');
      setMessage('');
    } catch (error) {
      toast.error('Failed to send support message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
      {/* Main Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
        <div className="w-full space-y-4">
          <Textarea
            id="support-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
            className="w-full min-h-[280px] rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-4 text-base text-gray-800 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-400 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-sm transition-all resize-none"
            disabled={isLoading}
            rows={10}
          />

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !message.trim()}
            className="w-full h-12 rounded-xl bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90 font-medium shadow-sm transition-all cursor-pointer flex items-center justify-center disabled:opacity-100 disabled:bg-black disabled:text-white/40 dark:disabled:bg-white dark:disabled:text-black/40"
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent align-[-0.125em]"></span>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ContactSupportPage() {
  return (
    <Suspense fallback={<div className="flex-1 h-full flex items-center justify-center text-sm text-gray-555">Loading contact support...</div>}>
      <SupportContent />
    </Suspense>
  );
}
