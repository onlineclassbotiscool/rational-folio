import { useState } from "react";
import { AlertTriangle, Eye, Brain, CheckCircle } from "lucide-react";

interface BiasCheck {
  id: string;
  name: string;
  description: string;
  warning: string;
  questions: string[];
  detected: boolean;
  severity: 'low' | 'medium' | 'high';
}

const COGNITIVE_BIASES: BiasCheck[] = [
  {
    id: 'anchoring',
    name: 'Anchoring Bias',
    description: 'Over-relying on the first piece of information encountered',
    warning: 'You may be anchored to recent price levels or analyst targets',
    questions: [
      'What was the first price target or valuation you saw for this stock?',
      'Are you adjusting from that initial number rather than thinking independently?',
      'Would your analysis be different if you started fresh with no prior price information?'
    ],
    detected: true,
    severity: 'medium'
  },
  {
    id: 'confirmation',
    name: 'Confirmation Bias',
    description: 'Seeking information that confirms existing beliefs',
    warning: 'Your research may be selectively supporting your existing position',
    questions: [
      'Have you actively sought out opposing viewpoints to your investment thesis?',
      'What evidence would change your mind about this investment?',
      'Are you dismissing negative news too quickly?'
    ],
    detected: true,
    severity: 'high'
  },
  {
    id: 'recency',
    name: 'Recency Bias',
    description: 'Giving greater weight to recent events',
    warning: 'Recent market movements may be overly influencing your decisions',
    questions: [
      'How much weight are you giving to last week\'s earnings vs. long-term trends?',
      'Are you extrapolating short-term patterns too far into the future?',
      'What would your view be if you looked at 5-year data instead of 6-month data?'
    ],
    detected: false,
    severity: 'low'
  },
  {
    id: 'availability',
    name: 'Availability Heuristic',
    description: 'Overestimating likelihood of events with greater recall',
    warning: 'Memorable news stories may be distorting probability assessments',
    questions: [
      'What recent news stories are influencing your thinking about this sector?',
      'Are you overweighting dramatic events vs. base rates?',
      'How often do events like this actually happen historically?'
    ],
    detected: false,
    severity: 'medium'
  },
  {
    id: 'loss-aversion',
    name: 'Loss Aversion',
    description: 'Feeling losses more acutely than equivalent gains',
    warning: 'Fear of losses may be clouding rational analysis',
    questions: [
      'Are you holding losing positions too long to avoid realizing losses?',
      'Would you buy this stock today at the current price with fresh money?',
      'Are you taking smaller gains than warranted due to fear of losses?'
    ],
    detected: true,
    severity: 'medium'
  }
];

interface BiasDetectorProps {
  symbol?: string;
  onBiasAcknowledged?: (biasId: string) => void;
}

export function BiasDetector({ symbol, onBiasAcknowledged }: BiasDetectorProps) {
  const [expandedBias, setExpandedBias] = useState<string | null>(null);
  const [acknowledgedBiases, setAcknowledgedBiases] = useState<Set<string>>(new Set());

  const handleAcknowledge = (biasId: string) => {
    setAcknowledgedBiases(prev => new Set([...prev, biasId]));
    onBiasAcknowledged?.(biasId);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-market-neutral';
      default: return 'text-text-secondary';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-error/10 border-error/20';
      case 'medium': return 'bg-warning/10 border-warning/20';
      case 'low': return 'bg-market-neutral/10 border-market-neutral/20';
      default: return 'bg-surface-secondary border-card-border';
    }
  };

  const detectedBiases = COGNITIVE_BIASES.filter(bias => bias.detected);
  const acknowledgedCount = detectedBiases.filter(bias => acknowledgedBiases.has(bias.id)).length;

  return (
    <div className="bg-card border border-card-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-interactive" />
          <h2 className="font-serif text-xl text-text-primary">
            Cognitive Bias Check
          </h2>
        </div>
        <div className="text-right">
          <div className="font-ui text-sm text-text-secondary">
            {acknowledgedCount}/{detectedBiases.length} acknowledged
          </div>
          <div className="font-ui text-xs text-text-tertiary">
            {symbol ? `For ${symbol}` : 'General analysis'}
          </div>
        </div>
      </div>

      {detectedBiases.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-market-positive mx-auto mb-3" />
          <h3 className="font-ui font-medium text-text-primary mb-2">
            Clear Thinking Detected
          </h3>
          <p className="font-ui text-sm text-text-secondary">
            No obvious cognitive biases detected in your current analysis.
            Continue with mindful awareness.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-surface-secondary rounded-lg p-4 border border-card-border">
            <p className="font-ui text-sm text-text-secondary leading-relaxed">
              <Eye className="w-4 h-4 inline mr-2" />
              These potential biases have been detected in your analysis pattern. 
              Take a moment to reflect on each one with beginner's mind.
            </p>
          </div>

          {detectedBiases.map((bias) => (
            <div 
              key={bias.id}
              className={`rounded-lg border p-4 transition-all ${getSeverityBg(bias.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className={`w-4 h-4 ${getSeverityColor(bias.severity)}`} />
                    <h3 className="font-ui font-semibold text-text-primary">
                      {bias.name}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(bias.severity)}`}>
                      {bias.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="font-ui text-sm text-text-secondary mb-2">
                    {bias.description}
                  </p>
                  
                  <p className={`font-ui text-sm font-medium ${getSeverityColor(bias.severity)}`}>
                    {bias.warning}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setExpandedBias(expandedBias === bias.id ? null : bias.id)}
                    className="px-3 py-1 rounded text-xs font-ui border border-card-border hover:bg-surface-secondary transition-colors"
                  >
                    {expandedBias === bias.id ? 'Collapse' : 'Reflect'}
                  </button>
                  
                  {!acknowledgedBiases.has(bias.id) && (
                    <button
                      onClick={() => handleAcknowledge(bias.id)}
                      className="px-3 py-1 rounded text-xs font-ui bg-interactive text-interactive-foreground hover:bg-interactive-hover transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  
                  {acknowledgedBiases.has(bias.id) && (
                    <div className="flex items-center px-3 py-1 rounded text-xs font-ui bg-market-positive/10 text-market-positive">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Noted
                    </div>
                  )}
                </div>
              </div>

              {expandedBias === bias.id && (
                <div className="mt-4 pt-4 border-t border-card-border/50">
                  <h4 className="font-ui font-medium text-text-primary mb-3">
                    Reflective Questions:
                  </h4>
                  <ul className="space-y-2">
                    {bias.questions.map((question, index) => (
                      <li key={index} className="font-ui text-sm text-text-secondary leading-relaxed pl-4 relative">
                        <span className="absolute left-0 top-1">•</span>
                        {question}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 p-3 bg-surface-secondary/50 rounded border border-card-border/50">
                    <p className="font-ui text-xs text-text-tertiary italic">
                      Take a moment to sit with these questions. There's no rush to answer them all.
                      The awareness itself is the first step toward clearer thinking.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}