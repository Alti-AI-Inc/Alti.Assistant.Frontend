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
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import ConversationsList from './ConversationsList';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { motion } from 'framer-motion';

type SidebarTab = 'chat' | 'research';

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

  const handleTabChange = (tab: SidebarTab) => {
    setActiveTab(tab);
    if (tab === 'research') {
      setSelectedOption(OPTIONS.RESEARCH);
    } else {
      setSelectedOption(null);
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
      <div className="pt-0 pb-2 bg-[#F2F3F5] dark:bg-zinc-900 transition-colors duration-300">
        <div
          className={cn(
            'sticky top-0 z-30 flex items-center justify-between border-b border-black/10 dark:border-zinc-800/80 px-4 pt-4 pb-4 bg-[#F2F3F5] dark:bg-zinc-900 transition-colors duration-300',
            hideSidebar && 'justify-center',
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
              'size-5 cursor-pointer text-gray-600 dark:text-zinc-400 transition-transform duration-300 hover:text-black dark:hover:text-white',
              hideSidebar && 'hidden',
            )}
            onClick={toggleLeftSidebar}
          />
        </div>
        {/* Enclosed Search & Actions Row */}
        {!hideSidebar && (
          <div className="flex items-center justify-between gap-2 border-b border-black/10 dark:border-zinc-800/80 px-4 py-4 bg-[#F2F3F5] dark:bg-zinc-900 transition-all duration-300">
            {/* Search Bar Input */}
            <div className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-black/10 dark:border-zinc-800/80 bg-white dark:bg-zinc-800/50 px-3 shadow-xs transition-all focus-within:ring-1 focus-within:ring-black/20 dark:focus-within:ring-white/10">
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
              {/* Favorites Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 dark:border-zinc-800/80 bg-white dark:bg-zinc-800/80 text-black dark:text-zinc-200 shadow-xs transition-all hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white"
                      onClick={() => {
                        router.push('/saved-chats');
                        close();
                      }}
                    >
                      <Bookmark className="size-4 text-zinc-650 dark:text-zinc-300" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Saved Chats</p>
                </TooltipContent>
              </Tooltip>

              {/* Plus for New Chat Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 dark:border-zinc-800/80 bg-white dark:bg-zinc-800/80 text-black dark:text-zinc-200 shadow-xs transition-all hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white"
                      onClick={() => {
                        setActiveConversation(null);
                        setShowStartLastMessage(false);
                        setUserMessage('');
                        setSelectedOption(null);
                        close();
                        router.push('/');
                      }}
                    >
                      <Plus className="size-4 text-zinc-650 dark:text-zinc-300" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>New Chat</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}{' '}
      </div>

      {/* Chat / Research toggle */}
      {!hideSidebar && isLoggedIn && (
        <div className="border-b border-black/10 dark:border-zinc-800/80 px-4 py-2 bg-[#F2F3F5] dark:bg-zinc-900 transition-colors duration-300">
          <div className="relative flex rounded-lg bg-black/[0.06] dark:bg-white/[0.06] p-0.5">
            {/* sliding indicator */}
            <motion.div
              layoutId="activeTabIndicator"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-md bg-white dark:bg-zinc-850 shadow-sm"
              style={{
                left: activeTab === 'chat' ? '2px' : 'calc(50% + 1px)',
              }}
            />
            <button
              type="button"
              onClick={() => handleTabChange('chat')}
              className={cn(
                'relative z-10 flex-1 rounded-md py-1 text-xs font-semibold transition-colors duration-150',
                activeTab === 'chat' ? 'text-black dark:text-white' : 'text-zinc-550 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200',
              )}
            >
              Chat
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('research')}
              className={cn(
                'relative z-10 flex-1 rounded-md py-1 text-xs font-semibold transition-colors duration-150',
                activeTab === 'research' ? 'text-black dark:text-white' : 'text-zinc-550 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200',
              )}
            >
              Research
            </button>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <div
          className={cn(
            'flex flex-1 flex-col overflow-y-scroll px-4 bg-[#F2F3F5] dark:bg-zinc-900 transition-colors duration-300',
            hideSidebar && 'hidden',
          )}
        >
          <ConversationsList searchQuery={searchQuery} activeTab={activeTab} />
        </div>
      )}

      {!isLoggedIn && <div className="flex flex-1 flex-col bg-[#F2F3F5] dark:bg-zinc-900 transition-colors duration-300"></div>}

      <div
        className={cn(
          'sticky bottom-0 z-30 flex h-20 items-center justify-center border-t border-black/10 dark:border-zinc-800/80 p-4 py-1.5 bg-[#F2F3F5] dark:bg-zinc-900 transition-colors duration-300',
          hideSidebar && 'hidden',
        )}
      >
        {!isLoggedIn ? (
          <div className="flex w-full items-center gap-2">
            <Button
              variant="default"
              className="flex-1 bg-black dark:bg-zinc-800 hover:bg-black/90 dark:hover:bg-zinc-700 text-white dark:text-zinc-200 transition-all font-semibold rounded-xl"
              onClick={() => onOpen({ type: 'auth-modal', actionId: 'login' })}
            >
              Login
            </Button>
            <Button
              variant="default"
              className="flex-1 bg-black dark:bg-zinc-800 hover:bg-black/90 dark:hover:bg-zinc-700 text-white dark:text-zinc-200 transition-all font-semibold rounded-xl"
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
              <Button variant="outline" className="w-full bg-white dark:bg-zinc-850 dark:text-zinc-200 border border-black/10 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-bold py-5 rounded-xl">
                My Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[var(--radix-dropdown-menu-trigger-width)] backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 border border-black/10 dark:border-zinc-800 shadow-xl rounded-2xl p-1.5"
              align="start"
            >
              <DropdownMenuGroup>
                {data?.user?.role === 'super_admin' && (
                  <DropdownMenuItem onClick={() => router.push('/admin')} className="rounded-xl">
                    <LayoutDashboard className="text-zinc-650 dark:text-zinc-300 size-4 mr-2" /> Dashboard
                  </DropdownMenuItem>
                )}
                {/* Plans dropdown menu item */}
                <DropdownMenuItem onClick={() => router.push('/upgrade')} className="rounded-xl">
                  <Orbit className="text-zinc-650 dark:text-zinc-300 size-4 mr-2" /> Plans
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/organizations')} className="rounded-xl">
                  <Building2 className="text-zinc-650 dark:text-zinc-300 size-4 mr-2" /> Organizations
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="rounded-xl"
                  onClick={() =>
                    router.push(
                      mode === UserMode.TENANT && currentTenant
                        ? `/organizations/${currentTenant.id}/billing`
                        : '/billing',
                    )
                  }
                >
                  <ReceiptText className="text-zinc-650 dark:text-zinc-300 size-4 mr-2" /> Billing
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-xl"
                  onClick={() =>
                    router.push(
                      mode === UserMode.TENANT && currentTenant
                        ? `/organizations/${currentTenant.id}/members`
                        : '/organizations',
                    )
                  }
                >
                  <Users className="text-zinc-650 dark:text-zinc-300 size-4 mr-2" /> Members
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-xl"
                  onClick={() =>
                    onOpen({
                      type: 'invite',
                    })
                  }
                >
                  <SquareUserRound className="text-zinc-650 dark:text-zinc-300 size-4 mr-2" /> Invite
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/legal')} className="rounded-xl">
                  <Scale className="text-zinc-650 dark:text-zinc-300 size-4 mr-2" /> Legal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')} className="rounded-xl">
                  <Settings className="text-zinc-650 dark:text-zinc-300 size-4 mr-2" /> Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-black/5 dark:bg-white/5 my-1" />

              <DropdownMenuItem
                className="rounded-xl focus:bg-red-500/10 focus:text-red-600 dark:focus:bg-red-500/20 dark:focus:text-red-400"
                onClick={() =>
                  onOpen({
                    type: 'logout',
                  })
                }
              >
                <LogOut className="size-4 mr-2 text-red-500 dark:text-red-400" /> <span className="text-red-500 dark:text-red-400 font-semibold">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </>
  );
};

export default LeftSideNav;
