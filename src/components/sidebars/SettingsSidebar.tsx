'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/useSidebarStore';
import {
  Brain,
  ChevronRight,
  KeyRound,
  SlidersHorizontal,
  ShieldCheck,
  PanelLeftClose,
  UserPlus,
  Database,
} from 'lucide-react';

export interface SettingsOption {
  id: string;
  title: string;
  value: string;
  icon: React.ReactNode;
}

export interface SettingsSection {
  sectionTitle: string;
  options: SettingsOption[];
}

interface SettingsSidebarProps {
  selectedOption: string;
  onSelectOption: (value: string) => void;
}

const settingsSections: SettingsSection[] = [
  {
    sectionTitle: 'AI Cognition',
    options: [
      {
        id: '1',
        title: 'Memory',
        value: 'memory',
        icon: <Brain className="h-5 w-5" />,
      },
      {
        id: 'data-tab',
        title: 'Data',
        value: 'data',
        icon: <Database className="h-5 w-5" />,
      },
    ],
  },
  {
    sectionTitle: 'AI Behavior',
    options: [
      {
        id: '2',
        title: 'Instructions',
        value: 'instructions',
        icon: <SlidersHorizontal className="h-5 w-5" />,
      },
      {
        id: '3',
        title: 'Guardrails',
        value: 'guardrails',
        icon: <ShieldCheck className="h-5 w-5" />,
      },
    ],
  },
  {
    sectionTitle: 'Account Settings',
    options: [
      {
        id: '4',
        title: 'Password',
        value: 'password',
        icon: <KeyRound className="h-5 w-5" />,
      },
      {
        id: '5',
        title: 'Invite',
        value: 'invite',
        icon: <UserPlus className="h-5 w-5" />,
      },
    ],
  },
];

export const SettingsSidebar = ({
  selectedOption,
  onSelectOption,
}: SettingsSidebarProps) => {
  const { isSettingsSidebarOpen, toggleSettingsSidebar } = useSidebarStore();
  const hideSidebar = !isSettingsSidebarOpen;

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r border-black/10 transition-all duration-300 ease-in-out',
        isSettingsSidebarOpen
          ? 'w-64 bg-white dark:bg-gray-950'
          : 'w-20 items-center bg-white dark:bg-gray-900',
      )}
    >
      <div
        className={cn(
          'sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-black/10 px-4 py-3 transition-colors duration-300',
          hideSidebar ? 'justify-center bg-white dark:bg-gray-900' : 'bg-white dark:bg-gray-955',
        )}
      >
        {!hideSidebar ? (
          <>
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Settings
            </span>
            <PanelLeftClose
              className="size-5 cursor-pointer text-gray-600 transition-transform duration-300"
              onClick={toggleSettingsSidebar}
            />
          </>
        ) : (
          <PanelLeftClose
            className="size-5 cursor-pointer text-gray-600 rotate-180 transition-transform duration-300"
            onClick={toggleSettingsSidebar}
          />
        )}
      </div>

      {/* Sidebar Content */}
      <div
        className={cn(
          'flex-1 overflow-y-auto',
          isSettingsSidebarOpen
            ? 'w-full p-4 space-y-5'
            : 'flex flex-col items-center gap-2.5 p-2 pt-4',
        )}
      >
        {settingsSections.map((section, idx) => (
          <div key={section.sectionTitle} className="space-y-1.5 w-full flex flex-col items-center">
            {isSettingsSidebarOpen && (
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 pb-1 select-none self-start">
                {section.sectionTitle}
              </div>
            )}
            
            {section.options.map(option => (
              <Button
                key={option.id}
                variant={selectedOption === option.value ? 'secondary' : 'ghost'}
                onClick={() => onSelectOption(option.value)}
                className={cn(
                  isSettingsSidebarOpen
                    ? 'w-full justify-start gap-3 text-left'
                    : 'h-10 w-10 rounded-md p-0 flex items-center justify-center',
                  selectedOption === option.value
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm'
                    : isSettingsSidebarOpen
                      ? 'text-gray-700 hover:bg-gray-55 dark:text-gray-300 dark:hover:bg-gray-900'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700',
                )}
                title={!isSettingsSidebarOpen ? option.title : undefined}
              >
                {option.icon}
                {isSettingsSidebarOpen && (
                  <span className="text-sm font-medium">{option.title}</span>
                )}
              </Button>
            ))}

            {!isSettingsSidebarOpen && idx < settingsSections.length - 1 && (
              <div className="w-8 h-px bg-black/15 dark:bg-white/15 my-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsSidebar;
