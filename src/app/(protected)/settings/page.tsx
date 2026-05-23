'use client';

import ChangePassword from '@/components/ChangePassword';
import SendInviteButton from '@/components/SendInviteButton';
import { SettingsSidebar } from '@/components/sidebars/SettingsSidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Brain,
  SlidersHorizontal,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Settings,
  UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const Page = () => {
  const [selectedOption, setSelectedOption] = useState('memory');

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-900">
      {/* Settings Sidebar */}
      <div className="relative">
        <SettingsSidebar
          selectedOption={selectedOption}
          onSelectOption={setSelectedOption}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-8">
          {/* Header Mode Indicator */}
          <div className="mb-6 flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1 bg-white shadow-xs border-black/10 text-gray-700">
              <Settings className="size-3.5" />
              System Configuration
            </Badge>
          </div>

          {/* Content based on selected option */}
          <div className="mt-6">
            {selectedOption === 'memory' && <Memory />}
            {selectedOption === 'instructions' && <Instructions />}
            {selectedOption === 'guardrails' && <Guardrails />}
            {selectedOption === 'password' && <ChangePassword />}
            {selectedOption === 'invite' && <Invite />}
          </div>
        </div>
      </div>
    </div>
  );
};

const Memory = () => {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Brain className="size-6 text-indigo-600" />
        Long Term Memory
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Configure how long you want Alti to remember and learn from your previous
        conversations to build context.
      </p>
      
      <div className="mt-8 rounded-xl border border-black/10 bg-white p-6 shadow-xs dark:bg-gray-800">
        <RadioGroup defaultValue="1-month" className="space-y-4">
          <div className="flex items-center gap-3">
            <RadioGroupItem className="border-gray-400" value="off" id="r1" />
            <Label className="cursor-pointer text-sm font-medium text-gray-800 dark:text-gray-200" htmlFor="r1">
              Off (No history retention)
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem className="border-gray-400" value="1-month" id="r2" />
            <Label className="cursor-pointer text-sm font-medium text-gray-800 dark:text-gray-200" htmlFor="r2">
              1 Month
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem className="border-gray-400" value="3-month" id="r3" />
            <Label className="cursor-pointer text-sm font-medium text-gray-800 dark:text-gray-200" htmlFor="r3">
              3 Months
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem className="border-gray-400" value="6-month" id="r4" />
            <Label className="cursor-pointer text-sm font-medium text-gray-800 dark:text-gray-200" htmlFor="r4">
              6 Months
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem className="border-gray-400" value="12-month" id="r5" />
            <Label className="cursor-pointer text-sm font-medium text-gray-800 dark:text-gray-200" htmlFor="r5">
              12 Months (Recommended)
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

const Instructions = () => {
  const [instructions, setInstructions] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('System instructions saved successfully!', {
        description: 'Changes will apply to all new conversations.',
      });
    }, 800);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <SlidersHorizontal className="size-6 text-indigo-600" />
          Instructions
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Fine-tune the Alti assistant by adding custom system instructions. Guide its personality, tone, language style, and expert perspective.
        </p>
      </div>

      <Card className="border border-black/10 shadow-xs bg-white dark:bg-gray-800">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-instructions" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Custom System Prompt
            </Label>
            <textarea
              id="custom-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. You are a senior product manager and startup consultant. Adopt a supportive, structured tone. Use markdown tables and lists to organize complex data. Keep responses concise."
              className="w-full min-h-[220px] rounded-lg border border-black/10 bg-gray-50/50 p-4 text-sm text-gray-800 placeholder-gray-400 shadow-inner focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 outline-none transition-all resize-y"
            />
          </div>

          {/* Premium Help Alert */}
          <div className="flex gap-3 rounded-lg bg-indigo-50/40 p-4 border border-indigo-100/50 text-xs text-indigo-900/80 dark:bg-indigo-950/20 dark:border-indigo-900/30 dark:text-indigo-200">
            <Sparkles className="size-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5 text-indigo-950 dark:text-indigo-100">Pro Tip for Custom Prompts</span>
              Clearly state the role (e.g. "Act as a legal counsel"), the target audience, response formatting constraints (e.g. "Always include a bulleted summary"), and things to avoid for absolute consistency.
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 bg-indigo-650 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                'Save Instructions'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Guardrails = () => {
  const [prohibitedTopics, setProhibitedTopics] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('System guardrails applied successfully!', {
        description: 'Safety limits have been locked into the core assistant prompt.',
      });
    }, 800);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <ShieldCheck className="size-6 text-indigo-600" />
          Guardrails
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Define boundaries, prohibited content, and safe zones for Alti. Enforce robust controls on output accuracy, domain filtering, and security compliance.
        </p>
      </div>

      <Card className="border border-black/10 shadow-xs bg-white dark:bg-gray-800">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-guardrails" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Prohibited Words, Competitors, or Domains
            </Label>
            <textarea
              id="custom-guardrails"
              value={prohibitedTopics}
              onChange={(e) => setProhibitedTopics(e.target.value)}
              placeholder="e.g. Do not mention specific pricing details. Do not discuss competitor X. Under no circumstances should you reference internal database keys or source code URLs."
              className="w-full min-h-[160px] rounded-lg border border-black/10 bg-gray-50/50 p-4 text-sm text-gray-800 placeholder-gray-400 shadow-inner focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 outline-none transition-all resize-y"
            />
          </div>

          <div className="flex gap-3 rounded-lg bg-rose-50/40 p-4 border border-rose-100/50 text-xs text-rose-900/80 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-200">
            <AlertCircle className="size-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5 text-rose-950 dark:text-rose-100">Operational Security Warning</span>
              Guardrails override user instructions to ensure safety. Enter custom restrictions clearly as direct commands (e.g. "Do not output HTML blocks unless specifically asked").
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 bg-indigo-650 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                'Save Guardrails'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Invite = () => {
  const [email, setEmail] = useState('');

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <UserPlus className="size-6 text-indigo-600" />
          Invite Friends
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Invite your friends or team members to join Alti and collaborate seamlessly on tasks, research, and workflows.
        </p>
      </div>

      <Card className="border border-black/10 shadow-xs bg-white dark:bg-gray-800">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="friend-email" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Email Address
            </Label>
            <div className="relative flex items-center">
              <input
                id="friend-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full h-10 rounded-lg border border-black/10 bg-gray-50/50 px-4 pr-32 text-sm text-gray-800 placeholder-gray-400 shadow-inner focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 outline-none transition-all"
              />
              <div className="absolute right-1">
                <SendInviteButton
                  content={email}
                  className="h-8 px-4 text-xs font-semibold bg-indigo-650 hover:bg-indigo-700 text-white rounded-md shadow-sm transition-all"
                  onClose={() => setEmail('')}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
