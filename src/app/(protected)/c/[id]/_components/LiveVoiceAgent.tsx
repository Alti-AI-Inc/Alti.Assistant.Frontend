'use client';

import { useState, useCallback } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  BarVisualizer,
  VoiceAssistantControlBar,
  DisconnectButton,
  useConnectionState,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { ConnectionState } from 'livekit-client';
import { Sparkles, Mic, Loader2 } from 'lucide-react';

interface LiveVoiceAgentProps {
  roomName?: string;
}

export default function LiveVoiceAgent({ roomName = 'insoai-ai-room' }: LiveVoiceAgentProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch token from the backend streaming controller
  const startConversation = useCallback(async () => {
    try {
      setIsFetching(true);
      // Calls the Inso AI Streaming Controller to generate a LiveKit JWT
      const response = await fetch(`/api/v1/streaming/token?room=${roomName}`);
      const data = await response.json();
      
      if (data.success && data.data?.token) {
        setToken(data.data.token);
      } else {
        console.error('Failed to get token:', data);
      }
    } catch (error) {
      console.error('Error fetching LiveKit token:', error);
    } finally {
      setIsFetching(false);
    }
  }, [roomName]);

  const handleDisconnected = () => {
    setToken(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 overflow-hidden rounded-2xl border border-black/10 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-zinc-50 dark:bg-zinc-900 border-b border-black/5 dark:border-zinc-800">
        <span className="font-semibold flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
          <Sparkles className="size-4 text-indigo-500 animate-pulse" />
          Inso AI Voice Assistant
        </span>
        <div className="text-xs font-mono text-zinc-500">Inso AI Cloud powered</div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 min-h-[250px] flex flex-col items-center justify-center relative bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
        {!token ? (
          // Connect Button State
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="size-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-2">
              <Mic className="size-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-sm text-center text-zinc-600 dark:text-zinc-400 max-w-xs mb-2">
              Start a real-time conversation with Inso AI using your microphone.
            </p>
            <button
              onClick={startConversation}
              disabled={isFetching}
              className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md hover:shadow-indigo-500/25 transition-all disabled:opacity-70 flex items-center gap-2"
            >
              {isFetching ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Start Conversation'
              )}
            </button>
          </div>
        ) : (
          // Active Room State
          <LiveKitRoom
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || 'ws://localhost:7880'}
            connect={true}
            audio={true}
            video={false}
            onDisconnected={handleDisconnected}
            className="w-full flex flex-col items-center justify-center gap-8 animate-in fade-in duration-500"
          >
            <ConnectionStatus />
            
            {/* Visualizer and State Indicator */}
            <div className="flex flex-col items-center gap-6 w-full max-w-md">
              <div className="h-24 w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800/50 overflow-hidden">
                <BarVisualizer state="speaking" barCount={7} options={{ minHeight: 20 }} />
              </div>
              
              <div className="h-8 flex items-center justify-center">
                <div className="text-sm font-medium text-indigo-500 animate-pulse">Voice Assistant Active</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-4">
              <VoiceAssistantControlBar />
              <DisconnectButton className="px-4 py-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full font-medium text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                End Call
              </DisconnectButton>
            </div>
            
            <RoomAudioRenderer />
          </LiveKitRoom>
        )}
      </div>
    </div>
  );
}

// Helper component to show connecting state
function ConnectionStatus() {
  const state = useConnectionState();
  if (state === ConnectionState.Connecting) {
    return (
      <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-medium text-zinc-500 bg-white/80 dark:bg-zinc-900/80 px-3 py-1.5 rounded-full backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
        <Loader2 className="size-3 animate-spin" />
        Connecting to socket...
      </div>
    );
  }
  return null;
}
