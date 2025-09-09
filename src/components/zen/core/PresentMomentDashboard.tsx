import { useState, useEffect } from "react";
import { AlertCircle, Clock, Brain, Heart } from "lucide-react";

interface MarketData {
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  percentChange: number;
  lastUpdate: Date;
  volume: number;
  marketCap: number;
}

interface UncertaintyRange {
  low: number;
  mid: number;
  high: number;
  confidence: number;
}

interface RationalAnalysis {
  keyFactors: string[];
  uncertainties: string[];
  biasWarnings: string[];
  evidenceQuality: 'high' | 'medium' | 'low';
  timeHorizon: string;
  lastAnalyzed: Date;
}

interface ZenStock {
  market: MarketData;
  analysis: RationalAnalysis;
  priceProjection: UncertaintyRange;
}

const MINDFUL_PORTFOLIO: ZenStock[] = [
  {
    market: {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      currentPrice: 185.42,
      priceChange: 2.67,
      percentChange: 1.46,
      lastUpdate: new Date(),
      volume: 52840000,
      marketCap: 2890000000000
    },
    analysis: {
      keyFactors: [
        'Services revenue growth accelerating at 8.2% YoY',
        'iPhone sales stable despite market saturation concerns',
        'Vision Pro adoption slower than initial projections'
      ],
      uncertainties: [
        'China market regulatory environment remains fluid',
        'Consumer spending patterns shifting post-pandemic',
        'Competition in AI space intensifying rapidly'
      ],
      biasWarnings: [
        'Recent positive news may be creating anchoring bias',
        'Brand loyalty might cause confirmation bias in analysis'
      ],
      evidenceQuality: 'high',
      timeHorizon: '3-6 months',
      lastAnalyzed: new Date()
    },
    priceProjection: {
      low: 165,
      mid: 190,
      high: 215,
      confidence: 68
    }
  }
];

export function PresentMomentDashboard() {
  const [stocks, setStocks] = useState<ZenStock[]>(MINDFUL_PORTFOLIO);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [contemplationMode, setContemplationMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const getChangeClass = (change: number) => {
    if (change > 0) return 'text-market-positive';
    if (change < 0) return 'text-market-negative';
    return 'text-market-neutral';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mindful Header */}
      <header className="border-b border-card-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif text-text-primary mb-1">
                Present Reality
              </h1>
              <p className="font-ui text-sm text-text-secondary">
                What is true right now, without attachment to outcomes
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="font-mono text-sm text-text-secondary">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="font-ui text-xs text-text-tertiary">
                  Market is {new Date().getHours() >= 9 && new Date().getHours() < 16 ? 'open' : 'closed'}
                </div>
              </div>
              
              <button
                onClick={() => setContemplationMode(!contemplationMode)}
                className={`px-4 py-2 rounded-lg transition-all font-ui text-sm ${
                  contemplationMode 
                    ? 'bg-interactive text-interactive-foreground' 
                    : 'border border-card-border hover:bg-surface-secondary'
                }`}
              >
                <Heart className="w-4 h-4 inline mr-2" />
                {contemplationMode ? 'Exit Contemplation' : 'Contemplation Mode'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {contemplationMode && (
          <div className="mb-8 p-6 bg-surface-secondary rounded-lg border border-card-border">
            <h3 className="font-serif text-lg text-text-primary mb-3">
              Mindful Check-In
            </h3>
            <div className="space-y-3 font-ui text-sm text-text-secondary">
              <p>• How am I feeling about my investments right now?</p>
              <p>• What emotions am I bringing to this analysis?</p>
              <p>• Am I seeking confirmation of existing beliefs?</p>
              <p>• What would I do if I had no previous position?</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {stocks.map((zenStock) => (
            <div key={zenStock.market.symbol} className="bg-card border border-card-border rounded-lg p-6">
              {/* Stock Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-serif text-xl text-text-primary">
                    {zenStock.market.name}
                  </h2>
                  <span className="font-mono text-sm text-text-tertiary uppercase tracking-wide">
                    {zenStock.market.symbol}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="font-mono text-3xl text-text-primary mb-1">
                    {formatCurrency(zenStock.market.currentPrice)}
                  </div>
                  <div className={`font-ui text-sm ${getChangeClass(zenStock.market.priceChange)}`}>
                    {formatCurrency(zenStock.market.priceChange)} ({formatPercentage(zenStock.market.percentChange)})
                  </div>
                </div>
              </div>

              {/* Three-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* What We Know (Evidence) */}
                <div className="space-y-4">
                  <h3 className="font-ui font-semibold text-text-primary flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    What We Know
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-ui text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
                        Key Evidence
                      </h4>
                      <ul className="space-y-1">
                        {zenStock.analysis.keyFactors.map((factor, index) => (
                          <li key={index} className="font-ui text-sm text-text-secondary leading-relaxed">
                            • {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-card-border">
                      <div className="flex items-center justify-between">
                        <span className="font-ui text-xs text-text-tertiary">Evidence Quality</span>
                        <span className={`font-ui text-xs font-medium ${
                          zenStock.analysis.evidenceQuality === 'high' ? 'text-market-positive' :
                          zenStock.analysis.evidenceQuality === 'medium' ? 'text-market-neutral' :
                          'text-market-negative'
                        }`}>
                          {zenStock.analysis.evidenceQuality.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* What We Don't Know (Uncertainties) */}
                <div className="space-y-4">
                  <h3 className="font-ui font-semibold text-text-primary flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    What We Don't Know
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-ui text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
                        Key Uncertainties
                      </h4>
                      <ul className="space-y-1">
                        {zenStock.analysis.uncertainties.map((uncertainty, index) => (
                          <li key={index} className="font-ui text-sm text-text-secondary leading-relaxed">
                            • {uncertainty}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-ui text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
                        Bias Warnings
                      </h4>
                      <ul className="space-y-1">
                        {zenStock.analysis.biasWarnings.map((warning, index) => (
                          <li key={index} className="font-ui text-sm text-warning leading-relaxed">
                            ⚠ {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Honest Projections */}
                <div className="space-y-4">
                  <h3 className="font-ui font-semibold text-text-primary flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Honest Projections
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-ui text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
                        Price Range ({zenStock.analysis.timeHorizon})
                      </h4>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between font-mono text-sm">
                          <span className="text-text-tertiary">Low:</span>
                          <span className="text-market-negative">{formatCurrency(zenStock.priceProjection.low)}</span>
                        </div>
                        <div className="flex justify-between font-mono text-sm">
                          <span className="text-text-tertiary">Expected:</span>
                          <span className="text-text-primary font-semibold">{formatCurrency(zenStock.priceProjection.mid)}</span>
                        </div>
                        <div className="flex justify-between font-mono text-sm">
                          <span className="text-text-tertiary">High:</span>
                          <span className="text-market-positive">{formatCurrency(zenStock.priceProjection.high)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-card-border">
                        <div className="flex justify-between items-center">
                          <span className="font-ui text-xs text-text-tertiary">Confidence Level</span>
                          <span className="font-ui text-xs font-medium text-text-primary">
                            {zenStock.priceProjection.confidence}%
                          </span>
                        </div>
                        <div className="mt-1 bg-surface-secondary rounded-full h-2">
                          <div 
                            className="bg-interactive rounded-full h-2 transition-all"
                            style={{ width: `${zenStock.priceProjection.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Footer */}
              <div className="mt-6 pt-4 border-t border-card-border flex items-center justify-between">
                <span className="font-ui text-xs text-text-tertiary">
                  Last analyzed {zenStock.analysis.lastAnalyzed.toLocaleDateString()}
                </span>
                <span className="font-ui text-xs text-text-tertiary">
                  Data updated {zenStock.market.lastUpdate.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}