import { useEffect, useState } from 'react';

// type VideoData = {
//   title: string;
//   url: string;
//   source: string;
//   index?: number;
// };

// export const YouTubePlayer = ({ videoData }: { videoData: VideoData }) => {
//   // Extract video ID from YouTube URL
//   const getVideoId = (url: string) => {
//     const match = url.match(
//       /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
//     );
//     return match ? match[1] : null;
//   };

//   const videoId = getVideoId(videoData.url);

//   if (!videoId) {
//     return <div>Invalid YouTube URL</div>;
//   }

//   return (
//     <div className="youtube-player">
//       {/* <h3>{videoData.title}</h3> */}
//       <div
//         className="video-container"
//         style={{
//           position: 'relative',
//           paddingBottom: '56.25%',
//           height: 0,
//           overflow: 'hidden',
//         }}
//       >
//         <iframe
//           src={`https://www.youtube.com/embed/${videoId}`}
//           title={videoData.title}
//           frameBorder="0"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// Helper function to extract YouTube URLs from text
const extractYouTubeUrls = (text: string) => {
  const youtubeRegex =
    /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g;
  const matches = [];
  let match;

  while ((match = youtubeRegex.exec(text)) !== null) {
    matches.push({
      fullUrl: match[0],
      videoId: match[1],
    });
  }

  return matches;
};

// YouTube Player Component
const YouTubePlayer = ({
  videoId,
  index,
}: {
  videoId: string;
  index: number;
}) => {
  return (
    <div className="youtube-player mb-4">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0`}
          title={`YouTube Video ${index + 1}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 h-full w-full rounded-lg"
        />
      </div>
    </div>
  );
};

// Updated VideoComponent for direct content
const VideoComponentForContent = ({ content }: { content: string }) => {
  const [youtubeVideos, setYoutubeVideos] = useState<
    { fullUrl: string; videoId: string }[]
  >([]);

  useEffect(() => {
    if (content) {
      const extractedVideos = extractYouTubeUrls(content);
      setYoutubeVideos(extractedVideos);
    }
  }, [content]);

  if (youtubeVideos.length === 0) {
    return null; // Let Streamdown handle it
  }

  return (
    <div className="size-full space-y-4">
      {youtubeVideos.map((video, index) => (
        <YouTubePlayer
          key={video.videoId}
          videoId={video.videoId}
          index={index}
        />
      ))}
    </div>
  );
};

export default VideoComponentForContent;
