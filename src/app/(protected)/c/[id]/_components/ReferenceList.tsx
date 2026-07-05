import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Reference } from '@/stores/useConverstionsStore';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ReferencesProps {
  references: Reference[];
  webSearchQueries?: string[];
  searchEntryPoint?: any;
}

export default function ReferencesList({ references, webSearchQueries, searchEntryPoint }: ReferencesProps) {
  if (!references || references.length === 0) return null;

  const getDomain = (urlStr: string) => {
    try {
      const url = new URL(urlStr);
      return url.hostname.replace('www.', '');
    } catch {
      return 'web';
    }
  };

  return (
    <div className="w-full mt-4 mb-6">
      <Accordion type="single" collapsible className="border-none">
        <AccordionItem value="references" className="border-none">
          <AccordionTrigger className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-black/10 hover:bg-zinc-50 dark:bg-zinc-900/50 dark:border-zinc-800 dark:hover:bg-zinc-900/80 transition-all duration-300 text-sm font-semibold tracking-wide text-zinc-800 dark:text-zinc-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus:no-underline hover:no-underline">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2050/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary animate-pulse"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>
                {references.length} {references.length === 1 ? 'Source' : 'Sources'}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-3 pb-1">
            {/* Active Search Intent pills */}
            {webSearchQueries && webSearchQueries.length > 0 && (
              <div className="flex flex-col gap-2 mb-4 px-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 dark:text-zinc-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                  Active Search Grounding Queries
                </span>
                <div className="flex flex-wrap gap-2">
                  {webSearchQueries.map((query, qIdx) => (
                    <div
                      key={qIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-black/10 dark:bg-zinc-900/60 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-300 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-teal-500/30"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-teal-600 dark:text-teal-400"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <span>{query}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {references.map((ref, index) => {
                const title = (ref as any).extractedTitle || ref.title || (ref as any).docId || 'Document Source';
                const getShortTitle = (raw: string) => {
                  if (!raw) return '';
                  let clean = raw.trim();
                  const words = clean.split(/\s+/);
                  if (words.length > 5) {
                    clean = words.slice(0, 5).join(' ');
                  }
                  if (clean.length > 32) {
                    clean = clean.substring(0, 32).trim();
                  }
                  return clean;
                };
                const shortTitle = getShortTitle(title);
                const isWeb = !!ref.url;
                const domain = ref.domain || (isWeb ? getDomain(ref.url) : 'Document');
                const faviconUrl = isWeb ? `https://www.google.com/s2/favicons?sz=64&domain=${domain}` : '';

                const cardContent = (
                  <>
                    {/* Glowing highlight indicator */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 dark:via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    


                    {/* Favicon & Content Container */}
                    <div className="flex-grow min-w-0 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded overflow-hidden bg-white/10 flex-shrink-0 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                          {isWeb ? (
                            <img
                              src={faviconUrl}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Safe fallback to globe SVG if loading fails
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400">
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <line x1="2" y1="12" x2="22" y2="12"></line>
                                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                    </svg>
                                  `;
                                }
                              }}
                            />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 truncate group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors duration-200">
                          {domain}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <span className="text-xs font-semibold leading-relaxed text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-200">
                        {shortTitle}
                      </span>
                      {/* Page number indicator for documents */}
                      {(ref as any).pageNumber && (
                        <span className="text-[9px] text-zinc-500 dark:text-zinc-400">
                          Page {(ref as any).pageNumber}
                        </span>
                      )}
                    </div>

                    {/* Arrow signifier for web */}
                    {isWeb && (
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 text-zinc-400 group-hover:text-primary dark:group-hover:text-emerald-400 transition-all duration-300 self-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    )}
                  </>
                );

                const cardClassName = "group relative flex items-start gap-3 p-3.5 rounded-2xl bg-white hover:bg-zinc-50 border border-black/10 hover:border-black/20 dark:bg-gradient-to-br dark:from-zinc-900/30 dark:to-zinc-950/20 dark:border-zinc-800/80 dark:hover:border-zinc-700/80 hover:-translate-y-1 shadow-lg shadow-black/5 hover:shadow-black/10 hover:shadow-primary/5 transition-all duration-300 ease-out overflow-hidden";

                if (isWeb) {
                  return (
                    <Link
                      key={index}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cardClassName}
                    >
                      {cardContent}
                    </Link>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className={cn(cardClassName, "hover:translate-y-0 cursor-default")}
                      title={ref.snippet}
                    >
                      {cardContent}
                    </div>
                  );
                }
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
