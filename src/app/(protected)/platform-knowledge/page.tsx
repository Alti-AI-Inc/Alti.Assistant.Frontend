'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { useState, Suspense, useRef } from 'react';
import { useAdminStore } from '@/stores/useAdminStore';
import { getFileExtension, getFileIconComponent } from '@/components/panels/ProjectEditors';

const PlatformKnowledgeContent = () => {
  const { files: selectedFiles, setFiles } = useAdminStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const addFiles = (newFiles: File[]) => {
    const newItems = newFiles.map(f => ({
      id: Date.now().toString() + Math.random().toString(),
      name: f.name,
      size: f.size.toString(),
      url: '',
    }));
    const merged = [...newItems, ...selectedFiles];
    setFiles(merged);
  };

  const handleDelete = () => {
    if (deletingIndex === null) return;
    const merged = selectedFiles.filter((_, i) => i !== deletingIndex);
    setFiles(merged);
    setDeletingIndex(null);
  };

  const filteredFiles = selectedFiles
    .map((file, index) => ({ file, index }))
    .filter(({ file }) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase().trim()),
    );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F5F5F7] dark:bg-gray-955">
      {/* Top Navbar / Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-955 justify-between">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Platform Knowledge
        </h1>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6 flex justify-center">
        <div className="w-full space-y-6">
          {/* Upload Box */}
          <div
            className={cn(
              "relative w-full flex-none flex items-center gap-2 bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 rounded-lg shadow-sm pr-2 transition-colors",
              isDragActive ? 'ring-2 ring-blue-400 border-blue-400' : ''
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragActive(false);
              if (e.dataTransfer.files) {
                const filesArray = Array.from(e.dataTransfer.files);
                addFiles(filesArray);
              }
            }}
          >
            <div
              className="px-4 h-12 w-full text-base flex items-center cursor-pointer text-gray-400 hover:text-gray-600 dark:text-gray-555 dark:hover:text-gray-300 transition-colors flex-1 select-none"
              onClick={() => fileInputRef.current?.click()}
            >
              {isDragActive ? 'Drop files here...' : 'Click or drag & drop files here...'}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  const filesArray = Array.from(e.target.files);
                  addFiles(filesArray);
                }
              }}
              className="hidden"
            />
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 px-4 rounded-md cursor-pointer"
            >
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Upload
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full flex-none">
            <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
            <Input
              placeholder="Search files"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 h-12 w-full text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
            />
          </div>

          {/* File List */}
          <div className="w-full">
            {filteredFiles.length === 0 ? null : (
              <div className="flex flex-col gap-2 pb-4">
                {filteredFiles.map(({ file, index }) => {
                  const IconComponent = getFileIconComponent(file.name);
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-white/90 dark:bg-gray-900/90 border border-black/5 dark:border-white/5 rounded-lg shadow-sm items-center animate-in fade-in-50 duration-150"
                    >
                      {/* Left Icon & Content */}
                      <div className="col-span-10 flex items-center gap-5 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-955/40 text-blue-650 dark:text-blue-400 flex items-center justify-center flex-none">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-normal break-words">
                            {file.name}
                          </span>
                          <span className="text-[9px] text-gray-400 font-medium block mt-0.5 uppercase font-mono tracking-wider">
                            {(Number(file.size) / 1024 / 1024).toFixed(2)} MB • {getFileExtension(file.name) || 'Document'}
                          </span>
                        </div>
                      </div>

                      {/* Delete Action */}
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <Dialog
                          open={deletingIndex === index}
                          onOpenChange={open => {
                            if (!open) setDeletingIndex(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 cursor-pointer"
                              onClick={() => setDeletingIndex(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] sm:max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden animate-in fade-in-50 duration-150">
                            <div className="px-5 pt-5 pb-4 text-center">
                              <DialogTitle className="text-[17px] font-semibold text-black dark:text-white leading-tight text-center">
                                Delete File
                              </DialogTitle>
                              <DialogDescription className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1 text-center">
                                Are you sure you want to remove this file?
                              </DialogDescription>
                            </div>
                            <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                              <DialogClose asChild>
                                <button className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none cursor-pointer">
                                  Cancel
                                </button>
                              </DialogClose>
                              <DialogClose asChild>
                                <button
                                  onClick={handleDelete}
                                  className="flex-1 text-[15px] font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none cursor-pointer"
                                >
                                  Delete
                                </button>
                              </DialogClose>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PlatformKnowledgePage() {
  return (
    <Suspense fallback={<div className="flex-1 h-full flex items-center justify-center text-sm text-gray-555">Loading platform knowledge...</div>}>
      <PlatformKnowledgeContent />
    </Suspense>
  );
}
