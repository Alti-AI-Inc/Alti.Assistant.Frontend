import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BanksList from './_components/BanksList';
import KnowledgeBots from './_components/KnowledgeBots';

const pageNow = () => {
  return (
    <div>
      <Tabs defaultValue="knowledge-bots" className="gap-6">
        <TabsList className="mt-10 ml-8 w-full max-w-sm">
          <TabsTrigger value="knowledge-bots">Knowledge Bots</TabsTrigger>
          <TabsTrigger value="knowledge-bank">Knowledge Bank</TabsTrigger>
        </TabsList>
        <TabsContent value="knowledge-bank">
          <BanksList />
        </TabsContent>
        <TabsContent value="knowledge-bots">
          <KnowledgeBots />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default pageNow;
