'use client';

import { Button } from '@/components/ui/button';
import { FileIcon, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

export interface UploadedFile {
  id: string;
  matterId: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface DataRoomProps {
  selectedMatterId?: string;
  uploadedFiles: UploadedFile[];
  onFileUpload: (files: UploadedFile[]) => void;
  onFileDelete: (fileId: string) => void;
}

export const DataRoom = ({
  selectedMatterId,
  uploadedFiles,
  onFileUpload,
  onFileDelete,
}: DataRoomProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Filter files for the selected matter
  const matterFiles = selectedMatterId
    ? uploadedFiles.filter(file => file.matterId === selectedMatterId)
    : [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || !selectedMatterId) return;

    setIsUploading(true);

    // Simulate file upload delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      matterId: selectedMatterId,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toLocaleString(),
    }));

    onFileUpload([...uploadedFiles, ...newFiles]);
    setIsUploading(false);

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (fileId: string) => {
    onFileDelete(fileId);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (!selectedMatterId) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-600">
        <div>
          <Upload className="mx-auto mb-3 h-8 w-8 text-gray-400 dark:text-gray-600" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Select a workspace <br/>
            and upload your files
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* File Upload Section */}
      <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center dark:border-gray-600">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept="*/*"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </Button>
        {/* <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          Drag and drop files here or click to browse
        </p> */}
      </div>

      {/* File Categories Summary */}

      <div>
        <div className="my-2 flex justify-between align-middle">
          <h3 className="mb-3 text-xs font-semibold text-gray-700 uppercase dark:text-gray-300">
            Files ({matterFiles.length})
          </h3>
          <h3 className="mb-3 text-xs font-semibold text-gray-700 uppercase dark:text-gray-300">
            Total Size :{' '}
            {formatFileSize(
              matterFiles.reduce((total, file) => total + file.size, 0),
            )}
          </h3>
        </div>

        {/* Files List */}

        {matterFiles.length === 0 ? (
          // <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-900">
          //   <p className="text-xs text-gray-600 dark:text-gray-400">
          //     No files uploaded for this matter yet
          //   </p>
          // </div>
          <></>
        ) : (
          <div className="space-y-2">
            {matterFiles.map(file => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-950"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileIcon className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-600" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-gray-900 dark:text-gray-100">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatFileSize(file.size)} • {file.uploadedAt}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(file.id)}
                  className="h-6 w-6 flex-shrink-0 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                  title="Delete file"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataRoom;
