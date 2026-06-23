import React, { useRef, useState } from 'react';
import { Download, Edit3, Image as ImageIcon, Eraser, PenTool, LayoutTemplate, Sparkles, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DesignStudioWidgetProps {
  currentImageUrl?: string | null;
  onUpload?: (file: File) => void;
  isGenerating?: boolean;
}

export default function DesignStudioWidget({
  currentImageUrl,
  onUpload,
  isGenerating,
}: DesignStudioWidgetProps) {
  const [activeTool, setActiveTool] = useState<'brush' | 'eraser' | 'mask' | 'select'>('select');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#09090b] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm relative">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 text-indigo-600 rounded-lg">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <span className="font-semibold text-sm dark:text-zinc-200">Design Studio Canvas</span>
        </div>
        
        <div className="flex items-center gap-1 bg-white dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`px-2 py-1 h-auto ${activeTool === 'select' ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
            onClick={() => setActiveTool('select')}
          >
            <PenTool className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`px-2 py-1 h-auto ${activeTool === 'brush' ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
            onClick={() => setActiveTool('brush')}
          >
            <Edit3 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`px-2 py-1 h-auto ${activeTool === 'eraser' ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
            onClick={() => setActiveTool('eraser')}
          >
            <Eraser className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
           <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <Button variant="outline" size="sm" className="h-8 gap-2 text-xs" onClick={handleUploadClick}>
            <Upload className="w-3 h-3" />
            Upload Mockup
          </Button>
          <Button size="sm" className="h-8 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs">
            <Sparkles className="w-3 h-3" />
            Enhance Design
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-950 overflow-hidden" 
           style={{ backgroundImage: 'radial-gradient(circle, #e4e4e7 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        
        {isGenerating ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-sm font-medium text-zinc-500">Synthesizing design...</span>
          </div>
        ) : currentImageUrl ? (
          <div className="relative group max-w-[90%] max-h-[90%] flex items-center justify-center shadow-2xl rounded-lg overflow-hidden border border-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={currentImageUrl} 
              alt="Design Canvas" 
              className="max-w-full max-h-full object-contain"
            />
            {/* Interactive overlay placeholder */}
            {activeTool !== 'select' && (
              <div className="absolute inset-0 bg-indigo-500/10 cursor-crosshair mix-blend-overlay" />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-zinc-400 dark:text-zinc-600">
            <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">Describe your design in the chat</p>
            <p className="text-xs mt-1">or upload a mockup to get started</p>
          </div>
        )}
      </div>
      
      {/* Status Bar */}
      <div className="h-8 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center px-4">
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Connected to Gemini 3 Design Core
        </div>
      </div>
    </div>
  );
}
