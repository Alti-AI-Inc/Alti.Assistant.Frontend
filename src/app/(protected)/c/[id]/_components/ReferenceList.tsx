import { Reference } from '@/stores/useConverstionsStore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Globe, FileText } from 'lucide-react';

interface ReferencesProps {
  references: Reference[];
  webSearchQueries?: string[];
  searchEntryPoint?: any;
}

export default function ReferencesList({
  references,
  webSearchQueries,
}: ReferencesProps) {
  if (!references || references.length === 0) return null;

  const getDomain = (urlStr: string) => {
    try {
      const url = new URL(urlStr);
      return url.hostname.replace(/^www\./, '');
    } catch {
      return 'web';
    }
  };

  // Cap at top 5 sources to list cleanly in one row
  const displayReferences = references.slice(0, 5);

  return (
    <div className="w-full mt-3 mb-2 flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 select-none">
        Sources:
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        {displayReferences.map((ref, index) => {
          const isWeb = !!ref.url;
          const domain =
            ref.domain || (isWeb ? getDomain(ref.url!) : 'Document');
          const title =
            (ref as any).extractedTitle ||
            ref.title ||
            domain ||
            'Source';
          const faviconUrl = isWeb
            ? `https://www.google.com/s2/favicons?sz=64&domain=${domain}`
            : '';

          const pillContent = (
            <>
              <div className="w-3.5 h-3.5 rounded-[3px] overflow-hidden flex-shrink-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                {isWeb ? (
                  <img
                    src={faviconUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                          </svg>
                        `;
                      }
                    }}
                  />
                ) : (
                  <FileText className="w-2.5 h-2.5 text-zinc-400" />
                )}
              </div>
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[150px] group-hover:text-black dark:group-hover:text-white transition-colors">
                {domain}
              </span>
            </>
          );

          if (isWeb) {
            return (
              <Link
                key={index}
                href={ref.url!}
                target="_blank"
                rel="noopener noreferrer"
                title={title}
                className="group inline-flex items-center gap-1.5 px-2 py-1 rounded-[5px] bg-white dark:bg-zinc-900 border border-black/10 dark:border-zinc-800 hover:border-black/25 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all text-xs text-zinc-700 dark:text-zinc-300 shadow-xs"
              >
                {pillContent}
              </Link>
            );
          }

          return (
            <div
              key={index}
              title={ref.snippet || title}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-[5px] bg-white dark:bg-zinc-900 border border-black/10 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 shadow-xs cursor-default"
            >
              {pillContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}
