'use client';

import { useEffect } from 'react';
import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import { cn } from '@/lib/utils';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useSession } from 'next-auth/react';

function WorkflowsClient() {
  const { data } = useSession();
  const { activeConversation, setActiveConversation } = useConversationsStore();

  useEffect(() => {
    setActiveConversation(null);
  }, [setActiveConversation]);

  return (
    <div
      className={cn(
        'flex h-full w-full flex-1 flex-col items-center justify-center',
      )}
      style={{ backgroundColor: '#FCFCFC' }}
    >
      {!activeConversation?.messages.length && (
        <h1 className="mb-8 text-4xl font-medium text-gray-900 dark:text-white tracking-tight">
          Workflow Automation
        </h1>
      )}

      <FullConversation conversationId="new-chat" />

      {!activeConversation && (
        <p className="absolute bottom-3 text-xs text-neutral-500">
          Describe your automation in plain English to create a new workflow.
        </p>
      )}
    </div>
  );
}

export default WorkflowsClient;
