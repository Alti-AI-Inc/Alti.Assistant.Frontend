'use client';
import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface InlineCitationProps {
  index: number;
  title?: string;
  url?: string;
  snippet?: string;
  source?: string;
}

export default function InlineCitation({ index, title, url, snippet, source }: InlineCitationProps) {
  const [showCard, setShowCard] = useState(false);

  const domain = url && url !== 'local://exa'
    ? (() => { try { return new URL(url).hostname.replace('www.', ''); } catch { return source || 'Source'; } })()
    : source || 'Source';

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShowCard(true)}
      onMouseLeave={() => setShowCard(false)}
      onClick={() => setShowCard(prev => !prev)}
    >
      <button
        type="button"
        className="inline-flex items-center justify-center size-[18px] rounded-full bg-[#0000ff]/10 dark:bg-[#0000ff]/20 text-[#0000ff] dark:text-blue-400 text-[10px] font-bold leading-none hover:bg-[#0000ff]/20 dark:hover:bg-[#0000ff]/30 transition-colors cursor-pointer align-super -mx-px"
        onClick={() => {
          if (url && !url.startsWith('local://')) {
            window.open(url, '_blank', 'noopener,noreferrer');
          }
        }}
        aria-label={`Citation ${index}`}
      >
        {index}
      </button>
      
      {showCard && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-72 animate-in fade-in zoom-in-95 duration-150">
          <div className="rounded-xl border border-white/10 bg-zinc-900 shadow-2xl p-3 text-left">
            <div className="flex items-start gap-2 mb-1.5">
              {url && !url.startsWith('local://') && (
                <img
                  src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                  alt=""
                  className="size-4 rounded mt-0.5 shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {title || domain}
                </p>
                <p className="text-[10px] text-zinc-500 truncate">{domain}</p>
              </div>
              {url && !url.startsWith('local://') && (
                <ExternalLink className="size-3 text-zinc-500 shrink-0 mt-0.5" />
              )}
            </div>
            {snippet && (
              <p className="text-[11px] text-zinc-400 leading-snug line-clamp-3">
                {snippet}
              </p>
            )}
          </div>
        </div>
      )}
    </span>
  );
}
