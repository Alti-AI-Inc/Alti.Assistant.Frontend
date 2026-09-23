'use client';
import React from 'react';
import { Map, Navigation } from 'lucide-react';
import WidgetContainer from './WidgetContainer';

export default function MapboxWidget({ locationData }: { locationData?: any }) {
  const query = locationData?.query || 'Location Data';
  const data = locationData?.data || [];
  const type = locationData?.type || 'geocode';

  return (
    <WidgetContainer 
      icon={Map} 
      iconColorClass="text-cyan-400" 
      iconBgClass="bg-cyan-500/10" 
      title="Geospatial Intelligence" 
      subtitle="Powered by MapBox"
    >
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-zinc-300">Query: <span className="text-white">{query}</span></h4>
        
        {data.length === 0 ? <p className="text-sm text-zinc-500">No results found.</p> : data.map((feature: any, idx: number) => (
          <div key={idx} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]">
            <Navigation className="h-4 w-4 text-cyan-500/70 mt-1 shrink-0" />
            <div>
              <p className="font-medium text-white text-sm">{feature.place_name || feature.text || feature.name || 'Location Result'}</p>
              {feature.center && (
                <p className="font-mono text-xs text-cyan-400/80 mt-1">
                  [{feature.center[1].toFixed(4)}, {feature.center[0].toFixed(4)}]
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </WidgetContainer>
  );
}
