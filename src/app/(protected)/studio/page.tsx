'use client';
import { useEffect } from 'react';

import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useSession } from 'next-auth/react';

function StudioApp() {
  const { data } = useSession();
  const { activeConversation, setActiveConversation } = useConversationsStore();

  useEffect(() => {
    setActiveConversation(null);
  }, [setActiveConversation]);

  const { data: knowledgeBases } = useKnowledgeBases(data?.accessToken);

  const activeKnowledgeBaseName = knowledgeBases?.find(
    kb => kb.id === activeConversation?.knowledgebaseId,
  )?.name;

  return (
    <div className="flex h-full w-full flex-1 flex-col min-h-0 overflow-hidden bg-[#e1e1e1] dark:bg-zinc-950">
      {activeConversation?.knowledgebaseId && (
        <h1 className="mb-8 text-4xl font-medium text-gray-900 dark:text-white tracking-tight">
          Chat with {activeKnowledgeBaseName}
        </h1>
      )}
      <FullConversation conversationId="new-chat" isStudio={true} />
    </div>
  );
}

export default StudioApp;
