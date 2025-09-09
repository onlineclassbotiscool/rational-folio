import { PresentMomentDashboard } from "@/components/zen/core/PresentMomentDashboard";
import { BiasDetector } from "@/components/zen/core/BiasDetector";
import { SocraticQuestioner } from "@/components/zen/core/SocraticQuestioner";
import { useState } from "react";

const Index = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [activeTab, setActiveTab] = useState<'reality' | 'bias' | 'inquiry'>('reality');

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-card-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif text-text-primary">
                Zen-Rational AI
              </h1>
              <p className="font-ui text-sm text-text-secondary">
                Mindful approach to intelligent investing
              </p>
            </div>
            
            <div className="flex gap-1 bg-surface-secondary rounded-lg p-1">
              <button
                onClick={() => setActiveTab('reality')}
                className={`px-4 py-2 rounded font-ui text-sm transition-all ${
                  activeTab === 'reality' 
                    ? 'bg-interactive text-interactive-foreground' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Present Reality
              </button>
              <button
                onClick={() => setActiveTab('bias')}
                className={`px-4 py-2 rounded font-ui text-sm transition-all ${
                  activeTab === 'bias' 
                    ? 'bg-interactive text-interactive-foreground' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Bias Check
              </button>
              <button
                onClick={() => setActiveTab('inquiry')}
                className={`px-4 py-2 rounded font-ui text-sm transition-all ${
                  activeTab === 'inquiry' 
                    ? 'bg-interactive text-interactive-foreground' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Socratic Inquiry
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'reality' && <PresentMomentDashboard />}
        {activeTab === 'bias' && (
          <BiasDetector 
            symbol={selectedSymbol} 
            onBiasAcknowledged={(biasId) => console.log('Bias acknowledged:', biasId)}
          />
        )}
        {activeTab === 'inquiry' && (
          <SocraticQuestioner 
            symbol={selectedSymbol}
            onInsightGenerated={(insight) => console.log('Insight generated:', insight)}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
