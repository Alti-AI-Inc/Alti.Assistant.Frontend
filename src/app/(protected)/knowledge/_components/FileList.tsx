'use client';

import { getFileBlob, KnowledgeBaseFile } from '@/actions/knowledgeBaseAction';
import { useKnowledgeBaseFiles } from '@/hooks/useKnowledgeBases';
import { useModalStore } from '@/stores/useModalStore';
import { Download, File, LoaderCircle, Trash } from 'lucide-react';
import { useState } from 'react';

interface FileListProps {
  baseId: string;
  accessToken?: string;
}

export function FileList({ baseId, accessToken }: FileListProps) {
  const { onOpen } = useModalStore();
  const { data, isLoading } = useKnowledgeBaseFiles(baseId, accessToken);

  const [isDownloading, setIsDownloading] = useState(false);

  if (isLoading)
    return (
      <p className="flex h-[65vh] items-center justify-center">
        <LoaderCircle className="animate-spin" /> Loading files...
      </p>
    );
  if (!data?.files?.length)
    return (
      <p className="flex h-[60vh] items-center justify-center">
        No files found.
      </p>
    );

  const handleDownload = async (
    e: React.MouseEvent,
    file: KnowledgeBaseFile,
  ) => {
    e.preventDefault();
    setIsDownloading(true);
    e.stopPropagation();
    try {
      const blob = await getFileBlob(file);
      if (!blob) {
        console.error('Failed to get file blob');
        alert('Failed to download file.');
        return;
      }
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName;
      a.click();

      window.URL.revokeObjectURL(url);

      setIsDownloading(false);
    } catch (err) {
      setIsDownloading(false);
      console.error('Download failed:', err);
      alert('Failed to download file.');
    }
  };

  return (
    <div className="mt-6 space-y-3">
      {data.files.map(file => (
        <div
          key={file.id}
          className="flex flex-row items-center justify-between rounded-lg bg-gray-100 py-4 ps-2 pe-4 transition-all"
        >
          {/* Left: File info */}
          <div className="flex items-center space-x-4">
            <File className="text-gray-600" />
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{file.fileName}</span>
              <span className="text-sm text-gray-500">
                {file.formattedFileSize} • {file.fileType.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Right: Download + Delete */}
          <div className="flex items-center space-x-3 text-gray-600">
            {/* Download icon */}

            {isDownloading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Download
                className="cursor-pointer"
                size={20}
                onClick={e => handleDownload(e, file)}
              />
            )}

            <Trash
              size={20}
              className="transition-colors"
              onClick={() =>
                onOpen({
                  type: 'delete-knowledge-base-file',
                  actionId: file.id,
                })
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
