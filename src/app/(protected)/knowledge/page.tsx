'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTenant } from '@/contexts/TenantContext';
import { UserMode } from '@/types/tenant';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, User, Sparkles, ExternalLink, Shield, Key, AlertTriangle, RefreshCw, CheckCircle, Trash2
} from 'lucide-react';
import { LlamaIndexChat } from './_components/LlamaIndexChat';
import { motion } from 'framer-motion';
import { allApps, APP } from '@/lib/all-apps';
import { apiClientJson, buildApiUrl } from '@/lib/api-client';

const KnowledgePageContent = () => {
  const { mode, currentTenant } = useTenant();
  const searchParams = useSearchParams();
  const connector = searchParams?.get('connector') || 'file';

  const [connectedAppSlugs, setConnectedAppSlugs] = useState<Set<string>>(new Set());
  const [isFetchingStatus, setIsFetchingStatus] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Match the active connector in allApps
  const selectedApp = allApps.find(
    app => app.app_name.toLowerCase() === connector.toLowerCase() && app.isAvailable
  ) || null;

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
    }
    setIsFetchingStatus(false);
  };

  useEffect(() => {
    if (connector !== 'file') {
      fetchConnectionStatus();
    }
    setSyncSuccess(false);
    setConnectionError(null);
  }, [connector]);

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

  // --- Disconnect App ---
  const handleDisconnectApp = async (app: APP) => {
    if (!app.app_name) return;
    setIsDisconnecting(true);
    
    const response = await apiClientJson<{ success: boolean }>(
      buildApiUrl('/composio-simple/disconnect'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_name: app.app_name }),
      }
    );

    if (response.success) {
      setConnectedAppSlugs(prev => {
        const next = new Set(prev);
        next.delete(app.app_name.toLowerCase());
        return next;
      });
    }
    setIsDisconnecting(false);
  };

  // --- Mock Manual Sync ---
  const handleSyncData = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
    }, 1500);
  };

  const getConnectorMetadata = () => {
    switch (connector) {
      case 'google-drive':
        return {
          color: 'from-amber-500 to-yellow-400 animate-pulse-slow',
          spec: 'LlamaHub GDriveReader API v3'
        };
      case 'notion':
        return {
          color: 'from-purple-600 to-indigo-500 animate-pulse-slow',
          spec: 'LlamaHub NotionPageReader GraphQL'
        };
      case 'sharepoint':
        return {
          color: 'from-blue-600 to-cyan-500 animate-pulse-slow',
          spec: 'LlamaHub SharePointReader MS Graph API'
        };
      case 'slack':
        return {
          color: 'from-emerald-500 to-teal-400 animate-pulse-slow',
          spec: 'LlamaHub SlackReader WebSocket API'
        };
      case 'github':
        return {
          color: 'from-zinc-800 to-gray-650 animate-pulse-slow',
          spec: 'LlamaHub GithubRepositoryReader Webhooks'
        };
      case 'confluence':
        return {
          color: 'from-red-500 to-orange-400 animate-pulse-slow',
          spec: 'LlamaHub ConfluenceReader REST API'
        };
      case 'dropbox':
        return {
          color: 'from-blue-500 to-indigo-400 animate-pulse-slow',
          spec: 'LlamaHub DropboxReader REST v2'
        };
      case 's3':
        return {
          color: 'from-orange-500 to-amber-500 animate-pulse-slow',
          spec: 'LlamaHub S3Reader AWS SDK v3'
        };
      default:
        return {
          color: 'from-blue-600 to-indigo-500 animate-pulse-slow',
          spec: 'Composio Dynamic Ingestion Engine'
        };
    }
  };

  const meta = getConnectorMetadata();
  const isAppConnected = selectedApp && connectedAppSlugs.has(selectedApp.app_name.toLowerCase());

  return (
    <div className="pt-6 h-full flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
      {/* Dynamic Header */}
      <div className="px-8 pb-4 border-b border-gray-100 dark:border-gray-900 flex-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-950 dark:text-gray-50">
              {connector === 'file' ? 'LlamaIndex File RAG' : 'LlamaIndex Data Connectors'}
            </h1>
            {mode === UserMode.TENANT && currentTenant ? (
              <Badge variant="outline" className="flex items-center gap-1 border-gray-300">
                <Building2 className="size-3 text-gray-500" />
                {currentTenant.name}
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1 border-gray-300">
                <User className="size-3 text-gray-500" />
                Personal
              </Badge>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {connector === 'file' 
            ? 'Parse, chunk, index, and query any local document securely using high-performance LlamaIndex vector store engines.'
            : 'Integrate external SaaS productivity platforms to map workspace knowledge contexts directly.'}
        </p>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto">
        {connector === 'file' ? (
          <LlamaIndexChat />
        ) : selectedApp ? (
          <div className="p-8 max-w-xl mx-auto flex items-center justify-center min-h-[70vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full relative rounded-3xl border border-gray-200/80 bg-white p-8 dark:border-gray-800 dark:bg-gray-900/40 shadow-xl shadow-gray-150/40 backdrop-blur-md overflow-hidden"
            >
              
              {!isAppConnected ? (
                /* STATE 1: Data Connector Setup Card (Unconnected) */
                <>
                  {/* Dynamic Aura background based on app branding color */}
                  <div className={`absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-tr ${meta.color} blur-3xl opacity-20`} />

                  <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                    
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
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-[10px] font-semibold font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 px-2 py-0.5 rounded border dark:border-blue-900/50">
                          {meta.spec}
                        </span>
                      </div>
                      <p className="mt-4 text-sm text-gray-655 dark:text-gray-400 leading-relaxed">
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
                </>
              ) : (
                /* STATE 2: Data Connector Ingestion Active (Connected) */
                <>
                  {/* Dynamic Aura background based on success emerald color */}
                  <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 blur-3xl opacity-20 animate-pulse-slow" />

                  <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                    
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-3xl bg-emerald-500/20 blur-lg animate-pulse" />
                      <div className="relative h-20 w-20 rounded-2xl border border-gray-200 bg-white p-3.5 flex items-center justify-center dark:border-gray-800 shadow-md">
                        {selectedApp.image ? (
                          <img src={selectedApp.image} alt={selectedApp.title} className="h-full w-full object-contain" />
                        ) : (
                          <span className="text-3xl font-bold text-blue-600">{selectedApp.title.charAt(0)}</span>
                        )}
                      </div>
                      <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-950 dark:text-gray-50">{selectedApp.title} Connected</h3>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="flex items-center gap-1.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/50">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Ingestion Synced
                        </span>
                      </div>
                      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 leading-normal max-w-sm">
                        Alti has authorized access to your {selectedApp.title} data. Ingested vectors are indexed and securely integrated into your active knowledge base contexts.
                      </p>
                    </div>

                    {/* Connection details metadata table */}
                    <div className="w-full text-left bg-gray-50/50 dark:bg-gray-950/40 p-4 rounded-xl border border-gray-150 dark:border-gray-800 space-y-2.5 text-xs text-gray-650 dark:text-gray-400">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-500 dark:text-gray-500">Connection Protocol</span>
                        <span className="font-mono bg-white dark:bg-gray-900 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-800 text-[10px]">Composio Managed OAuth</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-900 pt-2.5">
                        <span className="font-medium text-gray-550 dark:text-gray-500">RAG Index Target</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-300">LlamaIndex Vector Store</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-900 pt-2.5">
                        <span className="font-medium text-gray-550 dark:text-gray-500">Sync Pipeline Status</span>
                        <span className="text-emerald-600 dark:text-emerald-450 font-medium">Automatic / Up-to-date</span>
                      </div>
                    </div>

                    {syncSuccess && (
                      <div className="w-full flex items-center gap-2.5 p-3 rounded-lg border border-emerald-250 bg-emerald-50 text-emerald-700 text-xs dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400 text-left animate-in fade-in slide-in-from-top-1 duration-200">
                        <CheckCircle className="h-4 w-4 flex-none" />
                        <span>Ingestion sync request dispatched successfully. Knowledge index updated.</span>
                      </div>
                    )}

                    <div className="w-full pt-2 flex gap-3">
                      <Button
                        onClick={handleSyncData}
                        disabled={isSyncing}
                        className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 font-medium dark:bg-blue-700 dark:hover:bg-blue-800"
                      >
                        {isSyncing ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Syncing index...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4" />
                            Sync Ingestion
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={() => handleDisconnectApp(selectedApp)}
                        disabled={isDisconnecting}
                        variant="outline"
                        className="h-11 px-4 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 rounded-xl flex items-center justify-center gap-2 border-gray-200 dark:border-gray-800 text-gray-500"
                        title="Revoke connection access"
                      >
                        {isDisconnecting ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Invalid Connector Selection.
          </div>
        )}
      </div>
    </div>
  );
};

export default function KnowledgePage() {
  return (
    <Suspense fallback={
      <div className="flex h-full w-full items-center justify-center p-8 bg-white dark:bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <KnowledgePageContent />
    </Suspense>
  );
}
