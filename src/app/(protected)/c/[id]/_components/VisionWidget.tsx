'use client';

import React from 'react';

interface VisionWidgetProps {
  visionData: {
    imageUrl?: string;
    question?: string;
    analysis?: string;
  };
}

export default function VisionWidget({ visionData }: VisionWidgetProps) {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white">AI Vision Analysis</h3>
          <p className="text-xs text-gray-400 truncate">{visionData.question}</p>
        </div>
      </div>

      {/* Content: Image + Analysis */}
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        {visionData.imageUrl && (
          <div className="md:w-2/5 p-4">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30">
              <img
                src={visionData.imageUrl}
                alt="Analyzed image"
                className="w-full h-auto object-contain max-h-64"
              />
            </div>
          </div>
        )}

        {/* Analysis */}
        <div className={`flex-1 p-4 ${visionData.imageUrl ? 'md:border-l border-white/5' : ''}`}>
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {visionData.analysis || 'Analyzing...'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-white/5">
        <span className="text-xs text-gray-500">Together AI · Llama 3.2 90B Vision</span>
      </div>
    </div>
  );
}
