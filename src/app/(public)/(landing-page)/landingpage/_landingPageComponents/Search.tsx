'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import InfoBoxesContainer from './InfoBoxesContainer';

interface Reference {
  url: string;
  domain: string;
  title: string;
}

interface AssistantV2Response {
  statusCode: number;
  success: boolean;
  message: string;
  data?: any;
}

const extractAnswer = (responseMessage: any): string => {
  if (!responseMessage) return '';
  if (typeof responseMessage === 'string') return responseMessage;
  return (
    responseMessage.answer ||
    responseMessage.reply ||
    responseMessage.response ||
    responseMessage.message ||
    responseMessage.text ||
    ''
  );
};

const extractReferences = (responseMessage: any): Reference[] => {
  if (!responseMessage || typeof responseMessage !== 'object') return [];
  const refs = responseMessage.reference || responseMessage.references;
  if (Array.isArray(refs) && refs.length > 0) return refs;
  if (Array.isArray(responseMessage.citations)) {
    return responseMessage.citations.map((citation: any) => ({
      url: citation.url,
      domain: citation.domain,
      title: citation.title || citation.domain,
    }));
  }
  return [];
};

const normalizeResponse = (payload: AssistantV2Response) => {
  const responseData = payload.data ?? payload;
  return responseData.responseMessage ?? responseData;
};

const Search = ({ className }: { className?: string }) => {
  const [query, setQuery] = useState(
    'What is the current price of gold (XAU/USD)?',
  );
  const [answer, setAnswer] = useState('');
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setAnswer('');
    setReferences([]);

    if (!query.trim()) {
      setError('Please enter a question to search.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/search/assistant_v2`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: query.trim(),
            deepSearch: false,
          }),
        },
      );

      const text = await response.text();
      let payload: AssistantV2Response;

      try {
        payload = JSON.parse(text) as AssistantV2Response;
      } catch {
        throw new Error(text || `Request failed with status ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(
          payload.message || `Request failed with status ${response.status}`,
        );
      }

      if (!payload.success) {
        throw new Error(payload.message || 'Search API returned unsuccessful result.');
      }

      const normalized = normalizeResponse(payload);
      const extractedAnswer = extractAnswer(normalized);
      const extractedReferences = extractReferences(normalized);

      if (!extractedAnswer) {
        throw new Error(
          'Search API returned an empty answer. Please check the backend response format.',
        );
      }

      setAnswer(extractedAnswer);
      setReferences(extractedReferences);
    } catch (err: any) {
      setError(err?.message || 'Unable to fetch search results.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        id="features"
        className={cn(
          'mx-auto flex w-full max-w-(--breakpoint-xl) items-center px-5 py-10 lg:px-0 lg:pt-0 lg:pb-20',
          className,
        )}
      >
        <div className="flex w-full flex-col-reverse items-center justify-between gap-10 lg:flex-row">
          <div className="mt-10 flex w-full justify-center lg:mb-0 lg:w-1/2 lg:-translate-x-10 lg:justify-start">
            <Image
              height={400}
              width={1200}
              alt="Our mission image"
              src="/assets/our-mission.png"
            />
          </div>

          <div className="flex w-full flex-col gap-8 lg:w-1/2 lg:justify-end">
            <div className="rounded-[32px] border border-slate-200/70 bg-white/90 p-8 shadow-xl shadow-slate-200/10 backdrop-blur dark:border-slate-700/70 dark:bg-slate-950/85">
              <div className="mb-6 space-y-3">
                <p className="text-sm font-semibold tracking-[0.24em] text-sky-700 uppercase">
                  Live Search
                </p>
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
                  Ask anything from the web with citations.
                </h2>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                  This widget sends your query to the `/search/assistant_v2` API
                  and displays the AI answer with source references.
                </p>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                <Textarea
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Ask a question, e.g. What is the current price of gold (XAU/USD)?"
                  className="min-h-[140px]"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Searching…' : 'Search'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setQuery('');
                      setAnswer('');
                      setReferences([]);
                      setError('');
                    }}
                  >
                    Clear
                  </Button>
                </div>
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
              </form>

              {answer ? (
                <div className="mt-8 space-y-6 rounded-[24px] border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700/80 dark:bg-slate-900">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Answer
                    </h3>
                    <p className="pt-3 text-sm leading-7 whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                      {answer}
                    </p>
                  </div>

                  {references.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        References
                      </h3>
                      <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                        {references.map(reference => (
                          <li
                            key={reference.url}
                            className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-700/80 dark:bg-slate-950"
                          >
                            <a
                              href={reference.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium text-slate-900 transition hover:text-sky-700 dark:text-slate-100 dark:hover:text-sky-400"
                            >
                              {reference.title || reference.domain}
                            </a>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {reference.domain}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="flex w-full justify-center lg:justify-end">
              <InfoBoxesContainer
                title="Search"
                box1Title="Web Search"
                box1Desc="Real-time answers from the open web, enriched with verified and trusted sources."
                box2Title="Deep Research"
                box2Desc="In depth analysis across multiple online sources to deliver comprehensive, citation backed intelligence."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
