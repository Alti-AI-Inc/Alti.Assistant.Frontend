import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import NewChatTitle from '../../[baseId]/_components/NewChatTitle';
import FullConversation from './_components/FullConversation';

export default async function Page({
  params,
}: {
  params: Promise<{ baseId: string }>;
}) {
  const { baseId } = await params;

  return (
    <div className="relative h-[calc(100vh-70px)] lg:h-screen">
      <Link
        href={`/dashboard/knowledge/${baseId}`}
        className="sticky top-2 left-2 flex cursor-pointer items-center"
      >
        <ArrowLeft className="mr-2" /> Back
      </Link>

      <div className="flex h-full flex-col items-center justify-center">
        <NewChatTitle baseId={baseId} />
        <FullConversation conversationId="new-chat" baseId={baseId} />
      </div>
    </div>
  );
}
