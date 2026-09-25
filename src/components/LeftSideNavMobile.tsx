'use client';

import { useNavState } from './left-side-nav/useNavState';
import { createKnowledgeBaseAction } from '@/actions/knowledgeBaseAction';
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
import { allApps, APP } from '@/lib/all-apps';
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
    name: 'MinIO Sovereign Storage',
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

const LeftSideNavMobile = () => {
  const state = useNavState({ side: 'left' });
  const {
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
    allFiles,
    isLoadingSpaceMonitors,
    threads,
    deleteThread,
    connections,
    setThreads,
    activeBotThreadId
  } = useNavState();
  
  return (
    <div className="flex h-full w-full overflow-hidden">
      {SHOW_WORKSPACES && (
        <div className="flex h-full w-[60px] flex-none flex-col items-center gap-3 border-r border-zinc-800/60 bg-black pt-4 select-none">
          {/* Aphura Home Logo */}
          <div className="relative flex w-full flex-col items-center">
            <div
              className={cn(
                'relative flex size-10 items-center justify-center rounded-xl border border-[#0000ff]/40 bg-[#0000ff]/15 text-white shadow-[0_0_15px_rgba(0,0,255,0.25)] select-none',
              )}
            >
              <img
                src="/assets/logo-icon.png"
                alt="Aphura Brand Logo"
                className="size-6 object-contain brightness-0 invert"
              />
            </div>
          </div>

          {/* General Workspace Button */}
          <div className="relative flex w-full flex-col items-center">
            <div
              className="absolute top-1 left-0 h-8 w-1 rounded-r-md bg-white transition-all duration-200"
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
                    close();
                  }}
                  className={cn(
                    'relative flex size-10 cursor-pointer items-center justify-center rounded-xl border border-[#0000ff]/40 bg-[#0000ff]/15 text-white shadow-[0_0_15px_rgba(0,0,255,0.25)] transition-all duration-300 hover:rounded-2xl hover:border-[#0000ff]/55 hover:bg-[#0000ff]/20 hover:shadow-[0_0_18px_rgba(0,0,255,0.3)]',
                  )}
                >
                  <LayoutGrid className="size-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="border border-white/10 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none"
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
                (pathname === '/spaces' || pathname.startsWith('/spaces')) &&
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
                        onClick={() => {
                          setSelectedOption(null);
                          setActiveBotId(bot.id);
                          router.push(`/spaces?bot=${bot.id}`);
                          close();
                        }}
                        className={cn(
                          'relative flex size-10 cursor-pointer items-center justify-center rounded-xl border border-[#0000ff]/40 bg-[#0000ff]/15 text-sm font-semibold text-white shadow-[0_0_15px_rgba(0,0,255,0.25)] transition-all duration-300 hover:rounded-2xl hover:border-[#0000ff]/55 hover:bg-[#0000ff]/20 hover:shadow-[0_0_18px_rgba(0,0,255,0.3)]',
                          isBeingDragged && 'opacity-40',
                        )}
                      >
                        {getSpaceInitials(bot.name)}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="max-w-[200px] border border-white/10 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none"
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
                    close();
                  }}
                  className="relative flex size-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-sm transition-all duration-200 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80"
                >
                  <Plus className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="border border-white/10 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none"
              >
                Create Space
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Column 2: Secondary Content navigation panel */}
      <div className="flex h-full min-w-0 flex-1 flex-col bg-black">

        {/* Navigation Body */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {activeTab === 'account' ? (
            <div className="animate-in fade-in flex min-h-full flex-col justify-between px-4 pt-4 pb-4 duration-200">
              <div className="space-y-1.5">
              {isSuperAdmin && (
                <button
                  onClick={() => {
                    router.push('/admin');
                    close();
                  }}
                  className={cn(
                    "group mb-1.5 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-[3px] text-left text-xs transition-all duration-150 select-none shadow-[0_2px_8px_rgba(0,0,0,0.5)] px-3 focus:outline-none",
                    pathname.startsWith('/admin')
                      ? "bg-[#32323a] text-white font-medium shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                      : "bg-[#1e1e24] text-zinc-200 hover:bg-[#282830] hover:text-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                  )}
                >
                  <Shield className={cn("h-3.5 w-3.5 flex-shrink-0 transition-colors", pathname.startsWith('/admin') ? "text-white" : "text-zinc-400 group-hover:text-white")} />
                  <span>Owner Platform</span>
                </button>
              )}
              {isAdmin && !isSuperAdmin && (
                <>
                  <button
                    onClick={() => {
                      router.push('/admin/plans');
                      close();
                    }}
                    className={cn(
                      "group mb-1.5 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-[3px] text-left text-xs transition-all duration-150 select-none shadow-[0_2px_8px_rgba(0,0,0,0.5)] px-3 focus:outline-none",
                      pathname.startsWith('/admin/plans')
                        ? "bg-[#32323a] text-white font-medium shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                        : "bg-[#1e1e24] text-zinc-200 hover:bg-[#282830] hover:text-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                    )}
                  >
                    <LayoutGrid
                      className={cn(
                        'h-3.5 w-3.5 flex-shrink-0 transition-colors',
                        pathname.startsWith('/admin/plans')
                          ? 'text-white'
                          : 'text-zinc-400 group-hover:text-white',
                      )}
                    />
                    <span>Plans</span>
                  </button>

                  <button
                    onClick={() => {
                      router.push('/admin/team-members');
                      close();
                    }}
                    className={cn(
                      "group mb-1.5 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-[3px] text-left text-xs transition-all duration-150 select-none shadow-[0_2px_8px_rgba(0,0,0,0.5)] px-3 focus:outline-none",
                      pathname.startsWith('/admin/team-members')
                        ? "bg-[#32323a] text-white font-medium shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                        : "bg-[#1e1e24] text-zinc-200 hover:bg-[#282830] hover:text-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                    )}
                  >
                    <Users
                      className={cn(
                        'h-3.5 w-3.5 flex-shrink-0 transition-colors',
                        pathname.startsWith('/admin/team-members')
                          ? 'text-white'
                          : 'text-zinc-400 group-hover:text-white',
                      )}
                    />
                    <span>Members</span>
                  </button>
                  <button
                    onClick={() => {
                      router.push('/admin/billing');
                      close();
                    }}
                    className={cn(
                      "group mb-1.5 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-[3px] text-left text-xs transition-all duration-150 select-none shadow-[0_2px_8px_rgba(0,0,0,0.5)] px-3 focus:outline-none",
                      pathname.startsWith('/admin/billing')
                        ? "bg-[#32323a] text-white font-medium shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                        : "bg-[#1e1e24] text-zinc-200 hover:bg-[#282830] hover:text-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                    )}
                  >
                    <CreditCard
                      className={cn(
                        'h-3.5 w-3.5 flex-shrink-0 transition-colors',
                        pathname.startsWith('/admin/billing')
                          ? 'text-white'
                          : 'text-zinc-400 group-hover:text-white',
                      )}
                    />
                    <span>Billing</span>
                  </button>
                  <button
                    onClick={() => {
                      router.push('/admin/invoices');
                      close();
                    }}
                    className={cn(
                      "group mb-1.5 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-[3px] text-left text-xs transition-all duration-150 select-none shadow-[0_2px_8px_rgba(0,0,0,0.5)] px-3 focus:outline-none",
                      pathname.startsWith('/admin/invoices')
                        ? "bg-[#32323a] text-white font-medium shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                        : "bg-[#1e1e24] text-zinc-200 hover:bg-[#282830] hover:text-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                    )}
                  >
                    <FileText
                      className={cn(
                        'h-3.5 w-3.5 flex-shrink-0 transition-colors',
                        pathname.startsWith('/admin/invoices')
                          ? 'text-white'
                          : 'text-zinc-400 group-hover:text-white',
                      )}
                    />
                    <span>Invoices</span>
                  </button>
                </>
              )}


              {!isSuperAdmin && (
                <button
                  onClick={() => {
                    router.push('/legal');
                    close();
                  }}
                  className={cn(
                    "group mb-1.5 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-[3px] text-left text-xs transition-all duration-150 select-none shadow-[0_2px_8px_rgba(0,0,0,0.5)] px-3 focus:outline-none",
                    pathname.startsWith('/legal')
                      ? "bg-[#32323a] text-white font-medium shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                      : "bg-[#1e1e24] text-zinc-200 hover:bg-[#282830] hover:text-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                  )}
                >
                  <Scale
                    className={cn(
                      'h-3.5 w-3.5 flex-shrink-0 transition-colors',
                      pathname.startsWith('/legal')
                        ? 'text-white'
                        : 'text-zinc-400 group-hover:text-white',
                    )}
                  />
                  <span>Legal</span>
                </button>
              )}


              </div>

              <div className="mt-auto pt-4">
                <button
                  onClick={() => {
                    onOpen({ type: 'logout' });
                    close();
                  }}
                  className="group flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-[3px] bg-[#1e1e24] text-red-400 px-3 text-left text-xs transition-all duration-150 select-none hover:bg-[#282830] hover:text-red-300 shadow-[0_2px_8px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.6)] focus:outline-none"
                >
                  <LogOut className="h-3.5 w-3.5 flex-shrink-0 text-red-400 transition-colors group-hover:text-red-300" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : activeBotId === null ? (
            /* General Mode */
            <div className="animate-in fade-in flex h-full min-h-0 flex-col duration-200">
              {/* Search Bar Row */}
              <div className="flex w-full flex-none items-center border-b border-zinc-800/60 bg-black px-4 pt-3 pb-3 dark:bg-black">
                <div className="flex h-9 w-full items-center overflow-hidden rounded-[3px] bg-white shadow-sm transition-all duration-200">
                  <div className="flex h-full flex-1 items-center px-2.5">
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
                      <Link
                        href={isLoggedIn ? '/c/new-search' : '/'}
                        prefetch={true}
                        onClick={() => {
                          setShowStartLastMessage(false);
                          setUserMessage('');
                          setSelectedOption(null);
                          close();
                        }}
                        className="flex h-full w-9 items-center justify-center border-l border-black/10 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-black focus:outline-none"
                      >
                        <Plus strokeWidth={1.5} className="size-4 text-zinc-800" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="border border-white/10 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none"
                    >
                      New Chat
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Chat History List */}
              <div className="flex-1 overflow-y-auto bg-black px-4 py-2 dark:bg-black">
                <ConversationsList
                  searchQuery={searchQuery}
                  activeTab="search"
                />
              </div>
            </div>
          ) : (
            /* Space Mode */
            <div className="animate-in fade-in flex h-full min-h-0 flex-col duration-200">
              {/* Configuration Tabs Toggle Group */}
              <div className="w-full flex-none bg-black px-4 pt-3 pb-1">
                <div className="flex w-full rounded-lg border border-[#0000ff]/35 bg-[#0000ff]/10 p-0.5 shadow-[0_0_12px_rgba(0,0,255,0.25)] select-none">
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        viewParam === 'data' ||
                        selectedOption === OPTIONS.KNOWLEDGE
                      ) {
                        setSelectedOption(null);
                        router.push(`/spaces?bot=${activeBotId}`);
                      } else {
                        setSelectedOption(OPTIONS.KNOWLEDGE);
                        router.push(`/spaces?bot=${activeBotId}&view=data`);
                      }
                      close();
                    }}
                    className={cn(
                      'flex-1 cursor-pointer rounded-md border border-transparent py-1.5 text-center text-[11px] font-medium transition-all outline-none',
                      viewParam === 'data' ||
                        selectedOption === OPTIONS.KNOWLEDGE
                        ? 'bg-[#0000ff]/30 text-white shadow-[0_0_8px_rgba(0,0,255,0.4)]'
                        : 'text-blue-200/70 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    Knowledge
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        viewParam === 'instructions' ||
                        selectedOption === OPTIONS.INSTRUCTIONS
                      ) {
                        setSelectedOption(null);
                        router.push(`/spaces?bot=${activeBotId}`);
                      } else {
                        setSelectedOption(OPTIONS.INSTRUCTIONS);
                        router.push(
                          `/spaces?bot=${activeBotId}&view=instructions`,
                        );
                      }
                      close();
                    }}
                    className={cn(
                      'flex-1 cursor-pointer rounded-md border border-transparent py-1.5 text-center text-[11px] font-medium transition-all outline-none',
                      viewParam === 'instructions' ||
                        selectedOption === OPTIONS.INSTRUCTIONS
                        ? 'bg-[#0000ff]/30 text-white shadow-[0_0_8px_rgba(0,0,255,0.4)]'
                        : 'text-blue-200/70 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    Instructions
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        viewParam === 'guardrails' ||
                        selectedOption === OPTIONS.GUARDRAILS
                      ) {
                        setSelectedOption(null);
                        router.push(`/spaces?bot=${activeBotId}`);
                      } else {
                        setSelectedOption(OPTIONS.GUARDRAILS);
                        router.push(
                          `/spaces?bot=${activeBotId}&view=guardrails`,
                        );
                      }
                      close();
                    }}
                    className={cn(
                      'flex-1 cursor-pointer rounded-md border border-transparent py-1.5 text-center text-[11px] font-medium transition-all outline-none',
                      viewParam === 'guardrails' ||
                        selectedOption === OPTIONS.GUARDRAILS
                        ? 'bg-[#0000ff]/30 text-white shadow-[0_0_8px_rgba(0,0,255,0.4)]'
                        : 'text-blue-200/70 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    Guardrails
                  </button>
                </div>
              </div>

              {/* Search Bar Row (Same exact styling as general chat mode) */}
              <div className="flex w-full flex-none items-center gap-2 border-b border-zinc-800/60 bg-black px-4 pt-3 pb-3 dark:bg-black">
                <div className="flex h-9 flex-1 items-center overflow-hidden rounded-[3px] border border-[#0000ff]/35 bg-[#0000ff]/10 shadow-[0_0_12px_rgba(0,0,255,0.25)] transition-all duration-300 focus-within:border-[#0000ff] focus-within:shadow-[0_0_20px_rgba(0,0,255,0.55)] focus-within:ring-1 focus-within:ring-[#0000ff]/40">
                  <div className="flex h-full flex-1 items-center px-3">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
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
                        className="flex h-full w-9 items-center justify-center border-l border-[#0000ff]/30 text-blue-100 transition-all hover:bg-[#0000ff]/20 focus:outline-none"
                      >
                        <Plus className="size-3.5 text-white" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="border border-white/10 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none"
                    >
                      New Chat
                    </TooltipContent>
                  </Tooltip>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-9 shrink-0 border-[#0000ff]/35 bg-[#0000ff]/10 text-[#8080ff] shadow-[0_0_12px_rgba(0,0,255,0.25)] transition-all hover:bg-[#0000ff]/20 hover:text-white focus:outline-none"
                    >
                      <EllipsisVertical className="size-4 rotate-90" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-2xl" align="end">
                    <DropdownMenuItem
                      className="text-zinc-700 focus:bg-zinc-100 dark:text-zinc-200 dark:focus:bg-zinc-800"
                      onClick={() => setBotToRename(activeBotId)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Rename Space
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="border-black/5 dark:border-white/5" />
                    <DropdownMenuItem
                      className="text-zinc-700 focus:bg-zinc-100 dark:text-zinc-200 dark:focus:bg-zinc-800"
                      onClick={() => setBotToDelete(activeBotId)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Space
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Space-Specific Threads List */}
              <div className="flex-1 space-y-1.5 overflow-y-auto bg-black px-4 py-2 dark:bg-black">
                {viewParam === 'data' && activeBot
                  ? /* Knowledge Files List */
                    allFiles.map((file, idx) => {
                      const IconComponent = getFileIconComponent(file.name);
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
                            className="text-zinc-450 mr-2 rounded p-1 opacity-100 transition-colors hover:bg-red-500/20 hover:text-red-500 focus:outline-none"
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
                              <span className="truncate" title={instruction}>
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
                              className="text-zinc-450 mr-2 rounded p-1 text-zinc-400 opacity-100 transition-colors hover:bg-red-500/20 hover:text-red-500 focus:outline-none"
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
                                <span className="truncate" title={guardrail}>
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
                                className="text-zinc-450 mr-2 rounded p-1 text-zinc-400 opacity-100 transition-colors hover:bg-red-500/20 hover:text-red-500 focus:outline-none"
                                title="Remove Guardrail"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          );
                        })
                      : /* Space-Specific Threads List */
                        threads
                          .filter(
                            t =>
                              t.botId === activeBotId &&
                              (t.title || 'Untitled Space Chat')
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()),
                          )
                          .map(thread => {
                            const isSelected =
                              activeBotThreadId === thread.id &&
                              pathname === '/spaces';
                            return (
                              <div
                                key={thread.id}
                                className={cn(
                                  'group mb-1.5 flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border text-left text-xs font-normal transition-all duration-300 select-none',
                                  isSelected
                                    ? 'border-[#0000ff] bg-[#0000ff]/15 font-semibold text-white shadow-[0_0_20px_rgba(0,0,255,0.55)]'
                                    : 'border-[#0000ff]/35 bg-[#0000ff]/10 text-zinc-300 hover:border-[#0000ff]/50 hover:bg-[#0000ff]/20 hover:text-white hover:shadow-[0_0_15px_rgba(0,0,255,0.35)]',
                                )}
                              >
                                <span
                                  className="flex flex-1 items-center gap-2.5 truncate px-3 py-2"
                                  onClick={() => {
                                    setSelectedOption(null);
                                    setActiveBotThreadId(thread.id);
                                    router.push(
                                      `/spaces?bot=${activeBotId}&thread=${thread.id}`,
                                    );
                                    close();
                                  }}
                                >
                                  {getThreadIcon(thread.title || '', isSelected)}
                                  <span className="truncate">
                                    {thread.title || 'Untitled Space Chat'}
                                  </span>
                                </span>
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    deleteThread(thread.id);
                                    if (activeBotThreadId === thread.id) {
                                      setActiveBotThreadId(null);
                                      router.push(`/spaces?bot=${activeBotId}`);
                                    }
                                  }}
                                  className={cn(
                                    'mr-2 rounded p-1 opacity-100 transition-colors hover:bg-[#0000ff]/20',
                                    isSelected
                                      ? 'text-white'
                                      : 'text-zinc-450 hover:text-red-500',
                                  )}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            );
                          })}
                {/* Fallbacks */}
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
            </div>
          )}
        </div>


        {/* Footer Area */}
        <div className="sticky bottom-0 z-30 flex h-[64px] w-full flex-none flex-col justify-center border-t border-zinc-800/60 bg-black p-4 py-2.5">
          {isLoggedIn && activeTab === 'account' ? (
            <div className="flex h-11 w-full items-center justify-center">
              <Button
                variant="default"
                className="w-full justify-center gap-2 rounded-[3px] border border-transparent bg-white font-normal text-black hover:bg-zinc-100"
                onClick={() => {
                  setActiveTab('search');
                  router.push(isLoggedIn ? '/c/new-search' : '/');
                  close();
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
                    className="flex-1 cursor-pointer rounded-[3px] bg-white px-0 font-normal text-black hover:bg-zinc-100"
                    onClick={() => {
                      close();
                      onOpen({ type: 'auth-modal', actionId: 'login' });
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    className="flex-1 cursor-pointer rounded-[3px] bg-white px-0 font-normal text-black hover:bg-zinc-100"
                    onClick={() => {
                      close();
                      onOpen({ type: 'auth-modal', actionId: 'register' });
                    }}
                  >
                    Register
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('account')}
                  className="w-full cursor-pointer rounded-[3px] border border-transparent bg-white font-normal text-zinc-900 shadow-sm transition-all duration-300 outline-none select-none hover:bg-zinc-100 dark:border-transparent dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                  My Account
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

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
              className="text-red-655 flex h-full flex-1 cursor-pointer items-center justify-center text-[15px] font-normal transition-colors outline-none hover:bg-black/5 active:bg-black/10 dark:hover:bg-white/5 dark:active:bg-white/10"
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
              className="text-red-655 flex h-full flex-1 cursor-pointer items-center justify-center text-[15px] font-normal transition-colors outline-none hover:bg-black/5 active:bg-black/10 dark:hover:bg-white/5 dark:active:bg-white/10"
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

      {/* Rename Space Dialog */}
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
                className="h-full flex-1 cursor-pointer border-r border-black/10 text-sm font-normal text-black outline-none hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                onClick={() => setBotToRename(null)}
              >
                Cancel
              </button>
              <button
                className="h-full flex-1 cursor-pointer text-sm font-medium text-indigo-600 outline-none hover:bg-black/5 disabled:opacity-50 dark:text-indigo-400 dark:hover:bg-white/5"
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

export default LeftSideNavMobile;
