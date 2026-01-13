import { Presentation } from 'lucide-react';

interface PresentationLoadingCardProps {
  message: string;
}

export default function PresentationLoadingCard({
  message,
}: PresentationLoadingCardProps) {
  return (
    <div className="mt-4 flex w-full max-w-sm items-center gap-4 rounded-2xl border border-gray-100 bg-linear-to-r from-white to-gray-50 p-4 shadow-md transition-all hover:shadow-lg">
      {/* Icon with ring spinner */}
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
        {/* Spinning ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-300" />
        {/* Inner circle with icon */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
          <Presentation className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      {/* Text content */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-semibold text-gray-900">
          Generating Presentation
        </span>
        <span className="truncate text-xs text-gray-500">
          {message || 'Please wait...'}
        </span>
      </div>
    </div>
  );
}
