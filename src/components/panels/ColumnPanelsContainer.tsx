'use client';

import { useColumnPanelStore } from '@/stores/useColumnPanelStore';
import { Activity, BookOpen, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import ColumnPanel from './ColumnPanel';
import MattersList from './MattersList';

interface Matter {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Completed' | 'Pending';
  statusColor: string;
}

const DEFAULT_MATTERS: Matter[] = [
  {
    id: '1',
    name: 'Project Documentation Review',
    description: 'Matter #001',
    status: 'Active',
    statusColor:
      'bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100',
  },
  {
    id: '2',
    name: 'Contract Analysis',
    description: 'Matter #002',
    status: 'Completed',
    statusColor:
      'bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100',
  },
  {
    id: '3',
    name: 'Data Analysis & Review',
    description: 'Matter #003',
    status: 'Pending',
    statusColor:
      'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100',
  },
];

export const ColumnPanelsContainer = () => {
  const store = useColumnPanelStore();
  const [matters, setMatters] = useState<Matter[]>(DEFAULT_MATTERS);
  const [selectedMatterId, setSelectedMatterId] = useState<
    string | undefined
  >();

  const handleCreateMatter = (matterName: string) => {
    const newMatter: Matter = {
      id: String(matters.length + 1),
      name: matterName,
      description: `Matter #${matters.length + 1}`,
      status: 'Active',
      statusColor:
        'bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100',
    };
    setMatters([newMatter, ...matters]);
  };

  return (
    <div className="flex h-full w-full bg-gray-50 dark:bg-gray-900">
      {/* Panel 1 - Matters */}
      <ColumnPanel
        id="panel1"
        title="Matters"
        icon={<BookOpen className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
        isVisible={store.panels.panel1.isVisible}
        width={store.panels.panel1.width}
        onToggle={() => store.togglePanel('panel1')}
        onResize={width => store.setPanelWidth('panel1', width)}
      >
        <MattersList
          matters={matters}
          onCreateMatter={handleCreateMatter}
          onSelectMatter={setSelectedMatterId}
          selectedMatterId={selectedMatterId}
        />
      </ColumnPanel>

      {/* Panel 2 - Data Room */}
      <ColumnPanel
        id="panel2"
        title="Data Room"
        icon={<Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
        isVisible={store.panels.panel2.isVisible}
        width={store.panels.panel2.width}
        onToggle={() => store.togglePanel('panel2')}
        onResize={width => store.setPanelWidth('panel2', width)}
      >
        <div className="space-y-3">
          <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Documents
              </h3>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                15
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Contracts, Agreements, Reports
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Spreadsheets
              </h3>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                8
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Data Analysis, Metrics, Reports
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Media
              </h3>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                12
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Images, Videos, Audio Files
            </p>
          </div>
        </div>
      </ColumnPanel>

      {/* Panel 3 - Chat History */}
      <ColumnPanel
        id="panel3"
        title="Chat History"
        icon={
          <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        }
        isVisible={store.panels.panel3.isVisible}
        width={store.panels.panel3.width}
        onToggle={() => store.togglePanel('panel3')}
        onResize={width => store.setPanelWidth('panel3', width)}
      >
        <div className="space-y-3">
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Mar 15, 2024 - 2:30 PM
            </p>
            <p className="mt-2 text-sm text-gray-900 dark:text-gray-100">
              Project kickoff meeting notes and action items discussed
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Mar 14, 2024 - 10:15 AM
            </p>
            <p className="mt-2 text-sm text-gray-900 dark:text-gray-100">
              Review feedback on initial documentation
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Mar 13, 2024 - 4:45 PM
            </p>
            <p className="mt-2 text-sm text-gray-900 dark:text-gray-100">
              Data analysis results and compliance check completed
            </p>
          </div>
        </div>
      </ColumnPanel>

      {/* Main Content Area - Placeholder */}
      <main className="flex flex-1 flex-col overflow-auto bg-white dark:bg-gray-950">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Main Content Area
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Central workspace content will be displayed here
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ColumnPanelsContainer;
