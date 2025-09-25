'use client';
import { Button } from '@/components/ui/button';
import { useModalStore } from '@/stores/useModalStore';
import BotsList from './_components/BotsList';

const ChatBotPage = () => {
  const { onOpen } = useModalStore();
  return (
    <div className="p-8">
      <h1 className="mt-4 mb-6 text-3xl font-bold text-gray-900">Chatbots</h1>
      <div className="flex items-center justify-end">
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
