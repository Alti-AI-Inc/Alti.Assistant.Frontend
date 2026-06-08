'use client';

import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useModalStore } from '@/stores/useModalStore';
import { useState } from 'react';

export function InviteFriends() {
  const { onClose, isOpen, type } = useModalStore();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      // Reset state on close after animation finishes
      setTimeout(() => {
        setIsSent(false);
        setEmail('');
        setSentEmail('');
      }, 200);
    }
  };

  const handleSend = async () => {
    if (!email) return;
    setIsSending(true);
    // Simulate sending (1 second delay)
    setTimeout(() => {
      setIsSending(false);
      setSentEmail(email);
      setIsSent(true);
    }, 1000);
  };

  const isModalOpen = isOpen && type === 'invite';

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[290px] sm:max-w-[290px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden animate-in fade-in-50 duration-150">
        {!isSent ? (
          <>
            {/* Centered Content Section */}
            <div className="px-5 pt-5 pb-5 text-center space-y-3">
              <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                Invite Friends
              </h2>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                Enter their email address below to send an invitation.
              </p>
              
              {/* Simple Bar the same as platform knowledge */}
              <div className="relative w-full flex items-center gap-2 bg-[#F5F5F7] dark:bg-zinc-800 border border-black/10 dark:border-white/10 rounded-lg shadow-xs pr-1 pl-3 py-1 text-left">
                <input
                  id="friend-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 min-w-0 bg-transparent border-none text-xs text-gray-800 placeholder-gray-400 dark:text-gray-100 outline-none focus:ring-0 focus-visible:ring-0 p-0"
                />
                <Button
                  size="sm"
                  disabled={isSending || !email}
                  onClick={handleSend}
                  className="h-7 px-3 text-[11px] font-medium rounded-md cursor-pointer flex-none bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  {isSending ? (
                    <span className="size-3.5 animate-spin rounded-full border-2 border-white dark:border-black border-t-transparent" />
                  ) : (
                    'Send'
                  )}
                </Button>
              </div>
            </div>

            {/* Extended Border & iOS Layout Action Cancel Button */}
            <div className="border-t border-black/10 dark:border-white/10 flex h-11">
              <button
                onClick={() => handleOpenChange(false)}
                className="w-full text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Centered Content Section (Success State) */}
            <div className="px-5 pt-5 pb-4 text-center space-y-2">
              <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                Invite Sent
              </h2>
              <p className="text-[13px] text-gray-555 dark:text-gray-400 leading-normal px-1">
                Your invitation has been successfully sent to:
              </p>
              <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 break-all select-all px-2 py-1 bg-[#F5F5F7] dark:bg-zinc-800 rounded-lg inline-block">
                {sentEmail}
              </p>
            </div>

            {/* OK Button */}
            <div className="border-t border-black/10 dark:border-white/10 flex h-11">
              <button
                onClick={() => handleOpenChange(false)}
                className="w-full text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none cursor-pointer"
              >
                Close
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default InviteFriends;
