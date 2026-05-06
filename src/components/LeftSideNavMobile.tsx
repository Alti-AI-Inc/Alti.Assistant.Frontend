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
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useDrawerStore } from '@/stores/useDrawerStore';
import { useModalStore } from '@/stores/useModalStore';
import { UserMode } from '@/types/tenant';
import {
  Bookmark,
  Building2,
  LayoutDashboard,
  LogOut,
  Orbit,
  ReceiptText,
  Scale,
  Search,
  Settings,
  SquarePen,
  User,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import ConversationsList from './ConversationsList';
import { TenantModeSwitcher } from './TenantModeSwitcher';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

const LeftSideNavMobile = () => {
  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { close } = useDrawerStore();
  const { mode, currentTenant } = useTenant();

  const { onOpen } = useModalStore();
  const {
    setActiveConversation,
    setSelectedOption,
    setShowStartLastMessage,
    setUserMessage,
  } = useConversationsStore();

  const isLoggedIn = data?.accessToken;

  return (
    <div className="bg-secondary flex h-full flex-col">
      {/* TenantModeSwitcher at top */}
      {isLoggedIn && (
        <div className="px-2 pt-4 pb-2">
          <TenantModeSwitcher />
        </div>
      )}

      {/* Sticky nav buttons */}
      <div className="bg-secondary sticky top-0 z-10">
        <div className="space-y-0.5 px-2 py-2">
          <Button
            onClick={() => {
              setActiveConversation(null);
              setShowStartLastMessage(false);
              setUserMessage('');
              setSelectedOption(null);
              router.push('/');
              close();
            }}
            className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
          >
            <SquarePen />
            <span className="text-sm font-normal">New Chat</span>
          </Button>

          {isLoggedIn && (
            <>
              {/* <Button
                disabled={pathname === '/workspaces'}
                onClick={() => {
                  setActiveConversation(null);
                  setShowStartLastMessage(false);
                  setUserMessage('');
                  setSelectedOption(null);
                  if (pathname !== '/workspaces') router.push('/workspaces');
                  close();
                }}
                className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5 disabled:opacity-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-vector-square-icon lucide-vector-square"
                >
                  <path d="M19.5 7a24 24 0 0 1 0 10" />
                  <path d="M4.5 7a24 24 0 0 0 0 10" />
                  <path d="M7 19.5a24 24 0 0 0 10 0" />
                  <path d="M7 4.5a24 24 0 0 1 10 0" />
                  <rect x="17" y="17" width="5" height="5" rx="1" />
                  <rect x="17" y="2" width="5" height="5" rx="1" />
                  <rect x="2" y="17" width="5" height="5" rx="1" />
                  <rect x="2" y="2" width="5" height="5" rx="1" />
                </svg>
                <span className="text-sm font-normal">Spaces</span>
              </Button>

              <Button
                disabled={pathname === '/apps'}
                onClick={() => {
                  setActiveConversation(null);
                  setShowStartLastMessage(false);
                  setUserMessage('');
                  setSelectedOption(null);
                  if (pathname !== '/apps') router.push('/apps');
                  close();
                }}
                className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5 disabled:opacity-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-package"
                >
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
                <span className="text-sm font-normal">Apps</span>
              </Button> */}

              <div className="mt-6 flex items-center space-x-4">
                <div className="flex items-center gap-2 pl-4 text-sm text-gray-500">
                  <span>Chat history</span>
                  {mode === UserMode.TENANT && currentTenant && (
                    <Badge
                      variant="outline"
                      className="h-5 px-1.5 text-[10px] font-normal"
                    >
                      <Building2 className="mr-1 size-2.5" />
                      {currentTenant.name}
                    </Badge>
                  )}
                  {mode === UserMode.PERSONAL && (
                    <Badge
                      variant="outline"
                      className="h-5 px-1.5 text-[10px] font-normal"
                    >
                      <User className="mr-1 size-2.5" />
                      Personal
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Bookmark
                        onClick={() => {
                          router.push('/saved-chats');
                          close();
                        }}
                        className="size-3.5 text-gray-500"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Saved Chats</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Search
                        className="size-3.5 text-gray-500"
                        onClick={() => {
                          onOpen({
                            type: 'search-chats',
                          });
                          close();
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Search Chats</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Scrollable conversation list */}
      {isLoggedIn && (
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <ConversationsList />
        </div>
      )}

      {/* Footer fixed at bottom */}
      <div className="bg-secondary sticky bottom-0 flex h-20 items-center justify-center p-4">
        {!isLoggedIn ? (
          <div className="flex w-full items-center gap-2">
            <Button
              variant="default"
              className="flex-1 bg-black px-0 text-white hover:bg-black/90"
              onClick={() => {
                onOpen({ type: 'auth-modal', actionId: 'login' });
                close();
              }}
            >
              Login
            </Button>
            <Button
              variant="default"
              className="flex-1 bg-black px-0 text-white hover:bg-black/90"
              onClick={() => {
                onOpen({ type: 'auth-modal', actionId: 'register' });
                close();
              }}
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
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuGroup>
                {/* <DropdownMenuItem
                  onClick={() => {
                    router.push('/apps');
                    close();
                  }}
                >
                  <LayoutGrid className="text-black" /> Apps
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/upgrade');
                    close();
                  }}
                >
                  <Orbit className="text-black" /> Upgrade
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/admin');
                    close();
                  }}
                >
                  <LayoutDashboard className="text-black" /> Admin Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/organizations');
                    close();
                  }}
                >
                  <Building2 className="text-black" /> Organizations
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/organizations/dashboard');
                    close();
                  }}
                >
                  <LayoutDashboard className="text-black" /> Manage Organization
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push(
                      mode === UserMode.TENANT && currentTenant
                        ? `/organizations/${currentTenant.id}/billing`
                        : '/billing',
                    );
                    close();
                  }}
                >
                  <ReceiptText className="text-black" /> Billing
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/settings');
                    close();
                  }}
                >
                  <Settings className="text-black" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/legal');
                    close();
                  }}
                >
                  <Scale className="text-black" /> Legal
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
    </div>
  );
};

export default LeftSideNavMobile;
