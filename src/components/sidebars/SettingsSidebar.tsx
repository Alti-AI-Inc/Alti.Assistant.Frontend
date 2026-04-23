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

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r border-gray-200 transition-all duration-300 ease-in-out dark:border-gray-800',
        isSettingsSidebarOpen
          ? 'w-64 bg-white dark:bg-gray-950'
          : 'w-20 items-center bg-gray-50 dark:bg-gray-900',
      )}
    >
      {/* Sidebar Header - Only shown when expanded */}
      {isSettingsSidebarOpen && (
        <div className="flex w-full items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-gray-800">
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
      )}

      {/* Collapsed state - icons only */}
      {!isSettingsSidebarOpen && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSettingsSidebar}
            className="mt-4 h-8 w-8 flex-shrink-0 rounded-md p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Expand"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="my-2 h-px w-8 bg-gray-200 dark:bg-gray-700" />
        </>
      )}

      {/* Sidebar Content */}
      <div
        className={cn(
          'flex-1 overflow-y-auto',
          isSettingsSidebarOpen
            ? 'w-full p-4'
            : 'flex flex-col items-center gap-2 p-2',
        )}
      >
        <div
          className={
            isSettingsSidebarOpen ? 'space-y-1' : 'flex flex-col gap-2'
          }
        >
          {settingsOptions.map(option => (
            <Button
              key={option.id}
              variant={selectedOption === option.value ? 'secondary' : 'ghost'}
              onClick={() => onSelectOption(option.value)}
              className={cn(
                isSettingsSidebarOpen
                  ? 'w-full justify-start gap-3 text-left'
                  : 'h-8 w-8 rounded-md p-0',
                selectedOption === option.value
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                  : isSettingsSidebarOpen
                    ? 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700',
              )}
              title={
                !isSettingsSidebarOpen
                  ? settingsOptions.find(opt => opt.value === option.value)
                      ?.title
                  : undefined
              }
            >
              {option.icon}
              {isSettingsSidebarOpen && (
                <span className="text-sm font-medium">
                  {
                    settingsOptions.find(opt => opt.value === option.value)
                      ?.title
                  }
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
