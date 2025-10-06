'use client';
import { Button } from '@/components/ui/button';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NewConversationButton = ({ baseId }: { baseId: string }) => {
  const router = useRouter();
  const {
    setActiveConversation,
    setShowStartLastMessage,
    setUserMessage,
    setSelectedOption,
  } = useConversationsStore();
  return (
    <Button
      onClick={() => {
        setActiveConversation(null);
        setShowStartLastMessage(false);
        setUserMessage('');
        setSelectedOption(null);
        // close();
        router.push(`/dashboard/knowledge/chat/${baseId}`);
      }}
      className="flex items-center justify-start text-sm"
    >
      <SquarePen />
      <span className="text-sm font-normal">New chat</span>
    </Button>
  );
};

export default NewConversationButton;
