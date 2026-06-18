'use client';

import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { useModalStore } from '@/stores/useModalStore';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Logout() {
  const { onClose, isOpen } = useModalStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogOut = async () => {
    setIsLoading(true);
    await signOut({
      callbackUrl: '/',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[270px] sm:max-w-[270px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
        {/* Centered Content Section */}
        <div className="px-5 pt-5 pb-4 text-center">
          <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
            Logout
          </h2>
          <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
            Are you sure you want to logout?
          </p>
        </div>

        {/* Extended Border & iOS Layout Action Buttons */}
        <div className="border-t border-black/10 dark:border-white/10 flex h-11">
          {/* Cancel Option */}
          <button
            onClick={onClose}
            className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none"
          >
            Cancel
          </button>
          
          {/* Confirm Logout Option */}
          <button
            disabled={isLoading}
            onClick={handleLogOut}
            className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center disabled:opacity-50 outline-none"
          >
            {isLoading ? (
              <span className="size-4 animate-spin rounded-full border-2 border-black dark:border-white border-t-transparent" />
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
