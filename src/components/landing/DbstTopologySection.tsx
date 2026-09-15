import { useEffect, useRef, useState } from "react";
import { Cpu, Terminal, Activity, ArrowRight, Truck, Factory, CreditCard, Building2, ShoppingBag, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";

interface TopologyNode {
  id: string;
  code: string;
  label: string;
  category: string;
  metric: string;
  angle: number;
}

const innerNodes: TopologyNode[] = [
  { id: "n1", code: "AI", label: "AI Engineering", category: "Capability", metric: "Agentic Workflows", angle: 0 },
  { id: "n2", code: "ARCH", label: "Solution Architecture", category: "Capability", metric: "Target-State Design", angle: 60 },
  { id: "n3", code: "INT", label: "System Integration", category: "Capability", metric: "API & Connectors", angle: 120 },
  { id: "n4", code: "DATA", label: "Data & Analytics", category: "Capability", metric: "Trusted BI Models", angle: 180 },
  { id: "n5", code: "APP", label: "Custom Software", category: "Capability", metric: "Operational Software", angle: 240 },
  { id: "n6", code: "TRANS", label: "Digital Transformation", category: "Capability", metric: "Process & Strategy", angle: 300 },
];

const outerAgents = [
  { name: "TRANSPORT & LOGISTICS", icon: Truck, color: "text-accent", angle: 0, isPrimary: true },
  { name: "RETAIL & SUPPLY CHAIN", icon: ShoppingBag, color: "text-accent", angle: 60, isPrimary: true },
  { name: "MANUFACTURING", icon: Factory, color: "text-amber-600", angle: 120, isPrimary: false },
  { name: "CONSTRUCTION", icon: Building2, color: "text-orange-600", angle: 180, isPrimary: false },
  { name: "FINANCIAL SERVICES", icon: CreditCard, color: "text-blue-600", angle: 240, isPrimary: false },
  { name: "SUSTAINABLE ENERGY", icon: Zap, color: "text-yellow-600", angle: 300, isPrimary: false },
];

export const DbstTopologySection = () => {
  const [activeNode, setActiveNode] = useState<TopologyNode>(innerNodes[0]);

  const sectionRef = useRef<HTMLDivElement>(null);
  const coreHexRef = useRef<HTMLDivElement>(null);

  // Soft Hexagon Core Pulse
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (coreHexRef.current) {
        gsap.to(coreHexRef.current, {
          scale: 1.05,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-bg-base border-b border-border-subtle overflow-hidden relative selection:bg-accent-tint selection:text-accent-deep">
      
      {/* Background Subtle Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E3E1DC 1px, transparent 1px),
            linear-gradient(to bottom, #E3E1DC 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "center center",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column (50% Width): Spread-Style Text Block */}
          <div className="lg:col-span-6 space-y-7 text-left">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent-tint text-accent-deep border border-accent/25 text-xs font-mono font-bold uppercase tracking-wider shadow-flat">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <Terminal className="w-3.5 h-3.5 text-accent" />
              <span>INDUSTRY EXPERIENCE</span>
            </div>

            {/* Headline */}
            <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-fg-default tracking-tight leading-[1.06]">
              Built Around How Your <span className="text-accent">Industry Works</span>
            </h2>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-fg-dim leading-relaxed font-body max-w-xl">
              We combine industry knowledge with strategy, architecture and engineering to design solutions that fit real workflows, connect existing systems and support sustainable growth.
            </p>

            {/* Active Node Detail Card with Tactile Bezel */}
            <div className="p-4 bg-white border border-accent/40 rounded-xl space-y-2 font-mono text-xs shadow-flat card-bezel">
              <div className="flex items-center justify-between text-xs text-fg-dim border-b border-border-subtle pb-1.5">
                <span className="font-bold text-accent flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-accent" /> [{activeNode.code}] CORE CAPABILITY
                </span>
                <span className="text-fg-default font-bold">{activeNode.metric}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-fg-default text-[14.5px] pt-1">
                <span>{activeNode.label}</span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-accent-tint text-accent-deep font-bold">{activeNode.category}</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/use-cases"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-white font-bold text-sm hover:bg-accent-deep transition-all shadow-raised hover:shadow-floating hover:scale-[1.02] active:scale-[0.98] group"
              >
                <span>EXPLORE INDUSTRY SOLUTIONS</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>

          </div>

          {/* Right Column (50% Width): Spacious Spread-Style Radial Topology Diagram */}
          <div className="lg:col-span-6 flex justify-center overflow-visible">
            
            <div className="relative w-[440px] sm:w-[540px] aspect-square flex items-center justify-center pointer-events-auto">
              
              {/* Concentric Radial Background Circles */}
              <div className="absolute inset-0 rounded-full border border-border-subtle/80 opacity-60" />
              <div className="absolute inset-10 sm:inset-14 rounded-full border border-accent/20 border-dashed" />
              <div className="absolute inset-24 sm:inset-32 rounded-full border border-accent/30" />
              <div className="absolute inset-36 sm:inset-44 rounded-full border border-accent/40" />

              {/* Connecting Vector Spokes SVG radiating from center */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 540 540">
                {innerNodes.map((node) => {
                  const rad = (node.angle * Math.PI) / 180;
                  const x2 = 270 + Math.cos(rad) * 135;
                  const y2 = 270 + Math.sin(rad) * 135;
                  return (
                    <line
                      key={node.id}
                      x1="270"
                      y1="270"
                      x2={x2}
                      y2={y2}
                      stroke="#E8622E"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      opacity="0.35"
                    />
                  );
                })}
              </svg>

              {/* Delicate Spread-Style Light Hexagon Core */}
              <div
                ref={coreHexRef}
                className="relative z-30 w-32 h-32 sm:w-40 sm:h-40 bg-accent-tint/90 backdrop-blur-md border-2 border-accent/50 shadow-[0_0_30px_rgba(232,98,46,0.15)] flex flex-col items-center justify-center text-center text-accent-deep cursor-pointer px-2"
                style={{
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              >
                <Cpu className="w-5 h-5 text-accent animate-pulse mb-1" />
                <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider leading-tight">
                  D-BST SOLUTIONS
                </span>
                <span className="text-[9px] font-mono text-fg-dim font-bold mt-1">
                  Industry-Led Delivery
                </span>
              </div>

              {/* Smooth GPU Hardware Orbiting Styles */}
              <style>{`
                @keyframes dbst-orbit-cw {
                  from {
                    transform: rotate(0deg);
                  }
                  to {
                    transform: rotate(360deg);
                  }
                }
                @keyframes dbst-orbit-ccw {
                  from {
                    transform: rotate(0deg);
                  }
                  to {
                    transform: rotate(-360deg);
                  }
                }
                .dbst-orbit-ring {
                  animation: dbst-orbit-cw 55s linear infinite;
                  will-change: transform;
                  transform-origin: center center;
                }
                .dbst-orbit-ring:hover,
                .dbst-orbit-ring:hover .dbst-orbit-item {
                  animation-play-state: paused;
                }
                .dbst-orbit-item {
                  animation: dbst-orbit-ccw 55s linear infinite;
                  will-change: transform;
                  transform-origin: center center;
                }
              `}</style>

              {/* Inner Circle Nodes (Radius: 135px) */}
              {innerNodes.map((node) => {
                const rad = (node.angle * Math.PI) / 180;
                const distance = 135;
                const x = Math.cos(rad) * distance;
                const y = Math.sin(rad) * distance;
                const isSelected = activeNode.id === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveNode(node)}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    className={`absolute z-40 px-2.5 py-1.5 rounded-lg border text-xs font-mono cursor-pointer transition-transform shadow-flat flex items-center gap-1.5 backdrop-blur-md select-none ${
                      isSelected
                        ? "bg-accent text-white border-accent scale-110 shadow-floating ring-2 ring-accent/30"
                        : "bg-white/95 border-border-subtle text-fg-default hover:border-accent hover:text-accent hover:scale-105"
                    }`}
                  >
                    <span className={`font-extrabold text-[11px] px-1 py-0.5 rounded ${isSelected ? "bg-white text-accent font-bold" : "bg-accent-tint text-accent-deep"}`}>
                      {node.code}
                    </span>
                    <span className="font-bold text-xs hidden sm:inline whitespace-nowrap">{node.label}</span>
                  </div>
                );
              })}

              {/* Outer Orbiting Industry Badges (100% GPU-Accelerated, Zero-Lag Compositor Orbit) */}
              <div className="dbst-orbit-ring absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center">
                {outerAgents.map((ag, idx) => {
                  const rad = (ag.angle * Math.PI) / 180;
                  const distance = 235;
                  const x = Math.cos(rad) * distance;
                  const y = Math.sin(rad) * distance;
                  const IconComponent = ag.icon;

                  return (
                    <div
                      key={idx}
                      className="absolute pointer-events-auto"
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                    >
                      <div className="dbst-orbit-item">
                        <div
                          className={`flex items-center gap-1.5 shadow-flat px-3 py-1.5 rounded-full text-xs font-mono backdrop-blur-md cursor-pointer transition-transform hover:scale-110 select-none ${
                            ag.isPrimary
                              ? "bg-white border-2 border-accent shadow-raised ring-2 ring-accent/15"
                              : "bg-white/95 border border-border-subtle hover:border-accent"
                          }`}
                        >
                          <IconComponent className={`w-3.5 h-3.5 ${ag.color}`} />
                          <span
                            className={`font-bold text-[11.5px] tracking-wider whitespace-nowrap ${
                              ag.isPrimary ? "text-accent-deep" : "text-fg-default"
                            }`}
                          >
                            {ag.name}
                          </span>
                          {ag.isPrimary && (
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
