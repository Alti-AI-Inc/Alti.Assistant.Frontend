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
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { useBotsStore } from '@/stores/useBotsStore';
import { OPTIONS, useConversationsStore } from '@/stores/useConversationsStore';
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
import ConversationsList from '../ConversationsList';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

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
    name: 'MinIO Sovereign Storage',
    icon: '☁️',
    description: 'Index S3 storage buckets',
    status: 'soon',
  },
];

const AVAILABLE_MCP_APPS = (() => {
  const uniqueMap = new Map<string, APP>();
  allApps.forEach((app: APP) => {
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

export interface SpaceThread {
  id: string;
  botId?: string;
  title?: string;
  [key: string]: unknown;
}

export const useNavState = ({
  side = 'left',
}: { side?: 'left' | 'right' } = {}) => {
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
          model: 'Llama 3.1 70B',
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
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : String(err));
      toast.error('Failed to create space');
    } finally {
      setIsCreatingSpace(false);
    }
  };

  const unreadInboxCount = inboxItems.filter(
    (item: { isRead?: boolean }) => !item.isRead,
  ).length;

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
      setTasks(storage.get<any[]>(STORAGE_KEYS.AUTOMATIONS) || []);
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('aphura_automations_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'aphura_automations_updated',
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
    userEmail === 'admin@aphura.ai' || isGlobalAdmin || isTenantOwner;
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
          .map((account: { toolkit?: { slug?: string } }) =>
            account.toolkit?.slug?.toLowerCase(),
          )
          .filter((s): s is string => Boolean(s)),
      );

      // Seed sample apps for testing if this is meram.michael@gmail.com
      if (data?.user?.email?.toLowerCase() === 'meram.michael@gmail.com') {
        const sampleSlugs = ['slack', 'google-maps', 'postgres', 'evernote'];
        sampleSlugs.forEach(slug => activeSlugs.add(slug));
      }

      setConnectedAppSlugs(activeSlugs);

      // Resolve connected apps
      const connected = allApps.filter((app: APP) =>
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
            (a: APP) => a.app_name.toLowerCase() === slug.toLowerCase(),
          );
          if (match) sorted.push(match);
        });
        const remaining = connected.filter(
          (a: APP) => !savedOrder.includes(a.app_name.toLowerCase()),
        );
        remaining.sort((a: APP, b: APP) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
        );
        sorted = [...sorted, ...remaining];
      } else {
        sorted = connected.sort((a: APP, b: APP) =>
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
      pathname.startsWith('/knowledge') ||
      pathname.startsWith('/connectors') ||
      pathname.startsWith('/developers') ||
      pathname.startsWith('/platform-knowledge') ||
      pathname.startsWith('/legal') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/platform-memory') ||
      pathname.startsWith('/change-password') ||
      pathname.startsWith('/invite-friends')
    ) {
      setActiveTab('account');
    }
  }, [pathname, isLoggedIn]);

  // Reset active tab to search when user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      setActiveTab('search');
    }
  }, [isLoggedIn]);

  // Prefetch new chat route for instantaneous navigation
  useEffect(() => {
    router.prefetch(isLoggedIn ? '/c/new-search' : '/');
  }, [isLoggedIn, router]);

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
            window.dispatchEvent(new Event('aphura_new_task_click'));
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

  return {
    SHOW_WORKSPACES,
    activeAppSlug,
    activeBot,
    activeBotId,
    activeConnectorId,
    activeConversation,
    activeTab,
    addBotAsync,
    allGuardrails,
    allInstructions,
    appsFilterTab,
    botToDelete,
    botToRename,
    bots,
    connectedAppSlugs,
    currentEditIndex,
    currentTenant,
    deleteBot,
    displayedApps,
    dragOverAppIndex,
    dragOverIndex,
    draggedAppIndex,
    draggedIndex,
    editBot,
    editIndexParam,
    filteredApps,
    getPlusButtonProps,
    getSpaceInitials,
    getSpaceSectionUrl,
    getThreadIcon,
    handleCreateSpace,
    handleLogoMouseEnter,
    handleTabChange,
    hideSidebar,
    isAdmin,
    isAdminMode,
    isAdminSection,
    isCreateSpaceOpen,
    isCreatingSpace,
    isGlobalAdmin,
    isGlobalInboxOpen,
    isLeftSidebarOpen,
    isLoggedIn,
    isManager,
    isRightSidebarOpen,
    isSpaceMonitorSection,
    isSpaceResearchSection,
    isSuperAdmin,
    isTenantAdmin,
    isTenantOwner,
    localAppsOrder,
    logoHovered,
    mode,
    monitorParam,
    newSpaceName,
    onOpen,
    pathname,
    plusProps,
    projectTab,
    renameValue,
    reorderApps,
    reorderBots,
    researchSessions,
    router,
    searchParams,
    searchQuery,
    searchSessions,
    selectedOption,
    sessionParam,
    setActiveBotId,
    setActiveBotThreadId,
    setActiveConversation,
    setActiveTab,
    setAppsFilterTab,
    setBotToDelete,
    setBotToRename,
    setConnectedAppSlugs,
    setDragOverAppIndex,
    setDragOverIndex,
    setDraggedAppIndex,
    setDraggedIndex,
    setIsCreateSpaceOpen,
    setIsCreatingSpace,
    setLocalAppsOrder,
    setLogoHovered,
    setNewSpaceName,
    setProjectTab,
    setRenameValue,
    setResearchSessions,
    setSearchQuery,
    setSearchSessions,
    setSelectedOption,
    setShowSpaceConfig,
    setShowStartLastMessage,
    setSpaceItemToDelete,
    setTasks,
    setUserMessage,
    showSpaceConfig,
    spaceItemToDelete,
    tasks,
    toggleGlobalInbox,
    toggleLeftSidebar,
    toggleRightSidebar,
    unreadInboxCount,
    userEmail,
    viewParam,
    data,
    inboxItems,
    spaceMonitors,
    allFiles: allFiles || [],
    isLoadingSpaceMonitors,
    threads: [] as SpaceThread[],
    deleteThread: (id: string) => {},
    connections: [] as unknown[],
    setThreads: (threads: SpaceThread[]) => {},
    activeBotThreadId: null,
  };
};
