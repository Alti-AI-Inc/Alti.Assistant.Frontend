'use client';

export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useState, useRef } from 'react';
import { useBotsStore } from '@/stores/useBotsStore';
import { useModalStore } from '@/stores/useModalStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import BotRightSidebar from '@/components/panels/BotRightSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  Plus, 
  Upload, 
  Trash2, 
  FileText, 
  Loader2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadfileToKnowledgeBaseAction } from '@/actions/knowledgeBaseAction';

function MyChatbotsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const { bots, activeBotId, activeBotThreadId, setActiveBotId, setActiveBotThreadId, addBot } = useBotsStore();
  const { setActiveConversation } = useConversationsStore();

  // Form State
  const [projectName, setProjectName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [guardrails, setGuardrails] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  // Read URL params
  const botParam = searchParams?.get('bot');
  const threadParam = searchParams?.get('thread');

  // Sync state with URL params
  useEffect(() => {
    if (botParam) {
      setActiveBotId(botParam);
    } else {
      setActiveBotId(null);
    }

    if (threadParam) {
      setActiveBotThreadId(threadParam);
    } else {
      setActiveBotThreadId(null);
      setActiveConversation(null);
    }
  }, [botParam, threadParam, setActiveBotId, setActiveBotThreadId, setActiveConversation]);

  const activeBot = bots.find((b) => b.id === activeBotId);

  // File Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  // Form Submission
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setError('Please provide a project name.');
      return;
    }
    if (!instructions.trim()) {
      setError('Please provide system instructions/prompt.');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // 1. Create Bot / Project
      const newBot = addBot({
        name: projectName,
        description: 'Isolated Custom Project Workspace',
        instructions,
        guardrails: guardrails || undefined,
        model: 'Gemini 1.5 Pro',
        avatar: '🤖',
      });

      // 2. Upload Files to Project
      if (selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          setUploadProgress(`Uploading ${i + 1}/${selectedFiles.length}: ${file.name}...`);
          
          const formData = new FormData();
          formData.append('file', file);
          formData.append('knowledgebotId', newBot.id);

          const response = await uploadfileToKnowledgeBaseAction(
            formData,
            session?.accessToken as string,
          );

          if (!response.success) {
            console.error(`Failed to upload ${file.name}:`, response.debugMessage);
            toast.error(`Failed to upload ${file.name}`);
          }
        }
      }

      toast.success('Project Workspace successfully initialized!');
      
      // Invalidate queries for RAG files
      queryClient.invalidateQueries({
        queryKey: ['knowledgeBasesFiles', newBot.id, session?.accessToken],
      });

      // 3. Select newly created bot/project and route to it
      setActiveBotId(newBot.id);
      router.push(`/my-chatbots?bot=${newBot.id}`);

      // Reset Form State
      setProjectName('');
      setInstructions('');
      setGuardrails('');
      setSelectedFiles([]);

    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err.message || 'An error occurred during project workspace creation.');
    } finally {
      setIsCreating(false);
      setUploadProgress(null);
    }
  };

  // Render Focused Projects Workspace Dashboard (when no active bot)
  if (!activeBot) {
    return (
      <div className="flex-grow overflow-y-auto w-full bg-[#FCFCFC] dark:bg-zinc-950 h-full flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
        <form onSubmit={handleCreateProject} className="w-full max-w-2xl space-y-6">
          
          {error && (
            <p className="text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl animate-in slide-in-from-top-1 duration-150">
              {error}
            </p>
          )}

          {/* Section 1: Project Name */}
          <div className="bg-white dark:bg-zinc-900/60 border border-black/5 dark:border-zinc-800/80 shadow-xs hover:shadow-md transition-all duration-300 rounded-2xl p-6 space-y-2">
            <Label htmlFor="projectName" className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Project Name</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                setError('');
              }}
              placeholder="e.g. Q1 Financial Audit, Code Quality Sandbox"
              className="rounded-xl border-gray-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-950/40 text-sm h-11 transition-all duration-200"
            />
          </div>

          {/* Section 2: Instructions */}
          <div className="bg-white dark:bg-zinc-900/60 border border-black/5 dark:border-zinc-800/80 shadow-xs hover:shadow-md transition-all duration-300 rounded-2xl p-6 space-y-2">
            <Label htmlFor="instructions" className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Instructions</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => {
                setInstructions(e.target.value);
                setError('');
              }}
              placeholder="Define your agent's specialized role, system instructions, and knowledge scope for this project..."
              className="min-h-[120px] rounded-xl border-gray-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-950/40 text-xs leading-relaxed transition-all duration-200"
            />
          </div>

          {/* Section 3: Guardrails */}
          <div className="bg-white dark:bg-zinc-900/60 border border-black/5 dark:border-zinc-800/80 shadow-xs hover:shadow-md transition-all duration-300 rounded-2xl p-6 space-y-2">
            <Label htmlFor="guardrails" className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Guardrails</Label>
            <Textarea
              id="guardrails"
              value={guardrails}
              onChange={(e) => setGuardrails(e.target.value)}
              placeholder="Specify boundary safety limits, restricted topics, or PII redaction requirements..."
              className="min-h-[90px] rounded-xl border-gray-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-950/40 text-xs leading-relaxed transition-all duration-200"
            />
          </div>

          {/* Section 4: Data */}
          <div className="bg-white dark:bg-zinc-900/60 border border-black/5 dark:border-zinc-800/80 shadow-xs hover:shadow-md transition-all duration-300 rounded-2xl p-6 space-y-4">
            <Label className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Data</Label>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-black/[0.01] dark:hover:bg-white/[0.01]",
                isDragActive
                  ? "border-blue-500 bg-blue-500/5"
                  : "border-gray-200 dark:border-zinc-800 bg-transparent"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="h-6 w-6 text-gray-400 dark:text-zinc-500" />
              <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Drag & drop files here, or click to browse</span>
              <span className="text-[10px] text-gray-400">Supports PDF, TXT, DOCX, CSV, Excel (up to 100MB per file)</span>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-1.5 pt-2 max-h-40 overflow-y-auto">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border border-black/5 dark:border-zinc-800 bg-black/[0.01] dark:bg-white/[0.01] rounded-xl px-3.5 py-2.5 animate-in slide-in-from-top-1 duration-150"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-800 dark:text-zinc-350 truncate max-w-xs">{file.name}</span>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(idx);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Floating Action Bar */}
          <div className="flex justify-end items-center pt-2">
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 text-xs font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 flex items-center gap-2 select-none hover:scale-[1.01] transition-all duration-200"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {uploadProgress || 'Creating Project Workspace...'}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Project Workspace
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Render 3-Column Chatbot Workspace
  return (
    <div className="flex h-full w-full bg-[#FCFCFC] dark:bg-gray-950 overflow-hidden">
      {/* Center Panel (Conversation / Interface) */}
      <div
        className="flex-1 flex flex-col min-w-0 h-full relative"
        style={{ backgroundColor: '#FCFCFC' }}
      >
        {/* Chatbot Content Body */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden relative">
          {!activeBotThreadId && (
            <h1 className="mb-8 text-4xl font-medium text-gray-900 dark:text-white tracking-tight">
              {activeBot.name}
            </h1>
          )}

          <FullConversation conversationId={activeBotThreadId || 'new-chat'} />

          {!activeBotThreadId && (
            <p className="absolute bottom-3 text-xs text-neutral-500">
              We don&apos;t train on your data. Your chats stay private.
            </p>
          )}
        </div>
      </div>

      {/* Right Column (Bot Specific Details & Timeline) */}
      <BotRightSidebar botId={activeBot.id} activeThreadId={activeBotThreadId} />
    </div>
  );
}

export default function MyChatbotsPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          Loading Chatbot Workspace...
        </div>
      </div>
    }>
      <MyChatbotsContent />
    </Suspense>
  );
}
