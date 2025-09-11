import React from 'react';
import { Newspaper, TrendingUp, TrendingDown, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsItem {
  title: string;
  source: string;
  timestamp: string;
  url: string;
  sentiment: number; // -1 to 1
}

interface SentimentData {
  overall: number; // -1 to 1
  confidence: 'High' | 'Medium' | 'Low';
  socialMood: 'Bullish' | 'Neutral' | 'Bearish';
  mentions: number;
}

interface NewsAndSentimentProps {
  news: NewsItem[];
  sentiment: SentimentData;
}

export function NewsAndSentiment({ news, sentiment }: NewsAndSentimentProps) {
  const getSentimentColor = (value: number) => {
    if (value > 0.2) return 'text-market-positive';
    if (value < -0.2) return 'text-market-negative';
    return 'text-market-neutral';
  };

  const getSentimentEmoji = (value: number) => {
    if (value > 0.2) return '😊';
    if (value < -0.2) return '😔';
    return '😐';
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'Bullish': return <TrendingUp className="h-3 w-3 text-market-positive" />;
      case 'Bearish': return <TrendingDown className="h-3 w-3 text-market-negative" />;
      default: return <MessageCircle className="h-3 w-3 text-market-neutral" />;
    }
  };

  const formatSentiment = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="stock-card">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="h-4 w-4 text-interactive" />
        <h3 className="text-sm font-ui font-medium text-text-primary">News & Sentiment</h3>
      </div>

      {/* Sentiment Overview */}
      <div className="mb-4 p-3 bg-surface rounded-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-tertiary font-ui">Overall Sentiment</span>
          <div className="flex items-center gap-2">
            <span className={cn("text-lg font-mono", getSentimentColor(sentiment.overall))}>
              {formatSentiment(sentiment.overall)}
            </span>
            <span className="text-sm">{getSentimentEmoji(sentiment.overall)}</span>
          </div>
        </div>
        
        {/* Sentiment Bar */}
        <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden mb-2">
          <div 
            className={cn("h-full transition-all duration-500",
              sentiment.overall > 0.2 ? "bg-market-positive" :
              sentiment.overall < -0.2 ? "bg-market-negative" : "bg-market-neutral"
            )}
            style={{ 
              width: `${Math.abs(sentiment.overall) * 50 + 50}%`,
              marginLeft: sentiment.overall < 0 ? `${(1 + sentiment.overall) * 50}%` : '50%'
            }}
          />
        </div>

        {/* Social Metrics */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            {getMoodIcon(sentiment.socialMood)}
            <span className="font-ui text-text-secondary">{sentiment.socialMood}</span>
          </div>
          <div className="flex items-center gap-2 text-text-tertiary font-ui">
            <span>Confidence: {sentiment.confidence}</span>
            <span>•</span>
            <span>{sentiment.mentions} mentions</span>
          </div>
        </div>
      </div>

      {/* News Headlines */}
      <div className="space-y-3">
        {news.slice(0, 3).map((item, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="flex items-start gap-3">
              <div 
                className={cn("w-1 h-12 rounded-full flex-shrink-0 mt-1",
                  item.sentiment > 0.2 ? "bg-market-positive" :
                  item.sentiment < -0.2 ? "bg-market-negative" : "bg-market-neutral"
                )}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-ui text-text-primary line-clamp-2 group-hover:text-interactive transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-text-tertiary font-ui">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(item.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More */}
      <button className="w-full mt-4 text-xs text-text-secondary hover:text-text-primary transition-colors font-ui">
        View all news →
      </button>
    </div>
  );
}