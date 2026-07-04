'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useBotsStore } from '@/stores/useBotsStore';

import { cn } from '@/lib/utils';

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

  const hasMessages = !!activeConversation?.messages?.length;

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#e1e1e1] dark:bg-zinc-950 relative">
      {/* Middle Interactive Workspace */}
      <div className="flex h-full w-full flex-1 flex-col relative z-10">
        <FullConversation conversationId={activeConversationId} />
      </div>
    </div>
  );
}

function AssistantWorkspace() {
  return (
    <Suspense fallback={
      <div className="flex-1 bg-[#e1e1e1] dark:bg-zinc-950 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          Loading Tasks Workspace...
        </div>
      </div>
    }>
      <AssistantWorkspaceContent />
    </Suspense>
  );
}

export default AssistantWorkspace;
