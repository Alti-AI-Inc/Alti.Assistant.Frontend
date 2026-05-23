'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { 
  Upload, FileText, Send, AlertCircle, RefreshCw, 
  HelpCircle, ChevronDown, ChevronUp, FileCode, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SourceNode {
  score: string;
  snippet: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceNode[];
  timestamp: string;
}

export const LlamaIndexChat = () => {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [indexState, setIndexState] = useState<'idle' | 'uploading' | 'indexed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [indexedFileName, setIndexedFileName] = useState<string>('');
  
  // Chat States
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isQuerying]);

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

  // Upload and Index Document via LlamaIndex API
  const uploadAndIndex = async (selectedFile: File) => {
    setIndexState('uploading');
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      
      const response = await fetch(`${cleanBaseUrl}/rag-system/index-doc`, {
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
          content: `LlamaIndex successfully parsed and indexed **${selectedFile.name}**!\n\nI have loaded the vector store database. Ask me any question to query the document context.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } catch (error: any) {
      console.error('Indexing Error:', error);
      setIndexState('error');
      setErrorMessage(error.message || 'Failed to complete document vector indexing.');
    }
  };

  // Query LlamaIndex RAG system
  const handleSendMessage = async () => {
    if (!input.trim() || isQuerying) return;

    const userPrompt = input;
    setInput('');
    setIsQuerying(true);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userPrompt,
      timestamp,
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

      const response = await fetch(`${cleanBaseUrl}/rag-system/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken || ''}`,
        },
        body: JSON.stringify({ query: userPrompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const resData = await response.json();
      const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Append bot message with sources if present
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: resData.answer?.content || 'Unable to fetch details from index.',
        sources: resData.answer?.sources || [],
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

  return (
    <div className="w-full flex-1 flex flex-col h-[calc(100vh-160px)] bg-white dark:bg-gray-950 overflow-hidden">
      
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
            className="flex-1 flex flex-col items-center justify-center p-8 max-w-xl mx-auto w-full"
          >
            {/* Visual Glassmorphic Dropping zone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full relative group cursor-pointer border-2 border-dashed rounded-3xl p-10 flex flex-col items-center text-center transition-all duration-300 ${
                dragActive 
                  ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/20" 
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
                    <h3 className="text-base font-semibold text-gray-955 dark:text-gray-50">LlamaIndex Parsing</h3>
                    <p className="text-xs text-gray-500 mt-1 animate-pulse">Reading document blocks & building vector nodes...</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">Ingest Document</h3>
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
                className="w-full mt-4 flex items-start gap-2.5 p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-750 text-xs dark:bg-red-950/15 dark:border-red-900 dark:text-red-400 text-left"
              >
                <AlertCircle className="h-4 w-4 flex-none mt-0.5" />
                <div>
                  <span className="font-bold">Parsing Warning</span>
                  <p className="mt-0.5 leading-normal">{errorMessage}</p>
                </div>
              </motion.div>
            )}

            {/* Ingestion Info card */}
            <div className="w-full grid grid-cols-2 gap-3 mt-6 text-left">
              <div className="p-3.5 rounded-2xl border border-gray-150 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/10">
                <FileCode className="h-4.5 w-4.5 text-blue-500 mb-2" />
                <h4 className="text-xs font-bold text-gray-950 dark:text-gray-50">Vector Embeddings</h4>
                <p className="text-[10px] text-gray-500 mt-1 leading-normal">LlamaIndex translates text into 768-dim embeddings in real-time.</p>
              </div>
              <div className="p-3.5 rounded-2xl border border-gray-150 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/10">
                <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 mb-2" />
                <h4 className="text-xs font-bold text-gray-950 dark:text-gray-50">Zero Hallucinations</h4>
                <p className="text-[10px] text-gray-500 mt-1 leading-normal">Strict context containment limits answers purely to your document data.</p>
              </div>
            </div>

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
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 truncate max-w-[250px]">{indexedFileName}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-gray-500 font-medium">LlamaIndex Vector Index Loaded</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-8 rounded-lg text-xs hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
              >
                Upload New Document
              </Button>
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
                      className={`max-w-xl rounded-2xl px-4 py-3 shadow-sm text-sm ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-900 border border-gray-150 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100 rounded-bl-none'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      
                      {/* Interactive LlamaIndex Citations */}
                      {!isUser && hasSources && (
                        <div className="mt-3.5 pt-3.5 border-t border-gray-100 dark:border-gray-800 w-full">
                          <button
                            onClick={() => toggleSources(msg.id)}
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity focus:outline-none"
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
                                className="overflow-hidden mt-2.5 space-y-2"
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
                                      "{source.snippet}"
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

              {/* LlamaIndex Reasoning indicator */}
              {isQuerying && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white border border-gray-150 px-4 py-3 dark:bg-gray-900 dark:border-gray-800">
                    <div className="flex gap-2 items-center text-xs text-gray-500 font-medium">
                      <div className="flex gap-1.5 items-center">
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500" />
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '0.15s' }} />
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '0.3s' }} />
                      </div>
                      <span>LlamaIndex querying vector nodes...</span>
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
                  placeholder={`Ask a question about ${indexedFileName}...`}
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
