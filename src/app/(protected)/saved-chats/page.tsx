'use client';

// Note: Tenant filtering for saved conversations will be implemented in Phase 6
// Currently displays all user's saved conversations regardless of tenant context
// Phase 6 will add X-Tenant-Id headers to API calls and backend filtering

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useDeleteConversation,
  useSavedConversations,
} from '@/hooks/useConversations';
import { formatConversationTitle } from '@/lib/utils';
import { Conversation } from '@/actions/conversationsAction';
import { useModalStore } from '@/stores/useModalStore';
import {
  EllipsisVertical,
  LoaderCircle,
  Pencil,
  Share,
  Trash2,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const Page = () => {
  const { onOpen } = useModalStore();
  const { data: session } = useSession();
  const {
    data: conversations,
    isLoading,
    // error,
  } = useSavedConversations(session?.accessToken);
  const deleteMutation = useDeleteConversation();

  const sortedConversations: Conversation[] = conversations
    ? [...conversations].sort(
        (a, b) =>
          new Date(b?.updatedAt).getTime() - new Date(a?.updatedAt).getTime(),
      )
    : [];

  return (
    <>
      {isLoading ? (
        <div className="flex h-svh w-full items-center justify-center">
          <LoaderCircle className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3">
          {sortedConversations.map(chat => (
            <div
              key={chat.conversationId}
              className="group relative space-y-2 rounded-md bg-gray-100 p-6"
            >
              <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 outline-none">
                    <EllipsisVertical className="size-5 rotate-90 opacity-0 group-hover:opacity-100" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mr-5 rounded-2xl">
                    {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                    <DropdownMenuItem
                      onClick={() =>
                        onOpen({
                          type: 'share-conversation',
                          actionId: chat._id,
                        })
                      }
                    >
                      <Share className="text-black" /> Share
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        onOpen({
                          type: 'rename-chat',
                          title: chat.title,
                          actionId: chat.conversationId,
                        })
                      }
                    >
                      <Pencil className="text-black" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() =>
                        onOpen({
                          type: 'delete-conversation',
                          actionId: chat._id,
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
              <h2 className="line-clamp-1 font-bold">
                <Link href={`/c/${chat.conversationId}`}>
                  <span className="absolute inset-0 z-0"></span>
                  {formatConversationTitle(chat.title!)}
                </Link>
              </h2>
              <p className="line-clamp-2">
                {chat.messages && chat.messages[1]
                  ? chat.messages[1].content
                  : 'No preview available'}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Page;
