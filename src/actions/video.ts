'use server';

export async function getVideoUrl(operationId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/video/operations`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        operationId: operationId,
      }),
    },
  );

  const data = await response.json();
  const videoUrl = data?.data?.response?.videoUrl;
  return videoUrl;
}
