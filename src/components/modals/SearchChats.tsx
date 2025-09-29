'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSearchConversations } from '@/hooks/useConversations';
import { useDebounce } from '@/hooks/useDebounce';
import { formatConversationTitle } from '@/lib/utils';
import { ActiveConversation } from '@/stores/useConverstionsStore';
import { useModalStore } from '@/stores/useModalStore';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
const SearchChats = () => {
  const { isOpen, onClose } = useModalStore();
  const { data: session } = useSession();

  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data, isFetching } = useSearchConversations(
    session?.accessToken,
    debouncedSearch,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-4xl rounded-2xl">
        <DialogHeader className="border-b">
          <DialogTitle className="sr-only">Search Chats</DialogTitle>
          <DialogDescription>
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search chats..."
              className="w-full border-0 px-3 py-2 shadow-none focus:ring-0 focus-visible:ring-0"
            />
            {/* <Separator className="mt-4 w-full" /> */}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {isFetching ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              ))}
            </div>
          ) : data?.length === 0 && searchTerm ? (
            <p>No results found</p>
          ) : (
            data?.map((conv: ActiveConversation) => (
              <div
                key={conv._id}
                className="relative cursor-pointer rounded-md p-2 hover:bg-gray-100"
              >
                <p className="font-bold">
                  <Link href={`/c/${conv.conversationId}`}>
                    <span className="absolute inset-0" onClick={onClose}></span>
                    {formatConversationTitle(conv.title!)}
                  </Link>
                </p>
                <p className="line-clamp-1">{conv.messages[1].content}</p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchChats;
