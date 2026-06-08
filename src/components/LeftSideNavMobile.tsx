'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTenant } from '@/contexts/TenantContext';
import { cn } from '@/lib/utils';
import { OPTIONS, useConversationsStore } from '@/stores/useConverstionsStore';
import { useDrawerStore } from '@/stores/useDrawerStore';
import { useModalStore } from '@/stores/useModalStore';
import {
  Building2,
  Brain,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Scale,
  Search,
  Settings,
  SquarePen,
  User,
  UserPlus,
  UsersRound,
  Users,
  ChevronRight,
  Plus,
  MessageSquare,
  Globe,
  Folder,
  Database,
  LayoutGrid,
  Zap,
  Upload,
  Cpu,
  Sparkles,
  EllipsisVertical,
  Shield,
  FileText,
  CreditCard,
  ArrowLeft,
  Inbox,
  UserCheck,
  KeyRound,
  Mail,
  Key,
  Cloud,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Compass,
  Code2,
  ImageIcon,
  Clapperboard,
  ShieldAlert,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import ConversationsList from './ConversationsList';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { allApps, APP } from '@/lib/all-apps';
import AppImage from './AppImage';
import { apiClientJson, buildApiUrl } from '@/lib/api-client';
import { useBotsStore } from '@/stores/useBotsStore';
import { useConnectionsQuery } from '@/hooks/useConnectApps';
import { useInboxQuery } from '@/hooks/useInbox';

interface DataConnector {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: 'active' | 'soon';
}

const DATA_CONNECTORS: DataConnector[] = [
  {
    id: 'file',
    name: 'File Upload',
    icon: '📁',
    description: 'Upload PDF, TXT, Word up to 100GB',
    status: 'active',
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    icon: '🤖',
    description: 'Sync Google Drive folders',
    status: 'soon',
  },
  {
    id: 'notion',
    name: 'Notion Workspace',
    icon: '📓',
    description: 'Index Notion pages & databases',
    status: 'soon',
  },
  {
    id: 'sharepoint',
    name: 'SharePoint',
    icon: '📦',
    description: 'Ingest enterprise documents',
    status: 'soon',
  },
  {
    id: 'slack',
    name: 'Slack Channel',
    icon: '💬',
    description: 'Index conversation histories',
    status: 'soon',
  },
  {
    id: 'github',
    name: 'GitHub Repo',
    icon: '🐙',
    description: 'Parse codebase markdown files',
    status: 'soon',
  },
  {
    id: 'confluence',
    name: 'Confluence',
    icon: '📄',
    description: 'Sync Confluence wiki pages',
    status: 'soon',
  },
  {
    id: 'dropbox',
    name: 'Dropbox Folder',
    icon: '📦',
    description: 'Import Dropbox directories',
    status: 'soon',
  },
  {
    id: 's3',
    name: 'AWS S3 Bucket',
    icon: '☁️',
    description: 'Index S3 storage buckets',
    status: 'soon',
  },
];

type SidebarTab = 'chat' | 'text' | 'media' | 'bots' | 'assistant' | 'apps' | 'workflows' | 'inbox' | 'none' | 'account';

const AVAILABLE_COMPOSIO_APPS = (() => {
  const uniqueMap = new Map<string, APP>();
  allApps.forEach(app => {
    if (app.isAvailable && app.app_name) {
      const slug = app.app_name.toLowerCase();
      if (!uniqueMap.has(slug)) {
        uniqueMap.set(slug, app);
      }
    }
  });
  return Array.from(uniqueMap.values())
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
})();

const LeftSideNavMobile = () => {
  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { close } = useDrawerStore();
  const { mode, currentTenant } = useTenant();

  const isAdminMode = pathname.startsWith('/admin');
  const isManagerSection = pathname.startsWith('/admin/data') || 
                           pathname.startsWith('/admin/instructions') || 
                           pathname.startsWith('/admin/guardrails') || 
                           pathname.startsWith('/admin/projects') ||
                           pathname.startsWith('/admin/platform-manager');
  const isAdminSection = !isManagerSection && isAdminMode;

  const userEmail = data?.user?.email?.toLowerCase();
  const isGlobalAdmin = data?.user?.role === 'admin' || data?.user?.role === 'super_admin';
  const isTenantOwner = mode === 'tenant' && currentTenant?.role === 'admin';
  const isTenantAdmin = mode === 'tenant' && currentTenant?.role === 'manager';

  const isAdmin = userEmail === 'admin@altihq.com' || isGlobalAdmin || isTenantOwner;
  const isManager = isGlobalAdmin || isTenantOwner || isTenantAdmin;
  const isSuperAdmin = data?.user?.role === 'super_admin';

  const { onOpen } = useModalStore();
  const {
    activeConversation,
    selectedOption,
    setActiveConversation,
    setSelectedOption,
    setShowStartLastMessage,
    setUserMessage,
  } = useConversationsStore();

  const isLoggedIn = data?.accessToken;
  const { bots, activeBotId, setActiveBotId, projectTab, setProjectTab } = useBotsStore();
  
  const { data: inboxItems = [] } = useInboxQuery(
    data?.user?.id,
    undefined,
    false,
    data?.accessToken
  );
  
  const unreadInboxCount = inboxItems.filter(item => !item.isRead).length;

  const [activeTab, setActiveTab] = useState<SidebarTab>('chat');



  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const activeAppSlug = searchParams?.get('app');
  const activeConnectorId = searchParams?.get('connector') || 'file';

  const [connectedAppSlugs, setConnectedAppSlugs] = useState<Set<string>>(new Set());

  const { data: connections } = useConnectionsQuery(
    data?.accessToken,
  );

  useEffect(() => {
    if (connections) {
      const activeSlugs = new Set(
        connections.map(account => account.toolkit?.slug?.toLowerCase()).filter(Boolean)
      );
      setConnectedAppSlugs(activeSlugs);
    }
  }, [connections]);

  const filteredApps = useMemo(() => {
    return AVAILABLE_COMPOSIO_APPS.filter(app =>
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const displayedApps = useMemo(() => {
    if (searchQuery.trim() !== '') {
      return filteredApps;
    }
    const connected = AVAILABLE_COMPOSIO_APPS.filter(app => connectedAppSlugs.has(app.app_name.toLowerCase()));
    const nonConnected = AVAILABLE_COMPOSIO_APPS.filter(app => !connectedAppSlugs.has(app.app_name.toLowerCase()));
    return [...connected, ...nonConnected];
  }, [searchQuery, filteredApps, connectedAppSlugs]);

  useEffect(() => {
    if (isSuperAdmin) {
      setActiveTab('account');
      return;
    }
    if (pathname === '/apps') {
      setActiveTab('apps');
    } else if (pathname === '/my-chatbots' || pathname.startsWith('/my-chatbots')) {
      setActiveTab('bots');
    } else if (pathname === '/workflows' || pathname.startsWith('/workflows')) {
      setActiveTab('workflows');
    } else if (pathname === '/assistant' || pathname.startsWith('/assistant')) {
      setActiveTab('assistant');
    } else if (pathname === '/inbox' || pathname.startsWith('/inbox')) {
      setActiveTab('inbox');
    } else if (pathname === '/' || pathname.startsWith('/c/')) {
      if (selectedOption === OPTIONS.RESEARCH || !selectedOption) {
        setActiveTab('chat');
      } else if (
        selectedOption === OPTIONS.CODE ||
        selectedOption === OPTIONS.DRAFT_DOCUMENT ||
        selectedOption === OPTIONS.REWRITE ||
        selectedOption === OPTIONS.TRANSLATE_DOCUMENTS ||
        selectedOption === OPTIONS.BRAINSTORM ||
        selectedOption === OPTIONS.GENERATE_PLAN ||
        selectedOption === OPTIONS.REVIEW_CONTRACT ||
        selectedOption === OPTIONS.GENERATE_REPORT
      ) {
        setActiveTab('text');
      } else if (
        selectedOption === OPTIONS.IMAGE ||
        selectedOption === OPTIONS.EDIT_IMAGE ||
        selectedOption === OPTIONS.VIDEO
      ) {
        setActiveTab('media');
      } else {
        setActiveTab('chat');
      }
    } else if (pathname.startsWith('/instructions') || 
               pathname.startsWith('/guardrails') || 
               pathname.startsWith('/platform-knowledge') || 
               pathname.startsWith('/legal') || 
               pathname.startsWith('/admin') ||
               pathname.startsWith('/platform-memory') ||
               pathname.startsWith('/change-password') ||
               pathname.startsWith('/contact-support') ||
               pathname.startsWith('/invite-friends')) {
      setActiveTab('account');
    } else if (pathname.startsWith('/knowledge')) {
      setActiveTab('none');
    }
  }, [pathname, selectedOption]);

  // Synchronize tab and option selection with activeConversation.is_deep_search
  useEffect(() => {
    if (isSuperAdmin) return;
    if (activeConversation) {
      const isDeepSearch = !!((activeConversation as any).is_deep_search);
      if (isDeepSearch) {
        setActiveTab('chat');
        if (selectedOption !== OPTIONS.RESEARCH) {
          setSelectedOption(OPTIONS.RESEARCH);
        }
      } else {
        // Only set to search if not on the bots page or apps page or data page or assistant/workflows
        if (
          pathname !== '/my-chatbots' &&
          !pathname.startsWith('/my-chatbots') &&
          pathname !== '/apps' &&
          pathname !== '/workflows' &&
          pathname !== '/assistant' &&
          !pathname.startsWith('/assistant') &&
          pathname !== '/knowledge' &&
          !pathname.startsWith('/knowledge') &&
          pathname !== '/instructions' &&
          !pathname.startsWith('/instructions') &&
          pathname !== '/guardrails' &&
          !pathname.startsWith('/guardrails') &&
          pathname !== '/platform-knowledge' &&
          !pathname.startsWith('/platform-knowledge') &&
          pathname !== '/legal' &&
          !pathname.startsWith('/legal') &&
          !pathname.startsWith('/admin') &&
          pathname !== '/platform-memory' &&
          !pathname.startsWith('/platform-memory') &&
          pathname !== '/change-password' &&
          !pathname.startsWith('/change-password') &&
          pathname !== '/contact-support' &&
          !pathname.startsWith('/contact-support') &&
          pathname !== '/invite-friends' &&
          !pathname.startsWith('/invite-friends')
        ) {
          const opt = (activeConversation as any).option || selectedOption;
          if (
            opt === OPTIONS.DRAFT_DOCUMENT ||
            opt === OPTIONS.REWRITE ||
            opt === OPTIONS.TRANSLATE_DOCUMENTS ||
            opt === OPTIONS.BRAINSTORM ||
            opt === OPTIONS.GENERATE_PLAN ||
            opt === OPTIONS.REVIEW_CONTRACT ||
            opt === OPTIONS.GENERATE_REPORT ||
            opt === OPTIONS.CODE
          ) {
            setActiveTab('text');
          } else if (
            opt === OPTIONS.IMAGE ||
            opt === OPTIONS.EDIT_IMAGE ||
            opt === OPTIONS.VIDEO
          ) {
            setActiveTab('media');
          } else if (opt === OPTIONS.RESEARCH) {
            setActiveTab('chat');
          } else {
            setActiveTab('chat');
          }

          if (selectedOption === OPTIONS.RESEARCH && !isDeepSearch) {
            setSelectedOption(null);
          }
        }
      }
    }
  }, [activeConversation, selectedOption, setSelectedOption, pathname]);

  const handleTabChange = (tab: SidebarTab) => {
    setActiveTab(tab);
    if (tab === 'apps') {
      router.push('/apps');
      close();
    } else if (tab === 'bots') {
      router.push('/my-chatbots');
      close();
    } else if (tab === 'workflows') {
      router.push('/workflows');
      close();
    } else if (tab === 'assistant') {
      router.push('/assistant');
      close();
    } else if (tab === 'inbox') {
      router.push('/inbox');
      close();
    } else if (tab === 'chat') {
      if (selectedOption !== OPTIONS.RESEARCH) {
        setSelectedOption(null);
      }
      if (pathname !== '/' && !pathname.startsWith('/c/')) {
        router.push('/');
      }
      close();
    } else if (tab === 'text') {
      if (
        selectedOption !== OPTIONS.CODE &&
        selectedOption !== OPTIONS.DRAFT_DOCUMENT &&
        selectedOption !== OPTIONS.REWRITE &&
        selectedOption !== OPTIONS.TRANSLATE_DOCUMENTS &&
        selectedOption !== OPTIONS.BRAINSTORM &&
        selectedOption !== OPTIONS.GENERATE_PLAN &&
        selectedOption !== OPTIONS.REVIEW_CONTRACT &&
        selectedOption !== OPTIONS.GENERATE_REPORT
      ) {
        setSelectedOption(OPTIONS.DRAFT_DOCUMENT);
      }
      if (pathname !== '/' && !pathname.startsWith('/c/')) {
        router.push('/');
      }
      close();
    } else if (tab === 'media') {
      if (
        selectedOption !== OPTIONS.IMAGE &&
        selectedOption !== OPTIONS.EDIT_IMAGE &&
        selectedOption !== OPTIONS.VIDEO
      ) {
        setSelectedOption(OPTIONS.IMAGE);
      }
      if (pathname !== '/' && !pathname.startsWith('/c/')) {
        router.push('/');
      }
      close();
    } else {
      setSelectedOption(null);
      if (pathname !== '/' && !pathname.startsWith('/c/')) {
        router.push('/');
      }
      close();
    }
  };

  const getPlusButtonProps = () => {
    switch (activeTab) {
      case 'chat':
        const isResearchMode = selectedOption === OPTIONS.RESEARCH;
        return {
          visible: true,
          label: isResearchMode ? 'New Research' : 'New Search',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(isResearchMode ? OPTIONS.RESEARCH : null);
            router.push('/');
            close();
          },
        };
      case 'text':
        const isCodeMode = selectedOption === OPTIONS.CODE;
        return {
          visible: true,
          label: isCodeMode ? 'New Code' : 'New Document',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(isCodeMode ? OPTIONS.CODE : OPTIONS.DRAFT_DOCUMENT);
            router.push('/');
            close();
          },
        };
      case 'media':
        const isVideoMode = selectedOption === OPTIONS.VIDEO;
        return {
          visible: true,
          label: isVideoMode ? 'New Video' : 'New Image',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(isVideoMode ? OPTIONS.VIDEO : OPTIONS.IMAGE);
            router.push('/');
            close();
          },
        };
      case 'bots':
        return {
          visible: projectTab === 'my',
          label: 'New Space',
          onClick: () => {
            setActiveBotId(null);
            router.push('/my-chatbots');
            close();
          },
        };
      case 'workflows':
        return {
          visible: true,
          label: 'New Flow',
          onClick: () => {
            alert('Define Cron or Webhook triggers to chain your custom agents and RAG indexes in a new workflow!');
            close();
          },
        };
      case 'assistant':
        return {
          visible: true,
          label: 'New Task',
          onClick: () => {
            setActiveBotId(null);
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(null);
            router.push('/assistant');
            close();
          },
        };
      case 'apps':
      default:
        return {
          visible: false,
          label: '',
          onClick: () => {},
        };
    }
  };

  const plusProps = getPlusButtonProps();

  return (
    <div className="bg-white dark:bg-zinc-900 flex h-full flex-col">
      {/* Sticky nav buttons */}
      <div className="bg-white dark:bg-zinc-900 sticky top-0 z-10">
        <div className="space-y-0.5 px-2 py-2">
          {plusProps.visible && (
            <Button
              onClick={plusProps.onClick}
              className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5 animate-in fade-in zoom-in duration-200"
            >
              <Plus className="size-4 mr-2 text-black" />
              <span className="text-sm font-normal">{plusProps.label}</span>
            </Button>
          )}

          {isLoggedIn && !isSuperAdmin && (
            <>
              {/* <Button
                disabled={pathname === '/workspaces'}
                onClick={() => {
                  setActiveConversation(null);
                  setShowStartLastMessage(false);
                  setUserMessage('');
                  setSelectedOption(null);
                  if (pathname !== '/workspaces') router.push('/workspaces');
                  close();
                }}
                className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5 disabled:opacity-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-vector-square-icon lucide-vector-square"
                >
                  <path d="M19.5 7a24 24 0 0 1 0 10" />
                  <path d="M4.5 7a24 24 0 0 0 0 10" />
                  <path d="M7 19.5a24 24 0 0 0 10 0" />
                  <path d="M7 4.5a24 24 0 0 1 10 0" />
                  <rect x="17" y="17" width="5" height="5" rx="1" />
                  <rect x="17" y="2" width="5" height="5" rx="1" />
                  <rect x="2" y="17" width="5" height="5" rx="1" />
                  <rect x="2" y="2" width="5" height="5" rx="1" />
                </svg>
                <span className="text-sm font-normal">Spaces</span>
              </Button> */}

              <Button
                disabled={pathname === '/inbox'}
                onClick={() => {
                  setActiveConversation(null);
                  setShowStartLastMessage(false);
                  setUserMessage('');
                  setSelectedOption(null);
                  if (pathname !== '/inbox') router.push('/inbox');
                  close();
                }}
                className="relative flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5 disabled:opacity-100"
              >
                <Inbox className="size-4 mr-2 text-black" />
                <span className="text-sm font-normal">Inbox</span>
                {unreadInboxCount > 0 && (
                  <span className="absolute right-4 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white animate-pulse">
                    {unreadInboxCount}
                  </span>
                )}
              </Button>

              <Button
                disabled={pathname === '/apps'}
                onClick={() => {
                  setActiveConversation(null);
                  setShowStartLastMessage(false);
                  setUserMessage('');
                  setSelectedOption(null);
                  if (pathname !== '/apps') router.push('/apps');
                  close();
                }}
                className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5 disabled:opacity-100"
              >
                <LayoutGrid className="size-4 mr-2 text-black" />
                <span className="text-sm font-normal">Apps</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Chat / Projects / GCP Hub row toggle */}
      {isLoggedIn && !isSuperAdmin && (
        <div className="border-b border-black/5 px-4 py-2 bg-white dark:bg-zinc-900">
          <div className="flex bg-black/[0.04] dark:bg-white/[0.04] p-1 rounded-xl w-full justify-between items-center gap-1 border border-black/[0.03] dark:border-white/[0.03]">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTabChange('chat')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                    activeTab === 'chat'
                      ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                  )}
                >
                  <MessageSquare className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Chat</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTabChange('text')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                    activeTab === 'text'
                      ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                  )}
                >
                  <FileText className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Text</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTabChange('media')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                    activeTab === 'media'
                      ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                  )}
                >
                  <ImageIcon className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Media</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTabChange('bots')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                    activeTab === 'bots'
                      ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                  )}
                >
                  <LayoutGrid className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Spaces</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTabChange('assistant')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                    activeTab === 'assistant' || activeTab === 'workflows'
                      ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                  )}
                >
                  <Zap className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Actions</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Scrollable conversation list */}
      {isLoggedIn && (
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {activeTab !== 'account' && (
          <div className="mt-3 mb-2 flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-zinc-400">
            </div>
            {activeTab === 'apps' ? (
              <div className="flex h-7 flex-1 items-center gap-1.5 rounded-lg border border-black/10 bg-[#F5F5F7] px-2 shadow-xs transition-all focus-within:ring-1 focus-within:ring-black/20 ml-4 max-w-[150px]">
                <Search className="size-3 text-black" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-[11px] text-black outline-none placeholder:text-gray-500"
                />
              </div>
            ) : activeTab === 'bots' ? null : (
              <Search
                onClick={() => {
                  onOpen({
                    type: 'search-chats',
                  });
                  close();
                }}
                className="size-3.5 cursor-pointer text-gray-500 hover:text-black transition-colors"
              />
            )}
          </div>
          )}
          {activeTab === 'bots' ? (
            <div className="space-y-1 py-1 pb-4 mt-2">
              <div className="flex p-0.5 bg-black/[0.04] dark:bg-white/[0.04] rounded-lg border border-black/5 dark:border-white/5 w-full mb-2 select-none">
                <button
                  type="button"
                  onClick={() => setProjectTab('my')}
                  className={cn(
                    "flex-1 py-1.5 px-3 text-[11px] font-normal rounded-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
                    projectTab === 'my'
                      ? "bg-white dark:bg-zinc-800 text-gray-950 dark:text-zinc-50 shadow-xs"
                      : "text-gray-500 hover:text-gray-950 dark:hover:text-zinc-300"
                  )}
                >
                  My Spaces
                </button>
                <button
                  type="button"
                  onClick={() => setProjectTab('team')}
                  className={cn(
                    "flex-1 py-1.5 px-3 text-[11px] font-normal rounded-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
                    projectTab === 'team'
                      ? "bg-white dark:bg-zinc-800 text-gray-950 dark:text-zinc-50 shadow-xs"
                      : "text-gray-500 hover:text-gray-950 dark:hover:text-zinc-300"
                  )}
                >
                  Team Spaces
                </button>
              </div>
              <div className="my-3 h-px bg-black/10 dark:bg-white/10 -mx-4" />

              {bots
                .filter(bot =>
                  (bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  bot.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
                  (projectTab === 'my' ? !bot.isShared : !!bot.isShared)
                )
                .map(bot => {
                  const isSelected = activeBotId === bot.id && pathname === '/my-chatbots';
                  return (
                    <div
                      key={bot.id}
                      className={cn(
                        "group flex h-9 w-full items-center justify-between rounded-md text-xs font-semibold text-black text-left transition-all",
                        isSelected 
                          ? "bg-black/10" 
                          : "hover:bg-black/5"
                      )}
                    >
                      <span
                        className="flex-1 cursor-pointer truncate px-3 py-2 flex items-center gap-2.5"
                        onClick={() => {
                          setActiveBotId(bot.id);
                          router.push(`/my-chatbots?bot=${bot.id}`);
                          close();
                        }}
                      >
                        <Folder className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
                        <span className="truncate">{bot.name}</span>
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="focus-visible:outline-none">
                          <EllipsisVertical className="mr-2 rotate-90 h-3.5 w-3.5 text-black transition-opacity" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-2xl">
                          <DropdownMenuItem
                            onClick={() => {
                              setActiveBotId(bot.id);
                              router.push(`/my-chatbots?bot=${bot.id}`);
                              close();
                            }}
                          >
                            <Folder className="text-black h-4 w-4 mr-2" /> Open
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })}
              {bots.filter(bot =>
                (bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bot.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
                (projectTab === 'my' ? !bot.isShared : !!bot.isShared)
              ).length === 0 && (
                <div className="py-4 text-center text-xs text-gray-500">
                  No spaces found.
                </div>
              )}
            </div>
          ) : activeTab === 'apps' ? (
            <div className="space-y-1 py-1 pb-4">
              {displayedApps.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-500">
                  No integrations found.
                </div>
              ) : (
                <>
                  {displayedApps.map(app => {
                    const isConnected = connectedAppSlugs.has(app.app_name.toLowerCase());
                    const isSelected = activeAppSlug?.toLowerCase() === app.app_name.toLowerCase();
                    
                    return (
                      <button
                        key={app.app_name}
                        onClick={() => {
                          router.push(`/apps?app=${app.app_name}`);
                          close();
                        }}
                        className={cn(
                          "w-full flex items-center justify-between rounded-lg p-2 transition-all text-left group",
                          isSelected 
                            ? "bg-black/[0.06] border border-black/10 shadow-xs" 
                            : "hover:bg-black/[0.03] border border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* App Logo with Fallback */}
                          <div className="relative flex-none h-7 w-7 rounded-md overflow-hidden border border-black/10 bg-white p-1 flex items-center justify-center">
                            <AppImage 
                              src={app.image} 
                              alt={app.title} 
                              className="h-full w-full object-contain"
                              fallbackSizeClass="text-xs"
                            />
                          </div>
   
                          <div className="min-w-0">
                            <h4 className={cn(
                              "text-xs font-semibold truncate",
                              isSelected ? "text-blue-600 font-bold" : "text-gray-950"
                            )}>
                              {app.title}
                            </h4>
                          </div>
                        </div>
   
                        {/* Right hand Status dot indicators */}
                        <div className="flex items-center gap-1">
                          {isConnected ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" title="Connected" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                  {filteredApps.length > displayedApps.length && (
                    <div className="py-2 px-3 text-[10px] text-center text-gray-500 italic bg-black/[0.02] rounded-lg border border-dashed border-black/5 mt-2">
                      Use search to find all {filteredApps.length} apps.
                    </div>
                  )}
                </>
              )}
            </div>
          ) : activeTab === 'chat' ? (
            <div className="space-y-1 py-1 pb-4 mt-2 animate-in fade-in duration-200">
              <div className="flex p-0.5 bg-black/[0.04] dark:bg-white/[0.04] rounded-lg border border-black/5 dark:border-white/5 w-full mb-2 select-none">
                <button
                  type="button"
                  onClick={() => setSelectedOption(null)}
                  className={cn(
                    "flex-1 py-1.5 px-3 text-[11px] font-semibold rounded-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
                    selectedOption !== OPTIONS.RESEARCH
                      ? "bg-white dark:bg-zinc-800 text-gray-950 dark:text-zinc-50 shadow-xs"
                      : "text-gray-500 hover:text-gray-950 dark:hover:text-zinc-300"
                  )}
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOption(OPTIONS.RESEARCH)}
                  className={cn(
                    "flex-1 py-1.5 px-3 text-[11px] font-semibold rounded-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
                    selectedOption === OPTIONS.RESEARCH
                      ? "bg-white dark:bg-zinc-800 text-gray-950 dark:text-zinc-50 shadow-xs"
                      : "text-gray-500 hover:text-gray-950 dark:hover:text-zinc-300"
                  )}
                >
                  Research
                </button>
              </div>
              <div className="my-3 h-px bg-black/10 dark:bg-white/10 -mx-4" />
              <ConversationsList activeTab={selectedOption === OPTIONS.RESEARCH ? 'research' : 'search'} />
            </div>
          ) : activeTab === 'text' ? (
            <div className="space-y-1 py-1 pb-4 mt-2 animate-in fade-in duration-200">
              <div className="flex p-0.5 bg-black/[0.04] dark:bg-white/[0.04] rounded-lg border border-black/5 dark:border-white/5 w-full mb-2 select-none">
                <button
                  type="button"
                  onClick={() => setSelectedOption(OPTIONS.DRAFT_DOCUMENT)}
                  className={cn(
                    "flex-1 py-1.5 px-3 text-[11px] font-semibold rounded-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
                    selectedOption !== OPTIONS.CODE
                      ? "bg-white dark:bg-zinc-800 text-gray-950 dark:text-zinc-50 shadow-xs"
                      : "text-gray-500 hover:text-gray-950 dark:hover:text-zinc-300"
                  )}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOption(OPTIONS.CODE)}
                  className={cn(
                    "flex-1 py-1.5 px-3 text-[11px] font-semibold rounded-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
                    selectedOption === OPTIONS.CODE
                      ? "bg-white dark:bg-zinc-800 text-gray-950 dark:text-zinc-50 shadow-xs"
                      : "text-gray-500 hover:text-gray-950 dark:hover:text-zinc-300"
                  )}
                >
                  Code
                </button>
              </div>
              <div className="my-3 h-px bg-black/10 dark:bg-white/10 -mx-4" />
              <ConversationsList activeTab={selectedOption === OPTIONS.CODE ? 'code' : 'write'} />
            </div>
          ) : activeTab === 'media' ? (
            <div className="space-y-1 py-1 pb-4 mt-2 animate-in fade-in duration-200">
              <div className="flex p-0.5 bg-black/[0.04] dark:bg-white/[0.04] rounded-lg border border-black/5 dark:border-white/5 w-full mb-2 select-none">
                <button
                  type="button"
                  onClick={() => setSelectedOption(OPTIONS.IMAGE)}
                  className={cn(
                    "flex-1 py-1.5 px-3 text-[11px] font-semibold rounded-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
                    selectedOption === OPTIONS.IMAGE || selectedOption === OPTIONS.EDIT_IMAGE
                      ? "bg-white dark:bg-zinc-800 text-gray-950 dark:text-zinc-50 shadow-xs"
                      : "text-gray-500 hover:text-gray-950 dark:hover:text-zinc-300"
                  )}
                >
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOption(OPTIONS.VIDEO)}
                  className={cn(
                    "flex-1 py-1.5 px-3 text-[11px] font-semibold rounded-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
                    selectedOption === OPTIONS.VIDEO
                      ? "bg-white dark:bg-zinc-800 text-gray-950 dark:text-zinc-50 shadow-xs"
                      : "text-gray-500 hover:text-gray-950 dark:hover:text-zinc-300"
                  )}
                >
                  Video
                </button>
              </div>
              <div className="my-3 h-px bg-black/10 dark:bg-white/10 -mx-4" />
              <ConversationsList activeTab="search" />
            </div>
          ) : (activeTab === 'assistant' || activeTab === 'workflows') ? (
            <div className="space-y-1 py-1 pb-4 mt-2 animate-in fade-in duration-200">
              <div className="flex p-0.5 bg-black/[0.04] dark:bg-white/[0.04] rounded-lg border border-black/5 dark:border-white/5 w-full mb-2 select-none">
                <button
                  type="button"
                  onClick={() => handleTabChange('assistant')}
                  className={cn(
                    "flex-1 py-1.5 px-3 text-[11px] font-semibold rounded-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
                    activeTab === 'assistant'
                      ? "bg-white dark:bg-zinc-800 text-gray-950 dark:text-zinc-50 shadow-xs"
                      : "text-gray-500 hover:text-gray-950 dark:hover:text-zinc-300"
                  )}
                >
                  Tasks
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('workflows')}
                  className={cn(
                    "flex-1 py-1.5 px-3 text-[11px] font-semibold rounded-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
                    activeTab === 'workflows'
                      ? "bg-white dark:bg-zinc-800 text-gray-950 dark:text-zinc-50 shadow-xs"
                      : "text-gray-500 hover:text-gray-950 dark:hover:text-zinc-300"
                  )}
                >
                  Flows
                </button>
              </div>
              <div className="my-3 h-px bg-black/10 dark:bg-white/10 -mx-4" />
              {activeTab === 'assistant' ? (
                <ConversationsList activeTab="assistant" />
              ) : (
                <div className="space-y-1">
                  {[
                    { id: 'wf-1', name: 'Daily Market Intel', icon: '📊', trigger: 'Every Day @ 8am', active: true },
                    { id: 'wf-2', name: 'Code Vulnerability Scan', icon: '🛡️', trigger: 'On Git Push', active: true },
                    { id: 'wf-3', name: 'Sales Prospecting Flow', icon: '🎯', trigger: 'On Notion Add', active: false },
                    { id: 'wf-4', name: 'Support Mail Auto-Draft', icon: '✉️', trigger: 'On New Email', active: true }
                  ].filter(wf => wf.name.toLowerCase().includes(searchQuery.toLowerCase())).map(wf => {
                    const isSelected = pathname === '/workflows' && searchParams?.get('wf') === wf.id;
                    return (
                      <div
                        key={wf.id}
                        className={cn(
                          "group flex h-9 w-full items-center justify-between rounded-md text-xs font-semibold text-black text-left transition-all",
                          isSelected 
                            ? "bg-black/10" 
                            : "hover:bg-black/5"
                        )}
                      >
                        <span
                          className="flex-1 cursor-pointer truncate px-3 py-2 flex items-center gap-2.5"
                          onClick={() => {
                            router.push(`/workflows?wf=${wf.id}`);
                            close();
                          }}
                        >
                          <Zap className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
                          <span className="truncate">{wf.name}</span>
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="focus-visible:outline-none">
                            <EllipsisVertical className="mr-2 rotate-90 h-3.5 w-3.5 text-black opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="rounded-2xl">
                            <DropdownMenuItem
                              onClick={() => {
                                router.push(`/workflows?wf=${wf.id}`);
                                close();
                              }}
                            >
                              <Zap className="text-black h-4 w-4 mr-2" /> Open
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : activeTab === 'inbox' ? (
            <div className="mt-2 space-y-1 py-1 pb-4">
              {inboxItems
                .filter(item => 
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(item => {
                  const isSelected = pathname === '/inbox' && searchParams?.get('id') === item._id;
                  const isSuccess = item.payload?.status === 'success';
                  const isFailed = item.payload?.status === 'failed';
                  
                  return (
                    <div
                      key={item._id}
                      className={cn(
                        "group flex h-11 w-full items-center justify-between rounded-md text-xs font-normal text-black text-left transition-all border border-transparent px-2.5",
                        isSelected 
                          ? "bg-black/10 dark:bg-white/10 border-black/5 dark:border-white/5" 
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                      )}
                    >
                      <span
                        className="flex-1 cursor-pointer truncate py-1.5 flex flex-col justify-center min-w-0"
                        onClick={() => {
                          router.push(`/inbox?id=${item._id}`);
                          close();
                        }}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className={cn(
                            "h-1.5 w-1.5 rounded-full flex-shrink-0",
                            isSuccess ? "bg-emerald-500 shadow-[0_0_6px_#10b981]" :
                            isFailed ? "bg-rose-500 shadow-[0_0_6px_#f43f5e]" :
                            "bg-amber-500 shadow-[0_0_6px_#f59e0b]"
                          )} />
                          <span className="font-semibold truncate">{item.title}</span>
                          {!item.isRead && (
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500 dark:text-zinc-400 truncate mt-0.5 ml-3 font-normal">
                          {item.description}
                        </span>
                      </span>
                    </div>
                  );
                })}
              {inboxItems.length === 0 && (
                <div className="py-8 text-center text-xs text-gray-500 dark:text-zinc-400">
                  Your Inbox is empty.
                </div>
              )}
            </div>
          ) : activeTab === 'account' ? (
            <div className="mt-4 space-y-1 py-1 pb-4">
              
              {isSuperAdmin && (
                <button
                  onClick={() => { router.push('/admin'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <Shield className="w-4 h-4 text-black dark:text-white" /> Owner Platform
                </button>
              )}
              {isAdmin && !isSuperAdmin && (
                <button
                  onClick={() => { router.push('/admin/platform-admin'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <Shield className="w-4 h-4 text-black dark:text-white" /> Platform Admin
                </button>
              )}
              {(isAdmin || isManager) && !isSuperAdmin && (
                <button
                  onClick={() => { router.push('/admin/platform-manager'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <LayoutDashboard className="w-4 h-4 text-black dark:text-white" /> Platform Manager
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/platform-memory'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <Brain className="w-4 h-4 text-black dark:text-white" /> Platform Memory
                </button>
              )}
              
              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/platform-knowledge'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <Database className="w-4 h-4 text-black dark:text-white" /> Platform Knowledge
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/instructions'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <SlidersHorizontal className="w-4 h-4 text-black dark:text-white" /> Platform Instructions
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/guardrails'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <ShieldAlert className="w-4 h-4 text-black dark:text-white" /> Platform Guardrails
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/invite-friends'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <UserPlus className="w-4 h-4 text-black dark:text-white" /> Invite Friends
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/change-password'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <KeyRound className="w-4 h-4 text-black dark:text-white" /> Change Password
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/contact-support'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <Mail className="w-4 h-4 text-black dark:text-white" /> Contact Support
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/legal'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <Scale className="w-4 h-4 text-black dark:text-white" /> Legal Documents
                </button>
              )}

              {isAdminMode && (
                <>
                  <div className="my-3 h-px bg-black/10 dark:bg-white/10" />
                  
                  {isSuperAdmin && (
                    <div className="space-y-4">
                      {[
                        {
                          groupName: 'Platform',
                          items: [
                            { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
                            { name: 'Support', href: '/admin/support', icon: Mail }
                          ]
                        },
                        {
                          groupName: 'Members',
                          items: [
                            { name: 'Free Users', href: '/admin/metrics/total-users?plan=free', icon: User },
                            { name: 'Paid Users', href: '/admin/metrics/total-users?plan=paid', icon: UserCheck },
                            { name: 'Team Plans', href: '/admin/metrics/active-organizations', icon: UsersRound },
                          ]
                        },
                        {
                          groupName: 'Configurations',
                          items: [
                            { name: 'Instructions', href: '/admin/instructions', icon: FileText },
                            { name: 'Guardrails', href: '/admin/guardrails', icon: Shield },
                          ]
                        },
                        {
                          groupName: 'Credentials',
                          items: [
                            { name: 'My Accounts', href: '/admin/accounts', icon: KeyRound },
                            { name: 'Email Accounts', href: '/admin/emails', icon: Mail },
                            { name: 'Data Partners', href: '/admin/partners', icon: Database },
                            { name: 'API Keys', href: '/admin/apikeys', icon: Key },
                          ]
                        }
                      ].map((group) => (
                        <div key={group.groupName} className="space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 pb-1 select-none">
                            {group.groupName}
                          </div>
                          {group.items.map((item: { name: string; href: string; icon: any; exact?: boolean }) => {
                            const currentPlan = searchParams?.get('plan');
                            const isActive = item.exact 
                              ? pathname === item.href 
                              : item.href.includes('?plan=free')
                                ? pathname === '/admin/metrics/total-users' && currentPlan === 'free'
                                : item.href.includes('?plan=paid')
                                  ? pathname === '/admin/metrics/total-users' && currentPlan === 'paid'
                                  : pathname.startsWith(item.href);
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => close()}
                                className={cn(
                                  'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                                  isActive
                                    ? 'bg-black/5 text-black dark:bg-white/10 dark:text-white font-semibold'
                                    : 'text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                                )}
                              >
                                <Icon className="w-4 h-4 text-black dark:text-white" />
                                {item.name}
                              </Link>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}

                  {isAdminSection && !isSuperAdmin && (
                    <div className="space-y-1">
                      {[
                        { name: 'Invite', href: '/admin/members', icon: UserPlus },
                        { name: 'Members', href: '/admin/team-members', icon: Users },
                        { name: 'Billing', href: '/admin/billing', icon: CreditCard },
                        { name: 'Invoices', href: '/admin/invoices', icon: FileText },
                      ].map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => close()}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                              isActive
                                ? 'bg-black/5 text-black dark:bg-white/10 dark:text-white font-semibold'
                                : 'text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                            )}
                          >
                            <Icon className="w-4 h-4 text-black dark:text-white" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {isManagerSection && !isSuperAdmin && (
                    <div className="space-y-1">
                      {[
                        { name: 'Knowledge', href: '/admin/data', icon: Database },
                        { name: 'Instructions', href: '/admin/instructions', icon: FileText },
                        { name: 'Guardrails', href: '/admin/guardrails', icon: Shield },
                        { name: 'Projects', href: '/admin/projects', icon: Folder },
                      ].map((item) => {
                        const isActive = pathname === item.href || (item.name === 'Projects' && pathname.startsWith('/admin/projects'));
                        const Icon = item.icon;
                        return (
                          <div key={item.name}>
                            <Link
                              href={item.href}
                              onClick={() => close()}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                                isActive
                                  ? 'bg-black/5 text-black dark:bg-white/10 dark:text-white font-semibold'
                                  : 'text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                              )}
                            >
                              <Icon className="w-4 h-4 text-black dark:text-white" />
                              {item.name}
                            </Link>
                            {item.name === 'Projects' && (
                              <div className="mt-1 flex flex-col pl-9 pr-2">
                                {bots.filter(b => b.isShared).map(bot => {
                                  const isSelected = activeBotId === bot.id && pathname.startsWith('/admin/projects');
                                  return (
                                    <Link
                                      key={bot.id}
                                      href={`/admin/projects?bot=${bot.id}`}
                                      onClick={() => {
                                        setActiveBotId(bot.id);
                                        close();
                                      }}
                                      className={cn(
                                        "flex h-8 w-full items-center truncate rounded-md px-2 text-xs font-normal transition-all text-left",
                                        isSelected
                                          ? "bg-black/10 text-black dark:bg-white/10 dark:text-white font-medium"
                                          : "text-gray-500 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                                      )}
                                    >
                                      {bot.name}
                                    </Link>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Footer fixed at bottom */}
      <div className="bg-white dark:bg-zinc-900 sticky bottom-0 flex flex-col w-full">
        {isLoggedIn && activeTab === 'account' ? (
          <div className="flex flex-col w-full">
            {!isSuperAdmin && (
              <div className="flex h-20 w-full items-center justify-center border-t border-black/10 dark:border-zinc-800/80 p-4 py-1.5">
                <Button
                  variant="default"
                  className="w-full justify-center gap-2 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 border border-transparent"
                  onClick={() => {
                    setActiveTab('chat');
                    router.push('/');
                    close();
                  }}
                >
                  Return to App
                </Button>
              </div>
            )}
            <div className="flex h-20 w-full items-center justify-center border-t border-black/10 dark:border-zinc-800/80 p-4 py-1.5">
              <Button
                variant="outline"
                onClick={() => {
                  onOpen({ type: 'logout' });
                  close();
                }}
                className="w-full transition-all duration-200 outline-none select-none cursor-pointer bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:text-white dark:hover:bg-red-700 border-transparent"
              >
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex h-20 w-full items-center justify-center border-t border-black/10 dark:border-zinc-800/80 p-4">
          {!isLoggedIn ? (
            <div className="flex w-full items-center gap-2">
              <Button
                variant="default"
                className="flex-1 bg-black px-0 text-white hover:bg-black/90"
                asChild
              >
                <Link href="/login" onClick={() => close()}>Login</Link>
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-black px-0 text-white hover:bg-black/90"
                asChild
              >
                <Link href="/register" onClick={() => close()}>Register</Link>
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setActiveTab('account')}
              className="w-full transition-all duration-200 outline-none select-none cursor-pointer border border-black/5 dark:border-white/5 bg-[#F5F5F7] hover:bg-[#EAEAEB] dark:bg-zinc-800 dark:hover:bg-zinc-700/80"
            >
              My Account
            </Button>
          )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSideNavMobile;
