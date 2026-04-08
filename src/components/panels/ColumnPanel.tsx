'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

interface ColumnPanelProps {
  id: 'panel1' | 'panel2' | 'panel3';
  title: string;
  icon?: ReactNode;
  isVisible: boolean;
  width: number;
  onToggle: () => void;
  onResize?: (newWidth: number) => void;
  children: ReactNode;
  actions?: ReactNode;
}

export const ColumnPanel = ({
  id,
  title,
  icon,
  isVisible,
  width,
  onToggle,
  onResize,
  children,
  actions,
}: ColumnPanelProps) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onResize) return;

    const startX = e.clientX;
    const startWidth = width;
    let isDragging = true;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging) return;

      const diff = moveEvent.clientX - startX;
      const newWidth = startWidth + diff;

      // Constrain width between 250px and 600px
      if (newWidth >= 250 && newWidth <= 600) {
        onResize(newWidth);
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    e.preventDefault();
  };

  return (
    <>
      {/* Expanded Panel */}
      {isVisible && (
        <>
          <div
            className="relative flex flex-col overflow-hidden border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950"
            style={{
              width: `${width}px`,
              minWidth: `${width}px`,
              maxWidth: `${width}px`,
            }}
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
              <div className="flex min-w-0 items-center gap-2">
                {icon && <div className="flex-shrink-0">{icon}</div>}
                <h2 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h2>
              </div>

              {/* Header Actions */}
              <div className="flex flex-shrink-0 items-center gap-1">
                {actions}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Collapse panel"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Panel Content - Scrollable */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto">
              <div className="p-4">{children}</div>
            </div>
          </div>

          {/* Resize Handle - Only show when panel is visible */}
          {onResize && (
            <div
              className={cn(
                'group relative w-1 cursor-col-resize bg-transparent hover:bg-blue-500/50',
                'transition-colors duration-200 dark:hover:bg-blue-400/50',
              )}
              onMouseDown={handleMouseDown}
              title="Drag to resize"
            >
              <div className="absolute inset-0 w-2 -translate-x-1/2" />
            </div>
          )}
        </>
      )}

      {/* Collapsed Panel - Thin Bar */}
      {!isVisible && (
        <div
          className="flex flex-col items-center justify-start border-r border-gray-200 bg-gray-50 transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900"
          style={{
            width: '50px',
            minWidth: '50px',
            maxWidth: '50px',
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="mt-2 flex h-12 w-12 items-center justify-center p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            title={`Expand ${title}`}
          >
            <div className="flex flex-col items-center gap-1">
              {icon && <div className="flex-shrink-0">{icon}</div>}
              <ChevronRight className="h-3 w-3" />
            </div>
          </Button>
        </div>
      )}
    </>
  );
};

export default ColumnPanel;
