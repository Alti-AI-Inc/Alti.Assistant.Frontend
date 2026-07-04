'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { useTenant } from '@/contexts/TenantContext';
import { inviteMember } from '@/actions/memberActions';
import { toast } from 'sonner';

const InviteContent = () => {
  const { activeTenantId, tenants } = useTenant();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const handleSend = async () => {
    if (!email.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    const targetTenantId = activeTenantId || tenants[0]?.id;
    if (!targetTenantId) {
      toast.error('Please select or create an organization workspace first to invite friends.');
      return;
    }

    setIsSending(true);
    try {
      const response = await inviteMember({
        tenantId: targetTenantId,
        email: email.trim(),
        role: 'member',
        message: 'Join me on Alti Assistant!',
      });

      if (response.success) {
        setIsSending(false);
        setSentEmail(email.trim());
        setShowSuccess(true);
        setEmail('');
      } else {
        toast.error(response.message || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Failed to send invitation:', error);
      toast.error('An unexpected error occurred while sending the invitation');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#e1e1e1] dark:bg-gray-955">
      {/* Top Navbar / Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-955 justify-between">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Invite Friends
        </h1>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6 flex justify-center">
        <div className="w-full space-y-6">
          {/* Top Add Invite Box (Matching Enter Instructions prompt bar style) */}
          <div className="relative w-full h-12 flex-none flex items-center gap-2 bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 rounded-xl shadow-sm pr-2 pl-4 transition-all">
            <input
              placeholder="Enter email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  handleSend();
                }
              }}
              disabled={isSending}
              className="flex-1 min-w-0 h-full bg-transparent border-none py-0 text-base text-gray-800 placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="flex-none ml-2 flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleSend}
                disabled={isSending || !email.trim()}
                className="h-8 px-4 rounded-md cursor-pointer bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 disabled:opacity-100 disabled:bg-black disabled:text-white dark:disabled:bg-white dark:disabled:text-black"
              >
                Send
                <ArrowUp className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* iOS-Style Success Confirmation Dialog (Same style/design as logout popup) */}
      <Dialog open={showSuccess} onOpenChange={(open) => !open && setShowSuccess(false)}>
        <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[320px] sm:max-w-[320px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden animate-in fade-in-50 duration-150">
          {/* Centered Content Section */}
          <div className="px-5 pt-5 pb-4 text-center">
            <DialogTitle className="text-[17px] font-semibold text-black dark:text-white leading-tight text-center">
              Invite Sent
            </DialogTitle>
            <DialogDescription className="mt-3 text-[13px] text-gray-555 dark:text-gray-400 leading-normal px-1 text-center whitespace-nowrap">
              Your invitation has been sent to:
            </DialogDescription>
            <div className="mt-3">
              <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 break-all select-all px-2 py-1 bg-[#e1e1e1] dark:bg-zinc-800 rounded-lg inline-block">
                {sentEmail}
              </p>
            </div>
          </div>

          {/* OK / Close Button */}
          <div className="border-t border-black/10 dark:border-white/10 flex h-11">
            <DialogClose asChild>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none cursor-pointer"
              >
                Close
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
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
