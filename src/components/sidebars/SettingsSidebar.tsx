'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { Brain, ChevronRight, CreditCard, KeyRound, User } from 'lucide-react';

export interface SettingsOption {
  id: string;
  title: string;
  value: string;
  icon: React.ReactNode;
}

interface SettingsSidebarProps {
  selectedOption: string;
  onSelectOption: (value: string) => void;
}

const settingsOptions: SettingsOption[] = [
  {
    id: '1',
    title: 'Personal Settings',
    value: 'personal',
    icon: <User className="h-5 w-5" />,
  },
  {
    id: '2',
    title: 'Subscription',
    value: 'subscription',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: '3',
    title: 'Memory',
    value: 'memory',
    icon: <Brain className="h-5 w-5" />,
  },
  {
    id: '4',
    title: 'Password',
    value: 'password',
    icon: <KeyRound className="h-5 w-5" />,
  },
];

export const SettingsSidebar = ({
  selectedOption,
  onSelectOption,
}: SettingsSidebarProps) => {
  const { isSettingsSidebarOpen, toggleSettingsSidebar } = useSidebarStore();

  // Collapsed view - icon only
  if (!isSettingsSidebarOpen) {
    return (
      <div className="flex flex-col items-center gap-2 border-r border-gray-200 bg-gray-50 px-2 py-4 transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSettingsSidebar}
          className="h-8 w-8 rounded-md p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Expand"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex flex-col gap-2">
          {settingsOptions.map(option => (
            <Button
              key={option.id}
              variant={selectedOption === option.value ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onSelectOption(option.value)}
              className={cn(
                'h-8 w-8 rounded-md p-0',
                selectedOption === option.value
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700',
              )}
              title={
                settingsOptions.find(opt => opt.value === option.value)
                  ?.title || ''
              }
            >
              {option.icon}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // Expanded view - full sidebar
  return (
    <div className="relative flex w-64 flex-col overflow-hidden border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-gray-800">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Settings
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Manage your account settings
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSettingsSidebar}
          className="h-8 w-8 flex-shrink-0 rounded-md p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Collapse"
        >
          <ChevronRight className="h-4 w-4 rotate-180 transition-transform duration-300" />
        </Button>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {settingsOptions.map(option => (
            <Button
              key={option.id}
              variant={selectedOption === option.value ? 'secondary' : 'ghost'}
              onClick={() => onSelectOption(option.value)}
              className={cn(
                'w-full justify-start gap-3 text-left',
                selectedOption === option.value
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900',
              )}
            >
              {option.icon}
              <span className="text-sm font-medium">{option.title}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
