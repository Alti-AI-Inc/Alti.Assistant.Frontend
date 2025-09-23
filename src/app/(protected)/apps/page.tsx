'use client';

import { Input } from '@/components/ui/input';
import { allApps, APP } from '@/lib/all-apps';
import { useMemo, useState } from 'react';
import AppCard from './_components/AppCard';

export default function AppIntegrationsGrid() {
  const [query, setQuery] = useState('');

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
  return (
    <div className="p-8">
      <Input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search apps..."
        className="focus-visible:border-border h-10 max-w-md bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="mx-auto mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {filteredAndSorted.map((app: APP) => (
          <AppCard key={app.app_name} app={app} />
        ))}
      </div>
    </div>
  );
}
