'use client';

export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useState, useRef } from 'react';
import { useBotsStore } from '@/stores/useBotsStore';
import { useConversationsStore, OPTIONS } from '@/stores/useConverstionsStore';
import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import BotRightSidebar from '@/components/panels/BotRightSidebar';
import { InstructionsEditor, GuardrailsEditor, DataEditor } from '@/components/panels/ProjectEditors';
import SpaceInboxView from '@/components/panels/SpaceInboxView';
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
  Search,
  Sparkles, 
  AlertCircle,
  FileSpreadsheet,
  FileType,
  Image as ImageIcon,
  Presentation,
  File,
  Paperclip,
  Cpu
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

  const { bots, activeBotId, activeBotThreadId, setActiveBotId, setActiveBotThreadId, addBotAsync, projectTab } = useBotsStore();
  const { setActiveConversation, activeConversation, selectedOption, setSelectedOption } = useConversationsStore();

  const hasMessages = !!activeConversation?.messages?.length;

  // Wizard States
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [projectName, setProjectName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [instructionsList, setInstructionsList] = useState<{ id: string; text: string; timestamp: string }[]>([]);
  const [guardrails, setGuardrails] = useState('');
  const [guardrailsList, setGuardrailsList] = useState<{ id: string; text: string; timestamp: string }[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const [instructionsSearch, setInstructionsSearch] = useState('');
  const [guardrailsSearch, setGuardrailsSearch] = useState('');
  const [dataSearch, setDataSearch] = useState('');
  
  const botParam = searchParams?.get('bot');
  const threadParam = searchParams?.get('thread');
  const viewParam = searchParams?.get('view');
  
  const [isCreating, setIsCreating] = useState(false);
  const [isRetryingTuning, setIsRetryingTuning] = useState(false);
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

  // Poll tuning status for active chatbot if status is 'tuning'
  useEffect(() => {
    if (!activeBot || activeBot.metadata?.status !== 'tuning' || !session?.accessToken) return;

    let isSubscribed = true;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://altihq.com/api/v1';

    const checkStatus = async () => {
      try {
        const res = await fetch(`${apiUrl}/chatbots/${activeBot.id}/tuning-status`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });
        if (!res.ok) return;

        const data = await res.json();
        if (!isSubscribed) return;

        // If status or jobId or error changed, update the store
        if (data?.success && data.data) {
          const newStatus = data.data.status; // 'tuning' | 'ready' | 'failed'
          const newJobId = data.data.jobId;
          const newError = data.data.tuningError;
          const newDatasetUri = data.data.tuningDatasetUri;

          const currentMeta = activeBot.metadata || {};
          if (
            currentMeta.status !== newStatus ||
            currentMeta.jobId !== newJobId ||
            currentMeta.tuningError !== newError ||
            currentMeta.tuningDatasetUri !== newDatasetUri
          ) {
            console.log('[Tuning Poll] Status updated:', newStatus);
            useBotsStore.getState().editBot(activeBot.id, {
              metadata: {
                status: newStatus,
                jobId: newJobId,
                tuningError: newError,
                tuningDatasetUri: newDatasetUri,
              },
            }, session.accessToken);
            
            if (newStatus === 'ready') {
              toast.success('Your custom model is fully trained and ready to use!');
            } else if (newStatus === 'failed') {
              toast.error(`Model training failed: ${newError || 'Unknown error'}`);
            }
          }
        }
      } catch (err) {
        console.error('Error polling tuning status:', err);
      }
    };

    // Poll every 15 seconds
    const intervalId = setInterval(checkStatus, 15000);
    // Also run immediately on status change to 'tuning'
    checkStatus();

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    };
  }, [activeBotId, activeBot?.metadata?.status, session?.accessToken]);

  // Model Retry Submission
  const handleRetryTuning = async () => {
    if (!activeBot || !session?.accessToken) return;
    
    setIsRetryingTuning(true);
    try {
      toast.info('Initiating model training retry...');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://altihq.com/api/v1';
      const res = await fetch(`${apiUrl}/chatbots/${activeBot.id}/tune`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      if (res.ok) {
        toast.success('Model fine-tuning has been restarted.');
        // Update local status to tuning immediately so UI updates
        const updatedMetadata = {
          ...activeBot.metadata,
          status: 'tuning' as const,
          tuningError: undefined,
        };
        useBotsStore.getState().editBot(activeBot.id, { metadata: updatedMetadata }, session.accessToken);
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(`Failed to restart training: ${errData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to communicate with tuning service.');
    } finally {
      setIsRetryingTuning(false);
    }
  };

  // Form Submission
  const handleCreateProject = async () => {
    if (!projectName.trim() || (!instructions.trim() && instructionsList.length === 0)) return;

    if (projectTab === 'team' && selectedFiles.length === 0) {
      setError('Please upload at least one training file to fine-tune your model.');
      return;
    }

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
      const newBot = await addBotAsync({
        name: projectName,
        description: projectTab === 'team' ? `Custom Model Workspace: ${projectName}` : `Custom Project Workspace: ${projectName}`,
        instructions: instructionsList.length > 0 ? instructionsList.map(i => i.text).join('\n\n') : instructions,
        model: 'Gemini 1.5 Pro',
        avatar: '🤖',
        guardrails: guardrailsList.length > 0 ? guardrailsList.map(g => g.text).join('\n\n') : guardrails,
        data: backendId || undefined, // Save the backend knowledgebase ID in the 'data' field!
        isShared: projectTab === 'team',
      }, session?.accessToken || undefined);

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

      // 4. Trigger model tuning if it is a Model tab creation and we have backend access
      if (projectTab === 'team' && newBot && newBot.id && !newBot.id.startsWith('bot_') && session?.accessToken) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://altihq.com/api/v1';
          const tuneRes = await fetch(`${apiUrl}/chatbots/${newBot.id}/tune`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            },
          });
          if (tuneRes.ok) {
            toast.success('Model fine-tuning has been triggered successfully.');
          } else {
            const errData = await tuneRes.json().catch(() => ({}));
            console.error('Failed to trigger tuning:', errData);
            toast.error(`Failed to trigger model fine-tuning: ${errData.message || 'Unknown error'}`);
          }
        } catch (tuneErr) {
          console.error('[Wizard] SFT triggering error:', tuneErr);
          toast.error('Connection error: Failed to trigger model fine-tuning.');
        }
      }

      setIsCreating(false);
      setProjectName('');
      setInstructions('');
      setInstructionsList([]);
      setGuardrails('');
      setGuardrailsList([]);
      setSelectedFiles([]);
      setCurrentStep(1);

      // 5. Select new bot and route to active view
      setActiveBotId(newBot.id);
      router.push(`/spaces?bot=${newBot.id}`);
    } catch (err: any) {
      console.error('Error creating space:', err);
      setError(err.message || 'An error occurred during space workspace creation.');
      toast.error('Failed to fully initialize the space workspace.');
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
      <div className="flex-grow w-full bg-[#e1e1e1] dark:bg-zinc-950 h-full flex flex-col relative animate-in fade-in duration-500 overflow-y-auto">
        
        {/* Stepper Progress Bar */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2 w-full max-w-[796px] select-none px-4 z-20">
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
              { step: 4, label: 'Knowledge', icon: Upload },
            ].map(({ step, label, icon: Icon }) => {
              const isCompleted = currentStep > step;
              const isActive = currentStep === step;
              return (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 2 && !projectName.trim()) {
                        setError(projectTab === 'team' ? 'Please enter a model name first.' : 'Please enter a project name first.');
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
          (currentStep === 1 || currentStep === 2 || currentStep === 3 || currentStep === 4) ? "items-center justify-center relative z-10 pb-20" : "items-center justify-center max-w-[640px] mx-auto px-4 pt-20 pb-16"
        )}>
          {error && (
            <p className="w-full text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl mb-4 animate-in slide-in-from-top-1 duration-150 text-center">
              {error}
            </p>
          )}

          {/* Form Step Cards */}
          <div className={cn("w-full", (currentStep !== 1 && currentStep !== 2 && currentStep !== 3 && currentStep !== 4) && "mt-4")}>
            {/* Step 1: Space/Project/Model Name */}
            {currentStep === 1 && (
              <>
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
                              placeholder={projectTab === 'team' ? "Enter model name..." : "Enter space name..."}
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

                        {/* Search Bar */}
                        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white px-3 shadow-sm sm:px-4">
                          <div className="relative flex items-center gap-2 py-2">
                            <Search className="size-5 text-gray-400 flex-shrink-0 ml-1" />
                            <input
                              type="text"
                              value={instructionsSearch}
                              onChange={(e) => setInstructionsSearch(e.target.value)}
                              placeholder="Search instructions..."
                              className="h-8 w-full flex-1 border-none bg-transparent px-2 py-0 shadow-none outline-none placeholder:text-sm focus-visible:ring-0"
                            />
                          </div>
                        </div>

                        {/* Zero-height wrapper to completely fix title and prompt box layout */}
                        <div className="h-0 w-full relative z-10 !mt-0">
                          {instructionsList.length > 0 && (
                            <>
                              {/* Scrollable list area, fixed height */}
                              <div className="absolute top-0 left-0 w-full mt-3">
                                <div className="space-y-3 h-[180px] overflow-y-auto pr-1 pb-2 custom-scrollbar">
                                  {instructionsList
                                    .filter(item => item.text.toLowerCase().includes(instructionsSearch.toLowerCase()))
                                    .map((item) => (
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

                        {/* Search Bar */}
                        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white px-3 shadow-sm sm:px-4">
                          <div className="relative flex items-center gap-2 py-2">
                            <Search className="size-5 text-gray-400 flex-shrink-0 ml-1" />
                            <input
                              type="text"
                              value={guardrailsSearch}
                              onChange={(e) => setGuardrailsSearch(e.target.value)}
                              placeholder="Search guardrails..."
                              className="h-8 w-full flex-1 border-none bg-transparent px-2 py-0 shadow-none outline-none placeholder:text-sm focus-visible:ring-0"
                            />
                          </div>
                        </div>

                        {/* Zero-height wrapper to completely fix title and prompt box layout */}
                        <div className="h-0 w-full relative z-10 !mt-0">
                          {guardrailsList.length > 0 && (
                            <>
                              {/* Scrollable list area, fixed height */}
                              <div className="absolute top-0 left-0 w-full mt-3">
                                <div className="space-y-3 h-[180px] overflow-y-auto pr-1 pb-2 custom-scrollbar">
                                  {guardrailsList
                                    .filter(item => item.text.toLowerCase().includes(guardrailsSearch.toLowerCase()))
                                    .map((item) => (
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

            {/* Step 4: Knowledge Ingestion */}
            {currentStep === 4 && (
              <>
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

                        {/* Search Bar */}
                        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white px-3 shadow-sm sm:px-4 mt-4">
                          <div className="relative flex items-center gap-2 py-2">
                            <Search className="size-5 text-gray-400 flex-shrink-0 ml-1" />
                            <input
                              type="text"
                              value={dataSearch}
                              onChange={(e) => setDataSearch(e.target.value)}
                              placeholder="Search files..."
                              className="h-8 w-full flex-1 border-none bg-transparent px-2 py-0 shadow-none outline-none placeholder:text-sm focus-visible:ring-0"
                            />
                          </div>
                        </div>

                        {/* Zero-height wrapper to completely fix title and prompt box layout */}
                        <div className="h-0 w-full relative z-10 !mt-0">
                          {selectedFiles.length > 0 && (
                            <div className="absolute top-0 left-0 w-full mt-3">
                              <div className="space-y-3 h-[180px] overflow-y-auto pr-1 pb-2 custom-scrollbar">
                                {selectedFiles
                                  .map((f, i) => ({ file: f, originalIndex: i }))
                                  .filter(item => item.file.name.toLowerCase().includes(dataSearch.toLowerCase()))
                                  .map(({ file, originalIndex: idx }) => (
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

                          {/* Create Space Button below fixed list area */}
                          <div className="absolute top-[224px] left-0 w-full flex flex-col items-center justify-center gap-2">
                            {projectTab === 'team' && selectedFiles.length === 0 && (
                              <p className="text-xs text-amber-500 font-medium flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full mb-1">
                                <AlertCircle className="size-3.5" />
                                Please upload at least one training file to fine-tune your model.
                              </p>
                            )}
                            <button
                              type="button"
                              onClick={() => handleCreateProject()}
                              disabled={isCreating || (projectTab === 'team' && selectedFiles.length === 0)}
                              className="flex items-center gap-1.5 px-6 py-3 rounded-full text-sm font-semibold bg-black hover:bg-gray-800 text-white shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isCreating ? <Loader2 className="size-4 animate-spin" /> : null}
                              {isCreating ? "Creating..." : projectTab === 'team' ? "Create Model" : "Create Space"}
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

  const isEditorView = 
    viewParam === 'instructions' || selectedOption === OPTIONS.INSTRUCTIONS ||
    viewParam === 'guardrails' || selectedOption === OPTIONS.GUARDRAILS ||
    viewParam === 'data' || selectedOption === OPTIONS.KNOWLEDGE ||
    selectedOption === OPTIONS.INBOX;

  const isChatView = 
    !isEditorView && 
    activeBot.metadata?.status !== 'tuning' && 
    activeBot.metadata?.status !== 'failed';

  // Render 3-Column Chatbot Workspace
  return (
    <div className="flex h-full w-full bg-[#e1e1e1] dark:bg-zinc-950 overflow-hidden">
      {/* Center Panel (Conversation / Interface) */}
      <div
        className="flex-1 flex flex-col min-w-0 h-full relative bg-[#e1e1e1] dark:bg-zinc-950"
      >
        {/* Chatbot Content Body */}
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden relative",
          isChatView
            ? "w-full h-full items-stretch justify-start"
            : cn(
                "items-center justify-center",
                (viewParam !== 'instructions' && selectedOption !== OPTIONS.INSTRUCTIONS) && 
                (viewParam !== 'guardrails' && selectedOption !== OPTIONS.GUARDRAILS) && 
                (viewParam !== 'data' && selectedOption !== OPTIONS.KNOWLEDGE) && 
                selectedOption !== OPTIONS.INBOX &&
                !hasMessages && "pb-40"
              )
        )}>
          {viewParam === 'instructions' || selectedOption === OPTIONS.INSTRUCTIONS ? (
            <InstructionsEditor bot={activeBot} />
          ) : viewParam === 'guardrails' || selectedOption === OPTIONS.GUARDRAILS ? (
            <GuardrailsEditor bot={activeBot} />
          ) : viewParam === 'data' || selectedOption === OPTIONS.KNOWLEDGE ? (
            <DataEditor bot={activeBot} />
          ) : selectedOption === OPTIONS.INBOX ? (
            <SpaceInboxView botId={activeBot.id} />
          ) : activeBot.metadata?.status === 'tuning' ? (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto h-full animate-in fade-in duration-300">
              <div className="relative mb-8 flex items-center justify-center">
                {/* Pulsing ring animation */}
                <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="relative size-24 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl flex items-center justify-center">
                  <Cpu className="size-10 text-indigo-600 dark:text-indigo-400 animate-bounce" style={{ animationDuration: '2.5s' }} />
                  {/* Decorative star */}
                  <Sparkles className="absolute top-1 right-1 size-5 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-3 tracking-tight">
                Model Training in Progress...
              </h2>
              
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed max-w-sm">
                We are training a custom model for you on Google Cloud Vertex AI. This process runs fully in the background and can take 10-20 minutes.
              </p>

              {/* Status Steps checklist */}
              <div className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 shadow-sm space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="size-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    <Check className="size-3" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Dataset creation</p>
                    <p className="text-[10px] text-zinc-400">Generated training examples from uploaded documents.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="size-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    <Check className="size-3" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Google Cloud Storage upload</p>
                    <p className="text-[10px] text-zinc-400">Saved training JSONL to secure GCS bucket.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Loader2 className="size-3 animate-spin" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Vertex AI Pipeline SFT Run</p>
                    <p className="text-[10px] text-zinc-550 dark:text-zinc-400">Tuning foundation model <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-[9px]">gemini-1.5-flash</code>...</p>
                  </div>
                </div>
              </div>

              <span className="text-[10px] text-zinc-400 font-mono mt-6 uppercase tracking-wider block">
                Job ID: {activeBot.metadata?.jobId || 'Initializing...'}
              </span>
            </div>
          ) : activeBot.metadata?.status === 'failed' ? (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto h-full animate-in fade-in duration-300">
              <div className="relative mb-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-red-500/10 blur-xl" />
                <div className="relative size-20 rounded-full bg-red-50 dark:bg-red-955/20 border border-red-200 dark:border-red-900 shadow-xl flex items-center justify-center">
                  <AlertCircle className="size-10 text-red-600 dark:text-red-450" />
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-3 tracking-tight">
                Model Training Failed
              </h2>
              
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed max-w-sm">
                An error occurred during the Vertex AI supervised tuning pipeline. Check the logs below for troubleshooting.
              </p>

              {/* Error message card */}
              <div className="w-full bg-red-50 dark:bg-red-955/15 border border-red-200/50 dark:border-red-900/30 rounded-2xl p-4 shadow-inner text-left mb-8 max-h-[160px] overflow-y-auto custom-scrollbar">
                <span className="text-[10px] text-red-500 dark:text-red-400 font-bold uppercase tracking-wider block mb-1">Error Trace</span>
                <p className="text-xs font-mono text-red-850 dark:text-red-300 break-all whitespace-pre-wrap leading-relaxed">
                  {activeBot.metadata?.tuningError || 'Pipeline execution failed without generating diagnostic logs. This can happen if GCP Vertex AI quotas are exceeded or permissions are missing.'}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleRetryTuning()}
                  disabled={isRetryingTuning}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRetryingTuning && <Loader2 className="size-4 animate-spin" />}
                  Retry Model Training
                </button>
              </div>

              <span className="text-[10px] text-zinc-400 font-mono mt-6 uppercase tracking-wider block">
                Job ID: {activeBot.metadata?.jobId || 'N/A'}
              </span>
            </div>
          ) : (
            <>
              <FullConversation conversationId={activeBotThreadId || 'new-chat'} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyChatbotsPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 bg-[#e1e1e1] dark:bg-zinc-950 min-h-screen flex items-center justify-center">
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
