'use client';
import { createKnowledgeBaseAction } from '@/actions/knowledgeBaseAction';
import {
  getSpaceResearchSessionsAction,
  SpaceResearchSession,
} from '@/actions/spaceResearchActions';
import {
  getSpaceSearchesAction,
  SpaceSearchSession,
} from '@/actions/spaceSearchActions';
import { getMonitorId } from '@/components/monitors/monitor-utils';
import { getFileIconComponent } from '@/components/panels/ProjectEditors';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTenant } from '@/contexts/TenantContext';
import { useConnectionsQuery } from '@/hooks/useConnectApps';
import { useInboxQuery } from '@/hooks/useInbox';
import { useMonitorsQuery } from '@/hooks/useMonitors';
import { allApps, APP } from '@/lib/all-apps';
import { cn } from '@/lib/utils';
import { useBotsStore } from '@/stores/useBotsStore';
import { OPTIONS, useConversationsStore } from '@/stores/useConverstionsStore';
import { useDrawerStore } from '@/stores/useDrawerStore';
import { useModalStore } from '@/stores/useModalStore';
import { SidebarTab, useSidebarStore } from '@/stores/useSidebarStore';
import {
  ClipboardCheck,
  Code2,
  CreditCard,
  EllipsisVertical,
  FileText,
  ImageIcon,
  KeyRound,
  LayoutGrid,
  Loader2,
  LogOut,
  Mail,
  MessageSquare,
  Music,
  PanelLeftClose,
  Pencil,
  PenTool,
  Plus,
  Scale,
  Search,
  Shield,
  Terminal,
  Trash2,
  Users,
  Video,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import ConversationsList from './ConversationsList';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

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

const AVAILABLE_MCP_APPS = (() => {
  const uniqueMap = new Map<string, APP>();
  allApps.forEach(app => {
    if (app.isAvailable && app.app_name) {
      const slug = app.app_name.toLowerCase();
      const isMcp =
        !!app.isMcp ||
        [
          'filesystem',
          'google-maps',
          'slack',
          'linear',
          'gcal',
          'brave-search',
          'postgres',
          'sqlite',
          'playwright',
          'fetch',
          'evernote',
        ].includes(slug);

      if (isMcp && !uniqueMap.has(slug)) {
        uniqueMap.set(slug, app);
      }
    }
  });
  return Array.from(uniqueMap.values()).sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
  );
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
  const {
    isLeftSidebarOpen,
    toggleLeftSidebar,
    isRightSidebarOpen,
    toggleRightSidebar,
    toggleGlobalInbox,
    isGlobalInboxOpen,
    activeTab,
    setActiveTab,
  } = useSidebarStore();
  const {
    bots,
    activeBotId,
    setActiveBotId,
    projectTab,
    setProjectTab,
    deleteBot,
    reorderBots,
    editBot,
    setActiveBotThreadId,
    addBotAsync,
  } = useBotsStore();
  const activeBot = bots.find(b => b.id === activeBotId);

  const { data: inboxItems = [] } = useInboxQuery(
    data?.user?.id,
    undefined,
    false,
    data?.accessToken,
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
        const kbResponse = await createKnowledgeBaseAction(
          newSpaceName.trim(),
          token,
        );
        if (kbResponse.success && kbResponse.data?.id) {
          backendId = kbResponse.data.id;
        }
      }
      const newBot = await addBotAsync(
        {
          name: newSpaceName.trim(),
          description: `Custom Project Workspace: ${newSpaceName.trim()}`,
          instructions: '',
          model: 'Gemini 1.5 Pro',
          avatar: '🤖',
          guardrails: '',
          data: backendId || undefined,
          isShared: false,
        },
        token || undefined,
      );

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

  const hideSidebar =
    side === 'right' ? !isRightSidebarOpen : !isLeftSidebarOpen;
  const isLoggedIn = data?.accessToken;

  const [searchQuery, setSearchQuery] = useState('');
  const [logoHovered, setLogoHovered] = useState(false);
  const [botToDelete, setBotToDelete] = useState<string | null>(null);
  const [spaceItemToDelete, setSpaceItemToDelete] = useState<{
    type: 'data' | 'instructions' | 'guardrails';
    index: number;
    name: string;
  } | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [botToRename, setBotToRename] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showSpaceConfig, setShowSpaceConfig] = useState(false);

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
      const savedTasks = localStorage.getItem('insosearch_automations');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks([]);
      }
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(
      'insosearch_automations_updated',
      handleStorageChange,
    );

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'insosearch_automations_updated',
        handleStorageChange,
      );
    };
  }, [pathname]);

  const isAdminMode = pathname.startsWith('/admin');
  const isAdminSection = isAdminMode;

  const userEmail = data?.user?.email?.toLowerCase();
  const isGlobalAdmin =
    data?.user?.role === 'admin' || data?.user?.role === 'super_admin';
  const isTenantOwner =
    mode === 'tenant' &&
    (currentTenant?.role === 'admin' || currentTenant?.role === 'owner');
  const isTenantAdmin = mode === 'tenant' && currentTenant?.role === 'manager';

  const isAdmin =
    userEmail === 'admin@insosearch.com' || isGlobalAdmin || isTenantOwner;
  const isManager = isGlobalAdmin || isTenantOwner || isTenantAdmin;
  const isSuperAdmin = data?.user?.role === 'super_admin';

  const searchParams = useSearchParams();
  const isSpaceMonitorSection =
    pathname.startsWith('/spaces') &&
    searchParams?.get('section') === 'monitor';
  const isSpaceResearchSection =
    pathname.startsWith('/spaces') &&
    searchParams?.get('section') === 'research';
  const getSpaceSectionUrl = (
    section?: 'monitor' | 'research',
    options?: {
      monitorId?: string | null;
      createMonitor?: boolean;
      createResearch?: boolean;
      sessionId?: string | null;
    },
  ) => {
    const nextParams = new URLSearchParams();

    if (activeBotId) {
      nextParams.set('bot', activeBotId);
    }

    if (!section) {
      const sessionParam = searchParams?.get('session');
      if (sessionParam) {
        nextParams.set('session', sessionParam);
      }
    } else {
      nextParams.set('section', section);

      if (section === 'monitor' && options?.monitorId) {
        nextParams.set('monitor', options.monitorId);
      } else {
        nextParams.delete('monitor');
      }

      if (section === 'monitor' && options?.createMonitor) {
        nextParams.set('createMonitor', '1');
      } else {
        nextParams.delete('createMonitor');
      }

      if (section === 'research' && options?.sessionId) {
        nextParams.set('session', options.sessionId);
      } else if (section !== 'monitor') {
        nextParams.delete('session');
      }

      if (section === 'research' && options?.createResearch) {
        nextParams.set('createResearch', '1');
      } else {
        nextParams.delete('createResearch');
      }
    }

    const queryString = nextParams.toString();
    return queryString ? `/spaces?${queryString}` : '/spaces';
  };
  const activeAppSlug = searchParams?.get('app');
  const activeConnectorId = searchParams?.get('connector') || 'file';
  const viewParam = searchParams?.get('view');
  const editIndexParam = searchParams?.get('editIndex');
  const currentEditIndex =
    editIndexParam !== null && editIndexParam !== undefined
      ? parseInt(editIndexParam, 10)
      : -1;

  const [connectedAppSlugs, setConnectedAppSlugs] = useState<Set<string>>(
    new Set(),
  );
  const [appsFilterTab, setAppsFilterTab] = useState<'all' | 'connected'>(
    'all',
  );

  const { data: connections } = useConnectionsQuery(data?.accessToken);

  const [searchSessions, setSearchSessions] = useState<SpaceSearchSession[]>(
    [],
  );
  const [researchSessions, setResearchSessions] = useState<
    SpaceResearchSession[]
  >([]);
  const sessionParam = searchParams?.get('session') || null;
  const monitorParam = searchParams?.get('monitor') || null;

  const { data: spaceMonitors = [], isLoading: isLoadingSpaceMonitors } =
    useMonitorsQuery(activeBotId || undefined, data?.accessToken);

  useEffect(() => {
    if (!activeBotId || !pathname.startsWith('/spaces')) {
      setSearchSessions([]);
      setResearchSessions([]);
      return;
    }
    let cancelled = false;

    const loadSessions = async () => {
      if (isSpaceResearchSection) {
        const result = await getSpaceResearchSessionsAction(activeBotId);
        if (cancelled) return;
        if (result.success && Array.isArray(result.data)) {
          setResearchSessions(result.data);
        }
        return;
      }

      const result = await getSpaceSearchesAction(activeBotId);
      if (cancelled) return;
      if (result.success && Array.isArray(result.data)) {
        setSearchSessions(result.data);
      }
    };

    loadSessions();
    return () => {
      cancelled = true;
    };
  }, [activeBotId, isSpaceResearchSection, pathname]);

  useEffect(() => {
    const handleSessionCreated = (e: Event) => {
      const detail = (
        e as CustomEvent<{ spaceId: string; session: SpaceSearchSession }>
      ).detail;
      if (!detail || detail.spaceId !== activeBotId) return;
      setSearchSessions(prev => [detail.session, ...prev]);
    };
    window.addEventListener('space-search-created', handleSessionCreated);
    return () =>
      window.removeEventListener('space-search-created', handleSessionCreated);
  }, [activeBotId]);

  useEffect(() => {
    const handleSessionCreated = (e: Event) => {
      const detail = (
        e as CustomEvent<{ spaceId: string; session: SpaceResearchSession }>
      ).detail;
      if (!detail || detail.spaceId !== activeBotId) return;
      setResearchSessions(prev => [detail.session, ...prev]);
    };
    window.addEventListener('space-research-created', handleSessionCreated);
    return () =>
      window.removeEventListener(
        'space-research-created',
        handleSessionCreated,
      );
  }, [activeBotId]);

  useEffect(() => {
    if (connections) {
      const activeSlugs = new Set(
        connections
          .map(account => account.toolkit?.slug?.toLowerCase())
          .filter(Boolean),
      );

      // Seed sample apps for testing if this is meram.michael@gmail.com
      if (data?.user?.email?.toLowerCase() === 'meram.michael@gmail.com') {
        const sampleSlugs = ['slack', 'google-maps', 'postgres', 'evernote'];
        sampleSlugs.forEach(slug => activeSlugs.add(slug));
      }

      setConnectedAppSlugs(activeSlugs);

      // Resolve connected apps
      const connected = allApps.filter(app =>
        activeSlugs.has(app.app_name.toLowerCase()),
      );

      let savedOrder: string[] = [];
      try {
        const stored = localStorage.getItem('mcp_app_order');
        if (stored) savedOrder = JSON.parse(stored);
      } catch (e) {}

      let sorted: APP[] = [];
      if (savedOrder && savedOrder.length > 0) {
        savedOrder.forEach(slug => {
          const match = connected.find(
            a => a.app_name.toLowerCase() === slug.toLowerCase(),
          );
          if (match) sorted.push(match);
        });
        const remaining = connected.filter(
          a => !savedOrder.includes(a.app_name.toLowerCase()),
        );
        remaining.sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
        );
        sorted = [...sorted, ...remaining];
      } else {
        sorted = connected.sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
        );
      }
      setLocalAppsOrder(sorted);
    }
  }, [connections, data?.user?.email]);

  // Auto-expand if space configuration is currently selected
  useEffect(() => {
    const isConfigActive =
      viewParam === 'data' ||
      viewParam === 'instructions' ||
      viewParam === 'guardrails' ||
      selectedOption === OPTIONS.KNOWLEDGE ||
      selectedOption === OPTIONS.INSTRUCTIONS ||
      selectedOption === OPTIONS.GUARDRAILS;

    if (isConfigActive) {
      setShowSpaceConfig(true);
    }
  }, [viewParam, selectedOption]);

  const filteredApps = useMemo(() => {
    return AVAILABLE_MCP_APPS.filter(
      app =>
        app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const displayedApps = useMemo(() => {
    const baseList =
      searchQuery.trim() !== '' ? filteredApps : AVAILABLE_MCP_APPS;

    if (appsFilterTab === 'connected') {
      return baseList.filter(app =>
        connectedAppSlugs.has(app.app_name.toLowerCase()),
      );
    }

    if (searchQuery.trim() === '') {
      const connected = AVAILABLE_MCP_APPS.filter(app =>
        connectedAppSlugs.has(app.app_name.toLowerCase()),
      );
      const nonConnected = AVAILABLE_MCP_APPS.filter(
        app => !connectedAppSlugs.has(app.app_name.toLowerCase()),
      );
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
      setActiveTab('search');
    } else if (pathname === '/tasks' || pathname.startsWith('/tasks')) {
      setActiveTab('search');
    } else if (pathname === '/apps' || pathname.startsWith('/apps')) {
      setActiveTab('search');
    } else if (pathname === '/' || pathname.startsWith('/c/')) {
      setActiveTab('search');
    } else if (
      pathname.startsWith('/instructions') ||
      pathname.startsWith('/guardrails') ||
      pathname.startsWith('/platform-knowledge') ||
      pathname.startsWith('/legal') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/platform-memory') ||
      pathname.startsWith('/change-password') ||
      pathname.startsWith('/contact-support') ||
      pathname.startsWith('/invite-friends')
    ) {
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
    const targetPath = isLoggedIn ? '/c/new-search' : '/';
    setActiveTab(tab);
    if (tab === 'bots') {
      setActiveConversation(null);
      router.push('/spaces');
    } else if (tab === 'search') {
      setSelectedOption(null);
      if (pathname !== targetPath) {
        setActiveConversation(null);
        router.push(targetPath);
      }
    } else if (tab === 'research') {
      setSelectedOption(OPTIONS.RESEARCH);
      if (pathname !== targetPath) {
        setActiveConversation(null);
        router.push(targetPath);
      }
    } else if (tab === 'write') {
      setSelectedOption(OPTIONS.DRAFT_DOCUMENT);
      if (pathname !== targetPath) {
        setActiveConversation(null);
        router.push(targetPath);
      }
    } else if (tab === 'code') {
      setSelectedOption(OPTIONS.CODE);
      if (pathname !== targetPath) {
        setActiveConversation(null);
        router.push(targetPath);
      }
    } else if (tab === 'image') {
      setSelectedOption(OPTIONS.IMAGE);
      if (pathname !== targetPath) {
        setActiveConversation(null);
        router.push(targetPath);
      }
    } else if (tab === 'audio') {
      setSelectedOption(OPTIONS.AUDIO);
      if (pathname !== targetPath) {
        setActiveConversation(null);
        router.push(targetPath);
      }
    } else if (tab === 'apps') {
      setActiveConversation(null);
      router.push('/apps');
    } else if (tab === 'tasks') {
      setActiveConversation(null);
      router.push('/tasks');
    } else if (tab === 'video') {
      setSelectedOption(OPTIONS.VIDEO);
      if (pathname !== targetPath) {
        setActiveConversation(null);
        router.push(targetPath);
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
            window.dispatchEvent(new Event('insosearch_new_task_click'));
          },
        };
      case 'search':
        return {
          visible: true,
          tooltip: 'New Chat',
          onClick: () => {
            setActiveConversation(null);
            setShowStartLastMessage(false);
            setUserMessage('');
            setSelectedOption(null);
            close();
            router.push(isLoggedIn ? '/c/new-search' : '/');
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
            router.push(isLoggedIn ? '/c/new-research' : '/');
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
            router.push(isLoggedIn ? '/c/new-search' : '/');
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
            router.push(isLoggedIn ? '/c/new-search' : '/');
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
            router.push(isLoggedIn ? '/c/new-search' : '/');
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
            router.push(isLoggedIn ? '/c/new-search' : '/');
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
            router.push(isLoggedIn ? '/c/new-search' : '/');
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
    setLogoHovered(true);
  };

  const getThreadIcon = (title: string, isSelected: boolean) => {
    const iconColorClass = isSelected
      ? 'h-3.5 w-3.5 text-white flex-shrink-0'
      : 'h-3.5 w-3.5 text-[#8080ff] flex-shrink-0 group-hover:text-white transition-colors';

    const lower = (title || '').toLowerCase();

    if (
      lower.includes('image') ||
      lower.includes('art') ||
      lower.includes('draw') ||
      lower.includes('logo') ||
      lower.includes('paint') ||
      lower.includes('picture') ||
      lower.includes('photo') ||
      lower.includes('canvas')
    ) {
      return <ImageIcon className={iconColorClass} />;
    }
    if (
      lower.includes('video') ||
      lower.includes('movie') ||
      lower.includes('clip') ||
      lower.includes('animate') ||
      lower.includes('mp4')
    ) {
      return <Video className={iconColorClass} />;
    }
    if (
      lower.includes('audio') ||
      lower.includes('voice') ||
      lower.includes('music') ||
      lower.includes('sound') ||
      lower.includes('transcribe') ||
      lower.includes('speech') ||
      lower.includes('mp3')
    ) {
      return <Music className={iconColorClass} />;
    }
    if (
      lower.includes('code') ||
      lower.includes('debug') ||
      lower.includes('python') ||
      lower.includes('rust') ||
      lower.includes('js') ||
      lower.includes('ts') ||
      lower.includes('html') ||
      lower.includes('css')
    ) {
      return <Code2 className={iconColorClass} />;
    }
    if (
      lower.includes('search') ||
      lower.includes('google') ||
      lower.includes('web') ||
      lower.includes('research') ||
      lower.includes('find') ||
      lower.includes('query')
    ) {
      return <Search className={iconColorClass} />;
    }
    if (
      lower.includes('write') ||
      lower.includes('draft') ||
      lower.includes('email') ||
      lower.includes('article') ||
      lower.includes('copy') ||
      lower.includes('text') ||
      lower.includes('essay')
    ) {
      return <PenTool className={iconColorClass} />;
    }
    if (
      lower.includes('review') ||
      lower.includes('contract') ||
      lower.includes('check') ||
      lower.includes('audit') ||
      lower.includes('guardrail')
    ) {
      return <ClipboardCheck className={iconColorClass} />;
    }
    return <MessageSquare className={iconColorClass} />;
  };

  const getSpaceInitials = (name: string) => {
    if (!name) return '';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (
        words[0].substring(0, 1) + words[1].substring(0, 1)
      ).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  let allFiles: { name: string; size: number }[] = [];
  if (activeBot) {
    try {
      allFiles = activeBot.data ? JSON.parse(activeBot.data) : [];
    } catch (e) {
      allFiles = activeBot.data ? [{ name: activeBot.data, size: 0 }] : [];
    }
  }
  const allInstructions = activeBot?.instructions
    ? activeBot.instructions.split('\n\n').filter(Boolean)
    : [];
  const allGuardrails = activeBot?.guardrails
    ? activeBot.guardrails.split('\n\n').filter(Boolean)
    : [];

  const SHOW_WORKSPACES = false;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Column 1: Spaces Switcher (Slack style) */}

      {SHOW_WORKSPACES && (
        <div className="flex h-full w-[68px] flex-none flex-col items-center gap-3 border-r border-zinc-800/60 bg-black pt-4 select-none">
          {/* Aphura Home Logo */}
          <div className="relative flex w-full flex-col items-center">
            <button
              type="button"
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
              onClick={toggleLeftSidebar}
              className={cn(
                'relative flex size-11 cursor-pointer items-center justify-center rounded-xl border border-[#0000ff]/40 bg-[#0000ff]/15 text-white shadow-[0_0_15px_rgba(0,0,255,0.25)] transition-all duration-200 select-none',
              )}
            >
              {logoHovered ? (
                isLeftSidebarOpen ? (
                  <PanelLeftClose className="size-5" />
                ) : (
                  <PanelLeftClose className="size-5 rotate-180" />
                )
              ) : (
                <img
                  src="/assets/logo-icon.png"
                  alt="Aphura Brand Logo"
                  className="size-6 object-contain brightness-0 invert"
                />
              )}
            </button>
          </div>

          {/* Render the rest of Column 1 only if the sidebar is open */}
          {isLeftSidebarOpen && (
            <>
              {/* General Workspace Button */}
              <div className="relative flex w-full flex-col items-center">
                <div
                  className="absolute top-1.5 left-0 h-8 w-1 rounded-r-md bg-white transition-all duration-200"
                  style={{
                    opacity:
                      activeBotId === null && activeTab !== 'account' ? 1 : 0,
                  }}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        setActiveBotId(null);
                        setSelectedOption(null);
                        router.push(isLoggedIn ? '/c/new-search' : '/');
                      }}
                      className={cn(
                        'relative flex size-11 cursor-pointer items-center justify-center rounded-xl border border-[#0000ff]/40 bg-[#0000ff]/15 text-white shadow-[0_0_15px_rgba(0,0,255,0.25)] transition-all duration-300 hover:rounded-2xl hover:border-[#0000ff]/55 hover:bg-[#0000ff]/20 hover:shadow-[0_0_18px_rgba(0,0,255,0.3)]',
                      )}
                    >
                      <LayoutGrid className="size-[18px]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="border border-b-2 border-white/10 border-b-white bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none"
                  >
                    General
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Spaces Scrollable Area */}
              <div className="no-scrollbar flex w-full flex-1 flex-col items-center gap-3 overflow-x-hidden overflow-y-auto pt-0 pb-1">
                {bots.map((bot, idx) => {
                  const isSelected =
                    activeBotId === bot.id &&
                    (pathname === '/spaces' ||
                      pathname.startsWith('/spaces')) &&
                    activeTab !== 'account';
                  const isBeingDragged = draggedIndex === idx;
                  const showTopLine =
                    draggedIndex !== null &&
                    dragOverIndex === idx &&
                    draggedIndex > idx;
                  const showBottomLine =
                    draggedIndex !== null &&
                    dragOverIndex === idx &&
                    draggedIndex < idx;

                  return (
                    <div
                      key={bot.id}
                      className="relative flex w-full flex-col items-center"
                      draggable
                      onDragStart={e => {
                        setDraggedIndex(idx);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragOver={e => {
                        e.preventDefault();
                        if (draggedIndex !== idx) {
                          setDragOverIndex(idx);
                        }
                      }}
                      onDragLeave={() => {
                        setDragOverIndex(null);
                      }}
                      onDrop={e => {
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
                        <div className="mb-1 h-[2px] w-8 animate-pulse rounded-full bg-indigo-500" />
                      )}

                      {/* Active Indicator Line */}
                      <div
                        className="absolute top-1.5 left-0 h-8 w-1 rounded-r-md bg-white transition-all duration-200"
                        style={{ opacity: isSelected ? 1 : 0 }}
                      />

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={async () => {
                              setSelectedOption(
                                isSpaceMonitorSection
                                  ? OPTIONS.MONITOR
                                  : isSpaceResearchSection
                                    ? OPTIONS.RESEARCH
                                    : null,
                              );
                              setActiveBotId(bot.id);
                              if (isSpaceMonitorSection) {
                                router.push(
                                  `/spaces?bot=${bot.id}&section=monitor`,
                                );
                                return;
                              }
                              if (isSpaceResearchSection) {
                                const result =
                                  await getSpaceResearchSessionsAction(bot.id);
                                const firstSession =
                                  result.success && Array.isArray(result.data)
                                    ? result.data[0]
                                    : null;
                                if (
                                  result.success &&
                                  Array.isArray(result.data)
                                ) {
                                  setResearchSessions(result.data);
                                }
                                const firstSessionId = firstSession?.id;
                                const url = firstSessionId
                                  ? `/spaces?bot=${bot.id}&section=research&session=${firstSessionId}`
                                  : `/spaces?bot=${bot.id}&section=research`;
                                router.push(url);
                                return;
                              }
                              // Jump straight into the space's most recent session, like ChatGPT
                              const result = await getSpaceSearchesAction(
                                bot.id,
                              );
                              const firstSession =
                                result.success && Array.isArray(result.data)
                                  ? result.data[0]
                                  : null;
                              if (
                                result.success &&
                                Array.isArray(result.data)
                              ) {
                                setSearchSessions(result.data);
                              }
                              const firstSessionId =
                                firstSession?.id || firstSession?._id;
                              const url = firstSessionId
                                ? `/spaces?bot=${bot.id}&session=${firstSessionId}`
                                : `/spaces?bot=${bot.id}`;
                              // Use router.push (not raw pushState) so useSearchParams reflects the new session
                              router.push(url);
                            }}
                            className={cn(
                              'relative flex size-11 cursor-pointer items-center justify-center rounded-xl border border-[#0000ff]/40 bg-[#0000ff]/15 text-sm font-semibold text-white shadow-[0_0_15px_rgba(0,0,255,0.25)] transition-all duration-300 hover:rounded-2xl hover:border-[#0000ff]/55 hover:bg-[#0000ff]/20 hover:shadow-[0_0_18px_rgba(0,0,255,0.3)]',
                              isBeingDragged && 'opacity-40',
                            )}
                          >
                            {getSpaceInitials(bot.name)}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="max-w-[200px] border border-b-2 border-white/10 border-b-white bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none"
                        >
                          <div className="font-bold">{bot.name}</div>
                        </TooltipContent>
                      </Tooltip>

                      {showBottomLine && (
                        <div className="mt-1 h-[2px] w-8 animate-pulse rounded-full bg-indigo-500" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer Area for Spaces column */}
              <div className="sticky bottom-0 z-30 flex h-[64px] w-full flex-none items-center justify-center border-t border-zinc-800/60 bg-black py-2.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        setNewSpaceName('');
                        setIsCreateSpaceOpen(true);
                      }}
                      className="relative flex size-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-sm transition-all duration-200 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80"
                    >
                      <Plus className="size-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="border border-b-2 border-white/10 border-b-white bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none"
                  >
                    Create Space
                  </TooltipContent>
                </Tooltip>
              </div>
            </>
          )}
        </div>
      )}

      {/* Column 2: Secondary Content navigation panel */}
      {(isLeftSidebarOpen || !SHOW_WORKSPACES) && (
        <div className="flex h-full min-w-0 flex-1 flex-col bg-[#0c1120] overflow-hidden select-none">
          {/* Top Bar Row with Unified Collapse Button */}
          <div className="flex w-full flex-none items-center gap-2 border-b border-zinc-800/60 bg-[#0c1120] px-4 pt-3 pb-3 dark:bg-[#0c1120]">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={toggleLeftSidebar}
                  className="flex size-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-[3px] bg-[#e1e1e1] text-zinc-800 shadow-sm transition-all duration-200 hover:bg-[#d0d0d0] hover:text-black focus:outline-none"
                >
                  <PanelLeftClose strokeWidth={1.5} className="size-4 text-zinc-800" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side={isLeftSidebarOpen ? 'bottom' : 'right'}
                className="border border-b-2 border-white/10 border-b-white bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none"
              >
                {isLeftSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
              </TooltipContent>
            </Tooltip>

            {isLeftSidebarOpen && (
              activeTab === 'account' ? (
                <div className="flex h-9 flex-1 items-center px-1">
                  <span className="text-xs font-semibold text-white">Account Settings</span>
                </div>
              ) : activeBotId === null ? (
                /* General Mode */
                <>
                  <div className="flex h-9 flex-1 items-center overflow-hidden rounded-[3px] bg-[#e1e1e1] px-2.5 shadow-sm transition-all duration-200">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-xs font-normal text-black outline-none placeholder:text-black"
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
                          router.push(isLoggedIn ? '/c/new-search' : '/');
                        }}
                        className="flex size-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-[3px] bg-[#e1e1e1] text-zinc-800 shadow-sm transition-all duration-200 hover:bg-[#d0d0d0] hover:text-black focus:outline-none"
                      >
                        <Plus strokeWidth={1.5} className="size-4 text-zinc-800" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="border border-b-2 border-white/10 border-b-white bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none"
                    >
                      New Chat
                    </TooltipContent>
                  </Tooltip>
                </>
              ) : (
                /* Space Mode */
                <>
                  <div className="flex h-9 flex-1 items-center overflow-hidden rounded-[3px] bg-[#e1e1e1] shadow-sm transition-all duration-200">
                    <div className="flex h-full flex-1 items-center px-2.5">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-xs font-normal text-black outline-none placeholder:text-black"
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex h-full w-9 cursor-pointer items-center justify-center border-l border-black/10 text-zinc-700 transition-colors hover:bg-[#d0d0d0] hover:text-black focus:outline-none"
                          title="Space Settings"
                        >
                          <EllipsisVertical className="size-4 text-zinc-800" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="rounded-2xl border border-white/10 bg-zinc-950 text-white"
                        align="end"
                      >
                        <DropdownMenuItem
                          className="cursor-pointer text-xs text-zinc-300 focus:bg-zinc-800 focus:text-white"
                          onClick={() => setBotToRename(activeBotId)}
                        >
                          <Pencil className="mr-2 h-3.5 w-3.5" /> Rename Space
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 h-[1px] bg-white/10" />
                        <DropdownMenuItem
                          className="cursor-pointer text-xs text-zinc-300 focus:bg-zinc-800 focus:text-white"
                          onClick={() => setBotToDelete(activeBotId)}
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Space
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          if (isSpaceMonitorSection) {
                            setSelectedOption(OPTIONS.MONITOR);
                            router.push(
                              getSpaceSectionUrl('monitor', {
                                monitorId: monitorParam,
                                createMonitor: true,
                              }),
                            );
                            return;
                          }

                          if (isSpaceResearchSection) {
                            setSelectedOption(OPTIONS.RESEARCH);
                            setActiveBotThreadId(null);
                            setActiveConversation(null);
                            router.push(
                              getSpaceSectionUrl('research', {
                                createResearch: true,
                              }),
                            );
                            return;
                          }

                          setSelectedOption(null);
                          setActiveBotThreadId(null);
                          setActiveConversation(null);
                          router.push(`/spaces?bot=${activeBotId}`);
                        }}
                        className="flex size-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-[3px] bg-[#e1e1e1] text-zinc-800 shadow-sm transition-all duration-200 hover:bg-[#d0d0d0] hover:text-black focus:outline-none"
                      >
                        <Plus strokeWidth={1.5} className="size-4 text-zinc-800" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="border border-b-2 border-white/10 border-b-white bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none"
                    >
                      {isSpaceMonitorSection
                        ? 'Create Monitor'
                        : isSpaceResearchSection
                          ? 'New Research'
                          : 'New Chat'}
                    </TooltipContent>
                  </Tooltip>
                </>
              )
            )}
          </div>

          {isLeftSidebarOpen && (
            <>
              {/* Navigation Body */}
              <div className="min-h-0 flex-1 overflow-y-auto">
                {activeTab === 'account' ? (
                  <div className="mt-4 space-y-1.5 px-4 py-1 pb-4">
                {isSuperAdmin && (
                  <button
                    onClick={() => router.push('/admin')}
                    className="group mb-1.5 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg border border-[#0000ff]/35 bg-[#0000ff]/10 px-3 text-left text-xs text-zinc-300 transition-all duration-300 select-none hover:border-[#0000ff]/50 hover:bg-[#0000ff]/20 hover:text-white hover:shadow-[0_0_15px_rgba(0,0,255,0.35)] focus:outline-none"
                  >
                    <Shield className="h-3.5 w-3.5 flex-shrink-0 text-[#8080ff] transition-colors group-hover:text-white" />
                    <span>Owner Platform</span>
                  </button>
                )}
                {isAdmin && !isSuperAdmin && (
                  <>
                    <button
                      onClick={() => router.push('/admin/plans')}
                      className={cn(
                        'group mb-1.5 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-left text-xs transition-all duration-300 select-none focus:outline-none',
                        pathname.startsWith('/admin/plans')
                          ? 'border-[#0000ff] bg-[#0000ff]/25 font-semibold text-white shadow-[0_0_15px_rgba(0,0,255,0.45)]'
                          : 'border-[#0000ff]/35 bg-[#0000ff]/10 text-zinc-300 hover:border-[#0000ff]/50 hover:bg-[#0000ff]/20 hover:text-white hover:shadow-[0_0_15px_rgba(0,0,255,0.35)]',
                      )}
                    >
                      <LayoutGrid
                        className={cn(
                          'h-3.5 w-3.5 flex-shrink-0 transition-colors',
                          pathname.startsWith('/admin/plans')
                            ? 'text-white'
                            : 'text-[#8080ff] group-hover:text-white',
                        )}
                      />
                      <span>Plans</span>
                    </button>

                    <button
                      onClick={() => router.push('/admin/team-members')}
                      className={cn(
                        'group mb-1.5 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-left text-xs transition-all duration-300 select-none focus:outline-none',
                        pathname.startsWith('/admin/team-members')
                          ? 'border-[#0000ff] bg-[#0000ff]/25 font-semibold text-white shadow-[0_0_15px_rgba(0,0,255,0.45)]'
                          : 'border-[#0000ff]/35 bg-[#0000ff]/10 text-zinc-300 hover:border-[#0000ff]/50 hover:bg-[#0000ff]/20 hover:text-white hover:shadow-[0_0_15px_rgba(0,0,255,0.35)]',
                      )}
                    >
                      <Users
                        className={cn(
                          'h-3.5 w-3.5 flex-shrink-0 transition-colors',
                          pathname.startsWith('/admin/team-members')
                            ? 'text-white'
                            : 'text-[#8080ff] group-hover:text-white',
                        )}
                      />
                      <span>Members</span>
                    </button>
                    <button
                      onClick={() => router.push('/admin/billing')}
                      className={cn(
                        'group mb-1.5 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-left text-xs transition-all duration-300 select-none focus:outline-none',
                        pathname.startsWith('/admin/billing')
                          ? 'border-[#0000ff] bg-[#0000ff]/25 font-semibold text-white shadow-[0_0_15px_rgba(0,0,255,0.45)]'
                          : 'border-[#0000ff]/35 bg-[#0000ff]/10 text-zinc-300 hover:border-[#0000ff]/50 hover:bg-[#0000ff]/20 hover:text-white hover:shadow-[0_0_15px_rgba(0,0,255,0.35)]',
                      )}
                    >
                      <CreditCard
                        className={cn(
                          'h-3.5 w-3.5 flex-shrink-0 transition-colors',
                          pathname.startsWith('/admin/billing')
                            ? 'text-white'
                            : 'text-[#8080ff] group-hover:text-white',
                        )}
                      />
                      <span>Billing</span>
                    </button>
                    <button
                      onClick={() => router.push('/admin/invoices')}
                      className={cn(
                        'group mb-1.5 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-left text-xs transition-all duration-300 select-none focus:outline-none',
                        pathname.startsWith('/admin/invoices')
                          ? 'border-[#0000ff] bg-[#0000ff]/25 font-semibold text-white shadow-[0_0_15px_rgba(0,0,255,0.45)]'
                          : 'border-[#0000ff]/35 bg-[#0000ff]/10 text-zinc-300 hover:border-[#0000ff]/50 hover:bg-[#0000ff]/20 hover:text-white hover:shadow-[0_0_15px_rgba(0,0,255,0.35)]',
                      )}
                    >
                      <FileText
                        className={cn(
                          'h-3.5 w-3.5 flex-shrink-0 transition-colors',
                          pathname.startsWith('/admin/invoices')
                            ? 'text-white'
                            : 'text-[#8080ff] group-hover:text-white',
                        )}
                      />
                      <span>Invoices</span>
                    </button>
                  </>
                )}

                {!isSuperAdmin && (
                  <button
                    onClick={() => router.push('/change-password')}
                    className={cn(
                      'group mb-1.5 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-left text-xs transition-all duration-300 select-none focus:outline-none',
                      pathname.startsWith('/change-password')
                        ? 'border-[#0000ff] bg-[#0000ff]/25 font-semibold text-white shadow-[0_0_15px_rgba(0,0,255,0.45)]'
                        : 'border-[#0000ff]/35 bg-[#0000ff]/10 text-zinc-300 hover:border-[#0000ff]/50 hover:bg-[#0000ff]/20 hover:text-white hover:shadow-[0_0_15px_rgba(0,0,255,0.35)]',
                    )}
                  >
                    <KeyRound
                      className={cn(
                        'h-3.5 w-3.5 flex-shrink-0 transition-colors',
                        pathname.startsWith('/change-password')
                          ? 'text-white'
                          : 'text-[#8080ff] group-hover:text-white',
                      )}
                    />
                    <span>Change Password</span>
                  </button>
                )}

                {!isSuperAdmin && (
                  <button
                    onClick={() => router.push('/legal')}
                    className={cn(
                      'group mb-1.5 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-left text-xs transition-all duration-300 select-none focus:outline-none',
                      pathname.startsWith('/legal')
                        ? 'border-[#0000ff] bg-[#0000ff]/25 font-semibold text-white shadow-[0_0_15px_rgba(0,0,255,0.45)]'
                        : 'border-[#0000ff]/35 bg-[#0000ff]/10 text-zinc-300 hover:border-[#0000ff]/50 hover:bg-[#0000ff]/20 hover:text-white hover:shadow-[0_0_15px_rgba(0,0,255,0.35)]',
                    )}
                  >
                    <Scale
                      className={cn(
                        'h-3.5 w-3.5 flex-shrink-0 transition-colors',
                        pathname.startsWith('/legal')
                          ? 'text-white'
                          : 'text-[#8080ff] group-hover:text-white',
                      )}
                    />
                    <span>Legal Documents</span>
                  </button>
                )}

                {!isSuperAdmin && (
                  <button
                    onClick={() => router.push('/contact-support')}
                    className={cn(
                      'group mb-1.5 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-left text-xs transition-all duration-300 select-none focus:outline-none',
                      pathname.startsWith('/contact-support')
                        ? 'border-[#0000ff] bg-[#0000ff]/25 font-semibold text-white shadow-[0_0_15px_rgba(0,0,255,0.45)]'
                        : 'border-[#0000ff]/35 bg-[#0000ff]/10 text-zinc-300 hover:border-[#0000ff]/50 hover:bg-[#0000ff]/20 hover:text-white hover:shadow-[0_0_15px_rgba(0,0,255,0.35)]',
                    )}
                  >
                    <Mail
                      className={cn(
                        'h-3.5 w-3.5 flex-shrink-0 transition-colors',
                        pathname.startsWith('/contact-support')
                          ? 'text-white'
                          : 'text-[#8080ff] group-hover:text-white',
                      )}
                    />
                    <span>Contact Support</span>
                  </button>
                )}

                <button
                  onClick={() => onOpen({ type: 'logout' })}
                  className="group mb-1.5 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 text-left text-xs text-red-200 transition-all duration-300 select-none hover:border-red-500/50 hover:bg-red-500/20 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] focus:outline-none"
                >
                  <LogOut className="h-3.5 w-3.5 flex-shrink-0 text-red-400 transition-colors group-hover:text-white" />
                  <span>Logout Account</span>
                </button>
              </div>
            ) : activeBotId === null ? (
              /* General Mode Chat History List */
              <div className="flex-1 overflow-y-auto bg-[#0c1120] px-4 py-2 dark:bg-[#0c1120]">
                <ConversationsList
                  searchQuery={searchQuery}
                  activeTab="search"
                />
              </div>
            ) : (
              /* Space-Specific Threads List */
              <div className="flex-1 space-y-1.5 overflow-y-auto bg-[#0c1120] px-4 py-2 dark:bg-[#0c1120]">
                  {isSpaceMonitorSection
                    ? spaceMonitors
                        .filter(monitor => {
                          const normalizedQuery = searchQuery.toLowerCase();
                          const name = (monitor.name || '').toLowerCase();
                          const query = (
                            monitor.search?.query || ''
                          ).toLowerCase();

                          return (
                            !normalizedQuery ||
                            name.includes(normalizedQuery) ||
                            query.includes(normalizedQuery)
                          );
                        })
                        .map(monitor => {
                          const monitorId = getMonitorId(monitor);
                          const isSelected = monitorParam === monitorId;

                          return (
                            <div
                              key={monitorId}
                              onClick={() => {
                                setSelectedOption(OPTIONS.MONITOR);
                                router.push(
                                  getSpaceSectionUrl('monitor', {
                                    monitorId,
                                  }),
                                );
                              }}
                              className={cn(
                                'group mb-1.5 flex min-h-11 w-full cursor-pointer items-center justify-between rounded-lg border text-left text-xs font-normal transition-all duration-300 select-none',
                                isSelected
                                  ? 'border-[#0000ff] bg-[#0000ff]/15 font-semibold text-white shadow-[0_0_20px_rgba(0,0,255,0.55)]'
                                  : 'border-[#0000ff]/35 bg-[#0000ff]/10 text-zinc-300 hover:border-[#0000ff]/50 hover:bg-[#0000ff]/20 hover:text-white hover:shadow-[0_0_15px_rgba(0,0,255,0.35)]',
                              )}
                            >
                              <span className="flex flex-1 flex-col gap-1 truncate px-3 py-2">
                                <span className="truncate font-medium">
                                  {monitor.name || 'Untitled monitor'}
                                </span>
                                <span className="truncate text-[10px] text-zinc-400 group-hover:text-zinc-200">
                                  {monitor.search?.query ||
                                    'No search query configured.'}
                                </span>
                              </span>
                            </div>
                          );
                        })
                    : isSpaceResearchSection
                      ? researchSessions
                          .filter(session =>
                            (session.searches?.[0]?.query || '')
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                          )
                          .map(session => {
                            const id = session.id || session._id || '';
                            const title =
                              session.searches?.[0]?.query ||
                              'Untitled research';
                            const isSelected =
                              sessionParam === id && pathname === '/spaces';
                            return (
                              <div
                                key={id}
                                onClick={() => {
                                  setSelectedOption(OPTIONS.RESEARCH);
                                  router.push(
                                    getSpaceSectionUrl('research', {
                                      sessionId: id,
                                    }),
                                  );
                                }}
                                className={cn(
                                  'group mb-1.5 flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border text-left text-xs font-normal transition-all duration-300 select-none',
                                  isSelected
                                    ? 'border-[#0000ff] bg-[#0000ff]/15 font-semibold text-white shadow-[0_0_20px_rgba(0,0,255,0.55)]'
                                    : 'border-[#0000ff]/35 bg-[#0000ff]/10 text-zinc-300 hover:border-[#0000ff]/50 hover:bg-[#0000ff]/20 hover:text-white hover:shadow-[0_0_15px_rgba(0,0,255,0.35)]',
                                )}
                              >
                                <span className="flex flex-1 items-center gap-2.5 truncate px-3 py-2">
                                  {getThreadIcon(title, isSelected)}
                                  <span className="truncate">{title}</span>
                                </span>
                              </div>
                            );
                          })
                      : viewParam === 'data' && activeBot
                        ? /* Knowledge Files List */
                          allFiles.map((file, idx) => {
                            const IconComponent = getFileIconComponent(
                              file.name,
                            );
                            return (
                              <div
                                key={idx}
                                className="group mb-1.5 flex h-9 w-full cursor-default items-center justify-between rounded-lg border border-[#0000ff]/35 bg-[#0000ff]/10 text-left text-xs font-normal text-zinc-300 transition-all duration-300 hover:text-white"
                              >
                                <div className="flex flex-1 items-center gap-2 truncate px-3 py-2">
                                  <IconComponent className="h-3.5 w-3.5 flex-shrink-0 text-blue-400" />
                                  <span className="truncate" title={file.name}>
                                    {file.name}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSpaceItemToDelete({
                                      type: 'data',
                                      index: idx,
                                      name: file.name,
                                    });
                                  }}
                                  className="mr-2 rounded p-1 text-zinc-400 opacity-100 transition-colors hover:bg-red-500/20 hover:text-red-500 focus:outline-none md:opacity-0 md:group-hover:opacity-100"
                                  title="Remove File"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            );
                          })
                        : viewParam === 'instructions' && activeBot
                          ? /* Instructions List */
                            allInstructions.map((instruction, idx) => {
                              const isSelected = currentEditIndex === idx;
                              return (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    setSelectedOption(OPTIONS.INSTRUCTIONS);
                                    router.push(
                                      `/spaces?bot=${activeBotId}&view=instructions&editIndex=${idx}`,
                                    );
                                  }}
                                  className={cn(
                                    'group mb-1.5 flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border text-left text-xs font-normal transition-all duration-300 select-none',
                                    isSelected
                                      ? 'border-[#0000ff] bg-[#0000ff]/25 font-semibold text-white shadow-[0_0_15px_rgba(0,0,255,0.45)]'
                                      : 'border-[#0000ff]/35 bg-[#0000ff]/10 text-zinc-300 hover:border-[#0000ff]/50 hover:bg-[#0000ff]/20 hover:text-white hover:shadow-[0_0_12px_rgba(0,0,255,0.25)]',
                                  )}
                                >
                                  <div className="flex flex-1 items-center gap-2 truncate px-3 py-2">
                                    <Terminal className="text-indigo-405 h-3.5 w-3.5 flex-shrink-0" />
                                    <span
                                      className="truncate"
                                      title={instruction}
                                    >
                                      {instruction}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.stopPropagation();
                                      setSpaceItemToDelete({
                                        type: 'instructions',
                                        index: idx,
                                        name: instruction,
                                      });
                                    }}
                                    className="mr-2 rounded p-1 text-zinc-400 opacity-100 transition-colors hover:bg-red-500/20 hover:text-red-500 focus:outline-none md:opacity-0 md:group-hover:opacity-100"
                                    title="Remove Instruction"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              );
                            })
                          : viewParam === 'guardrails' && activeBot
                            ? /* Guardrails List */
                              allGuardrails.map((guardrail, idx) => {
                                const isSelected = currentEditIndex === idx;
                                return (
                                  <div
                                    key={idx}
                                    onClick={() => {
                                      setSelectedOption(OPTIONS.GUARDRAILS);
                                      router.push(
                                        `/spaces?bot=${activeBotId}&view=guardrails&editIndex=${idx}`,
                                      );
                                    }}
                                    className={cn(
                                      'group mb-1.5 flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border text-left text-xs font-normal transition-all duration-300 select-none',
                                      isSelected
                                        ? 'border-[#0000ff] bg-[#0000ff]/25 font-semibold text-white shadow-[0_0_15px_rgba(0,0,255,0.45)]'
                                        : 'border-[#0000ff]/35 bg-[#0000ff]/10 text-zinc-300 hover:border-[#0000ff]/50 hover:bg-[#0000ff]/20 hover:text-white hover:shadow-[0_0_12px_rgba(0,0,255,0.25)]',
                                    )}
                                  >
                                    <div className="flex flex-1 items-center gap-2 truncate px-3 py-2">
                                      <Shield className="h-3.5 w-3.5 flex-shrink-0 text-red-400" />
                                      <span
                                        className="truncate"
                                        title={guardrail}
                                      >
                                        {guardrail}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={e => {
                                        e.stopPropagation();
                                        setSpaceItemToDelete({
                                          type: 'guardrails',
                                          index: idx,
                                          name: guardrail,
                                        });
                                      }}
                                      className="mr-2 rounded p-1 text-zinc-400 opacity-100 transition-colors hover:bg-red-500/20 hover:text-red-500 focus:outline-none md:opacity-0 md:group-hover:opacity-100"
                                      title="Remove Guardrail"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                );
                              })
                            : /* Space Search Sessions List */
                              searchSessions
                                .filter(session =>
                                  (session.searches?.[0]?.query || '')
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase()),
                                )
                                .map(session => {
                                  const id = session.id || session._id || '';
                                  const title =
                                    session.searches?.[0]?.query ||
                                    'Untitled search';
                                  const isSelected =
                                    sessionParam === id &&
                                    pathname === '/spaces';
                                  return (
                                    <div
                                      key={id}
                                      onClick={() => {
                                        setSelectedOption(null);
                                        router.push(
                                          `/spaces?bot=${activeBotId}&session=${id}`,
                                        );
                                      }}
                                      className={cn(
                                        'group mb-1.5 flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border text-left text-xs font-normal transition-all duration-300 select-none',
                                        isSelected
                                          ? 'border-[#0000ff] bg-[#0000ff]/15 font-semibold text-white shadow-[0_0_20px_rgba(0,0,255,0.55)]'
                                          : 'border-[#0000ff]/35 bg-[#0000ff]/10 text-zinc-300 hover:border-[#0000ff]/50 hover:bg-[#0000ff]/20 hover:text-white hover:shadow-[0_0_15px_rgba(0,0,255,0.35)]',
                                      )}
                                    >
                                      <span className="flex flex-1 items-center gap-2.5 truncate px-3 py-2">
                                        {getThreadIcon(title, isSelected)}
                                        <span className="truncate">
                                          {title}
                                        </span>
                                      </span>
                                    </div>
                                  );
                                })}
                  {/* Fallbacks */}
                  {isSpaceMonitorSection && isLoadingSpaceMonitors && (
                    <div className="py-8 text-center text-xs text-zinc-500 italic">
                      Loading monitors...
                    </div>
                  )}
                  {isSpaceResearchSection && researchSessions.length === 0 && (
                    <div className="py-8 text-center text-xs text-zinc-500 italic">
                      No research sessions yet.
                    </div>
                  )}
                  {isSpaceResearchSection &&
                    researchSessions.length > 0 &&
                    researchSessions.every(
                      session =>
                        !(session.searches?.[0]?.query || '')
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                    ) && (
                      <div className="py-8 text-center text-xs text-zinc-500 italic">
                        No research sessions match your search.
                      </div>
                    )}
                  {isSpaceMonitorSection &&
                    !isLoadingSpaceMonitors &&
                    spaceMonitors.length === 0 && (
                      <div className="py-8 text-center text-xs text-zinc-500 italic">
                        No monitors created yet.
                      </div>
                    )}
                  {isSpaceMonitorSection &&
                    !isLoadingSpaceMonitors &&
                    spaceMonitors.length > 0 &&
                    spaceMonitors.every(monitor => {
                      const normalizedQuery = searchQuery.toLowerCase();
                      const name = (monitor.name || '').toLowerCase();
                      const query = (monitor.search?.query || '').toLowerCase();

                      return (
                        normalizedQuery !== '' &&
                        !name.includes(normalizedQuery) &&
                        !query.includes(normalizedQuery)
                      );
                    }) && (
                      <div className="py-8 text-center text-xs text-zinc-500 italic">
                        No monitors match your search.
                      </div>
                    )}
                  {viewParam === 'data' && allFiles.length === 0 && (
                    <div className="py-8 text-center text-xs text-zinc-500 italic">
                      No files uploaded yet.
                    </div>
                  )}
                  {viewParam === 'instructions' &&
                    allInstructions.length === 0 && (
                      <div className="py-8 text-center text-xs text-zinc-500 italic">
                        No instructions added yet.
                      </div>
                    )}
                  {viewParam === 'guardrails' && allGuardrails.length === 0 && (
                    <div className="py-8 text-center text-xs text-zinc-500 italic">
                      No guardrails defined yet.
                    </div>
                  )}
                </div>
            )}
          </div>


          {/* Footer Area */}
          <div className="sticky bottom-0 z-30 flex h-[64px] w-full flex-none flex-col justify-center border-t border-zinc-800/60 bg-[#0c1120] p-4 py-2.5">
            {isLoggedIn && activeTab === 'account' ? (
              <div className="flex h-11 w-full items-center justify-center">
                <Button
                  variant="default"
                  className="w-full justify-center gap-2 rounded-[3px] border border-transparent bg-[#e1e1e1] font-normal text-black hover:bg-[#d0d0d0]"
                  onClick={() => {
                    setActiveTab('search');
                    router.push(isLoggedIn ? '/c/new-search' : '/');
                  }}
                >
                  Return to App
                </Button>
              </div>
            ) : (
              <div className="flex h-11 w-full items-center justify-center">
                {!isLoggedIn ? (
                  <div className="flex w-full items-center gap-2">
                    <Button
                      type="button"
                      variant="default"
                      className="flex-1 cursor-pointer rounded-[3px] bg-[#e1e1e1] px-0 font-normal text-black hover:bg-[#d0d0d0]"
                      onClick={() =>
                        onOpen({ type: 'auth-modal', actionId: 'login' })
                      }
                    >
                      Login
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      className="flex-1 cursor-pointer rounded-[3px] bg-[#e1e1e1] px-0 font-normal text-black hover:bg-[#d0d0d0]"
                      onClick={() =>
                        onOpen({ type: 'auth-modal', actionId: 'register' })
                      }
                    >
                      Register
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('account')}
                    className="w-full cursor-pointer rounded-[3px] border border-transparent bg-[#e1e1e1] font-normal text-zinc-900 shadow-sm transition-all duration-300 outline-none select-none hover:bg-[#d0d0d0] dark:border-transparent dark:bg-[#e1e1e1] dark:text-zinc-900 dark:hover:bg-[#d0d0d0]"
                  >
                    My Account
                  </Button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )}

      {/* Delete Space Dialog */}
      <Dialog
        open={botToDelete !== null}
        onOpenChange={open => !open && setBotToDelete(null)}
      >
        <DialogContent className="max-w-[320px] overflow-hidden rounded-[20px] border-none bg-white p-0 shadow-xl sm:max-w-[320px] dark:bg-zinc-900 [&>button]:hidden">
          {/* Centered Content Section */}
          <div className="px-5 pt-5 pb-4 text-center">
            <h2 className="text-[17px] leading-tight font-semibold text-black dark:text-white">
              Delete Space
            </h2>
            <p className="mt-1.5 px-1 text-[13px] leading-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to remove this space? This action cannot be
              undone.
            </p>
          </div>

          {/* Extended Border & iOS Layout Action Buttons */}
          <div className="flex h-11 border-t border-black/10 dark:border-white/10">
            <DialogClose asChild>
              <button
                type="button"
                className="flex h-full flex-1 cursor-pointer items-center justify-center border-r border-black/10 text-[15px] font-normal text-black transition-colors outline-none hover:bg-black/5 active:bg-black/10 dark:border-white/10 dark:text-white dark:hover:bg-white/5 dark:active:bg-white/10"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="button"
              className="text-red-650 flex h-full flex-1 cursor-pointer items-center justify-center text-[15px] font-normal transition-colors outline-none hover:bg-black/5 active:bg-black/10 dark:hover:bg-white/5 dark:active:bg-white/10"
              onClick={async () => {
                if (botToDelete) {
                  const token = data?.accessToken;
                  setActiveBotId(null);
                  setSelectedOption(null);
                  router.push(isLoggedIn ? '/c/new-search' : '/');
                  setTimeout(() => {
                    deleteBot(botToDelete, token);
                  }, 100);
                  setBotToDelete(null);
                }
              }}
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Space Item Dialog */}
      <Dialog
        open={spaceItemToDelete !== null}
        onOpenChange={open => !open && setSpaceItemToDelete(null)}
      >
        <DialogContent className="max-w-[320px] overflow-hidden rounded-[20px] border-none bg-white p-0 shadow-xl sm:max-w-[320px] dark:bg-zinc-900 [&>button]:hidden">
          {/* Centered Content Section */}
          <div className="px-5 pt-5 pb-4 text-center">
            <h2 className="text-[17px] leading-tight font-semibold text-black dark:text-white">
              Delete{' '}
              {spaceItemToDelete?.type === 'data'
                ? 'File'
                : spaceItemToDelete?.type === 'instructions'
                  ? 'Instruction'
                  : 'Guardrail'}
            </h2>
            <p className="mt-1.5 px-1 text-[13px] leading-normal break-words text-gray-500 dark:text-gray-400">
              Are you sure you want to delete &ldquo;{spaceItemToDelete?.name}
              &rdquo;? This action cannot be undone.
            </p>
          </div>

          {/* Extended Border & iOS Layout Action Buttons */}
          <div className="flex h-11 border-t border-black/10 dark:border-white/10">
            <DialogClose asChild>
              <button
                type="button"
                className="flex h-full flex-1 cursor-pointer items-center justify-center border-r border-black/10 text-[15px] font-normal text-black transition-colors outline-none hover:bg-black/5 active:bg-black/10 dark:border-white/10 dark:text-white dark:hover:bg-white/5 dark:active:bg-white/10"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="button"
              className="text-red-650 flex h-full flex-1 cursor-pointer items-center justify-center text-[15px] font-normal transition-colors outline-none hover:bg-black/5 active:bg-black/10 dark:hover:bg-white/5 dark:active:bg-white/10"
              onClick={() => {
                if (spaceItemToDelete && activeBot) {
                  const { type, index } = spaceItemToDelete;
                  if (type === 'data') {
                    const updatedFiles = allFiles.filter((_, i) => i !== index);
                    if (updatedFiles.length === 0) {
                      editBot(activeBot.id, { data: undefined });
                    } else {
                      editBot(activeBot.id, {
                        data: JSON.stringify(updatedFiles),
                      });
                    }
                  } else if (type === 'instructions') {
                    const updatedInstructions = allInstructions.filter(
                      (_, i) => i !== index,
                    );
                    editBot(activeBot.id, {
                      instructions: updatedInstructions.join('\n\n'),
                    });
                  } else if (type === 'guardrails') {
                    const updatedGuardrails = allGuardrails.filter(
                      (_, i) => i !== index,
                    );
                    editBot(activeBot.id, {
                      guardrails: updatedGuardrails.join('\n\n'),
                    });
                  }
                  setSpaceItemToDelete(null);
                }
              }}
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!botToRename} onOpenChange={() => setBotToRename(null)}>
        <DialogContent
          className="dark:bg-zinc-955 max-w-[320px] overflow-hidden rounded-[20px] border-none bg-[#e1e1e1] p-6 shadow-xl sm:max-w-[320px] [&>button]:hidden"
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <div className="space-y-4">
            <input
              type="text"
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && renameValue.trim() && botToRename) {
                  const token = data?.accessToken;
                  editBot(botToRename, { name: renameValue.trim() }, token);
                  setBotToRename(null);
                }
              }}
              placeholder="Enter space name..."
              className="w-full rounded-xl border-none bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none dark:bg-zinc-900 dark:text-white"
            />
            <div className="-mx-6 mt-4 -mb-6 flex h-11 border-t border-black/10 dark:border-white/10">
              <button
                className="h-full flex-1 border-r border-black/10 text-sm font-normal text-black outline-none hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                onClick={() => setBotToRename(null)}
              >
                Cancel
              </button>
              <button
                className="h-full flex-1 text-sm font-medium text-indigo-600 outline-none hover:bg-black/5 disabled:opacity-50 dark:text-indigo-400 dark:hover:bg-white/5"
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
      <Dialog
        open={isCreateSpaceOpen}
        onOpenChange={open => !open && setIsCreateSpaceOpen(false)}
      >
        <DialogContent
          className="dark:bg-zinc-955 max-w-[320px] overflow-hidden rounded-[20px] border-none bg-[#e1e1e1] p-6 shadow-xl sm:max-w-[320px] [&>button]:hidden"
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <div className="space-y-4">
            <h2 className="text-center text-[17px] leading-tight font-semibold text-black dark:text-white">
              Create A New Space
            </h2>
            <input
              type="text"
              value={newSpaceName}
              onChange={e => setNewSpaceName(e.target.value)}
              onKeyDown={e => {
                if (
                  e.key === 'Enter' &&
                  newSpaceName.trim() &&
                  !isCreatingSpace
                ) {
                  handleCreateSpace();
                }
              }}
              placeholder="Enter Space Name"
              disabled={isCreatingSpace}
              className="w-full rounded-xl border-none bg-white px-3 py-2.5 text-xs text-gray-900 outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none dark:bg-zinc-900 dark:text-white"
            />
            <div className="-mx-6 mt-4 -mb-6 flex h-11 border-t border-black/10 dark:border-white/10">
              <button
                className="h-full flex-1 border-r border-black/10 text-sm font-normal text-black outline-none hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                onClick={() => setIsCreateSpaceOpen(false)}
                disabled={isCreatingSpace}
              >
                Cancel
              </button>
              <button
                className="flex h-full flex-1 items-center justify-center gap-1.5 text-sm font-normal text-black outline-none hover:bg-black/5 disabled:opacity-50 dark:text-white dark:hover:bg-white/5"
                onClick={handleCreateSpace}
                disabled={!newSpaceName.trim() || isCreatingSpace}
              >
                {isCreatingSpace && (
                  <Loader2 className="size-3.5 animate-spin" />
                )}
                Create
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeftSideNav;
