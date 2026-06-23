'use client';
import { useEffect } from 'react';

import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { cn } from '@/lib/utils';
import { useConversationsStore, OPTIONS } from '@/stores/useConverstionsStore';
import { useSession } from 'next-auth/react';

function App() {
  const { data } = useSession();
  const { activeConversation, setActiveConversation, selectedOption } = useConversationsStore();
  // const { data } = useSession();
  // console.log(data?.accessToken);
  useEffect(() => {
    setActiveConversation(null);
  }, [setActiveConversation]);

  const {
    data: knowledgeBases,

    // error,
  } = useKnowledgeBases(data?.accessToken);

  const activeKnowledgeBaseName = knowledgeBases?.find(
    kb => kb.id === activeConversation?.knowledgebaseId,
  )?.name;

  return (
    <div
      className={cn(
        'flex h-full w-full flex-1 flex-col items-center justify-center',
        !activeConversation && 'pb-20',
      )}
      style={{ backgroundColor: '#F5F5F7' }}
    >
      {activeConversation?.knowledgebaseId && (
        <h1 className="mb-8 text-4xl font-medium text-gray-900 dark:text-white tracking-tight">
          Chat with {activeKnowledgeBaseName}
        </h1>
      )}
      {!activeConversation?.knowledgebaseId &&
        !activeConversation?.messages?.length && (
          <h1 className="mb-4 mt-12 text-4xl font-medium text-gray-900 dark:text-white tracking-tight">
            {selectedOption === OPTIONS.RESEARCH
              ? 'Deep Research'
              : selectedOption === OPTIONS.IMAGE
              ? 'Image Generation'
              : selectedOption === OPTIONS.CODE
              ? 'Code Generation'
              : selectedOption === OPTIONS.VIDEO
              ? 'Video Generation'
              : selectedOption === OPTIONS.DRAFT_DOCUMENT
              ? 'Writing Assistant'
              : 'Real-Time Intelligence'}
          </h1>
        )}

      <FullConversation conversationId="new-chat" />
    </div>
  );
}

export default App;
