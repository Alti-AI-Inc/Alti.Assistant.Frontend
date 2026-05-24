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
import { UserMode } from '@/types/tenant';
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Orbit,
  ReceiptText,
  Scale,
  Search,
  Settings,
  SquarePen,
  User,
  Users,
  ChevronRight,
  Plus,
  MessageSquare,
  Globe,
  Bot,
  Database,
  LayoutGrid,
  Zap,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ConversationsList from './ConversationsList';
import { TenantModeSwitcher } from './TenantModeSwitcher';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { allApps } from '@/lib/all-apps';
import { apiClientJson, buildApiUrl } from '@/lib/api-client';
import { useBotsStore } from '@/stores/useBotsStore';

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
    description: 'Upload PDF, TXT, Word up to 1MB',
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

type SidebarTab = 'chat' | 'research' | 'bots' | 'apps' | 'data' | 'workflows';

const LeftSideNavMobile = () => {
  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { close } = useDrawerStore();
  const { mode, currentTenant } = useTenant();

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
  const { bots, activeBotId, setActiveBotId } = useBotsStore();
  const [activeTab, setActiveTab] = useState<SidebarTab>('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const activeAppSlug = searchParams?.get('app');
  const activeConnectorId = searchParams?.get('connector') || 'file';

  const [connectedAppSlugs, setConnectedAppSlugs] = useState<Set<string>>(new Set());
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);

  const fetchConnectionStatus = async () => {
    setIsFetchingStatus(true);
    const response = await apiClientJson<{ connectedAccountId: string; toolkit: { slug: string } }[]>(
      buildApiUrl('/composio-simple/connected-accounts')
    );
    
    if (response.success && Array.isArray(response.data)) {
      const activeSlugs = new Set(
        response.data.map(account => account.toolkit?.slug?.toLowerCase()).filter(Boolean)
      );
      setConnectedAppSlugs(activeSlugs);
    }
    setIsFetchingStatus(false);
  };

  useEffect(() => {
    if (activeTab === 'apps' || activeTab === 'data') {
      fetchConnectionStatus();
    }
  }, [activeTab]);

  const availableComposioApps = allApps
    .filter(app => app.isAvailable && app.app_name)
    .sort((a, b) => a.title.localeCompare(b.title));

  const filteredApps = availableComposioApps.filter(app =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (pathname === '/apps') {
      setActiveTab('apps');
    } else if (pathname === '/my-chatbots' || pathname.startsWith('/my-chatbots')) {
      setActiveTab('bots');
    } else if (pathname === '/knowledge' || pathname.startsWith('/knowledge')) {
      setActiveTab('data');
    } else if (pathname === '/workflows' || pathname.startsWith('/workflows')) {
      setActiveTab('workflows');
    } else if (pathname === '/' || pathname.startsWith('/c/')) {
      const isResearch = useConversationsStore.getState().selectedOption === OPTIONS.RESEARCH;
      setActiveTab(isResearch ? 'research' : 'chat');
    }
  }, [pathname]);

  // Synchronize tab and option selection with activeConversation.is_deep_search
  useEffect(() => {
    if (activeConversation) {
      const isDeepSearch = !!((activeConversation as any).is_deep_search);
      if (isDeepSearch) {
        setActiveTab('research');
        if (selectedOption !== OPTIONS.RESEARCH) {
          setSelectedOption(OPTIONS.RESEARCH);
        }
      } else {
        // Only set to chat if not on the bots page or apps page or data page
        if (
          pathname !== '/my-chatbots' &&
          !pathname.startsWith('/my-chatbots') &&
          pathname !== '/apps' &&
          pathname !== '/knowledge' &&
          !pathname.startsWith('/knowledge')
        ) {
          setActiveTab('chat');
          if (selectedOption === OPTIONS.RESEARCH) {
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
    } else if (tab === 'data') {
      router.push('/knowledge?connector=file');
      close();
    } else if (tab === 'workflows') {
      router.push('/workflows');
      close();
    } else if (tab === 'research') {
      setSelectedOption(OPTIONS.RESEARCH);
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
        return {
          visible: true,
          label: 'New Chat',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(null);
            router.push('/');
            close();
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
            router.push('/');
            close();
          },
        };
      case 'bots':
        return {
          visible: true,
          label: 'New Agent',
          onClick: () => {
            onOpen({ type: 'add-chatbot' });
            close();
          },
        };
      case 'workflows':
        return {
          visible: true,
          label: 'New Workflow',
          onClick: () => {
            alert('Define Cron or Webhook triggers to chain your custom agents and RAG indexes in a new workflow!');
            close();
          },
        };
      case 'data':
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
    <div className="bg-secondary flex h-full flex-col">
      {/* TenantModeSwitcher at top */}
      {isLoggedIn && (
        <div className="px-2 pt-4 pb-2">
          <TenantModeSwitcher />
        </div>
      )}

      {/* Sticky nav buttons */}
      <div className="bg-secondary sticky top-0 z-10">
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

          {isLoggedIn && (
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
                  className="lucide lucide-package"
                >
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
                <span className="text-sm font-normal">Apps</span>
              </Button> */}
            </>
          )}
        </div>
      </div>

      {/* Chat / Research / Agents / Data / Apps icon row toggle */}
      {isLoggedIn && (
        <div className="border-b border-black/5 px-4 py-2 bg-secondary">
          <div className="flex bg-black/[0.04] p-1 rounded-xl w-full justify-between items-center gap-1 border border-black/[0.03]">
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
                  onClick={() => handleTabChange('research')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                    activeTab === 'research'
                      ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                  )}
                >
                  <Globe className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Research</p>
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
                  <Bot className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Agents</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTabChange('data')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                    activeTab === 'data'
                      ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                  )}
                >
                  <Database className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Data</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTabChange('apps')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                    activeTab === 'apps'
                      ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                  )}
                >
                  <LayoutGrid className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Apps</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTabChange('workflows')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                    activeTab === 'workflows'
                      ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                  )}
                >
                  <Zap className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Workflows</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Scrollable conversation list */}
      {isLoggedIn && (
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="mt-3 mb-2 flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <span>
                {activeTab === 'bots' 
                  ? 'My Agents' 
                  : activeTab === 'research' 
                    ? 'Research History' 
                    : activeTab === 'apps' 
                      ? 'Composio Apps' 
                      : activeTab === 'data' 
                        ? 'Data Connectors' 
                        : activeTab === 'workflows'
                          ? 'Active Workflows'
                          : 'Chat History'}
              </span>
              {activeTab !== 'apps' && activeTab !== 'bots' && activeTab !== 'data' && mode === UserMode.TENANT && currentTenant && (
                <Badge
                  variant="outline"
                  className="h-4 px-1.5 text-[9px] font-normal border-gray-400 text-gray-500 bg-transparent"
                >
                  <Building2 className="mr-0.5 size-2" />
                  {currentTenant.name}
                </Badge>
              )}
              {activeTab !== 'apps' && activeTab !== 'bots' && activeTab !== 'data' && mode === UserMode.PERSONAL && (
                <Badge
                  variant="outline"
                  className="h-4 px-1.5 text-[9px] font-normal border-gray-400 text-gray-500 bg-transparent"
                >
                  <User className="mr-0.5 size-2" />
                  Personal
                </Badge>
              )}
            </div>
            {activeTab === 'apps' || activeTab === 'data' ? (
              <div className="flex h-7 flex-1 items-center gap-1.5 rounded-lg border border-black/10 bg-white px-2 shadow-xs transition-all focus-within:ring-1 focus-within:ring-black/20 ml-4 max-w-[150px]">
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
          {activeTab === 'bots' ? (
            <div className="space-y-1 py-1 pb-4">
              {bots
                .filter(bot =>
                  bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  bot.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(bot => {
                  const isSelected = activeBotId === bot.id && pathname === '/my-chatbots';
                  return (
                    <button
                      key={bot.id}
                      onClick={() => {
                        setActiveBotId(bot.id);
                        router.push(`/my-chatbots?bot=${bot.id}`);
                        close();
                      }}
                      className={cn(
                        "group flex h-9 w-full items-center justify-between rounded-md text-sm font-medium text-black text-left transition-all",
                        isSelected 
                          ? "bg-black/10 font-semibold" 
                          : "hover:bg-black/5"
                      )}
                    >
                      <span className="flex-1 truncate px-1 py-2">
                        {bot.name}
                      </span>
                      <ChevronRight className="mr-2 h-3.5 w-3.5 text-black transition-opacity" />
                    </button>
                  );
                })}
              {bots.filter(bot =>
                bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bot.description.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div className="py-4 text-center text-xs text-gray-500">
                  No agents found.
                </div>
              )}
            </div>
          ) : activeTab === 'apps' ? (
            <div className="space-y-1 py-1 pb-4">
              {filteredApps.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-500">
                  No integrations found.
                </div>
              ) : (
                filteredApps.map(app => {
                  const isConnected = connectedAppSlugs.has(app.app_name.toLowerCase());
                  const isSelected = activeAppSlug === app.app_name;
                  
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
                          {app.image ? (
                            <img 
                              src={app.image} 
                              alt={app.title} 
                              className="h-full w-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = `<span class="text-xs font-semibold text-blue-600">${app.title.charAt(0)}</span>`;
                              }}
                            />
                          ) : (
                            <span className="text-xs font-semibold text-blue-600">{app.title.charAt(0)}</span>
                          )}
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
                })
              )}
            </div>
          ) : activeTab === 'data' ? (
            <div className="space-y-1 py-1 pb-4">
              {/* File Upload special connector */}
              {'file upload'.includes(searchQuery.toLowerCase()) && (
                <button
                  onClick={() => {
                    router.push(`/knowledge?connector=file`);
                    close();
                  }}
                  className={cn(
                    "w-full flex items-center justify-between rounded-lg p-2 transition-all text-left group",
                    (activeConnectorId === 'file' || !activeConnectorId) && pathname === '/knowledge'
                      ? "bg-black/[0.06] border border-black/10 shadow-xs"
                      : "hover:bg-black/[0.03] border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex-none h-7 w-7 rounded-md bg-white border border-black/10 flex items-center justify-center text-sm shadow-xs">
                      📁
                    </div>
                    <div className="min-w-0">
                      <h4 className={cn(
                        "text-xs font-semibold truncate",
                        (activeConnectorId === 'file' || !activeConnectorId) && pathname === '/knowledge'
                          ? "text-blue-600 font-bold"
                          : "text-gray-950"
                      )}>
                        File Upload
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" title="Active" />
                  </div>
                </button>
              )}

              {/* Dynamic Composio apps acting as data connectors */}
              {filteredApps.map(app => {
                const isConnected = connectedAppSlugs.has(app.app_name.toLowerCase());
                const isSelected = activeConnectorId === app.app_name && pathname === '/knowledge';

                return (
                  <button
                    key={app.app_name}
                    onClick={() => {
                      router.push(`/knowledge?connector=${app.app_name}`);
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
                        {app.image ? (
                          <img
                            src={app.image}
                            alt={app.title}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = `<span class="text-xs font-semibold text-blue-600">${app.title.charAt(0)}</span>`;
                            }}
                          />
                        ) : (
                          <span className="text-xs font-semibold text-blue-600">{app.title.charAt(0)}</span>
                        )}
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

              {!['file upload'].includes(searchQuery.toLowerCase()) && filteredApps.length === 0 && (
                <div className="py-4 text-center text-xs text-gray-500">
                  No integrations found.
                </div>
              )}
            </div>
          ) : activeTab === 'workflows' ? (
            <div className="space-y-1 py-1 pb-4">
              {[
                { id: 'wf-1', name: 'Daily Market Intel', icon: '📊', trigger: 'Every Day @ 8am', active: true },
                { id: 'wf-2', name: 'Code Vulnerability Scan', icon: '🛡️', trigger: 'On Git Push', active: true },
                { id: 'wf-3', name: 'Sales Prospecting Flow', icon: '🎯', trigger: 'On Notion Add', active: false },
                { id: 'wf-4', name: 'Support Mail Auto-Draft', icon: '✉️', trigger: 'On New Email', active: true }
              ].filter(wf => wf.name.toLowerCase().includes(searchQuery.toLowerCase())).map(wf => {
                const isSelected = pathname === '/workflows' && searchParams?.get('wf') === wf.id;
                return (
                  <button
                    key={wf.id}
                    onClick={() => {
                      router.push(`/workflows?wf=${wf.id}`);
                      close();
                    }}
                    className={cn(
                      "group flex h-9 w-full items-center justify-between rounded-md text-sm font-medium text-black text-left transition-all",
                      isSelected 
                        ? "bg-black/10 font-semibold" 
                        : "hover:bg-black/5"
                    )}
                  >
                    <span className="flex-1 truncate px-1 py-2">
                      {wf.name}
                    </span>
                    <ChevronRight className="mr-2 h-3.5 w-3.5 text-black opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          ) : (
            <ConversationsList activeTab={activeTab} />
          )}
        </div>
      )}

      {/* Footer fixed at bottom */}
      <div className="bg-secondary sticky bottom-0 flex h-20 items-center justify-center p-4">
        {!isLoggedIn ? (
          <div className="flex w-full items-center gap-2">
            <Button
              variant="default"
              className="flex-1 bg-black px-0 text-white hover:bg-black/90"
              onClick={() => {
                onOpen({ type: 'auth-modal', actionId: 'login' });
                close();
              }}
            >
              Login
            </Button>
            <Button
              variant="default"
              className="flex-1 bg-black px-0 text-white hover:bg-black/90"
              onClick={() => {
                onOpen({ type: 'auth-modal', actionId: 'register' });
                close();
              }}
            >
              Register
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                My Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuGroup>
                {/* <DropdownMenuItem
                  onClick={() => {
                    router.push('/apps');
                    close();
                  }}
                >
                  <LayoutGrid className="text-black" /> Apps
                </DropdownMenuItem> */}
                {/* Plans dropdown menu item */}
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/upgrade');
                    close();
                  }}
                >
                  <Orbit className="text-black" /> Plans
                </DropdownMenuItem>
                {data?.user?.role === 'super_admin' && (
                  <DropdownMenuItem
                    onClick={() => {
                      router.push('/admin');
                      close();
                    }}
                  >
                    <LayoutDashboard className="text-black" /> Dashboard
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => {
                    router.push(
                      mode === UserMode.TENANT && currentTenant
                        ? `/organizations/${currentTenant.id}/members`
                        : '/organizations',
                    );
                    close();
                  }}
                >
                  <Users className="text-black" /> Members
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/settings');
                    close();
                  }}
                >
                  <Settings className="text-black" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/legal');
                    close();
                  }}
                >
                  <Scale className="text-black" /> Legal
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  onOpen({
                    type: 'logout',
                  })
                }
              >
                <LogOut className="text-black" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default LeftSideNavMobile;
