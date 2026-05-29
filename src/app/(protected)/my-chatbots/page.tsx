'use client';

export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useState, useRef } from 'react';
import { useBotsStore } from '@/stores/useBotsStore';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import BotRightSidebar from '@/components/panels/BotRightSidebar';
import { InstructionsEditor, GuardrailsEditor, DataEditor } from '@/components/panels/ProjectEditors';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
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
  Terminal,
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
  File,
  Paperclip
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
  const [instructionsList, setInstructionsList] = useState<{ id: string; text: string; timestamp: string }[]>([]);
  const [guardrails, setGuardrails] = useState('');
  const [guardrailsList, setGuardrailsList] = useState<{ id: string; text: string; timestamp: string }[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const botParam = searchParams?.get('bot');
  const threadParam = searchParams?.get('thread');
  const viewParam = searchParams?.get('view');
  
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);



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
    if (!projectName.trim() || (!instructions.trim() && instructionsList.length === 0)) return;

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
        instructions: instructionsList.length > 0 ? instructionsList.map(i => i.text).join('\n\n') : instructions,
        model: 'Gemini 1.5 Pro',
        avatar: '🤖',
        guardrails: guardrailsList.length > 0 ? guardrailsList.map(g => g.text).join('\n\n') : guardrails,
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


      setIsCreating(false);
      setProjectName('');
      setInstructions('');
      setInstructionsList([]);
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

  const handleAddInstruction = () => {
    if (!instructions.trim()) return;
    setInstructionsList([
      { id: Date.now().toString(), text: instructions, timestamp: new Date().toISOString() },
      ...instructionsList
    ]);
    setInstructions('');
  };

  const handleAddGuardrail = () => {
    if (!guardrails.trim()) return;
    setGuardrailsList([
      { id: Date.now().toString(), text: guardrails, timestamp: new Date().toISOString() },
      ...guardrailsList
    ]);
    setGuardrails('');
  };

  // Render Focused Projects Workspace Dashboard (when no active bot)
  if (!activeBot) {
    return (
      <div className="flex-grow w-full bg-[#FCFCFC] dark:bg-zinc-950 h-full flex flex-col relative animate-in fade-in duration-500 overflow-y-auto">
        
        {/* Stepper Progress Bar */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-[600px] select-none px-4 z-20">
          <div className="relative flex items-center justify-between">
            {/* Background track line */}
            <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-gray-200 dark:bg-zinc-800 z-0" />
            
            {/* Active track pipeline line */}
            <div 
              className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-black dark:bg-white transition-all duration-500 z-0"
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
                      if (step === 2 && !projectName.trim()) {
                        setError('Please enter a project name first.');
                        return;
                      } else if (step === 3 && !projectName.trim()) {
                        setError('Please complete the previous steps.');
                        return;
                      } else if (step === 4 && !projectName.trim()) {
                        setError('Please complete the previous steps.');
                        return;
                      }
                      setError('');
                      setCurrentStep(step);
                    }}
                    disabled={
                      isCreating ||
                      (step === 2 && !projectName.trim()) ||
                      (step === 3 && (!projectName.trim())) ||
                      (step === 4 && (!projectName.trim()))
                    }
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 shadow-sm",
                      isCompleted
                        ? "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black hover:scale-105"
                        : isActive
                        ? "bg-white dark:bg-zinc-900 border-black dark:border-white text-black dark:text-white ring-4 ring-gray-200 dark:ring-zinc-800 scale-110 font-bold"
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
                      "absolute top-11 text-[10px] font-normal uppercase tracking-wider transition-colors duration-300 whitespace-nowrap",
                      isActive 
                        ? "text-black dark:text-white font-medium" 
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

        <div className={cn(
          "flex-1 flex flex-col w-full transition-all duration-300",
          (currentStep === 1 || currentStep === 2 || currentStep === 3 || currentStep === 4) ? "items-center justify-center relative z-10" : "items-center justify-center max-w-[640px] mx-auto px-4 pt-20 pb-16"
        )}>
          {error && (
            <p className="w-full text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl mb-4 animate-in slide-in-from-top-1 duration-150 text-center">
              {error}
            </p>
          )}

          {/* Form Step Cards */}
          <div className={cn("w-full", (currentStep !== 1 && currentStep !== 2 && currentStep !== 3 && currentStep !== 4) && "mt-4")}>
            {/* Step 1: Project Name */}
            {currentStep === 1 && (
              <>
                <h1 className="mb-8 text-4xl font-medium text-gray-900 dark:text-white tracking-tight text-center">
                  Enter Project Name
                </h1>

                <div className="flex w-full flex-col">
                  <div className="sticky bottom-0 z-10 w-full px-4 transition-all duration-300 sm:px-6 lg:px-8 py-4 bg-transparent border-t-0">
                    <div className="mx-auto w-full max-w-[796px]">
                      <div className="mx-auto w-full max-w-[796px] space-y-6 px-0">
                        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white px-3 shadow-sm sm:px-4">
                          <div className="relative flex items-center gap-2 py-2">
                            <Textarea
                              name="projectName"
                              value={projectName}
                              onChange={(e) => {
                                setProjectName(e.target.value);
                                setError('');
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey && projectName.trim()) {
                                  e.preventDefault();
                                  setCurrentStep(2);
                                }
                              }}
                              placeholder="Enter project name..."
                              className="min-h-8 w-full flex-1 resize-none border-none bg-transparent px-2 py-2 shadow-none outline-none placeholder:text-sm focus-visible:ring-0"
                              autoFocus
                              rows={1}
                            />

                            <button
                              onClick={() => {
                                if (projectName.trim()) {
                                  setCurrentStep(2);
                                }
                              }}
                              disabled={!projectName.trim()}
                              className="flex cursor-pointer items-center focus:outline-none disabled:cursor-default"
                            >
                              <ArrowUp className={cn(
                                "size-7 flex-shrink-0 rounded-lg border-2 p-1.5 transition-colors",
                                projectName.trim()
                                  ? "border-gray-300 bg-black text-white hover:bg-gray-800"
                                  : "border-gray-200 bg-gray-100 text-gray-400"
                              )} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: System Instructions */}
            {currentStep === 2 && (
              <>
                <h1 className="mb-8 text-4xl font-medium text-gray-900 dark:text-white tracking-tight text-center">
                  Enter Instructions
                </h1>

                <div className="flex w-full flex-col">
                  <div className="sticky bottom-0 z-10 w-full px-4 transition-all duration-300 sm:px-6 lg:px-8 py-4 bg-transparent border-t-0">
                    <div className="mx-auto w-full max-w-[796px]">
                      <div className="mx-auto w-full max-w-[796px] space-y-6 px-0">
                        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white px-3 shadow-sm sm:px-4">
                          <div className="relative flex items-center gap-2 py-2">
                            <button
                              type="button"
                              onClick={() => setCurrentStep(1)}
                              className="flex cursor-pointer items-center focus:outline-none"
                              aria-label="Back"
                            >
                              <ChevronLeft className="size-7 flex-shrink-0 rounded-lg border-2 border-gray-300 bg-black p-1.5 text-white transition-colors hover:bg-gray-800" />
                            </button>
                            <Textarea
                              name="instructions"
                              value={instructions}
                              onChange={(e) => {
                                setInstructions(e.target.value);
                                setError('');
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey && instructions.trim()) {
                                  e.preventDefault();
                                  handleAddInstruction();
                                }
                              }}
                              placeholder="Enter instructions here..."
                              className="min-h-8 w-full flex-1 resize-none border-none bg-transparent px-2 py-2 shadow-none outline-none placeholder:text-sm focus-visible:ring-0"
                              autoFocus
                              rows={1}
                            />

                            <button
                              onClick={() => {
                                if (instructions.trim()) {
                                  handleAddInstruction();
                                }
                              }}
                              disabled={!instructions.trim()}
                              className="flex cursor-pointer items-center focus:outline-none disabled:cursor-default"
                            >
                              <ArrowUp className={cn(
                                "size-7 flex-shrink-0 rounded-lg border-2 p-1.5 transition-colors",
                                instructions.trim()
                                  ? "border-gray-300 bg-black text-white hover:bg-gray-800"
                                  : "border-gray-200 bg-gray-100 text-gray-400"
                              )} />
                            </button>
                          </div>
                        </div>

                        {/* Zero-height wrapper to completely fix title and prompt box layout */}
                        <div className="h-0 w-full relative z-10 !mt-0">
                          {instructionsList.length > 0 && (
                            <>
                              {/* Scrollable list area, fixed height */}
                              <div className="absolute top-0 left-0 w-full mt-3">
                                <div className="space-y-3 h-[180px] overflow-y-auto pr-1 pb-2 custom-scrollbar">
                                  {instructionsList.map((item) => (
                                    <div
                                      key={item.id}
                                      className="group flex items-center justify-between py-3 px-4 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900/30 rounded-2xl shadow-xs transition-all duration-150 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10"
                                    >
                                      <div className="flex items-center gap-3 min-w-0 pr-3 flex-1">
                                        <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-955/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                                          <Terminal className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-relaxed" title={item.text}>
                                            {item.text}
                                          </p>
                                          <span className="text-[9px] text-gray-400 font-medium block mt-0.5 uppercase font-mono tracking-wider">
                                            Prompt Rule • {new Date(item.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                          </span>
                                        </div>
                                      </div>

                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <button
                                            type="button"
                                            className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-none ml-2 flex items-center justify-center cursor-pointer"
                                            title="Delete Custom Prompt"
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </button>
                                        </DialogTrigger>
                                        <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] sm:max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
                                          <div className="px-5 pt-5 pb-4 text-center">
                                            <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                                              Delete Instruction
                                            </h2>
                                            <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                                              Are you sure you want to remove this instruction?
                                            </p>
                                          </div>
                                          <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                                            <DialogClose asChild>
                                              <button className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none">
                                                Cancel
                                              </button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                              <button 
                                                onClick={() => setInstructionsList(instructionsList.filter(i => i.id !== item.id))}
                                                className="flex-1 text-[15px] font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none"
                                              >
                                                Delete
                                              </button>
                                            </DialogClose>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Next Step Button below fixed list */}
                              <div className="absolute top-[224px] left-0 w-full flex justify-center">
                                <button
                                  type="button"
                                  onClick={() => setCurrentStep(3)}
                                  className="flex items-center gap-1.5 px-6 py-3 rounded-full text-sm font-semibold bg-black hover:bg-gray-800 text-white shadow-sm transition-all duration-200 cursor-pointer"
                                >
                                  Next Step <ChevronRight className="size-4" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Guardrails */}
            {currentStep === 3 && (
              <>
                <h1 className="mb-8 text-4xl font-medium text-gray-900 dark:text-white tracking-tight text-center">
                  Enter Guardrails
                </h1>

                <div className="flex w-full flex-col">
                  <div className="sticky bottom-0 z-10 w-full px-4 transition-all duration-300 sm:px-6 lg:px-8 py-4 bg-transparent border-t-0">
                    <div className="mx-auto w-full max-w-[796px]">
                      <div className="mx-auto w-full max-w-[796px] space-y-6 px-0">
                        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white px-3 shadow-sm sm:px-4">
                          <div className="relative flex items-center gap-2 py-2">
                            <button
                              type="button"
                              onClick={() => setCurrentStep(2)}
                              className="flex cursor-pointer items-center focus:outline-none"
                              aria-label="Back"
                            >
                              <ChevronLeft className="size-7 flex-shrink-0 rounded-lg border-2 border-gray-300 bg-black p-1.5 text-white transition-colors hover:bg-gray-800" />
                            </button>
                            <Textarea
                              name="guardrails"
                              value={guardrails}
                              onChange={(e) => {
                                setGuardrails(e.target.value);
                                setError('');
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey && guardrails.trim()) {
                                  e.preventDefault();
                                  handleAddGuardrail();
                                }
                              }}
                              placeholder="Enter guardrails here..."
                              className="min-h-8 w-full flex-1 resize-none border-none bg-transparent px-2 py-2 shadow-none outline-none placeholder:text-sm focus-visible:ring-0"
                              autoFocus
                              rows={1}
                            />

                            <button
                              onClick={() => {
                                if (guardrails.trim()) {
                                  handleAddGuardrail();
                                }
                              }}
                              disabled={!guardrails.trim()}
                              className="flex cursor-pointer items-center focus:outline-none disabled:cursor-default"
                            >
                              <ArrowUp className={cn(
                                "size-7 flex-shrink-0 rounded-lg border-2 p-1.5 transition-colors",
                                guardrails.trim()
                                  ? "border-gray-300 bg-black text-white hover:bg-gray-800"
                                  : "border-gray-200 bg-gray-100 text-gray-400"
                              )} />
                            </button>
                          </div>
                        </div>

                        {/* Zero-height wrapper to completely fix title and prompt box layout */}
                        <div className="h-0 w-full relative z-10 !mt-0">
                          {guardrailsList.length > 0 && (
                            <>
                              {/* Scrollable list area, fixed height */}
                              <div className="absolute top-0 left-0 w-full mt-3">
                                <div className="space-y-3 h-[180px] overflow-y-auto pr-1 pb-2 custom-scrollbar">
                                  {guardrailsList.map((item) => (
                                    <div
                                      key={item.id}
                                      className="group flex items-center justify-between py-3 px-4 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900/30 rounded-2xl shadow-xs transition-all duration-150 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10"
                                    >
                                      <div className="flex items-center gap-3 min-w-0 pr-3 flex-1">
                                        <div className="h-7 w-7 rounded-lg bg-red-50 dark:bg-red-955/40 text-red-650 dark:text-red-400 flex items-center justify-center flex-shrink-0">
                                          <Shield className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-relaxed" title={item.text}>
                                            {item.text}
                                          </p>
                                          <span className="text-[9px] text-gray-400 font-medium block mt-0.5 uppercase font-mono tracking-wider">
                                            Guardrail Rule • {new Date(item.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                          </span>
                                        </div>
                                      </div>

                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <button
                                            type="button"
                                            className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-none ml-2 flex items-center justify-center cursor-pointer"
                                            title="Delete Guardrail"
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </button>
                                        </DialogTrigger>
                                        <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] sm:max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
                                          <div className="px-5 pt-5 pb-4 text-center">
                                            <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                                              Delete Guardrail
                                            </h2>
                                            <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                                              Are you sure you want to remove this guardrail?
                                            </p>
                                          </div>
                                          <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                                            <DialogClose asChild>
                                              <button className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none">
                                                Cancel
                                              </button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                              <button 
                                                onClick={() => setGuardrailsList(guardrailsList.filter(i => i.id !== item.id))}
                                                className="flex-1 text-[15px] font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none"
                                              >
                                                Delete
                                              </button>
                                            </DialogClose>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Next Step Button below fixed list */}
                              <div className="absolute top-[224px] left-0 w-full flex justify-center">
                                <button
                                  type="button"
                                  onClick={() => setCurrentStep(4)}
                                  className="flex items-center gap-1.5 px-6 py-3 rounded-full text-sm font-semibold bg-black hover:bg-gray-800 text-white shadow-sm transition-all duration-200 cursor-pointer"
                                >
                                  Next Step <ChevronRight className="size-4" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Data Ingestion */}
            {currentStep === 4 && (
              <>
                <h1 className="mb-8 text-4xl font-medium text-gray-900 dark:text-white tracking-tight text-center">
                  Upload Data
                </h1>

                <div className="flex w-full flex-col">
                  <div className="sticky bottom-0 z-10 w-full px-4 transition-all duration-300 sm:px-6 lg:px-8 py-4 bg-transparent border-t-0">
                    <div className="mx-auto w-full max-w-[796px]">
                      <div className="mx-auto w-full max-w-[796px] space-y-6 px-0">
                        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white px-3 shadow-sm sm:px-4">
                          <div className="relative flex items-center gap-2 py-2">
                            <button
                              type="button"
                              onClick={() => setCurrentStep(3)}
                              className="flex cursor-pointer items-center focus:outline-none"
                              aria-label="Back"
                            >
                              <ChevronLeft className="size-7 flex-shrink-0 rounded-lg border-2 border-gray-300 bg-black p-1.5 text-white transition-colors hover:bg-gray-800" />
                            </button>
                            
                            <div 
                              className={cn(
                                "min-h-8 w-full flex-1 border-none bg-transparent px-2 py-2 shadow-none outline-none text-sm cursor-pointer transition-colors flex items-center",
                                isDragActive ? "text-blue-500 bg-blue-50/50 rounded-lg" : "text-gray-400 hover:text-gray-600"
                              )}
                              onClick={() => fileInputRef.current?.click()}
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
                            >
                              {isDragActive ? "Drop files here..." : "Click or drag & drop files here..."}
                            </div>
                            
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

                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex cursor-pointer items-center focus:outline-none"
                              aria-label="Upload"
                            >
                              <Paperclip className="size-7 flex-shrink-0 rounded-lg border-2 border-gray-300 bg-black p-1.5 text-white transition-colors hover:bg-gray-800" />
                            </button>
                          </div>
                        </div>

                        {/* Zero-height wrapper to completely fix title and prompt box layout */}
                        <div className="h-0 w-full relative z-10 !mt-0">
                          {selectedFiles.length > 0 && (
                            <div className="absolute top-0 left-0 w-full mt-3">
                              <div className="space-y-3 h-[180px] overflow-y-auto pr-1 pb-2 custom-scrollbar">
                                {selectedFiles.map((file, idx) => (
                                  <div
                                    key={idx}
                                    className="group flex items-center justify-between py-3 px-4 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900/30 rounded-2xl shadow-xs transition-all duration-150 hover:bg-blue-50/20 dark:hover:bg-blue-950/10"
                                  >
                                    <div className="flex items-center gap-3 min-w-0 pr-3 flex-1">
                                      <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-955/40 text-blue-650 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                                        <FileText className="h-4 w-4" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-relaxed" title={file.name}>
                                          {file.name}
                                        </p>
                                        <span className="text-[9px] text-gray-400 font-medium block mt-0.5 uppercase font-mono tracking-wider">
                                          {(file.size / 1024 / 1024).toFixed(2)} MB • {getFileExtension(file.name) || "Document"}
                                        </span>
                                      </div>
                                    </div>

                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <button
                                          type="button"
                                          className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-none ml-2 flex items-center justify-center cursor-pointer"
                                          title="Remove File"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </DialogTrigger>
                                      <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] sm:max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
                                        <div className="px-5 pt-5 pb-4 text-center">
                                          <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                                            Delete Data
                                          </h2>
                                          <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                                            Are you sure you want to remove this data?
                                          </p>
                                        </div>
                                        <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                                          <DialogClose asChild>
                                            <button className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none">
                                              Cancel
                                            </button>
                                          </DialogClose>
                                          <DialogClose asChild>
                                            <button 
                                              onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                                              className="flex-1 text-[15px] font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none"
                                            >
                                              Delete
                                            </button>
                                          </DialogClose>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Create Project Button below fixed list area */}
                          <div className="absolute top-[224px] left-0 w-full flex justify-center">
                            <button
                              type="button"
                              onClick={() => handleCreateProject()}
                              disabled={isCreating}
                              className="flex items-center gap-1.5 px-6 py-3 rounded-full text-sm font-semibold bg-black hover:bg-gray-800 text-white shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
                            >
                              {isCreating ? <Loader2 className="size-4 animate-spin" /> : null}
                              {isCreating ? "Creating..." : "Create Workspace"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
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
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {viewParam === 'instructions' ? (
            <InstructionsEditor bot={activeBot} />
          ) : viewParam === 'guardrails' ? (
            <GuardrailsEditor bot={activeBot} />
          ) : viewParam === 'data' ? (
            <DataEditor bot={activeBot} />
          ) : (
            <FullConversation conversationId={activeBotThreadId || 'new-chat'} />
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
