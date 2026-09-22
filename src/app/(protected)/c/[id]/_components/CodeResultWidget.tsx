'use client';

import React, { useState } from 'react';

interface CodeResultWidgetProps {
  codeData: {
    code?: string;
    language?: string;
    output?: string;
    error?: string | null;
    files?: Array<{ name: string; url: string }>;
  };
}

export default function CodeResultWidget({ codeData }: CodeResultWidgetProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'output'>('output');
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (codeData.code) {
      await navigator.clipboard.writeText(codeData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white">Code Execution</h3>
          <p className="text-xs text-gray-400">{codeData.language || 'Python'} · Together AI Sandbox</p>
        </div>
        {codeData.error ? (
          <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 font-medium">Error</span>
        ) : (
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">✓ Success</span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 text-xs font-medium py-2.5 transition-colors ${
            activeTab === 'code'
              ? 'text-green-400 border-b-2 border-green-400 bg-white/5'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Code
        </button>
        <button
          onClick={() => setActiveTab('output')}
          className={`flex-1 text-xs font-medium py-2.5 transition-colors ${
            activeTab === 'output'
              ? 'text-green-400 border-b-2 border-green-400 bg-white/5'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Output
        </button>
      </div>

      {/* Content */}
      <div className="max-h-72 overflow-auto">
        {activeTab === 'code' ? (
          <div className="relative">
            <pre className="p-4 text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
              {codeData.code || 'No code available'}
            </pre>
            <button
              onClick={copyCode}
              className="absolute top-3 right-3 text-xs text-gray-500 hover:text-white px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        ) : (
          <div className="p-4">
            {codeData.error && (
              <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs font-mono text-red-400 whitespace-pre-wrap">{codeData.error}</p>
              </div>
            )}
            <pre className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
              {codeData.output || 'No output'}
            </pre>
          </div>
        )}
      </div>

      {/* Files */}
      {codeData.files && codeData.files.length > 0 && (
        <div className="px-5 py-3 border-t border-white/5">
          <p className="text-xs text-gray-500 mb-2">Generated Files</p>
          <div className="flex flex-wrap gap-2">
            {codeData.files.map((file, i) => (
              <a
                key={i}
                href={file.url}
                download={file.name}
                className="text-xs text-green-400 hover:text-green-300 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {file.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
