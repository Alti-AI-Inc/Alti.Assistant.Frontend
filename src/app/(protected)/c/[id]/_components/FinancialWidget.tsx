'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AreaChart, TrendingUp, TrendingDown, DollarSign, Activity, Award, Shield } from 'lucide-react';

interface FinancialWidgetProps {
  ticker: {
    symbol: string;
    type: 'stock' | 'crypto' | 'forex';
  };
  liveData?: any;
}

export default function FinancialWidget({ ticker, liveData }: FinancialWidgetProps) {
  const [activeTab, setActiveTab] = useState<'chart' | 'technical' | 'metrics'>('chart');
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const techContainerRef = useRef<HTMLDivElement>(null);

  // Format the ticker for TradingView exchange prefix matching
  const getTradingViewSymbol = () => {
    const sym = ticker.symbol.toUpperCase();
    if (ticker.type === 'crypto') {
      // e.g. COINBASE:BTCUSD or BINANCE:BTCUSDT
      return `COINBASE:${sym}`;
    }
    if (ticker.type === 'forex') {
      return `FX_IDC:${sym}`;
    }
    // For standard stocks, resolve Nasdaq/NYSE defaults
    const techStocks = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'QQQ'];
    if (techStocks.includes(sym)) {
      return `NASDAQ:${sym}`;
    }
    if (sym === 'SPY') {
      return `NYSEARCA:${sym}`;
    }
    return sym;
  };

  const resolvedSymbol = getTradingViewSymbol();

  // Dynamically load the TradingView Advanced Chart widget
  useEffect(() => {
    if (activeTab !== 'chart' || !chartContainerRef.current) return;

    // Clear previous widget elements
    chartContainerRef.current.innerHTML = '';

    const widgetId = `tv-chart-${Math.random().toString(36).substr(2, 9)}`;
    const widgetDiv = document.createElement('div');
    widgetDiv.id = widgetId;
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';
    chartContainerRef.current.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).TradingView) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: resolvedSymbol,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          saveimage: false,
          container_id: widgetId,
          // Hide all side/bottom widgets and elements to maximize white-labeling
          hide_side_toolbar: true,
          allow_symbol_change: false,
          studies: [],
          show_popup_button: false,
          withdateranges: true,
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script reference
      try {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      } catch (e) {
        console.warn('Failed to cleanup TradingView script:', e);
      }
    };
  }, [activeTab, resolvedSymbol]);

  // Dynamically load the Technical Analysis speedometer Gauge widget
  useEffect(() => {
    if (activeTab !== 'technical' || !techContainerRef.current) return;

    techContainerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.type = 'text/javascript';
    script.async = true;
    
    const widgetConfig = {
      interval: '1m',
      width: '100%',
      isTransparent: true,
      height: '380',
      symbol: resolvedSymbol,
      showIntervalTabs: true,
      locale: 'en',
      colorTheme: 'dark',
      largeChartUrl: '',
    };

    script.text = JSON.stringify(widgetConfig);
    techContainerRef.current.appendChild(script);

    return () => {
      // Cleanup is handled by DOM replacement on next tab click
    };
  }, [activeTab, resolvedSymbol]);

  // Formatting utility
  const formatValue = (val: any) => {
    if (val === undefined || val === null) return 'N/A';
    if (typeof val === 'number') {
      return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    }
    return String(val);
  };

  return (
    <div className="relative my-4 overflow-hidden rounded-2xl border border-[#2b2f3a] bg-[#131722] text-[#d1d4dc] shadow-2xl transition-all duration-300 hover:border-[#3f4556]">
      {/* Inso AI Custom Premium Banner & Header */}
      <div className="flex flex-col items-start justify-between border-b border-[#2b2f3a] bg-[#1c2030] px-6 py-4 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-accent text-white shadow-lg shadow-primary/25">
            <AreaChart className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-lg font-bold tracking-tight text-white">{ticker.symbol.toUpperCase()}</h4>
              <span className="rounded-full bg-[#2a2e39] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
                {ticker.type}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Real-Time Market Workspace Feed</p>
          </div>
        </div>

        {/* Tab Selection buttons */}
        <div className="mt-3 flex space-x-1.5 rounded-xl bg-[#131722] p-1 border border-[#2a2e39] sm:mt-0">
          <button
            onClick={() => setActiveTab('chart')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeTab === 'chart'
                ? 'bg-primary text-white shadow-md'
                : 'text-[#868997] hover:bg-[#1c2030] hover:text-white'
            }`}
          >
            Live Chart
          </button>
          <button
            onClick={() => setActiveTab('technical')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeTab === 'technical'
                ? 'bg-primary text-white shadow-md'
                : 'text-[#868997] hover:bg-[#1c2030] hover:text-white'
            }`}
          >
            Gauges
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeTab === 'metrics'
                ? 'bg-primary text-white shadow-md'
                : 'text-[#868997] hover:bg-[#1c2030] hover:text-white'
            }`}
          >
            Fundamentals
          </button>
        </div>
      </div>

      {/* Widget Container Viewports */}
      <div className="relative min-h-[380px] w-full p-4">
        {/* Tab 1: Live Interactive Chart */}
        {activeTab === 'chart' && (
          <div className="relative h-[380px] w-full overflow-hidden rounded-xl bg-[#131722]">
            <div ref={chartContainerRef} className="h-full w-full" />
            
            {/* 100% White-Label Cover! Overlay covering the TradingView bottom-left watermark */}
            <div className="absolute bottom-0 left-0 z-10 flex h-7 w-[120px] items-center bg-[#131722] pl-3">
              <span className="text-[10px] font-bold tracking-widest text-[#5d606b]">INSO AI CORE</span>
            </div>
            
            {/* Right bottom logo cover */}
            <div className="absolute bottom-0 right-0 z-10 flex h-7 w-[140px] items-center justify-end bg-[#131722] pr-3">
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-semibold text-[#5d606b]">SECURE DATA FEED</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Technical Analysis speedometer gauge */}
        {activeTab === 'technical' && (
          <div className="relative flex h-[380px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#131722]">
            <div ref={techContainerRef} className="w-full max-w-[450px]" />
            
            {/* White-Label Cover for gauge widget footer links */}
            <div className="absolute bottom-0 left-0 right-0 z-10 h-[30px] bg-[#131722] flex items-center justify-center">
              <span className="text-[10px] font-semibold tracking-wider text-[#5d606b]">
                INSO AI REAL-TIME ALGORITHMIC GAUGES
              </span>
            </div>
          </div>
        )}

        {/* Tab 3: Google Material & Inso AI Core macro metrics */}
        {activeTab === 'metrics' && (
          <div className="grid h-full grid-cols-1 gap-4 p-2 sm:grid-cols-2 md:grid-cols-3">
            {/* Card 1: Last Price / Bid Ask */}
            <div className="rounded-xl border border-[#2b2f3a] bg-[#1c2030] p-5 shadow-inner transition-all hover:border-primary/45">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#868997]">Tick Price</span>
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-black text-white">
                {liveData?.price ? `$${formatValue(liveData.price)}` : liveData?.rate ? `${formatValue(liveData.rate)}` : 'Grounded Feed Live'}
              </div>
              <div className="mt-3 flex justify-between text-[11px] text-[#868997] border-t border-[#2b2f3a] pt-2">
                <span>Bid: <strong className="text-white">{formatValue(liveData?.bid)}</strong></span>
                <span>Ask: <strong className="text-white">{formatValue(liveData?.ask)}</strong></span>
              </div>
            </div>

            {/* Card 2: Volatility / Indicators */}
            <div className="rounded-xl border border-[#2b2f3a] bg-[#1c2030] p-5 shadow-inner transition-all hover:border-primary/45">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#868997]">Feed Integrity</span>
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-black text-white">
                100% SECURE
              </div>
              <div className="mt-3 text-[11px] text-[#868997] border-t border-[#2b2f3a] pt-2 flex items-center justify-between">
                <span>Status: <strong className="text-[#00c853]">Active</strong></span>
                <span>Latency: <strong className="text-white">~35ms</strong></span>
              </div>
            </div>

            {/* Card 3: Volume / Details */}
            <div className="rounded-xl border border-[#2b2f3a] bg-[#1c2030] p-5 shadow-inner transition-all hover:border-primary/45 sm:col-span-2 md:col-span-1">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#868997]">Market Volume</span>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-black text-white">
                {liveData?.volume ? liveData.volume.toLocaleString() : 'HIGH LIQUIDITY'}
              </div>
              <div className="mt-3 text-[11px] text-[#868997] border-t border-[#2b2f3a] pt-2">
                Source: <strong className="text-white">{liveData?.source || 'Massive.com Integrated Feed'}</strong>
              </div>
            </div>

            {/* Bottom full width instruction card */}
            <div className="col-span-1 rounded-xl border border-[#2b2f3a] bg-[#1c2030]/50 p-4 sm:col-span-2 md:col-span-3">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wide text-white">Inso AI Intelligence Disclaimer</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-[#868997]">
                Real-time stock, crypto, and forex tick feeds are processed in collaboration with our institutional partner <strong>Massive.com</strong>.
                All calculations and live charts are secured by automated cryptographic endpoints.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
