'use client';
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import WidgetContainer from './WidgetContainer';

export interface ImageData {
  prompt?: string;
  imageUrl?: string;
}

export default function ImageWidget({ imageData }: { imageData?: ImageData }) {
  if (!imageData || !imageData.imageUrl) return null;

  return (
    <WidgetContainer 
      icon={ImageIcon} 
      iconColorClass="text-fuchsia-400" 
      iconBgClass="bg-fuchsia-500/10" 
      title="Generated Image" 
      subtitle={imageData.prompt || 'AI Image Generation'}
    >
      <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageData.imageUrl} alt={imageData.prompt || 'Generated AI Image'} className="w-full h-auto object-cover" />
      </div>
    </WidgetContainer>
  );
}
