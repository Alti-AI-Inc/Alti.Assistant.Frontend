'use client';

import { getVideoUrl } from '@/actions/video';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Download, RefreshCw, CheckCircle2, Loader2, PlayCircle, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const telemetrySteps = [
  { label: 'Connecting to Alti Assistant Cinematic Engine...', duration: 6000 },
  { label: 'Analyzing motion vectors & text prompt alignment...', duration: 12000 },
  { label: 'Initializing diffusion pipeline (30 FPS keyframes)...', duration: 18000 },
  { label: 'Synthesizing high-fidelity frame buffer streams...', duration: 24000 },
  { label: 'Compiling MP4 container & final network upload...', duration: 10000 },
];

const VideoComponent = ({ operationId }: { operationId: string }) => {
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loop, setLoop] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!operationId) return;

    let intervalId: string | number | NodeJS.Timeout | undefined;

    const checkStatus = async () => {
      try {
        const response = await getVideoUrl(operationId);
        if (response.success && response.data) {
          setVideoUrl(response.data);
          setLoading(false);
          clearInterval(intervalId);
        } else if (!response.success && response.debugMessage) {
          console.error('Video fetch failed:', response.debugMessage);
          if (response.debugMessage.toLowerCase().includes('fail') || response.debugMessage.toLowerCase().includes('error')) {
            setError(response.message || 'Video generation failed.');
            setLoading(false);
            clearInterval(intervalId);
          }
        }
      } catch (err) {
        console.error('❌ Error fetching video URL:', err);
      }
    };

    // run first immediately
    checkStatus();

    // keep polling every 15 seconds
    intervalId = setInterval(checkStatus, 15000);

    return () => clearInterval(intervalId); // cleanup on unmount
  }, [operationId]);

  useEffect(() => {
    if (!loading) return;
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - start);
    }, 250);
    return () => clearInterval(timer);
  }, [loading]);

  // Calculate steps status
  let accumulatedTime = 0;
  const stepsWithStatus = telemetrySteps.map((step, idx) => {
    const isLast = idx === telemetrySteps.length - 1;
    const start = accumulatedTime;
    const end = start + step.duration;
    accumulatedTime = end;

    let status: 'completed' | 'active' | 'pending' = 'pending';
    if (elapsedTime >= end) {
      status = isLast ? 'active' : 'completed';
    } else if (elapsedTime >= start) {
      status = 'active';
    }

    return { ...step, status };
  });

  const totalDuration = telemetrySteps.reduce((acc, s) => acc + s.duration, 0);
  const progressPercent = Math.min(Math.round((elapsedTime / totalDuration) * 98), 98);

  if (loading) {
    return (
      <div className="w-full max-w-md p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col gap-4 text-zinc-300 font-sans mx-auto select-none my-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Loader2 className="size-4 text-indigo-400 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Veo 3.1 Generation</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            {Math.round(elapsedTime / 1000)}s elapsed
          </span>
        </div>

        {/* Steps checklist */}
        <div className="flex flex-col gap-3.5 my-2">
          {stepsWithStatus.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <div className="mt-0.5 flex-none">
                {step.status === 'completed' && (
                  <CheckCircle2 className="size-4 text-emerald-400 fill-emerald-500/10" />
                )}
                {step.status === 'active' && (
                  <Loader2 className="size-4 text-indigo-400 animate-spin" />
                )}
                {step.status === 'pending' && (
                  <div className="size-4 rounded-full border-2 border-zinc-800 bg-zinc-950" />
                )}
              </div>
              <span
                className={cn(
                  "transition-colors duration-300",
                  step.status === 'completed' && "text-zinc-500 line-through",
                  step.status === 'active' && "text-white font-medium",
                  step.status === 'pending' && "text-zinc-600"
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-800">
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-500 rounded-full shadow-[0_0_8px_#6366f1]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md p-5 border border-red-500/20 bg-red-500/5 rounded-2xl flex items-start gap-3 text-zinc-300 mx-auto my-4">
        <AlertCircle className="size-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Generation Error</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  if (!videoUrl) return <div className="text-zinc-500 text-xs italic text-center py-4">No video available</div>;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-black/10 dark:border-zinc-800 bg-[#0E0E10] group shadow-2xl flex flex-col items-center select-none max-w-2xl mx-auto my-4">
      {/* Custom Header Bar */}
      <div className="flex items-center justify-between px-4 h-11 w-full bg-[#1A1A1E] border-b border-zinc-800 shrink-0 text-zinc-400 text-xs select-none">
        <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
          <Eye className="size-4 text-indigo-400" />
          Veo 3.1 Player
        </span>
        <div className="flex items-center gap-2">
          {/* Loop Option */}
          <button
            onClick={() => {
              setLoop(!loop);
              toast.success(`Looping is now ${!loop ? 'enabled' : 'disabled'}`);
            }}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold border transition-all duration-200 cursor-pointer focus:outline-none",
              loop
                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-xs"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
            )}
            title="Toggle Looping"
          >
            <RefreshCw className={cn("size-3", loop && "animate-spin")} style={{ animationDuration: '6s' }} />
            Looping
          </button>
          
          {/* Autoplay Option */}
          <button
            onClick={() => {
              setAutoplay(!autoplay);
              toast.success(`Autoplay is now ${!autoplay ? 'enabled' : 'disabled'}`);
            }}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold border transition-all duration-200 cursor-pointer focus:outline-none",
              autoplay
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-xs"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
            )}
            title="Toggle Autoplay"
          >
            <PlayCircle className="size-3" />
            Autoplay
          </button>
          
          {/* Download Button */}
          <a
            href={videoUrl}
            download="generated_video.mp4"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => toast.success('Starting video download...')}
            className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer"
            title="Download Video"
          >
            <Download className="size-4" />
          </a>
        </div>
      </div>
      
      {/* Video Content */}
      <video
        key={`${loop}-${autoplay}`}
        autoPlay={autoplay}
        loop={loop}
        controls
        playsInline
        className="w-full object-contain max-h-[450px] bg-black"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoComponent;
