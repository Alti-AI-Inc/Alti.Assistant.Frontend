'use client';

import { Button } from '@/components/ui/button';
import { useImageGenStore, AspectRatio } from '@/stores/useImageGenStore';
import { cn } from '@/lib/utils';

const ASPECT_RATIOS: { value: AspectRatio; label: string; icon: string }[] = [
  { value: '1:1', label: 'Square', icon: '■' },
  { value: '16:9', label: 'Landscape', icon: '▬' },
  { value: '9:16', label: 'Portrait', icon: '▮' },
  { value: '4:3', label: 'Standard', icon: '▭' },
];

interface AspectRatioSelectorProps {
  className?: string;
}

/**
 * Component for selecting image aspect ratio before generation.
 */
export function AspectRatioSelector({ className }: AspectRatioSelectorProps) {
  const { aspectRatio, setAspectRatio } = useImageGenStore();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-xs font-medium text-gray-500">Aspect:</span>
      <div className="flex gap-1">
        {ASPECT_RATIOS.map(({ value, label, icon }) => (
          <Button
            key={value}
            variant="ghost"
            size="sm"
            onClick={() => setAspectRatio(value)}
            className={cn(
              'h-7 min-w-[50px] px-2 text-xs',
              aspectRatio === value
                ? 'bg-black text-white hover:bg-gray-800 hover:text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            )}
            title={label}
          >
            <span className="mr-1">{icon}</span>
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
}
