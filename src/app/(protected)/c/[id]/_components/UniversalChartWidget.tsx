'use client';

import React, { useState, useMemo, useRef } from 'react';
import { AreaChart as ChartIcon, BarChart2, TrendingUp, HelpCircle } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
}

interface UniversalChartWidgetProps {
  chartData: {
    title: string;
    type?: 'area' | 'bar' | 'line' | 'pie';
    series: DataPoint[];
    yLabel?: string;
  };
}

export default function UniversalChartWidget({ chartData }: UniversalChartWidgetProps) {
  const { title, type: initialType = 'area', series, yLabel = 'Value' } = chartData;
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line' | 'pie'>(initialType);
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Constants for SVG drawing
  const width = 600;
  const height = 240;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max value calculation for scaling
  const maxVal = useMemo(() => {
    const max = Math.max(...series.map((s) => s.value), 1);
    // Round to a nice clean number
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    const rounded = Math.ceil(max / (magnitude / 2)) * (magnitude / 2);
    return rounded;
  }, [series]);

  // Points computation for drawing SVG paths
  const points = useMemo(() => {
    if (series.length === 0) return [];
    return series.map((s, idx) => {
      const x = paddingLeft + (idx / (series.length - 1 || 1)) * chartWidth;
      const y = paddingTop + chartHeight - (s.value / maxVal) * chartHeight;
      return { x, y, label: s.label, value: s.value };
    });
  }, [series, maxVal, chartWidth, chartHeight]);

  // SVG Paths
  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    return `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${
      paddingTop + chartHeight
    } Z`;
  }, [points, linePath, chartHeight]);

  // Pie chart calculation
  const pieSlices = useMemo(() => {
    const total = series.reduce((sum, s) => sum + s.value, 0) || 1;
    let accumulatedAngle = 0;
    const colors = [
      '#6366f1', // indigo-500
      '#06b6d4', // cyan-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
      '#ef4444', // red-500
      '#8b5cf6', // violet-500
      '#ec4899', // pink-500
    ];

    return series.map((s, idx) => {
      const percentage = s.value / total;
      const angle = percentage * 360;
      const startAngle = accumulatedAngle;
      accumulatedAngle += angle;

      // Calculate path arc coordinates (center at 300, 110, radius 80)
      const cx = 300;
      const cy = 110;
      const r = 85;

      const x1 = cx + r * Math.cos((startAngle - 90) * (Math.PI / 180));
      const y1 = cy + r * Math.sin((startAngle - 90) * (Math.PI / 180));
      const x2 = cx + r * Math.cos((accumulatedAngle - 90) * (Math.PI / 180));
      const y2 = cy + r * Math.sin((accumulatedAngle - 90) * (Math.PI / 180));

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = `
        M ${cx} ${cy}
        L ${x1} ${y1}
        A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;

      return {
        pathData,
        label: s.label,
        value: s.value,
        percentage: (percentage * 100).toFixed(1),
        color: colors[idx % colors.length],
      };
    });
  }, [series]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm my-4 flex flex-col relative group">
      {/* Header controls */}
      <div className="flex flex-col gap-2 border-b border-zinc-150 dark:border-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
            <ChartIcon className="h-4 w-4 text-indigo-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{title}</h4>
            <p className="text-[10px] text-zinc-400">Universal Analytical Vector Feeds</p>
          </div>
        </div>

        {/* Dynamic selector toggle */}
        <div className="flex space-x-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 p-0.5 border border-zinc-200/20 max-w-fit">
          {(['area', 'bar', 'line', 'pie'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setChartType(mode);
                setHoveredPoint(null);
              }}
              className={`rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 ${
                chartType === mode
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Board */}
      <div className="relative w-full p-4 flex items-center justify-center min-h-[260px]" ref={containerRef}>
        {chartType !== 'pie' ? (
          <svg className="w-full h-full max-h-[250px]" viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Y-Axis Grid lines & Labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
              const y = paddingTop + chartHeight - p * chartHeight;
              const val = Math.round(p * maxVal);
              return (
                <g key={idx} className="opacity-40">
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="dark:stroke-zinc-800"
                  />
                  <text
                    x={paddingLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[9px] font-semibold fill-zinc-400"
                  >
                    {val.toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* X-Axis labels */}
            {points.map((p, idx) => {
              // Show every second label if there are too many labels
              const shouldShowLabel = series.length <= 8 || idx % 2 === 0;
              if (!shouldShowLabel) return null;
              return (
                <text
                  key={idx}
                  x={p.x}
                  y={height - 15}
                  textAnchor="middle"
                  className="text-[9px] font-semibold fill-zinc-400 opacity-80"
                >
                  {p.label}
                </text>
              );
            })}

            {/* Area Chart Fill */}
            {chartType === 'area' && (
              <path d={areaPath} fill="url(#areaGrad)" className="transition-all duration-300" />
            )}

            {/* Line / Area stroke */}
            {(chartType === 'area' || chartType === 'line') && (
              <path
                d={linePath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
            )}

            {/* Bar Chart rendering */}
            {chartType === 'bar' &&
              points.map((p, idx) => {
                const barWidth = Math.max(chartWidth / series.length * 0.6, 6);
                const barHeight = paddingTop + chartHeight - p.y;
                return (
                  <rect
                    key={idx}
                    x={p.x - barWidth / 2}
                    y={p.y}
                    width={barWidth}
                    height={barHeight}
                    fill="#6366f1"
                    rx="2"
                    className="transition-all duration-300 hover:fill-indigo-400 cursor-pointer"
                    onMouseEnter={(e) => {
                      setHoveredPoint({ index: idx, x: p.x, y: p.y });
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}

            {/* Dots trigger triggers on hover */}
            {(chartType === 'area' || chartType === 'line') &&
              points.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint?.index === idx ? '6' : '3.5'}
                  fill={hoveredPoint?.index === idx ? '#6366f1' : '#ffffff'}
                  stroke="#6366f1"
                  strokeWidth="2"
                  className="transition-all duration-150 cursor-pointer dark:fill-zinc-900"
                  onMouseEnter={() => setHoveredPoint({ index: idx, x: p.x, y: p.y })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
          </svg>
        ) : (
          /* Pie chart rendering with side legends */
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full min-h-[180px]">
            <svg className="w-[200px] h-[200px]" viewBox="200 10 200 200" xmlns="http://www.w3.org/2000/svg">
              {pieSlices.map((slice, idx) => (
                <path
                  key={idx}
                  d={slice.pathData}
                  fill={slice.color}
                  className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                  onMouseEnter={(e) => {
                    setHoveredPoint({ index: idx, x: 300, y: 110 });
                  }}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
              <circle cx="300" cy="110" r="45" fill="#ffffff" className="dark:fill-zinc-900" />
            </svg>

            {/* Pie legends */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 max-w-[300px]">
              {pieSlices.map((slice, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: slice.color }} />
                  <span className="text-[11px] font-semibold text-zinc-650 dark:text-zinc-300 truncate max-w-[100px]">
                    {slice.label}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400">{slice.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hover Tooltip card box */}
        {hoveredPoint && hoveredPoint.index !== null && (
          <div
            className="absolute z-20 pointer-events-none rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-3 shadow-lg backdrop-blur-xs flex flex-col space-y-0.5"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${Math.max((hoveredPoint.y / height) * 100 - 30, 10)}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              {chartType === 'pie' ? pieSlices[hoveredPoint.index].label : series[hoveredPoint.index].label}
            </span>
            <span className="text-xs font-black text-zinc-900 dark:text-white">
              {yLabel}:{' '}
              {chartType === 'pie'
                ? pieSlices[hoveredPoint.index].value.toLocaleString()
                : series[hoveredPoint.index].value.toLocaleString()}
              {chartType === 'pie' && ` (${pieSlices[hoveredPoint.index].percentage}%)`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
