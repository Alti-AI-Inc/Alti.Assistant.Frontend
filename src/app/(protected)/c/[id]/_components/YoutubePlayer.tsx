type VideoData = {
  title: string;
  url: string;
  source: string;
  index?: number;
};

export const YouTubePlayer = ({ videoData }: { videoData: VideoData }) => {
  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    );
    return match ? match[1] : null;
  };

  const videoId = getVideoId(videoData.url);

  if (!videoId) {
    return <div>Invalid YouTube URL</div>;
  }

  return (
    <div className="youtube-player">
      {/* <h3>{videoData.title}</h3> */}
      <div
        className="video-container"
        style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          overflow: 'hidden',
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={videoData.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </div>
  );
};
