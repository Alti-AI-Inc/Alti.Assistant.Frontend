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
  DialogClose,
} from '@/components/ui/dialog';
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
  Palette,
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
  Pencil,
  Trash2,
  Music,
  PenTool,
  ClipboardCheck,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
import { createKnowledgeBaseAction } from '@/actions/knowledgeBaseAction';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useSidebarStore } from '@/stores/useSidebarStore';

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

type SidebarTab = 'search' | 'research' | 'write' | 'code' | 'image' | 'audio' | 'video' | 'bots' | 'tasks' | 'apps' | 'none' | 'account';

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
  const { bots, activeBotId, setActiveBotId, projectTab, setProjectTab, reorderBots, editBot, deleteBot, threads, activeBotThreadId, setActiveBotThreadId, deleteThread, addBotAsync } = useBotsStore();
  const { isRightSidebarOpen, toggleRightSidebar, toggleGlobalInbox, isGlobalInboxOpen } = useSidebarStore();
  
  const { data: inboxItems = [] } = useInboxQuery(
    data?.user?.id,
    undefined,
    false,
    data?.accessToken
  );
  
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);

  const handleCreateSpace = async () => {
    if (!newSpaceName.trim()) return;
    setIsCreatingSpace(true);
    try {
      let backendId = '';
      const token = data?.accessToken;
      if (token) {
        const kbResponse = await createKnowledgeBaseAction(newSpaceName.trim(), token);
        if (kbResponse.success && kbResponse.data?.id) {
          backendId = kbResponse.data.id;
        }
      }
      const newBot = await addBotAsync({
        name: newSpaceName.trim(),
        description: `Custom Project Workspace: ${newSpaceName.trim()}`,
        instructions: "",
        model: 'Gemini 1.5 Pro',
        avatar: '🤖',
        guardrails: "",
        data: backendId || undefined,
        isShared: false,
      }, token || undefined);

      setIsCreateSpaceOpen(false);
      setNewSpaceName('');
      setActiveBotId(newBot.id);
      router.push(`/spaces?bot=${newBot.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to create space');
    } finally {
      setIsCreatingSpace(false);
    }
  };

  const unreadInboxCount = inboxItems.filter(item => !item.isRead).length;

  const [activeTab, setActiveTab] = useState<SidebarTab>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [botToDelete, setBotToDelete] = useState<string | null>(null);
  const [botToRename, setBotToRename] = useState<string | null>(null);

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
  const [renameValue, setRenameValue] = useState('');

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
    if (pathname === '/spaces' || pathname.startsWith('/spaces')) {
      setActiveTab('search');
    } else if (pathname === '/tasks' || pathname.startsWith('/tasks')) {
      setActiveTab('search');
    } else if (pathname === '/apps' || pathname.startsWith('/apps')) {
      setActiveTab('search');
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
          pathname !== '/spaces' &&
          !pathname.startsWith('/spaces') &&
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
    const targetPath = isLoggedIn ? '/c/new-chat' : '/';
    setActiveTab(tab);
    if (tab === 'bots') {
      setActiveConversation(null);
      router.push('/spaces');
      close();
    } else if (tab === 'search') {
      setSelectedOption(null);
      if (pathname !== targetPath) {
        setActiveConversation(null);
        router.push(targetPath);
      }
      close();
    } else if (tab === 'research') {
      setSelectedOption(OPTIONS.RESEARCH);
      if (pathname !== targetPath) {
        setActiveConversation(null);
        router.push(targetPath);
      }
      close();
    } else if (tab === 'write') {
      setSelectedOption(OPTIONS.DRAFT_DOCUMENT);
      if (pathname !== targetPath) {
        setActiveConversation(null);
        router.push(targetPath);
      }
      close();

    } else if (tab === 'code') {
      setSelectedOption(OPTIONS.CODE);
      if (pathname !== targetPath) {
        setActiveConversation(null);
        router.push(targetPath);
      }
      close();
    } else if (tab === 'image') {
      setSelectedOption(OPTIONS.IMAGE);
      if (pathname !== targetPath) {
        setActiveConversation(null);
        router.push(targetPath);
      }
      close();
    } else if (tab === 'audio') {
      setSelectedOption(OPTIONS.AUDIO);
      if (pathname !== targetPath) {
        setActiveConversation(null);
        router.push(targetPath);
      }
      close();
    } else if (tab === 'apps') {
      setActiveConversation(null);
      router.push('/apps');
      close();
    } else if (tab === 'tasks') {
      setActiveConversation(null);
      router.push('/tasks');
      close();
    } else if (tab === 'video') {
      setSelectedOption(OPTIONS.VIDEO);
      if (pathname !== targetPath) {
        setActiveConversation(null);
        router.push(targetPath);
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
            window.dispatchEvent(new Event('alti_new_task_click'));
            close();
          },
        };
      case 'search':
        return {
          visible: true,
          label: 'New Chat',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(null);
            close();
            router.push(isLoggedIn ? '/c/new-chat' : '/');
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
            router.push(isLoggedIn ? '/c/new-chat' : '/');
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
            router.push(isLoggedIn ? '/c/new-chat' : '/');
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
            router.push(isLoggedIn ? '/c/new-chat' : '/');
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
            router.push(isLoggedIn ? '/c/new-chat' : '/');
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
            router.push(isLoggedIn ? '/c/new-chat' : '/');
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
            router.push(isLoggedIn ? '/c/new-chat' : '/');
          },
        };
      case 'bots':
        return {
          visible: true,
          label: 'New Space',
          onClick: () => {
            setActiveBotId(null);
            router.push('/spaces');
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

  const getThreadIcon = (title: string, isSelected: boolean) => {
    const iconColorClass = isSelected
      ? "h-3.5 w-3.5 text-white flex-shrink-0"
      : "h-3.5 w-3.5 text-[#8080ff] flex-shrink-0 group-hover:text-white transition-colors";

    const lower = (title || '').toLowerCase();
    
    if (lower.includes('image') || lower.includes('art') || lower.includes('draw') || lower.includes('logo') || lower.includes('paint') || lower.includes('picture') || lower.includes('photo') || lower.includes('canvas')) {
      return <ImageIcon className={iconColorClass} />;
    }
    if (lower.includes('video') || lower.includes('movie') || lower.includes('clip') || lower.includes('animate') || lower.includes('mp4')) {
      return <Video className={iconColorClass} />;
    }
    if (lower.includes('audio') || lower.includes('voice') || lower.includes('music') || lower.includes('sound') || lower.includes('transcribe') || lower.includes('speech') || lower.includes('mp3')) {
      return <Music className={iconColorClass} />;
    }
    if (lower.includes('code') || lower.includes('debug') || lower.includes('python') || lower.includes('rust') || lower.includes('js') || lower.includes('ts') || lower.includes('html') || lower.includes('css')) {
      return <Code2 className={iconColorClass} />;
    }
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
  };

  const getSpaceInitials = (name: string) => {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0].substring(0, 1) + words[1].substring(0, 1)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const plusProps = getPlusButtonProps();

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Column 1: Spaces Switcher (Slack style) */}
      <div className="w-[60px] h-full bg-[#0c1120] border-r border-zinc-800/60 flex flex-col items-center pt-4 gap-3 select-none flex-none">
        {/* Alti Assistant Home Button */}
        <div className="relative w-full flex flex-col items-center">
          <div
            className="absolute left-0 w-1 h-8 bg-white rounded-r-md transition-all duration-200 top-1.5"
            style={{ opacity: activeBotId === null ? 1 : 0 }}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  setActiveBotId(null);
                  setSelectedOption(null);
                  router.push(isLoggedIn ? '/c/new-chat' : '/');
                  close();
                }}
                className={cn(
                  "relative size-10 flex items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer text-white",
                  activeBotId === null
                    ? "bg-[#0000ff]/15 border-[#0000ff] shadow-[0_0_20px_rgba(0,0,255,0.55)]"
                    : "bg-[#0000ff]/10 border-[#0000ff]/35 hover:rounded-2xl hover:bg-[#0000ff]/20 hover:border-[#0000ff]/50 hover:shadow-[0_0_15px_rgba(0,0,255,0.35)]"
                )}
              >
                <img src="/assets/logo-icon.png" alt="Alti Brand Logo" className="size-6 object-contain brightness-0 invert" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-zinc-950 border border-white/10 text-white text-xs font-semibold px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-b-2 border-b-white select-none">
              Inso AI
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Spaces Scrollable Area */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col items-center gap-3 no-scrollbar py-1">
          {bots.map((bot, idx) => {
            const isSelected = activeBotId === bot.id && (pathname === '/spaces' || pathname.startsWith('/spaces'));
            const isBeingDragged = draggedIndex === idx;
            const showTopLine = draggedIndex !== null && dragOverIndex === idx && draggedIndex > idx;
            const showBottomLine = draggedIndex !== null && dragOverIndex === idx && draggedIndex < idx;

            return (
              <div
                key={bot.id}
                className="relative w-full flex flex-col items-center"
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
              >
                {showTopLine && (
                  <div className="h-[2px] w-8 bg-indigo-500 rounded-full mb-1 animate-pulse" />
                )}

                {/* Active Indicator Line */}
                <div
                  className="absolute left-0 w-1 h-8 bg-white rounded-r-md transition-all duration-200 top-1.5"
                  style={{ opacity: isSelected ? 1 : 0 }}
                />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        setSelectedOption(null);
                        setActiveBotId(bot.id);
                        router.push(`/spaces?bot=${bot.id}`);
                        close();
                      }}
                      className={cn(
                        "relative size-10 flex items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer text-sm font-semibold text-white",
                        isSelected
                          ? "bg-[#0000ff]/15 border-[#0000ff] shadow-[0_0_20px_rgba(0,0,255,0.55)]"
                          : "bg-[#0000ff]/10 border-[#0000ff]/35 hover:rounded-2xl hover:bg-[#0000ff]/20 hover:border-[#0000ff]/50 hover:shadow-[0_0_15px_rgba(0,0,255,0.35)]",
                        isBeingDragged && "opacity-40"
                      )}
                    >
                      {getSpaceInitials(bot.name)}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-zinc-950 border border-white/10 text-white text-xs font-semibold px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-b-2 border-b-white max-w-[200px] select-none">
                    <div className="font-bold">{bot.name}</div>
                  </TooltipContent>
                </Tooltip>

                {showBottomLine && (
                  <div className="h-[2px] w-8 bg-indigo-500 rounded-full mt-1 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Area for Spaces column */}
        <div className="sticky bottom-0 z-30 flex items-center justify-center w-full bg-[#0c1120] border-t border-zinc-800/60 py-1.5 flex-none h-[92px]">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  setNewSpaceName('');
                  setIsCreateSpaceOpen(true);
                  close();
                }}
                className="relative size-9 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 text-zinc-900 dark:text-zinc-100 shadow-sm cursor-pointer transition-all duration-200"
              >
                <Plus className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-zinc-950 border border-white/10 text-white text-xs font-semibold px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-b-2 border-b-indigo-500 select-none">
              Create Space
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Column 2: Secondary Content navigation panel */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-[#0c1120]">
        {/* Header Row */}
        <div className="sticky top-0 z-30 h-[52px] flex items-center justify-between border-b border-zinc-800/60 bg-[#0c1120] dark:bg-[#0c1120] px-4 flex-none">
          <span className="text-sm font-semibold text-white truncate">
            {activeBotId ? (bots.find(b => b.id === activeBotId)?.name || 'Space') : 'Inso AI'}
          </span>
        </div>

        {/* Navigation Body */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {activeTab === 'account' ? (
            <div className="mt-4 space-y-1.5 py-1 px-4 pb-4 animate-in fade-in duration-200">
              {isSuperAdmin && (
                <button
                  onClick={() => { router.push('/admin'); close(); }}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-300 border mb-1.5 cursor-pointer select-none text-left focus:outline-none bg-[#0000ff]/10 border-[#0000ff]/35 text-zinc-300 hover:bg-[#0000ff]/20 hover:border-[#0000ff]/50 hover:shadow-[0_0_15px_rgba(0,0,255,0.35)] hover:text-white"
                >
                  <Shield className="h-3.5 w-3.5 flex-shrink-0 text-[#8080ff] group-hover:text-white transition-colors" />
                  <span>Owner Platform</span>
                </button>
              )}
              {isAdmin && !isSuperAdmin && (
                <button
                  onClick={() => { router.push('/admin/platform-admin'); close(); }}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-300 border mb-1.5 cursor-pointer select-none text-left focus:outline-none bg-[#0000ff]/10 border-[#0000ff]/35 text-zinc-300 hover:bg-[#0000ff]/20 hover:border-[#0000ff]/50 hover:shadow-[0_0_15px_rgba(0,0,255,0.35)] hover:text-white"
                >
                  <Shield className="h-3.5 w-3.5 flex-shrink-0 text-[#8080ff] group-hover:text-white transition-colors" />
                  <span>Platform Admin</span>
                </button>
              )}
              {(isAdmin || isManager) && !isSuperAdmin && (
                <button
                  onClick={() => { router.push('/admin/platform-manager'); close(); }}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-300 border mb-1.5 cursor-pointer select-none text-left focus:outline-none bg-[#0000ff]/10 border-[#0000ff]/35 text-zinc-300 hover:bg-[#0000ff]/20 hover:border-[#0000ff]/50 hover:shadow-[0_0_15px_rgba(0,0,255,0.35)] hover:text-white"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 flex-shrink-0 text-[#8080ff] group-hover:text-white transition-colors" />
                  <span>Platform Manager</span>
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/platform-memory'); close(); }}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-300 border mb-1.5 cursor-pointer select-none text-left focus:outline-none bg-[#0000ff]/10 border-[#0000ff]/35 text-zinc-300 hover:bg-[#0000ff]/20 hover:border-[#0000ff]/50 hover:shadow-[0_0_15px_rgba(0,0,255,0.35)] hover:text-white"
                >
                  <Brain className="h-3.5 w-3.5 flex-shrink-0 text-[#8080ff] group-hover:text-white transition-colors" />
                  <span>Platform Memory</span>
                </button>
              )}
              
              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/platform-knowledge'); close(); }}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-300 border mb-1.5 cursor-pointer select-none text-left focus:outline-none bg-[#0000ff]/10 border-[#0000ff]/35 text-zinc-300 hover:bg-[#0000ff]/20 hover:border-[#0000ff]/50 hover:shadow-[0_0_15px_rgba(0,0,255,0.35)] hover:text-white"
                >
                  <Database className="h-3.5 w-3.5 flex-shrink-0 text-[#8080ff] group-hover:text-white transition-colors" />
                  <span>Platform Knowledge</span>
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/instructions'); close(); }}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-300 border mb-1.5 cursor-pointer select-none text-left focus:outline-none bg-[#0000ff]/10 border-[#0000ff]/35 text-zinc-300 hover:bg-[#0000ff]/20 hover:border-[#0000ff]/50 hover:shadow-[0_0_15px_rgba(0,0,255,0.35)] hover:text-white"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 flex-shrink-0 text-[#8080ff] group-hover:text-white transition-colors" />
                  <span>Platform Instructions</span>
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/guardrails'); close(); }}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-300 border mb-1.5 cursor-pointer select-none text-left focus:outline-none bg-[#0000ff]/10 border-[#0000ff]/35 text-zinc-300 hover:bg-[#0000ff]/20 hover:border-[#0000ff]/50 hover:shadow-[0_0_15px_rgba(0,0,255,0.35)] hover:text-white"
                >
                  <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0 text-[#8080ff] group-hover:text-white transition-colors" />
                  <span>Platform Guardrails</span>
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/invite-friends'); close(); }}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-300 border mb-1.5 cursor-pointer select-none text-left focus:outline-none bg-[#0000ff]/10 border-[#0000ff]/35 text-zinc-300 hover:bg-[#0000ff]/20 hover:border-[#0000ff]/50 hover:shadow-[0_0_15px_rgba(0,0,255,0.35)] hover:text-white"
                >
                  <UserPlus className="h-3.5 w-3.5 flex-shrink-0 text-[#8080ff] group-hover:text-white transition-colors" />
                  <span>Invite Friends</span>
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/change-password'); close(); }}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-300 border mb-1.5 cursor-pointer select-none text-left focus:outline-none bg-[#0000ff]/10 border-[#0000ff]/35 text-zinc-300 hover:bg-[#0000ff]/20 hover:border-[#0000ff]/50 hover:shadow-[0_0_15px_rgba(0,0,255,0.35)] hover:text-white"
                >
                  <KeyRound className="h-3.5 w-3.5 flex-shrink-0 text-[#8080ff] group-hover:text-white transition-colors" />
                  <span>Change Password</span>
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/contact-support'); close(); }}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-300 border mb-1.5 cursor-pointer select-none text-left focus:outline-none bg-[#0000ff]/10 border-[#0000ff]/35 text-zinc-300 hover:bg-[#0000ff]/20 hover:border-[#0000ff]/50 hover:shadow-[0_0_15px_rgba(0,0,255,0.35)] hover:text-white"
                >
                  <Mail className="h-3.5 w-3.5 flex-shrink-0 text-[#8080ff] group-hover:text-white transition-colors" />
                  <span>Contact Support</span>
                </button>
              )}

              {!isSuperAdmin && (
                <button
                  onClick={() => { router.push('/legal'); close(); }}
                  className="group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-300 border mb-1.5 cursor-pointer select-none text-left focus:outline-none bg-[#0000ff]/10 border-[#0000ff]/35 text-zinc-300 hover:bg-[#0000ff]/20 hover:border-[#0000ff]/50 hover:shadow-[0_0_15px_rgba(0,0,255,0.35)] hover:text-white"
                >
                  <Scale className="h-3.5 w-3.5 flex-shrink-0 text-[#8080ff] group-hover:text-white transition-colors" />
                  <span>Legal Documents</span>
                </button>
              )}
            </div>
          ) : activeBotId === null ? (
            /* General Mode */
            <div className="flex flex-col h-full min-h-0 animate-in fade-in duration-200">
              {/* Search Bar Row */}
              <div className="pt-3 pb-1.5 flex items-center px-4 bg-[#0c1120] dark:bg-[#0c1120] flex-none w-full">
                <div className="flex h-9 w-full items-center rounded-lg border border-[#0000ff]/35 bg-[#0000ff]/10 shadow-[0_0_12px_rgba(0,0,255,0.25)] overflow-hidden focus-within:border-[#0000ff] focus-within:shadow-[0_0_20px_rgba(0,0,255,0.55)] focus-within:ring-1 focus-within:ring-[#0000ff]/40 transition-all duration-300">
                  <div className="flex flex-1 items-center gap-2.5 px-3 h-full">
                    <Search className="size-3.5 flex-none text-[#5e5eff]" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-xs font-normal text-white outline-none placeholder:text-zinc-405"
                    />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveConversation(null);
                          setShowStartLastMessage(false);
                          setUserMessage('');
                          setSelectedOption(null);
                          close();
                          router.push(isLoggedIn ? '/c/new-chat' : '/');
                        }}
                        className="flex h-full w-9 items-center justify-center transition-all hover:bg-[#0000ff]/20 text-blue-100 focus:outline-none border-l border-[#0000ff]/30"
                      >
                        <Plus className="size-3.5 text-white" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-zinc-950 border border-white/10 text-white text-xs font-semibold px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-b-2 border-b-indigo-500 select-none">
                      New Chat
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Chat History List */}
              <div className="flex-1 overflow-y-auto px-4 bg-[#0c1120] dark:bg-[#0c1120] py-2">
                <ConversationsList searchQuery={searchQuery} activeTab="search" />
              </div>
            </div>
          ) : (
            /* Space Mode */
            <div className="flex flex-col h-full min-h-0 animate-in fade-in duration-200">
              {/* Search Bar Row (Same exact styling as general chat mode) */}
              <div className="pt-3 pb-1.5 flex items-center px-4 bg-[#0c1120] dark:bg-[#0c1120] flex-none w-full gap-2">
                <div className="flex-1 flex h-9 items-center rounded-lg border border-[#0000ff]/35 bg-[#0000ff]/10 shadow-[0_0_12px_rgba(0,0,255,0.25)] overflow-hidden focus-within:border-[#0000ff] focus-within:shadow-[0_0_20px_rgba(0,0,255,0.55)] focus-within:ring-1 focus-within:ring-[#0000ff]/40 transition-all duration-300">
                  <div className="flex flex-1 items-center gap-2.5 px-3 h-full">
                    <Search className="size-3.5 flex-none text-[#5e5eff]" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-xs font-normal text-white outline-none placeholder:text-zinc-400"
                    />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOption(null);
                          setActiveBotThreadId(null);
                          setActiveConversation(null);
                          router.push(`/spaces?bot=${activeBotId}`);
                          close();
                        }}
                        className="flex h-full w-9 items-center justify-center transition-all hover:bg-[#0000ff]/20 text-blue-100 focus:outline-none border-l border-[#0000ff]/30"
                      >
                        <Plus className="size-3.5 text-white" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-zinc-950 border border-white/10 text-white text-xs font-semibold px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-b-2 border-b-white select-none">
                      New Space Chat
                    </TooltipContent>
                  </Tooltip>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-9 shrink-0 bg-[#0000ff]/10 border-[#0000ff]/35 text-[#8080ff] hover:bg-[#0000ff]/20 hover:text-white transition-all shadow-[0_0_12px_rgba(0,0,255,0.25)] focus:outline-none"
                    >
                      <EllipsisVertical className="size-4 rotate-90" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-2xl" align="end">
                    <DropdownMenuItem
                      className="text-zinc-700 dark:text-zinc-200 focus:bg-zinc-100 dark:focus:bg-zinc-800"
                      onClick={() => setBotToRename(activeBotId)}
                    >
                      <Pencil className="h-4 w-4 mr-2" /> Rename Space
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="border-black/5 dark:border-white/5" />
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-655 focus:bg-red-50"
                      onClick={() => setBotToDelete(activeBotId)}
                    >
                      <Trash2 className="text-red-500 h-4 w-4 mr-2" /> Delete Space
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Space-Specific Threads List */}
              <div className="flex-1 overflow-y-auto px-4 bg-[#0c1120] dark:bg-[#0c1120] space-y-1.5 py-2">
                {threads
                  .filter(t => t.botId === activeBotId && (t.title || 'Untitled Space Chat').toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(thread => {
                    const isSelected = activeBotThreadId === thread.id && pathname === '/spaces';
                    return (
                      <div
                        key={thread.id}
                        className={cn(
                          "group flex h-9 w-full items-center justify-between rounded-lg text-xs font-normal text-left transition-all duration-300 border mb-1.5 cursor-pointer select-none",
                          isSelected
                            ? "bg-[#0000ff]/15 border-[#0000ff] text-white font-semibold shadow-[0_0_20px_rgba(0,0,255,0.55)]"
                            : "bg-[#0000ff]/10 border-[#0000ff]/35 text-zinc-300 hover:bg-[#0000ff]/20 hover:border-[#0000ff]/50 hover:shadow-[0_0_15px_rgba(0,0,255,0.35)] hover:text-white"
                        )}
                      >
                        <span
                          className="flex-1 truncate px-3 py-2 flex items-center gap-2.5"
                          onClick={() => {
                            setSelectedOption(null);
                            setActiveBotThreadId(thread.id);
                            router.push(`/spaces?bot=${activeBotId}&thread=${thread.id}`);
                            close();
                          }}
                        >
                          {getThreadIcon(thread.title, isSelected)}
                          <span className="truncate">{thread.title || 'Untitled Space Chat'}</span>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteThread(thread.id);
                            if (activeBotThreadId === thread.id) {
                              setActiveBotThreadId(null);
                              router.push(`/spaces?bot=${activeBotId}`);
                            }
                          }}
                          className={cn(
                            "mr-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-colors p-1 rounded hover:bg-[#0000ff]/20",
                            isSelected ? "text-white" : "text-zinc-450 hover:text-red-500"
                          )}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                {threads.filter(t => t.botId === activeBotId && (t.title || 'Untitled Space Chat').toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <div className="py-8 text-center text-xs text-zinc-500 italic">
                    No threads found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Area */}
        <div className={cn(
          "sticky bottom-0 z-30 flex flex-col w-full bg-[#0c1120] border-t border-zinc-800/60 p-4 py-1.5 flex-none",
          activeTab !== 'account' && "h-[92px] justify-center"
        )}>
          {isLoggedIn && activeTab === 'account' ? (
            <div className="flex flex-col w-full">
              <div className="flex h-20 w-full items-center justify-center p-4 py-1.5">
                <Button
                  variant="default"
                  className="w-full justify-center gap-2 bg-white text-black hover:bg-white/90 border border-transparent"
                  onClick={() => {
                    setActiveTab('search');
                    router.push(isLoggedIn ? '/c/new-chat' : '/');
                    close();
                  }}
                >
                  Return to App
                </Button>
              </div>
              <div className="flex h-20 w-full items-center justify-center p-4 py-1.5">
                <Button
                  variant="outline"
                  onClick={() => { onOpen({ type: 'logout' }); close(); }}
                  className="w-full transition-all duration-200 outline-none select-none cursor-pointer bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:text-white dark:hover:bg-red-700 border-transparent"
                >
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-20 w-full items-center justify-center p-4 py-1.5">
              {!isLoggedIn ? (
                <div className="flex w-full items-center gap-2">
                  <Button
                    variant="default"
                    className="flex-1 bg-white px-0 text-black hover:bg-white/90"
                    asChild
                  >
                    <Link href="/login" onClick={close}>Login</Link>
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1 bg-white px-0 text-black hover:bg-white/90"
                    asChild
                  >
                    <Link href="/register" onClick={close}>Register</Link>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('account')}
                  className="w-full transition-all duration-300 outline-none select-none cursor-pointer border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 text-zinc-900 dark:text-zinc-100 shadow-sm"
                >
                  My Account
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Space Dialog */}
      <Dialog open={botToDelete !== null} onOpenChange={(open) => !open && setBotToDelete(null)}>
        <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[320px] sm:max-w-[320px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
          {/* Centered Content Section */}
          <div className="px-5 pt-5 pb-4 text-center">
            <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
              Delete Space
            </h2>
            <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
              Are you sure you want to remove this space? This action cannot be undone.
            </p>
          </div>

          {/* Extended Border & iOS Layout Action Buttons */}
          <div className="border-t border-black/10 dark:border-white/10 flex h-11">
            <DialogClose asChild>
              <button
                type="button"
                className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none cursor-pointer"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="button"
              className="flex-1 text-[15px] font-normal text-red-655 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none cursor-pointer"
              onClick={async () => {
                if (botToDelete) {
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
                    setSelectedOption(null);
                    router.push(isLoggedIn ? '/c/new-chat' : '/');
                  }
                  setBotToDelete(null);
                }
              }}
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Space Dialog */}
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
                className="flex-1 text-sm font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 h-full border-r border-black/10 dark:border-white/10 outline-none cursor-pointer"
                onClick={() => setBotToRename(null)}
              >
                Cancel
              </button>
              <button
                className="flex-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-black/5 dark:hover:bg-white/5 h-full outline-none disabled:opacity-50 cursor-pointer"
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

      {/* Create Space Dialog */}
      <Dialog open={isCreateSpaceOpen} onOpenChange={(open) => !open && setIsCreateSpaceOpen(false)}>
        <DialogContent 
          className="p-6 overflow-hidden rounded-[20px] max-w-[400px] border-none shadow-xl bg-[#e1e1e1] dark:bg-zinc-955 [&>button]:hidden"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="space-y-4">
            <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight text-center">
              Create A New Space
            </h2>
            <input
              type="text"
              value={newSpaceName}
              onChange={(e) => setNewSpaceName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newSpaceName.trim() && !isCreatingSpace) {
                  handleCreateSpace();
                }
              }}
              placeholder="Enter Space Name"
              disabled={isCreatingSpace}
              className="w-full bg-white dark:bg-zinc-900 border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white"
            />
            <div className="flex border-t border-black/10 dark:border-white/10 h-11 -mx-6 -mb-6 mt-4">
              <button 
                className="flex-1 text-sm font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 h-full border-r border-black/10 dark:border-white/10 outline-none disabled:opacity-50"
                onClick={() => setIsCreateSpaceOpen(false)}
                disabled={isCreatingSpace}
              >
                Cancel
              </button>
              <button 
                className="flex-1 text-sm font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 h-full outline-none disabled:opacity-50 flex items-center justify-center gap-1.5"
                onClick={handleCreateSpace}
                disabled={!newSpaceName.trim() || isCreatingSpace}
              >
                {isCreatingSpace && <Loader2 className="size-3.5 animate-spin" />}
                Create
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeftSideNavMobile;
