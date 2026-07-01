'use client';

import { useTenant } from '@/contexts/TenantContext';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useModalStore } from '@/stores/useModalStore';
import Image from 'next/image';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  User,
  UserCheck,
  UsersRound,
  FileText,
  Shield,
  KeyRound,
  Mail,
  Database,
  Key,
  UserPlus,
  Users,
  CreditCard,
  Folder,
  ShieldAlert,
  PanelLeftClose,
  PanelRightClose,
  LogOut,
} from 'lucide-react';

export const AdminSecondarySidebar = () => {
  const { data } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { mode, currentTenant } = useTenant();
  const { onOpen } = useModalStore();
  const { isLeftSidebarOpen, toggleLeftSidebar } = useSidebarStore();

  const userEmail = data?.user?.email?.toLowerCase();
  const isGlobalAdmin = data?.user?.role === 'admin' || data?.user?.role === 'super_admin';
  const isTenantOwner = mode === 'tenant' && (currentTenant?.role === 'admin' || currentTenant?.role === 'owner');
  const isTenantAdmin = mode === 'tenant' && currentTenant?.role === 'manager';

  const isAdmin = userEmail === 'admin@insoai.com' || isGlobalAdmin || isTenantOwner;
  const isManager = isGlobalAdmin || isTenantOwner || isTenantAdmin;
  const isSuperAdmin = data?.user?.role === 'super_admin';

  const isAdminMode = pathname.startsWith('/admin');
  const isManagerSection = pathname.startsWith('/admin/data') || 
                           pathname.startsWith('/admin/instructions') || 
                           pathname.startsWith('/admin/guardrails') || 
                           pathname.startsWith('/admin/projects') ||
                           pathname.startsWith('/admin/platform-manager');
  const isAdminSection = !isManagerSection && isAdminMode;

  if (!isAdminMode) return null;

  // Determine header title
  let headerTitle = 'Admin Console';
  if (isSuperAdmin) {
    headerTitle = 'Owner Platform';
  } else if (isManagerSection) {
    headerTitle = 'Platform Manager';
  } else if (isAdminSection) {
    headerTitle = 'Platform Admin';
  }

  return (
    <div className={cn(
      "bg-white dark:bg-zinc-900 border-r border-black/10 dark:border-zinc-800/80 hidden md:flex flex-col h-full shrink-0 z-10 transition-all duration-300",
      (isLeftSidebarOpen || !isSuperAdmin) ? "w-64" : "w-14"
    )}>
      {/* Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-zinc-800/80 px-4 flex items-center justify-between flex-none relative">
        {isLeftSidebarOpen || !isSuperAdmin ? (
          <>
            {isSuperAdmin && (
              <Image
                src="/assets/logo-icon.png"
                alt="logo"
                height={20}
                width={20}
                className="flex-shrink-0"
              />
            )}
            {!isSuperAdmin && (
              <span className="text-sm font-semibold text-black dark:text-white truncate">
                {headerTitle}
              </span>
            )}
            {isSuperAdmin && (
              <button
                onClick={toggleLeftSidebar}
                className="text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white focus:outline-none flex-shrink-0"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            )}
          </>
        ) : (
          <div className="w-full flex items-center justify-center">
            <button
              onClick={toggleLeftSidebar}
              className="text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white focus:outline-none"
            >
              <PanelRightClose className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Options List */}
      <div className={cn(
        "flex-1 overflow-y-auto py-4",
        (isLeftSidebarOpen || !isSuperAdmin) ? "px-4 space-y-6" : "px-2 space-y-4"
      )}>
        {/* Platform Owner Section (for super_admin) */}
        {isSuperAdmin && (
          <div className="space-y-4">
            {[
              {
                groupName: 'Platform',
                items: [
                  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
                  { name: 'Support', href: '/admin/support', icon: Mail }
                ]
              },
              {
                groupName: 'Members',
                items: [
                  { name: 'Free Users', href: '/admin/metrics/total-users?plan=free', icon: User },
                  { name: 'Paid Users', href: '/admin/metrics/total-users?plan=paid', icon: UserCheck },
                  { name: 'Team Plans', href: '/admin/metrics/active-organizations', icon: UsersRound },
                ]
              },
              {
                groupName: 'Configurations',
                items: [
                  { name: 'Instructions', href: '/admin/instructions', icon: FileText },
                  { name: 'Guardrails', href: '/admin/guardrails', icon: Shield },
                ]
              },
              {
                groupName: 'Credentials',
                items: [
                  { name: 'My Accounts', href: '/admin/accounts', icon: KeyRound },
                  { name: 'Email Accounts', href: '/admin/emails', icon: Mail },
                  { name: 'Data Partners', href: '/admin/partners', icon: Database },
                  { name: 'API Keys', href: '/admin/apikeys', icon: Key },
                ]
              }
            ].map((group) => (
              <div key={group.groupName} className="space-y-1">
                {(isLeftSidebarOpen || !isSuperAdmin) && (
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 pb-1 select-none">
                    {group.groupName}
                  </div>
                )}
                {group.items.map((item: { name: string; href: string; icon: any; exact?: boolean }) => {
                  const currentPlan = searchParams?.get('plan');
                  const isActive = item.exact 
                    ? pathname === item.href 
                    : item.href.includes('?plan=free')
                      ? pathname === '/admin/metrics/total-users' && currentPlan === 'free'
                      : item.href.includes('?plan=paid')
                        ? pathname === '/admin/metrics/total-users' && currentPlan === 'paid'
                        : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  
                  const linkEl = (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'w-full flex items-center rounded-md transition-colors',
                        isActive
                          ? 'bg-black/5 text-black dark:bg-white/10 dark:text-white font-semibold'
                          : 'text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white',
                        (isLeftSidebarOpen || !isSuperAdmin) 
                          ? 'gap-3 px-3 py-2 text-sm font-medium' 
                          : 'justify-center p-2.5'
                      )}
                    >
                      <Icon className="w-4 h-4 text-black dark:text-white flex-shrink-0" />
                      {(isLeftSidebarOpen || !isSuperAdmin) && <span className="truncate">{item.name}</span>}
                    </Link>
                  );

                  if (!(isLeftSidebarOpen || !isSuperAdmin)) {
                    return (
                      <Tooltip key={item.name}>
                        <TooltipTrigger asChild>
                          {linkEl}
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return linkEl;
                })}
              </div>
            ))}
          </div>
        )}

        {/* First Section */}
        {isAdminSection && !isSuperAdmin && (
          <div className="space-y-1">
            {[
              { name: 'Invite', href: '/admin/members', icon: UserPlus },
              { name: 'Members', href: '/admin/team-members', icon: Users },
              { name: 'Billing', href: '/admin/billing', icon: CreditCard },
              { name: 'Invoices', href: '/admin/invoices', icon: FileText },
            ].map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-black/5 text-black dark:bg-white/10 dark:text-white font-semibold'
                      : 'text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4 text-black dark:text-white" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* Second Section */}
        {isManagerSection && !isSuperAdmin && (
          <div className="space-y-1">
            {[
              { name: 'Knowledge', href: '/admin/data', icon: Database },
              { name: 'Instructions', href: '/admin/instructions', icon: FileText },
              { name: 'Guardrails', href: '/admin/guardrails', icon: Shield },
              { name: 'Projects', href: '/admin/projects', icon: Folder },
            ].map((item) => {
              const isActive = pathname === item.href || (item.name === 'Projects' && pathname.startsWith('/admin/projects'));
              const Icon = item.icon;
              return (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-black/5 text-black dark:bg-white/10 dark:text-white font-semibold'
                        : 'text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                    )}
                  >
                    <Icon className="w-4 h-4 text-black dark:text-white" />
                    {item.name}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {isSuperAdmin && (
        <div className={cn(
          "sticky bottom-0 z-30 flex flex-col border-t border-black/10 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 flex-none items-center justify-center",
          isLeftSidebarOpen ? "w-full p-4 py-3" : "w-full py-3 px-1"
        )}>
          {isLeftSidebarOpen ? (
            <Button
              variant="outline"
              onClick={() => onOpen({ type: 'logout' })}
              className="w-full transition-all duration-200 outline-none select-none cursor-pointer bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:text-white dark:hover:bg-red-700 border-transparent"
            >
              Logout
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => onOpen({ type: 'logout' })}
                  className="flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 outline-none select-none cursor-pointer bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:text-white dark:hover:bg-red-700 border-transparent p-0"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSecondarySidebar;
