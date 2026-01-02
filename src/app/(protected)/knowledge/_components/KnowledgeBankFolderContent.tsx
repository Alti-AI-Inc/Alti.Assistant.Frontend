'use client';

import { KnowledgeBankFile } from '@/actions/knowledgeBankAction';
import { getFileBlob } from '@/actions/knowledgeBaseAction';
import { useKnowledgeBankFolderContent } from '@/hooks/useKnowledgeBank';
import { useModalStore } from '@/stores/useModalStore';
import { Download, File, LoaderCircle, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
// import { Download, File, LoaderCircle, Trash } from 'lucide-react';
import { useState } from 'react';

export function KnowledgeBankFolderContent({ folderId }: { folderId: string }) {
  const { onOpen } = useModalStore();
  const { data: session } = useSession();
  const { data, isLoading } = useKnowledgeBankFolderContent(
    folderId,
    session?.accessToken,
  );

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
    file: KnowledgeBankFile,
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
      {data?.files?.map(file => (
        <div
          key={file.id}
          className="flex flex-row items-center justify-between rounded-lg bg-gray-100 py-4 ps-2 pe-4 transition-all"
        >
          <div className="flex items-center space-x-4">
            <File className="text-gray-600" />
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{file.fileName}</span>
              <span className="text-sm text-gray-500">
                {file.formattedFileSize} • {file.fileType.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-gray-600">
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
                  type: 'delete-knowledge-bank-file',
                  actionId: file.id,
                  actionId2: folderId,
                })
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
