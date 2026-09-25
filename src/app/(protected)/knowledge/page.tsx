'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Trash2, Database, Upload, File as FileIcon, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { IosConfirmModal } from '@/components/ui/ios-confirm-modal';

const STORAGE_KEY = 'aphura_knowledge_files';

interface KnowledgeFile {
  id: string;
  name: string;
  size: number;
  type: string;
  createdAt: number;
}

export default function KnowledgePage() {
  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setFiles(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse knowledge files', e);
        }
      }
    }
  }, []);

  const saveFiles = (newFiles: KnowledgeFile[]) => {
    setFiles(newFiles);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFiles));
  };

  const handleFileUpload = (uploadedFiles: FileList | null) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    
    const newKnowledgeFiles: KnowledgeFile[] = Array.from(uploadedFiles).map(f => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: f.name,
      size: f.size,
      type: f.type || 'application/octet-stream',
      createdAt: Date.now(),
    }));

    saveFiles([...newKnowledgeFiles, ...files]);
    toast.success(`Added ${uploadedFiles.length} file(s) to Knowledge Base`);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    saveFiles(files.filter(f => f.id !== id));
    toast.success('File removed from Knowledge Base');
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="flex h-full w-full flex-col bg-[#e1e1e1] dark:bg-zinc-950 overflow-hidden relative"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files);
      }}
    >
      <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-black/10 px-8 dark:border-white/10 bg-white dark:bg-zinc-950">
        <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Knowledge
        </h1>
      </header>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8 flex flex-col overflow-y-auto">
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          multiple
          onChange={(e) => handleFileUpload(e.target.files)}
        />

        {/* Main Upload Box Container */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative flex min-h-[52px] w-full items-center gap-1.5 rounded-[5px] border px-3 py-1.5 transition-all duration-300 z-10 cursor-pointer group",
            isDragging 
              ? "border-[#0000ff] bg-[#0000ff]/5 dark:bg-[#0000ff]/10 shadow-[0_0_0_4px_rgba(0,0,255,0.1)]" 
              : "border-zinc-300 bg-white shadow-xs dark:border-zinc-700/80 dark:bg-zinc-800 hover:border-[#0000ff]/50"
          )}
        >
          <div className="w-full flex items-center px-2 py-2">
            <span className={cn(
              "text-[15px] transition-colors",
              isDragging ? "text-[#0000ff] font-medium" : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
            )}>
              {isDragging ? "Drop files here to upload..." : "Click to select or drag & drop files here..."}
            </span>
          </div>

          <button
            type="button"
            className="flex size-10 sm:size-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-[3px] border border-[#0000ff] bg-[#0000ff] text-white transition-all focus:outline-none"
            aria-label="Upload"
          >
            <Upload strokeWidth={2} className="size-3.5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mt-8 mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full min-h-[52px] rounded-[5px] bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700/80 pl-11 pr-4 text-[15px] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-all shadow-xs"
          />
        </div>

        {/* Knowledge List (Floating Style) */}
        <div className="flex flex-col gap-4 pb-24">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="group relative flex min-h-[52px] w-full items-center justify-between gap-4 rounded-[5px] border border-zinc-300 bg-white px-4 py-2 shadow-xs transition-all hover:border-[#0000ff]/50 dark:border-zinc-700/80 dark:bg-zinc-800"
            >
              <div className="flex items-center gap-3 overflow-hidden flex-1">
                <FileIcon className="h-4 w-4 text-zinc-400 shrink-0" />
                <p className="text-[14px] font-medium leading-none text-zinc-900 dark:text-zinc-100 truncate">
                  {file.name}
                </p>
                <p className="text-[12px] text-zinc-500 whitespace-nowrap ml-2 hidden sm:block">
                  {formatSize(file.size)}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider hidden md:block">
                  {new Date(file.createdAt).toLocaleDateString()}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteId(file.id); }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  title="Delete file"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      
        <IosConfirmModal
          isOpen={deleteId !== null}
          title="Delete File"
          description="Are you sure you want to delete this file?"
          confirmText="Delete"
          onCancel={() => setDeleteId(null)}
          onConfirm={() => {
            if (deleteId) handleDelete(deleteId);
            setDeleteId(null);
          }}
        />
      {/* Full-screen Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-[#0000ff]/5 backdrop-blur-[2px] flex items-center justify-center border-4 border-dashed border-[#0000ff]/30 m-4 rounded-xl pointer-events-none">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3">
            <Upload className="h-10 w-10 text-[#0000ff] animate-bounce" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Drop files to upload</h2>
            <p className="text-sm text-zinc-500">Files will be indexed to your Knowledge Base</p>
          </div>
        </div>
      )}
    </div>
  );
}
