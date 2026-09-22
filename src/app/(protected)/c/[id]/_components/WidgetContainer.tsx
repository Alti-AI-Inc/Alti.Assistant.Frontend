'use client';
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface WidgetContainerProps {
  icon: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function WidgetContainer({ 
  icon: Icon, 
  iconColorClass = 'text-primary', 
  iconBgClass = 'bg-primary/10',
  title, 
  subtitle, 
  children 
}: WidgetContainerProps) {
  return (
    <div className="relative my-4 w-full overflow-hidden rounded-2xl border border-[#2b2f3a] bg-[#11141c] text-[#d1d4dc] shadow-2xl transition-all duration-300 hover:border-primary/40 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center space-x-3 border-b border-[#2b2f3a] bg-[#171b26] px-6 py-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBgClass} ${iconColorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-wide text-white">{title}</h3>
          <p className="text-xs text-zinc-400">{subtitle}</p>
        </div>
      </div>
      <div className="p-4 sm:p-6 w-full overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
