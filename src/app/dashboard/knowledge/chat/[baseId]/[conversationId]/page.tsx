import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import FullConversation from '../_components/FullConversation';

export default async function Page({
  params,
}: {
  params: Promise<{ baseId: string; conversationId: string }>;
}) {
  const { baseId, conversationId } = await params;
  console.log({ params });
  return (
    <div>
      <Link
        href={`/dashboard/knowledge/${baseId}`}
        className="sticky top-2 ml-2 flex cursor-pointer items-center"
      >
        <ArrowLeft className="mr-2" /> Back
      </Link>
      <FullConversation baseId={baseId} conversationId={conversationId} />
    </div>
  );
}
