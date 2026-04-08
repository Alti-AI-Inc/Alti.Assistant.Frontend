'use client';

import { Button } from '@/components/ui/button';
import { useColumnPanelStore } from '@/stores/useColumnPanelStore';
import { Activity, BookOpen, MessageSquare } from 'lucide-react';

/**
 * Panel toggle buttons header - perfect for toolbar/header area
 * Shows individual toggle buttons for each panel
 */
export const PanelToggleHeader = () => {
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
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-950">
      {panels.map(panel => {
        const Icon = panel.icon;
        return (
          <Button
            key={panel.id}
            variant={panel.isVisible ? 'default' : 'ghost'}
            size="sm"
            onClick={() => store.togglePanel(panel.id)}
            className="gap-2"
            title={`${panel.isVisible ? 'Hide' : 'Show'} ${panel.label}`}
          >
            <Icon className="h-4 w-4" />
            {panel.label}
          </Button>
        );
      })}
    </div>
  );
};

export default PanelToggleHeader;
