import FullConversation from './_components/FullConversation';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FullConversation conversationId={id} />;
}
