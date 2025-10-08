'use client';

import KbFileUpload from '@/components/KbFileUpload';
import { Button } from '@/components/ui/button';
// import { DeleteFilledIcon } from "@/components/dashboard/delete";
// import DeleteModal from "@/components/delete";
import { Input } from '@/components/ui/input';

import { Spinner } from '@/components/ui/spinner';
import { Knowledgebase, useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useModalStore } from '@/stores/useModalStore';
import { ArrowLeft, File, SquarePen, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function DocumentsPage() {
  const router = useRouter();
  const [showBotDetails, setShowBotDetails] = useState(false);

  const { onOpen } = useModalStore();

  const { data: session } = useSession();
  const {
    activeConversation,
    setActiveConversation,
    setUserMessage,
    setShowStartLastMessage,
    setSelectedOption,
  } = useConversationsStore();
  const {
    data: knowledgeBases,
    isLoading,
    // isError,
    // error,
    // error,
  } = useKnowledgeBases(session?.accessToken);

  const handleKbClick = (item: Knowledgebase) => {
    setShowBotDetails(true);
    setActiveConversation({
      knowledgebaseId: item.id,
      messages: [],
    });
  };

  const activeKnowledgeBaseName = knowledgeBases?.filter(
    kb => kb.id === activeConversation?.knowledgebaseId,
  )[0]?.name;

  return (
    <div className="relative h-full w-full p-8">
      <div className="flex items-center justify-between">
        <div className="mb-6 flex items-center gap-3">
          {showBotDetails && (
            <ArrowLeft onClick={() => setShowBotDetails(false)} />
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            {showBotDetails
              ? `${activeKnowledgeBaseName} Files`
              : 'Knowledge Bots'}
          </h1>
        </div>
        {showBotDetails && (
          <div>
            <Trash />
          </div>
        )}
      </div>

      <div className="mt-4 mb-4 flex items-center justify-between">
        <Input placeholder="Search " className="max-w-sm" />
        <div className="flex items-center gap-5">
          {showBotDetails && activeConversation?.knowledgebaseId && (
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => {
                  setShowStartLastMessage(false);
                  setUserMessage('');
                  setSelectedOption(null);
                  // close();
                  router.push('/');
                }}
                className="flex items-center justify-start text-sm"
              >
                <SquarePen />
                <span className="text-sm font-normal">Chat with bot</span>
              </Button>
              <KbFileUpload baseId={activeConversation?.knowledgebaseId} />
            </div>
          )}
        </div>
      </div>

      {/* Main content area with explicit click handling */}
      <div
        className={`flex w-full overflow-y-auto ${
          showBotDetails
            ? 'h-[calc(100vh_-_220px)] flex-col gap-2'
            : 'h-[calc(100vh_-_220px)] flex-row flex-wrap gap-5'
        }`}
      >
        {!showBotDetails && !isLoading && (
          <div
            className="flex size-40 cursor-pointer items-center justify-center rounded-2xl bg-black text-white"
            onClick={() => onOpen({ type: 'create-knowledge-base' })}
          >
            New Bot
          </div>
        )}
        {isLoading ? (
          <div className="flex h-[calc(100vh_-180px)] flex-1 items-center justify-center">
            <Spinner /> Loading...
          </div>
        ) : showBotDetails ? (
          <div className="flex h-fit w-full cursor-pointer flex-row items-center justify-between rounded-lg bg-gray-100 py-4 ps-2 pe-4 transition-all duration-200 hover:bg-gray-200">
            <div className="flex space-x-4">
              <File /> <span>file name</span>
            </div>
            <div
              className="pointer-events-auto"
              // onClick={e => handleDeleteClick(e, item)}
            >
              <Trash size={20} />
            </div>
          </div>
        ) : !!knowledgeBases?.length ? (
          knowledgeBases.map(item => (
            <div
              key={item.id}
              className="relative flex size-40 cursor-pointer items-center justify-center rounded-2xl bg-gray-100 p-2"
              onClick={() => handleKbClick(item)}
            >
              {/* <Link href={`/dashboard/knowledge/${item.id}`}> */}
              {/* <span className="absolute inset-0 cursor-pointer"></span> */}
              {item.name}
              {/* </Link> */}
            </div>
          ))
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-500">
            <p>No files or folders to display</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentsPage;
