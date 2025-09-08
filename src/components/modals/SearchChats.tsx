'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModalStore } from '@/stores/useModalStore';
import { Input } from '../ui/input';
const SearchChats = () => {
  const { isOpen, onClose } = useModalStore();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Search Chats</DialogTitle>
          <DialogDescription>
            <Input
              placeholder="Search chats..."
              className="w-full border-0 px-3 py-2 shadow-none focus:ring-0 focus-visible:ring-0"
            />
            {/* <Separator className="mt-4 w-full" /> */}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SearchChats;
