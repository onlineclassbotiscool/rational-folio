import React from 'react';
import { TrendingUp, TrendingDown, Minus, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIInsightsData {
  overallScore: number;
  assessment: string;
  keySignal: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskReason: string;
  trendDirection: 'bullish' | 'bearish' | 'neutral';
  trendStrength: number;
  confidence: 'High' | 'Medium' | 'Low';
}

interface AIInsightsProps {
  insights: AIInsightsData;
}

export function AIInsights({ insights }: AIInsightsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-market-positive';
    if (score >= 4) return 'text-market-neutral';
    return 'text-market-negative';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-market-positive';
      case 'Medium': return 'text-market-neutral';
      case 'High': return 'text-market-negative';
      default: return 'text-text-secondary';
    }
  };

  const getTrendIcon = () => {
    switch (insights.trendDirection) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-market-positive" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-market-negative" />;
      default: return <Minus className="h-4 w-4 text-market-neutral" />;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'text-market-positive';
      case 'Medium': return 'text-market-neutral';
      case 'Low': return 'text-market-negative';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="stock-card">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-4 w-4 text-interactive" />
        <h3 className="text-sm font-ui font-medium text-text-primary">AI Insights</h3>
      </div>

      {/* Overall Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-tertiary font-ui">Overall Score</span>
          <div className="flex items-center gap-2">
            <span className={cn("text-lg font-mono font-semibold", getScoreColor(insights.overallScore))}>
              {insights.overallScore.toFixed(1)}/10
            </span>
            <div className={cn("w-2 h-2 rounded-full", 
              insights.overallScore >= 7 ? "bg-market-positive" :
              insights.overallScore >= 4 ? "bg-market-neutral" : "bg-market-negative"
            )} />
          </div>
        </div>
        
        {/* Score Bar */}
        <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-500",
              insights.overallScore >= 7 ? "bg-market-positive" :
              insights.overallScore >= 4 ? "bg-market-neutral" : "bg-market-negative"
            )}
            style={{ width: `${(insights.overallScore / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Assessment */}
      <div className="mb-4">
        <p className="text-sm font-ui text-text-primary leading-relaxed">
          "{insights.assessment}"
        </p>
      </div>

      {/* Key Signal */}
      <div className="mb-4">
        <div className="text-xs text-text-tertiary font-ui mb-1">Key Signal</div>
        <p className="text-sm font-ui text-text-secondary">{insights.keySignal}</p>
      </div>

      {/* Trend & Risk Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-text-tertiary font-ui mb-1">Trend</div>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className="text-sm font-ui capitalize">{insights.trendDirection}</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-text-tertiary font-ui mb-1">Risk Level</div>
          <div className={cn("text-sm font-ui", getRiskColor(insights.riskLevel))}>
            {insights.riskLevel}
          </div>
        </div>
      </div>

      {/* Risk Reason */}
      <div className="mb-4">
        <div className="text-xs text-text-tertiary font-ui mb-1">Risk Assessment</div>
        <p className="text-xs font-ui text-text-secondary">{insights.riskReason}</p>
      </div>

      {/* Confidence */}
      <div className="border-t border-card-border pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-tertiary font-ui">Confidence</span>
          <span className={cn("text-sm font-ui", getConfidenceColor(insights.confidence))}>
            {insights.confidence}
          </span>
        </div>
      </div>
    </div>
  );
}