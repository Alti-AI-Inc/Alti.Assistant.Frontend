'use client';
import { getVideoUrl } from '@/actions/video';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const VideoComponent = ({ operationId }: { operationId: string }) => {
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!operationId) return;

    // eslint-disable-next-line prefer-const
    let intervalId: string | number | NodeJS.Timeout | undefined;

    const checkStatus = async () => {
      try {
        const response = await getVideoUrl(operationId);
        if (response.success && response.data) {
          setVideoUrl(response.data);
          setLoading(false);

          // stop polling once we get the URL
          clearInterval(intervalId);
        } else if (!response.success && response.debugMessage) {
          console.error('Video fetch failed:', response.debugMessage);
        }
      } catch (err) {
        console.error('❌ Error fetching video URL:', err);
      }
    };

    // run first immediately
    checkStatus();

    // keep polling every 30 seconds
    intervalId = setInterval(checkStatus, 15000);

    return () => clearInterval(intervalId); // cleanup on unmount
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
