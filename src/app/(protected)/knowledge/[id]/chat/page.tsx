'use client';

import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useSession } from 'next-auth/react';
import { use, useEffect } from 'react';

interface KnowledgeChatPageProps {
  params: Promise<{ id: string }>;
}

export default function KnowledgeChatPage({ params }: KnowledgeChatPageProps) {
  const { id } = use(params);
  const { data: session } = useSession();
  const { setActiveConversation } = useConversationsStore();

  const { data: knowledgeBases, isLoading } = useKnowledgeBases(
    session?.accessToken,
  );

  const activeKnowledgeBaseName = knowledgeBases?.find(kb => kb.id === id)?.name;

  useEffect(() => {
    setActiveConversation({
      knowledgebaseId: id,
      messages: [],
    });

    return () => {
      // Keep knowledgebaseId in store so ChatInput stays in KB mode
      // during the same session; layout new-chat button handles full reset
    };
  }, [id, setActiveConversation]);

  return (
    <div className="flex h-screen flex-col">
      {(isLoading || activeKnowledgeBaseName) && (
        <div className="flex shrink-0 items-center justify-center pt-8 pb-2">
          <h1 className="text-3xl font-medium">
            {isLoading ? 'Loading...' : `Chat with ${activeKnowledgeBaseName}`}
          </h1>
        </div>
      )}
      <div className="min-h-0 flex-1">
        <FullConversation conversationId="new-chat" />
      </div>
    </div>
  );
}
