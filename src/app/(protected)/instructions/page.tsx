'use client';

import { useState, useEffect } from 'react';
import { User, MessageSquare, Save } from 'lucide-react';
import { toast } from 'sonner';

const STORAGE_KEYS = {
  aboutUser: 'aphura_about_user',
  customInstructions: 'aphura_custom_instructions',
};

export default function InstructionsPage() {
  const [aboutYou, setAboutYou] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAboutYou(localStorage.getItem(STORAGE_KEYS.aboutUser) || '');
      setInstructions(localStorage.getItem(STORAGE_KEYS.customInstructions) || '');
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    localStorage.setItem(STORAGE_KEYS.aboutUser, aboutYou);
    localStorage.setItem(STORAGE_KEYS.customInstructions, instructions);
    await new Promise(r => setTimeout(r, 600));
    setIsSaving(false);
    toast.success('Instructions saved successfully');
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#e1e1e1] dark:bg-zinc-950 overflow-y-auto">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-black/10 px-6 dark:border-white/10">
        <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Instructions
        </h1>
      </header>

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-12 pb-24">
        {/* About You Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">About You</h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Tell Aphura about yourself — role, industry, expertise. This context is included in every conversation.
          </p>
          <textarea
            value={aboutYou}
            onChange={(e) => setAboutYou(e.target.value)}
            placeholder="e.g. I'm a startup founder building fintech products. I prefer practical, actionable answers with code examples in TypeScript."
            className="h-32 w-full resize-none rounded-lg border border-black/10 bg-white dark:bg-zinc-900 p-4 text-sm text-zinc-900 focus:border-[#0000ff] focus:outline-none focus:ring-1 focus:ring-[#0000ff] dark:border-white/10 dark:text-white dark:focus:border-[#0000ff]"
          />
        </section>

        {/* Custom Instructions Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Custom Instructions</h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            How should Aphura respond? These instructions shape every response.
          </p>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Always cite sources. Use bullet points. Keep answers under 300 words unless I ask for detail."
            className="h-32 w-full resize-none rounded-lg border border-black/10 bg-white dark:bg-zinc-900 p-4 text-sm text-zinc-900 focus:border-[#0000ff] focus:outline-none focus:ring-1 focus:ring-[#0000ff] dark:border-white/10 dark:text-white dark:focus:border-[#0000ff]"
          />
        </section>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0000ff] text-sm font-medium text-white transition-all hover:bg-[#0000ff]/90 disabled:opacity-50"
        >
          {isSaving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? 'Saving...' : 'Save Instructions'}
        </button>
      </div>
    </div>
  );
}
