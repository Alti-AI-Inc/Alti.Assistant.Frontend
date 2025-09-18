'use client';

import {
  useConversations,
  useDeleteConversation,
} from '@/hooks/useConversations';
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

const ConversationsList = () => {
  const router = useRouter();

  const { data: session } = useSession();

  const {
    data: conversations,
    isLoading,
    // error,
  } = useConversations(session?.accessToken);
  const deleteMutation = useDeleteConversation();

  const sortedConversations = conversations
    ? [...conversations].sort(
        (a, b) =>
          new Date(b?.updatedAt).getTime() - new Date(a?.updatedAt).getTime(),
      )
    : [];

  const handleConversationClick = async (id: string) => {
    router.push('/c/' + id);
  };

  return (
    <div className="mt-2">
      {isLoading
        ? [1, 2, 3, 4, 5, 6].map(e => (
            <div
              key={e}
              className="dark:bg-n-6 hover:dark:bg-n-5 my-1 flex animate-pulse cursor-pointer flex-col rounded-xl bg-gray-100 px-4 py-2 shadow"
            >
              <div className="flex-1 overflow-hidden">
                <div className="bg-n-4/50 flex h-3 w-[30%] justify-center rounded-xl dark:bg-slate-50" />
              </div>
            </div>
          ))
        : sortedConversations.map(chat => (
            <div
              className="group focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group flex h-9 w-full shrink-0 cursor-pointer items-center justify-between gap-2 rounded-md bg-transparent text-sm font-medium whitespace-nowrap text-black shadow-none transition-all outline-none hover:bg-black/5 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              key={chat._id}
            >
              <span
                className="flex-1 truncate px-1 py-2"
                onClick={() => handleConversationClick(chat.conversationId)}
              >
                {' '}
                {chat?.title?.replace(
                  /^(Search|Code|Image|Deep Research):\s*/,
                  '',
                )}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger className="focus-visible:outline-none">
                  <EllipsisVertical className="mr-2 rotate-90 opacity-0 group-hover:opacity-100" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-2xl">
                  <DropdownMenuItem>
                    <Share className="text-black" /> Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pencil className="text-black" /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => deleteMutation.mutate(chat.conversationId)}
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
