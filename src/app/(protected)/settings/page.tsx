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
import {
  Sparkles,
  AlertCircle,
  Terminal,
  Shield,
  Search,
  Trash2,
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
          placeholder="Enter new custom instruction prompt here..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddInstruction();
            }
          }}
          disabled={isSaving}
          className="flex-1 min-w-0 bg-transparent border-none py-1.5 text-sm text-gray-800 placeholder-gray-400 dark:text-gray-100 outline-none focus:ring-0 focus-visible:ring-0"
        />
        <Button
          onClick={handleAddInstruction}
          disabled={isSaving || !inputVal.trim()}
          className="h-8 w-8 flex-none bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg p-0 flex items-center justify-center transition-all duration-200 shadow-sm ml-2"
          title="Add Custom Prompt"
        >
          {isSaving ? (
            <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Dynamic List Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search system instructions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-9 text-sm rounded-xl bg-gray-50 border-gray-200 dark:border-gray-800 dark:bg-gray-955 focus-visible:ring-1 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500"
          />
        </div>

        {/* Dynamic Results Grid */}
        <div className="w-full bg-white/40 dark:bg-gray-900/10 border border-black/10 dark:border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden p-2 text-left">
          {filteredInstructions.length === 0 ? (
            <div className="py-8 px-4 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
              <Search className="h-6 w-6 text-gray-300 dark:text-gray-700" />
              <span>No matching instructions found</span>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800/60 max-h-[350px] overflow-y-auto pr-1">
              {filteredInstructions.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-start justify-between py-3.5 px-3 hover:bg-indigo-50/40 dark:hover:bg-indigo-955/10 rounded-xl transition-all duration-150"
                >
                  <div className="flex items-start gap-3 min-w-0 pr-3">
                    <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Terminal className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
                        {item.text}
                      </p>
                      <span className="text-[10px] text-gray-400 font-medium block mt-1.5 uppercase font-mono tracking-wider">
                        Prompt Rule • {item.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Active Hover Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteInstruction(item.id)}
                    className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-none self-center"
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
    </div>
  );
};

const Guardrails = () => {
  const [guardrailsList, setGuardrailsList] = useState<{ id: string; text: string; timestamp: string }[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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
          placeholder="Enter new safety guardrail rule here..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddGuardrail();
            }
          }}
          disabled={isSaving}
          className="flex-1 min-w-0 bg-transparent border-none py-1.5 text-sm text-gray-800 placeholder-gray-400 dark:text-gray-100 outline-none focus:ring-0 focus-visible:ring-0"
        />
        <Button
          onClick={handleAddGuardrail}
          disabled={isSaving || !inputVal.trim()}
          className="h-8 w-8 flex-none bg-rose-600 hover:bg-rose-700 text-white rounded-lg p-0 flex items-center justify-center transition-all duration-200 shadow-sm ml-2"
          title="Add Safety Rule"
        >
          {isSaving ? (
            <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Shield className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Dynamic List Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search guardrail rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-9 text-sm rounded-xl bg-gray-50 border-gray-200 dark:border-gray-800 dark:bg-gray-955 focus-visible:ring-1 focus-visible:ring-rose-500/30 focus-visible:border-rose-500"
          />
        </div>

        {/* Dynamic Results Grid */}
        <div className="w-full bg-white/40 dark:bg-gray-900/10 border border-black/10 dark:border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden p-2 text-left">
          {filteredGuardrails.length === 0 ? (
            <div className="py-8 px-4 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
              <Search className="h-6 w-6 text-gray-300 dark:text-gray-700" />
              <span>No matching safety rules found</span>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800/60 max-h-[350px] overflow-y-auto pr-1">
              {filteredGuardrails.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-start justify-between py-3.5 px-3 hover:bg-rose-50/40 dark:hover:bg-rose-955/10 rounded-xl transition-all duration-150"
                >
                  <div className="flex items-start gap-3 min-w-0 pr-3">
                    <div className="h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-955/40 text-rose-650 dark:text-rose-450 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
                        {item.text}
                      </p>
                      <span className="text-[10px] text-gray-400 font-medium block mt-1.5 uppercase font-mono tracking-wider">
                        Safety Rule • {item.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Active Hover Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteGuardrail(item.id)}
                    className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-none self-center"
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
