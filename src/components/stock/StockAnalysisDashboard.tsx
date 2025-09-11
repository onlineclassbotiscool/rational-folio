import React, { useState } from 'react';
import { Star, StarOff } from 'lucide-react';
import { StockSearch } from './StockSearch';
import { StockPriceCard } from './StockPriceCard';
import { StockChart } from './StockChart';
import { AIInsights } from './AIInsights';
import { TechnicalSignals } from './TechnicalSignals';
import { NewsAndSentiment } from './NewsAndSentiment';

// Mock data
const MOCK_STOCK_DATA = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 150.25,
  change: 2.45,
  changePercent: 1.65,
  marketCap: '2.4T',
  peRatio: 28.5,
  weekHigh52: 182.94,
  weekLow52: 124.17,
  volume: 75423156,
  dayRange: '$148.50 - $151.20',
  dividendYield: 0.52
};

const MOCK_CHART_DATA = Array.from({ length: 180 }, (_, i) => ({
  date: new Date(Date.now() - (180 - i) * 24 * 60 * 60 * 1000).toISOString(),
  price: 140 + Math.random() * 20 + Math.sin(i / 10) * 10,
  volume: 50000000 + Math.random() * 50000000
}));

const MOCK_AI_INSIGHTS = {
  overallScore: 7.2,
  assessment: "Strong uptrend with good momentum. RSI not overbought yet.",
  keySignal: "Golden cross formation with volume confirmation",
  riskLevel: 'Medium' as const,
  riskReason: "High valuation multiples amid market uncertainty",
  trendDirection: 'bullish' as const,
  trendStrength: 8,
  confidence: 'High' as const
};

const MOCK_TECHNICAL_DATA = {
  rsi: {
    value: 65,
    signal: 'neutral' as const
  },
  movingAverages: {
    signal: 'bullish' as const,
    description: "20-day MA crossed above 50-day MA with strong volume"
  },
  supportResistance: {
    support: 147.50,
    resistance: 155.80,
    current: 150.25
  }
};

const MOCK_NEWS = [
  {
    title: "Apple announces strong Q3 earnings beat expectations",
    source: "Reuters",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    url: "#",
    sentiment: 0.7
  },
  {
    title: "Analyst upgrades AAPL to Strong Buy on iPhone demand",
    source: "Bloomberg",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    url: "#",
    sentiment: 0.5
  },
  {
    title: "Apple faces supply chain challenges in China",
    source: "WSJ",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    url: "#",
    sentiment: -0.3
  }
];

const MOCK_SENTIMENT = {
  overall: 0.6,
  confidence: 'High' as const,
  socialMood: 'Bullish' as const,
  mentions: 12847
};

export function StockAnalysisDashboard() {
  const [currentStock, setCurrentStock] = useState('AAPL');
  const [showSecondary, setShowSecondary] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(true);

  const handleStockSelect = (symbol: string) => {
    setCurrentStock(symbol);
    // Here you would typically fetch new data for the selected stock
  };

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-card-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-ui font-semibold text-text-primary">Stock Analysis</h1>
              <div className="w-64">
                <StockSearch onStockSelect={handleStockSelect} currentSymbol={currentStock} />
              </div>
            </div>
            <button
              onClick={toggleWatchlist}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              {isInWatchlist ? <Star className="h-5 w-5 fill-current" /> : <StarOff className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Primary Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Card */}
            <StockPriceCard 
              stock={MOCK_STOCK_DATA}
              showSecondary={showSecondary}
              onToggleSecondary={() => setShowSecondary(!showSecondary)}
            />
            
            {/* Chart */}
            <StockChart 
              data={MOCK_CHART_DATA}
              currentPrice={MOCK_STOCK_DATA.price}
            />
          </div>

          {/* Right Column - Analysis */}
          <div className="space-y-6">
            {/* AI Insights */}
            <AIInsights insights={MOCK_AI_INSIGHTS} />
            
            {/* Technical Signals */}
            <TechnicalSignals data={MOCK_TECHNICAL_DATA} />
            
            {/* News & Sentiment */}
            <NewsAndSentiment 
              news={MOCK_NEWS}
              sentiment={MOCK_SENTIMENT}
            />
          </div>
        </div>
      </main>
    </div>
  );
}