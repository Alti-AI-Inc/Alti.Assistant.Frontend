'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import { TrendingUp, BarChart2, Activity } from 'lucide-react';

interface TradingViewNativeWidgetProps {
  data: { time: string; value?: number; open?: number; high?: number; low?: number; close?: number }[];
  type: 'line' | 'candlestick' | 'area' | 'histogram' | 'bar';
  ticker: string;
}

export default function TradingViewNativeWidget({ data, type, ticker }: TradingViewNativeWidgetProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#11141c' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      height: 300,
    });

    let series: any;

    switch (type) {
      case 'candlestick':
        series = chart.addCandlestickSeries({
          upColor: '#22c55e',
          downColor: '#ef4444',
          borderVisible: false,
          wickUpColor: '#22c55e',
          wickDownColor: '#ef4444',
        });
        break;
      case 'area':
        series = chart.addAreaSeries({
          lineColor: '#3b82f6',
          topColor: 'rgba(59, 130, 246, 0.4)',
          bottomColor: 'rgba(59, 130, 246, 0.0)',
        });
        break;
      case 'histogram':
        series = chart.addHistogramSeries({
          color: '#8b5cf6',
        });
        break;
      case 'line':
      default:
        series = chart.addLineSeries({
          color: '#3b82f6',
        });
        break;
    }

    series.setData(data);

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, type]);

  return (
    <div className="relative my-4 overflow-hidden rounded-2xl border border-[#2b2f3a] bg-[#11141c] shadow-2xl">
      <div className="flex items-center space-x-3 border-b border-[#2b2f3a] bg-[#171b26] px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-wide text-white">{ticker}</h3>
          <p className="text-xs text-zinc-400 capitalize">{type} Chart (Native)</p>
        </div>
      </div>
      <div className="p-1" ref={chartContainerRef} />
    </div>
  );
}
