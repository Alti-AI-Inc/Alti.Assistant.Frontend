'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useModalStore } from '@/stores/useModalStore';
import BotsList from './BotsList';

const ChatBotPage = () => {
  const { onOpen } = useModalStore();
  return (
    <div className="p-8 pt-0">
      <div className="flex items-center justify-between">
        <Input placeholder="Search" className="max-w-sm" />
        <div className="flex items-center justify-end">
          <Button
            className="w-[115px]"
            onClick={() => {
              onOpen({
                type: 'add-chatbot',
              });
            }}
          >
            New Chatbot
          </Button>
        </div>
      </div>

      <BotsList />
    </div>
  );
};

export default ChatBotPage;
