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
  ListTodo,
  Zap,
  Upload,
  Cpu,
  Sparkles,
  Microscope,
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
  Code2,
  ImageIcon,
  Video,
  Volume2,
  ShieldAlert,
  Blocks,
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

type SidebarTab = 'search' | 'research' | 'write' | 'code' | 'image' | 'audio' | 'video' | 'bots' | 'tasks' | 'none' | 'account';

const AVAILABLE_MCP_APPS = (() => {
  const uniqueMap = new Map<string, APP>();
  allApps.forEach(app => {
    if (app.isAvailable && app.app_name) {
      const slug = app.app_name.toLowerCase();
      const isMcp = !!app.isMcp || [
        'filesystem', 'google-maps', 'slack', 'linear', 'gcal',
        'brave-search', 'postgres', 'sqlite', 'playwright', 'fetch', 'evernote'
      ].includes(slug);
      
      if (isMcp && !uniqueMap.has(slug)) {
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
  const isTenantOwner = mode === 'tenant' && (currentTenant?.role === 'admin' || currentTenant?.role === 'owner');
  const isTenantAdmin = mode === 'tenant' && currentTenant?.role === 'manager';

  const isAdmin = userEmail === 'admin@insoai.com' || isGlobalAdmin || isTenantOwner;
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

  const [activeTab, setActiveTab] = useState<SidebarTab>('search');
  const [searchQuery, setSearchQuery] = useState('');

  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedTasks = localStorage.getItem('insoai_automations');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks([]);
      }
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('insoai_automations_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('insoai_automations_updated', handleStorageChange);
    };
  }, [pathname]);
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
    return AVAILABLE_MCP_APPS.filter(app =>
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const displayedApps = useMemo(() => {
    if (searchQuery.trim() !== '') {
      return filteredApps;
    }
    const connected = AVAILABLE_MCP_APPS.filter(app => connectedAppSlugs.has(app.app_name.toLowerCase()));
    const nonConnected = AVAILABLE_MCP_APPS.filter(app => !connectedAppSlugs.has(app.app_name.toLowerCase()));
    return [...connected, ...nonConnected];
  }, [searchQuery, filteredApps, connectedAppSlugs]);

  useEffect(() => {
    if (!isLoggedIn) {
      setActiveTab('search');
      return;
    }
    if (isSuperAdmin) {
      setActiveTab('account');
      return;
    }
    if (pathname === '/my-chatbots' || pathname.startsWith('/my-chatbots')) {
      setActiveTab('bots');
    } else if (pathname === '/tasks' || pathname.startsWith('/tasks')) {
      setActiveTab('tasks');
    } else if (pathname === '/' || pathname.startsWith('/c/')) {
      if (selectedOption === OPTIONS.RESEARCH) {
        setActiveTab('research');
      } else if (selectedOption === OPTIONS.CODE) {
        setActiveTab('code');
      } else if (
        selectedOption === OPTIONS.DRAFT_DOCUMENT ||
        selectedOption === OPTIONS.REWRITE ||
        selectedOption === OPTIONS.TRANSLATE_DOCUMENTS ||
        selectedOption === OPTIONS.BRAINSTORM ||
        selectedOption === OPTIONS.GENERATE_PLAN ||
        selectedOption === OPTIONS.REVIEW_CONTRACT ||
        selectedOption === OPTIONS.GENERATE_REPORT
      ) {
        setActiveTab('write');
      } else if (
        selectedOption === OPTIONS.IMAGE ||
        selectedOption === OPTIONS.EDIT_IMAGE
      ) {
        setActiveTab('image');
      } else if (selectedOption === OPTIONS.AUDIO) {
        setActiveTab('audio');
      } else if (selectedOption === OPTIONS.VIDEO) {
        setActiveTab('video');
      } else {
        setActiveTab('search');
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
  }, [pathname, selectedOption, isLoggedIn]);

  // Reset active tab to search when user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      setActiveTab('search');
    }
  }, [isLoggedIn]);

  // Synchronize tab and option selection with activeConversation.is_deep_search
  useEffect(() => {
    if (isSuperAdmin) return;
    if (activeConversation) {
      const isDeepSearch = !!((activeConversation as any).is_deep_search);
      if (isDeepSearch) {
        setActiveTab('research');
        if (selectedOption !== OPTIONS.RESEARCH) {
          setSelectedOption(OPTIONS.RESEARCH);
        }
      } else {
        // Only set to search if not on the bots page or apps page or data page or assistant/workflows
        if (
          pathname !== '/my-chatbots' &&
          !pathname.startsWith('/my-chatbots') &&
          pathname !== '/tasks' &&
          !pathname.startsWith('/tasks') &&
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
          // Removed: We no longer guess the activeTab from the conversation title, 
          // because it causes the tab to unexpectedly switch away from the current tab 
          // when clicking a history item. (e.g. clicking image history while on image tab)
        }
      }
    }
  }, [activeConversation, selectedOption, setSelectedOption, pathname]);

  const handleTabChange = (tab: SidebarTab) => {
    setActiveTab(tab);
    if (tab === 'bots') {
      setActiveConversation(null);
      router.push('/my-chatbots');
      close();
    } else if (tab === 'search') {
      setSelectedOption(null);
      if (pathname !== '/') {
        setActiveConversation(null);
        router.push('/');
      }
      close();
    } else if (tab === 'research') {
      setSelectedOption(OPTIONS.RESEARCH);
      if (pathname !== '/') {
        setActiveConversation(null);
        router.push('/');
      }
      close();
    } else if (tab === 'write') {
      setSelectedOption(OPTIONS.DRAFT_DOCUMENT);
      if (pathname !== '/') {
        setActiveConversation(null);
        router.push('/');
      }
      close();
    } else if (tab === 'code') {
      setSelectedOption(OPTIONS.CODE);
      if (pathname !== '/') {
        setActiveConversation(null);
        router.push('/');
      }
      close();
    } else if (tab === 'image') {
      setSelectedOption(OPTIONS.IMAGE);
      if (pathname !== '/') {
        setActiveConversation(null);
        router.push('/');
      }
      close();
    } else if (tab === 'audio') {
      setSelectedOption(OPTIONS.AUDIO);
      if (pathname !== '/') {
        setActiveConversation(null);
        router.push('/');
      }
      close();
    } else if (tab === 'tasks') {
      setActiveConversation(null);
      router.push('/tasks');
      close();
    } else if (tab === 'video') {
      setSelectedOption(OPTIONS.VIDEO);
      if (pathname !== '/') {
        setActiveConversation(null);
        router.push('/');
      }
      close();
    }
  };

  const getPlusButtonProps = () => {
    switch (activeTab) {
      case 'tasks':
        return {
          visible: true,
          label: 'New Task',
          onClick: () => {
            router.push('/tasks');
            window.dispatchEvent(new Event('insoai_new_task_click'));
            close();
          },
        };
      case 'search':
        return {
          visible: true,
          label: 'New Search',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(null);
            close();
            router.push('/');
          },
        };
      case 'research':
        return {
          visible: true,
          label: 'New Research',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(OPTIONS.RESEARCH);
            close();
            router.push('/');
          },
        };
      case 'write':
        return {
          visible: true,
          label: 'New Document',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(OPTIONS.DRAFT_DOCUMENT);
            close();
            router.push('/');
          },
        };
      case 'code':
        return {
          visible: true,
          label: 'New Code',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(OPTIONS.CODE);
            close();
            router.push('/');
          },
        };
      case 'image':
        return {
          visible: true,
          label: 'New Image',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(OPTIONS.IMAGE);
            close();
            router.push('/');
          },
        };
      case 'audio':
        return {
          visible: true,
          label: 'New Audio',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(OPTIONS.AUDIO);
            close();
            router.push('/');
          },
        };
      case 'video':
        return {
          visible: true,
          label: 'New Video',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(OPTIONS.VIDEO);
            close();
            router.push('/');
          },
        };
      case 'bots':
        return {
          visible: true,
          label: 'New Space',
          onClick: () => {
            setActiveBotId(null);
            router.push('/my-chatbots');
            close();
          },
        };
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
    <div className="bg-[#0c1120] dark:bg-[#0c1120] flex h-full flex-col">
      {/* 6-Icon Toggle Row / Space Toggles */}
      {!isSuperAdmin && activeTab !== 'account' && (
        <div className="border-b border-zinc-800/60 px-4 py-2 bg-[#0c1120] dark:bg-[#0c1120] flex-none">
          <div className="flex bg-white/[0.06] dark:bg-white/[0.04] p-1 rounded-xl w-full justify-between items-center gap-1 border border-white/[0.03] dark:border-white/[0.03]">
            {/* Chat */}
            <button
              type="button"
              onClick={() => handleTabChange('search')}
              className={cn(
                'flex flex-1 h-8 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none select-none',
                activeTab === 'search'
                  ? 'bg-white/[0.12] border-white/10 text-white shadow-xs scale-[1.02]'
                  : 'bg-transparent border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-white',
              )}
            >
              <Globe className="size-4" />
              <span>Chat</span>
            </button>

            {/* Spaces */}
            <button
              type="button"
              onClick={() => handleTabChange('bots')}
              className={cn(
                'flex flex-1 h-8 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none select-none',
                activeTab === 'bots'
                  ? 'bg-white/[0.12] border-white/10 text-white shadow-xs scale-[1.02]'
                  : 'bg-transparent border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-white',
              )}
            >
              <LayoutGrid className="size-4" />
              <span>Spaces</span>
            </button>

            {/* Tasks */}
            <button
              type="button"
              onClick={() => handleTabChange('tasks')}
              className={cn(
                'flex flex-1 h-8 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none select-none',
                activeTab === 'tasks'
                  ? 'bg-white/[0.12] border-white/10 text-white shadow-xs scale-[1.02]'
                  : 'bg-transparent border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-white',
              )}
            >
              <Zap className="size-4" />
              <span>Tasks</span>
            </button>
          </div>
        </div>
      )}

      {/* Enclosed Search & Actions Row */}
      {activeTab !== 'account' && (
        <div className="h-[52px] flex items-center justify-between gap-2 border-b border-zinc-800/60 px-4 bg-[#0c1120] dark:bg-[#0c1120] transition-all duration-300 flex-none">
          {/* Search Bar Input */}
          <div className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.06] px-3 shadow-xs transition-all focus-within:ring-1 focus-within:ring-white/20">
            <Search className="size-3.5 flex-none text-zinc-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-zinc-100 outline-none placeholder:text-zinc-400"
            />
          </div>

          {/* Action Buttons to the right */}
          <div className="flex flex-none items-center gap-1.5">
            {plusProps.visible && (
              <div>
                {/* Plus for Dynamic Tab Action */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.06] text-white shadow-xs transition-all hover:bg-white/[0.12]"
                      onClick={plusProps.onClick}
                    >
                      <Plus className="size-4 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{plusProps.label}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Scrollable conversation list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {activeTab === 'bots' ? (
            <div className="mt-2 space-y-1 py-1 pb-4">
              {bots
                .filter(bot =>
                  (bot.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (bot.description || '').toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(bot => {
                  const isSelected = activeBotId === bot.id && pathname === '/my-chatbots';
                  return (
                    <div
                      key={bot.id}
                      className={cn(
                        "group flex h-9 w-full items-center justify-between rounded-lg text-xs font-semibold text-left transition-all duration-150 border mb-1.5",
                        isSelected 
                          ? "bg-white/12 border-white/10 text-white shadow-xs" 
                          : "bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white"
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
                        <LayoutGrid className={cn(
                          "h-3.5 w-3.5 flex-shrink-0 transition-colors",
                          isSelected ? "text-white" : "text-zinc-400 group-hover:text-zinc-100"
                        )} />
                        <span className="truncate">{bot.name}</span>
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="focus-visible:outline-none">
                          <EllipsisVertical className={cn(
                            "mr-2 rotate-90 h-3.5 w-3.5 transition-colors",
                            isSelected ? "text-white" : "text-zinc-400 group-hover:text-zinc-100"
                          )} />
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
                (bot.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (bot.description || '').toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div className="py-4 text-center text-xs text-gray-500">
                  No workspaces found.
                </div>
              )}
            </div>
          ) : activeTab === 'tasks' ? (
            <div className="space-y-1.5 py-1 pb-4 mt-2 animate-in fade-in duration-200">
              {tasks.filter(task => 
                (task.prompt || '').toLowerCase().includes(searchQuery.toLowerCase())
              ).map((task) => (
                <button
                  key={task.id}
                  onClick={() => {
                    router.push(`/tasks?taskId=${task.id}`);
                    close();
                  }}
                  className="w-full flex flex-col gap-1 px-3 py-2 text-xs font-medium rounded-lg text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left border border-white/[0.04] bg-white/[0.06] shadow-xs mb-1.5"
                >
                  <p className="font-semibold text-white line-clamp-1 leading-snug">
                    {task.prompt}
                  </p>
                  <div className="flex items-center justify-between w-full text-[10px] text-zinc-400 font-medium">
                    <span className="capitalize">{task.taskType}</span>
                    <span>
                      {task.triggerType === 'scheduled' 
                        ? task.schedule 
                        : 'Action Based'}
                    </span>
                  </div>
                </button>
              ))}
              {tasks.filter(task => 
                (task.prompt || '').toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div className="py-8 text-center text-xs text-gray-400 dark:text-zinc-500 italic">
                  No automated tasks found.
                </div>
              )}
            </div>
          ) : activeTab === 'search' ? (
            <div className="space-y-1.5 pb-4 mt-2 animate-in fade-in duration-200">
              <ConversationsList searchQuery={searchQuery} activeTab="search" />
            </div>
          ) : isLoggedIn && activeTab === 'account' ? (
            <div className="mt-4 space-y-1 py-1 pb-4">
              
              {isSuperAdmin && (
                <button
                  onClick={() => { router.push('/admin'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                >
                  <Shield className="w-4 h-4 text-zinc-300" /> Owner Platform
                </button>
              )}
              {isAdmin && !isSuperAdmin && (
                <button
                  onClick={() => { router.push('/admin/platform-admin'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                >
                  <Shield className="w-4 h-4 text-zinc-300" /> Platform Admin
                </button>
              )}
              {(isAdmin || isManager) && !isSuperAdmin && (
                <button
                  onClick={() => { router.push('/admin/platform-manager'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                >
                  <LayoutDashboard className="w-4 h-4 text-zinc-300" /> Platform Manager
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/appsx'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                >
                  <Blocks className="w-4 h-4 text-zinc-300" /> Platform Connectors
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/platform-memory'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                >
                  <Brain className="w-4 h-4 text-zinc-300" /> Platform Memory
                </button>
              )}
              
              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/platform-knowledge'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                >
                  <Database className="w-4 h-4 text-zinc-300" /> Platform Knowledge
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/instructions'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                >
                  <SlidersHorizontal className="w-4 h-4 text-zinc-300" /> Platform Instructions
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/guardrails'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                >
                  <ShieldAlert className="w-4 h-4 text-zinc-300" /> Platform Guardrails
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/invite-friends'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                >
                  <UserPlus className="w-4 h-4 text-zinc-300" /> Invite Friends
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/change-password'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                >
                  <KeyRound className="w-4 h-4 text-zinc-300" /> Change Password
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/contact-support'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                >
                  <Mail className="w-4 h-4 text-zinc-300" /> Contact Support
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/legal'); close(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                >
                  <Scale className="w-4 h-4 text-zinc-300" /> Legal Documents
                </button>
              )}

              {isAdminMode && (
                <>
                  <div className="my-3 h-px bg-white/10" />
                  
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
                                    ? 'bg-white/12 text-white font-semibold'
                                    : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                                )}
                              >
                                <Icon className="w-4 h-4 text-zinc-350" />
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
                                ? 'bg-white/12 text-white font-semibold'
                                : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                            )}
                          >
                            <Icon className="w-4 h-4 text-zinc-350" />
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
                                  ? 'bg-white/12 text-white font-semibold'
                                  : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                              )}
                            >
                              <Icon className="w-4 h-4 text-zinc-350" />
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
                                          ? "bg-white/12 text-white font-medium"
                                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
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
                    setActiveTab('search');
                    router.push('/');
                    close();
                  }}
                >
                  Return to App
                </Button>
              </div>
            )}
            <div className="flex h-20 w-full items-center justify-center border-t border-zinc-800/60 p-4 py-1.5">
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
          <div className="flex h-20 w-full items-center justify-center border-t border-zinc-800/60 p-4">
          {!isLoggedIn ? (
            <div className="flex w-full items-center gap-2">
              <Button
                variant="default"
                className="flex-1 bg-white px-0 text-black hover:bg-white/90"
                asChild
              >
                <Link href="/login" onClick={() => close()}>Login</Link>
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-white px-0 text-black hover:bg-white/90"
                asChild
              >
                <Link href="/register" onClick={() => close()}>Register</Link>
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setActiveTab('account')}
              className="w-full transition-all duration-200 outline-none select-none cursor-pointer border border-white/5 bg-white/[0.06] hover:bg-white/[0.12] text-white"
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
