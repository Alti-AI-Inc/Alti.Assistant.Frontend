'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useModalStore } from '@/stores/useModalStore';
import {
  EllipsisVertical,
  Pencil,
  Search,
  SquarePen,
  Trash2,
  Building2,
  Users,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { TenantModeSwitcher } from './TenantModeSwitcher';
import { useTenant } from '@/contexts/TenantContext';
import { UserMode } from '@/types/tenant';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

const previousChatHistory = [
  {
    id: 1,
    title: 'lorem ipsum dolor sit',
    url: "/",
  },
  {
    id: 2,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: "/",
  },
  {
    id: 3,
    title: 'lorem ipsum  elit',
    url: "/",
  },
  {
    id: 4,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: "/",
  },
  {
    id: 5,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: "/",
  },
  {
    id: 6,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: "/",
  },
  {
    id: 7,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: "/",
  },
  {
    id: 8,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: "/",
  },
  {
    id: 9,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: "/",
  },
  {
    id: 10,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: "/",
  },
  {
    id: 11,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: "/",
  },
  {
    id: 12,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: "/",
  },
  {
    id: 13,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: "/",
  },
  {
    id: 14,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: "/",
  },
  {
    id: 15,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: "/",
  },
];

export default function RightSideNav({ isOpen }: { isOpen: boolean }) {
  const router = useRouter();
  const { onOpen } = useModalStore();
  const { mode, currentTenant } = useTenant();

  if (!isOpen) {
    // Collapsed → only icons
    return (
      <nav className="flex flex-col items-center gap-6 px-2 pt-8">
        <button onClick={() => router.push("/")}>
          <SquarePen className="h-5 w-5" />
        </button>
        <button onClick={() => onOpen({ type: 'search-chats' })}>
          <Search className="h-5 w-5" />
        </button>
      </nav>
    );
  }

  // Expanded → full view
  return (
    <nav className="h-full overflow-y-auto px-2 pt-8 ">
      {/* TenantModeSwitcher at the top */}
      <div className="mb-4 px-1">
        <TenantModeSwitcher />
      </div>

      {/* Organization Info Card when in tenant mode */}
      {mode === UserMode.TENANT && currentTenant && (
        <Card className="mb-4 p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-gray-600" />
                <h3 className="font-medium text-sm">{currentTenant.name}</h3>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {currentTenant.subdomain}.alti.app
              </p>
              {currentTenant.memberCount !== undefined && (
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                  <Users className="size-3" />
                  <span>{currentTenant.memberCount} member{currentTenant.memberCount !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/organizations/${currentTenant.id}`)}
              className="h-8 text-xs"
            >
              Dashboard
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/organizations/${currentTenant.id}/settings`)}
              className="h-8 text-xs"
            >
              <SettingsIcon className="mr-1 size-3" />
              Settings
            </Button>
          </div>
        </Card>
      )}

      {/* Header actions */}
      <div className="bg-secondary sticky top-0 z-30 pb-2">
        <div className="space-y-2 ">
          <Button
            onClick={() => router.push("/")}
            className="-ml-3 flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
          >
            <SquarePen className="h-5 w-5" />
            New workflow
          </Button>

          <Button
            onClick={() => onOpen({ type: 'search-chats' })}
            className="-ml-3 flex w-full items-center justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
          >
            <Search className="h-5 w-5" />
            Search workflows
          </Button>

          <div className="mt-6 text-sm font-medium text-black">Workflows</div>
        </div>
      </div>

      {/* Chat history */}
      <div className="flex flex-col">
        {previousChatHistory.map(chat => (
          <div
            key={chat.id}
            className="group flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md px-1 py-2 text-sm text-black hover:bg-black/5"
          >
            <span className="truncate">{chat.title}</span>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical className="h-5 w-5 rotate-90 opacity-0 group-hover:opacity-100" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-2xl">
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-5 w-5 text-black" /> Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="mr-2 h-5 w-5 text-black" />
                  <span className="text-black">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </nav>
  );
}
