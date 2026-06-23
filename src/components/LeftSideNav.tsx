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
  Brain,
  LayoutDashboard,
  LogOut,
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
  Microscope,
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
  Video,
  Volume2,
  ShieldAlert,
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

type SidebarTab = 'search' | 'research' | 'write' | 'code' | 'image' | 'audio' | 'video' | 'bots' | 'none' | 'account';

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

  const [activeTab, setActiveTab] = useState<SidebarTab>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [logoHovered, setLogoHovered] = useState(false);

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
    return AVAILABLE_MCP_APPS.filter(app =>
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const displayedApps = useMemo(() => {
    const baseList = searchQuery.trim() !== '' ? filteredApps : AVAILABLE_MCP_APPS;
    
    if (appsFilterTab === 'connected') {
      return baseList.filter(app => connectedAppSlugs.has(app.app_name.toLowerCase()));
    }
    
    if (searchQuery.trim() === '') {
      const connected = AVAILABLE_MCP_APPS.filter(app => connectedAppSlugs.has(app.app_name.toLowerCase()));
      const nonConnected = AVAILABLE_MCP_APPS.filter(app => !connectedAppSlugs.has(app.app_name.toLowerCase()));
      return [...connected, ...nonConnected];
    }
    
    return baseList;
  }, [searchQuery, filteredApps, connectedAppSlugs, appsFilterTab]);

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
  }, [activeConversation, selectedOption, setSelectedOption, pathname, isSuperAdmin, setActiveTab]);

  const handleTabChange = (tab: SidebarTab) => {
    setActiveTab(tab);
    if (tab === 'bots') {
      setActiveConversation(null);
      router.push('/my-chatbots');
    } else if (tab === 'search') {
      setSelectedOption(null);
      if (pathname !== '/') {
        setActiveConversation(null);
        router.push('/');
      }
    } else if (tab === 'research') {
      setSelectedOption(OPTIONS.RESEARCH);
      if (pathname !== '/') {
        setActiveConversation(null);
        router.push('/');
      }
    } else if (tab === 'write') {
      setSelectedOption(OPTIONS.DRAFT_DOCUMENT);
      if (pathname !== '/') {
        setActiveConversation(null);
        router.push('/');
      }
    } else if (tab === 'code') {
      setSelectedOption(OPTIONS.CODE);
      if (pathname !== '/') {
        setActiveConversation(null);
        router.push('/');
      }
    } else if (tab === 'image') {
      setSelectedOption(OPTIONS.IMAGE);
      if (pathname !== '/') {
        setActiveConversation(null);
        router.push('/');
      }
    } else if (tab === 'audio') {
      setSelectedOption(OPTIONS.AUDIO);
      if (pathname !== '/') {
        setActiveConversation(null);
        router.push('/');
      }
    } else if (tab === 'video') {
      setSelectedOption(OPTIONS.VIDEO);
      if (pathname !== '/') {
        setActiveConversation(null);
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
      case 'audio':
        return {
          visible: true,
          tooltip: 'New Audio',
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
          visible: true,
          tooltip: 'New Space',
          onClick: () => {
            setActiveBotId(null);
            router.push('/my-chatbots');
          },
        };
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
          'sticky top-0 z-30 h-[52px] flex items-center justify-between border-b border-black/10 dark:border-zinc-800/80 bg-[#FFFFFF] dark:bg-zinc-900 transition-colors duration-300 flex-none',
          hideSidebar ? 'justify-center px-0' : 'px-4',
          side === 'right' && 'flex-row-reverse',
        )}
      >
        <div
          className={cn(
            'flex flex-none items-center justify-center transition-all duration-300',
          )}
        >
          {hideSidebar && !isSuperAdmin ? (
            <PanelLeftClose
              className={cn(
                'size-5 cursor-pointer text-gray-600 dark:text-zinc-400 transition-transform duration-300',
                side === 'right' ? '' : 'scale-x-[-1]'
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
          !isSuperAdmin && (
            <PanelRightClose
              className={cn(
                'size-5 cursor-pointer text-gray-600 transition-transform duration-300',
                hideSidebar && 'hidden',
              )}
              onClick={toggleRightSidebar}
            />
          )
        ) : (
          !isSuperAdmin && (
            <PanelLeftClose
              className={cn(
                'size-5 cursor-pointer text-gray-600 transition-transform duration-300',
                hideSidebar && 'hidden',
              )}
              onClick={toggleLeftSidebar}
            />
          )
        )}
      </div>
      {/* Enclosed Search & Actions Row */}
      {!hideSidebar && activeTab !== 'account' && (
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
          <div className="flex flex-none items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none dark:bg-zinc-800/50",
                    activeTab === 'bots'
                      ? "bg-white dark:bg-zinc-800 border-black/20 text-black dark:text-white shadow-xs"
                      : "bg-[#F5F5F7] border-black/10 text-gray-500 hover:bg-black/[0.03] hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                  )}
                  onClick={() => handleTabChange('bots')}
                >
                  <LayoutGrid className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Spaces</p>
              </TooltipContent>
            </Tooltip>

            {plusProps.visible && (
              <div>
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
        </div>
      )}

      {/* 6-Icon Toggle Row */}
      {!hideSidebar && side !== 'right' && !isSuperAdmin && (
        <div className="h-[52px] flex items-center border-b border-black/10 dark:border-zinc-800/80 px-4 bg-[#FFFFFF] dark:bg-zinc-900 transition-colors duration-300">
          <div className="flex bg-[#F5F5F7] dark:bg-white/[0.04] p-1 rounded-xl w-full justify-between items-center gap-1 border border-black/[0.03] dark:border-white/[0.03]">
            {/* Search */}
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
                  <Globe className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Search</p>
              </TooltipContent>
            </Tooltip>

            {/* Research */}
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
                  <Microscope className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Research</p>
              </TooltipContent>
            </Tooltip>

            {/* Write */}
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

            {/* Code */}
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

            {/* Image */}
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
                <p>Design</p>
              </TooltipContent>
            </Tooltip>

            {/* Audio */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTabChange('audio')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                    activeTab === 'audio'
                      ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                  )}
                >
                  <Volume2 className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Audio</p>
              </TooltipContent>
            </Tooltip>

            {/* Video */}
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
                  <Video className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Video</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Fixed Apps Filter Toggle Button Bar */}
        <div
          className={cn(
            'flex flex-1 flex-col overflow-y-scroll px-4 bg-[#FFFFFF] dark:bg-zinc-900 transition-colors duration-300',
            hideSidebar && 'hidden',
            side === 'right' && 'pb-8',
          )}
        >
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
                (bot.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (bot.description || '').toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div className="py-4 text-center text-xs text-gray-500">
                  No workspaces found.
                </div>
              )}
            </div>
          ) : activeTab === 'search' ? (
            <div className="space-y-1 py-1 pb-4 mt-2 animate-in fade-in duration-200">
              <ConversationsList searchQuery={searchQuery} activeTab="search" />
            </div>
          ) : activeTab === 'research' ? (
            <div className="space-y-1 py-1 pb-4 mt-2 animate-in fade-in duration-200">
              <ConversationsList searchQuery={searchQuery} activeTab="research" />
            </div>
          ) : activeTab === 'write' ? (
            <div className="space-y-1 py-1 pb-4 mt-2 animate-in fade-in duration-200">
              <ConversationsList searchQuery={searchQuery} activeTab="write" />
            </div>
          ) : activeTab === 'code' ? (
            <div className="space-y-1 py-1 pb-4 mt-2 animate-in fade-in duration-200">
              <ConversationsList searchQuery={searchQuery} activeTab="code" />
            </div>
          ) : activeTab === 'image' ? (
            <div className="space-y-1 py-1 pb-4 mt-2 animate-in fade-in duration-200">
              <ConversationsList searchQuery={searchQuery} activeTab="image" />
            </div>
          ) : activeTab === 'audio' ? (
            <div className="space-y-1 py-1 pb-4 mt-2 animate-in fade-in duration-200">
              <ConversationsList searchQuery={searchQuery} activeTab="audio" />
            </div>
          ) : activeTab === 'video' ? (
            <div className="space-y-1 py-1 pb-4 mt-2 animate-in fade-in duration-200">
              <ConversationsList searchQuery={searchQuery} activeTab="video" />
            </div>
          ) : isLoggedIn && activeTab === 'account' ? (
            <div className="mt-4 space-y-1 py-1 pb-4">
              
              {isSuperAdmin && (
                <button
                  onClick={() => router.push('/admin')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <Shield className="w-4 h-4 text-black dark:text-white" /> Owner Platform
                </button>
              )}
              {isAdmin && !isSuperAdmin && (
                <button
                  onClick={() => router.push('/admin/platform-admin')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <Shield className="w-4 h-4 text-black dark:text-white" /> Platform Admin
                </button>
              )}
              {(isAdmin || isManager) && !isSuperAdmin && (
                <button
                  onClick={() => router.push('/admin/platform-manager')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <LayoutDashboard className="w-4 h-4 text-black dark:text-white" /> Platform Manager
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/platform-memory')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <Brain className="w-4 h-4 text-black dark:text-white" /> Platform Memory
                </button>
              )}
              
              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/platform-knowledge')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <Database className="w-4 h-4 text-black dark:text-white" /> Platform Knowledge
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/instructions')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <SlidersHorizontal className="w-4 h-4 text-black dark:text-white" /> Platform Instructions
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/guardrails')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <ShieldAlert className="w-4 h-4 text-black dark:text-white" /> Platform Guardrails
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/invite-friends')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <UserPlus className="w-4 h-4 text-black dark:text-white" /> Invite Friends
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/change-password')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <KeyRound className="w-4 h-4 text-black dark:text-white" /> Change Password
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/contact-support')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <Mail className="w-4 h-4 text-black dark:text-white" /> Contact Support
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/legal')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors text-left"
                >
                  <Scale className="w-4 h-4 text-black dark:text-white" /> Legal Documents
                </button>
              )}
            </div>
          ) : null}
        </div>

      {side !== 'right' && (
        <div
          className={cn(
            'sticky bottom-0 z-30 flex flex-col w-full',
            hideSidebar && 'hidden',
          )}
          style={{ backgroundColor: '#FFFFFF' }}
        >
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
                    }}
                  >
                    Return to App
                  </Button>
                </div>
              )}
              <div className="flex h-20 w-full items-center justify-center border-t border-black/10 dark:border-zinc-800/80 p-4 py-1.5">
                <Button
                  variant="outline"
                  onClick={() => onOpen({ type: 'logout' })}
                  className="w-full transition-all duration-200 outline-none select-none cursor-pointer bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:text-white dark:hover:bg-red-700 border-transparent"
                >
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-20 w-full items-center justify-center border-t border-black/10 dark:border-zinc-800/80 p-4 py-1.5">
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
      )}
    </>
  );
};

export default LeftSideNav;
