'use client';

import { useState } from 'react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Key, Server, TerminalSquare, Copy, Plus, Check } from 'lucide-react';

export default function DevelopersPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [apiKeys, setApiKeys] = useState([
    {
      id: '1',
      key: 'sk-prod-9a8b7c6d5e4f3a2b1c',
      createdAt: 'Sep 25, 2026',
      status: 'Active',
      usage: 'Never used',
    },
  ]);

  const generateKey = () => {
    const newKey = {
      id: Math.random().toString(36).substring(7),
      key: `sk-prod-${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'Active',
      usage: 'Never used',
    };
    setApiKeys([newKey, ...apiKeys]);
  };

  const revokeKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="dark:bg-gray-955 flex h-full flex-col overflow-hidden bg-[#e1e1e1]">
      <Tabs defaultValue="api-keys" className="flex h-full w-full flex-col">
        {/* Top Header & Navigation */}
        <div className="dark:bg-gray-955 flex h-[52px] flex-none items-center justify-between border-b border-black/10 bg-white px-8 dark:border-white/10">
          <div className="flex items-center">
            <h1 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
              Developers
            </h1>
          </div>
          <div className="flex items-center">
            <TabsList className="h-auto gap-1 rounded-[5px] bg-gray-100 p-1 shadow-inner dark:bg-zinc-800/50">
              <TabsTrigger
                value="api-keys"
                className="rounded-[3px] px-4 py-1 text-xs font-bold text-gray-500 transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-white"
              >
                API Keys
              </TabsTrigger>
              <TabsTrigger
                value="endpoints"
                className="rounded-[3px] px-4 py-1 text-xs font-bold text-gray-500 transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-white"
              >
                Endpoints
              </TabsTrigger>
              <TabsTrigger
                value="mcp-servers"
                className="rounded-[3px] px-4 py-1 text-xs font-bold text-gray-500 transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-white"
              >
                MCP Servers
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-3">
          <div className="mx-auto max-w-7xl py-4">
            {/* API KEYS TAB */}
            <TabsContent value="api-keys" className="m-0 border-0 p-0">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage API keys to authenticate your requests to the Aphura
                  Cloud APIs.
                </p>
                <button
                  onClick={generateKey}
                  className="flex h-8 items-center gap-2 rounded-[3px] bg-black px-4 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95 dark:bg-white dark:text-black"
                >
                  <Plus className="h-4 w-4" />
                  Generate New Key
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {/* Empty State / Example Row */}
                <div className="flex w-full items-center justify-between rounded-[5px] border border-black/5 bg-white px-5 py-2.5 shadow-md transition-all duration-300 hover:-translate-y-0.5 dark:border-white/5 dark:bg-zinc-950/50">
                  <div className="flex items-center gap-4">
                    <div className="dark:bg-gray-955 flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#e1e1e1] p-1.5 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                      <Key className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                          sk-prod-...82fa
                        </h3>
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700 ring-1 ring-green-500/20 ring-inset dark:bg-green-900/30 dark:text-green-400 dark:ring-green-800">
                          Active
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                        Created Sep 25, 2026 • Never used
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy('sk-prod-...82fa', 'apikey')}
                      className="flex h-8 w-8 items-center justify-center rounded-[3px] bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 active:scale-95 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                    >
                      {copiedId === 'apikey' ? (
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <button className="h-8 w-[80px] shrink-0 rounded-[3px] bg-red-50 text-xs font-bold text-red-600 transition-all hover:bg-red-100 active:scale-95 dark:bg-red-900/20 dark:text-red-500 dark:hover:bg-red-900/40">
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ENDPOINTS TAB */}
            <TabsContent value="endpoints" className="m-0 border-0 p-0">
              <div className="flex flex-col gap-2">
                {[
                  // --- TEXT & LLMs (Together.ai / Core) ---
                  {
                    method: 'POST',
                    path: '/chat/completions',
                    name: 'Chat Completions',
                    desc: 'Generate a conversational response from an agent or model',
                  },
                  {
                    method: 'POST',
                    path: '/completions',
                    name: 'Text Completion',
                    desc: 'Standard text completion and code generation',
                  },
                  {
                    method: 'POST',
                    path: '/embeddings',
                    name: 'Embeddings',
                    desc: 'Generate dense vector embeddings for text',
                  },
                  {
                    method: 'POST',
                    path: '/fine-tunes',
                    name: 'Fine-Tuning',
                    desc: 'Create a job to fine-tune a custom model',
                  },

                  // --- AUDIO (Speech) ---
                  {
                    method: 'POST',
                    path: '/audio/transcriptions',
                    name: 'Speech-to-Text (STT)',
                    desc: 'Transcribe audio to text',
                  },
                  {
                    method: 'POST',
                    path: '/audio/speech',
                    name: 'Text-to-Speech (TTS)',
                    desc: 'Generate lifelike audio from text',
                  },
                  {
                    method: 'POST',
                    path: '/audio/translations',
                    name: 'Audio Translation',
                    desc: 'Translate audio in any language to English text',
                  },

                  // --- VISION & VIDEO ---
                  {
                    method: 'POST',
                    path: '/images/generations',
                    name: 'Image Generation',
                    desc: 'Generate images from text prompts',
                  },
                  {
                    method: 'POST',
                    path: '/images/edits',
                    name: 'Image Editing',
                    desc: 'Edit or extend images (Inpainting/Outpainting)',
                  },
                  {
                    method: 'POST',
                    path: '/video/generations',
                    name: 'Video Generation',
                    desc: 'Generate short video clips from text or images',
                  },

                  // --- NEURAL SEARCH (Exa.ai) ---
                  {
                    method: 'POST',
                    path: '/search',
                    name: 'Neural Web Search',
                    desc: 'Perform meaning-based neural web search',
                  },
                  {
                    method: 'POST',
                    path: '/search/contents',
                    name: 'Content Extraction',
                    desc: 'Retrieve cleanly parsed HTML/Markdown contents from URLs',
                  },
                  {
                    method: 'POST',
                    path: '/search/similar',
                    name: 'Find Similar Pages',
                    desc: 'Find URLs similar to a given webpage',
                  },

                  // --- ACTIONS & INTEGRATIONS (Composio) ---
                  {
                    method: 'GET',
                    path: '/apps',
                    name: 'Integrated Apps',
                    desc: 'List all available third-party integrations (GitHub, Slack, etc.)',
                  },
                  {
                    method: 'POST',
                    path: '/actions/execute',
                    name: 'Execute Action',
                    desc: 'Execute a specific action across 1500+ integrated tools',
                  },
                  {
                    method: 'GET',
                    path: '/triggers',
                    name: 'Event Triggers',
                    desc: 'List active event triggers (e.g. "New GitHub Issue")',
                  },
                  {
                    method: 'POST',
                    path: '/webhooks/register',
                    name: 'Webhooks',
                    desc: 'Register a webhook destination for incoming events',
                  },

                  // --- AGENTS & CHAINS (LangChain) ---
                  {
                    method: 'POST',
                    path: '/agents/invoke',
                    name: 'Invoke Agent',
                    desc: 'Invoke a stateful autonomous agent',
                  },
                  {
                    method: 'POST',
                    path: '/chains/execute',
                    name: 'Execute Chain',
                    desc: 'Run a complex multi-step tool chain',
                  },
                  {
                    method: 'GET',
                    path: '/memory/sessions',
                    name: 'Agent Memory',
                    desc: 'Retrieve conversational memory for specific agent sessions',
                  },

                  // --- KNOWLEDGE & RAG ---
                  {
                    method: 'GET',
                    path: '/knowledge/query',
                    name: 'RAG Vector Query',
                    desc: 'Query your managed RAG vector database',
                  },
                  {
                    method: 'POST',
                    path: '/knowledge/upload',
                    name: 'Knowledge Ingest',
                    desc: 'Ingest and chunk documents into the knowledge base',
                  },

                  // --- COMPUTE & INFRA (Liberty Center One) ---
                  {
                    method: 'GET',
                    path: '/compute/instances',
                    name: 'GPU Instances',
                    desc: 'List active dedicated GPU instances',
                  },
                  {
                    method: 'POST',
                    path: '/compute/deploy',
                    name: 'Model Deployment',
                    desc: 'Deploy a containerized model to dedicated hardware',
                  },
                ].map((ep, i) => (
                  <div
                    key={i}
                    className="flex w-full items-center justify-between rounded-[5px] border border-black/5 bg-white px-5 py-2.5 shadow-md transition-all duration-300 hover:-translate-y-0.5 dark:border-white/5 dark:bg-zinc-950/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-12 shrink-0 items-center justify-center rounded-[4px] bg-blue-50 p-1.5 shadow-sm ring-1 ring-blue-500/10 dark:bg-blue-900/20 dark:ring-blue-500/20">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                          {ep.method}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                            {ep.name}
                          </h3>
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-400 dark:bg-zinc-800/50 dark:text-zinc-500">
                            {ep.path}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                          {ep.desc}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => window.open('https://docs.aphura.com', '_blank')} className="h-8 w-[100px] shrink-0 rounded-[3px] bg-black text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 dark:bg-white dark:text-black">
                      View Docs
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* MCP SERVERS TAB */}
            <TabsContent value="mcp-servers" className="m-0 border-0 p-0">
              <div className="flex flex-col gap-4">
                <div className="rounded-[5px] border border-black/5 bg-white p-6 shadow-md dark:border-white/5 dark:bg-zinc-950/50">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] bg-[#e1e1e1] p-2 shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
                      <TerminalSquare className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        Quickstart Command
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Run our MCP server directly via NPX.
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <pre className="overflow-x-auto rounded-[5px] bg-gray-50 p-4 text-sm text-gray-800 ring-1 ring-gray-200 dark:bg-zinc-900 dark:text-gray-300 dark:ring-white/10">
                      <code>npx -y @aphura/mcp-server</code>
                    </pre>
                    <button className="absolute top-3 right-3 rounded-[3px] bg-white p-1.5 text-gray-500 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 active:scale-95 dark:bg-zinc-800 dark:text-gray-400 dark:ring-white/10 dark:hover:bg-zinc-700">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="rounded-[5px] border border-black/5 bg-white p-6 shadow-md dark:border-white/5 dark:bg-zinc-950/50">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] bg-[#e1e1e1] p-2 shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
                      <Server className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        JSON Configuration
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Add this to your MCP client's configuration file.
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <pre className="overflow-x-auto rounded-[5px] bg-gray-50 p-4 text-sm text-gray-800 ring-1 ring-gray-200 dark:bg-zinc-900 dark:text-gray-300 dark:ring-white/10">
                      <code>{`{
  "mcpServers": {
    "aphura": {
      "command": "npx",
      "args": ["-y", "@aphura/mcp-server"],
      "env": {
        "APHURA_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`}</code>
                    </pre>
                    <button className="absolute top-3 right-3 rounded-[3px] bg-white p-1.5 text-gray-500 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 active:scale-95 dark:bg-zinc-800 dark:text-gray-400 dark:ring-white/10 dark:hover:bg-zinc-700">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
