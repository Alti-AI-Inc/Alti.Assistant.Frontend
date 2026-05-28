'use client';

export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useState, useRef } from 'react';
import { useBotsStore } from '@/stores/useBotsStore';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import BotRightSidebar from '@/components/panels/BotRightSidebar';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { 
  createKnowledgeBaseAction, 
  uploadfileToKnowledgeBaseAction 
} from '@/actions/knowledgeBaseAction';
import { 
  Plus, 
  ArrowUp,
  Loader2,
  User, 
  FileText, 
  Shield, 
  Upload, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  FileSpreadsheet,
  FileType,
  Image as ImageIcon,
  Presentation,
  File
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper functions for file previews
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return <FileText className="size-5 text-red-500" />;
    case 'doc':
    case 'docx':
      return <FileType className="size-5 text-blue-500" />;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <FileSpreadsheet className="size-5 text-green-600" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return <ImageIcon className="size-5 text-purple-500" />;
    case 'ppt':
    case 'pptx':
      return <Presentation className="size-5 text-orange-500" />;
    default:
      return <File className="size-5 text-gray-500" />;
  }
};

const getFileExtension = (fileName: string) => {
  return fileName.split('.').pop()?.toUpperCase() || 'FILE';
};

function MyChatbotsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { bots, activeBotId, activeBotThreadId, setActiveBotId, setActiveBotThreadId, addBot } = useBotsStore();
  const { setActiveConversation } = useConversationsStore();

  // Wizard States
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [projectName, setProjectName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [guardrails, setGuardrails] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

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

  // Form Submission
  const handleCreateProject = async () => {
    if (!projectName.trim() || !instructions.trim()) return;

    setIsCreating(true);
    setError('');

    try {
      let backendId = '';
      
      // 1. If authenticated, create a backend knowledgebase
      if (session?.accessToken) {
        console.log('[Wizard] Creating backend knowledge base:', projectName);
        const kbResponse = await createKnowledgeBaseAction(projectName, session.accessToken);
        if (kbResponse.success && kbResponse.data?.id) {
          backendId = kbResponse.data.id;
          console.log('[Wizard] Backend knowledge base created with ID:', backendId);
        } else {
          console.warn('[Wizard] Failed to create backend knowledge base:', kbResponse.message);
        }
      }

      // 2. Add local bot to Zustand store
      const newBot = addBot({
        name: projectName,
        description: `Custom Project Workspace: ${projectName}`,
        instructions: instructions,
        model: 'Gemini 1.5 Pro',
        avatar: '🤖',
        guardrails: guardrails,
        data: backendId || undefined, // Save the backend knowledgebase ID in the 'data' field!
      });

      // 3. Sequentially upload files to the knowledgebase if files are selected
      if (selectedFiles.length > 0 && backendId && session?.accessToken) {
        console.log('[Wizard] Sequentially uploading files to knowledge base:', backendId);
        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('knowledgebotId', backendId);
          
          try {
            const uploadRes = await uploadfileToKnowledgeBaseAction(formData, session.accessToken);
            if (uploadRes.success) {
              console.log('[Wizard] File successfully uploaded:', file.name);
            } else {
              console.error('[Wizard] File upload failed:', file.name, uploadRes.message);
            }
          } catch (uploadErr) {
            console.error('[Wizard] File upload error:', file.name, uploadErr);
          }
        }

        // Invalidate knowledge base query cache
        queryClient.invalidateQueries({
          queryKey: ['knowledgeBasesFiles', backendId, session.accessToken],
        });
      }

      toast.success('Project Workspace successfully initialized!');

      // Reset Wizard
      setProjectName('');
      setInstructions('');
      setGuardrails('');
      setSelectedFiles([]);
      setCurrentStep(1);

      // 4. Select new bot and route to active view
      setActiveBotId(newBot.id);
      router.push(`/my-chatbots?bot=${newBot.id}`);
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err.message || 'An error occurred during project workspace creation.');
      toast.error('Failed to fully initialize the project workspace.');
    } finally {
      setIsCreating(false);
    }
  };

  // Render Focused Projects Workspace Dashboard (when no active bot)
  if (!activeBot) {
    return (
      <div className="flex-grow overflow-y-auto w-full bg-[#FCFCFC] dark:bg-zinc-950 h-full flex flex-col items-center justify-start py-16 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
        <div className="mx-auto w-full max-w-[640px] px-4 flex flex-col items-center">
          
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-8 text-center select-none flex items-center gap-2">
            <Sparkles className="size-6 text-blue-600 dark:text-blue-500 animate-pulse" />
            Create Project Workspace
          </h1>

          {/* Stepper Progress Bar */}
          <div className="w-full mb-10 select-none px-2">
            <div className="relative flex items-center justify-between">
              {/* Background track line */}
              <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-gray-200 dark:bg-zinc-800 z-0" />
              
              {/* Active track pipeline line */}
              <div 
                className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 z-0"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />

              {[
                { step: 1, label: 'Name', icon: User },
                { step: 2, label: 'Instructions', icon: FileText },
                { step: 3, label: 'Guardrails', icon: Shield },
                { step: 4, label: 'Data', icon: Upload },
              ].map(({ step, label, icon: Icon }) => {
                const isCompleted = currentStep > step;
                const isActive = currentStep === step;
                return (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => {
                        // Only allow clicking completed steps or the next one if valid
                        if (step < currentStep) {
                          setCurrentStep(step);
                        } else if (step === 2 && projectName.trim()) {
                          setCurrentStep(2);
                        } else if (step === 3 && projectName.trim() && instructions.trim()) {
                          setCurrentStep(3);
                        } else if (step === 4 && projectName.trim() && instructions.trim()) {
                          setCurrentStep(4);
                        }
                      }}
                      disabled={step > currentStep && (
                        (step === 2 && !projectName.trim()) ||
                        (step === 3 && (!projectName.trim() || !instructions.trim())) ||
                        (step === 4 && (!projectName.trim() || !instructions.trim()))
                      )}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 shadow-sm",
                        isCompleted
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-indigo-600 text-white hover:scale-105"
                          : isActive
                          ? "bg-white dark:bg-zinc-900 border-blue-600 text-blue-600 dark:text-blue-500 ring-4 ring-blue-100 dark:ring-blue-950/50 scale-110 font-bold"
                          : "bg-gray-50 dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 cursor-not-allowed"
                      )}
                      title={`Step ${step}: ${label}`}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </button>
                    <span 
                      className={cn(
                        "absolute top-11 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 whitespace-nowrap",
                        isActive 
                          ? "text-blue-600 dark:text-blue-500 font-extrabold" 
                          : isCompleted 
                          ? "text-gray-800 dark:text-zinc-200" 
                          : "text-gray-400 dark:text-zinc-500"
                      )}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="w-full text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl mb-4 animate-in slide-in-from-top-1 duration-150 text-center">
              {error}
            </p>
          )}

          {/* Form Step Cards */}
          <div className="w-full mt-4">
            {/* Step 1: Project Name */}
            {currentStep === 1 && (
              <div className="w-full flex flex-col rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 shadow-md transition-all duration-300 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <User className="size-5 text-blue-600 dark:text-blue-500" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100">Name your Project Workspace</h2>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                  Choose a clear and unique title for your isolated project. This helps categorize conversations, document indices, and prompt guidelines.
                </p>
                
                <div className="relative flex items-center h-12 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 dark:focus-within:ring-blue-900/50">
                  <input
                    type="text"
                    placeholder="e.g. Q3 Sales Expansion, Contract Review Pipeline"
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                      setError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && projectName.trim()) {
                        e.preventDefault();
                        setCurrentStep(2);
                      }
                    }}
                    className="w-full bg-transparent text-sm text-gray-800 dark:text-zinc-100 outline-none placeholder:text-gray-400 focus:outline-none focus:ring-0"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    disabled={!projectName.trim()}
                    onClick={() => setCurrentStep(2)}
                    className={cn(
                      "flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 text-white",
                      projectName.trim()
                        ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        : "bg-gray-300 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed opacity-50"
                    )}
                  >
                    Next Step <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: System Instructions */}
            {currentStep === 2 && (
              <div className="w-full flex flex-col rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 shadow-md transition-all duration-300 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="size-5 text-blue-600 dark:text-blue-500" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100">Set System Instructions</h2>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                  Define the specialized personality, role constraints, and prompt objectives for this AI workspace. This functions as the core directive for the model.
                </p>
                
                <div className="relative flex flex-col rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 dark:focus-within:ring-blue-900/50">
                  <Textarea
                    placeholder="e.g. You are a Senior Financial Copywriter. Analyze our Q3 reports and write high-impact marketing slogans. Maintain a highly professional tone and always emphasize compliance and growth metrics."
                    value={instructions}
                    onChange={(e) => {
                      setInstructions(e.target.value);
                      setError('');
                    }}
                    className="min-h-[140px] w-full resize-none border-none bg-transparent px-1 py-1 shadow-none outline-none placeholder:text-xs text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0 text-gray-800 dark:text-zinc-100"
                    autoFocus
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
                  >
                    <ChevronLeft className="size-3.5" /> Back
                  </button>
                  <button
                    type="button"
                    disabled={!instructions.trim()}
                    onClick={() => setCurrentStep(3)}
                    className={cn(
                      "flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 text-white",
                      instructions.trim()
                        ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        : "bg-gray-300 dark:bg-zinc-800 text-gray-400 dark:text-zinc-650 cursor-not-allowed opacity-50"
                    )}
                  >
                    Next Step <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Guardrails */}
            {currentStep === 3 && (
              <div className="w-full flex flex-col rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 shadow-md transition-all duration-300 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="size-5 text-blue-600 dark:text-blue-500" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100">Add Safety Guardrails (Optional)</h2>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                  Define negative guidelines, restricted topics, or strict styling rules. Guardrails ensure that your AI assistant stays inside its designated boundary.
                </p>
                
                <div className="relative flex flex-col rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 dark:focus-within:ring-blue-900/50">
                  <Textarea
                    placeholder="e.g. Never discuss pricing structures of competitors. If asked about competitor fees, politely redirect to our pricing page. Do not write codes or scripts under any circumstances."
                    value={guardrails}
                    onChange={(e) => setGuardrails(e.target.value)}
                    className="min-h-[140px] w-full resize-none border-none bg-transparent px-1 py-1 shadow-none outline-none placeholder:text-xs text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0 text-gray-800 dark:text-zinc-100"
                    autoFocus
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
                  >
                    <ChevronLeft className="size-3.5" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    Next Step <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Data Ingestion */}
            {currentStep === 4 && (
              <div className="w-full flex flex-col rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 shadow-md transition-all duration-300 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Upload className="size-5 text-blue-600 dark:text-blue-500" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100">Ingest Reference Data (Optional)</h2>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                  Drop spreadsheets, contracts, research articles, or reference PDFs here. Your workspace will search, extract, and ground responses using this custom knowledge base.
                </p>
                
                {/* Drag and Drop Box */}
                <div
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
                      setSelectedFiles((prev) => [...prev, ...filesArray]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300",
                    isDragActive
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                      : "border-gray-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-zinc-500 bg-gray-50/30 dark:bg-zinc-950/10"
                  )}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        const filesArray = Array.from(e.target.files);
                        setSelectedFiles((prev) => [...prev, ...filesArray]);
                      }
                    }}
                    className="hidden"
                  />
                  
                  <div className="p-3 bg-white dark:bg-zinc-900 rounded-full border border-gray-200 dark:border-zinc-800 shadow-xs">
                    <Upload className="h-6 w-6 text-gray-500 dark:text-zinc-400" />
                  </div>
                  
                  <div className="text-center">
                    <span className="text-xs font-semibold text-gray-800 dark:text-zinc-200">
                      Click to upload or drag & drop files
                    </span>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1">
                      Supports PDF, TXT, CSV, DOCX, XLSX up to 10MB
                    </p>
                  </div>
                </div>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="mt-5 space-y-2 border-t border-black/5 dark:border-zinc-800 pt-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Selected Documents ({selectedFiles.length})
                    </span>
                    <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                      {selectedFiles.map((file, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-150 dark:border-zinc-900 animate-in slide-in-from-top-1 duration-150"
                        >
                          <div className="flex items-center gap-2 truncate flex-1 mr-2">
                            {getFileIcon(file.name)}
                            <div className="flex flex-col truncate">
                              <span className="text-xs font-semibold text-gray-800 dark:text-zinc-200 truncate">{file.name}</span>
                              <span className="text-[9px] text-gray-400">
                                {getFileExtension(file.name)} • {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="p-1 rounded-lg hover:bg-red-500/10 hover:text-red-500 text-gray-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    disabled={isCreating}
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <ChevronLeft className="size-3.5" /> Back
                  </button>
                  
                  <button
                    type="button"
                    disabled={isCreating}
                    onClick={() => handleCreateProject()}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm transition-all duration-200 disabled:opacity-85 cursor-pointer"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1 text-white" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Project Workspace <ChevronRight className="size-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
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
