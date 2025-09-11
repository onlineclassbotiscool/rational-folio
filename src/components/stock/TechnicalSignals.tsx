import React from 'react';
import { Activity, TrendingUp, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechnicalData {
  rsi: {
    value: number;
    signal: 'overbought' | 'oversold' | 'neutral';
  };
  movingAverages: {
    signal: 'bullish' | 'bearish' | 'neutral';
    description: string;
  };
  supportResistance: {
    support: number;
    resistance: number;
    current: number;
  };
}

interface TechnicalSignalsProps {
  data: TechnicalData;
}

export function TechnicalSignals({ data }: TechnicalSignalsProps) {
  const getRSIColor = (signal: string) => {
    switch (signal) {
      case 'overbought': return 'text-market-negative';
      case 'oversold': return 'text-market-positive';
      default: return 'text-market-neutral';
    }
  };

  const getRSIEmoji = (signal: string) => {
    switch (signal) {
      case 'overbought': return '🔴';
      case 'oversold': return '🟢';
      default: return '🟡';
    }
  };

  const getMASignalColor = (signal: string) => {
    switch (signal) {
      case 'bullish': return 'text-market-positive';
      case 'bearish': return 'text-market-negative';
      default: return 'text-market-neutral';
    }
  };

  const getMAEmoji = (signal: string) => {
    switch (signal) {
      case 'bullish': return '🟢';
      case 'bearish': return '🔴';
      default: return '🟡';
    }
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <div className="stock-card">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-4 w-4 text-interactive" />
        <h3 className="text-sm font-ui font-medium text-text-primary">Key Signals</h3>
      </div>

      {/* RSI */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-tertiary font-ui">RSI</span>
            <span className="text-xs">{getRSIEmoji(data.rsi.signal)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono">{data.rsi.value}</span>
            <span className={cn("text-xs font-ui capitalize", getRSIColor(data.rsi.signal))}>
              ({data.rsi.signal})
            </span>
          </div>
        </div>
        
        {/* RSI Bar */}
        <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden relative">
          <div className="absolute inset-0 flex">
            <div className="w-[30%] bg-market-positive opacity-20"></div>
            <div className="w-[40%] bg-market-neutral opacity-20"></div>
            <div className="w-[30%] bg-market-negative opacity-20"></div>
          </div>
          <div 
            className="absolute h-full w-1 bg-text-primary rounded-full"
            style={{ left: `${data.rsi.value}%`, transform: 'translateX(-50%)' }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-tertiary font-mono mt-1">
          <span>0</span>
          <span>30</span>
          <span>70</span>
          <span>100</span>
        </div>
      </div>

      {/* Moving Averages */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3 text-text-tertiary" />
            <span className="text-xs text-text-tertiary font-ui">Trend</span>
            <span className="text-xs">{getMAEmoji(data.movingAverages.signal)}</span>
          </div>
          <span className={cn("text-sm font-ui capitalize", getMASignalColor(data.movingAverages.signal))}>
            {data.movingAverages.signal}
          </span>
        </div>
        <p className="text-xs text-text-secondary font-ui">{data.movingAverages.description}</p>
      </div>

      {/* Support & Resistance */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-3 w-3 text-text-tertiary" />
          <span className="text-xs text-text-tertiary font-ui">Support & Resistance</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-text-tertiary font-ui">Resistance</span>
            <span className="text-sm font-mono text-market-negative">
              {formatPrice(data.supportResistance.resistance)}
            </span>
          </div>
          
          {/* Price Position Indicator */}
          <div className="relative h-6 bg-surface-secondary rounded">
            <div className="absolute inset-x-0 top-0 h-1 bg-market-negative rounded-t"></div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-market-positive rounded-b"></div>
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-1 h-4 bg-interactive rounded"
              style={{ 
                left: `${((data.supportResistance.current - data.supportResistance.support) / 
                  (data.supportResistance.resistance - data.supportResistance.support)) * 100}%`,
                transform: 'translateX(-50%) translateY(-50%)'
              }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-text-tertiary font-ui">Support</span>
            <span className="text-sm font-mono text-market-positive">
              {formatPrice(data.supportResistance.support)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}