'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { allApps, APP } from '@/lib/all-apps';
import { apiClientJson, buildApiUrl } from '@/lib/api-client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, MessageSquare, Shield, CheckCircle, AlertTriangle, 
  ArrowRight, Key, ExternalLink, RefreshCw, Send, Sparkles, 
  HelpCircle, ChevronRight, Activity, Trash2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  toolsUsed?: string[];
  error?: boolean;
}

export const AppsPanelsContainer = () => {
  // --- States ---
  const searchParams = useSearchParams();
  const activeAppSlug = searchParams?.get('app');

  const [selectedApp, setSelectedApp] = useState<APP | null>(null);
  const [connectedAppSlugs, setConnectedAppSlugs] = useState<Set<string>>(new Set());
  const [isFetchingStatus, setIsFetchingStatus] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Isolated chat histories: Record<app_name, ChatMessage[]>
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({});
  const [currentInput, setCurrentInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [activeConversationIds, setActiveConversationIds] = useState<Record<string, string>>({});

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeAppSlug) {
      const match = allApps.find(app => app.app_name.toLowerCase() === activeAppSlug.toLowerCase() && app.isAvailable);
      if (match) {
        setSelectedApp(match);
      } else {
        setSelectedApp(null);
      }
    } else {
      setSelectedApp(null);
    }
  }, [activeAppSlug]);

  // --- Fetch Connected Status ---
  const fetchConnectionStatus = async () => {
    setIsFetchingStatus(true);
    const response = await apiClientJson<{ connectedAccountId: string; toolkit: { slug: string } }[]>(
      buildApiUrl('/composio-simple/connected-accounts')
    );
    
    if (response.success && Array.isArray(response.data)) {
      const activeSlugs = new Set(
        response.data.map(account => account.toolkit?.slug?.toLowerCase()).filter(Boolean)
      );
      setConnectedAppSlugs(activeSlugs);
    } else {
      console.error('Failed to retrieve connected accounts from Composio:', response.debugMessage);
    }
    setIsFetchingStatus(false);
  };

  useEffect(() => {
    fetchConnectionStatus();
  }, []);

  // Scroll to bottom of chat when messages or loading state change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistories, isSendingMessage, selectedApp]);

  // --- Connect/OAuth flow ---
  const handleConnectApp = async (app: APP) => {
    if (!app.app_name) return;
    setIsConnecting(true);
    setConnectionError(null);

    const response = await apiClientJson<{ redirectUrl: string; id: string }>(
      buildApiUrl('/composio-simple/initiate'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_name: app.app_name }),
      }
    );

    if (response.success && response.data?.redirectUrl) {
      const authUrl = response.data.redirectUrl;
      const connectionId = response.data.id;

      // Open OAuth in popup window
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const oauthPopup = window.open(
        authUrl,
        `Connect ${app.title}`,
        `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes,scrollbars=yes`
      );

      // Start polling for connection confirmation
      let attempts = 0;
      const maxAttempts = 60; // 3 minutes
      
      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts > maxAttempts || oauthPopup?.closed) {
          clearInterval(pollInterval);
          setIsConnecting(false);
          if (attempts > maxAttempts) {
            setConnectionError('Connection authorization timed out. Please try again.');
          }
          return;
        }

        // Fetch connection status dynamically
        const checkRes = await apiClientJson<{ success: boolean }>(
          buildApiUrl('/composio-simple/wait-for-connection'),
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ connected_account_id: connectionId }),
          }
        );

        if (checkRes.success) {
          clearInterval(pollInterval);
          setIsConnecting(false);
          oauthPopup?.close();
          // Update local status immediately
          setConnectedAppSlugs(prev => {
            const next = new Set(prev);
            next.add(app.app_name.toLowerCase());
            return next;
          });
        }
      }, 3000);
    } else {
      setIsConnecting(false);
      setConnectionError(response.debugMessage || 'Failed to initiate application authentication.');
    }
  };

  // --- Scoped Chat Execution ---
  const handleSendMessage = async () => {
    if (!currentInput.trim() || !selectedApp?.app_name) return;

    const appSlug = selectedApp.app_name;
    const userPrompt = currentInput;
    setCurrentInput('');
    setIsSendingMessage(true);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // 1. Append user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userPrompt,
      timestamp,
    };

    setChatHistories(prev => ({
      ...prev,
      [appSlug]: [...(prev[appSlug] || []), userMessage],
    }));

    // 2. Fetch or create unique conversation ID for this app session
    const currentConvId = activeConversationIds[appSlug] || null;

    // 3. Dispatch to scoped chat backend
    const response = await apiClientJson<{ response: string; conversationId: string; toolsUsed?: string[] }>(
      buildApiUrl('/composio-simple/chat'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userPrompt,
          conversationId: currentConvId,
          scopedApp: appSlug, // Lock backend specifically to this app
        }),
      }
    );

    const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (response.success && response.data) {
      // Save conversation ID for future turns
      if (response.data.conversationId) {
        setActiveConversationIds(prev => ({
          ...prev,
          [appSlug]: response.data!.conversationId,
        }));
      }

      // 4. Append bot answer
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: response.data.response || 'Action executed successfully.',
        timestamp: botTimestamp,
        toolsUsed: response.data.toolsUsed || [],
      };

      setChatHistories(prev => ({
        ...prev,
        [appSlug]: [...(prev[appSlug] || []), botMessage],
      }));
    } else {
      // Append error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'bot',
        content: response.debugMessage || 'Failed to process request. Ensure app has permissions and try again.',
        timestamp: botTimestamp,
        error: true,
      };

      setChatHistories(prev => ({
        ...prev,
        [appSlug]: [...(prev[appSlug] || []), errorMessage],
      }));
    }

    setIsSendingMessage(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChatSession = (appSlug: string) => {
    setChatHistories(prev => ({
      ...prev,
      [appSlug]: [],
    }));
    setActiveConversationIds(prev => {
      const next = { ...prev };
      delete next[appSlug];
      return next;
    });
  };

  // Check if active selected app is connected
  const isSelectedAppConnected = selectedApp && connectedAppSlugs.has(selectedApp.app_name.toLowerCase());

  return (
    <div className="flex h-full w-full flex-row overflow-hidden bg-gray-50 dark:bg-gray-950">
      
      {/* =========================================================
          RIGHT WORKSPACE - ACTIVE DETAIL OR CHATVIEW CONSOLE
          ========================================================= */}
      <main className="flex-1 flex flex-col bg-white dark:bg-gray-950 overflow-hidden relative">
        
        {!selectedApp ? (
          /* STATE 0: Welcome Screen / Dashboard overview */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto space-y-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Isolated Action Hub</h2>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Connect and prompt individual web applications securely. Select an application in the sidebar to configure authentication and interact with its tools in a focused, zero-hallucination agent session.
              </p>
            </div>
            
            <div className="w-full grid grid-cols-2 gap-3 mt-4 text-left">
              <div className="p-3.5 rounded-xl border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                <Shield className="h-4.5 w-4.5 text-blue-500 mb-2" />
                <h4 className="text-xs font-bold text-gray-950 dark:text-gray-50">100% Isolated Scoping</h4>
                <p className="text-[11px] text-gray-500 mt-1">Tools are locked dynamically to ensure strict deterministic execution.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                <Key className="h-4.5 w-4.5 text-blue-500 mb-2" />
                <h4 className="text-xs font-bold text-gray-950 dark:text-gray-50">Composio MCP Auth</h4>
                <p className="text-[11px] text-gray-500 mt-1">Universal OAuth management handles complex authentications seamlessly.</p>
              </div>
            </div>
          </div>
        ) : !isSelectedAppConnected ? (
          /* STATE 1: App Setup / OAuth connect screen */
          <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
            <div className="w-full max-w-lg rounded-2xl border border-gray-200/80 bg-white p-8 dark:border-gray-800 dark:bg-gray-900/40 shadow-xl shadow-gray-200/50 dark:shadow-none backdrop-blur-md">
              <div className="flex flex-col items-center text-center space-y-6">
                
                {/* Visual animated Aura under the app logo */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl bg-blue-500/10 dark:bg-blue-500/5 blur-xl animate-pulse" />
                  <div className="relative h-20 w-20 rounded-2xl border border-gray-200 bg-white p-3.5 flex items-center justify-center dark:border-gray-800 shadow-md">
                    {selectedApp.image ? (
                      <img src={selectedApp.image} alt={selectedApp.title} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-3xl font-bold text-blue-600">{selectedApp.title.charAt(0)}</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-950 dark:text-gray-50">Connect {selectedApp.title}</h3>
                  <p className="mt-2.5 text-sm text-gray-600 dark:text-gray-400">
                    {selectedApp.description}
                  </p>
                </div>

                {connectionError && (
                  <div className="w-full flex items-center gap-2.5 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs dark:bg-red-950/20 dark:border-red-900 dark:text-red-400 text-left">
                    <AlertTriangle className="h-4 w-4 flex-none" />
                    <span>{connectionError}</span>
                  </div>
                )}

                <div className="w-full pt-2">
                  <Button
                    onClick={() => handleConnectApp(selectedApp)}
                    disabled={isConnecting}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 font-medium dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Authorizing connection...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4" />
                        Authorize Connection
                        <ExternalLink className="h-3.5 w-3.5 ml-0.5" />
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800 w-full justify-center">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Authenticated securely via Composio protocol</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STATE 2: Active Isolated Chat viewport */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Scoped Chat Header */}
            <div className="h-14 border-b border-gray-150 bg-white dark:border-gray-800 dark:bg-gray-900 px-4 flex items-center justify-between flex-none">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded overflow-hidden border border-gray-200 bg-white p-1 flex items-center justify-center dark:border-gray-800">
                  {selectedApp.image ? (
                    <img src={selectedApp.image} alt={selectedApp.title} className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-xs font-bold text-blue-600">{selectedApp.title.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{selectedApp.title} Console</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-gray-500 font-medium">Scoping Locked</span>
                  </div>
                </div>
              </div>

              {/* Chat action controls */}
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => clearChatSession(selectedApp.app_name)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-red-50 text-gray-500 hover:text-red-600 dark:hover:bg-red-950/20"
                  title="Clear chat session"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Scoped Message list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-950/40">
              {(!chatHistories[selectedApp.app_name] || chatHistories[selectedApp.app_name].length === 0) ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
                  <div className="h-11 w-11 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-500">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-gray-50">Beginning Scoped Session</h4>
                    <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                      Ask your isolated {selectedApp.title} agent to execute operations. Only {selectedApp.title} operations are available in this console.
                    </p>
                  </div>
                </div>
              ) : (
                chatHistories[selectedApp.app_name].map(message => {
                  const isUser = message.type === 'user';
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-lg rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                          isUser
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : message.error
                            ? 'bg-red-50 text-red-900 border border-red-150 dark:bg-red-950/20 dark:border-red-900/60 dark:text-red-300 rounded-bl-none'
                            : 'bg-white text-gray-900 border border-gray-150 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100 rounded-bl-none'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Render active tool logs if present */}
                        {message.toolsUsed && message.toolsUsed.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800/80 space-y-1 text-[11px] text-gray-500">
                            <span className="font-bold flex items-center gap-1.5">
                              <Shield className="h-3 w-3 text-emerald-500" /> Actions Log:
                            </span>
                            {message.toolsUsed.map((tool, i) => (
                              <div key={i} className="flex items-center gap-1.5 font-mono text-[10px] bg-gray-50 dark:bg-gray-950 p-1 rounded border dark:border-gray-850">
                                🔧 {tool}
                              </div>
                            ))}
                          </div>
                        )}

                        <span
                          className={`block text-[10px] mt-1 text-right ${
                            isUser ? 'text-blue-150' : 'text-gray-400 dark:text-gray-500'
                          }`}
                        >
                          {message.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              
              {/* Bot loading dynamic indicator */}
              {isSendingMessage && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white border border-gray-150 px-4 py-3 dark:bg-gray-900 dark:border-gray-800">
                    <div className="flex gap-1.5 items-center">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '0.15s' }} />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Scoped Input Box sticky */}
            <div className="p-4 border-t border-gray-150 bg-white dark:border-gray-800 dark:bg-gray-900 flex-none">
              <div className="flex gap-2">
                <Input
                  placeholder={`Ask ${selectedApp.title} agent to execute an action...`}
                  value={currentInput}
                  onChange={e => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSendingMessage}
                  className="flex-1 h-10 text-sm rounded-lg bg-gray-50 border-gray-200 dark:border-gray-800 dark:bg-gray-950 focus-visible:ring-1 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                />

                <Button
                  onClick={handleSendMessage}
                  disabled={isSendingMessage || !currentInput.trim()}
                  className="h-10 w-10 flex-none bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-0 flex items-center justify-center shadow-md dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

          </div>
        )}
      </main>

    </div>
  );
};

export default AppsPanelsContainer;
