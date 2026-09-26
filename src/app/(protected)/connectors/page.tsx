'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Plug, Activity } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { ComposioAPI } from '@/lib/composio-client';

const FALLBACK_APPS = [
  {
    slug: 'github',
    name: 'GitHub',
    categories: ['DevTools'],
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
    description: 'Interact with GitHub repositories and issues.',
  },
  {
    slug: 'slack',
    name: 'Slack',
    categories: ['Communication'],
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/slack/slack-original.svg',
    description: 'Send and read messages in Slack.',
  },
  {
    slug: 'gmail',
    name: 'Gmail',
    categories: ['Productivity'],
    logo: 'https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_48dp.png',
    description: 'Manage emails in Gmail.',
  },
  {
    slug: 'googlecalendar',
    name: 'Google Calendar',
    categories: ['Productivity'],
    logo: 'https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png',
    description: 'Manage calendar events.',
  },
  {
    slug: 'jira',
    name: 'Jira',
    categories: ['Project Management'],
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg',
    description: 'Manage Jira issues.',
  },
  {
    slug: 'notion',
    name: 'Notion',
    categories: ['Productivity'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
    description: 'Manage Notion databases and pages.',
  },
];

export default function ConnectorsPage() {
  const [search, setSearch] = useState('');

  const { data: toolkitsData, isLoading: loadingToolkits } = useQuery({
    queryKey: ['composio-toolkits'],
    queryFn: () => ComposioAPI.listToolkits().then(res => res.data ?? null),
  });

  const { data: accountsData, isLoading: loadingAccounts } = useQuery({
    queryKey: ['composio-accounts'],
    queryFn: () =>
      ComposioAPI.listConnectedAccounts().then(res => res.data ?? null),
  });

  const apiToolkits = Array.isArray(toolkitsData?.items)
    ? toolkitsData.items
    : Array.isArray(toolkitsData)
      ? toolkitsData
      : [];
  const toolkits = apiToolkits.length > 0 ? apiToolkits : FALLBACK_APPS;

  const accounts = Array.isArray(accountsData?.items)
    ? accountsData.items
    : Array.isArray(accountsData)
      ? accountsData
      : [];

  const filteredToolkits = toolkits
    .filter((app: any) =>
      (app.name || app.slug || '').toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a: any, b: any) =>
      (a.name || a.slug || '').localeCompare(b.name || b.slug || ''),
    );

  const handleConnect = async (slug: string) => {
    try {
      const res = await ComposioAPI.initiateConnection({ appName: slug });
      if (res.data?.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      }
    } catch (e) {
      console.error('Failed to initiate connection:', e);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await ComposioAPI.revokeConnection(id);
      window.location.reload();
    } catch (e) {
      console.error('Failed to revoke connection:', e);
    }
  };

  return (
    <div className="dark:bg-gray-955 flex h-full flex-col overflow-hidden bg-[#e1e1e1]">
      <Tabs defaultValue="all-apps" className="flex h-full w-full flex-col">
        <div className="dark:bg-gray-955 flex h-[52px] flex-none items-center justify-between border-b border-black/10 bg-white px-8 dark:border-white/10">
          <div className="flex items-center">
            <h1 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
              Connectors
            </h1>
          </div>
          <div className="flex items-center">
            <TabsList className="h-auto gap-1 rounded-[5px] bg-gray-100 p-1 shadow-inner dark:bg-zinc-800/50">
              <TabsTrigger
                value="all-apps"
                className="rounded-[3px] px-4 py-1 text-xs font-bold text-gray-500 transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-white"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="connected-apps"
                className="rounded-[3px] px-4 py-1 text-xs font-bold text-gray-500 transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-white"
              >
                Connected
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-3">
          <div className="mx-auto max-w-7xl">
            <div className="relative mb-6">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="block w-full rounded-[5px] border-black/5 bg-white py-2.5 pr-4 pl-9 text-sm text-gray-900 shadow-md transition-all focus:ring-0 focus:outline-none dark:border-white/5 dark:bg-zinc-950/50 dark:text-white dark:placeholder:text-zinc-500"
                placeholder="Search connectors..."
              />
            </div>

            <TabsContent value="all-apps" className="m-0 h-full border-0 p-0">
              {loadingToolkits && apiToolkits.length === 0 ? (
                <p>Loading apps...</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {filteredToolkits.map((app: any) => (
                    <div
                      key={app.id || app.slug}
                      className="flex w-full items-center justify-between rounded-[5px] border border-black/5 bg-white px-5 py-2.5 shadow-md transition-all duration-300 hover:-translate-y-0.5 dark:border-white/5 dark:bg-zinc-950/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="dark:bg-gray-955 flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#e1e1e1] p-1.5 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                          {app.logo ? (
                            <img
                              src={app.logo}
                              alt={app.name}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Plug className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                            {app.name}
                          </h3>
                        </div>
                      </div>
                      <button
                        onClick={() => handleConnect(app.slug)}
                        className="h-8 w-[100px] shrink-0 rounded-[3px] bg-black text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 dark:bg-white dark:text-black"
                      >
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="connected-apps"
              className="m-0 h-full border-0 p-0"
            >
              {loadingAccounts ? (
                <p>Loading accounts...</p>
              ) : accounts.length === 0 ? (
                <div className="rounded-[5px] bg-white p-12 text-center shadow-md dark:bg-zinc-950/50">
                  <p className="text-gray-500">No connected apps yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {accounts.map((acc: any) => (
                    <div
                      key={acc.id}
                      className="flex w-full items-center justify-between rounded-[5px] border border-black/5 bg-white px-5 py-2.5 shadow-md transition-all duration-300 hover:-translate-y-0.5 dark:border-white/5 dark:bg-zinc-950/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-green-50 p-1.5 shadow-sm ring-1 ring-green-500/10 dark:bg-green-900/20 dark:ring-green-500/20">
                          <Activity className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                            {acc.app?.name || acc.appId || 'Integration'}
                          </h3>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRevoke(acc.id)}
                        className="h-8 w-[100px] shrink-0 rounded-[3px] bg-red-600 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 dark:bg-red-700"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
