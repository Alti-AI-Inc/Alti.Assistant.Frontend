import { saveConversationAction } from '@/actions/conversationsAction';
import {
  ConversationDetails,
  useSavedConversations,
} from '@/hooks/useConversations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bookmark, BookmarkCheck, LoaderCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

const SaveConversation = ({ conversationId }: { conversationId: string }) => {
  const { data: session } = useSession();
  const {
    data: conversations,

    // error,
  } = useSavedConversations(session?.accessToken);

  const queryClient = useQueryClient();

  const isSaved = conversations?.find(
    conversation => conversation.conversationId === conversationId,
  )?.is_saved;

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      if (!session?.accessToken || !conversationId) {
        console.error('Id not found');
        return Promise.reject(new Error('Id or Token not found'));
      }
      return saveConversationAction(
        conversationId,
        !isSaved,
        session.accessToken,
      );
    },
    onSuccess: () => {
      // invalidate the conversations list so UI refreshes
      queryClient.invalidateQueries({ queryKey: ['saved-conversations'] });
    },
    onError: error => {
      console.error('Rename failed', error);
    },
  });

  return (
    <div
      className="flex items-center justify-center space-x-2"
      onClick={() => mutate()}
      // aria-disabled={isPending}
    >
      {isPending ? (
        <LoaderCircle className="animate-spin" />
      ) : isSaved ? (
        <BookmarkCheck className="text-black" />
      ) : (
        <Bookmark className="text-black" />
      )}{' '}
      <span className="text-black">
        {isPending ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
      </span>
    </div>
  );
};

export default SaveConversation;
