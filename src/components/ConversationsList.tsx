'use client';

// Note: Tenant filtering for conversations will be implemented in Phase 6
// Currently displays all user conversations regardless of tenant context
// Phase 6 will add X-Tenant-Id headers to API calls and backend filtering

import { Conversation } from '@/actions/conversationsAction';
import { useConversations } from '@/hooks/useConversations';
import { cn, formatConversationTitle } from '@/lib/utils';
import { OPTIONS } from '@/types/conversation';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useDrawerStore } from '@/stores/useDrawerStore';
import { useModalStore } from '@/stores/useModalStore';
import {
  EllipsisVertical,
  LoaderCircle,
  Pencil,
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
  PenTool,
  ClipboardCheck,
  Music,
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
  activeTab?: 'chat' | 'search' | 'write' | 'research' | 'assistant' | 'code' | 'image' | 'audio' | 'video' | 'media' | 'studio';
}) {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { close } = useDrawerStore();
  const { onOpen } = useModalStore();
  const { activeConversation, selectedOption, setSelectedOption, setShowStartLastMessage, setUserMessage } =
    useConversationsStore();

  const canFetchConversations =
    sessionStatus === 'authenticated' &&
    !!session?.accessToken &&
    !session.isTokenExpired;

  // isDeepSearch drives server-side filtering: each tab hits its own API query
  const isDeepSearch = activeTab === 'research' ? true : undefined;

  let category: string | undefined = undefined;
  if (activeTab === 'research') {
    category = 'deep_research';
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
    category = 'assistant';
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useConversations(
      canFetchConversations ? session.accessToken : undefined,
      isDeepSearch,
      category,
    );

  const getDisplayIcon = (chat: Conversation) => {
    const isActive = activeConversation && chat.conversationId === (activeConversation as any).conversationId;
    const iconColorClass = isActive 
      ? "h-3.5 w-3.5 text-indigo-400 flex-shrink-0" 
      : "h-3.5 w-3.5 text-zinc-450 flex-shrink-0 group-hover:text-indigo-300 transition-colors";
    
    const title = chat.title || '';
    const cleanTitle = formatConversationTitle(title);
    const lower = cleanTitle.toLowerCase();

    // If activeTab is studio, map to Code, Image, Video, Audio
    if (activeTab === 'studio') {
      if (lower.includes('image') || lower.includes('art') || lower.includes('draw') || lower.includes('logo') || lower.includes('paint') || lower.includes('picture') || lower.includes('photo') || lower.includes('canvas')) {
        return <ImageIcon className={iconColorClass} />;
      }
      if (lower.includes('video') || lower.includes('movie') || lower.includes('clip') || lower.includes('animate') || lower.includes('mp4')) {
        return <VideoIcon className={iconColorClass} />;
      }
      if (lower.includes('audio') || lower.includes('voice') || lower.includes('music') || lower.includes('sound') || lower.includes('transcribe') || lower.includes('speech') || lower.includes('mp3')) {
        return <Music className={iconColorClass} />;
      }
      return <Code2 className={iconColorClass} />;
    }

    // If activeTab is search (AI), map to Chat, Research, Write, Review
    if (activeTab === 'search') {
      if (lower.includes('search') || lower.includes('google') || lower.includes('web') || lower.includes('research') || lower.includes('find') || lower.includes('query')) {
        return <Search className={iconColorClass} />;
      }
      if (lower.includes('write') || lower.includes('draft') || lower.includes('email') || lower.includes('article') || lower.includes('copy') || lower.includes('text') || lower.includes('essay')) {
        return <PenTool className={iconColorClass} />;
      }
      if (lower.includes('review') || lower.includes('contract') || lower.includes('check') || lower.includes('audit') || lower.includes('guardrail')) {
        return <ClipboardCheck className={iconColorClass} />;
      }
      return <MessageSquare className={iconColorClass} />;
    }

    // Default fallbacks for other tabs
    if (isActive) {
      if (selectedOption === OPTIONS.RESEARCH) {
        return <Microscope className={iconColorClass} />;
      } else if (selectedOption === OPTIONS.CODE || selectedOption === OPTIONS.DEBUG_CODE) {
        return <Code2 className={iconColorClass} />;
      } else if (selectedOption === OPTIONS.IMAGE || selectedOption === OPTIONS.EDIT_IMAGE) {
        return <ImageIcon className={iconColorClass} />;
      } else if (selectedOption === OPTIONS.AUDIO) {
        return <Volume2 className={iconColorClass} />;
      } else if (selectedOption === OPTIONS.VIDEO) {
        return <VideoIcon className={iconColorClass} />;
      } else if (
        selectedOption === OPTIONS.DRAFT_DOCUMENT ||
        selectedOption === OPTIONS.REWRITE ||
        selectedOption === OPTIONS.SUMMARIZE ||
        selectedOption === OPTIONS.TRANSLATE_DOCUMENTS ||
        selectedOption === OPTIONS.REVIEW_DOCUMENTS ||
        selectedOption === OPTIONS.CREATIVE_WRITING ||
        selectedOption === OPTIONS.ARTICLE ||
        selectedOption === OPTIONS.WRITE_CONTRACT ||
        selectedOption === OPTIONS.REVIEW_CONTRACT ||
        selectedOption === OPTIONS.GENERATE_REPORT ||
        selectedOption === OPTIONS.GENERATE_PLAN ||
        selectedOption === OPTIONS.BRAINSTORM
      ) {
        return <FileText className={iconColorClass} />;
      } else if (selectedOption) {
        return <Sparkles className={iconColorClass} />;
      } else {
        return <MessageSquare className={iconColorClass} />;
      }
    }

    if (lower.includes('search') || lower.includes('google') || lower.includes('web')) {
      return <Search className={iconColorClass} />;
    } else if (lower.includes('code') || lower.includes('write') || lower.includes('debug') || lower.includes('python') || lower.includes('rust') || lower.includes('go')) {
      return <Code2 className={iconColorClass} />;
    } else if (lower.includes('email') || lower.includes('mail') || lower.includes('send') || lower.includes('draft')) {
      return <Mail className={iconColorClass} />;
    } else if (lower.includes('notion') || lower.includes('doc') || lower.includes('file') || lower.includes('summarize') || lower.includes('pdf')) {
      return <FileText className={iconColorClass} />;
    } else if (lower.includes('contract') || lower.includes('legal') || lower.includes('agreement')) {
      return <Scale className={iconColorClass} />;
    } else if (lower.includes('image') || lower.includes('draw') || lower.includes('photo') || lower.includes('generation')) {
      return <Palette className={iconColorClass} />;
    }
    return <MessageSquare className={iconColorClass} />;
  };

  const getDisplayTitle = (title: string) => {
    const cleanTitle = formatConversationTitle(title);
    if (activeTab !== 'assistant') return cleanTitle;

    const lower = cleanTitle.toLowerCase();
    if (lower.includes('search') || lower.includes('google') || lower.includes('web')) {
      return `/web_search: ${cleanTitle}`;
    } else if (lower.includes('code') || lower.includes('write') || lower.includes('debug') || lower.includes('python') || lower.includes('rust') || lower.includes('go')) {
      return `/code_gen: ${cleanTitle}`;
    } else if (lower.includes('email') || lower.includes('mail') || lower.includes('send') || lower.includes('draft')) {
      return `/email: ${cleanTitle}`;
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
  ).filter(chat => {
    if (!chat.title) return true;
    const clean = formatConversationTitle(chat.title);
    if (clean === 'Previous Conversation') return false;
    if (/^[0-9a-f]{32}:[0-9a-f]+$/i.test(clean)) return false;
    return true;
  });

  // Partition threads client-side between AI (search) and Studio categories
  const filteredConversations = conversations.filter(chat => {
    // Search filter
    if (searchQuery && !chat.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Partition
    const title = chat.title || '';
    const lower = title.toLowerCase();
    const isStudio = (
      lower.includes('code') ||
      lower.includes('debug') ||
      lower.includes('python') ||
      lower.includes('rust') ||
      lower.includes('js') ||
      lower.includes('ts') ||
      lower.includes('html') ||
      lower.includes('css') ||
      lower.includes('image') ||
      lower.includes('art') ||
      lower.includes('draw') ||
      lower.includes('logo') ||
      lower.includes('paint') ||
      lower.includes('picture') ||
      lower.includes('photo') ||
      lower.includes('canvas') ||
      lower.includes('video') ||
      lower.includes('movie') ||
      lower.includes('clip') ||
      lower.includes('animate') ||
      lower.includes('mp4') ||
      lower.includes('audio') ||
      lower.includes('voice') ||
      lower.includes('music') ||
      lower.includes('sound') ||
      lower.includes('transcribe') ||
      lower.includes('speech') ||
      lower.includes('mp3')
    );

    if (activeTab === 'studio') return isStudio;
    if (activeTab === 'search') return !isStudio;

    return true;
  });

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
    } else if (activeTab === 'studio') {
      router.push(`/studio?c=${id}`);
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
    <div className="space-y-1.5">
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
      {filteredConversations.map(chat => {
        const isActive = activeConversation && chat.conversationId === (activeConversation as any).conversationId;
        return (
          <div
            className={cn(
              "group flex h-9 w-full items-center justify-between rounded-lg text-xs font-normal text-left transition-all duration-150 border mb-1.5 cursor-pointer select-none",
              isActive
                ? "bg-indigo-500/15 border-indigo-500/35 text-indigo-400 font-semibold shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                : "bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-indigo-500/10 hover:border-indigo-500/15 hover:text-indigo-300 hover:shadow-[0_0_10px_rgba(99,102,241,0.1)]"
            )}
            key={chat._id}
          >
            <span
              className="flex-1 cursor-pointer truncate px-3 py-2 flex items-center gap-2.5"
              onClick={() => handleConversationClick(chat.conversationId)}
            >
              {getDisplayIcon(chat)}
              <span className="truncate">{getDisplayTitle(chat.title)}</span>
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger className="focus-visible:outline-none">
                <EllipsisVertical className={cn(
                  "mr-2 rotate-90 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-colors",
                  isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-100"
                )} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl">
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
        );
      })}

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
