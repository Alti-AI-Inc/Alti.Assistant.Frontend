import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useModalStore } from '@/stores/useModalStore';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

type Chat = {
  id: number;
  title: string;
  slug: string;
  descritpion: string;
};

export const chatbots: Chat[] = [
  {
    id: 1,
    slug: 'chatbot-1',
    title: 'Finance Chatbot',
    descritpion:
      'Chatbot description  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas, magnam!',
  },
  {
    id: 2,
    title: 'Medical Chatbot',
    slug: 'chatbot-2',
    descritpion:
      'Chatbot description  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas, magnam!',
  },
  {
    id: 3,
    title: 'Chatbot name',
    slug: 'chatbot-3',
    descritpion:
      'Chatbot description  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas, magnam!',
  },
  {
    id: 4,
    title: 'Chatbot name',
    slug: 'chatbot-4',
    descritpion:
      'Chatbot description  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas, magnam!',
  },
  {
    id: 5,
    title: 'Chatbot name',
    slug: 'chatbot-5',
    descritpion:
      'Chatbot description  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas, magnam!',
  },
  {
    id: 6,
    title: 'Chatbot name',
    slug: 'chatbot-6',
    descritpion:
      'Chatbot description  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas, magnam!',
  },
  {
    id: 7,
    title: 'Chatbot name',
    slug: 'chatbot-7',
    descritpion:
      'Chatbot description  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas, magnam!',
  },
];

const BotsList = () => {
  const { onOpen } = useModalStore();
  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3">
        {chatbots.map(chat => (
          <div
            key={chat.id}
            className="group relative space-y-2 rounded-md bg-gray-100 p-6"
          >
            <div className="absolute top-2 right-2 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical className="size-5 rotate-90 opacity-0 group-hover:opacity-100" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-5 rounded-2xl">
                  {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                  <DropdownMenuItem
                    onClick={() => onOpen({ type: 'edit-chatbot' })}
                  >
                    <Pencil className="text-black" /> Edit
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => {
                      onOpen({
                        type: 'delete-chatbot',
                      });
                    }}
                  >
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
    </>
  );
};

export default BotsList;
