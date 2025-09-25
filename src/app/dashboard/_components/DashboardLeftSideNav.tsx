'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useModalStore } from '@/stores/useModalStore';
import {
  BookCheck,
  Bot,
  CircleUserRound,
  LogOut,
  ReceiptText,
  Settings
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DashboardLeftSideNav = () => {
  const { data } = useSession();
  const router = useRouter();

  const { onOpen } = useModalStore();

  const isLoggedIn = data?.accessToken;

  return (
    <>
      <div className="bg-secondary flex flex-col pt-4 pb-2">
        <div
          className={cn(
            'bg-secondary sticky top-0 z-30 flex w-64 items-center justify-between px-4 pt-2',
          )}
        >
          <div
            className={cn(
              'flex flex-none items-center justify-center transition-all duration-300',
            )}
          >
            <Link href="/">
              <Image
                src="/assets/logo-icon.png"
                alt="logo"
                height={20}
                width={20}
              />
            </Link>
          </div>
        </div>
        <div className={cn('space-y-2 px-1 pt-6')}>
          <Button
            onClick={() => router.push('/dashboard')}
            className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
          >
            <CircleUserRound />

            <span className={cn('text-sm font-normal')}>Members</span>
          </Button>
          <Button
            onClick={() => router.push('/dashboard/billing')}
            className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
          >
            <ReceiptText />
            <span className={cn('text-sm font-normal')}>Billing</span>
          </Button>
          <Button
            onClick={() => router.push('/dashboard/knowledge')}
            className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
          >
            <BookCheck />

            <span className={cn('text-sm font-normal')}>Knowledge</span>
          </Button>
          <Button
            onClick={() => router.push('/dashboard/chatbots')}
            className="flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
          >
            <Bot />

            <span className={cn('text-sm font-normal')}>Chatbots</span>
          </Button>
        </div>

        <div className="flex flex-1 flex-col"></div>

        <div
          className={cn(
            'bg-secondary sticky bottom-0 z-30 flex h-20 items-center justify-center p-4 py-1.5',
            // hideSidebar && 'hidden',
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
      </div>
    </>
  );
};

export default DashboardLeftSideNav;
