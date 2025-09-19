'use client';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
// : Promise<string>
async function getVideoUrl(operationId: string) {
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

    if (videoUrl.includes('https://storage.googleapis.com/')) {
      return videoUrl; // ✅ exit loop & return final url
    }
    // await new Promise(resolve => setTimeout(resolve, 5000));
  }
// }

const VideoComponent = ({ operationId }: { operationId: string }) => {
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const url = await getVideoUrl(operationId);
      console.log('✅ Final video URL:', url);
      setVideoUrl(url);
      setLoading(false);
    })();
  }, [operationId]);
  if (loading)
    return (
      <div className={cn('flex flex-1 items-center justify-center py-4')}>
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
          <span>loading video...</span>
        </div>
      </div>
    );

  if (!videoUrl) return <div>No video available</div>;

  return (
    <video controls className="max-w-full rounded-lg">
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoComponent;
