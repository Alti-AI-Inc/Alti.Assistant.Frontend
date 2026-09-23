'use client';

import { useState, useEffect, Suspense } from 'react';
import { Brain, Check, User, Save, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { toast } from 'sonner';

const MemoryContent = () => {
  const [selected, setSelected] = useState('1-month');
  const [isMounted, setIsMounted] = useState(false);
  const [customInstructions, setCustomInstructions] = useState('');
  const [aboutUser, setAboutUser] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = storage.getString(STORAGE_KEYS.MEMORY_RETENTION);
    if (stored) setSelected(stored);

    // Load custom instructions from localStorage
    const savedInstructions = localStorage.getItem('aphura_custom_instructions');
    const savedAbout = localStorage.getItem('aphura_about_user');
    if (savedInstructions) setCustomInstructions(savedInstructions);
    if (savedAbout) setAboutUser(savedAbout);
  }, []);

  const handleSelect = (val: string) => {
    setSelected(val);
    storage.set(STORAGE_KEYS.MEMORY_RETENTION, val);
  };

  const handleSaveInstructions = () => {
    setSaving(true);
    localStorage.setItem('aphura_custom_instructions', customInstructions);
    localStorage.setItem('aphura_about_user', aboutUser);
    setTimeout(() => {
      setSaving(false);
      toast.success('Custom instructions saved');
    }, 300);
  };

  const handleClearAll = () => {
    setCustomInstructions('');
    setAboutUser('');
    localStorage.removeItem('aphura_custom_instructions');
    localStorage.removeItem('aphura_about_user');
    toast.success('Custom instructions cleared');
  };

  const options = [
    { value: 'off', label: 'Off', desc: 'No conversation history will be retained.' },
    { value: '1-month', label: '1 Month', desc: 'Prune conversations older than 30 days.' },
    { value: '3-month', label: '3 Months', desc: 'Prune conversations older than 90 days.' },
    { value: '6-month', label: '6 Months', desc: 'Prune conversations older than 180 days.' },
    { value: '12-month', label: '12 Months', desc: 'Prune conversations older than 365 days.' },
  ];

  if (!isMounted) {
    return <div className="text-sm text-gray-555 p-8">Loading platform memory settings...</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#e1e1e1] dark:bg-gray-955">
      {/* Top Navbar / Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-955 justify-between">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Platform Memory & Custom Instructions
        </h1>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6 flex justify-center">
        <div className="w-full max-w-2xl space-y-8">

          {/* ─── Custom Instructions ──────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="size-4 text-[#0000ff]" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Custom Instructions</h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Tell Aphura about yourself and how you&apos;d like it to respond. These instructions apply to every conversation.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                  What would you like Aphura to know about you?
                </label>
                <textarea
                  value={aboutUser}
                  onChange={e => setAboutUser(e.target.value)}
                  placeholder="e.g., I'm a software engineer working on enterprise SaaS. I prefer concise, technical answers."
                  className="w-full h-24 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#0000ff]/30"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                  How would you like Aphura to respond?
                </label>
                <textarea
                  value={customInstructions}
                  onChange={e => setCustomInstructions(e.target.value)}
                  placeholder="e.g., Always respond in bullet points. Use code examples when relevant. Be direct and skip pleasantries."
                  className="w-full h-24 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#0000ff]/30"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveInstructions}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0000ff] text-white text-xs font-medium hover:bg-[#0000dd] transition-colors disabled:opacity-60"
              >
                <Save className="size-3" />
                {saving ? 'Saving...' : 'Save Instructions'}
              </button>
              {(customInstructions || aboutUser) && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Trash2 className="size-3" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* ─── Divider ─────────────────────────────────────────── */}
          <div className="border-t border-black/5 dark:border-white/5" />

          {/* ─── Retention Settings ───────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="size-4 text-[#0000ff]" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Memory Retention</h2>
            </div>

            <div className="space-y-3">
              {options.map((opt) => {
                const isSelected = selected === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      'w-full flex items-center justify-between p-4 border rounded-2xl text-left transition-all duration-150 cursor-pointer shadow-xs',
                      isSelected
                        ? 'bg-white border-black dark:bg-zinc-900 dark:border-white'
                        : 'bg-white/80 border-black/10 hover:bg-white dark:bg-zinc-900/60 dark:border-white/5 dark:hover:bg-zinc-900'
                    )}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-gray-900 dark:text-white block">
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-gray-450 dark:text-gray-400 block">
                        {opt.desc}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PlatformMemoryPage() {
  return (
    <Suspense fallback={<div className="flex-1 h-full flex items-center justify-center text-sm text-gray-555">Loading platform memory settings...</div>}>
      <MemoryContent />
    </Suspense>
  );
}
