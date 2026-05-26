'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useBotsStore } from '@/stores/useBotsStore';

function AssistantWorkspaceContent() {
  const searchParams = useSearchParams();
  
  const { setActiveConversation, activeConversation } = useConversationsStore();
  const { setActiveBotId } = useBotsStore();

  // Read conversation ID from search parameter 'c'
  const convIdParam = searchParams?.get('c');
  const activeConversationId = convIdParam || 'new-chat';

  // Synchronize state
  useEffect(() => {
    setActiveBotId(null); // Not a custom agent persona, this is the master assistant
    if (!convIdParam) {
      setActiveConversation(null);
    }
  }, [convIdParam, setActiveBotId, setActiveConversation]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FCFCFC] dark:bg-gray-950 relative">
      {/* Background blobs for premium glassmorphism */}
      <div className="absolute -top-40 right-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Middle Interactive Workspace */}
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center relative px-4 md:px-8 z-10">
        {!activeConversation?.messages?.length && (
          <h1 className="mb-8 text-4xl font-medium text-gray-900 dark:text-white">
            Alti Assistant
          </h1>
        )}

        <FullConversation conversationId={activeConversationId} />
      </div>
    </div>
  );
}

function AssistantWorkspace() {
  return (
    <Suspense fallback={
      <div className="flex-1 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          Loading Assistant Workspace...
        </div>
      </div>
    }>
      <AssistantWorkspaceContent />
    </Suspense>
  );
}

export default AssistantWorkspace;
