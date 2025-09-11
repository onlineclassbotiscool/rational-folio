import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StockSearchProps {
  onStockSelect: (symbol: string) => void;
  currentSymbol?: string;
}

const TRENDING_STOCKS = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META'];

export function StockSearch({ onStockSelect, currentSymbol }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (symbol: string) => {
    onStockSelect(symbol);
    setQuery('');
    setIsOpen(false);
  };

  const filteredTrending = TRENDING_STOCKS.filter(stock => 
    stock.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
        <Input
          type="text"
          placeholder="Search stocks..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-10 font-mono bg-surface border-card-border focus:border-interactive"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-card-border rounded-md shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs text-text-tertiary mb-2 font-ui">Trending</div>
            {filteredTrending.map((symbol) => (
              <button
                key={symbol}
                onClick={() => handleSelect(symbol)}
                className="w-full text-left px-3 py-2 text-sm font-mono hover:bg-surface rounded transition-colors"
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}