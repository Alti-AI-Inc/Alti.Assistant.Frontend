'use client';
import { Button } from '@/components/ui/button';
import { useModalStore } from '@/stores/useModalStore';
import BotsList from './_components/BotsList';

const ChatBotPage = () => {
  const { onOpen } = useModalStore();
  return (
    <div className="p-6">
      <div className="mr-6 flex items-center justify-end">
        <Button
          onClick={() => {
            onOpen({
              type: 'add-chatbot',
            });
          }}
        >
          Add Chatbot
        </Button>
      </div>
      <BotsList />
    </div>
  );
};

export default ChatBotPage;
