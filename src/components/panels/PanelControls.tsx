'use client';

import { Button } from '@/components/ui/button';
import { useColumnPanelStore } from '@/stores/useColumnPanelStore';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';

/**
 * Panel control toolbar - place this in the header or toolbar area
 * to control visibility of all column panels
 */
export const PanelControls = () => {
  const store = useColumnPanelStore();

  const visibleCount = [
    store.panels.panel1.isVisible,
    store.panels.panel2.isVisible,
    store.panels.panel3.isVisible,
  ].filter(Boolean).length;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => store.showAllPanels()}
        className="gap-2"
        title="Show all panels"
      >
        <Eye className="h-4 w-4" />
        Show All
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => store.hideAllPanels()}
        className="gap-2"
        title="Hide all panels"
      >
        <EyeOff className="h-4 w-4" />
        Hide All
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => store.resetAllPanels()}
        className="gap-2"
        title="Reset all panels to default"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>

      <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
        {visibleCount}/3 panels visible
      </span>
    </div>
  );
};

export default PanelControls;
