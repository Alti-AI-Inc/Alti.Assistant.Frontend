import { shareConversation } from '@/actions/conversationsAction';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useModalStore } from '@/stores/useModalStore';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import CopyButton from '../CopyButton';

export function ShareConversationModal() {
  const { data: session } = useSession();
  const { isOpen, onClose, actionId: conversationId } = useModalStore();
  const token = session?.accessToken;
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['share-conversation', conversationId],
    queryFn: () => {
      if (!conversationId || !token) {
        console.error('Missing token or id');
        return Promise.reject(new Error('Conversation Id not found'));
      }
      return shareConversation(conversationId, token);
    },
    enabled: isOpen && !!conversationId && !!token, // only run when modal opens
    retry: false, // optional: don’t retry if share fails
  });

  const shareLink = isLoading
    ? ''
    : `${window.location.origin}/shared/${data?.data?.shareId}`;

  //e26b78ad-21c7-4558-af8d-6351f8e53a7f
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-h-50 sm:max-w-lg">
        <DialogTitle className={isLoading ? 'sr-only' : 'hidden'}>
          loading...
        </DialogTitle>

        {isLoading ? (
          <div className="flex items-center justify-center">
            <LoaderCircle className="animate-spin" />
          </div>
        ) : isError ? (
          <div>{error.message}</div>
        ) : !data?.success ? (
          <div className="flex items-center justify-center">
            {data?.message}
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Share link</DialogTitle>
              <DialogDescription>
                Anyone who has this link will be able to view this chat.
              </DialogDescription>
            </DialogHeader>
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link2" className="sr-only">
                Link
              </Label>
              <div className="relative">
                <Input
                  id="link2"
                  value={shareLink}
                  readOnly
                  className="pr-12 selection:bg-transparent selection:text-black" // Add padding for the button
                />
                <div className="absolute inset-y-0 right-0 -mt-1 flex items-center">
                  <CopyButton content={shareLink} className="mr-1" />
                </div>
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
