import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  peRatio: number;
  weekHigh52: number;
  weekLow52: number;
  volume?: number;
  dayRange?: string;
  dividendYield?: number;
}

interface StockPriceCardProps {
  stock: StockData;
  showSecondary?: boolean;
  onToggleSecondary?: () => void;
}

export function StockPriceCard({ stock, showSecondary, onToggleSecondary }: StockPriceCardProps) {
  const isPositive = stock.change >= 0;
  
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number) => `${change >= 0 ? '+' : ''}$${change.toFixed(2)}`;
  const formatPercent = (percent: number) => `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;

  return (
    <div className="stock-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-lg font-mono font-semibold text-text-primary">{stock.symbol}</h1>
          <p className="text-sm text-text-secondary font-ui">{stock.name}</p>
        </div>
        <div className={cn("flex items-center", isPositive ? "text-market-positive" : "text-market-negative")}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        </div>
      </div>

      {/* Price Display */}
      <div className="mb-4">
        <div className="price-display text-3xl mb-1">
          {formatPrice(stock.price)}
        </div>
        <div className={cn("flex items-center gap-2 text-sm font-mono", 
          isPositive ? "text-market-positive" : "text-market-negative"
        )}>
          <span>{formatChange(stock.change)}</span>
          <span>({formatPercent(stock.changePercent)})</span>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <div className="text-xs text-text-tertiary font-ui mb-1">Market Cap</div>
          <div className="text-sm font-mono">{stock.marketCap}</div>
        </div>
        <div>
          <div className="text-xs text-text-tertiary font-ui mb-1">P/E Ratio</div>
          <div className="text-sm font-mono">{stock.peRatio}</div>
        </div>
      </div>

      {/* 52-Week Range */}
      <div className="mb-4">
        <div className="text-xs text-text-tertiary font-ui mb-2">52-Week Range</div>
        <div className="flex items-center justify-between text-sm font-mono">
          <span>{formatPrice(stock.weekLow52)}</span>
          <div className="flex-1 mx-3 h-1 bg-surface-secondary rounded-full relative">
            <div 
              className="absolute h-full bg-interactive rounded-full"
              style={{
                width: `${((stock.price - stock.weekLow52) / (stock.weekHigh52 - stock.weekLow52)) * 100}%`
              }}
            />
          </div>
          <span>{formatPrice(stock.weekHigh52)}</span>
        </div>
      </div>

      {/* Secondary Data (Collapsible) */}
      {showSecondary && (
        <div className="border-t border-card-border pt-3 space-y-2">
          {stock.volume && (
            <div className="flex justify-between">
              <span className="text-xs text-text-tertiary font-ui">Volume</span>
              <span className="text-sm font-mono">{stock.volume.toLocaleString()}</span>
            </div>
          )}
          {stock.dayRange && (
            <div className="flex justify-between">
              <span className="text-xs text-text-tertiary font-ui">Day's Range</span>
              <span className="text-sm font-mono">{stock.dayRange}</span>
            </div>
          )}
          {stock.dividendYield && (
            <div className="flex justify-between">
              <span className="text-xs text-text-tertiary font-ui">Dividend Yield</span>
              <span className="text-sm font-mono">{stock.dividendYield.toFixed(2)}%</span>
            </div>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={onToggleSecondary}
        className="w-full mt-3 text-xs text-text-tertiary hover:text-text-secondary transition-colors font-ui"
      >
        {showSecondary ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
}