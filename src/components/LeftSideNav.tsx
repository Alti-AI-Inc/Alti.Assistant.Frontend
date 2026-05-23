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
  Bookmark,
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
  SquareUserRound,
  User,
  Users,
  ChevronRight,
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

type SidebarTab = 'chat' | 'research' | 'apps';

const LeftSideNav = () => {
  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { mode, currentTenant } = useTenant();

  const { onOpen } = useModalStore();
  const {
    setActiveConversation,
    setSelectedOption,
    setShowStartLastMessage,
    setUserMessage,
  } = useConversationsStore();
  const { isLeftSidebarOpen, toggleLeftSidebar } = useSidebarStore();

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
    } else if (pathname === '/' || pathname.startsWith('/c/')) {
      const isResearch = useConversationsStore.getState().selectedOption === OPTIONS.RESEARCH;
      setActiveTab(isResearch ? 'research' : 'chat');
    }
  }, [pathname]);

  const handleTabChange = (tab: SidebarTab) => {
    setActiveTab(tab);
    if (tab === 'apps') {
      router.push('/apps');
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
              {/* Favorites Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black shadow-xs transition-all hover:bg-black/[0.03] hover:text-black"
                    onClick={() => {
                      router.push('/saved-chats');
                      close();
                    }}
                  >
                    <Bookmark className="size-4 text-black" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Saved Chats</p>
                </TooltipContent>
              </Tooltip>

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

      {/* Chat / Research / Apps toggle */}
      {!hideSidebar && isLoggedIn && (
        <div className="border-b border-black/10 px-4 py-2" style={{ backgroundColor: '#F2F3F5' }}>
          <div className="relative flex rounded-lg bg-black/[0.06] p-0.5">
            {/* sliding indicator */}
            <div
              className={cn(
                'absolute top-0.5 bottom-0.5 w-[calc(33.33%-2px)] rounded-md bg-white shadow-sm transition-all duration-200 ease-in-out',
                activeTab === 'chat' && 'left-0.5',
                activeTab === 'research' && 'left-[calc(33.33%+0.5px)]',
                activeTab === 'apps' && 'left-[calc(66.66%+0.5px)]',
              )}
            />
            <button
              type="button"
              onClick={() => handleTabChange('chat')}
              className={cn(
                'relative z-10 flex-1 rounded-md py-1 text-xs font-medium transition-colors duration-150',
                activeTab === 'chat' ? 'text-black' : 'text-gray-500 hover:text-gray-700',
              )}
            >
              Chat
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('research')}
              className={cn(
                'relative z-10 flex-1 rounded-md py-1 text-xs font-medium transition-colors duration-150',
                activeTab === 'research' ? 'text-black' : 'text-gray-500 hover:text-gray-700',
              )}
            >
              Research
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('apps')}
              className={cn(
                'relative z-10 flex-1 rounded-md py-1 text-xs font-medium transition-colors duration-150',
                activeTab === 'apps' ? 'text-black' : 'text-gray-500 hover:text-gray-700',
              )}
            >
              Apps
            </button>
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
              {activeTab === 'research' ? 'Research History' : activeTab === 'apps' ? 'Composio Apps' : 'Chat History'}
            </span>
          </div>
          {activeTab === 'apps' ? (
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
          ) : (
            <ConversationsList searchQuery={searchQuery} activeTab={activeTab === 'apps' ? 'chat' : activeTab} />
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
                <DropdownMenuItem onClick={() => router.push('/organizations')}>
                  <Building2 className="text-black" /> Organizations
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      mode === UserMode.TENANT && currentTenant
                        ? `/organizations/${currentTenant.id}/billing`
                        : '/billing',
                    )
                  }
                >
                  <ReceiptText className="text-black" /> Billing
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
                <DropdownMenuItem
                  onClick={() =>
                    onOpen({
                      type: 'invite',
                    })
                  }
                >
                  <SquareUserRound className="text-black" /> Invite
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
