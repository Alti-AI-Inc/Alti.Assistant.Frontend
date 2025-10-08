'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useDrawerStore } from '@/stores/useDrawerStore';
import { useModalStore } from '@/stores/useModalStore';
import {
  Bot,
  LogOut,
  MessageSquare,
  Orbit,
  Scale,
  Search,
  Settings,
  SquarePen,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ConversationsList from './ConversationsList';
import { Button } from './ui/button';

const LeftSideNavMobile = () => {
  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { close } = useDrawerStore();

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
            <span className="text-sm font-normal">New chat</span>
          </Button>

          {isLoggedIn && (
            <>
              <Button
                onClick={() => {
                  onOpen({
                    type: 'search-chats',
                  });
                  close();
                }}
                className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
              >
                <Search />
                <span className="text-sm font-normal">Search chats</span>
              </Button>

              <Button
                onClick={() => {
                  router.push('/saved-chats');
                  close();
                }}
                className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
              >
                <MessageSquare />
                <span className="text-sm font-normal">Saved chats</span>
              </Button>
              <Button
                disabled={pathname === '/knowledge'}
                onClick={() => {
                  setActiveConversation(null);
                  setShowStartLastMessage(false);
                  setUserMessage('');
                  setSelectedOption(null);
                  if (pathname !== '/knowledge') router.push('/knowledge');
                  close();
                }}
                className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5 disabled:opacity-100"
              >
                <Bot />
                <span className="text-sm font-normal">Knowledge bots</span>
              </Button>

              <div className="mt-6 pl-4 text-sm text-gray-500">
                Chat history
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
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              className="relative w-20 bg-black text-white"
            >
              <Link href="/login">
                Login
                <span className="absolute inset-0"></span>
              </Link>
            </Button>
            <Button
              variant="default"
              className="relative w-20 bg-black text-white"
            >
              <Link href="/register">
                Register
                <span className="absolute inset-0"></span>
              </Link>
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
                    router.push('/legal');
                    close();
                  }}
                >
                  <Scale className="text-black" /> Legal
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/settings');
                    close();
                  }}
                >
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
    </div>
  );
};

export default LeftSideNavMobile;
