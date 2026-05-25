'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { 
  Upload, FileText, Send, AlertCircle, RefreshCw, 
  HelpCircle, ChevronDown, ChevronUp, FileCode, CheckCircle2,
  Layers, Zap, Cpu, Settings, Activity, Gauge, Terminal, CheckCircle,
  BarChart2, RefreshCcw, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SourceNode {
  score: string | number;
  snippet: string;
}

interface EvaluationMetric {
  score: number | null;
  passing: boolean | null;
  feedback?: string | null;
}

interface EvaluationData {
  faithfulness?: EvaluationMetric;
  relevancy?: EvaluationMetric;
  correctness?: EvaluationMetric;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceNode[];
  evaluation?: EvaluationData;
  engine?: string;
  latencyMs?: number;
  timestamp: string;
}

interface EvaluationHistoryItem {
  id: string;
  query: string;
  response: string;
  evaluation: EvaluationData;
  timestamp: string;
}

export const LlamaIndexChat = () => {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  
  // Ingestion Strategy State
  const [ingestStrategy, setIngestStrategy] = useState<'upsert' | 'duplicates' | 'upserts_and_delete'>('upsert');
  const [indexState, setIndexState] = useState<'idle' | 'uploading' | 'indexed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [indexedFileName, setIndexedFileName] = useState<string>('');
  
  // Workbench Strategy States
  const [queryMode, setQueryMode] = useState<string>('vector');
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagnosticsData, setDiagnosticsData] = useState<any>(null);
  const [isLoadingDiagnostics, setIsLoadingDiagnostics] = useState(false);

  // Prompt Optimizer Workbench States
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Chat States
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isQuerying, streamingContent]);

  // Handle Drag and Drop events
  const [dragActive, setDragActive] = useState(false);
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (selectedFile: File) => {
    setErrorMessage(null);
    const allowedExtensions = ['.txt', '.pdf', '.doc', '.docx'];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      setErrorMessage('Unsupported file format. Please upload a TXT, PDF, or Word document.');
      return;
    }

    if (selectedFile.size > 1 * 1024 * 1024) { // 1MB limit
      setErrorMessage('File size exceeds the 1MB limit. Please upload a smaller document.');
      return;
    }

    setFile(selectedFile);
    uploadAndIndex(selectedFile);
  };

  // Upload and Index Document via Advanced LlamaIndex Ingestion API
  const uploadAndIndex = async (selectedFile: File) => {
    setIndexState('uploading');
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('strategy', ingestStrategy);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      
      const response = await fetch(`${cleanBaseUrl}/rag-system/index-doc-advanced`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.accessToken || ''}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      setIndexState('indexed');
      setIndexedFileName(selectedFile.name);
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `LlamaIndex successfully parsed and indexed **${selectedFile.name}** using the **${ingestStrategy.toUpperCase()}** strategy!\n\nI have loaded the vector store database. Ask me any question to query the document context.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } catch (error: any) {
      console.error('Indexing Error:', error);
      setIndexState('error');
      setErrorMessage(error.message || 'Failed to complete document vector indexing.');
    }
  };

  // Query Advanced LlamaIndex RAG system with Dynamic Routing and Evaluation Output
  const handleSendMessage = async () => {
    if (!input.trim() || isQuerying) return;

    const userPrompt = input;
    setInput('');
    setIsQuerying(true);
    setStreamingContent('');

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userPrompt,
      timestamp,
    };

    setMessages(prev => [...prev, userMessage]);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    // SSE Streaming Ingestion
    if (queryMode === 'live-stream') {
      try {
        const response = await fetch(`${cleanBaseUrl}/rag-system/live-session/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
          body: JSON.stringify({ query: userPrompt }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullAnswer = '';

        if (reader) {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.token) {
                    fullAnswer += data.token;
                    setStreamingContent(fullAnswer);
                  } else if (data.complete) {
                    const result = data.payload;
                    const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const botMessage: Message = {
                      id: `bot-${Date.now()}`,
                      role: 'assistant',
                      content: result.fullText || fullAnswer,
                      engine: 'LiveLLMSession',
                      latencyMs: result.telemetry?.totalMs,
                      timestamp: botTimestamp,
                    };
                    setMessages(prev => [...prev, botMessage]);
                    setStreamingContent('');
                  }
                } catch (e) {
                  // non-fatal parser error
                }
              }
            }
          }
        }
      } catch (error: any) {
        console.error('SSE Error:', error);
        setMessages(prev => [...prev, {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Error in live streaming: **${error.message}**`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      } finally {
        setIsQuerying(false);
      }
      return;
    }

    // Direct REST endpoints routing
    let endpoint = '/rag-system/query';
    let requestBody: any = { query: userPrompt };

    switch (queryMode) {
      case 'advanced-router':
        endpoint = '/rag-system/query-advanced';
        requestBody.mode = 'router';
        break;
      case 'agent-react':
        endpoint = '/rag-system/query-agent';
        break;
      case 'agent-workflow':
        endpoint = '/rag-system/query-agent-workflow';
        break;
      case 'decomposition':
        endpoint = '/rag-system/query-decompose';
        break;
      case 'rerank':
        endpoint = '/rag-system/query-rerank';
        requestBody.options = { similarityWeight: 0.6, keywordWeight: 0.3, freshnessWeight: 0.1 };
        break;
      case 'self-correct':
        endpoint = '/rag-system/query-selfcorrect';
        break;
      case 'hybrid':
        endpoint = '/rag-system/query-hybrid';
        break;
      case 'full-spectrum':
        endpoint = '/rag-system/query-fullspectrum';
        break;
      case 'cached':
        endpoint = '/rag-system/query-cached';
        break;
      default:
        endpoint = '/rag-system/query';
    }

    try {
      const response = await fetch(`${cleanBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken || ''}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const resData = await response.json();
      const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Append bot message with evaluation data and sources
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: resData.answer?.content || resData.finalAnswer || resData.answer || 'Unable to fetch details from index.',
        sources: resData.answer?.sources || resData.sources || [],
        evaluation: resData.evaluation || null,
        engine: resData.engine || queryMode.toUpperCase(),
        latencyMs: resData.telemetry?.totalMs || resData.telemetry?.totalMs || null,
        timestamp: botTimestamp,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Query Error:', error);
      const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Error retrieving data from LlamaIndex: **${error.message || 'Server timeout or connection failed.'}**`,
        timestamp: botTimestamp,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsQuerying(false);
    }
  };

  // Fetch Evaluation History and Global Analytics from backend API
  const fetchDiagnostics = async () => {
    setIsLoadingDiagnostics(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

      const response = await fetch(`${cleanBaseUrl}/rag-system/evaluation-history`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken || ''}`,
        }
      });
      const data = await response.json();
      setDiagnosticsData(data);
    } catch (error) {
      console.error('Failed to load diagnostics', error);
    } finally {
      setIsLoadingDiagnostics(false);
    }
  };

  // Optimize and Budget Prompt Text
  const handleOptimizePrompt = async () => {
    if (!promptInput.trim() || isOptimizing) return;
    setIsOptimizing(true);
    setOptimizationResult(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

      const response = await fetch(`${cleanBaseUrl}/rag-system/optimize-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken || ''}`,
        },
        body: JSON.stringify({ promptText: promptInput }),
      });

      const data = await response.json();
      setOptimizationResult(data);
    } catch (error) {
      console.error('Prompt optimization failed', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSources = (msgId: string) => {
    setExpandedSources(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const handleReset = () => {
    setFile(null);
    setIndexState('idle');
    setMessages([]);
    setErrorMessage(null);
    setIndexedFileName('');
  };

  useEffect(() => {
    if (showDiagnostics) {
      fetchDiagnostics();
    }
  }, [showDiagnostics]);

  return (
    <div className="w-full flex-1 flex flex-col h-[calc(100vh-53px)] bg-white dark:bg-gray-950 overflow-hidden relative">
      
      {/* Diagnostics Panel overlay */}
      <AnimatePresence>
        {showDiagnostics && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 w-80 h-full bg-white dark:bg-gray-900 border-l border-gray-150 dark:border-gray-800 z-50 p-6 flex flex-col shadow-2xl overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-150 dark:border-gray-800 flex-none">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                <Gauge className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
                RAG Engine Diagnostics
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowDiagnostics(false)} className="h-7 w-7 rounded-full p-0">✕</Button>
            </div>

            {isLoadingDiagnostics ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
                <span className="text-xs text-gray-400">Loading diagnostics history...</span>
              </div>
            ) : diagnosticsData?.totalEvaluations > 0 ? (
              <div className="flex-1 mt-6 space-y-6 text-left">
                {/* Overall Pass rate */}
                <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 dark:bg-blue-950/10 dark:border-blue-900/50">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Overall Accuracy Rate</span>
                    <BarChart2 className="h-4 w-4 text-blue-500" />
                  </div>
                  <h4 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">{diagnosticsData.overallPassRate}%</h4>
                  <p className="text-[10px] text-gray-400 mt-1">Based on {diagnosticsData.totalEvaluations} recorded evaluations</p>
                </div>

                {/* Score list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-gray-50">Evaluation Dimensions</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-gray-50 dark:bg-gray-850">
                      <span className="text-gray-500">Faithfulness</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{(diagnosticsData.averages.faithfulness * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-gray-50 dark:bg-gray-850">
                      <span className="text-gray-500">Relevancy</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{(diagnosticsData.averages.relevancy * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-gray-50 dark:bg-gray-850">
                      <span className="text-gray-500">Correctness</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{(diagnosticsData.averages.correctness * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {/* Run history list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-gray-50">Recent History Logs</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {diagnosticsData.history?.slice(0, 10).map((h: EvaluationHistoryItem) => (
                      <div key={h.id} className="p-2.5 rounded-xl border border-gray-150 dark:border-gray-800 text-[11px]">
                        <p className="font-semibold text-gray-800 dark:text-gray-300 truncate font-mono">Q: {h.query}</p>
                        <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-gray-100 dark:border-gray-800 text-[9px] text-gray-400">
                          <span>F: {h.evaluation?.faithfulness?.score ?? 'N/A'}</span>
                          <span>R: {h.evaluation?.relevancy?.score ?? 'N/A'}</span>
                          <span>C: {h.evaluation?.correctness?.score ?? 'N/A'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <Gauge className="h-8 w-8 text-gray-350 dark:text-gray-700 mb-2.5" />
                <span className="text-xs font-bold text-gray-400">No History Available</span>
                <p className="text-[10px] text-gray-500 mt-1 max-w-[200px]">Diagnose query evaluations will appear here as soon as queries are processed.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt Optimizer Workbench overlay */}
      <AnimatePresence>
        {showOptimizer && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 left-0 w-85 h-full bg-white dark:bg-gray-900 border-r border-gray-150 dark:border-gray-800 z-50 p-6 flex flex-col shadow-2xl overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-150 dark:border-gray-800 flex-none">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-blue-500" />
                Prompt Architect Workbench
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowOptimizer(false)} className="h-7 w-7 rounded-full p-0">✕</Button>
            </div>

            <div className="flex-1 mt-5 space-y-5 text-left flex flex-col">
              <span className="text-[11px] text-gray-400">Optimize prompt lengths, token allocation, and logical alignment under large context budgets.</span>
              <textarea
                placeholder="Enter system prompt context or instruction template..."
                value={promptInput}
                onChange={e => setPromptInput(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 p-3 text-xs focus:ring-1 focus:ring-blue-500"
              />

              <Button
                onClick={handleOptimizePrompt}
                disabled={isOptimizing || !promptInput.trim()}
                className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs"
              >
                {isOptimizing ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" /> : null}
                Run Ingestion Budget Check
              </Button>

              {optimizationResult && (
                <div className="flex-1 space-y-4 max-h-[350px] overflow-y-auto pt-3 border-t border-gray-150 dark:border-gray-800">
                  {/* Token Budgets info */}
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-850">
                      <span className="text-gray-400 block">Original Length</span>
                      <span className="font-bold font-mono text-gray-800 dark:text-gray-200">{optimizationResult.originalLength} chars</span>
                    </div>
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-850">
                      <span className="text-gray-400 block">Max Token Limit</span>
                      <span className="font-bold font-mono text-gray-800 dark:text-gray-200">{optimizationResult.tokenBudgets?.maxModelContextWindow}</span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-bold text-gray-900 dark:text-gray-55">Architect Optimization</h5>
                    {optimizationResult.recommendations?.map((rec: string, i: number) => (
                      <div key={i} className="flex gap-2 p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-[10px] dark:bg-blue-950/10 dark:border-blue-900">
                        <CheckCircle className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-none" />
                        <span className="text-gray-600 dark:text-gray-300 leading-normal">{rec}</span>
                      </div>
                    ))}
                  </div>

                  {/* Draft */}
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-bold text-gray-900 dark:text-gray-55">Optimized Context Draft</h5>
                    <pre className="p-2.5 rounded-xl border border-gray-150 dark:border-gray-850 dark:bg-gray-950 text-[9.5px] text-gray-500 font-mono whitespace-pre-wrap select-all">
                      {optimizationResult.optimizedPromptDraft}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dynamic Main Workspace Panels */}
      <AnimatePresence mode="wait">
        
        {indexState !== 'indexed' ? (
          /* ==========================================
             UPLOADER STAGE
             ========================================== */
          <motion.div
            key="uploader"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center justify-start py-12 px-8 max-w-5xl mx-auto w-full"
          >
            {/* Visual Glassmorphic Dropping zone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full relative group cursor-pointer border-2 border-dashed rounded-3xl py-10 px-10 flex flex-col items-center text-center transition-all duration-300 ${
                dragActive 
                  ? "border-blue-500 bg-blue-50/40 dark:bg-blue-955/20" 
                  : "border-gray-250 bg-gray-50/50 hover:bg-gray-50/80 dark:border-gray-800 dark:bg-gray-900/30 dark:hover:bg-gray-900/50"
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                onChange={handleFileChange}
                accept=".txt,.pdf,.doc,.docx"
                className="hidden" 
              />
              
              {indexState === 'uploading' ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative h-14 w-14 flex items-center justify-center">
                    <RefreshCw className="h-10 w-10 text-blue-600 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-955 dark:text-gray-50">LlamaIndex Ingest</h3>
                    <p className="text-xs text-gray-500 mt-1 animate-pulse">Running {ingestStrategy.toUpperCase()} strategies & vector mapping...</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-blue-50/60 dark:bg-blue-955/30 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-55">Ingest Document</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs leading-normal">
                      Drag and drop your file, or click to browse.
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono mt-2.5">
                      PDF, TXT, DOC, DOCX up to 1MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Error notifications */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mt-4 flex items-start gap-2.5 p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-750 text-xs dark:bg-red-955/15 dark:border-red-900 dark:text-red-400 text-left"
              >
                <AlertCircle className="h-4 w-4 flex-none mt-0.5" />
                <div>
                  <span className="font-bold">Parsing Warning</span>
                  <p className="mt-0.5 leading-normal">{errorMessage}</p>
                </div>
              </motion.div>
            )}

          </motion.div>
        ) : (
          /* ==========================================
             CHAT AND RAG VIEW
             ========================================== */
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col overflow-hidden h-full"
          >
            {/* Header info */}
            <div className="h-14 border-b border-gray-150 bg-white dark:border-gray-800 dark:bg-gray-900 px-6 flex items-center justify-between flex-none">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 truncate max-w-[200px]">{indexedFileName}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-gray-500 font-medium">Cognitive RAG Active</span>
                  </div>
                </div>
              </div>

              {/* Advanced UI toolbar controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOptimizer(!showOptimizer)}
                  className="h-8 rounded-lg text-xs gap-1 border-gray-250 dark:border-gray-800 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Prompt Architect
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDiagnostics(!showDiagnostics)}
                  className="h-8 rounded-lg text-xs gap-1 border-gray-250 dark:border-gray-800 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Gauge className="h-3.5 w-3.5" />
                  Engine Diagnostics
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 rounded-lg text-xs border-red-200 text-red-500 hover:bg-red-50 hover:text-red-650"
                >
                  New Document
                </Button>
              </div>
            </div>

            {/* Premium Selector strategy toolbar */}
            <div className="h-10 px-6 bg-gray-50/50 border-b border-gray-150 dark:bg-gray-900/60 dark:border-gray-800 flex items-center gap-3 overflow-x-auto flex-none text-[11px]">
              <span className="font-bold text-gray-500 select-none">COGNITIVE ENGINE:</span>
              <div className="flex items-center gap-2">
                {[
                  { id: 'vector', name: 'Vector Search', desc: 'Precise semantic vector matching' },
                  { id: 'advanced-router', name: 'Advanced Router', desc: 'Router selecting Vector, Summary, or Keyword index' },
                  { id: 'agent-react', name: 'ReAct Agent', desc: 'LLM tool-calling conversational agent' },
                  { id: 'agent-workflow', name: 'Multi-Step Workflow Agent', desc: 'Manual task step executor and tool trace logging' },
                  { id: 'decomposition', name: 'Decompose Engine', desc: 'Decomposes complex issues into sub-questions' },
                  { id: 'rerank', name: 'Multi-Signal Re-Rank', desc: 'Cosine + Lexical + Freshness hybrid re-ranking' },
                  { id: 'self-correct', name: 'Self-Correcting RAG', desc: 'Self-evaluation loop running query auto-correct' },
                  { id: 'hybrid', name: 'RRF Hybrid', desc: 'Lexical & Semantic Reciprocal Rank Fusion' },
                  { id: 'full-spectrum', name: 'Full Spectrum Retrieval', desc: '6 retrievers + Maximal Marginal Relevance (MMR)' },
                  { id: 'live-stream', name: 'SSE Live Stream', desc: 'Granular liveEvents SSE session stream' },
                  { id: 'cached', name: 'Semantic Cache', desc: 'Cosine cache deduplicating redundant prompts' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setQueryMode(mode.id)}
                    title={mode.desc}
                    className={`px-2.5 py-1 rounded-md transition-all font-semibold select-none border whitespace-nowrap cursor-pointer ${
                      queryMode === mode.id
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-white border-gray-250 text-gray-655 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-850'
                    }`}
                  >
                    {mode.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat message space */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50/50 dark:bg-gray-950/30">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                const hasSources = msg.sources && msg.sources.length > 0;
                const isExpanded = !!expandedSources[msg.id];

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xl rounded-2xl px-4 py-3 shadow-sm text-sm text-left ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-900 border border-gray-150 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100 rounded-bl-none'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      
                      {/* Engine Tag & Latency overlay */}
                      {!isUser && (msg.engine || msg.latencyMs) && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5 select-none text-[9.5px]">
                          {msg.engine && (
                            <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900">
                              ENGINE: {msg.engine}
                            </span>
                          )}
                          {msg.latencyMs && (
                            <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
                              LATENCY: {msg.latencyMs}ms
                            </span>
                          )}
                        </div>
                      )}

                      {/* Rolling Evaluations score badges */}
                      {!isUser && msg.evaluation && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-[10px] font-bold">
                          {msg.evaluation.faithfulness && (
                            <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                              msg.evaluation.faithfulness.passing
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400'
                                : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400'
                            }`}>
                              Faithfulness: {msg.evaluation.faithfulness.score !== null ? `${(msg.evaluation.faithfulness.score * 100).toFixed(0)}%` : 'Passed'}
                            </span>
                          )}
                          {msg.evaluation.relevancy && (
                            <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                              msg.evaluation.relevancy.passing
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400'
                                : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400'
                            }`}>
                              Relevancy: {msg.evaluation.relevancy.score !== null ? `${(msg.evaluation.relevancy.score * 100).toFixed(0)}%` : 'Passed'}
                            </span>
                          )}
                          {msg.evaluation.correctness && (
                            <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                              msg.evaluation.correctness.passing
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400'
                                : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400'
                            }`}>
                              Correctness: {msg.evaluation.correctness.score !== null ? `${msg.evaluation.correctness.score}/5` : 'Passed'}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Interactive LlamaIndex Citations */}
                      {!isUser && hasSources && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 w-full">
                          <button
                            onClick={() => toggleSources(msg.id)}
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity focus:outline-none cursor-pointer"
                          >
                            <span>LlamaIndex Retrieved Source Nodes</span>
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>

                          {/* Expandable Citations dropdown */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mt-2.5 space-y-2 text-left"
                              >
                                {msg.sources!.map((source, i) => (
                                  <div key={i} className="p-2.5 rounded-xl bg-gray-50 border border-gray-150 dark:bg-gray-950 dark:border-gray-850 space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px]">
                                      <span className="font-semibold text-gray-500 font-mono">NODE [{i + 1}]</span>
                                      <span className="font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900">
                                        RELEVANCE: {source.score}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-gray-655 font-mono dark:text-gray-400 leading-normal bg-white p-2 rounded border dark:bg-gray-900 dark:border-gray-800 italic">
                                      "{source.snippet || (source as any).text}"
                                    </p>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      <span
                        className={`block text-[10px] mt-1.5 text-right ${
                          isUser ? 'text-blue-150' : 'text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Event-driven SSE Token stream parser */}
              {streamingContent && (
                <div className="flex justify-start">
                  <div className="max-w-xl rounded-2xl px-4 py-3 shadow-sm text-sm text-left bg-white text-gray-900 border border-gray-150 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100 rounded-bl-none">
                    <p className="leading-relaxed whitespace-pre-wrap">{streamingContent}</p>
                    <div className="flex items-center gap-1.5 mt-2.5 select-none text-[9.5px]">
                      <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900">
                        STREAMING LIVE: LiveLLMSession
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* LlamaIndex Reasoning indicator */}
              {isQuerying && !streamingContent && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white border border-gray-150 px-4 py-3 dark:bg-gray-900 dark:border-gray-800">
                    <div className="flex gap-2 items-center text-xs text-gray-500 font-medium">
                      <div className="flex gap-1.5 items-center">
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500" />
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '0.15s' }} />
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '0.3s' }} />
                      </div>
                      <span>Cognitive RAG ({queryMode.toUpperCase()}) analyzing and querying vector nodes...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Sticky Input container */}
            <div className="p-4 border-t border-gray-150 bg-white dark:border-gray-800 dark:bg-gray-900 flex-none">
              <div className="flex gap-2.5 max-w-3xl mx-auto w-full">
                <Input
                  placeholder={queryMode === 'live-stream' ? `Initiate EventSource stream about ${indexedFileName}...` : `Ask a question using ${queryMode.toUpperCase()} engine...`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isQuerying}
                  className="flex-1 h-11 text-sm rounded-xl bg-gray-50 border-gray-200 dark:border-gray-800 dark:bg-gray-950 focus-visible:ring-1 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                />

                <Button
                  onClick={handleSendMessage}
                  disabled={isQuerying || !input.trim()}
                  className="h-11 w-11 flex-none bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-0 flex items-center justify-center shadow-lg shadow-blue-500/10 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  <Send className="h-4.5 w-4.5" />
                </Button>
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
