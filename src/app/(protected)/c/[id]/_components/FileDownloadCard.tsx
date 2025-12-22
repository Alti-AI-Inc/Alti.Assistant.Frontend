import { FileText, Download } from 'lucide-react';
import Link from 'next/link';
import { GeneratedDocument } from '@/stores/useConverstionsStore';
import { Button } from '@/components/ui/button';

interface FileDownloadCardProps {
  document: GeneratedDocument;
}

export default function FileDownloadCard({ document }: FileDownloadCardProps) {
  const { file, url, metadata } = document;

  // Fallback values if data is missing
  const fileName = file?.fileName || 'document';
  // Use file format from file object, or documentType from metadata, or fallback to 'FILE'
  const fileFormat = (
    file?.format ||
    metadata?.documentType ||
    'FILE'
  ).toUpperCase();
  // Use title from metadata, or fallback to filename
  const title = metadata?.title || fileName;

  return (
    <div className="mt-4 flex w-full max-w-sm items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span
            className="truncate text-sm font-semibold text-gray-900"
            title={title}
          >
            {title}
          </span>
          <span className="text-xs font-medium text-gray-500">
            {fileFormat}{' '}
            {file?.size ? `• ${(file.size / 1024).toFixed(1)} KB` : ''}
          </span>
        </div>
      </div>
      <div className="shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-gray-100"
          asChild
        >
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Download / Open"
          >
            <Download className="h-4 w-4 text-gray-600" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
