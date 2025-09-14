'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/useSidebarStore';
import {
  EllipsisVertical,
  PanelRightClose,
  Pencil,
  SquarePen,
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import SearchWorkflows from './modals/SearchWorkflows';
import { Button } from './ui/button';

const previousChatHistory = [
  {
    id: 1,
    title: 'lorem ipsum dolor sit',
    url: '/',
  },
  {
    id: 2,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: '/',
  },
  {
    id: 3,
    title: 'lorem ipsum  elit',
    url: '/',
  },
  {
    id: 4,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: '/',
  },
  {
    id: 5,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: '/',
  },
  {
    id: 6,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: '/',
  },
  {
    id: 7,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: '/',
  },
  {
    id: 8,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: '/',
  },
  {
    id: 9,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: '/',
  },
  {
    id: 10,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: '/',
  },
  {
    id: 11,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: '/',
  },
  {
    id: 12,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: '/',
  },
  {
    id: 13,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: '/',
  },
  {
    id: 14,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: '/',
  },
  {
    id: 15,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    url: '/',
  },
];

const RightSideNav = () => {
  const router = useRouter();

  const { isRightSidebarOpen, toggleRightSidebar } = useSidebarStore();

  const hideSidebar = !isRightSidebarOpen;

  return (
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
            >
              <PanelRightClose
                className={cn(
                  'size-6 cursor-pointer p-0.5 text-gray-500 transition-transform duration-300',
                )}
                onClick={toggleRightSidebar}
              />
            </div>
          </div>
          <div className={cn('space-y-0.5 px-1 pt-10', hideSidebar && 'px-0')}>
            <Button
              onClick={() => router.push('/')}
              className="flex w-full items-start justify-start bg-transparent text-sm text-black shadow-none hover:bg-black/5"
            >
              <SquarePen />
              <span
                className={cn('text-sm font-normal', hideSidebar && 'hidden')}
              >
                New workflow
              </span>
            </Button>
            <SearchWorkflows hideSidebar={hideSidebar} />

            <Button
              // onClick={() => router.push("/saved-chats")}
              className="mt-6 flex w-full items-start justify-start bg-transparent text-sm text-black shadow-none hover:bg-transparent"
            >
              <span
                className={cn('text-sm font-normal', hideSidebar && 'hidden')}
              >
                Workflows
              </span>
            </Button>
          </div>
        </div>

        <div
          className={cn('flex flex-1 flex-col px-4', hideSidebar && 'hidden')}
        >
          <div className="mt-2">
            {previousChatHistory.map(chat => (
              <div
                className="group focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group flex h-9 w-full shrink-0 cursor-pointer items-start justify-between gap-2 rounded-md bg-transparent px-1 py-2 text-sm font-medium whitespace-nowrap text-black shadow-none transition-all outline-none hover:bg-black/5 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                key={chat.id}
              >
                <span className="truncate">{chat.title}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical className="rotate-90 opacity-0 group-hover:opacity-100" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-2xl">
                    <DropdownMenuItem>
                      <Pencil className="text-black" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                      <Trash2 className="text-black" />{' '}
                      <span className="text-black">Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default RightSideNav;
