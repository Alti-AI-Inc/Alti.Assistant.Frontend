import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, Pencil, Share, Trash2 } from 'lucide-react';

const chats = [
  {
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    descritpion:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus sint illo nesciunt deserunt quis beatae accusamus reiciendis dolore ea! In. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam optio rem aperiam impedit ipsam, nobis saepe magnam cum eaque vel, ullam qui possimus asperiores quam, non ducimus pariatur. Vitae hic quas ea molestias nobis laborum corrupti magnam asperiores doloremque pariatur!',
  },
  {
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    descritpion:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus sint illo nesciunt deserunt quis beatae accusamus reiciendis dolore ea! In. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam optio rem aperiam impedit ipsam, nobis saepe magnam cum eaque vel, ullam qui possimus asperiores quam, non ducimus pariatur. Vitae hic quas ea molestias nobis laborum corrupti magnam asperiores doloremque pariatur!',
  },
  {
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    descritpion:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus sint illo nesciunt deserunt quis beatae accusamus reiciendis dolore ea! In. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam optio rem aperiam impedit ipsam, nobis saepe magnam cum eaque vel, ullam qui possimus asperiores quam, non ducimus pariatur. Vitae hic quas ea molestias nobis laborum corrupti magnam asperiores doloremque pariatur!',
  },
  {
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    descritpion:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus sint illo nesciunt deserunt quis beatae accusamus reiciendis dolore ea! In. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam optio rem aperiam impedit ipsam, nobis saepe magnam cum eaque vel, ullam qui possimus asperiores quam, non ducimus pariatur. Vitae hic quas ea molestias nobis laborum corrupti magnam asperiores doloremque pariatur!',
  },
  {
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    descritpion:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus sint illo nesciunt deserunt quis beatae accusamus reiciendis dolore ea! In. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam optio rem aperiam impedit ipsam, nobis saepe magnam cum eaque vel, ullam qui possimus asperiores quam, non ducimus pariatur. Vitae hic quas ea molestias nobis laborum corrupti magnam asperiores doloremque pariatur!',
  },
  {
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    descritpion:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus sint illo nesciunt deserunt quis beatae accusamus reiciendis dolore ea! In. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam optio rem aperiam impedit ipsam, nobis saepe magnam cum eaque vel, ullam qui possimus asperiores quam, non ducimus pariatur. Vitae hic quas ea molestias nobis laborum corrupti magnam asperiores doloremque pariatur!',
  },
  {
    title: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    descritpion:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus sint illo nesciunt deserunt quis beatae accusamus reiciendis dolore ea! In. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam optio rem aperiam impedit ipsam, nobis saepe magnam cum eaque vel, ullam qui possimus asperiores quam, non ducimus pariatur. Vitae hic quas ea molestias nobis laborum corrupti magnam asperiores doloremque pariatur!',
  },
];

const page = () => {
  return (
    <div className="p-6">
     
      {chats.map((chat, index) => (
        <div
          key={index}
          className="group mt-6 space-y-2 relative rounded-md bg-gray-100 p-6"
        >
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical className="rotate-90 opacity-0 group-hover:opacity-100" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-2xl mr-5">
                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                <DropdownMenuItem>
                  <Share className="text-black" /> Share
                </DropdownMenuItem>
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
          <h2 className="font-bold">{chat.title}</h2>
          <p className="line-clamp-2">{chat.descritpion}</p>
        </div>
      ))}
    </div>
  );
};

export default page;
