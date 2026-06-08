'use client';

import { useState, Suspense } from 'react';
import SendInviteButton from '@/components/SendInviteButton';
import { Input } from '@/components/ui/input';
import { UserPlus } from 'lucide-react';

const InviteContent = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const resetForm = () => {
    setIsSent(false);
    setEmail('');
    setSentEmail('');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F5F5F7] dark:bg-gray-955">
      {/* Top Navbar / Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-955 justify-between">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Invite Friends
        </h1>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6 flex justify-center">
        <div className="w-full space-y-6">
          {!isSent ? (
            <>
              {/* Card description */}
              <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-2xl p-6 shadow-xs">
                <p className="text-xs text-gray-505 dark:text-gray-400 leading-normal">
                  Invite your friends to join the alti platform.<br />
                  Enter their email address below to send an invitation.
                </p>
              </div>

              {/* Form Input Container */}
              <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-2xl p-6 shadow-xs">
                <div className="relative flex items-center">
                  <Input
                    id="friend-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full h-10 rounded-lg border border-black/5 dark:border-white/5 bg-[#F5F5F7] dark:bg-zinc-800 bg-auth-input pl-4 pr-24 text-sm text-gray-800 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-400 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 transition-all"
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2">
                    <SendInviteButton
                      content={email}
                      className="h-8 px-4 text-xs font-semibold rounded-md shadow-sm transition-all"
                      onClose={() => {}}
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
            <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-2xl p-8 shadow-xs text-center space-y-5">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-50 dark:bg-green-950/40 text-green-655 dark:text-green-400 flex items-center justify-center">
                <UserPlus className="h-6 w-6" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Invitation Sent</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
                  Your invitation has been successfully sent to:
                </p>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 break-all select-all px-2 py-1 bg-[#F5F5F7] dark:bg-zinc-800 rounded-lg inline-block">
                  {sentEmail}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={resetForm}
                  className="w-full h-10 rounded-lg text-sm font-semibold text-white bg-black hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 transition-colors flex items-center justify-center outline-none cursor-pointer"
                >
                  Send Another Invitation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function InviteFriendsPage() {
  return (
    <Suspense fallback={<div className="flex-1 h-full flex items-center justify-center text-sm text-gray-555">Loading invite friends page...</div>}>
      <InviteContent />
    </Suspense>
  );
}
