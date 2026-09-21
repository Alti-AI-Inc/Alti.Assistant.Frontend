'use client';

import {
  createSpaceResearchAction,
  getSpaceResearchSessionsAction,
  SpaceResearchResult,
  SpaceResearchSession,
  SpaceResearchTurn,
} from '@/actions/spaceResearchActions';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ArrowUp, Loader2, Mic, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Streamdown } from 'streamdown';

interface SpeechRecognitionResultEvent {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    [index: number]: { transcript: string };
  }>;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

const getHostname = (url?: string) => {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const getResultTitle = (result: SpaceResearchResult) =>
  result.title?.trim() || getHostname(result.url) || 'Untitled source';

const SearchExchange = ({ turn }: { turn: SpaceResearchTurn }) => {
  const results = Array.isArray(turn.results) ? turn.results : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <div className="w-fit max-w-[85%] rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm leading-relaxed font-medium text-zinc-900 shadow-sm dark:bg-white dark:text-zinc-900">
          {turn.query}
        </div>
      </div>

      <div className="text-zinc-850 space-y-3 dark:text-zinc-200">
        {results.length === 0 ? (
          <p className="text-sm text-zinc-500 italic dark:text-zinc-400">
            No research results found for this query.
          </p>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              {results.map((result, idx) => (
                <a
                  key={idx}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-xl border border-black/10 bg-white p-3.5 shadow-sm transition-all duration-200 hover:border-indigo-400/60 hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
                >
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <span className="truncate text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                      {getHostname(result.url)}
                    </span>
                  </div>
                  <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                    {getResultTitle(result)}
                  </h3>
                  {result.summary && (
                    <p className="line-clamp-5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {result.summary}
                    </p>
                  )}
                </a>
              ))}
            </div>

            {results[0]?.summary && (
              <div className="rounded-xl border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-zinc-900/40">
                <Streamdown className="w-full text-sm leading-relaxed">
                  {results[0].summary}
                </Streamdown>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const SpaceResearchPanel = ({ spaceId }: { spaceId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session') || null;
  const shouldCreateResearch = searchParams?.get('createResearch') === '1';

  const [sessions, setSessions] = useState<SpaceResearchSession[]>([]);
  const [activeExchanges, setActiveExchanges] = useState<SpaceResearchTurn[]>(
    [],
  );
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const listEndRef = useRef<HTMLDivElement>(null);
  const selectedSession = sessions.find(
    session => (session.id || session._id) === sessionId,
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoadingList(true);
    getSpaceResearchSessionsAction(spaceId).then(result => {
      if (cancelled) return;
      if (result.success && Array.isArray(result.data)) {
        setSessions(result.data);
      } else if (!result.success) {
        toast.error(result.message || 'Failed to load research sessions');
      }
      setIsLoadingList(false);
    });
    return () => {
      cancelled = true;
    };
  }, [spaceId]);

  useEffect(() => {
    if (
      isLoadingList ||
      sessionId ||
      shouldCreateResearch ||
      sessions.length === 0
    ) {
      return;
    }

    const firstSessionId = sessions[0]?.id || sessions[0]?._id;
    if (!firstSessionId) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams?.toString() || '');
    nextParams.set('bot', spaceId);
    nextParams.set('section', 'research');
    nextParams.set('session', firstSessionId);
    router.replace(`/spaces?${nextParams.toString()}`);
  }, [
    isLoadingList,
    router,
    searchParams,
    sessions,
    shouldCreateResearch,
    sessionId,
    spaceId,
  ]);

  useEffect(() => {
    if (!sessionId) {
      setActiveExchanges([]);
      return;
    }

    setActiveExchanges(selectedSession?.searches || []);
  }, [selectedSession, sessionId]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeExchanges.length]);

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

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

      recognition.onresult = (event: SpeechRecognitionResultEvent) => {
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

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') stopListening();
      };

      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
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
          recognitionRef.current.stop();
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
      const result = await createSpaceResearchAction(
        spaceId,
        trimmed,
        shouldCreateResearch ? undefined : sessionId || undefined,
      );
      if (result.success && result.data) {
        const newTurn = result.data;
        if (!shouldCreateResearch && sessionId) {
          setActiveExchanges(prev => [...prev, newTurn]);
          setSessions(prev =>
            prev.map(session =>
              (session.id || session._id) === sessionId
                ? {
                    ...session,
                    searches: [...(session.searches || []), newTurn],
                  }
                : session,
            ),
          );
        } else {
          const newSessionId =
            newTurn.searchSession || newTurn.id || newTurn._id || '';
          const newSession: SpaceResearchSession = {
            id: newSessionId,
            _id: newSessionId,
            searches: [newTurn],
            createdAt: newTurn.createdAt,
            updatedAt: newTurn.updatedAt,
          };
          setActiveExchanges([newTurn]);
          setSessions(prev => [newSession, ...prev]);
          const nextParams = new URLSearchParams(
            searchParams?.toString() || '',
          );
          nextParams.set('bot', spaceId);
          nextParams.set('section', 'research');
          nextParams.set('session', newSessionId);
          nextParams.delete('createResearch');
          router.replace(`/spaces?${nextParams.toString()}`);
          window.dispatchEvent(
            new CustomEvent('space-research-created', {
              detail: { spaceId, session: newSession },
            }),
          );
        }
      } else {
        toast.error(result.message || 'Failed to run research');
        setQuery(trimmed);
      }
    } catch (err) {
      console.error('Space research failed', err);
      toast.error('Failed to run research');
      setQuery(trimmed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showAsEmpty =
    !isLoadingList &&
    !isSubmitting &&
    (shouldCreateResearch ||
      (sessions.length === 0 && activeExchanges.length === 0));

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
              <span className="text-xs font-semibold">Loading research...</span>
            </div>
          ) : showAsEmpty ? (
            <div className="flex flex-col items-center justify-center gap-2 text-center text-zinc-500 dark:text-zinc-400">
              <Search className="size-8 opacity-40" />
              <p className="text-sm font-medium">
                {sessionId
                  ? 'Research session not found.'
                  : 'Start a new research query in this space.'}
              </p>
              <p className="text-xs">
                Type a query below to run deep research in this space.
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
                  Researching...
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
              placeholder="Research anything in this space..."
              disabled={isSubmitting}
              style={{ backgroundColor: 'transparent' }}
              className="max-h-[160px] min-h-[36px] w-full flex-1 resize-none border-none bg-transparent px-1 py-1.5 text-gray-900 shadow-none outline-none placeholder:text-sm focus-visible:ring-0 dark:text-white"
            />
            <button
              type="button"
              onClick={query.trim() ? handleSubmit : toggleListening}
              disabled={isSubmitting}
              className={cn(
                'flex size-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-md border border-[#0000ff] bg-[#0000ff] text-white transition-all hover:bg-[#0000ff]/90 active:scale-95 focus:outline-none disabled:opacity-50',
                isListening &&
                  !query.trim() &&
                  'animate-pulse !border-red-600 !bg-red-600 text-white hover:!bg-red-700',
              )}
              aria-label={
                query.trim()
                  ? 'Send Research'
                  : isListening
                    ? 'Stop listening'
                    : 'Speech to Text'
              }
            >
              {query.trim() ? (
                <ArrowUp className="size-3.5 text-white" />
              ) : (
                <Mic className="size-3.5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceResearchPanel;
