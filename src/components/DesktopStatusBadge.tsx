'use client';
import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export function DesktopStatusBadge() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Ping the Aphura backend
        const res = await fetch('/api/v1/desktop/status');
        const data = await res.json();
        setIsConnected(data.connected);
      } catch (err) {
        setIsConnected(false);
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border shadow-sm backdrop-blur-md transition-all duration-300 ${isConnected ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
      {isConnected ? (
        <>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Sovereign Bridge Active</span>
        </>
      ) : (
        <>
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Sovereign Bridge Disconnected</span>
        </>
      )}
    </div>
  );
}
