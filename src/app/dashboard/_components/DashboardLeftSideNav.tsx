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
import { CircleUserRound, LogOut, ReceiptText, Settings, Shield, Brain, SlidersHorizontal, ShieldAlert, UserPlus, Mail, Database, KeyRound, Scale } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DashboardLeftSideNav = () => {
  const { data } = useSession();
  const router = useRouter();

  const { onOpen } = useModalStore();

  const isLoggedIn = data?.accessToken;
  const isSuperAdmin = data?.user?.role === 'super_admin';
  const isAdmin = data?.user?.role === 'admin' || isSuperAdmin;

  return (
    <>
      <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-zinc-900 border-r border-black/10 dark:border-zinc-800/80 flex flex-col pt-4 pb-2">
        <div
          className={cn(
            'bg-white dark:bg-zinc-900 sticky top-0 z-30 flex w-full items-center justify-between px-4 pt-2',
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
        </div>

        <div className="flex flex-1 flex-col"></div>

        <div
          className={cn(
            'bg-white dark:bg-zinc-900 sticky bottom-0 z-30 flex h-[56px] items-center justify-center p-3 py-1 border-t border-black/10 dark:border-zinc-800/80 w-full',
          )}
        >
          {!isLoggedIn ? (
            <div className="flex w-full items-center gap-2">
              <Button
                variant="default"
                className="flex-1 bg-black px-0 text-white hover:bg-black/90"
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-black px-0 text-white hover:bg-black/90"
                asChild
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full bg-[#e1e1e1] hover:bg-[#EAEAEB] dark:bg-zinc-800 dark:hover:bg-zinc-700/80">
                  My Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#e1e1e1] dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-2xl shadow-xl" align="start">
                <DropdownMenuGroup>
                  {isSuperAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/admin')}>
                       <Shield className="text-black" /> Owner Platform
                    </DropdownMenuItem>
                  )}
                  {isAdmin && !isSuperAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/admin')}>
                      <Shield className="text-black" /> Platform Admin
                    </DropdownMenuItem>
                  )}
                  {!isSuperAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/platform-memory')}>
                      <Brain className="text-black dark:text-white" /> Platform Memory
                    </DropdownMenuItem>
                  )}
                  {!isSuperAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/platform-knowledge')}>
                      <Database className="text-black dark:text-white" /> Platform Knowledge
                    </DropdownMenuItem>
                  )}
                  {!isSuperAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/instructions')}>
                      <SlidersHorizontal className="text-black dark:text-white" /> Platform Instructions
                    </DropdownMenuItem>
                  )}
                  {!isSuperAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/guardrails')}>
                      <ShieldAlert className="text-black dark:text-white" /> Platform Guardrails
                    </DropdownMenuItem>
                  )}
                  {!isSuperAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/invite-friends')}>
                      <UserPlus className="text-black dark:text-white" /> Invite Friends
                    </DropdownMenuItem>
                  )}
                  {!isSuperAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/change-password')}>
                      <KeyRound className="text-black dark:text-white" /> Change Password
                    </DropdownMenuItem>
                  )}
                  {!isSuperAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/contact-support')}>
                      <Mail className="text-black dark:text-white" /> Contact Support
                    </DropdownMenuItem>
                  )}
                  {!isSuperAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/legal')}>
                      <Scale className="text-black" /> Legal Documents
                    </DropdownMenuItem>
                  )}
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
