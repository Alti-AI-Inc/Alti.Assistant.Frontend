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
import { useConversationsStore } from '@/stores/useConverstionsStore';
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
                placeholder="Search chats..."
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

      {isLoggedIn && (
        <div
          className={cn(
            'flex flex-1 flex-col overflow-y-scroll px-4',
            hideSidebar && 'hidden',
          )}
          style={{ backgroundColor: '#F2F3F5' }}
        >
          <ConversationsList searchQuery={searchQuery} />
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
