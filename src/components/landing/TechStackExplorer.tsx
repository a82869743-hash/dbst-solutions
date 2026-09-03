import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Cpu, CheckCircle2, ArrowRight, Terminal, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TechNode {
  id: string;
  code: string;
  title: string;
  badge: string;
  badgeColor: string;
  date: string;
  shipTime: string;
  timeBoxLabel: string;
  timeBoxValue: string;
  desc: string;
  details: string[];
}

const leftNodes: TechNode[] = [
  {
    id: "tms",
    code: "TMS-TRUCKMATE",
    title: "Trimble TruckMate TMS Integration",
    badge: "TMS FLEET",
    badgeColor: "bg-accent-tint text-accent-deep",
    date: "Active Practice",
    shipTime: "4-8 weeks",
    timeBoxLabel: "DISPATCH SPEED",
    timeBoxValue: "Instant",
    desc: "Custom integrations, automated BOL extraction, and TMS upgrade consulting.",
    details: ["Real-time load dispatch", "Driver GPS tracking", "Automated rate validation"],
  },
  {
    id: "odoo",
    code: "ODOO-ERP",
    title: "Odoo ERP Enterprise Implementation",
    badge: "ERP SUITE",
    badgeColor: "bg-amber-100 text-amber-800",
    date: "Active Practice",
    shipTime: "12-20 weeks",
    timeBoxLabel: "ERP SYNC",
    timeBoxValue: "Real-Time",
    desc: "Unified ERP architecture covering manufacturing, inventory, accounting, and HR.",
    details: ["Manufacturing & inventory sync", "Automated invoicing & billing", "Multi-warehouse management"],
  },
  {
    id: "azure",
    code: "AZURE-CLOUD",
    title: "Microsoft Azure Cloud & SQL Migration",
    badge: "AZURE PARTNER",
    badgeColor: "bg-blue-100 text-blue-800",
    date: "Active Practice",
    shipTime: "4-8 weeks",
    timeBoxLabel: "DATA LOSS",
    timeBoxValue: "0 %",
    desc: "Migrating on-premise SQL Server and applications to Azure with high availability.",
    details: ["Zero data loss migration", "30-50% lower TCO", "Entra ID & M365 security"],
  },
  {
    id: "uipath",
    code: "UIPATH-AI",
    title: "UiPath RPA & OpenAI Automation",
    badge: "AI AUTOMATION",
    badgeColor: "bg-emerald-100 text-emerald-800",
    date: "Active Practice",
    shipTime: "4-6 weeks",
    timeBoxLabel: "TIME SAVINGS",
    timeBoxValue: "85 %",
    desc: "Intelligent robotic process automation and AI agents eliminating repetitive manual overhead.",
    details: ["24/7 autonomous bot operation", "OpenAI natural language processing", "Automated compliance auditing"],
  },
];

export const TechStackExplorer = () => {
  const [activeNode, setActiveNode] = useState<TechNode>(leftNodes[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  // GSAP ScrollTrigger Entrance & Laser Paths
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Entrance Animation
      if (diagramRef.current) {
        gsap.fromTo(
          diagramRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: diagramRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // 2. Continuous Dash Flow for Bezier Curves
      pathRefs.current.forEach((path) => {
        if (path) {
          gsap.to(path, {
            strokeDashoffset: -20,
            duration: 1.2,
            repeat: -1,
            ease: "none",
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-20 lg:py-28 bg-bg-base border-b border-border-subtle overflow-hidden selection:bg-accent-tint selection:text-accent-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Header */}
        <div className="text-left max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent-tint text-accent-deep border border-accent/25 text-xs font-mono font-bold uppercase tracking-wider shadow-flat">
            <Cpu className="w-4 h-4 text-accent" />
            <span>VERIFIED PARTNERS &amp; ENTERPRISE INTEGRATIONS</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-fg-default tracking-tight leading-tight">
            Supported Enterprise <span className="text-accent">Technologies &amp; Platforms</span>
          </h2>

          <p className="text-base sm:text-lg text-fg-dim font-body leading-relaxed">
            See how Trimble TruckMate, Odoo ERP, Microsoft Azure, and UiPath converge into scalable, automated business systems.
          </p>
        </div>

        {/* Spread-Style Bezier Flow Convergence Diagram Grid */}
        <div ref={diagramRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left font-mono">
          
          {/* LEFT STACK: 4 Systems Cards */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-bold text-fg-dimmer uppercase tracking-wider mb-2">
              CONNECTED ENTERPRISE SYSTEMS
            </div>

            {leftNodes.map((node) => {
              const isSelected = activeNode.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(node)}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer shadow-flat ${
                    isSelected
                      ? "bg-white border-accent shadow-floating ring-2 ring-accent/20 scale-[1.02]"
                      : "bg-white/80 border-border-subtle hover:border-accent/50 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-accent flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-accent" /> {node.code}
                    </span>
                    <span className="text-fg-dimmer font-normal">{node.date}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-fg-default tracking-tight">
                    {node.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t border-border-subtle/60">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${node.badgeColor}`}>
                      {node.badge}
                    </span>
                    <span className="text-fg-dim font-bold">{node.shipTime}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CENTER: SVG BEZIER FLOW CURVES */}
          <div className="hidden lg:block lg:col-span-1 relative h-[480px] w-full flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 480" fill="none">
              {/* 4 Curved Bezier Connecting Lines */}
              {[60, 180, 300, 420].map((yStart, idx) => (
                <path
                  key={idx}
                  ref={(el) => (pathRefs.current[idx] = el)}
                  d={`M 0 ${yStart} C 60 ${yStart}, 40 240, 100 240`}
                  stroke="#E8622E"
                  strokeWidth={activeNode.id === leftNodes[idx].id ? "2.5" : "1.5"}
                  strokeDasharray="6 4"
                  opacity={activeNode.id === leftNodes[idx].id ? "1" : "0.3"}
                />
              ))}
            </svg>
            <span className="absolute top-2 left-0 text-[9px] font-mono text-accent font-bold uppercase tracking-widest whitespace-nowrap bg-accent-tint px-2 py-0.5 rounded-full border border-accent/20">
              CONVERGENCE &rarr;
            </span>
          </div>

          {/* RIGHT: MAIN D-BST CORE CONVERGENCE FOCAL CARD */}
          <div className="lg:col-span-5 bg-white border-2 border-accent rounded-3xl p-8 sm:p-10 shadow-floating space-y-8 relative overflow-hidden">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-border-subtle pb-3">
                <span className="font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent" /> D-BST CORE ONTOLOGY ENGINE
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-accent text-white font-bold text-[10px]">
                  {activeNode.date}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-accent">
                  ACTIVE TARGET: [{activeNode.code}]
                </span>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-fg-default tracking-tight leading-tight">
                  {activeNode.title}
                </h3>
                <p className="text-sm text-fg-dim font-body leading-relaxed pt-1">
                  {activeNode.desc}
                </p>
              </div>

              {/* Big Metric Box (Spread Style: Time to Cause / Time to Sync) */}
              <div className="p-6 bg-[#FFF5F0] border border-accent/30 rounded-2xl space-y-2 text-center shadow-flat">
                <div className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                  {activeNode.timeBoxLabel}
                </div>
                <div className="font-display font-extrabold text-4xl sm:text-5xl text-accent tracking-tight">
                  {activeNode.timeBoxValue}
                </div>
              </div>

              {/* Specs Breakdown */}
              <div className="space-y-2 pt-2">
                <div className="text-[10px] font-mono font-bold text-fg-dimmer uppercase tracking-wider">
                  VERIFIED DEPLOYMENT CAPABILITIES
                </div>
                <div className="space-y-2">
                  {activeNode.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-body text-fg-default">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs">
              <span className="px-3 py-1 rounded-full bg-accent text-white font-bold text-[10px] uppercase tracking-wider">
                RECOMMENDED ARCHITECTURE
              </span>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-accent-deep transition-all shadow-flat"
              >
                <span>REQUEST SPECS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
