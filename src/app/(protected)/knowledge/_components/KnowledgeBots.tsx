'use client';

import KnowledgeBaseFileUpload from '@/components/KnowledgeBaseFileUpload';
import { Button } from '@/components/ui/button';
// import { DeleteFilledIcon } from "@/components/dashboard/delete";
// import DeleteModal from "@/components/delete";
import { Input } from '@/components/ui/input';

import { Spinner } from '@/components/ui/spinner';
import {
  Knowledgebase,
  useKnowledgeBaseFiles,
  useKnowledgeBases,
} from '@/hooks/useKnowledgeBases';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useModalStore } from '@/stores/useModalStore';
import { ArrowLeft, SquarePen, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FileList } from './FileList';
// import { FileViewer } from './_components/FileViewer';

function KnowledgeBots() {
  const router = useRouter();

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

  const { data: kbFiles, isLoading: isLoadingFiles } = useKnowledgeBaseFiles(
    activeConversation?.knowledgebaseId || '',
    session?.accessToken,
  );

  const handleKbClick = async (item: Knowledgebase) => {
    setActiveConversation({
      knowledgebaseId: item.id,
      messages: [],
    });
    // setActiveKbId(item.id);
  };

  const activeKnowledgeBaseName = knowledgeBases?.filter(
    kb => kb.id === activeConversation?.knowledgebaseId,
  )[0]?.name;

  return (
    <div className="relative h-full w-full p-8 pt-0">
      <div className="flex items-center justify-between">
        <Input placeholder="Search" className="max-w-sm" />
        <div className="flex items-center justify-end">
          {activeConversation?.knowledgebaseId ? (
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-5">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => {
                      setShowStartLastMessage(false);
                      setUserMessage('');
                      setSelectedOption(null);

                      router.push(`/knowledge/${activeConversation.knowledgebaseId}/chat`);
                    }}
                    className="flex items-center justify-start text-sm"
                  >
                    <SquarePen />
                    <span className="text-sm font-normal">Chat with workspace</span>
                  </Button>
                  <KnowledgeBaseFileUpload
                    baseId={activeConversation?.knowledgebaseId}
                  />
                </div>
              </div>
            </div>
          ) : (
            <Button
              className=""
              onClick={() => onOpen({ type: 'create-knowledge-base' })}
            >
              {/* New Folder */}
              New Workspace
            </Button>
          )}
        </div>
      </div>
      {activeConversation?.knowledgebaseId && (
        <div className="mt-6 mb-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activeConversation?.knowledgebaseId && (
              <ArrowLeft
                onClick={() => {
                  setActiveConversation(null);
                }}
              />
            )}
            <h1 className="text-3xl font-bold text-gray-900">
              {activeConversation?.knowledgebaseId
                ? `${activeKnowledgeBaseName} Files`
                : ''}
            </h1>
          </div>

          <div>
            <Trash
              onClick={() => {
                onOpen({
                  type: 'delete-knowledge-base',
                  actionId: activeConversation?.knowledgebaseId,
                });
              }}
            />
          </div>
        </div>
      )}

      <div
        className={`mt-6 flex w-full overflow-y-auto ${activeConversation?.knowledgebaseId
            ? 'h-[calc(80vh_-_220px)] flex-col gap-2'
            : 'flex-row flex-wrap gap-5'
          }`}
      >
        {/* {!activeConversation?.knowledgebaseId && !isLoading && (
          <div
            className="flex size-40 cursor-pointer items-center justify-center rounded-2xl bg-black text-white"
            onClick={() => onOpen({ type: 'create-knowledge-base' })}
          >
            New Bot
          </div>
        )} */}
        {isLoading || isLoadingFiles ? (
          <div className="flex h-[calc(100vh_-180px)] flex-1 items-center justify-center">
            <Spinner /> Loading...
          </div>
        ) : activeConversation?.knowledgebaseId && !!kbFiles?.files ? (
          <FileList
            baseId={activeConversation.knowledgebaseId}
            accessToken={session?.accessToken}
          />
        ) : !!knowledgeBases?.length ? (
          knowledgeBases.map(item => (
            <div
              key={item.id}
              className="relative flex size-40 cursor-pointer items-center justify-center rounded-2xl bg-gray-100 p-2"
              onClick={() => handleKbClick(item)}
            >
              {item.name}
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

export default KnowledgeBots;
