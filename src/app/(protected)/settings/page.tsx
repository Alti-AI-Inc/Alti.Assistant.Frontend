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
import { Input } from '@/components/ui/input';
import AudioRecorder from '@/components/AudioRecorder';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  AlertCircle,
  Terminal,
  Shield,
  Search,
  Trash2,
  ArrowUp,
} from 'lucide-react';
import { useState, useEffect } from 'react';
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
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-gray-955">
        {/* Dynamic Settings Top Navbar (Header) */}
        <div className="h-[53px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-955 justify-between">
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">
            {selectedOption === 'memory' && 'Long Term Memory'}
            {selectedOption === 'instructions' && 'System Instructions'}
            {selectedOption === 'guardrails' && 'Safety Guardrails'}
            {selectedOption === 'password' && 'Update Password'}
            {selectedOption === 'invite' && 'Invite Friends'}
          </h1>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
          <div className="max-w-2xl">
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
    <div className="max-w-2xl pt-2">
      <RadioGroup defaultValue="1-month" className="space-y-4">
        <div className="flex items-center gap-3">
          <RadioGroupItem className="border-gray-400" value="off" id="r1" />
          <Label className="cursor-pointer text-sm font-medium text-gray-800 dark:text-gray-200" htmlFor="r1">
            Off
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
            12 Months
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

const Instructions = () => {
  const [instructionsList, setInstructionsList] = useState<{ id: string; text: string; timestamp: string }[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAudioRecording, setIsAudioRecording] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedInst = localStorage.getItem('alti_instructions');
    if (storedInst) {
      setInstructionsList(JSON.parse(storedInst));
    } else {
      const defaults = [
        {
          id: 'inst-1',
          text: 'You are a senior product manager and startup consultant. Adopt a supportive, structured tone.',
          timestamp: '05/26/2026, 12:00 PM'
        },
        {
          id: 'inst-2',
          text: 'Use markdown tables and lists to organize complex data. Keep responses concise.',
          timestamp: '05/26/2026, 12:05 PM'
        },
        {
          id: 'inst-3',
          text: 'Always provide high-quality, technically accurate answers with brief summaries at the top.',
          timestamp: '05/26/2026, 12:10 PM'
        }
      ];
      setInstructionsList(defaults);
      localStorage.setItem('alti_instructions', JSON.stringify(defaults));
    }
  }, []);

  const handleAddInstruction = () => {
    if (!inputVal.trim()) {
      toast.error('Please enter an instruction rule.');
      return;
    }
    
    setIsSaving(true);
    setTimeout(() => {
      const newItem = {
        id: `inst-${Date.now()}`,
        text: inputVal.trim(),
        timestamp: new Date().toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
      
      const updatedList = [newItem, ...instructionsList];
      setInstructionsList(updatedList);
      localStorage.setItem('alti_instructions', JSON.stringify(updatedList));
      setInputVal('');
      setIsSaving(false);
      
      toast.success('System instruction added successfully!', {
        description: 'Applied instantly to all new agent conversations.'
      });
    }, 300);
  };

  const handleDeleteInstruction = (id: string) => {
    const updatedList = instructionsList.filter(item => item.id !== id);
    setInstructionsList(updatedList);
    localStorage.setItem('alti_instructions', JSON.stringify(updatedList));
    
    toast.success('System instruction deleted.', {
      description: 'The instruction has been removed from settings.'
    });
  };

  const filteredInstructions = instructionsList.filter(item =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted) {
    return <div className="text-sm text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Top Add Instruction Prompter (Integrated Chat-Style Input Box) */}
      <div className="flex items-center rounded-2xl border border-black/10 dark:border-white/10 bg-gray-50/50 dark:bg-gray-900/30 px-3.5 py-1.5 shadow-xs transition-all focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
        <input
          placeholder="Enter instruction here..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              handleAddInstruction();
            }
          }}
          disabled={isSaving}
          className="flex-1 min-w-0 bg-transparent border-none py-1.5 text-sm text-gray-800 placeholder-gray-400 dark:text-gray-100 outline-none focus:ring-0 focus-visible:ring-0"
        />
        <div className="flex-none ml-2">
          {inputVal.trim() && !isAudioRecording ? (
            <ArrowUp
              onClick={handleAddInstruction}
              className={cn(
                'size-7 flex-shrink-0 rounded-lg border-2 border-gray-300 bg-black p-1 text-white transition-opacity hover:bg-zinc-800 cursor-pointer dark:bg-white dark:text-black dark:border-gray-700 dark:hover:bg-zinc-200',
                isSaving ? 'cursor-not-allowed opacity-50' : ''
              )}
            />
          ) : (
            <AudioRecorder setMessage={setInputVal} setIsRecording={setIsAudioRecording} />
          )}
        </div>
      </div>

      {/* Dynamic List Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search instructions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-9 text-sm rounded-xl bg-gray-50 border-gray-200 dark:border-gray-800 dark:bg-gray-955 focus-visible:ring-1 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500"
          />
        </div>

        {/* Dynamic Results Grid (Floating Individual Cards) */}
        {filteredInstructions.length === 0 ? (
          <div className="w-full border border-black/10 dark:border-white/10 rounded-2xl bg-white/40 dark:bg-gray-900/10 py-8 px-4 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
            <Search className="h-6 w-6 text-gray-300 dark:text-gray-700" />
            <span>No matching instructions found</span>
          </div>
        ) : (
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {filteredInstructions.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between py-3 px-4 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900/30 rounded-2xl shadow-xs transition-all duration-150 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10"
              >
                <div className="flex items-center gap-3 min-w-0 pr-3 flex-1">
                  <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-955/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <Terminal className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-relaxed" title={item.text}>
                      {item.text}
                    </p>
                    <span className="text-[9px] text-gray-400 font-medium block mt-0.5 uppercase font-mono tracking-wider">
                      Prompt Rule • {item.timestamp}
                    </span>
                  </div>
                </div>

                {/* Active Hover Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteInstruction(item.id)}
                  className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-none ml-2"
                  title="Delete Custom Prompt"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Guardrails = () => {
  const [guardrailsList, setGuardrailsList] = useState<{ id: string; text: string; timestamp: string }[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAudioRecording, setIsAudioRecording] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedGuard = localStorage.getItem('alti_guardrails');
    if (storedGuard) {
      setGuardrailsList(JSON.parse(storedGuard));
    } else {
      const defaults = [
        {
          id: 'guard-1',
          text: 'Do not mention specific pricing details of competitor platforms.',
          timestamp: '05/26/2026, 12:00 PM'
        },
        {
          id: 'guard-2',
          text: 'Under no circumstances should you reference internal database keys or source code URLs.',
          timestamp: '05/26/2026, 12:05 PM'
        },
        {
          id: 'guard-3',
          text: 'Do not output HTML blocks unless specifically asked by the user.',
          timestamp: '05/26/2026, 12:10 PM'
        }
      ];
      setGuardrailsList(defaults);
      localStorage.setItem('alti_guardrails', JSON.stringify(defaults));
    }
  }, []);

  const handleAddGuardrail = () => {
    if (!inputVal.trim()) {
      toast.error('Please enter a safety rule.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const newItem = {
        id: `guard-${Date.now()}`,
        text: inputVal.trim(),
        timestamp: new Date().toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };

      const updatedList = [newItem, ...guardrailsList];
      setGuardrailsList(updatedList);
      localStorage.setItem('alti_guardrails', JSON.stringify(updatedList));
      setInputVal('');
      setIsSaving(false);

      toast.success('Safety guardrail applied successfully!', {
        description: 'Locked into core assistant validation rules.'
      });
    }, 300);
  };

  const handleDeleteGuardrail = (id: string) => {
    const updatedList = guardrailsList.filter(item => item.id !== id);
    setGuardrailsList(updatedList);
    localStorage.setItem('alti_guardrails', JSON.stringify(updatedList));

    toast.success('Safety guardrail deleted.', {
      description: 'The guardrail rule has been removed.'
    });
  };

  const filteredGuardrails = guardrailsList.filter(item =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted) {
    return <div className="text-sm text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Top Add Guardrail Prompter (Integrated Chat-Style Input Box) */}
      <div className="flex items-center rounded-2xl border border-black/10 dark:border-white/10 bg-gray-50/50 dark:bg-gray-900/30 px-3.5 py-1.5 shadow-xs transition-all focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500">
        <input
          placeholder="Enter guardrail here..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              handleAddGuardrail();
            }
          }}
          disabled={isSaving}
          className="flex-1 min-w-0 bg-transparent border-none py-1.5 text-sm text-gray-800 placeholder-gray-400 dark:text-gray-100 outline-none focus:ring-0 focus-visible:ring-0"
        />
        <div className="flex-none ml-2">
          {inputVal.trim() && !isAudioRecording ? (
            <ArrowUp
              onClick={handleAddGuardrail}
              className={cn(
                'size-7 flex-shrink-0 rounded-lg border-2 border-gray-300 bg-black p-1 text-white transition-opacity hover:bg-zinc-800 cursor-pointer dark:bg-white dark:text-black dark:border-gray-700 dark:hover:bg-zinc-200',
                isSaving ? 'cursor-not-allowed opacity-50' : ''
              )}
            />
          ) : (
            <AudioRecorder setMessage={setInputVal} setIsRecording={setIsAudioRecording} />
          )}
        </div>
      </div>

      {/* Dynamic List Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search guardrails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-9 text-sm rounded-xl bg-gray-50 border-gray-200 dark:border-gray-800 dark:bg-gray-955 focus-visible:ring-1 focus-visible:ring-rose-500/30 focus-visible:border-rose-500"
          />
        </div>

        {/* Dynamic Results Grid (Floating Individual Cards) */}
        {filteredGuardrails.length === 0 ? (
          <div className="w-full border border-black/10 dark:border-white/10 rounded-2xl bg-white/40 dark:bg-gray-900/10 py-8 px-4 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
            <Search className="h-6 w-6 text-gray-300 dark:text-gray-700" />
            <span>No matching safety rules found</span>
          </div>
        ) : (
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {filteredGuardrails.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between py-3 px-4 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900/30 rounded-2xl shadow-xs transition-all duration-150 hover:bg-rose-50/20 dark:hover:bg-rose-955/10"
              >
                <div className="flex items-center gap-3 min-w-0 pr-3 flex-1">
                  <div className="h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-955/40 text-rose-650 dark:text-rose-450 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-relaxed" title={item.text}>
                      {item.text}
                    </p>
                    <span className="text-[9px] text-gray-400 font-medium block mt-0.5 uppercase font-mono tracking-wider">
                      Safety Rule • {item.timestamp}
                    </span>
                  </div>
                </div>

                {/* Active Hover Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteGuardrail(item.id)}
                  className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-none ml-2"
                  title="Delete Safety Rule"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Invite = () => {
  const [email, setEmail] = useState('');

  return (
    <div className="max-w-2xl pt-2">
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
            className="h-8 px-4 text-xs font-semibold rounded-md shadow-sm transition-all bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black"
            onClose={() => setEmail('')}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
