'use client';

import React, { useState } from 'react';
import { Trophy, TrendingUp, DollarSign, Activity, Percent, ArrowUpRight } from 'lucide-react';

interface SportsWidgetProps {
  sportsData?: any;
}

export default function SportsWidget({ sportsData }: SportsWidgetProps) {
  const [activeTab, setActiveTab] = useState<'odds' | 'picks' | 'value'>('odds');

  const data = sportsData || {
    homeTeam: 'Lakers',
    awayTeam: 'Celtics',
    homeMoneyline: '+145',
    awayMoneyline: '-170',
    spread: '3.5',
    totalOverUnder: '224.5',
    expertPick: 'Lakers Spread (+3.5)',
    valueBetRating: '92.4%',
    roiPercentage: '14.5%',
    arbitrageGap: '2.1%'
  };

  return (
    <div className="relative my-4 overflow-hidden rounded-2xl border border-[#2b2f3a] bg-[#11141c] text-[#d1d4dc] shadow-2xl transition-all duration-300 hover:border-primary/40">
      {/* Premium Header */}
      <div className="flex flex-col items-start justify-between border-b border-[#2b2f3a] bg-[#171b26] px-6 py-4 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-[#ff9800] text-white shadow-lg shadow-primary/25">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-lg font-bold tracking-tight text-white">
                {data.awayTeam} vs {data.homeTeam}
              </h4>
              <span className="rounded-full bg-[#ff9800]/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#ff9800]">
                Live Odds
              </span>
            </div>
            <p className="text-xs text-[#868997]">Real-Time Sports Betting Workspace Feed</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-3 flex space-x-1.5 rounded-xl bg-[#11141c] p-1 border border-[#2a2e39] sm:mt-0">
          <button
            onClick={() => setActiveTab('odds')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeTab === 'odds'
                ? 'bg-primary text-white shadow-md'
                : 'text-[#868997] hover:bg-[#171b26] hover:text-white'
            }`}
          >
            Vegas Odds
          </button>
          <button
            onClick={() => setActiveTab('picks')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeTab === 'picks'
                ? 'bg-primary text-white shadow-md'
                : 'text-[#868997] hover:bg-[#171b26] hover:text-white'
            }`}
          >
            Expert Picks
          </button>
          <button
            onClick={() => setActiveTab('value')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeTab === 'value'
                ? 'bg-primary text-white shadow-md'
                : 'text-[#868997] hover:bg-[#171b26] hover:text-white'
            }`}
          >
            Value Analysis
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: ODDS VIEW */}
        {activeTab === 'odds' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Moneyline */}
            <div className="rounded-xl border border-[#2b2f3a] bg-[#171b26] p-5 shadow-inner hover:border-primary/30 transition-all">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#868997]">Moneyline</span>
              <div className="mt-2 space-y-2 text-white">
                <div className="flex justify-between">
                  <span>{data.awayTeam}</span>
                  <strong className="text-primary">{data.awayMoneyline}</strong>
                </div>
                <div className="flex justify-between">
                  <span>{data.homeTeam}</span>
                  <strong className="text-primary">{data.homeMoneyline}</strong>
                </div>
              </div>
            </div>

            {/* Spread */}
            <div className="rounded-xl border border-[#2b2f3a] bg-[#171b26] p-5 shadow-inner hover:border-primary/30 transition-all">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#868997]">Point Spread</span>
              <div className="mt-2 space-y-2 text-white">
                <div className="flex justify-between">
                  <span>{data.awayTeam}</span>
                  <strong>-{data.spread}</strong>
                </div>
                <div className="flex justify-between">
                  <span>{data.homeTeam}</span>
                  <strong>+{data.spread}</strong>
                </div>
              </div>
            </div>

            {/* Over/Under */}
            <div className="rounded-xl border border-[#2b2f3a] bg-[#171b26] p-5 shadow-inner hover:border-primary/30 transition-all">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#868997]">Game Total</span>
              <div className="mt-2 space-y-2 text-white">
                <div className="flex justify-between">
                  <span>Over {data.totalOverUnder}</span>
                  <strong>-110</strong>
                </div>
                <div className="flex justify-between">
                  <span>Under {data.totalOverUnder}</span>
                  <strong>-110</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PICKS VIEW */}
        {activeTab === 'picks' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#2b2f3a] bg-[#171b26] p-5 shadow-inner">
              <div className="flex items-center space-x-2 text-white">
                <Activity className="h-4 w-4 text-[#ff9800]" />
                <span className="text-sm font-bold uppercase tracking-wider">Expert Consensus Select</span>
              </div>
              <p className="mt-2 text-lg font-black text-white">
                {data.expertPick}
              </p>
              <p className="mt-2 text-xs text-[#868997]">
                Analyzed from over 45 consolidated public sport experts and predictive mathematical algorithms.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: VALUE ANALYSIS */}
        {activeTab === 'value' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Value Rating */}
            <div className="rounded-xl border border-[#2b2f3a] bg-[#171b26] p-5 shadow-inner">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#868997]">Value Rating</span>
                <Percent className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-black text-white">{data.valueBetRating}</div>
            </div>

            {/* ROI */}
            <div className="rounded-xl border border-[#2b2f3a] bg-[#171b26] p-5 shadow-inner">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#868997]">Expected ROI</span>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">{data.roiPercentage}</div>
            </div>

            {/* Arbitrage Gap */}
            <div className="rounded-xl border border-[#2b2f3a] bg-[#171b26] p-5 shadow-inner">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#868997]">Arbitrage Gap</span>
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-black text-white">{data.arbitrageGap}</div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-4 rounded-xl border border-[#2b2f3a] bg-[#171b26]/50 p-4">
          <p className="text-[11px] leading-relaxed text-[#868997]">
            Real-time betting odds,expert parlay calculations, and expert quant data are integrated securely via 
            our prediction server <strong>PredictionData.io</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
