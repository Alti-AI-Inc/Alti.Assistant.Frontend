import KnowledgeBaseConversations from './_components/KnowledgeBaseConversations';

export default async function Page({
  params,
}: {
  params: Promise<{ baseId: string }>;
}) {
  const { baseId } = await params;
  
  return (
    <div className="p-8">
      <KnowledgeBaseConversations baseId={baseId} />
    </div>
  );
}
