'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { allApps, APP } from '@/lib/all-apps';
import { apiClientJson, buildApiUrl } from '@/lib/api-client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useConnectionsQuery } from '@/hooks/useConnectApps';
import { useQueryClient } from '@tanstack/react-query';
import { 
  Search, MessageSquare, Shield, CheckCircle, AlertTriangle, 
  ArrowRight, Key, ExternalLink, RefreshCw, Send, Sparkles, 
  HelpCircle, ChevronRight, Activity, Trash2, Database,
  Terminal, Sliders, Server, Lock
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
  const router = useRouter();
  const activeAppSlug = searchParams?.get('app');

  const [selectedApp, setSelectedApp] = useState<APP | null>(null);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: connections, isLoading: isFetchingStatus } = useConnectionsQuery(
    session?.accessToken,
  );

  const [connectedAppSlugs, setConnectedAppSlugs] = useState<Set<string>>(new Set());

  // --- Custom Database MCP States ---
  const [customDbMcpStatus, setCustomDbMcpStatus] = useState<{
    connected: boolean;
    type?: string;
    database?: string;
    terminalLogs?: string[];
    isMocked?: boolean;
  } | null>(null);

  const [dbType, setDbType] = useState<'postgres' | 'mysql' | 'sqlite' | 'bigquery'>('postgres');
  const [dbHost, setDbHost] = useState('127.0.0.1');
  const [dbPort, setDbPort] = useState('5432');
  const [dbName, setDbName] = useState('');
  const [dbUser, setDbUser] = useState('');
  const [dbPassword, setDbPassword] = useState('');

  // Poll status of the custom database MCP server to keep connected status and logs in sync
  const fetchCustomDbStatus = async () => {
    try {
      const res = await apiClientJson<{
        connected: boolean;
        type?: string;
        database?: string;
        terminalLogs?: string[];
        isMocked?: boolean;
      }>(buildApiUrl('/mcp-toolbox/status'), { method: 'GET' });
      
      if (res.success && res.data) {
        setCustomDbMcpStatus(res.data);
        const data = res.data;
        setConnectedAppSlugs(prev => {
          const next = new Set(prev);
          if (data.connected) {
            next.add('custom_db_mcp');
          } else {
            next.delete('custom_db_mcp');
          }
          return next;
        });
      }
    } catch (err) {
      console.error('Failed to fetch custom database status:', err);
    }
  };

  useEffect(() => {
    fetchCustomDbStatus();
    const interval = setInterval(fetchCustomDbStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (connections) {
      const activeSlugs = new Set(
        connections.map(account => account.toolkit?.slug?.toLowerCase()).filter(Boolean)
      );
      if (customDbMcpStatus?.connected) {
        activeSlugs.add('custom_db_mcp');
      }
      setConnectedAppSlugs(activeSlugs);
    }
  }, [connections, customDbMcpStatus]);

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Isolated chat histories: Record<app_name, ChatMessage[]>
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({});
  const [currentInput, setCurrentInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [activeConversationIds, setActiveConversationIds] = useState<Record<string, string>>({});

  const chatEndRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

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

  // Scroll to bottom of chat when messages or loading state change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistories, isSendingMessage, selectedApp]);

  // Scroll to bottom of terminal logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [customDbMcpStatus?.terminalLogs]);

  // --- Connect/OAuth flow for standard Composio apps ---
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
          // Invalidate connections query to refetch status globally
          queryClient.invalidateQueries({ queryKey: ['connections'] });
        }
      }, 3000);
    } else {
      setIsConnecting(false);
      setConnectionError(response.debugMessage || 'Failed to initiate application authentication.');
    }
  };

  // --- Connect dynamic database server via mcp-toolbox ---
  const handleConnectCustomDb = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setConnectionError(null);

    const response = await apiClientJson<{
      success: boolean;
      message: string;
      terminalLogs?: string[];
      isMocked?: boolean;
      error?: string;
    }>(
      buildApiUrl('/mcp-toolbox/connect'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connectionDetails: {
            type: dbType,
            host: dbType === 'sqlite' ? undefined : dbHost,
            port: dbType === 'sqlite' ? undefined : (Number(dbPort) || undefined),
            database: dbName,
            user: dbType === 'sqlite' ? undefined : dbUser,
            password: dbType === 'sqlite' ? undefined : dbPassword,
          }
        }),
      }
    );

    if (response.success) {
      setIsConnecting(false);
      setConnectedAppSlugs(prev => {
        const next = new Set(prev);
        next.add('custom_db_mcp');
        return next;
      });
      // Force immediate check
      await fetchCustomDbStatus();
    } else {
      setIsConnecting(false);
      setConnectionError(response.debugMessage || response.data?.error || 'Failed to connect database. Verify credentials and try again.');
    }
  };

  // --- Disconnect dynamic database server via mcp-toolbox ---
  const handleDisconnectCustomDb = async () => {
    const res = await apiClientJson<{ success: boolean; message: string }>(
      buildApiUrl('/mcp-toolbox/disconnect'),
      { method: 'POST' }
    );
    if (res.success) {
      setConnectedAppSlugs(prev => {
        const next = new Set(prev);
        next.delete('custom_db_mcp');
        return next;
      });
      setCustomDbMcpStatus(null);
      clearChatSession('custom_db_mcp');
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

    const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // A. Query Custom Database MCP via mcp-toolbox
    if (appSlug === 'custom_db_mcp') {
      const response = await apiClientJson<{
        success: boolean;
        answer: string;
        logs?: string[];
        toolUsed?: string;
        statement?: string;
        error?: string;
      }>(
        buildApiUrl('/mcp-toolbox/query'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userPrompt }),
        }
      );

      if (response.success && response.data) {
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          type: 'bot',
          content: response.data.answer || 'Safe database query executed successfully.',
          timestamp: botTimestamp,
          toolsUsed: response.data.toolUsed ? [response.data.toolUsed] : [],
        };

        setChatHistories(prev => ({
          ...prev,
          [appSlug]: [...(prev[appSlug] || []), botMessage],
        }));

        // Refresh dynamic server logs immediately
        await fetchCustomDbStatus();
      } else {
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          type: 'bot',
          content: response.debugMessage || response.data?.error || 'Failed to process safe database query.',
          timestamp: botTimestamp,
          error: true,
        };

        setChatHistories(prev => ({
          ...prev,
          [appSlug]: [...(prev[appSlug] || []), errorMessage],
        }));
      }

      setIsSendingMessage(false);
      return;
    }

    // B. Standard Composio scoped chat logic
    const currentConvId = activeConversationIds[appSlug] || null;

    const response = await apiClientJson<{ response: string; conversationId: string; toolsUsed?: string[] }>(
      buildApiUrl('/composio-simple/chat'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userPrompt,
          conversationId: currentConvId,
          scopedApp: appSlug,
        }),
      }
    );

    if (response.success && response.data) {
      if (response.data.conversationId) {
        setActiveConversationIds(prev => ({
          ...prev,
          [appSlug]: response.data!.conversationId,
        }));
      }

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

  const isSelectedAppConnected = selectedApp && connectedAppSlugs.has(selectedApp.app_name.toLowerCase());

  return (
    <div className="flex h-full w-full flex-row overflow-hidden bg-gray-50 dark:bg-gray-950">
      
      {/* =========================================================
          RIGHT WORKSPACE - ACTIVE DETAIL OR CHATVIEW CONSOLE
          ========================================================= */}
      <main className="flex-1 flex flex-row bg-white dark:bg-gray-950 overflow-hidden relative">
        
        {isFetchingStatus ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 bg-white dark:bg-gray-950">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-500 animate-pulse">Loading workspace status...</p>
          </div>
        ) : !selectedApp ? (
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

            {/* Premium SQL Database MCP CTA card */}
            <div className="w-full p-4 rounded-xl border border-blue-100 bg-blue-50/30 dark:border-blue-900/20 dark:bg-blue-950/10 flex flex-col items-center gap-3.5 mt-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500 animate-pulse" />
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Developer Toolbox Powerup</span>
              </div>
              <div className="text-center">
                <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">Secure Database MCP Integration</h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-normal max-w-sm">
                  Launch an isolated standard-compliant Go MCP process directly connected to your local or cloud PostgreSQL, MySQL, SQLite, or BigQuery database.
                </p>
              </div>
              <Button
                onClick={() => router.push('/apps?app=custom_db_mcp')}
                className="px-5 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md flex items-center gap-2 font-medium text-xs dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Connect Custom Database MCP
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

          </div>
        ) : !isSelectedAppConnected ? (
          /* STATE 1: App Setup / Connection screen */
          <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
            {selectedApp.app_name === 'custom_db_mcp' ? (
              /* A. Custom Database MCP Configuration Form */
              <div className="w-full max-w-xl rounded-2xl border border-gray-200/80 bg-white p-8 dark:border-gray-800 dark:bg-gray-900/40 shadow-xl shadow-gray-200/50 dark:shadow-none backdrop-blur-md animate-in zoom-in-95 duration-200">
                <form onSubmit={handleConnectCustomDb} className="space-y-6">
                  
                  {/* Aura Header */}
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-xl animate-pulse" />
                      <div className="relative h-14 w-14 rounded-xl border border-gray-200 bg-white p-3 flex items-center justify-center dark:border-gray-800 shadow-sm">
                        <Database className="h-7 w-7 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-950 dark:text-gray-50">Connect Custom SQL Database</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Dynamically register a local or remote database as an active Model Context Protocol (MCP) server.
                      </p>
                    </div>
                  </div>

                  {connectionError && (
                    <div className="flex items-center gap-2.5 p-3.5 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs dark:bg-red-950/20 dark:border-red-900 dark:text-red-400">
                      <AlertTriangle className="h-4.5 w-4.5 flex-none text-red-500" />
                      <span className="text-left font-medium leading-relaxed">{connectionError}</span>
                    </div>
                  )}

                  {/* Form fields grid */}
                  <div className="grid grid-cols-2 gap-4">
                    
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">Database Engine Type</label>
                      <select 
                        value={dbType} 
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setDbType(val);
                          // Suggest default ports
                          if (val === 'postgres') setDbPort('5432');
                          else if (val === 'mysql') setDbPort('3306');
                          else if (val === 'sqlite') setDbPort('');
                        }}
                        className="w-full h-10 px-3 text-sm rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="postgres">PostgreSQL</option>
                        <option value="mysql">MySQL / MariaDB</option>
                        <option value="sqlite">SQLite</option>
                        <option value="bigquery">Google BigQuery</option>
                      </select>
                    </div>

                    {dbType !== 'sqlite' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">Host / Endpoint</label>
                          <Input 
                            value={dbHost} 
                            onChange={e => setDbHost(e.target.value)} 
                            placeholder="e.g. 127.0.0.1" 
                            required 
                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">Port</label>
                          <Input 
                            value={dbPort} 
                            onChange={e => setDbPort(e.target.value)} 
                            placeholder="e.g. 5432" 
                            required 
                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-sm"
                          />
                        </div>
                      </>
                    )}

                    <div className={dbType === 'sqlite' ? 'col-span-2' : ''}>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">
                        {dbType === 'sqlite' ? 'SQLite Database Path' : 'Database Name'}
                      </label>
                      <Input 
                        value={dbName} 
                        onChange={e => setDbName(e.target.value)} 
                        placeholder={dbType === 'sqlite' ? 'e.g. data/sandbox.db' : 'e.g. production_db'} 
                        required 
                        className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-sm"
                      />
                    </div>

                    {dbType !== 'sqlite' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">Username</label>
                          <Input 
                            value={dbUser} 
                            onChange={e => setDbUser(e.target.value)} 
                            placeholder="e.g. postgres" 
                            required 
                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">Password</label>
                          <Input 
                            type="password"
                            value={dbPassword} 
                            onChange={e => setDbPassword(e.target.value)} 
                            placeholder="••••••••" 
                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-sm"
                          />
                        </div>
                      </>
                    )}

                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isConnecting}
                      className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 font-semibold"
                    >
                      {isConnecting ? (
                        <>
                          <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                          Booting Secure Go MCP Client...
                        </>
                      ) : (
                        <>
                          <Server className="h-4.5 w-4.5" />
                          Boot Secure Database MCP Server
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800 w-full justify-center">
                    <Lock className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                    <span>Dynamic tools.yaml configuration generated in sandbox</span>
                  </div>
                </form>
              </div>
            ) : (
              /* B. Standard OAuth App Connect View */
              <div className="w-full max-w-lg rounded-2xl border border-gray-200/80 bg-white p-8 dark:border-gray-800 dark:bg-gray-900/40 shadow-xl shadow-gray-200/50 dark:shadow-none backdrop-blur-md animate-in zoom-in-95 duration-200">
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
            )}
          </div>
        ) : (
          /* STATE 2: Active Isolated Chat Viewport */
          <div className="flex-1 flex flex-row overflow-hidden h-full w-full">
            
            {/* Left Hand: Chat Viewport */}
            <div className="flex-1 flex flex-col overflow-hidden h-full">
              
              {/* Scoped Chat Header */}
              <div className="h-14 border-b border-gray-150 bg-white dark:border-gray-800 dark:bg-gray-900 px-4 flex items-center justify-between flex-none">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded overflow-hidden border border-gray-200 bg-white p-1.5 flex items-center justify-center dark:border-gray-800">
                    {selectedApp.app_name === 'custom_db_mcp' ? (
                      <Database className="h-4 w-4 text-blue-600" />
                    ) : selectedApp.image ? (
                      <img src={selectedApp.image} alt={selectedApp.title} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-xs font-bold text-blue-600">{selectedApp.title.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{selectedApp.title} Console</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-gray-500 font-medium">
                        {selectedApp.app_name === 'custom_db_mcp' ? 'Standard Stdio MCP Bridge Active' : 'Scoping Locked'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chat action controls */}
                <div className="flex items-center gap-1.5">
                  <Button
                    onClick={() => {
                      if (selectedApp.app_name === 'custom_db_mcp') {
                        handleDisconnectCustomDb();
                      } else {
                        clearChatSession(selectedApp.app_name);
                      }
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/20 px-2 rounded-lg gap-1.5"
                    title={selectedApp.app_name === 'custom_db_mcp' ? 'Disconnect Database Server' : 'Clear chat session'}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {selectedApp.app_name === 'custom_db_mcp' ? 'Disconnect' : 'Clear'}
                  </Button>
                </div>
              </div>

              {/* Scoped Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-950/40">
                {(!chatHistories[selectedApp.app_name] || chatHistories[selectedApp.app_name].length === 0) ? (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-350">
                    <div className="h-11 w-11 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-500">
                      {selectedApp.app_name === 'custom_db_mcp' ? <Database className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-gray-50">
                        {selectedApp.app_name === 'custom_db_mcp' ? 'SQL Introspection Engine Ready' : 'Beginning Scoped Session'}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                        {selectedApp.app_name === 'custom_db_mcp' 
                          ? 'Prompt the database agent to inspect schemas, list tables, or request secure pre-approved parameterized metrics.'
                          : `Ask your isolated ${selectedApp.title} agent to execute operations. Only ${selectedApp.title} operations are available in this console.`
                        }
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
                          <div className="leading-relaxed whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                            {message.content}
                          </div>
                          
                          {/* Render active tool logs if present */}
                          {message.toolsUsed && message.toolsUsed.length > 0 && (
                            <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 space-y-1.5 text-[11px] text-gray-500">
                              <span className="font-bold flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
                                <Shield className="h-3 w-3 text-emerald-500" /> Actions Log:
                              </span>
                              {message.toolsUsed.map((tool, i) => (
                                <div key={i} className="flex items-center gap-1.5 font-mono text-[10px] bg-gray-50 dark:bg-gray-950 p-1.5 rounded border dark:border-gray-850 text-gray-700 dark:text-gray-300">
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
                    placeholder={selectedApp.app_name === 'custom_db_mcp' ? "Ask the Database MCP agent to introspect tables or queries..." : `Ask ${selectedApp.title} agent to execute an action...`}
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

            {/* Right Hand: Live Neon Terminal Logs View (Only for custom_db_mcp in lg viewports) */}
            {selectedApp.app_name === 'custom_db_mcp' && (
              <div className="hidden lg:flex flex-col w-[380px] xl:w-[420px] bg-[#0A0D14] border-l border-gray-150 dark:border-gray-800 overflow-hidden h-full flex-none animate-in slide-in-from-right-3 duration-300">
                <div className="h-14 border-b border-gray-800 bg-[#0B0F19] px-4 flex items-center gap-2 flex-none">
                  <Terminal className="h-4 w-4 text-emerald-450" />
                  <span className="text-xs font-bold text-gray-200 tracking-wider uppercase">Live Stdio Console Stream</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse ml-auto" />
                </div>

                <div className="flex-1 overflow-y-auto p-4 font-mono text-[10.5px] leading-relaxed space-y-1.5 bg-[#07090E] text-zinc-305">
                  {customDbMcpStatus?.terminalLogs && customDbMcpStatus.terminalLogs.length > 0 ? (
                    customDbMcpStatus.terminalLogs.map((log, i) => {
                      let color = 'text-zinc-400';
                      if (log.includes('[SUCCESS]')) color = 'text-emerald-400 font-medium';
                      else if (log.includes('[ERROR]')) color = 'text-red-400 font-bold';
                      else if (log.includes('[SYS]')) color = 'text-blue-400';
                      else if (log.includes('[SQL]')) color = 'text-indigo-400 font-medium';
                      else if (log.includes('[Go MCP]') || log.includes('[MCP]')) color = 'text-teal-400';
                      else if (log.includes('[CONFIG]')) color = 'text-amber-400';

                      return (
                        <div key={i} className={`whitespace-pre-wrap select-all py-0.5 border-b border-white/[0.02] last:border-0 ${color}`}>
                          {log}
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex items-center justify-center text-center text-zinc-650 italic">
                      No active stream logs. Run a transaction to capture standard streams.
                    </div>
                  )}
                  <div ref={terminalEndRef} />
                </div>
              </div>
            )}

          </div>
        )}
      </main>

    </div>
  );
};

export default AppsPanelsContainer;
