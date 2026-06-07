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
      <DialogContent className="max-w-[440px] rounded-[20px] p-6 bg-white dark:bg-zinc-900 border-none shadow-xl animate-in fade-in-50 duration-150">
        <DialogHeader className="pb-4 border-b border-black/5 dark:border-white/5 space-y-0">
          <DialogTitle className="text-base font-semibold text-gray-900 dark:text-white text-left">
            Change Password
          </DialogTitle>
        </DialogHeader>

        <div className="pt-4">
          <ChangePassword onSuccess={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
