'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useModalStore } from '@/stores/useModalStore';
import BotsList from './_components/BotsList';

const ChatBotPage = () => {
  const { onOpen } = useModalStore();
  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Chatbots</h1>
      <div className="flex items-center justify-between py-4">
        <Input placeholder="Search" className="max-w-sm" />
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
      </div>

      <BotsList />
    </div>
  );
};

export default ChatBotPage;
