import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatBotPage from './_components/KnowledgeBank';
import KnowledgeBots from './_components/KnowledgeBots';

const pageNow = () => {
  return (
    <div>
      <Tabs defaultValue="knowledge-bank" className="gap-6">
        <TabsList className="mt-10 ml-8 w-full max-w-sm">
          <TabsTrigger value="knowledge-bank">Knowledge Bots</TabsTrigger>
          <TabsTrigger value="knowledge-bots">Knowledge Bank</TabsTrigger>
        </TabsList>
        <TabsContent value="knowledge-bank">
          <ChatBotPage />
        </TabsContent>
        <TabsContent value="knowledge-bots">
          <KnowledgeBots />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default pageNow;
