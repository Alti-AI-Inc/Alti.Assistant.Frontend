'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useModalStore } from '@/stores/useModalStore';
import { useBotsStore } from '@/stores/useBotsStore';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const EMOJIS = ['🤖', '🐍', '🎨', '✍️', '⚖️', '📊', '📈', '💡', '🧠', '💬', '🚀', '💻', '🔍', '⚙️', '📅', '🔐'];
const MODELS = ['Gemini 1.5 Pro', 'Gemini 1.5 Flash', 'Claude 3.5 Sonnet', 'GPT-4o'];

export function EditChatbotModal() {
  const { isOpen, onClose, type, actionId } = useModalStore();
  const { bots, editBot } = useBotsStore();

  const bot = bots.find((b) => b.id === actionId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [model, setModel] = useState('Gemini 1.5 Pro');
  const [avatar, setAvatar] = useState('🤖');
  const [error, setError] = useState('');

  // Load bot details
  useEffect(() => {
    if (bot && isOpen && type === 'edit-chatbot') {
      setName(bot.name);
      setDescription(bot.description);
      setInstructions(bot.instructions);
      setModel(bot.model);
      setAvatar(bot.avatar);
      setError('');
    }
  }, [bot, isOpen, type]);

  if (type !== 'edit-chatbot' || !bot) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name for your agent.');
      return;
    }
    if (!instructions.trim()) {
      setError('Please provide system instructions/prompt.');
      return;
    }

    editBot(bot.id, {
      name,
      description: description || 'Custom Agent Assistant',
      instructions,
      model,
      avatar,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] border-none bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2">
              <span className="text-2xl">{avatar}</span> Edit Agent Settings
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              Update instructions, description, model type, or avatar details for this custom assistant.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {error && <p className="text-xs font-semibold text-red-500">{error}</p>}

            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Code Optimizer, Financial Analyst"
                className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-gray-900 dark:border-gray-800"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Description</Label>
              <Input
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this agent do?"
                className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-gray-900 dark:border-gray-800"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-instructions" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">System Instructions / Prompt</Label>
              <Textarea
                id="edit-instructions"
                value={instructions}
                onChange={(e) => {
                  setInstructions(e.target.value);
                  setError('');
                }}
                placeholder="Define your agent's role, rules, tone, and specific knowledge base constraints..."
                className="min-h-[100px] rounded-xl border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-gray-900 dark:border-gray-800 text-xs leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-model" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">AI Model</Label>
                <select
                  id="edit-model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200"
                >
                  {MODELS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Avatar Icon</Label>
                <div className="flex gap-2">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-xl shadow-xs dark:bg-gray-900 dark:border-gray-800">
                    {avatar}
                  </div>
                  <select
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200"
                  >
                    {EMOJIS.map((e) => (
                      <option key={e} value={e}>
                        {e} Icon
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Emoji Grid */}
            <div className="grid gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quick Select Icon</span>
              <div className="flex flex-wrap gap-1.5">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setAvatar(e)}
                    className={cn(
                      "h-7 w-7 rounded-lg text-sm flex items-center justify-center border transition-all hover:scale-105",
                      avatar === e
                        ? "bg-blue-500/10 border-blue-500 text-blue-600 font-bold"
                        : "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-800 text-gray-700"
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-xl px-5 text-xs font-semibold">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 text-xs font-semibold">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
