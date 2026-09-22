'use client';

import React, { useState } from 'react';
import TradingViewTickerTape from './tradingview/TradingViewTickerTape';
import TradingViewTechnicalAnalysis from './tradingview/TradingViewTechnicalAnalysis';
import TradingViewMarketOverview from './tradingview/TradingViewMarketOverview';
import TradingViewSymbolInfo from './tradingview/TradingViewSymbolInfo';
import TradingViewHeatmap from './tradingview/TradingViewHeatmap';
import TradingViewNativeWidget from './TradingViewNativeWidget';
import { LayoutDashboard, BarChart2, Activity, Map, Monitor } from 'lucide-react';

interface FinancialWidgetProps {
  ticker?: string;
  liveData?: any;
}

export default function FinancialWidget({ ticker, liveData }: FinancialWidgetProps) {
  const [activeTab, setActiveTab] = useState<'chart' | 'technical' | 'market' | 'heatmap'>('chart');
  
  const getTradingViewSymbol = (sym: string) => {
    const s = sym.toUpperCase();
    if (['BTC', 'ETH', 'SOL', 'DOGE'].includes(s)) return `COINBASE:${s}USD`;
    const techStocks = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'QQQ'];
    if (techStocks.includes(s)) return `NASDAQ:${s}`;
    if (s === 'SPY') return `NYSEARCA:${s}`;
    return s;
  };

  const symbol = ticker ? getTradingViewSymbol(ticker) : 'NASDAQ:AAPL';

  return (
    <div className="relative my-4 overflow-hidden rounded-2xl border border-[#2b2f3a] bg-[#11141c] text-[#d1d4dc] shadow-2xl">
      <TradingViewTickerTape />
      
      <div className="flex border-y border-[#2b2f3a] bg-[#171b26] px-4 py-3 gap-2 overflow-x-auto">
        <button onClick={() => setActiveTab('chart')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'chart' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
          <BarChart2 className="w-4 h-4" /> Native Chart
        </button>
        <button onClick={() => setActiveTab('technical')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'technical' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
          <Activity className="w-4 h-4" /> Technical Analysis
        </button>
        <button onClick={() => setActiveTab('market')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'market' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
          <Monitor className="w-4 h-4" /> Market Overview
        </button>
        <button onClick={() => setActiveTab('heatmap')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'heatmap' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
          <Map className="w-4 h-4" /> S&P 500 Heatmap
        </button>
      </div>

      <div className="p-4 bg-[#11141c] min-h-[400px]">
        {ticker && <div className="mb-4"><TradingViewSymbolInfo symbol={symbol} /></div>}
        
        {activeTab === 'chart' && liveData?.stockData && (
          <TradingViewNativeWidget 
            ticker={ticker!}
            type="candlestick" 
            data={liveData.stockData?.results?.map((r: any) => ({
              time: new Date(r.t).toISOString().split('T')[0],
              open: r.o,
              high: r.h,
              low: r.l,
              close: r.c
            })) || []} 
          />
        )}

        {activeTab === 'chart' && !liveData?.stockData && (
           <p className="text-zinc-500 text-sm p-4 text-center">Native chart requires timeseries stockData array from Massive API.</p>
        )}

        {activeTab === 'technical' && (
          <div className="h-[450px]">
            <TradingViewTechnicalAnalysis symbol={symbol} />
          </div>
        )}

        {activeTab === 'market' && (
          <div className="h-[600px]">
            <TradingViewMarketOverview />
          </div>
        )}

        {activeTab === 'heatmap' && (
          <div className="h-[500px]">
            <TradingViewHeatmap />
          </div>
        )}
      </div>
    </div>
  );
}
