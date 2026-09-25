import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Props {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function IosConfirmModal({ isOpen, title, description, confirmText, onCancel, onConfirm }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[320px] sm:max-w-[320px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
        <div className="px-5 pt-5 pb-4 text-center">
          <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
            {title}
          </h2>
          <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
            {description}
          </p>
        </div>
        <div className="border-t border-black/10 dark:border-white/10 flex h-11">
          <button
            onClick={onCancel}
            className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none"
          >
            {confirmText}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
