import { useState, useEffect } from "react";
import { MessageCircle, Lightbulb, ArrowRight, Pause } from "lucide-react";

interface Question {
  id: string;
  text: string;
  category: 'understanding' | 'assumption' | 'evidence' | 'consequence' | 'perspective';
  followUp?: string;
  depth: number;
}

interface Dialogue {
  questions: Question[];
  currentIndex: number;
  userResponses: Record<string, string>;
  insights: string[];
}

const SOCRATIC_QUESTIONS: Question[] = [
  {
    id: 'initial-thesis',
    text: 'What is your core investment thesis for this position?',
    category: 'understanding',
    followUp: 'Can you state this in one clear sentence?',
    depth: 1
  },
  {
    id: 'why-believe',
    text: 'Why do you believe this thesis is correct?',
    category: 'evidence',
    followUp: 'What specific evidence supports each part of your reasoning?',
    depth: 2
  },
  {
    id: 'assumptions',
    text: 'What assumptions are you making that might not be true?',
    category: 'assumption',
    followUp: 'How would your thesis change if any of these assumptions were wrong?',
    depth: 2
  },
  {
    id: 'counter-evidence',
    text: 'What evidence would make you reconsider this investment?',
    category: 'evidence',
    followUp: 'How actively are you monitoring for this type of evidence?',
    depth: 3
  },
  {
    id: 'market-disagree',
    text: 'If the market is pricing this differently than your view, why might that be?',
    category: 'perspective',
    followUp: 'What might other investors see that you\'re missing?',
    depth: 3
  },
  {
    id: 'time-horizon',
    text: 'Over what time period do you expect your thesis to play out?',
    category: 'consequence',
    followUp: 'What could happen in the short term that might test your patience?',
    depth: 2
  },
  {
    id: 'if-wrong',
    text: 'If you\'re wrong about this investment, what would be the most likely reason?',
    category: 'assumption',
    followUp: 'How will you know if you\'re wrong before it\'s too late?',
    depth: 4
  },
  {
    id: 'no-position',
    text: 'If you had no current position, would you buy this stock today at this price?',
    category: 'perspective',
    followUp: 'What\'s different about your current situation versus starting fresh?',
    depth: 3
  }
];

interface SocraticQuestionerProps {
  symbol?: string;
  onInsightGenerated?: (insight: string) => void;
}

export function SocraticQuestioner({ symbol, onInsightGenerated }: SocraticQuestionerProps) {
  const [dialogue, setDialogue] = useState<Dialogue>({
    questions: SOCRATIC_QUESTIONS.slice(0, 3), // Start with first 3 questions
    currentIndex: 0,
    userResponses: {},
    insights: []
  });
  
  const [currentResponse, setCurrentResponse] = useState('');
  const [isContemplating, setIsContemplating] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const currentQuestion = dialogue.questions[dialogue.currentIndex];
  const isLastQuestion = dialogue.currentIndex === dialogue.questions.length - 1;
  const hasResponse = dialogue.userResponses[currentQuestion?.id];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'understanding': return '🎯';
      case 'assumption': return '🤔';
      case 'evidence': return '📊';
      case 'consequence': return '⏳';
      case 'perspective': return '👁️';
      default: return '💭';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'understanding': return 'text-interactive';
      case 'assumption': return 'text-warning';
      case 'evidence': return 'text-market-positive';
      case 'consequence': return 'text-market-neutral';
      case 'perspective': return 'text-text-primary';
      default: return 'text-text-secondary';
    }
  };

  const handleResponseSubmit = () => {
    if (!currentResponse.trim()) return;

    setDialogue(prev => ({
      ...prev,
      userResponses: {
        ...prev.userResponses,
        [currentQuestion.id]: currentResponse
      }
    }));

    // Generate insight based on response depth and content
    if (currentResponse.length > 50) {
      const insight = generateInsight(currentQuestion, currentResponse);
      if (insight) {
        setDialogue(prev => ({
          ...prev,
          insights: [...prev.insights, insight]
        }));
        onInsightGenerated?.(insight);
      }
    }

    setCurrentResponse('');
    setShowFollowUp(true);
  };

  const moveToNextQuestion = () => {
    if (isLastQuestion) {
      // Add deeper questions based on responses
      const nextQuestions = selectNextQuestions();
      if (nextQuestions.length > 0) {
        setDialogue(prev => ({
          ...prev,
          questions: [...prev.questions, ...nextQuestions],
          currentIndex: prev.currentIndex + 1
        }));
      }
    } else {
      setDialogue(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1
      }));
    }
    setShowFollowUp(false);
  };

  const selectNextQuestions = (): Question[] => {
    // Logic to select deeper questions based on user responses
    const responses = dialogue.userResponses;
    const nextQuestions: Question[] = [];

    // If user shows strong conviction, probe assumptions more
    if (Object.values(responses).some(r => r.includes('certain') || r.includes('confident'))) {
      nextQuestions.push(SOCRATIC_QUESTIONS.find(q => q.id === 'if-wrong')!);
    }

    // If user mentions market timing, ask about patience
    if (Object.values(responses).some(r => r.includes('short') || r.includes('quick'))) {
      nextQuestions.push(SOCRATIC_QUESTIONS.find(q => q.id === 'time-horizon')!);
    }

    return nextQuestions.slice(0, 2); // Limit to 2 additional questions
  };

  const generateInsight = (question: Question, response: string): string | null => {
    // Simple insight generation based on response patterns
    if (question.category === 'assumption' && response.length > 100) {
      return 'Deep reflection on assumptions detected. Consider monitoring these regularly.';
    }
    if (question.category === 'evidence' && response.includes('but')) {
      return 'Conflicting evidence acknowledged. This self-awareness strengthens your analysis.';
    }
    if (question.category === 'perspective' && response.includes('wrong')) {
      return 'Intellectual humility observed. This openness to being wrong is crucial for good investing.';
    }
    return null;
  };

  const startContemplation = () => {
    setIsContemplating(true);
    setTimeout(() => {
      setIsContemplating(false);
    }, 30000); // 30-second contemplation period
  };

  if (!currentQuestion) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-6">
        <div className="text-center py-8">
          <Lightbulb className="w-12 h-12 text-interactive mx-auto mb-4" />
          <h3 className="font-serif text-xl text-text-primary mb-2">
            Dialogue Complete
          </h3>
          <p className="font-ui text-sm text-text-secondary mb-6">
            You've engaged deeply with your investment reasoning. Take time to integrate these insights.
          </p>
          
          {dialogue.insights.length > 0 && (
            <div className="text-left bg-surface-secondary rounded-lg p-4">
              <h4 className="font-ui font-medium text-text-primary mb-3">Key Insights:</h4>
              <ul className="space-y-2">
                {dialogue.insights.map((insight, index) => (
                  <li key={index} className="font-ui text-sm text-text-secondary leading-relaxed">
                    • {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-interactive" />
          <h2 className="font-serif text-xl text-text-primary">
            Socratic Inquiry
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-ui text-sm text-text-secondary">
            Question {dialogue.currentIndex + 1} of {dialogue.questions.length}
          </span>
          {symbol && (
            <span className="font-mono text-sm text-text-tertiary">
              {symbol}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="bg-surface-secondary rounded-full h-2">
          <div 
            className="bg-interactive rounded-full h-2 transition-all duration-300"
            style={{ width: `${((dialogue.currentIndex + 1) / dialogue.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Question */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-lg">{getCategoryIcon(currentQuestion.category)}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-ui text-xs font-medium uppercase tracking-wide ${getCategoryColor(currentQuestion.category)}`}>
                {currentQuestion.category}
              </span>
              <span className="font-ui text-xs text-text-tertiary">
                Depth {currentQuestion.depth}
              </span>
            </div>
            <h3 className="font-ui text-lg text-text-primary leading-relaxed">
              {currentQuestion.text}
            </h3>
          </div>
        </div>

        {/* Follow-up Question */}
        {showFollowUp && currentQuestion.followUp && hasResponse && (
          <div className="ml-6 p-3 bg-surface-secondary rounded border-l-2 border-interactive">
            <p className="font-ui text-sm text-text-secondary italic">
              {currentQuestion.followUp}
            </p>
          </div>
        )}
      </div>

      {/* Response Area */}
      {!hasResponse ? (
        <div className="space-y-4">
          {!isContemplating ? (
            <>
              <textarea
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                placeholder="Take your time to reflect deeply on this question..."
                className="w-full h-32 p-4 bg-surface-secondary border border-card-border rounded-lg font-ui text-sm resize-none focus:outline-none focus:ring-2 focus:ring-interactive/50"
              />
              
              <div className="flex items-center justify-between">
                <button
                  onClick={startContemplation}
                  className="flex items-center gap-2 px-4 py-2 rounded border border-card-border hover:bg-surface-secondary transition-colors font-ui text-sm"
                >
                  <Pause className="w-4 h-4" />
                  Contemplate (30s)
                </button>
                
                <button
                  onClick={handleResponseSubmit}
                  disabled={!currentResponse.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-interactive text-interactive-foreground rounded hover:bg-interactive-hover transition-colors font-ui text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Submit Response</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-interactive/30 border-t-interactive rounded-full animate-spin mx-auto mb-4"></div>
              <h4 className="font-ui font-medium text-text-primary mb-2">
                Contemplation Period
              </h4>
              <p className="font-ui text-sm text-text-secondary">
                Sit with the question. Let your thoughts settle.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Previous Response */}
          <div className="p-4 bg-surface-secondary rounded border border-card-border">
            <h4 className="font-ui font-medium text-text-primary mb-2">Your Response:</h4>
            <p className="font-ui text-sm text-text-secondary leading-relaxed">
              {dialogue.userResponses[currentQuestion.id]}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-end">
            <button
              onClick={moveToNextQuestion}
              className="flex items-center gap-2 px-6 py-2 bg-interactive text-interactive-foreground rounded hover:bg-interactive-hover transition-colors font-ui text-sm"
            >
              <span>{isLastQuestion ? 'Continue Deeper' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Insights Panel */}
      {dialogue.insights.length > 0 && (
        <div className="mt-6 pt-6 border-t border-card-border">
          <h4 className="font-ui font-medium text-text-primary mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Emerging Insights
          </h4>
          <div className="space-y-2">
            {dialogue.insights.map((insight, index) => (
              <div key={index} className="p-3 bg-surface-secondary rounded border-l-2 border-interactive">
                <p className="font-ui text-sm text-text-secondary">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}