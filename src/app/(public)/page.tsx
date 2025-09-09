import { ChatInputComponent } from '@/components/components-chat-input';

function App() {
  return (
    <div className="-mt-10 flex min-h-[calc(100vh-20px)] flex-col items-center justify-center">
      <h1 className="mb-8 text-4xl font-medium">How can I help you?</h1>
      <ChatInputComponent />
      <p className="absolute bottom-1 text-xs text-gray-500">
        We don’t train on your data. Your chats stay private.
      </p>
    </div>
  );
}

export default App;
