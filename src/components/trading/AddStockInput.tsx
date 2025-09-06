import { useState } from "react";
import { Plus, Search } from "lucide-react";

interface AddStockInputProps {
  onAddStock: (symbol: string) => void;
  isLoading?: boolean;
}

const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
];

export function AddStockInput({ onAddStock, isLoading = false }: AddStockInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(POPULAR_STOCKS);

  const handleInputChange = (value: string) => {
    setInputValue(value.toUpperCase());
    
    if (value.length > 0) {
      const filtered = POPULAR_STOCKS.filter(
        stock => 
          stock.symbol.includes(value.toUpperCase()) ||
          stock.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(POPULAR_STOCKS);
    }
  };

  const handleSubmit = (symbol: string) => {
    if (symbol.trim()) {
      onAddStock(symbol.trim().toUpperCase());
      setInputValue('');
      setIsExpanded(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(inputValue);
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setInputValue('');
    }
  };

  return (
    <div className="relative">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="btn-zen w-full flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4" />
          <span>Add Stock</span>
        </button>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="input-zen w-full pl-10"
              autoFocus
            />
          </div>

          {filteredSuggestions.length > 0 && (
            <div className="bg-card border border-card-border rounded-lg overflow-hidden">
              {filteredSuggestions.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleSubmit(stock.symbol)}
                  className="w-full px-4 py-3 text-left hover:bg-surface-secondary transition-colors focus:outline-none focus:bg-surface-secondary"
                >
                  <div className="font-ui font-medium text-text-primary">
                    {stock.symbol}
                  </div>
                  <div className="font-ui text-sm text-text-secondary">
                    {stock.name}
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => handleSubmit(inputValue)}
              className="btn-zen flex-1"
              disabled={!inputValue.trim() || isLoading}
            >
              Add Stock
            </button>
            <button
              onClick={() => {
                setIsExpanded(false);
                setInputValue('');
              }}
              className="btn-ghost px-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}