'use client';

import {
  createSpaceSearchAction,
  getSpaceSearchesAction,
  SpaceSearchResult,
  SpaceSearchSession,
  SpaceSearchTurn,
} from '@/actions/spaceSearchActions';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ArrowUp, Loader2, Mic, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Streamdown } from 'streamdown';

type SpeechRecognitionInstance = {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onstart?: () => void;
  onresult?: (event: {
    resultIndex: number;
    results: Array<{ isFinal: boolean; [key: number]: { transcript: string } }>;
  }) => void;
  onerror?: (event: { error?: string }) => void;
  onend?: () => void;
  start?: () => void;
  stop?: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

const getHostname = (url?: string) => {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

// Removed unused helper `getResultTitle` to satisfy linting (no UI change).

const SourceFavicon = ({ result }: { result: SpaceSearchResult }) => {
  const hostname = getHostname(result.url);
  return result.favicon ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={result.favicon}
      alt=""
      className="size-4 flex-shrink-0 rounded-sm"
      onError={e => {
        (e.target as HTMLImageElement).style.visibility = 'hidden';
      }}
    />
  ) : (
    <div className="flex size-4 flex-shrink-0 items-center justify-center rounded-sm bg-zinc-300 text-[8px] font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
      {hostname.charAt(0).toUpperCase() || '?'}
    </div>
  );
};

const SearchExchange = ({ turn }: { turn: SpaceSearchTurn }) => {
  const results = Array.isArray(turn.results) ? turn.results : [];

  return (
    <div className="space-y-4">
      {/* User query bubble - mirrors the main chat's user message style */}
      <div className="flex items-center justify-end">
        <div className="w-fit max-w-[85%] rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm leading-relaxed font-medium text-zinc-900 shadow-sm dark:bg-white dark:text-zinc-900">
          {turn.query}
        </div>
      </div>

      {/* Answer / results - mirrors the main chat's assistant style */}
      <div className="text-zinc-850 space-y-3 dark:text-zinc-200">
        {results.length === 0 ? (
          <p className="text-sm text-zinc-500 italic dark:text-zinc-400">
            No results found for this query.
          </p>
        ) : (
          <>
            {/* Synthesized answer from the top result's summary */}
            {results[0]?.summary && (
              <div className="rounded-xl border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-zinc-900/40">
                <Streamdown className="w-full text-sm leading-relaxed">
                  {results[0].summary}
                </Streamdown>
              </div>
            )}
            {/* Sources row */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="flex-shrink-0 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                Sources
              </span>
              {results.map((result, idx) => (
                <a
                  key={idx}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600 transition-colors hover:border-indigo-400/60 hover:text-indigo-600 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  <SourceFavicon result={result} />
                  <span className="max-w-[120px] truncate">
                    {getHostname(result.url)}
                  </span>
                </a>
              ))}
            </div>

            {/* Result cards */}
            {/* <div className="grid gap-3 sm:grid-cols-2">
              {results.map((result, idx) => (
                <a
                  key={idx}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-xl border border-black/10 bg-white p-3.5 shadow-sm transition-all duration-200 hover:border-indigo-400/60 hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
                >
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <SourceFavicon result={result} />
                    <span className="truncate text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                      {getHostname(result.url)}
                    </span>
                  </div>
                  <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                    {getResultTitle(result)}
                  </h3>
                  {result.summary && (
                    <p className="line-clamp-4 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {result.summary}
                    </p>
                  )}
                </a>
              ))}
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};

const SpaceSearchPanel = ({ spaceId }: { spaceId: string }) => {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session') || null;

  const [sessions, setSessions] = useState<SpaceSearchSession[]>([]);
  const [activeExchanges, setActiveExchanges] = useState<SpaceSearchTurn[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingList(true);
    getSpaceSearchesAction(spaceId).then(result => {
      if (cancelled) return;
      if (result.success && Array.isArray(result.data)) {
        setSessions(result.data);
      } else if (!result.success) {
        toast.error(result.message || 'Failed to load searches');
      }
      setIsLoadingList(false);
    });
    return () => {
      cancelled = true;
    };
  }, [spaceId]);

  // Show only the active session's turns, not the whole space history
  useEffect(() => {
    if (!sessionId) {
      setActiveExchanges([]);
      return;
    }
    const match = sessions.find(s => (s.id || s._id) === sessionId);
    setActiveExchanges(match?.searches || []);
  }, [sessionId, sessions]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeExchanges.length]);

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current?.stop?.();
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const startListening = () => {
    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

    const SpeechRecognition =
      win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error(
        'Speech recognition is not supported in this browser. Please try Chrome, Safari, or Edge.',
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event: {
        resultIndex: number;
        results: Array<{
          isFinal: boolean;
          [key: number]: { transcript: string };
        }>;
      }) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        const text = finalTranscript + interimTranscript;
        if (text.trim()) setQuery(text);
      };

      recognition.onerror = (event: { error?: string }) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') stopListening();
      };

      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start?.();
    } catch (err) {
      console.error('Failed to start SpeechRecognition:', err);
      setIsListening(false);
    }
  };

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current?.stop?.();
        } catch (err) {
          console.error(err);
        }
      }
    };
  }, []);

  const handleSubmit = async () => {
    const trimmed = query.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    setQuery('');
    try {
      const result = await createSpaceSearchAction(
        spaceId,
        trimmed,
        sessionId || undefined,
      );
      if (result.success && result.data) {
        const newTurn = result.data;
        if (sessionId) {
          // Continuing an existing session: append this turn to the current view
          setActiveExchanges(prev => [...prev, newTurn]);
          setSessions(prev =>
            prev.map(s =>
              (s.id || s._id) === sessionId
                ? { ...s, searches: [...(s.searches || []), newTurn] }
                : s,
            ),
          );
        } else {
          // Brand new session: seed the view and let the sidebar know
          const newSessionId =
            newTurn.searchSession || newTurn.id || newTurn._id || '';
          const newSession: SpaceSearchSession = {
            id: newSessionId,
            _id: newSessionId,
            searches: [newTurn],
            createdAt: newTurn.createdAt,
          };
          setActiveExchanges([newTurn]);
          setSessions(prev => [newSession, ...prev]);
          window.history.pushState(
            null,
            '',
            `/spaces?bot=${spaceId}&session=${newSessionId}`,
          );
          window.dispatchEvent(
            new CustomEvent('space-search-created', {
              detail: { spaceId, session: newSession },
            }),
          );
        }
      } else {
        toast.error(result.message || 'Failed to run search');
        setQuery(trimmed);
      }
    } catch (err) {
      console.error('Space search failed', err);
      toast.error('Failed to run search');
      setQuery(trimmed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showAsEmpty =
    !isLoadingList && !isSubmitting && activeExchanges.length === 0;

  return (
    <div
      className={cn(
        'relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#e1e1e1] dark:bg-zinc-950',
        showAsEmpty && 'items-center pt-[30vh]',
      )}
    >
      <div
        className={cn(
          'relative min-h-0 overflow-y-auto px-4 sm:px-6 lg:px-8',
          showAsEmpty ? 'w-full flex-none' : 'flex-grow py-6',
        )}
      >
        <div className="mx-auto flex w-full max-w-[820px] flex-col gap-8">
          {isLoadingList ? (
            <div className="flex items-center justify-center gap-2.5 py-10 text-zinc-500 dark:text-zinc-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500/10 border-t-indigo-500" />
              <span className="text-xs font-semibold">Loading searches...</span>
            </div>
          ) : showAsEmpty ? (
            <div className="flex flex-col items-center justify-center gap-2 text-center text-zinc-500 dark:text-zinc-400">
              <Search className="size-8 opacity-40" />
              <p className="text-sm font-medium">
                {sessionId
                  ? 'Session not found.'
                  : 'Start a new search in this space.'}
              </p>
              <p className="text-xs">
                Type a query below to search this space.
              </p>
            </div>
          ) : (
            activeExchanges.map((turn, idx) => (
              <SearchExchange key={turn.id || turn._id || idx} turn={turn} />
            ))
          )}

          <div ref={listEndRef} />
        </div>
      </div>

      {isSubmitting ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[64px] z-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] bg-white/70 p-3 shadow-sm backdrop-blur-sm dark:bg-zinc-950/60">
            <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <Loader2 className="size-4 animate-spin text-indigo-500" />
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Searching...
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          'w-full shrink-0 px-4 transition-all duration-300 sm:px-6 lg:px-8',
          !showAsEmpty
            ? 'mt-auto flex h-[64px] items-center justify-center border-t border-black/10 bg-[#e1e1e1] pt-0 pb-0 dark:border-zinc-800/60 dark:bg-zinc-950'
            : 'border-t-0 bg-transparent pt-3 pb-0',
        )}
      >
        <div className="mx-auto w-full max-w-[796px]">
          <div className="relative flex min-h-[52px] w-full items-center gap-3 rounded-xl border border-zinc-300 bg-white px-3 py-1.5 shadow-xs transition-all duration-300 dark:border-zinc-700/80 dark:bg-zinc-800">
            <Textarea
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Search anything in this space..."
              disabled={isSubmitting}
              style={{ backgroundColor: 'transparent' }}
              className="max-h-[160px] min-h-[36px] w-full flex-1 resize-none border-none bg-transparent px-1 py-1.5 text-gray-900 shadow-none outline-none placeholder:text-sm focus-visible:ring-0 dark:text-white"
            />
            <button
              type="button"
              onClick={query.trim() ? handleSubmit : toggleListening}
              disabled={isSubmitting}
              className={cn(
                'flex size-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-md border border-black/5 bg-[#e1e1e1] text-zinc-800 transition-all hover:bg-[#d0d0d0] focus:outline-none disabled:opacity-50 dark:border-zinc-700/50 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900',
                isListening &&
                  !query.trim() &&
                  'animate-pulse bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700',
              )}
              aria-label={
                query.trim()
                  ? 'Send Search'
                  : isListening
                    ? 'Stop listening'
                    : 'Speech to Text'
              }
            >
              {query.trim() ? (
                <ArrowUp className="size-3.5" />
              ) : (
                <Mic className="size-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceSearchPanel;
