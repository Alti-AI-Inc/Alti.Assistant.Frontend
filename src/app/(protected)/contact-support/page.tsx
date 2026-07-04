'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

const SupportContent = () => {
  const { data: session } = useSession();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call to send support message
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const now = new Date();
      const userEmail = session?.user?.email || 'user@insoai.com';
      const newRequest = {
        id: `req-${Math.random().toString(36).substring(2, 9)}`,
        email: userEmail,
        subject: subject.trim(),
        message: message.trim(),
        date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending',
      };

      const existing = localStorage.getItem('insoai_support_requests');
      const requests = existing ? JSON.parse(existing) : [];
      requests.unshift(newRequest);
      localStorage.setItem('insoai_support_requests', JSON.stringify(requests));

      toast.success('Your message has been sent to our support team.');
      setSubject('');
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
          <input
            type="text"
            id="support-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter Subject"
            className="w-full h-12 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 px-4 text-base text-gray-800 placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0 focus:border-black/10 dark:focus:border-white/10 focus-visible:border-black/10 dark:focus-visible:border-white/10 shadow-sm transition-all"
            disabled={isLoading}
          />

          <textarea
            id="support-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter Message"
            className="w-full min-h-[120px] rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-4 text-base text-gray-800 placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0 focus:border-black/10 dark:focus:border-white/10 focus-visible:border-black/10 dark:focus-visible:border-white/10 shadow-sm transition-all resize-none"
            disabled={isLoading}
            rows={5}
          />

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !subject.trim() || !message.trim()}
            className="w-full h-12 rounded-xl bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90 font-medium shadow-sm transition-all cursor-pointer flex items-center justify-center disabled:opacity-100 disabled:bg-black disabled:text-white dark:disabled:bg-white dark:disabled:text-black"
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
