'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const COMPOSIO_APPS = [
  { id: 'github', name: 'GitHub', category: 'DevTools', icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22', color: '#181717' },
  { id: 'slack', name: 'Slack', category: 'Communication', icon: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z', color: '#4A154B' },
  { id: 'gmail', name: 'Gmail', category: 'Productivity', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6', color: '#EA4335' },
  { id: 'google_calendar', name: 'Google Calendar', category: 'Productivity', icon: 'M3 4h18v16H3V4zm0 4h18M8 2v4m8-4v4', color: '#4285F4' },
  { id: 'jira', name: 'Jira', category: 'Project Management', icon: 'M2 2h20v20H2z M10 6h4v12h-4z', color: '#0052CC' },
  { id: 'linear', name: 'Linear', category: 'Project Management', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', color: '#5E6AD2' },
  { id: 'notion', name: 'Notion', category: 'Productivity', icon: 'M4 4h16v16H4z M4 8h16 M8 4v16', color: '#000000' },
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z', color: '#00A1E0' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z M12 6v6l4 2', color: '#FF7A59' },
  { id: 'zendesk', name: 'Zendesk', category: 'Customer Support', icon: 'M12 2L2 22h20L12 2zm0 6l6 14H6l6-14z', color: '#03363D' },
  { id: 'discord', name: 'Discord', category: 'Communication', icon: 'M20.31 7.12A14.38 14.38 0 0 0 16.64 4.5 10.3 10.3 0 0 0 16 6.33a15.26 15.26 0 0 0-8 0 10.3 10.3 0 0 0-.64-1.83 14.38 14.38 0 0 0-3.67 2.62C.81 12.33-.28 17.38.07 22a14.53 14.53 0 0 0 4.4 2.25 10.73 10.73 0 0 0 1-1.63 9.4 9.4 0 0 1-1.57-.75c.13-.1.25-.2.37-.3a10.15 10.15 0 0 0 15.46 0c.12.1.24.2.37.3a9.4 9.4 0 0 1-1.57.75 10.73 10.73 0 0 0 1 1.63 14.53 14.53 0 0 0 4.4-2.25c.42-5.32-.97-10.3-3.62-14.88zM8.5 16.5c-1.1 0-2-.94-2-2.1s.88-2.1 2-2.1 2 .94 2 2.1-.9 2.1-2 2.1zm7 0c-1.1 0-2-.94-2-2.1s.88-2.1 2-2.1 2 .94 2 2.1-.9 2.1-2 2.1z', color: '#5865F2' },
  { id: 'google_drive', name: 'Google Drive', category: 'Storage', icon: 'M12 2L2 20h20L12 2zm0 4l7 12H5l7-12z', color: '#4285F4' },
];

export default function ConnectorsPage() {
  return (
    <div className="flex h-full flex-col bg-[#e1e1e1] dark:bg-gray-955 overflow-hidden">
      <div className="flex h-[52px] flex-none items-center justify-between border-b border-black/10 bg-white px-8 dark:border-white/10 dark:bg-gray-955">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">Connectors</h1>
        
        {/* Search */}
        <div className="relative w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-[#1a1a1e] dark:text-white dark:ring-white/10 dark:placeholder:text-zinc-500"
            placeholder="Search integrations..."
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Composio Integrations</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Authenticate Aphura Cloud with your external tools. Connect your accounts below to give the system secure access to your APIs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {COMPOSIO_APPS.map((app) => (
              <Card key={app.id} className="flex flex-col rounded-xl border-black/5 bg-white shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-zinc-950/50">
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="flex h-12 w-12 items-center justify-center rounded-lg shadow-sm"
                      style={{ backgroundColor: `${app.color}15` }} // 15% opacity background
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={app.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d={app.icon} />
                      </svg>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-white/5 dark:text-gray-400 dark:ring-white/10">
                      {app.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{app.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    Connect to {app.name} to allow Aphura agents to read, write, and execute workflows natively.
                  </p>
                </div>
                <div className="border-t border-gray-100 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-black/20">
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-sm transition-all active:scale-95">
                    Connect {app.name}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
