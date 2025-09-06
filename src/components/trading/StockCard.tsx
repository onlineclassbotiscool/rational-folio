import { TrendingUp, TrendingDown } from "lucide-react";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

interface PredictionData {
  confidence: number;
  direction: 'up' | 'down' | 'neutral';
  timeHorizon: '1hr' | '4hr' | '1day';
  rationale: string;
}

interface StockCardProps {
  stock: StockData;
  prediction?: PredictionData;
}

export function StockCard({ stock, prediction }: StockCardProps) {
  const { symbol, name, price, change, changePercent, lastUpdated } = stock;
  
  const isPositive = change > 0;
  const isNegative = change < 0;
  const changeColor = isPositive ? 'text-market-positive' : isNegative ? 'text-market-negative' : 'text-market-neutral';
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number) => {
    const prefix = change > 0 ? '+' : '';
    return `${prefix}${change.toFixed(2)}`;
  };

  const formatPercent = (percent: number) => {
    const prefix = percent > 0 ? '+' : '';
    return `${prefix}${percent.toFixed(2)}%`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="stock-card group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary leading-tight">
            {name}
          </h3>
          <span className="font-ui text-sm text-text-tertiary uppercase tracking-wider">
            {symbol}
          </span>
        </div>
        <div className="text-right">
          <div className="price-display text-2xl font-bold text-text-primary">
            {formatPrice(price)}
          </div>
          <div className={`font-ui text-sm flex items-center justify-end gap-1 ${changeColor}`}>
            {(isPositive || isNegative) && (
              <ChangeIcon className="h-3 w-3" />
            )}
            <span>{formatChange(change)}</span>
            <span>({formatPercent(changePercent)})</span>
          </div>
        </div>
      </div>

      <div className="h-8 bg-surface-secondary rounded mb-4">
        {/* Placeholder for mini sparkline chart */}
        <div className="h-full flex items-center justify-center">
          <span className="font-ui text-xs text-text-tertiary">
            24h Chart
          </span>
        </div>
      </div>

      {prediction && (
        <div className="border-t border-card-border pt-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-ui text-xs font-medium text-text-secondary uppercase tracking-wider">
              AI Prediction ({prediction.timeHorizon})
            </span>
            <div className="flex items-center gap-1">
              {prediction.direction === 'up' ? (
                <TrendingUp className="h-3 w-3 text-market-positive" />
              ) : prediction.direction === 'down' ? (
                <TrendingDown className="h-3 w-3 text-market-negative" />
              ) : null}
              <span className="font-ui text-xs font-semibold text-text-primary">
                {prediction.confidence}%
              </span>
            </div>
          </div>
          
          <div className="confidence-bar mb-2">
            <div 
              className="confidence-fill bg-interactive"
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
          
          <p className="font-ui text-xs text-text-secondary leading-relaxed">
            {prediction.rationale}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-card-border">
        <span className="font-ui text-xs text-text-tertiary">
          Last updated
        </span>
        <span className="font-ui text-xs text-text-secondary">
          {formatTime(lastUpdated)}
        </span>
      </div>
    </div>
  );
}