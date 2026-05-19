'use client';
import { useEffect } from 'react';

import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { cn } from '@/lib/utils';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useSession } from 'next-auth/react';

function App() {
  const { data } = useSession();
  const { activeConversation, setActiveConversation } = useConversationsStore();
  // const { data } = useSession();
  // console.log(data?.accessToken);
  useEffect(() => {
    setActiveConversation(null);
  }, [setActiveConversation]);

  const {
    data: knowledgeBases,

    // error,
  } = useKnowledgeBases(data?.accessToken);

  const activeKnowledgeBaseName = knowledgeBases?.filter(
    kb => kb.id === activeConversation?.knowledgebaseId,
  )[0]?.name;

  return (
    <div
      className={cn(
        'flex h-full w-full flex-1 flex-col items-center justify-center',
      )}
      style={{ backgroundColor: '#FCFCFC' }}
    >
      {activeConversation?.knowledgebaseId && (
        <h1 className="mb-8 text-4xl font-medium">
          Chat with {activeKnowledgeBaseName}
        </h1>
      )}
      {!activeConversation?.knowledgebaseId &&
        !activeConversation?.messages.length && (
          <h1 className="mb-8 text-4xl font-medium">Real-Time Intelligence</h1>
        )}

      <FullConversation conversationId="new-chat" />

      {!activeConversation && (
        <p className="absolute bottom-3 text-xs text-neutral-500">
          We don’t train on your data. Your chats stay private.
        </p>
      )}
    </div>
  );
}

export default App;
