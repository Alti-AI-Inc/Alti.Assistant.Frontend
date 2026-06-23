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
  MessageSquare,
  Search,
  Code2,
  Mail,
  FileText,
  Scale,
  Palette,
  Sparkles,
  Image as ImageIcon,
  Video as VideoIcon,
  Volume2,
  Zap,
  Microscope,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
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
  activeTab?: 'chat' | 'search' | 'write' | 'research' | 'assistant' | 'code' | 'image' | 'audio' | 'video' | 'media';
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

  let category: string | undefined = undefined;
  if (activeTab === 'search') {
    category = 'search';
  } else if (activeTab === 'write') {
    category = 'article_writer,document_drafting,creative_writing,rewrite,translation,document_analysis,document_review,report,plan_generation,legal_contract,legal_contract_review,presentation,brainstorm';
  } else if (activeTab === 'code') {
    category = 'code';
  } else if (activeTab === 'image') {
    category = 'image,image_generation,image_editing,image_intent_analysis,intent_analysis';
  } else if (activeTab === 'audio') {
    category = 'audio';
  } else if (activeTab === 'video') {
    category = 'video';
  } else if (activeTab === 'media') {
    category = 'image,image_generation,image_editing,image_intent_analysis,intent_analysis,video';
  } else if (activeTab === 'assistant') {
    category = 'assistant,composio,composio_simple';
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useConversations(
      canFetchConversations ? session.accessToken : undefined,
      isDeepSearch,
      category,
    );

  const getDisplayIcon = (title: string) => {
    if (activeTab === 'chat' || activeTab === 'search') {
      return <MessageSquare className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />;
    }
    if (activeTab === 'research') {
      return <Microscope className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />;
    }
    if (activeTab === 'write') {
      return <FileText className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />;
    }
    if (activeTab === 'code') {
      return <Code2 className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />;
    }
    if (activeTab === 'image') {
      return <ImageIcon className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />;
    }
    if (activeTab === 'audio') {
      return <Volume2 className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />;
    }
    if (activeTab === 'video') {
      return <VideoIcon className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />;
    }
    if (activeTab !== 'assistant') {
      return <MessageSquare className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />;
    }

    const cleanTitle = formatConversationTitle(title);
    const lower = cleanTitle.toLowerCase();

    if (lower.includes('search') || lower.includes('google') || lower.includes('web')) {
      return <Search className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />;
    } else if (lower.includes('code') || lower.includes('write') || lower.includes('debug') || lower.includes('python') || lower.includes('rust') || lower.includes('go')) {
      return <Code2 className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />;
    } else if (lower.includes('email') || lower.includes('mail') || lower.includes('send') || lower.includes('draft') || lower.includes('composio')) {
      return <Mail className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />;
    } else if (lower.includes('notion') || lower.includes('doc') || lower.includes('file') || lower.includes('summarize') || lower.includes('pdf')) {
      return <FileText className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />;
    } else if (lower.includes('contract') || lower.includes('legal') || lower.includes('agreement')) {
      return <Scale className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />;
    } else if (lower.includes('image') || lower.includes('draw') || lower.includes('photo') || lower.includes('generation')) {
      return <Palette className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />;
    }
    return <Zap className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />;
  };

  const getDisplayTitle = (title: string) => {
    const cleanTitle = formatConversationTitle(title);
    if (activeTab !== 'assistant') return cleanTitle;

    const lower = cleanTitle.toLowerCase();
    if (lower.includes('search') || lower.includes('google') || lower.includes('web')) {
      return `/web_search: ${cleanTitle}`;
    } else if (lower.includes('code') || lower.includes('write') || lower.includes('debug') || lower.includes('python') || lower.includes('rust') || lower.includes('go')) {
      return `/code_gen: ${cleanTitle}`;
    } else if (lower.includes('email') || lower.includes('mail') || lower.includes('send') || lower.includes('draft') || lower.includes('composio')) {
      return `/composio: ${cleanTitle}`;
    } else if (lower.includes('notion') || lower.includes('doc') || lower.includes('file') || lower.includes('summarize') || lower.includes('pdf')) {
      return `/doc_analysis: ${cleanTitle}`;
    } else if (lower.includes('contract') || lower.includes('legal') || lower.includes('agreement')) {
      return `/legal_bot: ${cleanTitle}`;
    } else if (lower.includes('image') || lower.includes('draw') || lower.includes('photo') || lower.includes('generation')) {
      return `/image_gen: ${cleanTitle}`;
    }
    return cleanTitle;
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
    <div className="mt-2 space-y-1 py-1 pb-4">
      {filteredConversations.length === 0 && status === 'success' && (
        <div className="mt-6 flex flex-col items-center gap-1 px-2 text-center">
          <p className="text-xs text-gray-400">
            {activeTab === 'research'
              ? 'No research sessions yet. Switch to Research mode in the prompt bar to get started.'
              : activeTab === 'write' || activeTab === 'code'
                ? 'No documents yet. Start a new writing/code task!'
                : 'No conversations yet. Start a new chat!'}
          </p>
        </div>
      )}
      {filteredConversations.map(chat => (
        <div
          className="group flex h-9 w-full items-center justify-between rounded-md text-xs font-normal text-black hover:bg-black/5"
          key={chat._id}
        >
          <span
            className="flex-1 cursor-pointer truncate px-3 py-2 text-xs font-normal flex items-center gap-2.5"
            onClick={() => handleConversationClick(chat.conversationId)}
          >
            {getDisplayIcon(chat.title)}
            <span className="truncate">{getDisplayTitle(chat.title)}</span>
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:outline-none">
              <EllipsisVertical className="mr-2 rotate-90 text-black opacity-100 md:opacity-0 md:group-hover:opacity-100" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl">
              <DropdownMenuItem
                onClick={() => {
                  setTimeout(() => {
                    onOpen({
                      type: 'share-conversation',
                      actionId: chat._id,
                    });
                  }, 0);
                }}
              >
                <Share className="text-black" /> Share
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setTimeout(() => {
                    onOpen({
                      type: 'rename-chat',
                      actionId: chat.conversationId,
                      title: formatConversationTitle(chat.title),
                    });
                  }, 0);
                }}
              >
                <Pencil className="text-black" /> Rename
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  setTimeout(() => {
                    onOpen({
                      type: 'delete-conversation',
                      actionId: chat._id,
                    });
                  }, 0);
                }}
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
