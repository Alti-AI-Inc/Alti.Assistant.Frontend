'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppsPanelStore } from '@/stores/useAppsPanelStore';
import { Package, Search, Zap } from 'lucide-react';
import { useState } from 'react';
import ColumnPanel from './ColumnPanel';
import DataQueryInterface from './DataQueryInterface';

interface App {
  id: string;
  name: string;
  category: 'productivity' | 'communication' | 'analytics' | 'other';
  status: 'active' | 'inactive';
}

interface AvailableApp {
  id: string;
  name: string;
  category: 'productivity' | 'communication' | 'analytics' | 'other';
  icon: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
}

const DEFAULT_APPS: App[] = [
  {
    id: '1',
    name: 'Slack Integration',
    category: 'communication',
    status: 'active',
  },
  {
    id: '2',
    name: 'Google Analytics',
    category: 'analytics',
    status: 'active',
  },
  {
    id: '3',
    name: 'Zapier Workflow',
    category: 'productivity',
    status: 'inactive',
  },
];

const AVAILABLE_APPS_TO_CONNECT: AvailableApp[] = [
  {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    icon: '💬',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'communication',
    icon: '👥',
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'communication',
    icon: '🎮',
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'productivity',
    icon: '🐙',
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    icon: '📝',
  },
  {
    id: 'jira',
    name: 'Jira',
    category: 'productivity',
    icon: '🔧',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'analytics',
    icon: '💳',
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    category: 'analytics',
    icon: '📊',
  },
];

export const AppsPanelsContainer = () => {
  const store = useAppsPanelStore();
  const [apps, setApps] = useState<App[]>(DEFAULT_APPS);
  const [selectedAppId, setSelectedAppId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistoryByApp, setChatHistoryByApp] = useState<
    Record<string, ChatMessage[]>
  >({});

  const filteredAvailableApps = AVAILABLE_APPS_TO_CONNECT.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleConnectApp = (appToConnect: AvailableApp) => {
    const newApp: App = {
      id: appToConnect.id,
      name: appToConnect.name,
      category: appToConnect.category,
      status: 'active',
    };

    // Check if app already exists
    if (!apps.find(a => a.id === appToConnect.id)) {
      setApps([newApp, ...apps]);
      setSelectedAppId(newApp.id);
      // Initialize chat history for this app
      setChatHistoryByApp(prev => ({
        ...prev,
        [newApp.id]: [],
      }));
    }
  };

  const handleAddMessage = (message: { type: string; content: string }) => {
    if (!selectedAppId) return;

    const chatMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: message.type === 'question' ? 'user' : 'bot',
      content: message.content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setChatHistoryByApp(prev => ({
      ...prev,
      [selectedAppId]: [...(prev[selectedAppId] || []), chatMessage],
    }));
  };

  const handleNewChat = () => {
    if (!selectedAppId) return;
    setChatHistoryByApp(prev => ({
      ...prev,
      [selectedAppId]: [],
    }));
  };

  return (
    <div className="flex h-full w-full flex-row bg-gray-50 dark:bg-gray-900">
      {/* Panels Container - Visible on all screens */}
      <div className="flex overflow-hidden">
        {/* Panel 1 - Available Apps */}
        <ColumnPanel
          id="panel1"
          title="Available Apps"
          icon={
            <Package className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          }
          isVisible={store.panels.panel1.isVisible}
          width={store.panels.panel1.width}
          onToggle={() => store.togglePanel('panel1')}
        >
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search apps..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 text-sm"
              />
            </div>

            {/* Available Apps to Connect Section */}
            <div>
              <div className="space-y-2">
                {filteredAvailableApps.map(app => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon Circle */}
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg dark:bg-gray-700">
                        {app.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {app.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {app.category}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleConnectApp(app)}
                      disabled={apps.some(a => a.id === app.id)}
                      size="sm"
                      className="ml-2 h-7 bg-blue-600 px-2 text-xs whitespace-nowrap hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      {apps.some(a => a.id === app.id)
                        ? 'Connected'
                        : 'Connect'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ColumnPanel>

        {/* Panel 2 - Chat History */}
        <ColumnPanel
          id="panel2"
          title="Chat History"
          icon={<Zap className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
          isVisible={store.panels.panel2.isVisible}
          width={store.panels.panel2.width}
          onToggle={() => store.togglePanel('panel2')}
        >
          {selectedAppId ? (
            <div className="flex h-full flex-col">
              {/* App Name Header with New Chat Button */}
              <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {apps.find(a => a.id === selectedAppId)?.name}
                </h3>
                <Button
                  onClick={handleNewChat}
                  size="sm"
                  className="h-6 bg-blue-600 px-2 text-xs hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  New Chat
                </Button>
              </div>

              {/* Chat Messages - Only show first message */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {chatHistoryByApp[selectedAppId] &&
                chatHistoryByApp[selectedAppId].length > 0 ? (
                  (() => {
                    const firstMessage = chatHistoryByApp[selectedAppId][0];
                    return (
                      <div
                        key={firstMessage.id}
                        className={`flex ${
                          firstMessage.type === 'user'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs rounded-lg px-3 py-2 ${
                            firstMessage.type === 'user'
                              ? 'bg-blue-600 text-white dark:bg-blue-700'
                              : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                          }`}
                        >
                          <p className="text-xs">{firstMessage.content}</p>
                          <p
                            className={`mt-1 text-xs ${
                              firstMessage.type === 'user'
                                ? 'text-blue-100'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {firstMessage.timestamp}
                          </p>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        No messages yet
                      </p>
                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        Start chatting to see first message
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select an app to view chat history
                </p>
              </div>
            </div>
          )}
        </ColumnPanel>
      </div>

      {/* Main Content Area - App Query Interface */}
      <main className="flex flex-1 flex-col overflow-auto bg-white dark:bg-gray-950">
        <DataQueryInterface
          selectedMatterId={selectedAppId}
          uploadedFiles={[]}
          onAddMessage={handleAddMessage}
          selectedChatOptionId={selectedAppId}
          onCreateChatOption={() => {}}
          onUpdateChatName={() => {}}
        />
      </main>
    </div>
  );
};

export default AppsPanelsContainer;
