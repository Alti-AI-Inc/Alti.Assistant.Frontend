'use client';
import { useEffect, Suspense } from 'react';

import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import LeftSideNav from '@/components/LeftSideNav';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { cn } from '@/lib/utils';
import { useConversationsStore, OPTIONS } from '@/stores/useConverstionsStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useSession } from 'next-auth/react';

function ModelsPage() {
  const { data } = useSession();
  const { activeConversation, setActiveConversation, selectedOption } = useConversationsStore();
  const { isRightSidebarOpen } = useSidebarStore();

  useEffect(() => {
    setActiveConversation(null);
  }, [setActiveConversation]);

  const { data: knowledgeBases } = useKnowledgeBases(data?.accessToken);

  const activeKnowledgeBaseName = knowledgeBases?.filter(
    kb => kb.id === activeConversation?.knowledgebaseId,
  )[0]?.name;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Middle Sandboxed Chat Interface */}
      <div
        className={cn(
          'flex flex-1 flex-col items-center justify-center relative overflow-y-auto h-full',
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
            <h1 className="mb-8 text-4xl font-medium">
              {selectedOption === OPTIONS.RESEARCH
                ? 'Deep Research'
                : selectedOption === OPTIONS.IMAGE
                ? 'Image Generation'
                : selectedOption === OPTIONS.CODE
                ? 'Code Generation'
                : 'Models Sandbox'}
            </h1>
          )}

        <FullConversation conversationId="new-chat" />

        {!activeConversation && (
          <p className="absolute bottom-3 text-xs text-neutral-500">
            We don’t train on your data. Your chats stay private.
          </p>
        )}
      </div>

      {/* Right Sidebar - Desktop Companion Menu (Mirroring the Left Menu) */}
      <div
        className={cn(
          'sticky top-0 right-0 hidden h-screen flex-col border-l border-black/10 transition-all duration-300 ease-in-out md:flex',
          isRightSidebarOpen ? 'w-68' : 'w-10',
        )}
        style={{ backgroundColor: '#F2F3F5' }}
      >
        <Suspense fallback={null}>
          <LeftSideNav side="right" />
        </Suspense>
      </div>
    </div>
  );
}

export default ModelsPage;
