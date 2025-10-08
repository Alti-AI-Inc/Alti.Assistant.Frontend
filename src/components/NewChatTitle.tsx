'use client';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { useSession } from 'next-auth/react';

const NewBaseChatTitle = ({ baseId, text }: { baseId: string, text?: string }) => {
  const { data } = useSession();

  const {
    data: knowledgeBases,

    // error,
  } = useKnowledgeBases(data?.accessToken);

  const activeKnowledgeBase = knowledgeBases?.filter(kb => kb.id === baseId)[0];
  return (
    <div>
      <h1 className="mb-8 text-center text-4xl font-medium">
       {text ? text : 'Chat with'} {activeKnowledgeBase?.name}
      </h1>
    </div>
  );
};

export default NewBaseChatTitle;
