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
  { id: "n1", code: "TMS", label: "Trimble TruckMate", category: "Transportation", metric: "99.4% OCR Acc", angle: 0 },
  { id: "n2", code: "ERP", label: "Odoo ERP Suite", category: "Supply Chain", metric: "Unified ERP", angle: 45 },
  { id: "n3", code: "AZURE", label: "Microsoft Azure", category: "Cloud Partner", metric: "Zero Data Loss", angle: 90 },
  { id: "n4", code: "RPA", label: "UiPath Automation", category: "AI & RPA", metric: "85% Less Time", angle: 135 },
  { id: "n5", code: "AI", label: "OpenAI Integrations", category: "AI Agents", metric: "24/7 Availability", angle: 180 },
  { id: "n6", code: "GCP", label: "Google Cloud", category: "Cloud Platform", metric: "Enterprise Scale", angle: 225 },
  { id: "n7", code: "DATA", label: "Power BI & Analytics", category: "Data & BI", metric: "Real-Time Reports", angle: 270 },
  { id: "n8", code: "ML", label: "TensorFlow & Python", category: "Predictive ML", metric: "60% Less Downtime", angle: 315 },
];

const outerAgents = [
  { name: "TRANSPORTATION", icon: Truck, color: "text-accent", angle: 0 },
  { name: "MANUFACTURING", icon: Factory, color: "text-amber-600", angle: 60 },
  { name: "FINANCIAL", icon: CreditCard, color: "text-blue-600", angle: 120 },
  { name: "CONSTRUCTION", icon: Building2, color: "text-orange-600", angle: 180 },
  { name: "RETAIL", icon: ShoppingBag, color: "text-emerald-600", angle: 240 },
  { name: "SUSTAINABLE ENERGY", icon: Zap, color: "text-yellow-600", angle: 300 },
];

export const DbstTopologySection = () => {
  const [activeNode, setActiveNode] = useState<TopologyNode>(innerNodes[0]);
  const [rotationOffset, setRotationOffset] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const coreHexRef = useRef<HTMLDivElement>(null);

  // GSAP Smooth Continuous Upright Orbiting Animation
  useEffect(() => {
    if (!sectionRef.current) return;

    let anim: gsap.core.Tween;
    const ctx = gsap.context(() => {
      // Continuous Orbit Angle Advancement
      const rotObj = { angle: 0 };
      anim = gsap.to(rotObj, {
        angle: 360,
        duration: 50,
        repeat: -1,
        ease: "none",
        onUpdate: () => {
          setRotationOffset(rotObj.angle);
        },
      });

      // Core Hexagon Soft Pulse
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
      if (anim) anim.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-bg-base border-b border-border-subtle overflow-hidden relative selection:bg-accent-tint selection:text-accent-deep">
      
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
              <span>D-BST PRECISION ONTOLOGY</span>
            </div>

            {/* Headline */}
            <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-fg-default tracking-tight leading-[1.06]">
              Seven complex industries turn into <span className="text-accent">one unified truth.</span>
            </h2>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-fg-dim leading-relaxed font-body max-w-xl">
              Connect legacy ERPs, SAP S/4HANA, freight telematics, and AI agents into one single source of truth. No reconciliation. No data drift. Production SLAs guaranteed.
            </p>

            {/* Active Node Detail Card */}
            <div className="p-4 bg-bg-surface border border-accent/30 rounded-xl space-y-2 font-mono text-xs shadow-flat">
              <div className="flex items-center justify-between text-[11px] text-fg-dim border-b border-border-subtle pb-1.5">
                <span className="font-bold text-accent flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-accent" /> [{activeNode.code}] ONTOLOGY NODE
                </span>
                <span className="text-fg-default font-bold">{activeNode.metric}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-fg-default text-sm pt-1">
                <span>{activeNode.label}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-accent-tint text-accent-deep">{activeNode.category}</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-accent text-white font-bold text-sm hover:bg-accent-deep transition-all shadow-raised hover:shadow-floating hover:scale-105 active:scale-95"
              >
                <span>EXPLORE ONTOLOGY BLUEPRINTS</span>
                <ArrowRight className="w-4 h-4" />
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
                className="relative z-30 w-28 h-28 sm:w-36 sm:h-36 bg-accent-tint/90 backdrop-blur-md border-2 border-accent/50 shadow-[0_0_30px_rgba(232,98,46,0.15)] flex flex-col items-center justify-center text-center text-accent-deep cursor-pointer"
                style={{
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              >
                <Cpu className="w-5 h-5 text-accent animate-pulse mb-1" />
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest leading-tight">
                  D-BST CORE
                </span>
                <span className="text-[9px] font-mono text-fg-dim font-bold mt-0.5">
                  ONTOLOGY
                </span>
              </div>

              {/* Inner Circle Nodes (Radius: 135px) */}
              {innerNodes.map((node) => {
                const rad = (node.angle * Math.PI) / 180;
                const distance = window.innerWidth < 640 ? 110 : 135;
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
                    className={`absolute z-40 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono cursor-pointer transition-all shadow-flat flex items-center gap-1.5 backdrop-blur-md ${
                      isSelected
                        ? "bg-accent text-white border-accent scale-110 shadow-floating"
                        : "bg-white/95 border-border-subtle text-fg-default hover:border-accent hover:text-accent hover:scale-105"
                    }`}
                  >
                    <span className="font-extrabold text-[9px] px-1 py-0.5 rounded bg-accent-tint text-accent-deep">
                      {node.code}
                    </span>
                    <span className="font-bold text-[10px] hidden sm:inline">{node.label}</span>
                  </div>
                );
              })}

              {/* Outer Orbiting Industry Badges (Radius: 235px - ZERO Overlap with Inner Ring) */}
              {outerAgents.map((ag, idx) => {
                const totalAngle = ag.angle + rotationOffset;
                const rad = (totalAngle * Math.PI) / 180;
                const distance = window.innerWidth < 640 ? 180 : 235;
                const x = Math.cos(rad) * distance;
                const y = Math.sin(rad) * distance;
                const IconComponent = ag.icon;

                return (
                  <div
                    key={idx}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    className="absolute z-50 flex items-center gap-1.5 bg-white/95 border border-border-subtle hover:border-accent shadow-flat px-3 py-1.5 rounded-full text-xs font-mono backdrop-blur-md transition-shadow"
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${ag.color}`} />
                    <span className="font-bold text-[10px] text-fg-default tracking-wider">
                      {ag.name}
                    </span>
                  </div>
                );
              })}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
