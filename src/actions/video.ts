'use client';

export async function getVideoUrl(operationId: string) {
  // while (true) {
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
  console.log({ data });

  // Check if response exists and url does not contain storage.googleapis.com
  const videoUrl = data?.data?.response?.videoUrl;
  // console.log('video url', videoUrl);
  return videoUrl;
  // if (videoUrl.includes('https://storage.googleapis.com/')) {
  //   return videoUrl; // ✅ exit loop & return final url
  // }
  // await new Promise(resolve => setTimeout(resolve, 5000));
}
// }
