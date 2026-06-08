'use client';

import { useState } from 'react';
import { useModalStore } from '@/stores/useModalStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function ContactSupportModal() {
  const { onClose, isOpen, type } = useModalStore();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      // Reset state on close after animation finishes
      setTimeout(() => {
        setMessage('');
      }, 200);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call to send support message
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success('Your message has been sent to our support team.');
      handleOpenChange(false);
    } catch (error) {
      toast.error('Failed to send support message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isModalOpen = isOpen && type === 'contact-support';

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[440px] rounded-[20px] p-0 bg-white dark:bg-zinc-900 border-none shadow-xl overflow-hidden animate-in fade-in-50 duration-150">
        <DialogHeader className="px-6 py-4 border-b border-black/10 dark:border-white/10 space-y-0">
          <DialogTitle className="text-base font-semibold text-gray-900 dark:text-white text-left">
            Contact Support
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 pt-3 space-y-4">
          <div className="space-y-2">
            <Textarea
              id="support-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message..."
              className="w-full min-h-[140px] rounded-lg border border-black/5 dark:border-white/5 bg-[#EFEFF0] dark:bg-zinc-800 bg-auth-input p-3 text-sm text-gray-800 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-400 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 transition-all resize-none"
              disabled={isLoading}
              rows={5}
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
      </DialogContent>
    </Dialog>
  );
}

export default ContactSupportModal;
