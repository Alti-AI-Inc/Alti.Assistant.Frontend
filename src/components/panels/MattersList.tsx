'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CheckCircle2, FileText } from 'lucide-react';
import { useMemo, useState } from 'react';
import CreateMatterModal from './CreateMatterModal';

interface Matter {
  id: string;
  name: string;
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
    status: 'Active',
    statusColor:
      'bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100',
  },
  {
    id: '2',
    name: 'Contract Analysis',
    status: 'Completed',
    statusColor:
      'bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100',
  },
  {
    id: '3',
    name: 'Data Analysis & Review',
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
    return matters.filter(matter =>
      matter.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [matters, searchQuery]);

  const handleCreateMatter = (matterName: string) => {
    onCreateMatter(matterName);
    setSearchQuery('');
  };

  return (
    <>
      {/* Search and Create Section */}
      <div className="flex items-center gap-2 ">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9"
        />

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-sm border bg-white transition hover:bg-gray-100"
        >
          <span className="text-xl font-semibold">+</span>
        </button>
      </div>

      {/* Divider */}
      <div className="mb-4 h-px bg-gray-200 dark:bg-gray-800 mt-4" />

      {/* Matters List */}
      <div className="space-y-2">
        {filteredMatters.length > 0 ? (
          filteredMatters.map(matter => (
            <div
              key={matter.id}
              onClick={() => onSelectMatter?.(matter.id)}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                selectedMatterId === matter.id
                  ? 'bg-blue-100 dark:bg-blue-900/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800',
              )}
            >
              <FileText className="h-4 w-4 flex-shrink-0 text-gray-600 dark:text-gray-400" />
              <h3 className="flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {matter.name}
              </h3>
              {selectedMatterId === matter.id && (
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              )}
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No matters found matching `{searchQuery}`
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
