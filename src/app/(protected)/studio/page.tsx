'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { useConversationsStore, OPTIONS } from '@/stores/useConverstionsStore';
import { useSession } from 'next-auth/react';

function StudioAppContent() {
  const { data } = useSession();
  const { activeConversation, setActiveConversation, selectedOption, setSelectedOption } = useConversationsStore();
  const searchParams = useSearchParams();
  const cParam = searchParams.get('c');

  useEffect(() => {
    if (!cParam) {
      setActiveConversation(null);
    }
    if (!selectedOption || ![OPTIONS.CODE, OPTIONS.IMAGE, OPTIONS.VIDEO, OPTIONS.AUDIO].includes(selectedOption)) {
      setSelectedOption(OPTIONS.CODE);
    }
  }, [setActiveConversation, selectedOption, setSelectedOption, cParam]);

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
      <FullConversation conversationId={cParam || "new-chat"} isStudio={true} />
    </div>
  );
}

function StudioApp() {
  return (
    <Suspense fallback={null}>
      <StudioAppContent />
    </Suspense>
  );
}

export default StudioApp;
