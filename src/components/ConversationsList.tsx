'use client';

import {
  useConversations,
  useDeleteConversation,
} from '@/hooks/useConversations';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useDrawerStore } from '@/stores/useDrawerStore';
import { useModalStore } from '@/stores/useModalStore';
import { EllipsisVertical, Pencil, Share, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
// import { useDrawerStore } from '@/stores/useModalStore';

const ConversationsList = () => {
  const router = useRouter();
  const { close } = useDrawerStore();

  const { data: session } = useSession();

  const {
    data: conversations,
    // error,
  } = useConversations(session?.accessToken);
  const deleteMutation = useDeleteConversation();
  const { setSelectedOption, setShowStartLastMessage, setUserMessage } =
    useConversationsStore();
  const { onOpen } = useModalStore();

  const sortedConversations = conversations
    ? [...conversations].sort(
        (a, b) =>
          new Date(b?.updatedAt).getTime() - new Date(a?.updatedAt).getTime(),
      )
    : [];

  const handleConversationClick = async (id: string) => {
    close(); // will close Zustand drawer
    setSelectedOption(null);
    setShowStartLastMessage(false);
    setUserMessage('');
    router.push('/c/' + id);
  };

  return (
    <div className="mt-2">
      {sortedConversations.map(chat => (
        <div
          className="group focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group flex h-9 w-full shrink-0 cursor-pointer items-center justify-between gap-2 rounded-md bg-transparent text-sm font-medium whitespace-nowrap text-black shadow-none transition-all outline-none hover:bg-black/5 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          key={chat._id}
        >
          <span
            className="flex-1 truncate px-1 py-2"
            onClick={() => handleConversationClick(chat.conversationId)}
          >
            {' '}
            {chat?.title?.replace(/^(Search|Code|Image|Deep Research):\s*/, '')}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:outline-none">
              <EllipsisVertical className="mr-2 rotate-90 opacity-0 group-hover:opacity-100" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl">
              <DropdownMenuItem>
                <Share className="text-black" /> Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpen({ type: 'rename-chat', actionId: chat.conversationId, title: chat.title.replace(/^(Search|Code|Image|Deep Research):\s*/, '') })}>
                <Pencil className="text-black" /> Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  onOpen({
                    type: 'delete-conversation',
                    actionId: chat.conversationId,
                  })
                }
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="text-black" />{' '}
                <span className="text-black">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};

export default ConversationsList;
