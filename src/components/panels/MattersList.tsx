'use client';

import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import CreateMatterModal from './CreateMatterModal';

interface Matter {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Completed' | 'Pending';
  statusColor: string;
}

interface MattersListProps {
  matters: Matter[];
  onCreateMatter: (matterName: string) => void;
  onSelectMatter?: (matterId: string) => void;
  selectedMatterId?: string;
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

export const MattersList = ({
  matters = DEFAULT_MATTERS,
  onCreateMatter,
  onSelectMatter,
  selectedMatterId,
}: MattersListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredMatters = useMemo(() => {
    return matters.filter(
      matter =>
        matter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        matter.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [matters, searchQuery]);

  const handleCreateMatter = (matterName: string) => {
    onCreateMatter(matterName);
    setSearchQuery('');
  };

  return (
    <>
      {/* Search and Create Section */}
      <div className="mb-4 flex items-center justify-center gap-2 space-y-3">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search matters..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9"
        />
        <Plus className="h-4 w-4" onClick={() => setIsCreateModalOpen(true)} />
      </div>

      {/* Divider */}
      <div className="mb-4 h-px bg-gray-200 dark:bg-gray-800" />

      {/* Matters List */}
      <div className="space-y-3">
        {filteredMatters.length > 0 ? (
          filteredMatters.map(matter => (
            <div
              key={matter.id}
              onClick={() => onSelectMatter?.(matter.id)}
              className="cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:shadow-md dark:border-gray-700 hover:dark:border-gray-600"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {matter.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {matter.description}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex gap-1">
                <span
                  className={`inline-block rounded px-2 py-1 text-xs font-medium ${matter.statusColor}`}
                >
                  {matter.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No matters found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      {/* Create Matter Modal */}
      <CreateMatterModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateMatter={handleCreateMatter}
      />
    </>
  );
};

export default MattersList;
