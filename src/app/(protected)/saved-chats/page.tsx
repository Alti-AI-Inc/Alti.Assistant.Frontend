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
  Bookmark,
  EllipsisVertical,
  LoaderCircle,
  Pencil,
  Share,
  Trash2,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Page = () => {
  const { onOpen } = useModalStore();
  const { data: session } = useSession();
  const router = useRouter();
  const {
    data: conversations,
    isLoading,
  } = useSavedConversations(session?.accessToken);
  const deleteMutation = useDeleteConversation();

  const sortedConversations: Conversation[] = conversations
    ? [...conversations].sort(
        (a, b) =>
          new Date(b?.updatedAt).getTime() - new Date(a?.updatedAt).getTime(),
      )
    : [];

  return (
    <div className="flex-1 bg-white">
      {isLoading ? (
        <div className="flex h-svh w-full items-center justify-center">
          <LoaderCircle className="animate-spin text-gray-500" />
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className="border-b border-black/10 px-6 py-4 sm:px-8">
            <h1 className="text-lg font-semibold text-gray-900">
              Saved Chats
            </h1>
          </div>

          {/* Conversations Rows */}
          <div className="mx-auto w-full max-w-[880px] px-4 py-8 sm:px-6 lg:px-8">
            {sortedConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-black/[0.04] bg-[#F8F9FA] py-16 text-center">
                <Bookmark className="size-10 text-gray-400" />
                <h3 className="mt-4 text-sm font-semibold text-gray-900">No saved chats</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Chats you save will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedConversations.map(chat => (
                  <div
                    key={chat.conversationId}
                    onClick={() => router.push(`/c/${chat.conversationId}`)}
                    className="group relative flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-black/[0.04] bg-[#F8F9FA] p-4 transition-all duration-200 hover:bg-[#F2F3F5] hover:shadow-xs"
                  >
                    <div className="flex flex-1 items-center gap-4 min-w-0">
                      {/* Chat Text Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/c/${chat.conversationId}`}
                            className="font-medium text-gray-900 hover:underline truncate"
                            onClick={e => e.stopPropagation()}
                          >
                            {formatConversationTitle(chat.title!)}
                          </Link>
                          {chat.updatedAt && (
                            <span className="flex-shrink-0 text-xs text-gray-400 font-medium">
                              • {new Date(chat.updatedAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                          {chat.messages && chat.messages[1]
                            ? chat.messages[1].content
                            : chat.messages && chat.messages[0]
                            ? chat.messages[0].content
                            : 'No preview available'}
                        </p>
                      </div>
                    </div>

                    {/* Actions Dropdown */}
                    <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-gray-500 outline-none hover:bg-black/5 hover:text-gray-900">
                          <EllipsisVertical className="size-4 rotate-90" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mr-5 rounded-2xl">
                          <DropdownMenuItem
                            onClick={() =>
                              onOpen({
                                type: 'share-conversation',
                                actionId: chat._id,
                              })
                            }
                          >
                            <Share className="size-4 mr-2 text-black" /> Share
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
                            <Pencil className="size-4 mr-2 text-black" /> Rename
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
                            <Trash2 className="size-4 mr-2 text-black" />{' '}
                            <span className="text-black">Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Page;

export default Page;
