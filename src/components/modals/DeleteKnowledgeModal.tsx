
import { Button } from "../ui/button";


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
      <div className="bg-white rounded-xl p-4 w-full max-w-md shadow-lg relative">
        {/* <Icon
          icon="ei:close"
          className="absolute top-3 right-3 dark:text-white text-black cursor-pointer w-5 h-5"
          onClick={onClose}
        /> */}
        <h2 className="font-medium text-base">Delete</h2>
        <h2 className="text-sm font-light mb-7 mt-7">
          Are you sure you want to delete this {title}?
        </h2>
        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="text-black hover:bg-white hover:text-black bg-white border-[1px] border-black"
          >
            Cancel
          </Button>
          <Button
            onClick={onLogout}
            className="dark:bg-white dark:text-black bg-black text-white"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
