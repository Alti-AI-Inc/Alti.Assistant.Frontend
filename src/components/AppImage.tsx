'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AppImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackSizeClass?: string;
}

export const AppImage = ({ src, alt, className, fallbackSizeClass = 'text-xs' }: AppImageProps) => {
  const [hasError, setHasError] = useState(false);

  // Get first character of the title for fallback
  const fallbackChar = alt ? alt.trim().charAt(0).toUpperCase() : '?';

  if (!src || hasError) {
    return (
      <span className={cn("font-semibold text-blue-600 dark:text-blue-400 select-none", fallbackSizeClass)}>
        {fallbackChar}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("h-full w-full object-contain", className)}
      onError={() => setHasError(true)}
    />
  );
};

export default AppImage;
