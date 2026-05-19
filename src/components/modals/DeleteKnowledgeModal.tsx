import { Button } from '../ui/button';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  title: string;
}

export default function DeleteKnowledgeModal({
  isOpen,
  onClose,
  onLogout,
  title,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="relative w-full max-w-md rounded-xl bg-white p-4 shadow-lg">
        {/* <Icon
          icon="ei:close"
          className="absolute top-3 right-3 dark:text-white text-black cursor-pointer w-5 h-5"
          onClick={onClose}
        /> */}
        <h2 className="text-base font-medium">Delete</h2>
        <h2 className="mt-7 mb-7 text-sm font-light">
          Are you sure you want to delete this {title}?
        </h2>
        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="border-[1px] border-black bg-white text-black hover:bg-white hover:text-black"
          >
            Cancel
          </Button>
          <Button
            onClick={onLogout}
            className="bg-black text-white dark:bg-white dark:text-black"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
