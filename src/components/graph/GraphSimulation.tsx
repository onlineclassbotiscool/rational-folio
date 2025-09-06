import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  category: string;
  value: number;
}

interface Edge {
  source: string | Node;
  target: string | Node;
  weight: number;
}

const sampleData = {
  nodes: [
    { id: "rationality", label: "Rationality", category: "core", value: 100 },
    { id: "bayes", label: "Bayesian Thinking", category: "core", value: 90 },
    { id: "bias", label: "Cognitive Bias", category: "psychology", value: 85 },
    { id: "ai", label: "Artificial Intelligence", category: "technology", value: 95 },
    { id: "alignment", label: "AI Alignment", category: "technology", value: 80 },
    { id: "epistemology", label: "Epistemology", category: "philosophy", value: 75 },
    { id: "decision", label: "Decision Theory", category: "core", value: 70 },
    { id: "game", label: "Game Theory", category: "mathematics", value: 65 },
    { id: "prediction", label: "Prediction", category: "core", value: 60 },
    { id: "evidence", label: "Evidence", category: "core", value: 80 }
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
  core: "hsl(var(--text-primary))",
  psychology: "hsl(var(--market-positive))",
  technology: "hsl(var(--interactive))",
  philosophy: "hsl(var(--market-neutral))",
  mathematics: "hsl(var(--text-secondary))"
};

export const GraphSimulation = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<Node, Edge> | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState([50]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    svg.selectAll("*").remove();

    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create simulation
    const simulation = d3.forceSimulation<Node>(sampleData.nodes as Node[])
      .force("link", d3.forceLink<Node, Edge>(sampleData.edges)
        .id(d => d.id)
        .distance(d => 100 - d.weight * 50))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => Math.sqrt(d.value || 50) + 5));

    simulationRef.current = simulation;

    // Create edges
    const links = g.selectAll(".link")
      .data(sampleData.edges)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke", "hsl(var(--card-border))")
      .style("stroke-opacity", 0.6)
      .style("stroke-width", d => Math.sqrt(d.weight) * 2);

    // Create nodes
    const nodes = g.selectAll(".node")
      .data(sampleData.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", d => Math.sqrt(d.value))
      .style("fill", d => categoryColors[d.category as keyof typeof categoryColors])
      .style("stroke", "hsl(var(--background))")
      .style("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (event, d) => setSelectedNode(d))
      .on("mouseover", function(event, d) {
        d3.select(this).style("stroke-width", 3);
        
        // Show label on hover
        g.append("text")
          .attr("class", "node-label")
          .attr("x", d.x!)
          .attr("y", d.y! - Math.sqrt(d.value) - 5)
          .attr("text-anchor", "middle")
          .style("font-family", "Inter, sans-serif")
          .style("font-size", "12px")
          .style("fill", "hsl(var(--text-primary))")
          .style("pointer-events", "none")
          .text(d.label);
      })
      .on("mouseout", function() {
        d3.select(this).style("stroke-width", 2);
        g.selectAll(".node-label").remove();
      });

    // Add drag behavior
    const drag = d3.drag<SVGCircleElement, Node>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodes.call(drag);

    // Update positions on simulation tick
    simulation.on("tick", () => {
        links
        .attr("x1", d => (d.source as any).x!)
        .attr("y1", d => (d.source as any).y!)
        .attr("x2", d => (d.target as any).x!)
        .attr("y2", d => (d.target as any).y!);

      nodes
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);
    });

    return () => {
      simulation.stop();
    };
  }, []);

  useEffect(() => {
    if (simulationRef.current) {
      if (isPlaying) {
        simulationRef.current.alpha(0.3).restart();
      } else {
        simulationRef.current.stop();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (simulationRef.current) {
      const alpha = speed[0] / 100;
      simulationRef.current.alpha(alpha);
    }
  }, [speed]);

  const handleReset = () => {
    if (simulationRef.current) {
      simulationRef.current.nodes().forEach(node => {
        node.x = 400 + (Math.random() - 0.5) * 100;
        node.y = 300 + (Math.random() - 0.5) * 100;
        node.vx = 0;
        node.vy = 0;
      });
      simulationRef.current.alpha(1).restart();
    }
    setSelectedNode(null);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="p-6 border-b border-border">
        <h1 className="text-2xl font-serif text-text-primary">Graph Simulation</h1>
        <p className="text-sm text-text-secondary mt-1">Explore conceptual relationships through force-directed visualization</p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-6">
          <div className="w-full h-full border border-border rounded-lg overflow-hidden bg-surface">
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox="0 0 800 600"
              className="w-full h-full"
            />
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
            <Card className="p-4">
              <h3 className="font-medium text-text-primary mb-2">Selected Node</h3>
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
                  <span className="text-text-secondary">Value:</span>
                  <span className="ml-2 text-text-primary">{selectedNode.value}</span>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-4 mt-4">
            <h3 className="font-medium text-text-primary mb-2">Categories</h3>
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
          </Card>
        </aside>
      </div>
    </div>
  );
};