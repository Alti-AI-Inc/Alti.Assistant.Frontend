import SharedConversation from './_components/SharedConversation';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className='p-8'>
      <SharedConversation id={id} />
    </div>
  );
}
