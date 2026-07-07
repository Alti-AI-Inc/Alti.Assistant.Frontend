'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
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
  Trash2,
  Pencil,
  Users,
  UserPlus,
  UsersRound,
  ChevronRight,
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
  Palette,
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
  Blocks,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
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

type SidebarTab = 'search' | 'research' | 'write' | 'code' | 'image' | 'audio' | 'video' | 'bots' | 'tasks' | 'studio' | 'apps' | 'none' | 'account';

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
  const { isLeftSidebarOpen, toggleLeftSidebar, isRightSidebarOpen, toggleRightSidebar, toggleGlobalInbox, isGlobalInboxOpen } = useSidebarStore();
  const { bots, activeBotId, setActiveBotId, projectTab, setProjectTab, deleteBot, reorderBots, editBot } = useBotsStore();

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
  const [botToDelete, setBotToDelete] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [botToRename, setBotToRename] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  
  const [localAppsOrder, setLocalAppsOrder] = useState<APP[]>([]);
  const [draggedAppIndex, setDraggedAppIndex] = useState<number | null>(null);
  const [dragOverAppIndex, setDragOverAppIndex] = useState<number | null>(null);

  const reorderApps = (fromIdx: number, toIdx: number) => {
    const updated = [...localAppsOrder];
    const [removed] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, removed);
    setLocalAppsOrder(updated);

    const orderSlugs = updated.map(a => a.app_name.toLowerCase());
    localStorage.setItem('mcp_app_order', JSON.stringify(orderSlugs));
  };

  useEffect(() => {
    if (botToRename) {
      const targetBot = bots.find(b => b.id === botToRename);
      setRenameValue(targetBot?.name || '');
    }
  }, [botToRename, bots]);

  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedTasks = localStorage.getItem('alti_automations');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks([]);
      }
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('alti_automations_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('alti_automations_updated', handleStorageChange);
    };
  }, [pathname]);

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

      // Seed sample apps for testing if this is meram.michael@gmail.com
      if (data?.user?.email?.toLowerCase() === 'meram.michael@gmail.com') {
        const sampleSlugs = ['slack', 'google-maps', 'postgres', 'evernote'];
        sampleSlugs.forEach(slug => activeSlugs.add(slug));
      }

      setConnectedAppSlugs(activeSlugs);

      // Resolve connected apps
      const connected = allApps.filter(app => activeSlugs.has(app.app_name.toLowerCase()));
      
      let savedOrder: string[] = [];
      try {
        const stored = localStorage.getItem('mcp_app_order');
        if (stored) savedOrder = JSON.parse(stored);
      } catch (e) {}

      let sorted: APP[] = [];
      if (savedOrder && savedOrder.length > 0) {
        savedOrder.forEach(slug => {
          const match = connected.find(a => a.app_name.toLowerCase() === slug.toLowerCase());
          if (match) sorted.push(match);
        });
        const remaining = connected.filter(a => !savedOrder.includes(a.app_name.toLowerCase()));
        remaining.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
        sorted = [...sorted, ...remaining];
      } else {
        sorted = connected.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
      }
      setLocalAppsOrder(sorted);
    }
  }, [connections, data?.user?.email]);

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
    if (pathname === '/spaces' || pathname.startsWith('/spaces')) {
      setActiveTab('bots');
    } else if (pathname === '/tasks' || pathname.startsWith('/tasks')) {
      setActiveTab('tasks');
    } else if (pathname === '/apps' || pathname.startsWith('/apps')) {
      setActiveTab('apps');
    } else if (pathname === '/' || pathname.startsWith('/c/')) {
      setActiveTab('search');
    } else if (pathname === '/studio' || pathname.startsWith('/studio/')) {
      setActiveTab('studio');
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
  }, [pathname, isLoggedIn]);

  // Reset active tab to search when user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      setActiveTab('search');
    }
  }, [isLoggedIn]);

  // Synchronize tab and option selection with activeConversation.is_deep_search
  useEffect(() => {
    // We no longer sync the sidebar activeTab with the active conversation type
    // to keep the chat history as one unified list.
  }, []);

  const handleTabChange = (tab: SidebarTab) => {
    setActiveTab(tab);
    if (tab === 'bots') {
      setActiveConversation(null);
      router.push('/spaces');
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
    } else if (tab === 'studio') {
      setSelectedOption(OPTIONS.CODE);
      if (pathname !== '/studio') {
        setActiveConversation(null);
        router.push('/studio');
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
    } else if (tab === 'apps') {
      setActiveConversation(null);
      router.push('/apps');
    } else if (tab === 'tasks') {
      setActiveConversation(null);
      router.push('/tasks');
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
      case 'tasks':
        return {
          visible: true,
          tooltip: 'New Task',
          onClick: () => {
            router.push('/tasks');
            window.dispatchEvent(new Event('alti_new_task_click'));
          },
        };
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
      case 'studio':
        return {
          visible: true,
          tooltip: 'New Studio',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(OPTIONS.CODE);
            close();
            router.push('/studio');
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
            router.push('/spaces');
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
          'sticky top-0 z-30 h-[52px] flex items-center justify-between border-b border-zinc-800/60 bg-[#0c1120] dark:bg-[#0c1120] transition-colors duration-300 flex-none',
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
                'size-5 cursor-pointer text-zinc-400 hover:text-white transition-transform duration-300',
                side === 'right' ? '' : 'scale-x-[-1]'
              )}
              onClick={side === 'right' ? toggleRightSidebar : toggleLeftSidebar}
            />
          ) : (
            <Link href="/" className="flex items-center pt-[2px]">
              <Image
                src="/assets/logo-icon.png"
                alt="logo"
                height={20}
                width={20}
                className="brightness-0 invert"
              />
            </Link>
          )}
        </div>

        {side === 'right' ? (
          !isSuperAdmin && (
            <PanelRightClose
              className={cn(
                'size-5 cursor-pointer text-zinc-400 hover:text-white transition-transform duration-300',
                hideSidebar && 'hidden',
              )}
              onClick={toggleRightSidebar}
            />
          )
        ) : (
          !isSuperAdmin && (
            <PanelLeftClose
              className={cn(
                'size-5 cursor-pointer text-zinc-400 hover:text-white transition-transform duration-300',
                hideSidebar && 'hidden',
              )}
              onClick={toggleLeftSidebar}
            />
          )
        )}
      </div>
      {/* 6-Icon Toggle Row / Space Toggles */}
      {!hideSidebar && side !== 'right' && !isSuperAdmin && activeTab !== 'account' && (
        <div className="pt-3 px-4 flex-none bg-[#0c1120] dark:bg-[#0c1120] transition-colors duration-300">
          <div className="space-y-1.5 w-full">
            {/* Chat */}
            <button
              type="button"
              onClick={() => handleTabChange('search')}
              className={cn(
                'group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none',
                activeTab === 'search'
                  ? 'bg-white/12 border-white/10 text-white font-semibold shadow-xs'
                  : 'bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white',
              )}
            >
              <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Assistant</span>
            </button>

            {/* Studio */}
            <button
              type="button"
              onClick={() => handleTabChange('studio')}
              className={cn(
                'group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none',
                activeTab === 'studio'
                  ? 'bg-white/12 border-white/10 text-white font-semibold shadow-xs'
                  : 'bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white',
              )}
            >
              <Palette className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Studio</span>
            </button>

            {/* Apps */}
            <button
              type="button"
              onClick={() => handleTabChange('apps')}
              className={cn(
                'group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none',
                activeTab === 'apps'
                  ? 'bg-white/12 border-white/10 text-white font-semibold shadow-xs'
                  : 'bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white',
              )}
            >
              <Blocks className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Apps</span>
            </button>

            {/* Tasks */}
            <button
              type="button"
              onClick={() => handleTabChange('tasks')}
              className={cn(
                'group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none',
                activeTab === 'tasks'
                  ? 'bg-white/12 border-white/10 text-white font-semibold shadow-xs'
                  : 'bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white',
              )}
            >
              <ListTodo className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Tasks</span>
            </button>

            {/* Spaces */}
            <button
              type="button"
              onClick={() => handleTabChange('bots')}
              className={cn(
                'group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none',
                activeTab === 'bots'
                  ? 'bg-white/12 border-white/10 text-white font-semibold shadow-xs'
                  : 'bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white',
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Spaces</span>
            </button>
          </div>
        </div>
      )}

      {/* Enclosed Search & Actions Row */}
      {!hideSidebar && activeTab !== 'account' && (
        <div className="pt-1.5 pb-1.5 flex items-center px-4 bg-[#0c1120] dark:bg-[#0c1120] transition-all duration-300 flex-none w-full">
          <div className="flex h-9 w-full items-center rounded-lg border border-white/[0.04] bg-white/[0.06] shadow-xs overflow-hidden focus-within:ring-1 focus-within:ring-white/20 transition-all duration-150">
            {/* Search segment */}
            <div className="flex flex-1 items-center gap-2.5 px-3 h-full">
              <Search className="size-3.5 flex-none text-zinc-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-zinc-100 outline-none placeholder:text-zinc-400"
              />
            </div>

            {/* Vertical Separator */}
            <div className="w-px h-4 bg-white/10 flex-none" />

            {/* Inbox segment */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex h-full w-9 items-center justify-center transition-all hover:bg-white/[0.06] text-white focus:outline-none",
                    pathname === '/inbox' && "bg-white/[0.08]"
                  )}
                  onClick={() => router.push('/inbox')}
                >
                  <Inbox className="size-3.5 text-white" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="rounded-lg bg-zinc-950/95 border border-white/10 text-white text-xs font-semibold px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-b-2 border-b-indigo-500 select-none">
                Inbox
              </TooltipContent>
            </Tooltip>

            {/* Vertical Separator (only if plus is visible) */}
            {plusProps.visible && (
              <div className="w-px h-4 bg-white/10 flex-none" />
            )}

            {/* Plus segment */}
            {plusProps.visible && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="flex h-full w-9 items-center justify-center transition-all hover:bg-white/[0.06] text-white focus:outline-none"
                    onClick={plusProps.onClick}
                  >
                    <Plus className="size-3.5 text-white" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="rounded-lg bg-zinc-950/95 border border-white/10 text-white text-xs font-semibold px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-b-2 border-b-indigo-500 select-none">
                  {plusProps.tooltip}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      )}


      {/* Fixed Apps Filter Toggle Button Bar */}
        <div
          className={cn(
            'flex flex-1 flex-col overflow-y-scroll px-4 bg-[#0c1120] dark:bg-[#0c1120] transition-colors duration-300',
            hideSidebar && 'hidden',
            side === 'right' && 'pb-8',
          )}
        >
          {activeTab === 'bots' ? (
            <div className="space-y-1.5 pb-4">
              {bots
                .map((bot, idx) => ({ bot, idx }))
                .filter(({ bot }) =>
                  (bot.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (bot.description || '').toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(({ bot, idx }) => {
                  const isSelected = activeBotId === bot.id && pathname === '/spaces';
                  const isBeingDragged = draggedIndex === idx;
                  const showTopLine = draggedIndex !== null && dragOverIndex === idx && draggedIndex > idx;
                  const showBottomLine = draggedIndex !== null && dragOverIndex === idx && draggedIndex < idx;

                  return (
                    <div key={bot.id}>
                      {showTopLine && (
                        <div className="h-[2px] w-full bg-indigo-500 rounded-full mb-1 animate-pulse" />
                      )}
                      <div
                        draggable
                        onDragStart={(e) => {
                          setDraggedIndex(idx);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (draggedIndex !== idx) {
                            setDragOverIndex(idx);
                          }
                        }}
                        onDragLeave={() => {
                          setDragOverIndex(null);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedIndex !== null && draggedIndex !== idx) {
                            reorderBots(draggedIndex, idx);
                          }
                          setDraggedIndex(null);
                          setDragOverIndex(null);
                        }}
                        onDragEnd={() => {
                          setDraggedIndex(null);
                          setDragOverIndex(null);
                        }}
                        className={cn(
                          "group flex h-9 w-full items-center justify-between rounded-lg text-xs font-normal text-left transition-all duration-150 border mb-1.5 cursor-grab active:cursor-grabbing select-none",
                          isSelected 
                            ? "bg-white/12 border-white/10 text-white font-semibold shadow-xs" 
                            : "bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white",
                          isBeingDragged && "opacity-40 scale-95 border-dashed border-zinc-500 bg-white/[0.02]"
                        )}
                      >
                        <span
                          className="flex-1 cursor-pointer truncate px-3 py-2 flex items-center gap-2.5"
                          onClick={() => {
                            setSelectedOption(null);
                            setActiveBotId(bot.id);
                            router.push(`/spaces?bot=${bot.id}`);
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
                              "mr-2 rotate-90 h-3.5 w-3.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-colors",
                              isSelected ? "text-white" : "text-zinc-400 group-hover:text-zinc-100"
                            )} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="rounded-2xl" align="end">
                            <DropdownMenuItem
                              className="text-zinc-700 dark:text-zinc-200 focus:bg-zinc-100 dark:focus:bg-zinc-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBotToRename(bot.id);
                              }}
                            >
                              <Pencil className="h-4 w-4 mr-2" /> Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="border-black/5 dark:border-white/5" />
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-600 focus:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBotToDelete(bot.id);
                              }}
                            >
                              <Trash2 className="text-red-500 h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {showBottomLine && (
                        <div className="h-[2px] w-full bg-indigo-500 rounded-full mt-1 mb-1.5 animate-pulse" />
                      )}
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
          ) : activeTab === 'apps' ? (
            <div className="space-y-1.5 pb-4 animate-in fade-in duration-200">
              
              {/* Connect Apps row */}
              <div
                onClick={() => router.push('/appsx')}
                className="group flex h-9 w-full items-center justify-between rounded-lg text-xs font-normal text-left transition-all duration-150 border border-white/[0.04] bg-white/[0.06] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white cursor-pointer select-none mb-2 px-3 py-2 gap-2.5"
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Blocks className="h-4 w-4 text-zinc-400 group-hover:text-zinc-200 transition-colors flex-shrink-0" />
                  <span className="truncate">Connect Apps</span>
                </span>
                <ChevronRight className="h-3.5 w-3.5 opacity-60 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
              </div>

              {localAppsOrder
                .map((app, idx) => ({ app, idx }))
                .filter(({ app }) =>
                  (app.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (app.app_name || '').toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(({ app, idx }) => {
                  const isSelected = pathname === '/apps' && searchParams?.get('app')?.toLowerCase() === app.app_name.toLowerCase();
                  const isBeingDragged = draggedAppIndex === idx;
                  const showTopLine = draggedAppIndex !== null && dragOverAppIndex === idx && draggedAppIndex > idx;
                  const showBottomLine = draggedAppIndex !== null && dragOverAppIndex === idx && draggedAppIndex < idx;

                  return (
                    <div key={app.app_name}>
                      {showTopLine && (
                        <div className="h-[2px] w-full bg-indigo-500 rounded-full mb-1 animate-pulse" />
                      )}
                      <div
                        draggable
                        onDragStart={(e) => {
                          setDraggedAppIndex(idx);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (draggedAppIndex !== idx) {
                            setDragOverAppIndex(idx);
                          }
                        }}
                        onDragLeave={() => {
                          setDragOverAppIndex(null);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedAppIndex !== null && draggedAppIndex !== idx) {
                            reorderApps(draggedAppIndex, idx);
                          }
                          setDraggedAppIndex(null);
                          setDragOverAppIndex(null);
                        }}
                        onDragEnd={() => {
                          setDraggedAppIndex(null);
                          setDragOverAppIndex(null);
                        }}
                        className={cn(
                          "group flex h-9 w-full items-center justify-between rounded-lg text-xs font-normal text-left transition-all duration-150 border mb-1.5 cursor-grab active:cursor-grabbing select-none",
                          isSelected 
                            ? "bg-white/12 border-white/10 text-white font-semibold shadow-xs" 
                            : "bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white",
                          isBeingDragged && "opacity-40 scale-95 border-dashed border-zinc-500 bg-white/[0.02]"
                        )}
                      >
                        <span
                          className="flex-1 cursor-pointer truncate px-3 py-2 flex items-center gap-2.5"
                          onClick={() => {
                            router.push(`/apps?app=${app.app_name}`);
                          }}
                        >
                          <div className="h-4 w-4 rounded overflow-hidden bg-white p-0.5 flex items-center justify-center flex-shrink-0">
                            <AppImage src={app.image} alt={app.title} className="h-full w-full object-contain" fallbackSizeClass="text-[8px]" />
                          </div>
                          <span className="truncate">{app.title}</span>
                        </span>
                        
                        {/* Glow connected active badging */}
                        <div className="mr-3 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                        </div>
                      </div>
                      {showBottomLine && (
                        <div className="h-[2px] w-full bg-indigo-500 rounded-full mt-1 mb-1.5 animate-pulse" />
                      )}
                    </div>
                  );
                })}
              {localAppsOrder.filter(app =>
                (app.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (app.app_name || '').toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div className="py-8 text-center text-xs text-gray-400 dark:text-zinc-500 italic">
                  No connected apps found.
                </div>
              )}
            </div>
          ) : activeTab === 'tasks' ? (
            <div className="space-y-1.5 pb-4 animate-in fade-in duration-200">
              {tasks.filter(task => 
                (task.prompt || '').toLowerCase().includes(searchQuery.toLowerCase())
              ).map((task) => (
                <button
                  key={task.id}
                  onClick={() => {
                    router.push(`/tasks?taskId=${task.id}`);
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
            <div className="space-y-1.5 pb-4 animate-in fade-in duration-200">
              <ConversationsList searchQuery={searchQuery} activeTab="search" />
            </div>
          ) : activeTab === 'studio' ? (
            <div className="space-y-1.5 pb-4 animate-in fade-in duration-200">
              <ConversationsList searchQuery={searchQuery} activeTab="studio" />
            </div>
          ) : isLoggedIn && activeTab === 'account' ? (
            <div className="mt-4 space-y-1.5 py-1 pb-4">
              
              {isSuperAdmin && (
                <button
                  onClick={() => router.push('/admin')}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white"
                >
                  <Shield className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Owner Platform</span>
                </button>
              )}
              {isAdmin && !isSuperAdmin && (
                <button
                  onClick={() => router.push('/admin/platform-admin')}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white"
                >
                  <Shield className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Platform Admin</span>
                </button>
              )}
              {(isAdmin || isManager) && !isSuperAdmin && (
                <button
                  onClick={() => router.push('/admin/platform-manager')}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Platform Manager</span>
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/appsx')}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white"
                >
                  <Blocks className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Platform Connectors</span>
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/platform-memory')}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white"
                >
                  <Brain className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Platform Memory</span>
                </button>
              )}
              
              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/platform-knowledge')}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white"
                >
                  <Database className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Platform Knowledge</span>
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/instructions')}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Platform Instructions</span>
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/guardrails')}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white"
                >
                  <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Platform Guardrails</span>
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/invite-friends')}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white"
                >
                  <UserPlus className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Invite Friends</span>
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/change-password')}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white"
                >
                  <KeyRound className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Change Password</span>
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/contact-support')}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white"
                >
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Contact Support</span>
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => router.push('/legal')}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none bg-white/[0.06] border-white/[0.04] text-zinc-300 hover:bg-white/[0.10] hover:border-white/5 hover:text-white"
                >
                  <Scale className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Legal Documents</span>
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
          style={{ backgroundColor: '#0c1120' }}
        >
          {isLoggedIn && activeTab === 'account' ? (
            <div className="flex flex-col w-full">
              {!isSuperAdmin && (
                <div className="flex h-20 w-full items-center justify-center border-t border-zinc-800/60 p-4 py-1.5">
                  <Button
                    variant="default"
                    className="w-full justify-center gap-2 bg-white text-black hover:bg-white/90 border border-transparent"
                    onClick={() => {
                      setActiveTab('search');
                      router.push('/');
                    }}
                  >
                    Return to App
                  </Button>
                </div>
              )}
              <div className="flex h-20 w-full items-center justify-center border-t border-zinc-800/60 p-4 py-1.5">
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
            <div className="flex h-20 w-full items-center justify-center border-t border-zinc-800/60 p-4 py-1.5">
            {!isLoggedIn ? (
              <div className="flex w-full items-center gap-2">
                <Button
                  variant="default"
                  className="flex-1 bg-white px-0 text-black hover:bg-white/90"
                  asChild
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  variant="default"
                  className="flex-1 bg-white px-0 text-black hover:bg-white/90"
                  asChild
                >
                  <Link href="/register">Register</Link>
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
      )}

      {/* Delete Space Dialog */}
      <Dialog open={botToDelete !== null} onOpenChange={(open) => !open && setBotToDelete(null)}>
        <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] sm:max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
          <div className="flex flex-col">
            <div className="flex items-center justify-center pt-8 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>
            </div>
            
            <div className="px-6 text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Delete Space</h2>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Are you sure you want to remove this space? This action cannot be undone.
              </p>
            </div>

            <div className="mt-8 flex border-t border-gray-100 dark:border-zinc-800">
              <DialogClose asChild>
                <button
                  type="button"
                  className="flex-1 py-4 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors focus:outline-none focus:ring-0"
                >
                  Cancel
                </button>
              </DialogClose>
              <div className="w-[1px] bg-gray-100 dark:bg-zinc-800" />
              <button
                type="button"
                className="flex-1 py-4 text-sm font-semibold text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors focus:outline-none focus:ring-0"
                onClick={async () => {
                  if (botToDelete) {
                    // Try to delete bot using backend API, otherwise fallback to store
                    const token = data?.accessToken;
                    if (token) {
                      try {
                        const apiUrl = buildApiUrl(`/chatbots/${botToDelete}`);
                        await fetch(apiUrl, {
                          method: 'DELETE',
                          headers: {
                            'Authorization': `Bearer ${token}`
                          }
                        });
                      } catch (err) {
                        console.error("Failed to delete bot on backend", err);
                      }
                    }
                    deleteBot(botToDelete, token);
                    if (activeBotId === botToDelete) {
                      setActiveBotId(null);
                      router.push('/spaces');
                    }
                    setBotToDelete(null);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!botToRename} onOpenChange={() => setBotToRename(null)}>
        <DialogContent 
          className="p-6 overflow-hidden rounded-[20px] max-w-[400px] border-none shadow-xl bg-[#e1e1e1] dark:bg-zinc-955 [&>button]:hidden"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="space-y-4">
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && renameValue.trim() && botToRename) {
                  const token = data?.accessToken;
                  editBot(botToRename, { name: renameValue.trim() }, token);
                  setBotToRename(null);
                }
              }}
              placeholder="Enter space name..."
              className="w-full bg-white dark:bg-zinc-900 border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white"
            />
            <div className="flex border-t border-black/10 dark:border-white/10 h-11 -mx-6 -mb-6 mt-4">
              <button 
                className="flex-1 text-sm font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 h-full border-r border-black/10 dark:border-white/10 outline-none"
                onClick={() => setBotToRename(null)}
              >
                Cancel
              </button>
              <button 
                className="flex-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-black/5 dark:hover:bg-white/5 h-full outline-none disabled:opacity-50"
                onClick={() => {
                  if (renameValue.trim() && botToRename) {
                    const token = data?.accessToken;
                    editBot(botToRename, { name: renameValue.trim() }, token);
                    setBotToRename(null);
                  }
                }}
                disabled={!renameValue.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeftSideNav;
