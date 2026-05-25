'use client';

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { LlamaIndexChat } from './_components/LlamaIndexChat';
import SpacesLayout from '@/components/sidebars/SpacesLayout';

const KnowledgePageContent = () => {
  return (
    <div className="pt-6 h-full flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
      {/* Dynamic Header */}
      <div className="px-8 pb-4 border-b border-gray-100 dark:border-gray-900 flex-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-950 dark:text-gray-50">
              LlamaIndex File Ingestion
            </h1>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Parse, chunk, index, and query any local document securely using high-performance LlamaIndex vector store engines.
        </p>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto">
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
