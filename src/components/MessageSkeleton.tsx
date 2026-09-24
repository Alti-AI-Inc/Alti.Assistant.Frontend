'use client';

/**
 * Animated skeleton loader shown while waiting for the AI response to start streaming.
 * Matches the conversation message layout for seamless visual continuity.
 */
export function MessageSkeleton() {
  return (
    <div className="flex gap-3 py-4 animate-pulse" aria-label="Loading response...">
      {/* Avatar placeholder */}
      <div className="h-8 w-8 shrink-0 rounded-full bg-white/5" />
      <div className="flex flex-1 flex-col gap-2.5 pt-1">
        {/* Title bar */}
        <div className="h-3.5 w-24 rounded bg-white/5" />
        {/* Content lines */}
        <div className="h-3 w-full rounded bg-white/[0.04]" />
        <div className="h-3 w-5/6 rounded bg-white/[0.04]" />
        <div className="h-3 w-3/4 rounded bg-white/[0.04]" />
        <div className="h-3 w-2/3 rounded bg-white/[0.04]" />
      </div>
    </div>
  );
}

/**
 * Inline thinking/tool indicator shown while the agent is processing.
 */
export function ThinkingIndicator({ status }: { status?: string }) {
  return (
    <div className="flex items-center gap-2 py-2 text-xs text-white/40">
      <div className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/30" style={{ animationDelay: '0ms' }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/30" style={{ animationDelay: '150ms' }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/30" style={{ animationDelay: '300ms' }} />
      </div>
      <span>{status || 'Thinking...'}</span>
    </div>
  );
}

export default MessageSkeleton;
