'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';

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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F5F5F7] dark:bg-gray-955">
      {/* Top Navbar / Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-955 justify-between">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Contact Support
        </h1>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6 flex justify-center">
        <div className="w-full max-w-xl space-y-6">
          {/* Card description */}
          <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Get in Touch</h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Have questions, feedback, or encountering technical issues? Write your message below and our support team will get back to you as soon as possible.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="space-y-2">
              <Textarea
                id="support-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
                className="w-full min-h-[160px] rounded-lg border border-black/5 dark:border-white/5 bg-[#F5F5F7] dark:bg-zinc-800 bg-auth-input p-3 text-sm text-gray-800 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-400 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 transition-all resize-none"
                disabled={isLoading}
                rows={6}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading || !message.trim()}
              className="w-full h-10 rounded-lg text-[15px] font-medium text-white bg-black hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 transition-colors flex items-center justify-center outline-none cursor-pointer"
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
