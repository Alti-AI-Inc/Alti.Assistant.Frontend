'use client';

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTenant } from '@/contexts/TenantContext';
import { UserMode } from '@/types/tenant';
import { Badge } from '@/components/ui/badge';
import { Building2, User, Sparkles, ExternalLink } from 'lucide-react';
import { LlamaIndexChat } from './_components/LlamaIndexChat';
import { motion } from 'framer-motion';

const KnowledgePageContent = () => {
  const { mode, currentTenant } = useTenant();
  const searchParams = useSearchParams();
  const connector = searchParams?.get('connector') || 'file';

  const getConnectorMetadata = () => {
    switch (connector) {
      case 'google-drive':
        return {
          name: 'Google Drive Data Connector',
          desc: 'Seamlessly index your Google Drive folders and files using the pre-built LlamaHub GoogleDriveReader. This will synchronize documents dynamically and keep vector embeddings fresh.',
          color: 'from-amber-500 to-yellow-400 animate-pulse-slow',
          icon: '🤖',
          spec: 'LlamaHub GDriveReader API v3'
        };
      case 'notion':
        return {
          name: 'Notion Workspace Connector',
          desc: 'Connect entire Notion pages, sub-pages, and databases securely. Keeps markdown structures and hierarchical page relationships fully intact for deep semantic searches.',
          color: 'from-purple-600 to-indigo-500 animate-pulse-slow',
          icon: '📓',
          spec: 'LlamaHub NotionPageReader GraphQL'
        };
      case 'sharepoint':
        return {
          name: 'SharePoint Enterprise Connector',
          desc: 'Ingest enterprise document folders and document libraries directly. Perfectly scopes query contexts according to SharePoint authorization structures.',
          color: 'from-blue-600 to-cyan-500 animate-pulse-slow',
          icon: '📦',
          spec: 'LlamaHub SharePointReader MS Graph API'
        };
      case 'slack':
        return {
          name: 'Slack Channel Ingestion Connector',
          desc: 'Parse and vectorise historical conversation threads, links, and text from public Slack channels to create a fully searchable workspace knowledge hub.',
          color: 'from-emerald-500 to-teal-400 animate-pulse-slow',
          icon: '💬',
          spec: 'LlamaHub SlackReader WebSocket API'
        };
      case 'github':
        return {
          name: 'GitHub Repository Codebase Connector',
          desc: 'Index repository codes, README markdown files, issues, and wiki pages. Optimized to recognize code snippets, function definitions, and file import structures.',
          color: 'from-zinc-800 to-gray-650 animate-pulse-slow',
          icon: '🐙',
          spec: 'LlamaHub GithubRepositoryReader Webhooks'
        };
      case 'confluence':
        return {
          name: 'Confluence Wiki Connector',
          desc: 'Sync and vectorise articles, wiki spaces, comments, and file attachments dynamically from your Confluence cloud workspace.',
          color: 'from-red-500 to-orange-400 animate-pulse-slow',
          icon: '📄',
          spec: 'LlamaHub ConfluenceReader REST API'
        };
      case 'dropbox':
        return {
          name: 'Dropbox Folder Ingestion Connector',
          desc: 'Ingest directories of documents from your Dropbox storage account seamlessly, creating real-time vector mappings of your document databases.',
          color: 'from-blue-500 to-indigo-400 animate-pulse-slow',
          icon: '📦',
          spec: 'LlamaHub DropboxReader REST v2'
        };
      case 's3':
        return {
          name: 'AWS S3 Bucket Storage Connector',
          desc: 'Listen for new additions in S3 buckets and instantly trigger LlamaIndex pipeline indexing for PDF, Word, and text logs.',
          color: 'from-orange-500 to-amber-500 animate-pulse-slow',
          icon: '☁️',
          spec: 'LlamaHub S3Reader AWS SDK v3'
        };
      default:
        return null;
    }
  };

  const meta = getConnectorMetadata();

  return (
    <div className="pt-6 h-full flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
      {/* Dynamic Header */}
      <div className="px-8 pb-4 border-b border-gray-100 dark:border-gray-900 flex-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-950 dark:text-gray-55">
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
        ) : meta ? (
          /* Premium coming-soon view */
          <div className="p-8 max-w-xl mx-auto flex items-center justify-center min-h-[70vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full relative rounded-3xl border border-gray-200/80 bg-white p-8 dark:border-gray-800 dark:bg-gray-900/40 shadow-xl shadow-gray-150/40 backdrop-blur-md overflow-hidden"
            >
              {/* Dynamic Aura background based on app branding color */}
              <div className={`absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-tr ${meta.color} blur-3xl opacity-20`} />

              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                
                <div className="relative">
                  <div className="h-20 w-20 rounded-2xl border border-gray-200 bg-white flex items-center justify-center dark:border-gray-850 shadow-md text-3xl">
                    {meta.icon}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-950 dark:text-gray-50">{meta.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-[10px] font-semibold font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 px-2 py-0.5 rounded border dark:border-blue-900/50">
                      {meta.spec}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-gray-655 dark:text-gray-400 leading-relaxed">
                    {meta.desc}
                  </p>
                </div>

                <div className="w-full pt-4 flex flex-col gap-2">
                  <div className="h-11 rounded-xl bg-gray-100 text-gray-500 font-medium flex items-center justify-center gap-2 border dark:bg-gray-800 dark:border-gray-700">
                    <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                    Ingestion Integration Coming Soon
                  </div>
                  <a
                    href="https://llamahub.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-1.5 focus:outline-none"
                  >
                    Explore LlamaHub Connector Spec
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
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
