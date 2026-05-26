'use client';

// Note: Tenant filtering for conversations will be implemented in Phase 6
// Currently displays all user conversations regardless of tenant context
// Phase 6 will add X-Tenant-Id headers to API calls and backend filtering

import { Conversation } from '@/actions/conversationsAction';
import { useConversations } from '@/hooks/useConversations';
import { formatConversationTitle } from '@/lib/utils';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useDrawerStore } from '@/stores/useDrawerStore';
import { useModalStore } from '@/stores/useModalStore';
import {
  EllipsisVertical,
  LoaderCircle,
  Pencil,
  Share,
  Trash2,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import SaveConversation from './SaveConversation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function ConversationsList({
  searchQuery = '',
  activeTab = 'chat',
}: {
  searchQuery?: string;
  activeTab?: 'chat' | 'research' | 'assistant';
}) {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { close } = useDrawerStore();
  const { onOpen } = useModalStore();
  const { setSelectedOption, setShowStartLastMessage, setUserMessage } =
    useConversationsStore();

  const canFetchConversations =
    sessionStatus === 'authenticated' &&
    !!session?.accessToken &&
    !session.isTokenExpired;

  // isDeepSearch drives server-side filtering: each tab hits its own API query
  const isDeepSearch = activeTab === 'research' ? true : undefined;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useConversations(
      canFetchConversations ? session.accessToken : undefined,
      isDeepSearch,
    );

  const getDisplayTitle = (title: string) => {
    const cleanTitle = formatConversationTitle(title);
    if (activeTab !== 'assistant') return cleanTitle;

    const lower = cleanTitle.toLowerCase();
    if (lower.includes('search') || lower.includes('google') || lower.includes('web')) {
      return `🔍 /web_search: ${cleanTitle}`;
    } else if (lower.includes('code') || lower.includes('write') || lower.includes('debug') || lower.includes('python') || lower.includes('rust') || lower.includes('go')) {
      return `💻 /code_gen: ${cleanTitle}`;
    } else if (lower.includes('email') || lower.includes('mail') || lower.includes('send') || lower.includes('draft') || lower.includes('composio')) {
      return `✉️ /composio: ${cleanTitle}`;
    } else if (lower.includes('notion') || lower.includes('doc') || lower.includes('file') || lower.includes('summarize') || lower.includes('pdf')) {
      return `📁 /doc_analysis: ${cleanTitle}`;
    } else if (lower.includes('contract') || lower.includes('legal') || lower.includes('agreement')) {
      return `⚖️ /legal_bot: ${cleanTitle}`;
    } else if (lower.includes('image') || lower.includes('draw') || lower.includes('photo') || lower.includes('generation')) {
      return `🎨 /image_gen: ${cleanTitle}`;
    }
    return `⚡ ${cleanTitle}`;
  };

  const observerRef = useRef<HTMLDivElement | null>(null);

  const rawConversations: Conversation[] =
    data?.pages.flatMap(p => p.conversations) ?? [];
  const conversations = Array.from(
    new Map(rawConversations.map(chat => [chat._id, chat])).values(),
  );

  // Search filter only — tab filtering is done server-side via isDeepSearch
  const filteredConversations = searchQuery
    ? conversations.filter(chat => chat.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    : conversations;

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    const currentObserver = observerRef.current;
    if (currentObserver) observer.observe(currentObserver);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleConversationClick = (id: string) => {
    close();
    setSelectedOption(null);
    setShowStartLastMessage(false);
    setUserMessage('');
    if (activeTab === 'assistant') {
      router.push(`/assistant?c=${id}`);
    } else {
      router.push(`/c/${id}`);
    }
  };

  if (!canFetchConversations) {
    return null;
  }

  if (status === 'pending') {
    return (
      <div className="flex items-center justify-center p-3 text-center text-sm text-gray-500">
        <LoaderCircle className="mr-2 animate-spin text-gray-500" /> Loading
        chats...
      </div>
    );
  }

  return (
    <div
      className="mt-2 h-[calc(100vh-60px)] overflow-y-auto"
      style={{ backgroundColor: '#F2F3F5' }}
    >
      {filteredConversations.length === 0 && status === 'success' && (
        <div className="mt-6 flex flex-col items-center gap-1 px-2 text-center">
          <p className="text-xs text-gray-400">
            {activeTab === 'research'
              ? 'No research sessions yet. Switch to Research mode in the prompt bar to get started.'
              : 'No conversations yet. Start a new chat!'}
          </p>
        </div>
      )}
      {filteredConversations.map(chat => (
        <div
          className="group flex h-9 w-full items-center justify-between rounded-md text-sm font-medium text-black hover:bg-black/5"
          key={chat._id}
        >
          <span
            className="flex-1 cursor-pointer truncate px-1 py-2 text-xs font-semibold"
            onClick={() => handleConversationClick(chat.conversationId)}
          >
            {getDisplayTitle(chat.title)}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:outline-none">
              <EllipsisVertical className="mr-2 rotate-90 text-black opacity-100 md:opacity-0 md:group-hover:opacity-100" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl">
              <DropdownMenuItem onSelect={e => e.preventDefault()}>
                <SaveConversation conversationId={chat.conversationId} />
              </DropdownMenuItem>

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
                    actionId: chat.conversationId,
                    title: formatConversationTitle(chat.title),
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
              >
                <Trash2 className="text-black" />
                <span className="text-black">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}

      {hasNextPage && (
        <div
          ref={observerRef}
          className="py-3 text-center text-sm text-gray-500"
        >
          {isFetchingNextPage && (
            <div className="flex items-center justify-center">
              <LoaderCircle className="mr-2 animate-spin text-gray-500" />{' '}
              Loading …
            </div>
          )}
        </div>
      )}
    </div>
  );
}
