'use client';
import React, { useEffect, useRef } from 'react';

export default function TradingViewSymbolInfo({ symbol = 'NASDAQ:AAPL' }: { symbol?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: '100%',
      locale: 'en',
      colorTheme: 'dark',
      isTransparent: true
    });
    containerRef.current.appendChild(script);
  }, [symbol]);

  return <div className="tradingview-widget-container" ref={containerRef} />;
}
