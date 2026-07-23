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
    } else if (bots.length > 0) {
      // Auto-select first bot if none specified in URL params
      const firstBot = bots[0];
      setActiveBotId(firstBot.id);
      router.replace(`/spaces?bot=${firstBot.id}`);
    } else {
      setActiveBotId(null);
      // Redirect to Alti AI new chat if there are no bots
      router.replace(session?.accessToken ? '/c/new-chat' : '/');
    }

    if (threadParam) {
      setActiveBotThreadId(threadParam);
    } else {
      setActiveBotThreadId(null);
      setActiveConversation(null);
    }
  }, [botParam, threadParam, bots, setActiveBotId, setActiveBotThreadId, setActiveConversation, router, session]);

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
  };  // Render loading screen if no active bot
  if (!activeBot) {
    return (
      <div className="flex-grow w-full bg-[#e1e1e1] dark:bg-zinc-950 h-full flex items-center justify-center relative">
        <div className="flex items-center space-x-2.5 text-zinc-500 dark:text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
          <span className="text-sm font-semibold">loading workspace...</span>
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
          (isChatView || isEditorView)
            ? "w-full h-full items-stretch justify-start"
            : cn(
                "items-center justify-center",
                (viewParam !== 'instructions' && (selectedOption as any) !== OPTIONS.INSTRUCTIONS) && 
                (viewParam !== 'guardrails' && (selectedOption as any) !== OPTIONS.GUARDRAILS) && 
                (viewParam !== 'data' && (selectedOption as any) !== OPTIONS.KNOWLEDGE) && 
                (selectedOption as any) !== OPTIONS.INBOX &&
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
