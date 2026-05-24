'use client';

import React, { useState } from 'react';
import { Home, DollarSign, BarChart2, Shield, Calendar } from 'lucide-react';

interface RealEstateWidgetProps {
  realEstateData?: any;
}

export default function RealEstateWidget({ realEstateData }: RealEstateWidgetProps) {
  const [activeTab, setActiveTab] = useState<'valuation' | 'comps' | 'market'>('valuation');

  const data = realEstateData || {
    address: '123 Main St, Miami FL',
    valuation: '$1,245,000',
    lowRange: '$1,180,000',
    highRange: '$1,310,000',
    marketIndex: '+4.8% YoY',
    conformingLimit: '$766,550',
    comps: [
      { address: '145 Main St', price: '$1,290,000', date: '04/2026', size: '2,400 sqft' },
      { address: '112 Pine Rd', price: '$1,220,000', date: '03/2026', size: '2,150 sqft' },
      { address: '98 Oak Ave', price: '$1,190,000', date: '01/2026', size: '2,000 sqft' }
    ]
  };

  return (
    <div className="relative my-4 overflow-hidden rounded-2xl border border-[#2b2f3a] bg-[#11141c] text-[#d1d4dc] shadow-2xl transition-all duration-300 hover:border-primary/40">
      {/* Premium Header */}
      <div className="flex flex-col items-start justify-between border-b border-[#2b2f3a] bg-[#171b26] px-6 py-4 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-[#4caf50] text-white shadow-lg shadow-primary/25">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-lg font-bold tracking-tight text-white">
                {data.address}
              </h4>
              <span className="rounded-full bg-[#4caf50]/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#4caf50]">
                Property Workspace
              </span>
            </div>
            <p className="text-xs text-[#868997]">Real-Time Real Estate Valuation & Comps</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-3 flex space-x-1.5 rounded-xl bg-[#11141c] p-1 border border-[#2a2e39] sm:mt-0">
          <button
            onClick={() => setActiveTab('valuation')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeTab === 'valuation'
                ? 'bg-primary text-white shadow-md'
                : 'text-[#868997] hover:bg-[#171b26] hover:text-white'
            }`}
          >
            Valuation
          </button>
          <button
            onClick={() => setActiveTab('comps')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeTab === 'comps'
                ? 'bg-primary text-white shadow-md'
                : 'text-[#868997] hover:bg-[#171b26] hover:text-white'
            }`}
          >
            Recent Comps
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeTab === 'market'
                ? 'bg-primary text-white shadow-md'
                : 'text-[#868997] hover:bg-[#171b26] hover:text-white'
            }`}
          >
            Market Trends
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: VALUATION */}
        {activeTab === 'valuation' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#2b2f3a] bg-[#171b26] p-5 shadow-inner">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#868997]">Automated Valuation Model (AVM)</span>
              <div className="mt-2 text-3xl font-black text-white">{data.valuation}</div>
              <p className="mt-2 text-[11px] text-[#868997]">
                Grounded range: <strong className="text-white">{data.lowRange}</strong> to <strong className="text-white">{data.highRange}</strong>
              </p>
            </div>

            <div className="rounded-xl border border-[#2b2f3a] bg-[#171b26] p-5 shadow-inner flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#868997]">Conforming Loan Limit</span>
                <div className="mt-2 text-2xl font-bold text-white">{data.conformingLimit}</div>
              </div>
              <p className="mt-2 text-[11px] text-[#868997]">
                Fannie Mae / Freddie Mac Single-Family Limit for county.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: COMPS */}
        {activeTab === 'comps' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2b2f3a] text-[#868997] uppercase font-bold tracking-wider">
                  <th className="py-2.5">Address</th>
                  <th className="py-2.5">Sale Price</th>
                  <th className="py-2.5">Sale Date</th>
                  <th className="py-2.5">Building Size</th>
                </tr>
              </thead>
              <tbody>
                {data.comps.map((comp: any, idx: number) => (
                  <tr key={idx} className="border-b border-[#2b2f3a]/50 text-white font-medium hover:bg-[#171b26]/50">
                    <td className="py-3 flex items-center space-x-1">
                      <Home className="h-3 w-3 text-primary" />
                      <span>{comp.address}</span>
                    </td>
                    <td className="py-3 font-bold text-primary">{comp.price}</td>
                    <td className="py-3 text-[#868997]">{comp.date}</td>
                    <td className="py-3 text-[#868997]">{comp.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: MARKET */}
        {activeTab === 'market' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#2b2f3a] bg-[#171b26] p-5 shadow-inner">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#868997]">ZIP Code HPI Trajectory</span>
              <div className="mt-2 text-3xl font-black text-white">{data.marketIndex}</div>
              <p className="mt-2 text-[11px] text-[#868997]">
                Calculated from FHFA Home Price Index appreciation.
              </p>
            </div>

            <div className="rounded-xl border border-[#2b2f3a] bg-[#171b26] p-5 shadow-inner flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#868997]">Market Demographics</span>
                <div className="mt-2 text-2xl font-bold text-white">Strong Inward Migration</div>
              </div>
              <p className="mt-2 text-[11px] text-[#868997]">
                Household income growth of +3.2% YoY.
              </p>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-4 rounded-xl border border-[#2b2f3a] bg-[#171b26]/50 p-4">
          <p className="text-[11px] leading-relaxed text-[#868997]">
            Valuation composites and real estate aggregates are integrated securely via 
            our real estate registry provider <strong>RealEstateAPI.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
