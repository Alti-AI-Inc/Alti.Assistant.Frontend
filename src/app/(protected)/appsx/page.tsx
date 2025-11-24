'use client';

import { Input } from '@/components/ui/input';
import { useConnectionsQuery } from '@/hooks/useConnectApps';
import { allApps, APP } from '@/lib/all-apps';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import AppCard from './_components/AppCard';

export default function AppIntegrationsGrid() {
  const [query, setQuery] = useState('');
  const { data: session } = useSession();

  const { data: connections, isLoading } = useConnectionsQuery(
    session?.accessToken,
  );

  const filteredAndSorted = useMemo(() => {
    return allApps
      .filter(
        app =>
          app.title.toLowerCase().includes(query.toLowerCase()) &&
          app.isAvailable,
        // || app.description.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [query]);

  const connectedSlugs = useMemo(() => {
    if (isLoading || !connections?.length) return new Set();

    return new Set(
      connections
        .filter(c => c.status === 'ACTIVE')
        .map(c => c.toolkit?.slug),
    );
  }, [connections, isLoading]);

  return (
    <div className="p-8">
      <Input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search apps..."
        className="focus-visible:border-border h-10 max-w-md bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="mx-auto mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAndSorted.map((app: APP) => (
          <AppCard
            key={app.app_name}
            app={app}
            isAlreadyConnected={connectedSlugs.has(app.app_name)}
          />
        ))}
      </div>
    </div>
  );
}
