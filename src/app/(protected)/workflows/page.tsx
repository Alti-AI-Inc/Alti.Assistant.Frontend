'use client';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { ArrowRight, FileIcon, Plus, XIcon } from 'lucide-react';
import Image from 'next/image';
import React, { ChangeEvent } from 'react';

export default function Page() {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [fileType, setFileType] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const { isRightSidebarOpen } = useSidebarStore();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileType(file.type);
      setFileName(file.name);
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreview(url);
      } else {
        setPreview(null);
      }
    }
  };

  return (
    <div
      className={cn(
        'mx-auto flex min-h-screen flex-col items-center justify-center px-4 pr-12 transition-all duration-300',
        isRightSidebarOpen && 'pr-72',
      )}
    >
      <div className="w-full max-w-3xl">
        {/* Heading */}
        <h1 className="mb-6 text-center text-2xl font-semibold sm:text-3xl md:text-4xl">
          Workflow Automation
        </h1>

        {/* Form */}
        <form>
          <div className="rounded-2xl border-2 border-gray-200 px-3 shadow-sm sm:px-4">
            {(preview || fileType) && (
              <div className="relative w-fit">
                {preview ? (
                  <>
                    <Image
                      className="my-3 ms-2 rounded-lg"
                      src={preview}
                      alt="Preview"
                      width={100}
                      height={100}
                    />
                    <XIcon
                      size={20}
                      className="absolute top-1 right-1 cursor-pointer rounded-full bg-white p-0.5"
                      onClick={() => {
                        setPreview(null);
                        setFileType(null);
                        setFileName(null);
                      }}
                    />
                  </>
                ) : (
                  <div className="my-3 ms-2 flex w-full items-center justify-center rounded-lg border bg-gray-50 p-2">
                    <FileIcon size={22} className="text-gray-400" />
                    <span className="ml-2 text-xs break-all sm:text-sm">
                      {fileName}
                    </span>
                    <XIcon
                      size={18}
                      className="absolute top-1 right-1 cursor-pointer rounded-full p-0.5"
                      onClick={() => {
                        setPreview(null);
                        setFileType(null);
                        setFileName(null);
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Input */}
            <input
              type="text"
              className="w-full border-none px-2 py-2 text-sm outline-none sm:text-base"
              placeholder="Prompt your workflow"
            />

            {/* Footer */}
            <div className="flex items-center justify-between py-2">
              {/* File upload */}
              <div className="relative flex items-center">
                <Plus className="cursor-pointer rounded-full border-2 border-gray-300 p-0.5" />
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute top-0 left-0 h-full w-[24px] cursor-pointer opacity-0"
                />
              </div>

              {/* Submit button */}
              <button type="submit" className="">
                <ArrowRight className="size-7 flex-none cursor-pointer rounded-full border-2 border-gray-300 bg-black p-1 text-white" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
