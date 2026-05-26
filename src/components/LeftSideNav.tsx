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
import { useSidebarStore } from '@/stores/useSidebarStore';
import { UserMode } from '@/types/tenant';
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Orbit,
  PanelLeftClose,
  PanelRightClose,
  Plus,
  ReceiptText,
  Scale,
  Search,
  Settings,
  SquarePen,
  User,
  Users,
  ChevronRight,
  MessageSquare,
  Globe,
  Folder,
  Database,
  LayoutGrid,
  Zap,
  Upload,
  Cpu,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import ConversationsList from './ConversationsList';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { allApps, APP } from '@/lib/all-apps';
import { apiClientJson, buildApiUrl } from '@/lib/api-client';
import { useBotsStore } from '@/stores/useBotsStore';
import { useConnectionsQuery } from '@/hooks/useConnectApps';

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

type SidebarTab = 'chat' | 'research' | 'bots' | 'models' | 'apps' | 'workflows';

interface LeftSideNavProps {
  side?: 'left' | 'right';
}

const LeftSideNav = ({ side = 'left' }: LeftSideNavProps) => {
  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();
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
  const { isLeftSidebarOpen, toggleLeftSidebar, isRightSidebarOpen, toggleRightSidebar } = useSidebarStore();
  const { bots, activeBotId, setActiveBotId } = useBotsStore();

  const hideSidebar = side === 'right' ? !isRightSidebarOpen : !isLeftSidebarOpen;
  const isLoggedIn = data?.accessToken;

  const [logoHovered, setLogoHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SidebarTab>('chat');

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

  const availableComposioApps = (() => {
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

  const filteredApps = availableComposioApps.filter(app =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (pathname === '/apps') {
      setActiveTab('apps');
    } else if (pathname === '/my-chatbots' || pathname.startsWith('/my-chatbots')) {
      setActiveTab('bots');
    } else if (pathname === '/workflows' || pathname.startsWith('/workflows')) {
      setActiveTab('workflows');
    } else if (pathname === '/models' || pathname.startsWith('/models')) {
      setActiveTab('models');
    } else if (pathname === '/' || pathname.startsWith('/c/')) {
      setActiveTab('chat');
    }
  }, [pathname]);

  // Synchronize tab and option selection with activeConversation.is_deep_search
  useEffect(() => {
    if (activeConversation) {
      const isDeepSearch = !!((activeConversation as any).is_deep_search);
      if (isDeepSearch) {
        setActiveTab('chat');
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
    } else if (tab === 'bots') {
      router.push('/my-chatbots');
    } else if (tab === 'workflows') {
      router.push('/workflows');
    } else if (tab === 'models') {
      router.push('/models');
    } else if (tab === 'research') {
      setSelectedOption(OPTIONS.RESEARCH);
      if (pathname !== '/' && !pathname.startsWith('/c/')) {
        router.push('/');
      }
    } else {
      setSelectedOption(null);
      if (pathname !== '/' && !pathname.startsWith('/c/')) {
        router.push('/');
      }
    }
  };
  const { close } = useDrawerStore();

  const getPlusButtonProps = () => {
    switch (activeTab) {
      case 'chat':
        return {
          visible: true,
          tooltip: 'New Chat',
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
          tooltip: 'New Research',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(OPTIONS.RESEARCH);
            close();
            router.push('/');
          },
        };
      case 'bots':
        return {
          visible: true,
          tooltip: 'New Project',
          onClick: () => {
            onOpen({ type: 'add-chatbot' });
          },
        };
      case 'workflows':
        return {
          visible: true,
          tooltip: 'New Workflow',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(null);
            close();
            router.push('/workflows');
          },
        };
      case 'models':
        return {
          visible: true,
          tooltip: 'New Model',
          onClick: () => {
            setActiveBotId(null);
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(null);
            close();
            router.push('/models');
          },
        };
      case 'apps':
      default:
        return {
          visible: false,
          tooltip: '',
          onClick: () => {},
        };
    }
  };

  const plusProps = getPlusButtonProps();

  const handleLogoMouseEnter = () => {
    if (hideSidebar) {
      setLogoHovered(true);
    }
  };

  return (
    <>
      <div className="pt-0 pb-2" style={{ backgroundColor: '#F2F3F5' }}>
        <div
          className={cn(
            'sticky top-0 z-30 flex items-center justify-between border-b border-black/10 px-4 pt-4 pb-4',
            hideSidebar && 'justify-center',
            side === 'right' && 'flex-row-reverse',
          )}
          style={{ backgroundColor: '#F2F3F5' }}
        >
          <div
            className={cn(
              'flex flex-none items-center justify-center transition-all duration-300',
            )}
            onMouseEnter={handleLogoMouseEnter}
            onMouseLeave={() => setLogoHovered(false)}
          >
            {logoHovered && hideSidebar ? (
              <PanelLeftClose
                className={cn(
                  'size-[21px] cursor-pointer text-gray-600 transition-transform duration-300',
                )}
                onClick={side === 'right' ? toggleRightSidebar : toggleLeftSidebar}
              />
            ) : (
              <Link href="/">
                <Image
                  src="/assets/logo-icon.png"
                  alt="logo"
                  height={20}
                  width={20}
                />
              </Link>
            )}
          </div>

          {side === 'right' ? (
            <PanelRightClose
              className={cn(
                'size-5 cursor-pointer text-gray-600 transition-transform duration-300',
                hideSidebar && 'hidden',
              )}
              onClick={toggleRightSidebar}
            />
          ) : (
            <PanelLeftClose
              className={cn(
                'size-5 cursor-pointer text-gray-600 transition-transform duration-300',
                hideSidebar && 'hidden',
              )}
              onClick={toggleLeftSidebar}
            />
          )}
        </div>
        {/* Enclosed Search & Actions Row */}
        {!hideSidebar && (
          <div className="flex items-center justify-between gap-2 border-b border-black/10 px-4 py-4 transition-all duration-300">
            {/* Search Bar Input */}
            <div className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-black/10 bg-white px-3 shadow-xs transition-all focus-within:ring-1 focus-within:ring-black/20">
              <Search className="size-3.5 flex-none text-black" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-black outline-none placeholder:text-gray-500"
              />
            </div>

            {/* Action Buttons to the right */}
            {plusProps.visible && (
              <div className="flex flex-none items-center gap-1.5 animate-in fade-in zoom-in duration-200">
                {/* Plus for Dynamic Tab Action */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black shadow-xs transition-all hover:bg-black/[0.03] hover:text-black"
                      onClick={plusProps.onClick}
                    >
                      <Plus className="size-4 text-black" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{plusProps.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        )}
{' '}
      </div>

      {/* Chat / Research / Agents / Data / Apps icon row toggle */}
      {!hideSidebar && isLoggedIn && side !== 'right' && (
        <div className="border-b border-black/10 px-4 pt-0 pb-2" style={{ backgroundColor: '#F2F3F5' }}>
          <div className="flex bg-black/[0.04] p-1 rounded-xl w-full justify-between items-center gap-1 border border-black/[0.03]">
            <button
              type="button"
              title="Chat"
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

            <button
              type="button"
              title="Projects"
              onClick={() => handleTabChange('bots')}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                activeTab === 'bots'
                  ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                  : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
              )}
            >
              <Folder className="size-4" />
            </button>

            {/* Removed Data tab */}

            <button
              type="button"
              title="Models"
              onClick={() => handleTabChange('models')}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                activeTab === 'models'
                  ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                  : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
              )}
            >
              <Cpu className="size-4" />
            </button>

            <button
              type="button"
              title="Apps"
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

            <button
              type="button"
              title="Workflows"
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
          </div>
        </div>
      )}

      {isLoggedIn && (
        <div
          className={cn(
            'flex flex-1 flex-col overflow-y-scroll px-4',
            hideSidebar && 'hidden',
            side === 'right' && 'pb-8',
          )}
          style={{ backgroundColor: '#F2F3F5' }}
        >
          {/* Dynamic sub-header reflecting the selected active tab history */}
          <div className="mt-4 mb-2 px-1 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {activeTab === 'bots' 
                ? 'My Projects' 
                : activeTab === 'research' 
                  ? 'Research History' 
                  : activeTab === 'apps' 
                    ? 'Composio Apps' 
                    : activeTab === 'workflows'
                      ? 'Active Workflows'
                      : activeTab === 'models'
                        ? (side === 'right' ? 'Chat History' : 'My Models')
                        : 'Chat History'}
            </span>
          </div>
          {activeTab === 'bots' || (activeTab === 'models' && side === 'left') ? (
            <div className="flex-1 space-y-1 py-1 pb-4">
              {bots
                .filter(bot =>
                  bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  bot.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(bot => {
                  const isSelected = activeBotId === bot.id && (
                    activeTab === 'models' 
                      ? pathname === '/models' 
                      : pathname === '/my-chatbots'
                  );
                  return (
                    <button
                      key={bot.id}
                      onClick={() => {
                        setActiveBotId(bot.id);
                        if (activeTab === 'models') {
                          router.push(`/models?bot=${bot.id}`);
                        } else {
                          router.push(`/my-chatbots?bot=${bot.id}`);
                        }
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
                      <ChevronRight className="mr-2 h-3.5 w-3.5 text-black opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              {bots.filter(bot =>
                bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bot.description.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div className="py-4 text-center text-xs text-gray-500">
                  {activeTab === 'models' ? 'No models found.' : 'No projects found.'}
                </div>
              )}
            </div>
          ) : activeTab === 'apps' ? (
            <div className="flex-1 space-y-1 py-1 pb-4">
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
          ) : activeTab === 'workflows' ? (
            <div className="flex-1 space-y-1 py-1 pb-4">
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
            <ConversationsList searchQuery={searchQuery} activeTab={activeTab === 'models' ? 'chat' : activeTab as any} />
          )}
        </div>
      )}

      {!isLoggedIn && <div className="flex flex-1 flex-col"></div>}

      {side !== 'right' && (
        <div
          className={cn(
            'sticky bottom-0 z-30 flex h-20 items-center justify-center border-t border-black/10 p-4 py-1.5',
            hideSidebar && 'hidden',
          )}
          style={{ backgroundColor: '#F2F3F5' }}
        >
          {!isLoggedIn ? (
            <div className="flex w-full items-center gap-2">
              <Button
                variant="default"
                className="flex-1 bg-black px-0 text-white hover:bg-black/90"
                onClick={() => onOpen({ type: 'auth-modal', actionId: 'login' })}
              >
                Login
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-black px-0 text-white hover:bg-black/90"
                onClick={() =>
                  onOpen({ type: 'auth-modal', actionId: 'register' })
                }
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
              <DropdownMenuContent
                className="w-[var(--radix-dropdown-menu-trigger-width)]"
                align="start"
              >
                <DropdownMenuGroup>
                  {data?.user?.role === 'super_admin' && (
                    <DropdownMenuItem onClick={() => router.push('/admin')}>
                      <LayoutDashboard className="text-black" /> Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => router.push('/knowledge')}>
                    <Database className="text-black" /> Data
                  </DropdownMenuItem>
                  {/* Plans dropdown menu item */}
                  <DropdownMenuItem onClick={() => router.push('/upgrade')}>
                    <Orbit className="text-black" /> Plans
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      router.push(
                        mode === UserMode.TENANT && currentTenant
                          ? `/organizations/${currentTenant.id}/members`
                          : '/organizations',
                      )
                    }
                  >
                    <Users className="text-black" /> Members
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/legal')}>
                    <Scale className="text-black" /> Legal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/settings')}>
                    <Settings className="text-black" /> Settings
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
      )}
    </>
  );
};

export default LeftSideNav;
