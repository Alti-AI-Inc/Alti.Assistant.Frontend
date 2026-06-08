'use client';

import { useModalStore } from '@/stores/useModalStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ChangePassword from '../ChangePassword';

export const ChangePasswordModal = () => {
  const { isOpen, onClose } = useModalStore();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[440px] rounded-[20px] p-0 bg-[#F5F5F7] bg-modal-gray dark:bg-zinc-900 border-none shadow-xl overflow-hidden animate-in fade-in-50 duration-150">
        <DialogHeader className="px-6 py-4 border-b border-black/10 dark:border-white/10 space-y-0">
          <DialogTitle className="text-base font-semibold text-gray-900 dark:text-white text-left">
            Change Password
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 pt-4">
          <ChangePassword onSuccess={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
