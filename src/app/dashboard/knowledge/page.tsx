'use client';

// import { DeleteFilledIcon } from "@/components/dashboard/delete";
// import DeleteModal from "@/components/delete";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { useModalStore } from '@/stores/useModalStore';
import { LoaderCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

function KnowledgebasePage() {
  const { data: session } = useSession();
  const { onOpen } = useModalStore();

  const {
    data: knowledgeBases,
    isLoading,
    isError,
    error,
    // error,
  } = useKnowledgeBases(session?.accessToken);

  return (
    <div className="relative h-full w-full p-8">
      <div className="flex items-center justify-between">
        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Bank</h1>
        </div>
      </div>

      <div className="mt-4 mb-4 flex items-center justify-between">
        <Input placeholder="Search " className="max-w-sm" />
        <div className="flex items-center gap-5">
          <Button
            className="rounded-lg bg-black text-white"
            onClick={() => onOpen({ type: 'create-knowledge-base' })}
          >
            New folder
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex h-[calc(100vh_-180px)] flex-1 items-center justify-center">
          <LoaderCircle className="mr-2 animate-spin" /> Loading...
        </div>
      ) : isError ? (
        <div> {error.message}</div>
      ) : (
        <div className="flex w-full gap-5 overflow-y-auto">
          {!!knowledgeBases?.length ? (
            knowledgeBases.map(item => (
              <div
                key={item.id}
                className="relative flex size-40 items-center justify-center rounded-2xl bg-gray-100 p-2"
              >
                <Link href={`/dashboard/knowledge/${item.id}`}>
                  <span className="absolute inset-0 cursor-pointer"></span>
                  {item.name}
                </Link>
              </div>
            ))
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-500">
              <p>No files or folders to display</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default KnowledgebasePage;
