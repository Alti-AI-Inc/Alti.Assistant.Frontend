'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModalStore } from '@/stores/useModalStore';
import { useState } from 'react';
import SendInviteButton from '../SendInviteButton';
import { Input } from '../ui/input';
import { UserPlus } from 'lucide-react';

export function InviteFriends() {
  const { onClose, isOpen, type } = useModalStore();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

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

  const isModalOpen = isOpen && type === 'invite';

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[440px] rounded-[20px] p-0 bg-[#F5F5F7] bg-modal-gray dark:bg-zinc-900 border-none shadow-xl overflow-hidden animate-in fade-in-50 duration-150">
        {!isSent ? (
          <>
            <DialogHeader className="px-6 py-4 border-b border-black/10 dark:border-white/10 space-y-0">
              <DialogTitle className="text-base font-semibold text-gray-900 dark:text-white text-left">
                Invite Friends
              </DialogTitle>
            </DialogHeader>

            <div className="px-6 pb-6 pt-3 space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-normal">
                Invite your friends to join the alti platform.<br />
                Enter their email address below to send an invitation.
              </p>

              <div className="relative flex items-center">
                <Input
                  id="friend-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full h-10 rounded-lg border border-black/5 dark:border-white/5 bg-[#EFEFF0] dark:bg-zinc-800 bg-auth-input pl-4 pr-24 text-sm text-gray-800 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-400 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 transition-all"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2">
                  <SendInviteButton
                    content={email}
                    className="h-8 px-4 text-xs font-semibold rounded-md shadow-sm transition-all"
                    onClose={() => handleOpenChange(false)}
                    onSent={() => {
                      setSentEmail(email);
                      setIsSent(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="px-6 py-4 border-b border-black/10 dark:border-white/10 space-y-0">
              <DialogTitle className="text-base font-semibold text-gray-900 dark:text-white text-left flex items-center gap-2">
                Invite Sent
              </DialogTitle>
            </DialogHeader>

            <div className="px-6 pb-6 pt-5 text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-50 dark:bg-green-950/40 text-green-655 dark:text-green-400 flex items-center justify-center">
                <UserPlus className="h-6 w-6" />
              </div>
              
              <div className="space-y-1.5">
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-normal">
                  Your invitation has been successfully sent to:
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-all select-all px-2">
                  {sentEmail}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleOpenChange(false)}
                  className="w-full h-10 rounded-lg text-[15px] font-medium text-white bg-black hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 transition-colors flex items-center justify-center outline-none cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default InviteFriends;
