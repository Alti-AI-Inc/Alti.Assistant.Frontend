'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useColumnPanelStore } from '@/stores/useColumnPanelStore';
import {
  Activity,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';

/**
 * Panel toggle tabs that show even when panels are closed
 * Allows users to easily open/close all panels
 */
export const PanelToggleTabs = () => {
  const store = useColumnPanelStore();

  const panels = [
    {
      id: 'panel1' as const,
      label: 'Matters',
      icon: BookOpen,
      isVisible: store.panels.panel1.isVisible,
    },
    {
      id: 'panel2' as const,
      label: 'Data Room',
      icon: Activity,
      isVisible: store.panels.panel2.isVisible,
    },
    {
      id: 'panel3' as const,
      label: 'Chat History',
      icon: MessageSquare,
      isVisible: store.panels.panel3.isVisible,
    },
  ];

  return (
    <div className="flex h-full flex-col gap-2 border-r border-gray-200 bg-gray-100/50 p-2 dark:border-gray-700 dark:bg-gray-800/50">
      {panels.map(panel => {
        const Icon = panel.icon;
        return (
          <Button
            key={panel.id}
            variant={panel.isVisible ? 'default' : 'outline'}
            size="sm"
            onClick={() => store.togglePanel(panel.id)}
            className={cn(
              'w-full justify-start gap-2 text-xs',
              panel.isVisible && 'bg-blue-600 text-white hover:bg-blue-700',
            )}
            title={`${panel.isVisible ? 'Hide' : 'Show'} ${panel.label}`}
          >
            <Icon className="h-4 w-4" />
            <span className="truncate">{panel.label}</span>
            {panel.isVisible ? (
              <ChevronLeft className="ml-auto h-3 w-3" />
            ) : (
              <ChevronRight className="ml-auto h-3 w-3" />
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default PanelToggleTabs;
