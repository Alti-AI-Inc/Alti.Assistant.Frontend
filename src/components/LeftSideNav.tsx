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
  Shield,
  FileText,
  ArrowLeft,
  User,
  Users,
  UserPlus,
  UsersRound,
  ChevronRight,
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
  CreditCard,
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

type SidebarTab = 'search' | 'research' | 'write' | 'bots' | 'code' | 'image' | 'video' | 'assistant' | 'apps' | 'workflows' | 'inbox' | 'none';

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
  const { bots, activeBotId, setActiveBotId, projectTab, setProjectTab } = useBotsStore();

  const { data: inboxItems = [] } = useInboxQuery(
    data?.user?.id,
    undefined,
    false,
    data?.accessToken
  );
  
  const unreadInboxCount = inboxItems.filter(item => !item.isRead).length;

  const hideSidebar = side === 'right' ? !isRightSidebarOpen : !isLeftSidebarOpen;
  const isLoggedIn = data?.accessToken;

  const [logoHovered, setLogoHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SidebarTab>('search');



  const isAdminMode = pathname.startsWith('/admin');
  const isManagerSection = pathname.startsWith('/admin/data') || 
                           pathname.startsWith('/admin/instructions') || 
                           pathname.startsWith('/admin/guardrails') || 
                           pathname.startsWith('/admin/projects');
  const isAdminSection = !isManagerSection && isAdminMode;

  const userEmail = data?.user?.email?.toLowerCase();
  const isGlobalAdmin = data?.user?.role === 'admin' || data?.user?.role === 'super_admin';
  const isTenantOwner = mode === 'tenant' && currentTenant?.role === 'admin';
  const isTenantAdmin = mode === 'tenant' && currentTenant?.role === 'manager';

  const isAdmin = userEmail === 'admin@altihq.com' || isGlobalAdmin || isTenantOwner;
  const isManager = isGlobalAdmin || isTenantOwner || isTenantAdmin;
  const isSuperAdmin = data?.user?.role === 'super_admin';

  const searchParams = useSearchParams();
  const activeAppSlug = searchParams?.get('app');
  const activeConnectorId = searchParams?.get('connector') || 'file';

  const [connectedAppSlugs, setConnectedAppSlugs] = useState<Set<string>>(new Set());
  const [appsFilterTab, setAppsFilterTab] = useState<'all' | 'connected'>('all');

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
    const baseList = searchQuery.trim() !== '' ? filteredApps : AVAILABLE_COMPOSIO_APPS;
    
    if (appsFilterTab === 'connected') {
      return baseList.filter(app => connectedAppSlugs.has(app.app_name.toLowerCase()));
    }
    
    if (searchQuery.trim() === '') {
      const connected = AVAILABLE_COMPOSIO_APPS.filter(app => connectedAppSlugs.has(app.app_name.toLowerCase()));
      const nonConnected = AVAILABLE_COMPOSIO_APPS.filter(app => !connectedAppSlugs.has(app.app_name.toLowerCase()));
      return [...connected, ...nonConnected];
    }
    
    return baseList;
  }, [searchQuery, filteredApps, connectedAppSlugs, appsFilterTab]);

  useEffect(() => {
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
      if (selectedOption === OPTIONS.RESEARCH) {
        setActiveTab('research');
      } else if (selectedOption === OPTIONS.CODE) {
        setActiveTab('code');
      } else if (selectedOption === OPTIONS.IMAGE || selectedOption === OPTIONS.EDIT_IMAGE) {
        setActiveTab('image');
      } else if (selectedOption === OPTIONS.VIDEO) {
        setActiveTab('video');
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
      } else {
        setActiveTab('search');
      }
    } else if (pathname === '/settings' || pathname.startsWith('/settings') || pathname.startsWith('/admin') || pathname.startsWith('/knowledge') || pathname === '/legal' || pathname.startsWith('/legal')) {
      setActiveTab('none');
    }
  }, [pathname, selectedOption]);

  // Synchronize tab and option selection with activeConversation.is_deep_search
  useEffect(() => {
    if (activeConversation) {
      const isDeepSearch = !!((activeConversation as any).is_deep_search);
      if (isDeepSearch) {
        setActiveTab('search');
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
          pathname !== '/settings' &&
          !pathname.startsWith('/settings') &&
          pathname !== '/legal' &&
          !pathname.startsWith('/legal') &&
          !pathname.startsWith('/admin')
        ) {
          // If the conversation option is document/write related, keep activeTab as 'write'
          const opt = (activeConversation as any).option || selectedOption;
          if (
            opt === OPTIONS.DRAFT_DOCUMENT ||
            opt === OPTIONS.REWRITE ||
            opt === OPTIONS.TRANSLATE_DOCUMENTS ||
            opt === OPTIONS.BRAINSTORM ||
            opt === OPTIONS.GENERATE_PLAN ||
            opt === OPTIONS.REVIEW_CONTRACT ||
            opt === OPTIONS.GENERATE_REPORT
          ) {
            setActiveTab('write');
          } else if (opt === OPTIONS.RESEARCH) {
            setActiveTab('research');
          } else if (opt === OPTIONS.CODE) {
            setActiveTab('code');
          } else if (opt === OPTIONS.IMAGE || opt === OPTIONS.EDIT_IMAGE) {
            setActiveTab('image');
          } else if (opt === OPTIONS.VIDEO) {
            setActiveTab('video');
          } else {
            setActiveTab('search');
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
    } else if (tab === 'bots') {
      router.push('/my-chatbots');
    } else if (tab === 'workflows') {
      router.push('/workflows');
    } else if (tab === 'assistant') {
      router.push('/assistant');
    } else if (tab === 'inbox') {
      router.push('/inbox');
    } else if (tab === 'research') {
      setSelectedOption(OPTIONS.RESEARCH);
      if (pathname !== '/' && !pathname.startsWith('/c/')) {
        router.push('/');
      }
    } else if (tab === 'write') {
      setSelectedOption(OPTIONS.DRAFT_DOCUMENT);
      if (pathname !== '/' && !pathname.startsWith('/c/')) {
        router.push('/');
      }
    } else if (tab === 'code') {
      setSelectedOption(OPTIONS.CODE);
      if (pathname !== '/' && !pathname.startsWith('/c/')) {
        router.push('/');
      }
    } else if (tab === 'image') {
      setSelectedOption(OPTIONS.IMAGE);
      if (pathname !== '/' && !pathname.startsWith('/c/')) {
        router.push('/');
      }
    } else if (tab === 'video') {
      setSelectedOption(OPTIONS.VIDEO);
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
      case 'search':
        return {
          visible: true,
          tooltip: 'New Search',
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
      case 'write':
        return {
          visible: true,
          tooltip: 'New Document',
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
          tooltip: 'New Code',
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
          tooltip: 'New Image',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(OPTIONS.IMAGE);
            close();
            router.push('/');
          },
        };
      case 'video':
        return {
          visible: true,
          tooltip: 'New Video',
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
          visible: projectTab === 'my',
          tooltip: 'New Space',
          onClick: () => {
            setActiveBotId(null);
            router.push('/my-chatbots');
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
      case 'assistant':
        return {
          visible: true,
          tooltip: 'New Command',
          onClick: () => {
            setActiveBotId(null);
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(null);
            close();
            router.push('/assistant');
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
      <div
        className={cn(
          'sticky top-0 z-30 h-[52px] flex items-center justify-between border-b border-black/10 dark:border-zinc-800/80 px-4 bg-[#FFFFFF] dark:bg-zinc-900 transition-colors duration-300 flex-none',
          hideSidebar && 'justify-center',
          side === 'right' && 'flex-row-reverse',
        )}
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
                'size-[21px] cursor-pointer text-gray-600 dark:text-zinc-400 transition-transform duration-300',
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
      {!hideSidebar && !isAdminMode && (
        <div className="h-[52px] flex items-center justify-between gap-2 border-b border-black/10 dark:border-zinc-800/80 px-4 bg-[#FFFFFF] dark:bg-zinc-900 transition-all duration-300 flex-none">
          {/* Search Bar Input */}
          <div className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-black/10 dark:border-zinc-800/80 bg-[#F5F5F7] dark:bg-zinc-800/50 px-3 shadow-xs transition-all focus-within:ring-1 focus-within:ring-black/20 dark:focus-within:ring-white/10">
            <Search className="size-3.5 flex-none text-zinc-500 dark:text-zinc-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-black dark:text-zinc-100 outline-none placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
            />
          </div>

          {/* Action Buttons to the right */}
          {((activeTab !== 'apps') || plusProps.visible) && (
            <div className="flex flex-none items-center gap-1.5">
              {activeTab !== 'apps' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-[#F5F5F7] text-gray-500 hover:bg-black/[0.03] hover:text-gray-800 transition-all duration-200 focus:outline-none select-none dark:bg-zinc-800/50"
                      onClick={() => handleTabChange('apps')}
                    >
                      <LayoutGrid className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Apps Workspace</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {plusProps.visible && (
                <div className="animate-in fade-in zoom-in duration-200">
                  {/* Plus for Dynamic Tab Action */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-[#F5F5F7] text-black shadow-xs transition-all hover:bg-black/[0.03] hover:text-black dark:bg-zinc-800/50 dark:text-white"
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
        </div>
      )}

      {/* Chat / Projects / GCP Hub row toggle */}
      {!hideSidebar && isLoggedIn && side !== 'right' && !isAdminMode && (
        <div className="h-[52px] flex items-center border-b border-black/10 dark:border-zinc-800/80 px-4 bg-[#FFFFFF] dark:bg-zinc-900 transition-colors duration-300">
          <div className="flex bg-[#F5F5F7] dark:bg-white/[0.04] p-1 rounded-xl w-full justify-between items-center gap-1 border border-black/[0.03] dark:border-white/[0.03]">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTabChange('search')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                    activeTab === 'search'
                      ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                  )}
                >
                  <Search className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Search</p>
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
                  <Compass className="size-4" />
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
                  onClick={() => handleTabChange('write')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                    activeTab === 'write'
                      ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                  )}
                >
                  <FileText className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Write</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTabChange('code')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                    activeTab === 'code'
                      ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                  )}
                >
                  <Code2 className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Code</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTabChange('image')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                    activeTab === 'image'
                      ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                  )}
                >
                  <ImageIcon className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Image</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTabChange('video')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                    activeTab === 'video'
                      ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                  )}
                >
                  <Clapperboard className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Video</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Action Suite (Tasks, Workflows, Inbox) row */}
      {!hideSidebar && isLoggedIn && side !== 'right' && !isAdminMode && (
        <div className="h-[52px] flex items-center border-b border-black/10 dark:border-zinc-800/80 px-4 bg-[#FFFFFF] dark:bg-zinc-900 transition-colors duration-300 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex bg-[#F5F5F7] dark:bg-white/[0.04] p-1 rounded-xl w-full justify-between items-center gap-1 border border-black/[0.03] dark:border-white/[0.03]">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTabChange('bots')}
                  className={cn(
                    'flex-1 flex h-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none text-[11px] font-semibold tracking-tight',
                    activeTab === 'bots'
                      ? 'bg-white dark:bg-zinc-800 border-black/10 dark:border-zinc-700/50 text-black dark:text-white shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 dark:text-zinc-400 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-gray-800 dark:hover:text-zinc-200',
                  )}
                >
                  Spaces
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
                    'flex-1 flex h-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none text-[11px] font-semibold tracking-tight',
                    activeTab === 'assistant'
                      ? 'bg-white dark:bg-zinc-800 border-black/10 dark:border-zinc-700/50 text-black dark:text-white shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 dark:text-zinc-400 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-gray-800 dark:hover:text-zinc-200',
                  )}
                >
                  Tasks
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Tasks</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTabChange('workflows')}
                  className={cn(
                    'flex-1 flex h-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none text-[11px] font-semibold tracking-tight',
                    activeTab === 'workflows'
                      ? 'bg-white dark:bg-zinc-800 border-black/10 dark:border-zinc-700/50 text-black dark:text-white shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 dark:text-zinc-400 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-gray-800 dark:hover:text-zinc-200',
                  )}
                >
                  Flows
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Workflows</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTabChange('inbox')}
                  className={cn(
                    'flex-1 flex h-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none text-[11px] font-semibold tracking-tight',
                    activeTab === 'inbox'
                      ? 'bg-white dark:bg-zinc-800 border-black/10 dark:border-zinc-700/50 text-black dark:text-white shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 dark:text-zinc-400 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-gray-800 dark:hover:text-zinc-200',
                  )}
                >
                  <span className="relative">
                    Inbox
                    {unreadInboxCount > 0 && (
                      <span className="absolute -top-2.5 -right-2.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-1 ring-white dark:ring-zinc-800 animate-pulse">
                        {unreadInboxCount}
                      </span>
                    )}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Inbox</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Fixed Apps Filter Toggle Button Bar */}
      {!hideSidebar && isLoggedIn && activeTab === 'apps' && (
        <div className="h-[52px] flex items-center border-b border-black/10 dark:border-zinc-800/80 px-4 bg-[#FFFFFF] dark:bg-zinc-900 transition-colors select-none flex-none">
          <div className="flex p-0.5 bg-black/[0.04] dark:bg-white/[0.04] rounded-lg border border-black/5 dark:border-white/5 w-full">
            <button
              type="button"
              onClick={() => setAppsFilterTab('all')}
              className={cn(
                "flex-1 py-1.5 px-3 text-[11px] font-normal rounded-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
                appsFilterTab === 'all'
                  ? "bg-white dark:bg-zinc-800 text-gray-950 dark:text-zinc-50 shadow-xs"
                  : "text-gray-500 hover:text-gray-950 dark:hover:text-zinc-300"
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setAppsFilterTab('connected')}
              className={cn(
                "flex-1 py-1.5 px-3 text-[11px] font-normal rounded-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
                appsFilterTab === 'connected'
                  ? "bg-white dark:bg-zinc-800 text-gray-950 dark:text-zinc-50 shadow-xs"
                  : "text-gray-500 hover:text-gray-950 dark:hover:text-zinc-300"
              )}
            >
              Connected
            </button>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <div
          className={cn(
            'flex flex-1 flex-col overflow-y-scroll px-4 bg-[#FFFFFF] dark:bg-zinc-900 transition-colors duration-300',
            hideSidebar && 'hidden',
            side === 'right' && 'pb-8',
          )}
        >

          {isAdminMode ? (
            <div className="mt-4 space-y-6">
              {/* Platform Owner Section (for super_admin) */}
              {isSuperAdmin && (
                <div className="space-y-4">
                  {[
                    {
                      groupName: 'Platform',
                      items: [
                        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true }
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
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                              isActive
                                ? 'bg-black/5 text-black dark:bg-white/10 dark:text-white'
                                : 'text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {/* First Section */}
              {isAdminSection && !isSuperAdmin && (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 pb-1 select-none">
                    Admin
                  </div>
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
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                          isActive
                            ? 'bg-black/5 text-black dark:bg-white/10 dark:text-white'
                            : 'text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Second Section */}
              {isManagerSection && !isSuperAdmin && (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 pb-1 select-none">
                    Manager
                  </div>
                  {[
                    { name: 'Data', href: '/admin/data', icon: Database },
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
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                            isActive
                              ? 'bg-black/5 text-black dark:bg-white/10 dark:text-white'
                              : 'text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          {item.name}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : activeTab === 'bots' ? (
            <div className="mt-2 space-y-1 py-1 pb-4">
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
                        "group flex h-9 w-full items-center justify-between rounded-md text-xs font-normal text-black text-left transition-all",
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
                        }}
                      >
                        <Folder className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
                        <span className="truncate">{bot.name}</span>
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="focus-visible:outline-none">
                          <EllipsisVertical className="mr-2 rotate-90 h-3.5 w-3.5 text-black opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-2xl">
                          <DropdownMenuItem
                            onClick={() => {
                              setActiveBotId(bot.id);
                              router.push(`/my-chatbots?bot=${bot.id}`);
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
            <div className="mt-2 space-y-1 py-1 pb-4">
              {displayedApps.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-500">
                  {appsFilterTab === 'connected' ? "No connected integrations found." : "No integrations found."}
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
                              "text-xs font-normal truncate",
                              isSelected ? "text-blue-600 font-medium" : "text-gray-950"
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
          ) : activeTab === 'workflows' ? (
            <div className="mt-2 space-y-1 py-1 pb-4">
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
                      "group flex h-9 w-full items-center justify-between rounded-md text-xs font-normal text-black text-left transition-all",
                      isSelected 
                        ? "bg-black/10" 
                        : "hover:bg-black/5"
                    )}
                  >
                    <span
                      className="flex-1 cursor-pointer truncate px-3 py-2 flex items-center gap-2.5"
                      onClick={() => {
                        router.push(`/workflows?wf=${wf.id}`);
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
                        <span className="text-[10px] text-gray-500 dark:text-zinc-400 truncate mt-0.5 ml-3">
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
          ) : activeTab === 'search' || activeTab === 'write' || activeTab === 'assistant' ? (
            <ConversationsList searchQuery={searchQuery} activeTab={activeTab === 'assistant' ? 'assistant' : activeTab as any} />
          ) : null}
        </div>
      )}

      {!isLoggedIn && <div className="flex flex-1 flex-col bg-[#FFFFFF] dark:bg-zinc-900 transition-colors duration-300"></div>}

      {side !== 'right' && (
        <div
          className={cn(
            'sticky bottom-0 z-30 flex flex-col w-full',
            hideSidebar && 'hidden',
          )}
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {isAdminMode && !isSuperAdmin && (
            <div className="flex h-20 w-full items-center justify-center border-t border-black/10 p-4 py-1.5">
              <Button
                variant="outline"
                className="w-full justify-center gap-2"
                onClick={() => router.push('/')}
              >
                Return to App
              </Button>
            </div>
          )}
          <div className="flex h-20 w-full items-center justify-center border-t border-black/10 p-4 py-1.5">
          {!isLoggedIn ? (
            <div className="flex w-full items-center gap-2">
              <Button
                variant="default"
                className="flex-1 bg-black px-0 text-white hover:bg-black/90"
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-black px-0 text-white hover:bg-black/90"
                asChild
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full bg-[#F5F5F7] hover:bg-[#EAEAEB] dark:bg-zinc-800 dark:hover:bg-zinc-700/80">
                  My Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[var(--radix-dropdown-menu-trigger-width)]"
                align="start"
              >
                <DropdownMenuGroup>
                  {isSuperAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/admin')}>
                      <Shield className="text-black" /> Owner Dashboard
                    </DropdownMenuItem>
                  )}
                  {isAdmin && !isSuperAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/admin/members')}>
                      <Shield className="text-black" /> Admin
                    </DropdownMenuItem>
                  )}
                  {(isAdmin || isManager) && !isSuperAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/admin/data')}>
                      <LayoutDashboard className="text-black" /> Manager
                    </DropdownMenuItem>
                  )}

                  {!isSuperAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/legal')}>
                      <Scale className="text-black" /> Legal
                    </DropdownMenuItem>
                  )}
                  {!isSuperAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/settings')}>
                      <Settings className="text-black" /> Settings
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="rounded-xl"
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
      )}
    </>
  );
};

export default LeftSideNav;
