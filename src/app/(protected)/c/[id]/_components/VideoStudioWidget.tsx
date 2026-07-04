'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Film, Play, Pause, Clapperboard, MonitorPlay, Scissors, Image as ImageIcon, Wand2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoStudioWidgetProps {
  currentVideoUrl?: string | null;
  status?: 'processing' | 'completed' | 'failed' | 'idle';
  progress?: number;
}

export function VideoStudioWidget({ currentVideoUrl, status = 'idle', progress = 0 }: VideoStudioWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'generation' | 'timeline' | 'storyboard'>('timeline');

  // Mock timeline clips for demonstration
  const timelineClips = [
    { id: 1, duration: '0:00 - 0:03', label: 'Intro Scene' },
    { id: 2, duration: '0:03 - 0:08', label: 'Main Subject' },
    { id: 3, duration: '0:08 - 0:10', label: 'Outro' },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-white overflow-hidden rounded-xl border border-slate-800 shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <MonitorPlay size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Video Studio</h3>
            <p className="text-xs text-slate-400">Powered by Alti Assistant Cinematic & Advanced Reasoning Models</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 hover:bg-slate-700 h-8 text-xs">
            <ImageIcon className="w-3 h-3 mr-2" />
            Image to Video
          </Button>
          <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 hover:bg-slate-700 h-8 text-xs">
            <Wand2 className="w-3 h-3 mr-2" />
            Generate Scene
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center bg-black/40 relative">
        {status === 'processing' ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="w-12 h-12 text-indigo-400 animate-spin" />
            <p className="text-indigo-400 font-medium">Generating Cinematic Scene...</p>
            <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">{progress}% Complete</p>
          </div>
        ) : currentVideoUrl ? (
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 shadow-lg group">
            <video 
              src={currentVideoUrl} 
              className="w-full h-full object-contain"
              controls
              autoPlay
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        ) : (
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
              <Clapperboard className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Ready to Direct</h2>
            <p className="text-slate-400 text-sm mb-6">
              Describe your scene, upload an image to animate, or paste a video URL for analysis to begin your project.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Timeline/Tools Area */}
      <div className="h-48 border-t border-slate-800 bg-slate-900 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('timeline')}
            className={cn(
              "px-4 py-2 text-xs font-medium border-b-2 transition-colors",
              activeTab === 'timeline' ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-300"
            )}
          >
            Timeline
          </button>
          <button 
            onClick={() => setActiveTab('storyboard')}
            className={cn(
              "px-4 py-2 text-xs font-medium border-b-2 transition-colors",
              activeTab === 'storyboard' ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-300"
            )}
          >
            Storyboard (Gemini)
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-hidden">
          {activeTab === 'timeline' && (
            <div className="h-full flex items-center">
              {/* Timeline Header */}
              <div className="w-32 border-r border-slate-800 h-full flex flex-col justify-center pr-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Film size={14} />
                  <span>Video Track 1</span>
                </div>
              </div>
              {/* Timeline Tracks */}
              <div className="flex-1 h-full pl-4 flex items-center gap-2 overflow-x-auto">
                {timelineClips.map((clip) => (
                  <div key={clip.id} className="h-16 bg-indigo-900/40 border border-indigo-500/30 rounded flex items-center px-3 min-w-[120px] relative group cursor-pointer hover:bg-indigo-800/50 transition-colors">
                    <div className="absolute top-1 left-2 text-[10px] text-indigo-300">{clip.duration}</div>
                    <div className="text-xs font-medium text-indigo-100 mt-2 truncate w-full">{clip.label}</div>
                  </div>
                ))}
                <div className="h-16 bg-slate-800/50 border border-slate-700 border-dashed rounded flex items-center justify-center px-4 min-w-[120px] cursor-pointer hover:bg-slate-800 transition-colors">
                  <span className="text-slate-500 text-xs">+ Add Clip</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'storyboard' && (
            <div className="h-full flex gap-4 overflow-x-auto">
              {[1, 2, 3].map((panel) => (
                <div key={panel} className="h-full w-48 bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex flex-col">
                  <div className="h-20 bg-slate-900 rounded mb-2 flex items-center justify-center text-slate-600 text-xs">
                    Scene {panel} Visual
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-2">
                    AI generated description for scene {panel} indicating camera movement and action.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
