import { ChatInputComponent } from '@/components/components-chat-input';

function App() {
  return (
    <div className="-mt-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
      <h1 className="mb-8 text-4xl font-bold">How can I help you?</h1>
      <ChatInputComponent />
    </div>
  );
}

export default App;
