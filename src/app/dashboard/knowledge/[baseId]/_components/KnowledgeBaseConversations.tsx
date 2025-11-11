'use client';
import { useKnowledgeBaseConversations } from '@/hooks/useKnowledgeBases';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import KnowledgeBaseFileUpload from '../../../../../components/KnowledgeBaseFileUpload';
import NewConversationButton from './NewConversationButton';

const KnowledgeBaseConversations = ({ baseId }: { baseId: string }) => {
  const { data: session } = useSession();

  const {
    data,
    isLoading,
    isError,
    error,
    // error,
  } = useKnowledgeBaseConversations(baseId, session?.accessToken);

  return (
    <div>
      <div className="flex">
        <div>
          {isLoading ? (
            <div className="absolute inset-0 left-64 flex items-center justify-center bg-white">
              <LoaderCircle className="mr-2 animate-spin" /> Loading...
            </div>
          ) : isError ? (
            <div className="absolute inset-0 left-64 flex items-center justify-center bg-white">
              {error.message}
            </div>
          ) : (
            <div className="flex items-center text-2xl">
              <Link
                href={`/dashboard/knowledge`}
                className="sticky top-2 left-2 mr-6 flex cursor-pointer items-center text-base"
              >
                <ArrowLeft className="mr-2" /> Back
              </Link>
              {data?.knowledgebaseName}
            </div>
          )}
        </div>
        <div className="ml-auto flex justify-end space-x-1">
          <NewConversationButton baseId={baseId} />
          <KnowledgeBaseFileUpload baseId={baseId} />
        </div>
      </div>
      <div className="mt-2">
        {!!data?.conversations.length ? (
          <div className="mt-10">
            <h2 className="mb-2 text-2xl">Conversations</h2>
            <div className='flex items-center space-x-2'>
              {data.conversations.map((conversation, index) => (
                <div
                  key={index}
                  className="relative w-fit rounded-2xl bg-gray-100 px-2 py-4 text-black hover:bg-gray-200"
                >
                  <Link
                    href={`/dashboard/knowledge/chat/${baseId}/${conversation?.conversationId}`}
                  >
                    <span className="absolute inset-0 cursor-pointer"></span>
                    {conversation?.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-[calc(100vh-200px)] items-center justify-center">
            No conversations
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBaseConversations;
