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
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-zinc-950 p-6 md:p-10 space-y-10 relative overflow-hidden transition-colors duration-300">
      {/* Glassmorphic Hero Banner */}
      <div className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-8 md:p-12 shadow-xl overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 dark:bg-slate-800/40 rounded-full translate-x-12 -translate-y-12 blur-2xl pointer-events-none" />
        
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-850 dark:text-slate-200 border border-slate-200/55 dark:border-slate-700/60 shadow-sm">
            <Zap className="size-3.5 text-indigo-500 dark:text-indigo-400 fill-indigo-500/20" />
            <span>Enterprise Systems Authorized</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Enterprise Integration <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">Gateway</span>
            </h1>
            <p className="text-lg text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
              Securely orchestrate enterprise platforms with PII/PHI redaction and automated compliance verification.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search all applications..."
                className="h-12 w-full pl-4 pr-10 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus-visible:ring-1 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:border-transparent transition-all shadow-sm"
              />
            </div>
            {/* Stats Indicator */}
            <div className="flex items-center gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-0 sm:pl-6 h-8">
              <span>Total Available: <strong className="text-slate-800 dark:text-slate-250">{resolvedApps.length}</strong></span>
              <span>Connected: <strong className="text-emerald-600 dark:text-emerald-450">{connectedSlugs.size}</strong></span>
            </div>
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

