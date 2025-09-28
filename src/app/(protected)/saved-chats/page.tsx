'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useModalStore } from '@/stores/useModalStore';
import { EllipsisVertical, Pencil, Share, Trash2 } from 'lucide-react';

type Chat = {
  id: number;
  title: string;
  descritpion: string;
};

const chats: Chat[] = [
  {
    id: 1,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    descritpion:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus sint illo nesciunt deserunt quis beatae accusamus reiciendis dolore ea! In. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam optio rem aperiam impedit ipsam, nobis saepe magnam cum eaque vel, ullam qui possimus asperiores quam, non ducimus pariatur. Vitae hic quas ea molestias nobis laborum corrupti magnam asperiores doloremque pariatur!',
  },
  {
    id: 2,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    descritpion:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus sint illo nesciunt deserunt quis beatae accusamus reiciendis dolore ea! In. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam optio rem aperiam impedit ipsam, nobis saepe magnam cum eaque vel, ullam qui possimus asperiores quam, non ducimus pariatur. Vitae hic quas ea molestias nobis laborum corrupti magnam asperiores doloremque pariatur!',
  },
  {
    id: 3,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    descritpion:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus sint illo nesciunt deserunt quis beatae accusamus reiciendis dolore ea! In. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam optio rem aperiam impedit ipsam, nobis saepe magnam cum eaque vel, ullam qui possimus asperiores quam, non ducimus pariatur. Vitae hic quas ea molestias nobis laborum corrupti magnam asperiores doloremque pariatur!',
  },
  {
    id: 4,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    descritpion:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus sint illo nesciunt deserunt quis beatae accusamus reiciendis dolore ea! In. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam optio rem aperiam impedit ipsam, nobis saepe magnam cum eaque vel, ullam qui possimus asperiores quam, non ducimus pariatur. Vitae hic quas ea molestias nobis laborum corrupti magnam asperiores doloremque pariatur!',
  },
  {
    id: 5,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    descritpion:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus sint illo nesciunt deserunt quis beatae accusamus reiciendis dolore ea! In. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam optio rem aperiam impedit ipsam, nobis saepe magnam cum eaque vel, ullam qui possimus asperiores quam, non ducimus pariatur. Vitae hic quas ea molestias nobis laborum corrupti magnam asperiores doloremque pariatur!',
  },
  {
    id: 6,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    descritpion:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus sint illo nesciunt deserunt quis beatae accusamus reiciendis dolore ea! In. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam optio rem aperiam impedit ipsam, nobis saepe magnam cum eaque vel, ullam qui possimus asperiores quam, non ducimus pariatur. Vitae hic quas ea molestias nobis laborum corrupti magnam asperiores doloremque pariatur!',
  },
  {
    id: 7,
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    descritpion:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus sint illo nesciunt deserunt quis beatae accusamus reiciendis dolore ea! In. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam optio rem aperiam impedit ipsam, nobis saepe magnam cum eaque vel, ullam qui possimus asperiores quam, non ducimus pariatur. Vitae hic quas ea molestias nobis laborum corrupti magnam asperiores doloremque pariatur!',
  },
];

const Page = () => {
  const { onOpen } = useModalStore();

  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3">
        {chats.map(chat => (
          <div
            key={chat.id}
            className="group relative space-y-2 rounded-md bg-gray-100 p-6"
          >
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical className="size-5 rotate-90 opacity-0 group-hover:opacity-100" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-5 rounded-2xl">
                  {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                  <DropdownMenuItem>
                    <Share className="text-black" /> Share
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      onOpen({
                        type: 'rename-chat',
                        title: chat.title,
                      })
                    }
                  >
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
            <h2 className="mt-6 line-clamp-1 font-bold">{chat.title}</h2>
            <p className="line-clamp-2">{chat.descritpion}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Page;
