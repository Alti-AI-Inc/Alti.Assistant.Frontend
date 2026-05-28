import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Reference } from '@/stores/useConverstionsStore';
import Link from 'next/link';

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
          <AccordionTrigger className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 dark:bg-zinc-900/50 dark:border-zinc-800 dark:hover:bg-zinc-900/80 transition-all duration-300 text-sm font-semibold tracking-wide text-zinc-300 dark:text-zinc-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus:no-underline hover:no-underline">
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
                <span>Sources & Intelligence Grounding</span>
                <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary-light font-bold dark:bg-emerald-500/10 dark:text-emerald-400 border border-primary/20 dark:border-emerald-500/20">
                  {references.length} verified
                </span>
              </div>
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 border border-black/5 dark:bg-zinc-900/60 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-teal-500/30"
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
                const domain = ref.domain || getDomain(ref.url);
                const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

                return (
                  <Link
                    key={index}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-start gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.01] hover:from-white/10 hover:to-white/5 border border-white/10 hover:border-white/20 dark:from-zinc-900/30 dark:to-zinc-950/20 dark:border-zinc-800/80 dark:hover:border-zinc-700/80 hover:-translate-y-1 shadow-lg shadow-black/5 hover:shadow-black/10 hover:shadow-primary/5 transition-all duration-300 ease-out overflow-hidden"
                  >
                    {/* Glowing highlight indicator */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 dark:via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Citation Number Badge */}
                    <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] font-bold border border-primary/20 dark:border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>

                    {/* Favicon & Content Container */}
                    <div className="flex-grow min-w-0 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded overflow-hidden bg-white/10 flex-shrink-0 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
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
                        </div>
                        <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 truncate group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors duration-200">
                          {domain}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <span className="text-xs font-semibold leading-relaxed text-zinc-200 dark:text-zinc-300 group-hover:text-white dark:group-hover:text-zinc-100 transition-colors duration-200 truncate">
                        {ref.title || ref.url}
                      </span>
                    </div>

                    {/* Arrow signifier */}
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
                  </Link>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
