import { useState, useEffect } from "react";
import { StockCard } from "./StockCard";
import { AddStockInput } from "./AddStockInput";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

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

// Mock data for demonstration
const MOCK_STOCKS: StockData[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 185.42,
    change: 2.67,
    changePercent: 1.46,
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.18,
    change: -1.23,
    changePercent: -0.86,
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    change: 4.12,
    changePercent: 1.10,
    lastUpdated: new Date().toISOString(),
  },
];

const MOCK_PREDICTIONS: Record<string, PredictionData> = {
  'AAPL': {
    confidence: 73,
    direction: 'up',
    timeHorizon: '4hr',
    rationale: 'Strong momentum following positive earnings sentiment and increased institutional buying pressure.',
  },
  'GOOGL': {
    confidence: 62,
    direction: 'down',
    timeHorizon: '1day',
    rationale: 'Regulatory concerns and market consolidation may pressure price in short term.',
  },
  'MSFT': {
    confidence: 81,
    direction: 'up',
    timeHorizon: '1day',
    rationale: 'Cloud growth acceleration and AI integration driving sustained bullish outlook.',
  },
};

export function TradingDashboard() {
  const [stocks, setStocks] = useState<StockData[]>(MOCK_STOCKS);
  const [isConnected, setIsConnected] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Simulate auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate price updates
    setStocks(prev => prev.map(stock => ({
      ...stock,
      price: stock.price + (Math.random() - 0.5) * 2,
      change: stock.change + (Math.random() - 0.5) * 0.5,
      changePercent: stock.changePercent + (Math.random() - 0.5) * 0.2,
      lastUpdated: new Date().toISOString(),
    })));
    
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const handleAddStock = (symbol: string) => {
    // Check if stock already exists
    if (stocks.find(stock => stock.symbol === symbol)) {
      return;
    }

    // Add new stock with mock data
    const newStock: StockData = {
      symbol,
      name: `${symbol} Corporation`,
      price: Math.random() * 200 + 50,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      lastUpdated: new Date().toISOString(),
    };

    setStocks(prev => [...prev, newStock]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                Zen Trading
              </h1>
              <p className="font-ui text-sm text-text-secondary">
                Rational decisions through clear data
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-ui text-sm text-text-secondary">
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-market-positive" />
                ) : (
                  <WifiOff className="h-4 w-4 text-market-negative" />
                )}
                <span>Last update: {formatTime(lastRefresh)}</span>
              </div>
              
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className="btn-ghost flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stocks.map((stock) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              prediction={MOCK_PREDICTIONS[stock.symbol]}
            />
          ))}
          
          {/* Add Stock Card */}
          <div className="stock-card">
            <AddStockInput onAddStock={handleAddStock} />
          </div>
        </div>

        {stocks.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-text-primary mb-2">
              Start Your Watchlist
            </h2>
            <p className="text-text-secondary mb-6">
              Add your first stock to begin tracking market movements with clarity and precision.
            </p>
            <div className="max-w-md mx-auto">
              <AddStockInput onAddStock={handleAddStock} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}