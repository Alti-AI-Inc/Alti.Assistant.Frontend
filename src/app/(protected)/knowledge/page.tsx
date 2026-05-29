'use client';

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { LlamaIndexChat } from './_components/LlamaIndexChat';
import SpacesLayout from '@/components/sidebars/SpacesLayout';

const KnowledgePageContent = () => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
      {/* Dynamic Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-950">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Data Vault
        </h1>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <LlamaIndexChat />
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
      <SpacesLayout showColumnPanels={false}>
        <KnowledgePageContent />
      </SpacesLayout>
    </Suspense>
  );
}
