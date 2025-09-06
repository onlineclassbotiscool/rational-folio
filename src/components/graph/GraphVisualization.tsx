import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

interface Node {
  id: string;
  label: string;
  category: string;
  value: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number;
  fy?: number;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

const conceptData = {
  nodes: [
    { id: "rationality", label: "Rationality", category: "core", value: 100, x: 400, y: 200, vx: 0, vy: 0 },
    { id: "bayes", label: "Bayesian Thinking", category: "core", value: 90, x: 300, y: 150, vx: 0, vy: 0 },
    { id: "bias", label: "Cognitive Bias", category: "psychology", value: 85, x: 500, y: 150, vx: 0, vy: 0 },
    { id: "ai", label: "Artificial Intelligence", category: "technology", value: 95, x: 350, y: 300, vx: 0, vy: 0 },
    { id: "alignment", label: "AI Alignment", category: "technology", value: 80, x: 450, y: 350, vx: 0, vy: 0 },
    { id: "epistemology", label: "Epistemology", category: "philosophy", value: 75, x: 250, y: 250, vx: 0, vy: 0 },
    { id: "decision", label: "Decision Theory", category: "core", value: 70, x: 400, y: 100, vx: 0, vy: 0 },
    { id: "game", label: "Game Theory", category: "mathematics", value: 65, x: 550, y: 250, vx: 0, vy: 0 },
    { id: "prediction", label: "Prediction", category: "core", value: 60, x: 200, y: 200, vx: 0, vy: 0 },
    { id: "evidence", label: "Evidence", category: "core", value: 80, x: 300, y: 300, vx: 0, vy: 0 }
  ],
  edges: [
    { source: "rationality", target: "bayes", weight: 0.9 },
    { source: "rationality", target: "bias", weight: 0.8 },
    { source: "rationality", target: "decision", weight: 0.7 },
    { source: "bayes", target: "evidence", weight: 0.8 },
    { source: "bayes", target: "prediction", weight: 0.7 },
    { source: "ai", target: "alignment", weight: 0.9 },
    { source: "ai", target: "rationality", weight: 0.6 },
    { source: "decision", target: "game", weight: 0.8 },
    { source: "epistemology", target: "evidence", weight: 0.7 },
    { source: "bias", target: "decision", weight: 0.5 }
  ]
};

const categoryColors = {
  core: "#2c2c2c",
  psychology: "#10b981", 
  technology: "#3b82f6",
  philosophy: "#666666",
  mathematics: "#888888"
};

export const GraphVisualization = () => {
  const [nodes, setNodes] = useState<Node[]>(conceptData.nodes);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([30]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const updatePhysics = () => {
    if (!isPlaying) return;

    setNodes(prevNodes => {
      const newNodes = [...prevNodes];
      const alpha = speed[0] / 100 * 0.1;

      // Apply forces
      newNodes.forEach((node, i) => {
        if (node.fx !== undefined) {
          node.x = node.fx;
          node.y = node.fy!;
          return;
        }

        // Repulsion from other nodes
        newNodes.forEach((other, j) => {
          if (i === j) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 200 && distance > 0) {
            const force = 1000 / (distance * distance);
            node.vx += (dx / distance) * force * alpha;
            node.vy += (dy / distance) * force * alpha;
          }
        });

        // Attraction along edges
        conceptData.edges.forEach(edge => {
          if (edge.source === node.id) {
            const target = newNodes.find(n => n.id === edge.target);
            if (target) {
              const dx = target.x - node.x;
              const dy = target.y - node.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const targetDistance = 100;
              const force = (distance - targetDistance) * 0.1 * edge.weight;
              node.vx += (dx / distance) * force * alpha;
              node.vy += (dy / distance) * force * alpha;
            }
          }
          if (edge.target === node.id) {
            const source = newNodes.find(n => n.id === edge.source);
            if (source) {
              const dx = source.x - node.x;
              const dy = source.y - node.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const targetDistance = 100;
              const force = (distance - targetDistance) * 0.1 * edge.weight;
              node.vx += (dx / distance) * force * alpha;
              node.vy += (dy / distance) * force * alpha;
            }
          }
        });

        // Center gravity
        const centerX = 400;
        const centerY = 250;
        node.vx += (centerX - node.x) * 0.001 * alpha;
        node.vy += (centerY - node.y) * 0.001 * alpha;

        // Apply velocity
        node.vx *= 0.9; // damping
        node.vy *= 0.9;
        node.x += node.vx;
        node.y += node.vy;

        // Boundary constraints
        node.x = Math.max(30, Math.min(770, node.x));
        node.y = Math.max(30, Math.min(470, node.y));
      });

      return newNodes;
    });
  };

  useEffect(() => {
    const animate = () => {
      updatePhysics();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    if (isPlaying) {
      animate();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed]);

  const handleMouseDown = (event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setDraggedNode(node.id);
    const rect = (event.target as SVGElement).closest('svg')?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: event.clientX - rect.left - node.x,
        y: event.clientY - rect.top - node.y
      });
    }
    setSelectedNode(node);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!draggedNode) return;
    event.preventDefault();
    
    const rect = (event.target as SVGElement).closest('svg')?.getBoundingClientRect();
    if (rect) {
      const newX = event.clientX - rect.left - dragOffset.x;
      const newY = event.clientY - rect.top - dragOffset.y;
      
      setNodes(prev => prev.map(node => 
        node.id === draggedNode 
          ? { ...node, x: newX, y: newY, fx: newX, fy: newY, vx: 0, vy: 0 }
          : node
      ));
    }
  };

  const handleMouseUp = () => {
    if (draggedNode) {
      setNodes(prev => prev.map(node => 
        node.id === draggedNode 
          ? { ...node, fx: undefined, fy: undefined }
          : node
      ));
    }
    setDraggedNode(null);
  };

  const handleReset = () => {
    setNodes(conceptData.nodes.map(node => ({
      ...node,
      x: node.x + (Math.random() - 0.5) * 100,
      y: node.y + (Math.random() - 0.5) * 100,
      vx: 0,
      vy: 0,
      fx: undefined,
      fy: undefined
    })));
    setSelectedNode(null);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="p-6 border-b border-border">
        <h1 className="text-2xl font-serif text-text-primary">Conceptual Network</h1>
        <p className="text-sm text-text-secondary mt-1">
          Explore relationships between rationality concepts through force-directed visualization
        </p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-6">
          <div className="w-full h-full border border-border rounded-lg overflow-hidden bg-surface">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 500"
              className="w-full h-full cursor-move"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Edges */}
              {conceptData.edges.map((edge, i) => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;
                
                return (
                  <line
                    key={i}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke="hsl(var(--card-border))"
                    strokeWidth={Math.sqrt(edge.weight) * 2}
                    strokeOpacity={0.6}
                  />
                );
              })}
              
              {/* Nodes */}
              {nodes.map(node => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={Math.sqrt(node.value / 2)}
                    fill={categoryColors[node.category as keyof typeof categoryColors]}
                    stroke={selectedNode?.id === node.id ? "hsl(var(--interactive))" : "hsl(var(--background))"}
                    strokeWidth={selectedNode?.id === node.id ? 3 : 2}
                    className="cursor-pointer hover:stroke-interactive"
                    onMouseDown={(e) => handleMouseDown(e, node)}
                    onClick={() => setSelectedNode(node)}
                  />
                  {selectedNode?.id === node.id && (
                    <text
                      x={node.x}
                      y={node.y - Math.sqrt(node.value / 2) - 8}
                      textAnchor="middle"
                      className="text-xs fill-text-primary font-sans pointer-events-none"
                    >
                      {node.label}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </main>

        <aside className="w-80 p-6 border-l border-border bg-surface-secondary">
          <Card className="p-4 mb-4">
            <h3 className="font-medium text-text-primary mb-4">Simulation Controls</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Speed: {speed[0]}%
                </label>
                <Slider
                  value={speed}
                  onValueChange={setSpeed}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          {selectedNode && (
            <Card className="p-4 mb-4">
              <h3 className="font-medium text-text-primary mb-2">Selected Concept</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-text-secondary">Label:</span>
                  <span className="ml-2 text-text-primary">{selectedNode.label}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Category:</span>
                  <span className="ml-2 text-text-primary capitalize">{selectedNode.category}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Importance:</span>
                  <span className="ml-2 text-text-primary">{selectedNode.value}</span>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-4">
            <h3 className="font-medium text-text-primary mb-3">Categories</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(categoryColors).map(([category, color]) => (
                <div key={category} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full border border-card-border"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-text-primary capitalize">{category}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-xs text-text-secondary">
              <p>• Click nodes to select and view details</p>
              <p>• Drag nodes to reposition them</p>
              <p>• Use controls to start/stop simulation</p>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
};