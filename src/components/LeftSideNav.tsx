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
  Bot,
  Database,
  Puzzle,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ConversationsList from './ConversationsList';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { allApps } from '@/lib/all-apps';
import { apiClientJson, buildApiUrl } from '@/lib/api-client';
import { useBotsStore } from '@/stores/useBotsStore';
import { useKnowledgeBankGetFoldersQuery } from '@/hooks/useKnowledgeBank';

type SidebarTab = 'chat' | 'research' | 'bots' | 'apps' | 'data';

const LeftSideNav = () => {
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
  const { isLeftSidebarOpen, toggleLeftSidebar } = useSidebarStore();
  const { bots, activeBotId, setActiveBotId } = useBotsStore();
  const { data: knowledgeBankFolders, isLoading: isKnowledgeLoading } = useKnowledgeBankGetFoldersQuery();

  const hideSidebar = !isLeftSidebarOpen;
  const isLoggedIn = data?.accessToken;

  const [logoHovered, setLogoHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SidebarTab>('chat');

  const searchParams = useSearchParams();
  const activeAppSlug = searchParams?.get('app');

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
    if (activeTab === 'apps') {
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
    } else if (tab === 'bots') {
      router.push('/my-chatbots');
    } else if (tab === 'data') {
      router.push('/knowledge');
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
                onClick={toggleLeftSidebar}
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

          <PanelLeftClose
            className={cn(
              'size-5 cursor-pointer text-gray-600 transition-transform duration-300',
              hideSidebar && 'hidden',
            )}
            onClick={toggleLeftSidebar}
          />
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
            <div className="flex flex-none items-center gap-1.5">
              {/* Plus for New Chat Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black shadow-xs transition-all hover:bg-black/[0.03] hover:text-black"
                    onClick={() => {
                      setActiveConversation(null);
                      setShowStartLastMessage(false);
                      setUserMessage('');
                      setSelectedOption(null);
                      close();
                      router.push('/');
                    }}
                  >
                    <Plus className="size-4 text-black" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>New Chat</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}{' '}
      </div>

      {/* Chat / Research / Agents / Data / Apps icon row toggle */}
      {!hideSidebar && isLoggedIn && (
        <div className="border-b border-black/10 px-4 py-2" style={{ backgroundColor: '#F2F3F5' }}>
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
                <p>Deep Research</p>
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
                <p>Data & RAG</p>
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
                  <Puzzle className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>App Integrations</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <div
          className={cn(
            'flex flex-1 flex-col overflow-y-scroll px-4',
            hideSidebar && 'hidden',
          )}
          style={{ backgroundColor: '#F2F3F5' }}
        >
          {/* Dynamic sub-header reflecting the selected active tab history */}
          <div className="mt-4 mb-2 px-1 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {activeTab === 'bots' ? 'My Agents' : activeTab === 'research' ? 'Research History' : activeTab === 'apps' ? 'Composio Apps' : activeTab === 'data' ? 'Knowledge Bases' : 'Chat History'}
            </span>
            {activeTab === 'bots' && (
              <button
                type="button"
                onClick={() => onOpen({ type: 'add-chatbot' })}
                className="flex h-5 w-5 items-center justify-center rounded-md bg-black/5 hover:bg-black/10 text-black transition-colors"
                title="Create Custom Agent"
              >
                <Plus className="size-3.5" />
              </button>
            )}
            {activeTab === 'data' && (
              <button
                type="button"
                onClick={() => onOpen({ type: 'create-knowledge-bank-folder' })}
                className="flex h-5 w-5 items-center justify-center rounded-md bg-black/5 hover:bg-black/10 text-black transition-colors"
                title="Create Knowledge Base"
              >
                <Plus className="size-3.5" />
              </button>
            )}
          </div>
          {activeTab === 'bots' ? (
            <div className="flex-1 space-y-1 py-1 pb-4">
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
                      }}
                      className={cn(
                        "w-full flex items-center justify-between rounded-lg p-2 transition-all text-left group",
                        isSelected 
                          ? "bg-black/[0.06] border border-black/10 shadow-xs" 
                          : "hover:bg-black/[0.03] border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Avatar */}
                        <div className="flex-none h-7 w-7 rounded-md bg-white border border-black/10 flex items-center justify-center text-lg shadow-sm">
                          {bot.avatar || '🤖'}
                        </div>
                        <div className="min-w-0">
                          <h4 className={cn(
                            "text-xs font-semibold truncate",
                            isSelected ? "text-blue-600 font-bold" : "text-gray-950"
                          )}>
                            {bot.name}
                          </h4>
                          <p className="text-[10px] text-gray-500 truncate max-w-[130px]">
                            {bot.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
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
                          <p className="text-[10px] text-gray-500 truncate max-w-[130px]">
                            {app.description}
                          </p>
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
            <div className="flex-1 space-y-1 py-1 pb-4">
              {knowledgeBankFolders
                ?.filter(folder =>
                  folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  folder.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(folder => {
                  const isSelected = pathname.startsWith(`/knowledge/${folder.id}`) || (pathname === '/knowledge' && searchParams?.get('folder') === folder.id);
                  return (
                    <button
                      key={folder.id}
                      onClick={() => {
                        router.push(`/knowledge`);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between rounded-lg p-2 transition-all text-left group",
                        isSelected 
                          ? "bg-black/[0.06] border border-black/10 shadow-xs" 
                          : "hover:bg-black/[0.03] border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex-none h-7 w-7 rounded-md bg-white border border-black/10 flex items-center justify-center text-sm shadow-sm">
                          📁
                        </div>
                        <div className="min-w-0">
                          <h4 className={cn(
                            "text-xs font-semibold truncate",
                            isSelected ? "text-blue-600 font-bold" : "text-gray-950"
                          )}>
                            {folder.name}
                          </h4>
                          <p className="text-[10px] text-gray-500 truncate max-w-[130px]">
                            {folder.description || 'No description'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  );
                })}
              {(!knowledgeBankFolders || knowledgeBankFolders.filter(folder =>
                folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                folder.description.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0) && (
                <div className="py-4 text-center text-xs text-gray-500">
                  {isKnowledgeLoading ? 'Loading knowledge bases...' : 'No knowledge bases found.'}
                </div>
              )}
            </div>
          ) : (
            <ConversationsList searchQuery={searchQuery} activeTab={activeTab} />
          )}
        </div>
      )}

      {!isLoggedIn && <div className="flex flex-1 flex-col"></div>}

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
    </>
  );
};

export default LeftSideNav;
