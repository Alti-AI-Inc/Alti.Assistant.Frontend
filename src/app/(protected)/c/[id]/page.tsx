'use client';

import { useConversationsStore } from '@/stores/converstionsStore';
import { Streamdown } from 'streamdown';

const ConversationDetailsPage = () => {
  const { activeConversation, isLoadingActiveConversation, error } = useConversationsStore();
  if (isLoadingActiveConversation) {
    return <div>loading</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 space-y-6 overflow-y-auto px-4 py-6">
      {activeConversation?.messages.length &&
        activeConversation.messages.map((messages, idx) => (
          <div key={idx} className="space-y-4">
            {messages.role === 'user' && (
              <div className="flex items-center justify-end">
                <div className="w-fit max-w-[85%] rounded-2xl bg-gray-100 px-4 py-2 text-black shadow">
                  {messages.content}
                </div>
              </div>
            )}

            {messages.role === 'assistant' && (
              <Streamdown className="w-fit max-w-[85%] rounded-lg">
                {messages.content}
              </Streamdown>
            )}
          </div>
        ))}
    </div>
  );
};

export default ConversationDetailsPage;
