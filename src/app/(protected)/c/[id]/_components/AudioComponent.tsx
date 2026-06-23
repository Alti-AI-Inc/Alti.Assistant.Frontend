'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Download, Volume2, RotateCcw, VolumeX, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import LiveVoiceAgent from './LiveVoiceAgent';

interface AudioComponentProps {
  audioUrl: string;
}

export default function AudioComponent({ audioUrl }: AudioComponentProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error('Audio playback failed:', err);
        toast.error('Could not start audio playback');
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleSpeedChange = () => {
    if (!audioRef.current) return;
    let nextRate = 1;
    if (playbackRate === 1) nextRate = 1.25;
    else if (playbackRate === 1.25) nextRate = 1.5;
    else if (playbackRate === 1.5) nextRate = 2;
    else nextRate = 1;

    audioRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
    toast.success(`Speed set to ${nextRate}x`);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* New Real-time Interactive Agent */}
      <LiveVoiceAgent roomName="alti-ai-room" />

      {/* Legacy Static Audio Synthesizer */}
      <div className="w-full max-w-xl mx-auto my-4 overflow-hidden rounded-2xl border border-black/10 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg select-none">
        {/* Hidden HTML5 Audio Element */}
        <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border-b border-black/5 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="font-semibold flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
          <Sparkles className="size-3.5 text-indigo-500 animate-pulse" />
          Vertex AI Voiceover Synthesizer
        </span>
        <div className="flex items-center gap-2">
          {/* Download button */}
          <a
            href={audioUrl}
            download="alti_synthesized_voice.mp3"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => toast.success('Downloading MP3 audio...')}
            className="flex items-center justify-center h-6 w-6 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            title="Download MP3"
          >
            <Download className="size-3.5" />
          </a>
        </div>
      </div>

      {/* Player Main Section */}
      <div className="p-5 flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="flex-shrink-0 flex items-center justify-center size-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none"
        >
          {isPlaying ? (
            <Pause className="size-5 fill-white" />
          ) : (
            <Play className="size-5 fill-white translate-x-0.5" />
          )}
        </button>

        {/* Timeline & Slider Controls */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration || 0)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 outline-none"
          />
        </div>

        {/* Speed & Volume controls */}
        <div className="flex items-center gap-2 flex-shrink-0 pl-2 border-l border-zinc-150 dark:border-zinc-800">
          {/* Playback speed changer */}
          <button
            onClick={handleSpeedChange}
            className="px-2 py-1 rounded-md text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 hover:border-indigo-500/30 transition-all cursor-pointer"
            title="Speed Control"
          >
            {playbackRate}x
          </button>

          {/* Mute button */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="size-4 text-red-500" />
            ) : (
              <Volume2 className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
