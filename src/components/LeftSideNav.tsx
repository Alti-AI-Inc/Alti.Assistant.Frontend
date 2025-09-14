'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useConversationsStore } from '@/stores/converstionsStore';
import { useModalStore } from '@/stores/useModalStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import {
  LayoutGrid,
  LogOut,
  MessageSquare,
  Network,
  Orbit,
  PanelLeftClose,
  Scale,
  Search,
  Settings,
  SquarePen,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ConversationsList from './ConversationsList';
import { Button } from './ui/button';

const LeftSideNav = () => {
  const { data } = useSession();
  const router = useRouter();

  const { onOpen } = useModalStore();
  const { setActiveConversation } = useConversationsStore();
  const { isLeftSidebarOpen, toggleLeftSidebar } = useSidebarStore();

  const hideSidebar = !isLeftSidebarOpen;
  const isLoggedIn = data?.accessToken;

  const [logoHovered, setLogoHovered] = useState(false);

  const handleLogoMouseEnter = () => {
    if (hideSidebar) {
      setLogoHovered(true);
    }
  };

  return (
    <>
      <div className="bg-secondary pt-4 pb-2">
        <div
          className={cn(
            'sticky top-0 z-30 flex items-center justify-between px-4 pt-2',
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
                  'size-[21px] cursor-pointer text-black transition-transform duration-300',
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
              'size-5 cursor-pointer text-gray-500 transition-transform duration-300',
              hideSidebar && 'hidden',
            )}
            onClick={toggleLeftSidebar}
          />
        </div>
        <div className={cn('space-y-0.5 px-1 pt-6', hideSidebar && 'px-0')}>
          <Button
            onClick={() => {
              setActiveConversation(null);
              router.push('/');
            }}
            className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
          >
            <SquarePen />
            <span
              className={cn('text-sm font-normal', hideSidebar && 'hidden')}
            >
              New chat
            </span>
          </Button>

          <div className={cn('space-y-0.5', !isLoggedIn && 'hidden')}>
            <Button
              onClick={() =>
                onOpen({
                  type: 'search-chats',
                })
              }
              className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
            >
              <Search />{' '}
              <span
                className={cn('text-sm font-normal', hideSidebar && 'hidden')}
              >
                Search chats
              </span>
            </Button>
            <Button
              onClick={() => router.push('/saved-chats')}
              className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
            >
              <MessageSquare />{' '}
              <span
                className={cn('text-sm font-normal', hideSidebar && 'hidden')}
              >
                Saved chats
              </span>
            </Button>
            <Button
              onClick={() => router.push('/apps')}
              className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
            >
              <LayoutGrid />{' '}
              <span
                className={cn('text-sm font-normal', hideSidebar && 'hidden')}
              >
                Connect apps
              </span>
            </Button>
            <Button
              onClick={() => router.push('/workflows')}
              className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
            >
              <Network />{' '}
              <span
                className={cn('text-sm font-normal', hideSidebar && 'hidden')}
              >
                Workflows
              </span>
            </Button>
            {/* <Button
              onClick={() => router.push('/agent-store')}
              className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
            >
              <Store />{' '}
              <span
                className={cn('text-sm font-normal', hideSidebar && 'hidden')}
              >
                Agent store
              </span>
            </Button>
            <Button
              onClick={() => router.push('/my-agents')}
              className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
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
                className="lucide lucide-hat-glasses-icon lucide-hat-glasses"
              >
                <path d="M14 18a2 2 0 0 0-4 0" />
                <path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11" />
                <path d="M2 11h20" />
                <circle cx="17" cy="18" r="3" />
                <circle cx="7" cy="18" r="3" />
              </svg>{' '}
              <span
                className={cn('text-sm font-normal', hideSidebar && 'hidden')}
              >
                My agents
              </span>
            </Button> */}
            {/* <Button
              onClick={() => router.push('/my-chatbots')}
              className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
            >
              <Bot />{' '}
              <span
                className={cn('text-sm font-normal', hideSidebar && 'hidden')}
              >
                My chatbots
              </span>
            </Button>

            <Button
              onClick={() => router.push('/knowledge')}
              className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
            >
              <BookA />{' '}
              <span
                className={cn('text-sm font-normal', hideSidebar && 'hidden')}
              >
                My knowledge
              </span>
            </Button> */}

            <div
              className={cn(
                'mt-6 pl-4 text-sm text-gray-500',
                hideSidebar && 'hidden',
              )}
            >
              Chat history
            </div>
          </div>
        </div>
      </div>

      {isLoggedIn && (
        <div
          className={cn(
            'bg-secondary flex flex-1 flex-col overflow-y-scroll px-4',
            hideSidebar && 'hidden',
          )}
        >
          <ConversationsList />
        </div>
      )}

      {!isLoggedIn && <div className="flex flex-1 flex-col"></div>}

      <div
        className={cn(
          'bg-secondary sticky bottom-0 z-30 flex h-20 items-center justify-center p-4 py-1.5',
          hideSidebar && 'hidden',
        )}
      >
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
                <DropdownMenuItem onClick={() => router.push('/upgrade')}>
                  <Orbit className="text-black" /> Upgrade
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
