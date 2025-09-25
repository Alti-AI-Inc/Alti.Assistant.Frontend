import ChatbotPromptBox from "./_components/ChatbotPromptBox"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <div>
    <ChatbotPromptBox slug={slug} />
  </div>
}