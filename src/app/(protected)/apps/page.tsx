'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { allTools } from '@/lib/all-tools';
import Image from 'next/image';
import { useMemo, useState } from 'react';

export default function AppIntegrationsGrid() {
  const [query, setQuery] = useState('');

  const filteredAndSorted = useMemo(() => {
    return allTools
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
        {filteredAndSorted.map(
          (tool: { title: string; description: string; image: string }) => (
            <div key={tool.title} className="h-full">
              <Card className="h-full cursor-pointer border border-gray-200 bg-gray-100 p-0 transition-all duration-200 hover:shadow-md">
                <CardContent className="flex flex-1 flex-col p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-white transition-all duration-200 group-hover:scale-105">
                      <Image
                        src={tool.image}
                        alt={tool.title}
                        width={50}
                        height={50}
                        className="size-9 object-contain"
                      />
                    </div>

                    <h3 className="text-xl font-medium text-gray-900">
                      {tool.title}
                    </h3>
                  </div>

                  <p className="mt-2 flex flex-1 flex-col text-sm text-gray-500">
                    {tool.description}
                  </p>
                  <Button className="mt-6 w-full" variant="outline">
                    Connect
                  </Button>
                </CardContent>
              </Card>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
