import { AlertTriangle } from 'lucide-react';

interface DocumentReviewConfirmationProps {
  title?: string;
  description?: string;
}

/**
 * Generic warning/prompt modal for document operations.
 */
export function WarningMessageModal({
  title = 'Document Review',
  description = 'Please attach a file to start the review.',
}: DocumentReviewConfirmationProps) {
  return (
    <div className="mx-auto mb-4 w-full max-w-[796px] rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
