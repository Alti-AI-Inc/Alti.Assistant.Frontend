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
import { useUserChatStore } from '@/stores/chatStore';
import { useModalStore } from '@/stores/useModalStore';
import {
  ChevronDown,
  LayoutGrid,
  LogOut,
  MessageSquare,
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
import { Dispatch, SetStateAction, useState } from 'react';
import ConversationsList from './ConversationsList';
import { Button } from './ui/button';

const SideNav = ({
  isLoggeIn,
  hideSidebar,
  toggleSidebar,
}: {
  isLoggeIn?: boolean;
  hideSidebar: boolean;
  toggleSidebar: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data } = useSession();
  const userId = data?.user?.id;
  // console.log(data?.accessToken);
  const router = useRouter();
  const { onOpen } = useModalStore();
  const { resetChat } = useUserChatStore();
  const [logoHovered, setLogoHovered] = useState(false);

  const handleLogoMouseEnter = () => {
    if (hideSidebar) {
      setLogoHovered(true);
    }
  };
  return !isLoggeIn ? (
    <>
      <nav className={cn(!hideSidebar && 'overflow-y-scroll')}>
        <div className="bg-secondary sticky top-0 z-30 pt-4 pb-2">
          <div
            className={cn(
              'flex items-center justify-between px-4 pt-2',
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
                  onClick={() => toggleSidebar(pre => !pre)}
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
              onClick={() => toggleSidebar(pre => !pre)}
            />
          </div>
          <div className={cn('space-y-0.5 px-1 pt-6', hideSidebar && 'px-0')}>
            <Button
              onClick={() => {
                resetChat();
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
        <div
          className={cn(
            'bg-secondary flex flex-1 flex-col px-4',
            hideSidebar && 'hidden',
          )}
        >
          <ConversationsList />
        </div>
        <div
          className={cn(
            'bg-secondary sticky bottom-0 z-30 flex h-20 items-center justify-center p-4 py-1.5',
            hideSidebar && 'hidden',
          )}
        >
          {!userId ? (
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
      </nav>
    </>
  ) : (
    <div className="ml-9">
      <div className="relative w-full max-w-xs">
        <select
          className="bg-background mb-3 w-full appearance-none rounded-full py-2 pr-10 pl-4 text-xs shadow-sm focus:outline-none"
          defaultValue="smug4b"
        >
          <option value="smug4b">Smug 4B</option>
          <option value="option2">Lllma 3.1 8B</option>
          <option value="option3">Gamma 2 9B</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 -top-2.5 right-0 flex items-center pr-3">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      <ul className="flex flex-col gap-3 text-xs">
        {Array.from({ length: 10 }, (_, i) => (
          <li
            key={i}
            className="bg-background rounded-full px-4 py-2 shadow-sm"
          >
            Text history one{' '}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideNav;
