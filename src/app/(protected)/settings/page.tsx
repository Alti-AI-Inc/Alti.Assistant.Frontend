'use client';

import ChangePassword from '@/components/ChangePassword';
import SendInviteButton from '@/components/SendInviteButton';
import { SettingsSidebar } from '@/components/sidebars/SettingsSidebar';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { LlamaIndexChat } from '@/app/(protected)/knowledge/_components/LlamaIndexChat';

const Page = () => {
  const [selectedOption, setSelectedOption] = useState('data');

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#F5F5F7] dark:bg-gray-900">
      {/* Settings Sidebar */}
      <div className="relative shrink-0">
        <SettingsSidebar
          selectedOption={selectedOption}
          onSelectOption={setSelectedOption}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F5F5F7] dark:bg-gray-955">
        {/* Dynamic Settings Top Navbar (Header) */}
        <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-955 justify-between">
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">
            {selectedOption === 'data' && 'Data Vault'}
            {selectedOption === 'password' && 'Update Password'}
            {selectedOption === 'invite' && 'Invite Friends'}
          </h1>
        </div>

        {/* Workspace Body */}
        {selectedOption === 'data' ? (
          <div className="flex-1 min-h-0 overflow-hidden bg-[#F5F5F7] dark:bg-gray-955">
            <LlamaIndexChat />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
            <div className="max-w-4xl">
              {selectedOption === 'password' && <ChangePassword />}
              {selectedOption === 'invite' && <Invite />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



const Invite = () => {
  const [email, setEmail] = useState('');
  const [showSentModal, setShowSentModal] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  return (
    <div className="max-w-4xl pt-2">
      <div className="relative flex items-center">
        <input
          id="friend-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter email address"
          className="w-full h-10 rounded-lg border border-black/10 bg-white px-4 pr-32 text-sm text-gray-800 placeholder-gray-400 shadow-inner focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 outline-none transition-all"
        />
        <div className="absolute right-1">
          <SendInviteButton
            content={email}
            className="h-8 px-4 text-xs font-semibold rounded-md shadow-sm transition-all bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black"
            onClose={() => setEmail('')}
            onSent={() => {
              setSentEmail(email);
              setShowSentModal(true);
            }}
          />
        </div>
      </div>

      {/* iOS-Style Invite Sent Confirmation Dialog */}
      <Dialog open={showSentModal} onOpenChange={setShowSentModal}>
        <DialogContent className="p-0 overflow-hidden rounded-[20px] w-fit min-w-[270px] max-w-[90vw] sm:max-w-[420px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
          {/* Centered Content Section */}
          <div className="px-6 pt-5 pb-5 text-center">
            <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
              Invite Sent
            </h2>
            <p className="mt-3.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
              Your invitation has been sent to:
              <span className="block mt-1 text-[13px] font-normal text-gray-500 dark:text-gray-400 break-all select-all">
                {sentEmail}
              </span>
            </p>
          </div>

          {/* Extended Border & iOS Layout Action Buttons (Single Button) */}
          <div className="border-t border-black/10 dark:border-white/10 flex h-11">
            <button
              onClick={() => setShowSentModal(false)}
              className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
