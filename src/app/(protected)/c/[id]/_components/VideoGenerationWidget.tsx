'use client';

import React, { useState, useRef, useEffect } from 'react';

interface VideoGenerationWidgetProps {
  videoData: {
    prompt?: string;
    videoUrl?: string | null;
    videoId?: string | null;
    status?: string;
  };
}

export default function VideoGenerationWidget({ videoData }: VideoGenerationWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(!videoData.videoUrl);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoData.videoUrl) setIsLoading(false);
  }, [videoData.videoUrl]);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">AI Video Generation</h3>
          <p className="text-xs text-gray-400 truncate">{videoData.prompt}</p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          isLoading ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
        }`}>
          {isLoading ? '⏳ Processing' : '✓ Ready'}
        </span>
      </div>

      {/* Video Player */}
      <div className="relative aspect-video bg-black/50">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-t-purple-400 animate-spin" />
              <div className="absolute inset-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-400">Generating video...</p>
            <p className="text-xs text-gray-500">This may take 30–60 seconds</p>
          </div>
        ) : videoData.videoUrl ? (
          <video
            ref={videoRef}
            src={videoData.videoUrl}
            className="w-full h-full object-contain"
            controls
            loop
            autoPlay
            muted
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-gray-500">Video unavailable</p>
          </div>
        )}
      </div>

      {/* Controls */}
      {videoData.videoUrl && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
          <span className="text-xs text-gray-500">Together AI · Wan-2.1</span>
          <a
            href={videoData.videoUrl}
            download
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </a>
        </div>
      )}
    </div>
  );
}
