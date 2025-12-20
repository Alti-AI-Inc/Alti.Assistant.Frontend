import BanksList from './_components/BanksList';

const pageNow = () => {
  return (
    <div className='pt-6'>
      {/* <Tabs defaultValue="knowledge-bots" className="gap-6"> */}
        {/* <TabsList className="mt-10 ml-8 w-full max-w-sm">
          <TabsTrigger value="knowledge-bots">Knowledge Bots</TabsTrigger>
          <TabsTrigger value="knowledge-bank">Knowledge Bank</TabsTrigger>
        </TabsList> */}
        {/* <TabsContent value="knowledge-bank"> */}
          <BanksList />
        {/* </TabsContent> */}
        {/* <TabsContent value="knowledge-bots">
          <KnowledgeBots />
        </TabsContent> */}
      {/* </Tabs> */}
    </div>
  );
};

export default pageNow;
