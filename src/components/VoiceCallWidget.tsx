import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react';

export default function VoiceCallWidget({ onClose }: { onClose: () => void }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const wsRef = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws')}/v1/realtime`;
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => setIsConnected(true);
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'transcript') {
        setTranscript(prev => prev + ' ' + data.text);
      }
    };
    wsRef.current.onclose = () => setIsConnected(false);

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const toggleVideo = async () => {
    if (!isVideoActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsVideoActive(true);
        // Send frames over WebSocket logic would go here
      } catch (err) {
        console.error("Failed to get webcam", err);
      }
    } else {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setIsVideoActive(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-zinc-900 border border-zinc-700 rounded-2xl p-4 shadow-2xl z-50 w-72 flex flex-col items-center">
      
      {isVideoActive && (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-32 bg-black rounded-lg mb-4 object-cover border border-zinc-800"
        />
      )}

      <div className="relative mb-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isConnected ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
          <Mic className={`size-8 ${isConnected ? 'text-emerald-400' : 'text-red-400'}`} />
        </div>
        {isConnected && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full animate-pulse" />
        )}
      </div>
      
      <p className="text-white text-sm font-medium mb-1">
        {isConnected ? 'Omnimodal Connection Active' : 'Connecting...'}
      </p>
      
      <div className="w-full bg-black/50 rounded-lg p-2 h-20 overflow-y-auto mb-4 border border-zinc-800">
        <p className="text-xs text-zinc-300 italic">
          {transcript || 'Listening & Watching...'}
        </p>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={toggleVideo}
          className={`${isVideoActive ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-zinc-700 hover:bg-zinc-600'} text-white rounded-full p-3 transition-colors`}
        >
          {isVideoActive ? <Video className="size-5" /> : <VideoOff className="size-5" />}
        </button>
        <button 
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 transition-colors"
        >
          <PhoneOff className="size-5" />
        </button>
      </div>
    </div>
  );
}
