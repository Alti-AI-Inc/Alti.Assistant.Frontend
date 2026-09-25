import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, PhoneOff } from 'lucide-react';

export default function VoiceCallWidget({ onClose }: { onClose: () => void }) {
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to Together Realtime endpoint
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

  return (
    <div className="fixed bottom-4 right-4 bg-zinc-900 border border-zinc-700 rounded-2xl p-4 shadow-2xl z-50 w-72 flex flex-col items-center">
      <div className="relative mb-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isConnected ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
          <Mic className={`size-8 ${isConnected ? 'text-emerald-400' : 'text-red-400'}`} />
        </div>
        {isConnected && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full animate-pulse" />
        )}
      </div>
      
      <p className="text-white text-sm font-medium mb-1">
        {isConnected ? 'Together Voice Connected' : 'Connecting...'}
      </p>
      
      <div className="w-full bg-black/50 rounded-lg p-2 h-20 overflow-y-auto mb-4 border border-zinc-800">
        <p className="text-xs text-zinc-300 italic">
          {transcript || 'Listening for speech...'}
        </p>
      </div>

      <button 
        onClick={onClose}
        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 transition-colors"
      >
        <PhoneOff className="size-5" />
      </button>
    </div>
  );
}
