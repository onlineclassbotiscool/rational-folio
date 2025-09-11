import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cn } from '@/lib/utils';

interface ChartData {
  date: string;
  price: number;
  volume: number;
}

interface StockChartProps {
  data: ChartData[];
  currentPrice: number;
}

const TIME_PERIODS = [
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '6M', value: '6M', default: true },
  { label: '1Y', value: '1Y' },
  { label: '2Y', value: '2Y' },
];

export function StockChart({ data, currentPrice }: StockChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('6M');
  const [showMA, setShowMA] = useState(false);

  // Calculate moving averages
  const dataWithMA = data.map((item, index) => {
    const ma20 = index >= 19 ? 
      data.slice(index - 19, index + 1).reduce((sum, d) => sum + d.price, 0) / 20 : null;
    const ma50 = index >= 49 ? 
      data.slice(index - 49, index + 1).reduce((sum, d) => sum + d.price, 0) / 50 : null;
    
    return { ...item, ma20, ma50 };
  });

  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const priceRange = maxPrice - minPrice;
  
  return (
    <div className="stock-card">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-ui font-medium text-text-primary">Price Chart</h3>
        <button
          onClick={() => setShowMA(!showMA)}
          className={cn("text-xs font-ui px-2 py-1 rounded transition-colors",
            showMA ? "bg-interactive text-interactive-foreground" : "text-text-secondary hover:text-text-primary"
          )}
        >
          MA
        </button>
      </div>

      {/* Time Period Toggles */}
      <div className="flex gap-1 mb-4">
        {TIME_PERIODS.map((period) => (
          <button
            key={period.value}
            onClick={() => setSelectedPeriod(period.value)}
            className={cn(
              "px-3 py-1 text-xs font-mono rounded transition-colors",
              selectedPeriod === period.value
                ? "bg-interactive text-interactive-foreground"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
            )}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataWithMA} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              domain={[minPrice - priceRange * 0.05, maxPrice + priceRange * 0.05]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            
            {/* Main price line */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--interactive))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, stroke: 'hsl(var(--interactive))', strokeWidth: 2, fill: 'hsl(var(--card))' }}
            />
            
            {/* Moving averages */}
            {showMA && (
              <>
                <Line
                  type="monotone"
                  dataKey="ma20"
                  stroke="hsl(var(--market-positive))"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="ma50"
                  stroke="hsl(var(--market-negative))"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                  connectNulls={false}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Bars */}
      <div className="h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 0, right: 5, left: 5, bottom: 0 }}>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="hsl(var(--text-tertiary))"
              strokeWidth={1}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      {showMA && (
        <div className="flex gap-4 text-xs font-ui text-text-secondary mt-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-px bg-market-positive opacity-70"></div>
            <span>20-day MA</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-px bg-market-negative opacity-70"></div>
            <span>50-day MA</span>
          </div>
        </div>
      )}
    </div>
  );
}