'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Sparkles, Mic, Loader2, Square, Volume2 } from 'lucide-react';

interface LiveVoiceAgentProps {
  roomName?: string;
}

export default function LiveVoiceAgent({ roomName = 'aphura-chat-room' }: LiveVoiceAgentProps) {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const text = result[0].transcript;
        setTranscript(text);
        
        if (result.isFinal) {
          handleUserUtterance(text);
        }
      };

      recognition.onstart = () => setStatus('listening');
      recognition.onend = () => {
        // Only reset if we are just listening (not processing)
        setStatus((prev) => prev === 'listening' ? 'idle' : prev);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleUserUtterance = async (text: string) => {
    if (!text.trim()) return;
    setStatus('thinking');
    
    try {
      // 1. Send text to agent
      const res = await fetch('/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: text }],
          model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'
        })
      });
      const data = await res.json();
      const aiReply = data.choices?.[0]?.message?.content || "I didn't quite get that.";
      
      // 2. Generate Speech via Together TTS
      setStatus('speaking');
      const ttsRes = await fetch('/api/v1/llm/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiReply.slice(0, 500) }) // truncate for speed
      });
      
      if (ttsRes.ok) {
        const audioBlob = await ttsRes.blob();
        const url = URL.createObjectURL(audioBlob);
        
        if (!audioRef.current) {
          audioRef.current = new Audio(url);
        } else {
          audioRef.current.src = url;
        }
        
        audioRef.current.onended = () => {
          setStatus('idle');
          if (isActive) {
             recognitionRef.current?.start();
          }
        };
        
        await audioRef.current.play();
      } else {
        setStatus('idle');
      }
    } catch (error) {
      console.warn('Voice agent error:', error);
      setStatus('idle');
    }
  };

  const toggleConversation = () => {
    if (isActive) {
      setIsActive(false);
      setStatus('idle');
      recognitionRef.current?.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setIsActive(true);
      setStatus('listening');
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 overflow-hidden rounded-2xl border border-black/10 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-zinc-50 dark:bg-zinc-900 border-b border-black/5 dark:border-zinc-800">
        <span className="font-semibold flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
          <Sparkles className="size-4 text-indigo-500 animate-pulse" />
          Aphura Voice Assistant
        </span>
        <div className="text-xs font-mono text-zinc-500">Together AI Native</div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 min-h-[250px] flex flex-col items-center justify-center relative bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
        
        {/* Status Indicator */}
        <div className="mb-8 flex flex-col items-center">
          <div className={`size-20 rounded-full flex items-center justify-center transition-all duration-500 ${
            status === 'listening' ? 'bg-indigo-100 dark:bg-indigo-900/40 scale-110 shadow-[0_0_30px_rgba(99,102,241,0.4)]' : 
            status === 'thinking' ? 'bg-amber-100 dark:bg-amber-900/40 animate-pulse' :
            status === 'speaking' ? 'bg-emerald-100 dark:bg-emerald-900/40 scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]' :
            'bg-zinc-100 dark:bg-zinc-800'
          }`}>
            {status === 'speaking' ? (
              <Volume2 className={`size-8 text-emerald-600 dark:text-emerald-400 ${status === 'speaking' ? 'animate-bounce' : ''}`} />
            ) : status === 'thinking' ? (
              <Loader2 className="size-8 text-amber-600 dark:text-amber-400 animate-spin" />
            ) : (
              <Mic className={`size-8 ${status === 'listening' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`} />
            )}
          </div>
          
          <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            {status}
          </p>
        </div>

        {/* Transcript Box */}
        {isActive && (
          <div className="w-full max-w-md h-20 mb-8 flex items-center justify-center text-center">
            <p className="text-lg text-zinc-700 dark:text-zinc-300 italic opacity-80">
              {transcript ? `"${transcript}"` : (status === 'listening' ? 'Listening...' : '')}
            </p>
          </div>
        )}

        {/* Control Button */}
        <button
          onClick={toggleConversation}
          className={`px-8 py-3 rounded-full font-medium shadow-md transition-all flex items-center gap-2 ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/25' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
          }`}
        >
          {isActive ? (
            <>
              <Square className="size-4 fill-current" /> End Conversation
            </>
          ) : (
            <>
              <Mic className="size-4" /> Start Voice Agent
            </>
          )}
        </button>
      </div>
    </div>
  );
}
