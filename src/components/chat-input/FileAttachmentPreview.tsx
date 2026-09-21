import React from 'react';
import { Plus, X, FileText } from 'lucide-react';

interface FileAttachmentPreviewProps {
  imageBase64: string | null;
  handleRemoveImage: () => void;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
}

export function FileAttachmentPreview({
  imageBase64,
  handleRemoveImage,
  selectedFiles,
  setSelectedFiles,
}: FileAttachmentPreviewProps) {
  if (!imageBase64 && (!selectedFiles || selectedFiles.length === 0)) {
    return null;
  }

  return (
    <>
      {/* Image Preview */}
      {imageBase64 && (
        <div className="relative w-fit">
          <img
            src={imageBase64}
            alt="Uploaded preview"
            className="h-12 w-12 rounded-lg object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 rounded-full bg-red-400 p-1 text-white hover:bg-red-600"
          >
            <Plus className="bold size-3 rotate-45" />
          </button>
        </div>
      )}

      {/* File Cards Preview */}
      {selectedFiles && selectedFiles.length > 0 && (
        <div className="custom-scrollbar flex max-h-[80px] flex-wrap gap-2 overflow-y-auto">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="animate-in fade-in inline-flex max-w-[140px] items-center gap-2 rounded-[3px] border border-black/10 bg-white px-2.5 py-1.5 shadow-xs duration-200 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <FileText className="size-4 flex-shrink-0 text-gray-500" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span
                  className="text-gray-705 truncate text-xs font-semibold dark:text-zinc-300"
                  title={file.name}
                >
                  {file.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = selectedFiles.filter((_, i) => i !== index);
                  setSelectedFiles(updated);
                }}
                className="flex-shrink-0 rounded-md p-0.5 text-gray-400 transition-colors hover:bg-black/5 hover:text-gray-600"
                title="Remove file"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
