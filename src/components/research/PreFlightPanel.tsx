'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, Check, ShieldAlert } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export interface PreFlightSettings {
  depth: 'fast' | 'thorough';
  consensusLevel: 'majority' | 'unanimous';
  boardPersonas: string[];
}

interface PreFlightPanelProps {
  settings: PreFlightSettings;
  onSettingsChange: (settings: PreFlightSettings) => void;
}

const AVAILABLE_PERSONAS = [
  'McKinsey Strategy Partner',
  'Gartner Research Director',
  'YC Technical Architect',
  'CFO Financial Officer',
  'CMO Marketing Director',
  'HR Director',
  'Security Auditor'
];

export default function PreFlightPanel({ settings, onSettingsChange }: PreFlightPanelProps) {
  const handleDepthChange = (depth: 'fast' | 'thorough') => {
    onSettingsChange({ ...settings, depth });
  };

  const handleConsensusChange = (consensusLevel: 'majority' | 'unanimous') => {
    onSettingsChange({ ...settings, consensusLevel });
  };

  const togglePersona = (persona: string) => {
    const active = settings.boardPersonas;
    let newPersonas = [];
    if (active.includes(persona)) {
      newPersonas = active.filter(p => p !== persona);
    } else {
      newPersonas = [...active, persona];
    }
    
    // Ensure we always have at least 1 persona
    if (newPersonas.length === 0) return;
    
    onSettingsChange({ ...settings, boardPersonas: newPersonas });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-7 flex-shrink-0 rounded-lg border-2 border-gray-300 bg-white p-1 text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
          title="Configure Research Settings"
        >
          <SlidersHorizontal className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 rounded-2xl bg-white p-4 shadow-xl border border-black/10" align="start" side="top" sideOffset={10}>
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 border-b border-black/5 pb-2">
            <SlidersHorizontal className="size-4 text-teal-600" />
            <h4 className="text-sm font-bold text-gray-900">Pre-flight Research Console</h4>
          </div>

          {/* Depth Section */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Research Depth</span>
            <div className="grid grid-cols-2 gap-1 bg-gray-100 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => handleDepthChange('fast')}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                  settings.depth === 'fast'
                    ? 'bg-white text-teal-700 shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Fast (2 levels)
              </button>
              <button
                type="button"
                onClick={() => handleDepthChange('thorough')}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                  settings.depth === 'thorough'
                    ? 'bg-white text-teal-700 shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Thorough (4 levels)
              </button>
            </div>
          </div>

          {/* Consensus Section */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Consensus Strategy</span>
            <div className="grid grid-cols-2 gap-1 bg-gray-100 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => handleConsensusChange('majority')}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                  settings.consensusLevel === 'majority'
                    ? 'bg-white text-teal-700 shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Majority Rule
              </button>
              <button
                type="button"
                onClick={() => handleConsensusChange('unanimous')}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                  settings.consensusLevel === 'unanimous'
                    ? 'bg-white text-teal-700 shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Unanimous Vote
              </button>
            </div>
          </div>

          {/* Active Board Section */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Active Board Debate</span>
            <div className="max-h-[140px] overflow-y-auto border border-black/5 rounded-lg p-1.5 space-y-1 bg-gray-50/50">
              {AVAILABLE_PERSONAS.map(p => {
                const isActive = settings.boardPersonas.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePersona(p)}
                    className="w-full flex items-center justify-between p-1.5 text-left text-xs font-medium rounded-md hover:bg-black/[0.03] transition-colors"
                  >
                    <span className={isActive ? 'text-teal-700 font-bold' : 'text-gray-600'}>{p}</span>
                    {isActive && <Check className="size-3.5 text-teal-600" />}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-100 p-2 rounded-lg">
            <ShieldAlert className="size-4 text-teal-700 flex-shrink-0" />
            <p className="text-[10px] text-teal-800 leading-tight">Settings apply dynamically to the next search loop initiation.</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
