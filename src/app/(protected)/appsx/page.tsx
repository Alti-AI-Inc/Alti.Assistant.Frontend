'use client';

import { Input } from '@/components/ui/input';
import { useConnectionsQuery } from '@/hooks/useConnectApps';
import { allApps, APP } from '@/lib/all-apps';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import AppCard from './_components/AppCard';
import { Layers, ShieldCheck, Zap } from 'lucide-react';

export default function AppIntegrationsGrid() {
  const [query, setQuery] = useState('');
  const { data: session } = useSession();

  const { data: connections, isLoading } = useConnectionsQuery(
    session?.accessToken,
  );

  // De-duplicate and parse apps
  const resolvedApps = useMemo(() => {
    const uniqueMap = new Map<string, APP>();
    allApps.forEach(app => {
      if (app.isAvailable && app.app_name) {
        const slug = app.app_name.toLowerCase();
        if (!uniqueMap.has(slug)) {
          uniqueMap.set(slug, app);
        }
      }
    });
    return Array.from(uniqueMap.values());
  }, []);

  const connectedSlugs = useMemo(() => {
    if (isLoading || !connections?.length) return new Set<string>();
    return new Set(
      connections.filter(c => c.status === 'ACTIVE').map(c => c.toolkit?.slug),
    );
  }, [connections, isLoading]);

  // Filter and sort all apps alphabetically in a single unified list
  const filteredAndSortedApps = useMemo(() => {
    return resolvedApps
      .filter(app => app.title.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
  }, [resolvedApps, query]);

  return (
    <div className="h-full overflow-y-auto bg-[#e1e1e1] dark:bg-zinc-950 p-6 md:p-10 space-y-8 relative transition-colors duration-300">
      {/* Sticky Solid Header Shelf */}
      <div className="sticky top-0 z-20 -mx-6 md:-mx-10 -mt-6 md:-mt-10 px-6 md:px-10 pt-6 md:pt-10 pb-4 bg-[#e1e1e1] dark:bg-zinc-950 transition-colors duration-300">
        <div className="relative w-full rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-2 flex items-center justify-between">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search all applications..."
            className="h-12 w-full md:max-w-2xl px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border-none text-slate-900 dark:text-white focus-visible:ring-0 focus-visible:border-transparent shadow-none"
          />
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400 pr-4">
            <span>Total Available: <strong className="text-slate-800 dark:text-slate-250">{resolvedApps.length}</strong></span>
            <span>Connected: <strong className="text-emerald-600 dark:text-emerald-450">{connectedSlugs.size}</strong></span>
          </div>
        </div>
      </div>

      {/* Unified Alphabetical Grid */}
      {filteredAndSortedApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedApps.map((app: APP) => (
            <AppCard
              key={app.app_name}
              app={app}
              isAlreadyConnected={connectedSlugs.has(app.app_name)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-white/40 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl backdrop-blur-sm">
          <Layers className="mx-auto size-12 text-slate-350 dark:text-slate-600 animate-pulse" />
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No applications found</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Try adjusting your search keywords or switching filters to uncover other integrations.
          </p>
        </div>
      )}
    </div>
  );
}

