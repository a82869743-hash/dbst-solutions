import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, Cpu, GitBranch, ArrowRight, Activity, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TicketItem {
  id: string;
  title: string;
  match: string;
  status: "matched" | "escalated";
  fix: string;
  nodeTraceKey: number;
}

const ticketQueue: TicketItem[] = [
  {
    id: "DEP-01",
    title: "TruckMate TMS Fleet Upgrade & BOL Ingestion",
    match: "Verified Partner Deployment",
    status: "matched",
    fix: "Automated BOL parsing & route optimization applied",
    nodeTraceKey: 0,
  },
  {
    id: "DEP-02",
    title: "Odoo ERP Implementation & Inventory Sync",
    match: "Verified Client Deployment",
    status: "matched",
    fix: "Unified manufacturing, inventory, and accounting sync",
    nodeTraceKey: 1,
  },
  {
    id: "DEP-03",
    title: "Predictive Maintenance IoT Telemetry Hub",
    match: "Verified Client Deployment",
    status: "matched",
    fix: "Real-time vibration sensor monitoring & early warnings",
    nodeTraceKey: 2,
  },
];

interface TraceNode {
  code: string;
  label: string;
  sub: string;
  diagnosis: string;
}

const traceNodes: TraceNode[] = [
  {
    code: "TRUCK",
    label: "TMS Dispatch",
    sub: "TruckMate Sync",
    diagnosis: "Automated BOL ingestion & route dispatch connector eliminating manual paperwork.",
  },
  {
    code: "ODOO",
    label: "ERP Workflow",
    sub: "Odoo Integration",
    diagnosis: "Synchronized inventory, order processing, and supplier accounting across divisions.",
  },
  {
    code: "AZURE",
    label: "Cloud Infra",
    sub: "Azure SQL Migration",
    diagnosis: "Modernized SQL Server database with zero data loss and automated backups.",
  },
  {
    code: "RPA",
    label: "Automation",
    sub: "UiPath & OpenAI",
    diagnosis: "Intelligent robotic process automation cutting administrative overhead by 85%.",
  },
];

export const DbstProductFlowSection = () => {
  const [selectedTicket, setSelectedTicket] = useState<TicketItem>(ticketQueue[0]);
  const [activeNodeIdx, setActiveNodeIdx] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const flowCardsRef = useRef<HTMLDivElement>(null);
  const arrowDashRef = useRef<SVGPathElement>(null);

  // GSAP ScrollTrigger & Dash Laser Flow
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance Animation
      if (flowCardsRef.current) {
        gsap.fromTo(
          flowCardsRef.current.children,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: flowCardsRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Continuous Dashed Laser Line Flow
      if (arrowDashRef.current) {
        gsap.to(arrowDashRef.current, {
          strokeDashoffset: -20,
          duration: 1,
          repeat: -1,
          ease: "none",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleTicketClick = (tck: TicketItem) => {
    setSelectedTicket(tck);
    setActiveNodeIdx(tck.nodeTraceKey);
  };

  return (
    <section ref={containerRef} className="py-20 lg:py-28 bg-bg-surface border-b border-border-subtle overflow-hidden relative selection:bg-accent-tint selection:text-accent-deep">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent-tint text-accent-deep border border-accent/25 text-xs font-mono font-bold uppercase tracking-wider shadow-flat">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <GitBranch className="w-3.5 h-3.5 text-accent" />
            <span>ENTERPRISE DEPLOYMENT ARCHITECTURE</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-fg-default tracking-tight leading-tight">
            Proven Solutions in <span className="text-accent">Production</span>
          </h2>

          <p className="text-base sm:text-lg text-fg-dim font-body max-w-2xl mx-auto">
            Explore how D-BST bridges legacy systems, automated document processing, and cloud ERP workflows with verified operational reliability.
          </p>
        </div>

        {/* Spread-Style Ultra-Clean Dual Card Product Flow Layout */}
        <div ref={flowCardsRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT CARD: TICKET & INCIDENT ANALYZER (Service / Ops Desk) */}
          <div className="lg:col-span-5 bg-white border border-border-subtle rounded-3xl p-6 sm:p-10 shadow-floating space-y-6 text-left flex flex-col justify-between min-h-[460px]">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between font-mono text-xs text-fg-dim border-b border-border-subtle pb-3">
                <span className="font-bold text-accent uppercase tracking-wider">
                  OPERATIONS &bull; SERVICE DESK
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-accent-tint text-accent-deep font-bold text-[10px]">
                  AI TRIAGE
                </span>
              </div>

              {/* Light Grey Ticket Queue Box */}
              <div className="p-4 bg-[#F5F4F0] border border-border-subtle rounded-2xl space-y-3 font-mono text-xs shadow-flat">
                <div className="text-[10px] text-fg-dimmer font-bold uppercase tracking-wider">
                  LIVE INCIDENT QUEUE
                </div>

                {ticketQueue.map((tck) => {
                  const isSelected = selectedTicket.id === tck.id;
                  return (
                    <div
                      key={tck.id}
                      onClick={() => handleTicketClick(tck)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-white border-accent text-accent-deep shadow-flat ring-2 ring-accent/20"
                          : "bg-white/80 border-border-subtle text-fg-default hover:border-accent/40"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="truncate pr-2">{tck.id}: {tck.title}</span>
                        {tck.status === "matched" ? (
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-fg-dim mt-2 pt-1 border-t border-border-subtle/50 gap-1">
                        <span className="font-bold text-accent">{tck.match}</span>
                        <span className="font-bold text-fg-default truncate">{tck.fix}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Left Card Text Content */}
            <div className="space-y-2 pt-2">
              <h3 className="font-display font-bold text-2xl text-fg-default tracking-tight">
                D-BST Support &amp; Incident Analyzer
              </h3>
              <p className="text-xs sm:text-sm text-fg-dim leading-relaxed font-body">
                Automated incident triage, AI similarity matching, and instant resolution recommendations. Built for operations desks to resolve 85% of support tickets under 60 seconds.
              </p>
            </div>

          </div>

          {/* CENTER FLOW CONNECTING ARROWS (Spread Style Bidirectional Escalation) */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-4 py-4 lg:py-0 font-mono text-[10px]">
            
            {/* Top Dashed Orange Arrow */}
            <div className="w-full flex flex-col items-center space-y-1">
              <span className="text-accent font-bold tracking-wider uppercase text-center px-2">
                UNSEEN PATTERNS ESCALATE &rarr;
              </span>
              <svg width="100%" height="16" viewBox="0 0 120 16" fill="none" className="max-w-[140px]">
                <path
                  ref={arrowDashRef}
                  d="M 5 8 L 115 8"
                  stroke="#E8622E"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                <polygon points="115,4 120,8 115,12" fill="#E8622E" />
              </svg>
            </div>

            {/* Bottom Solid Grey Arrow */}
            <div className="w-full flex flex-col items-center space-y-1 pt-2">
              <svg width="100%" height="16" viewBox="0 0 120 16" fill="none" className="max-w-[140px]">
                <path
                  d="M 115 8 L 5 8"
                  stroke="#A1A1AA"
                  strokeWidth="1.5"
                />
                <polygon points="5,4 0,8 5,12" fill="#A1A1AA" />
              </svg>
              <span className="text-fg-dimmer font-semibold tracking-wider uppercase text-center px-2">
                &larr; FIXES UPDATE VAULT
              </span>
            </div>

          </div>

          {/* RIGHT CARD: ROOT CAUSE ERROR INSPECTOR (Engineering & DevOps) */}
          <div className="lg:col-span-5 bg-white border border-border-subtle rounded-3xl p-6 sm:p-10 shadow-floating space-y-6 text-left flex flex-col justify-between min-h-[460px]">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between font-mono text-xs text-fg-dim border-b border-border-subtle pb-3">
                <span className="font-bold text-fg-default uppercase tracking-wider">
                  ENGINEERING &bull; DEVOPS
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  ROOT CAUSE TRACE
                </span>
              </div>

              {/* Light Grey Node Map Box */}
              <div className="p-5 bg-[#F5F4F0] border border-border-subtle rounded-2xl space-y-4 font-mono text-xs shadow-flat flex flex-col items-center justify-center min-h-[220px]">
                
                {/* 4 Interactive Nodes Chain */}
                <div className="relative w-full flex items-center justify-between max-w-xs">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-accent/30 -translate-y-1/2 z-0" />

                  {traceNodes.map((node, idx) => {
                    const isNodeActive = activeNodeIdx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveNodeIdx(idx)}
                        className="relative z-10 flex flex-col items-center space-y-1.5 cursor-pointer"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isNodeActive
                              ? "bg-accent text-white shadow-floating scale-110 ring-4 ring-accent/20"
                              : "bg-white border-2 border-accent/40 text-fg-default shadow-flat hover:scale-105"
                          }`}
                        >
                          {node.code}
                        </div>
                        <span className="text-[9px] font-bold text-fg-default">{node.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Dynamic Root Cause Readout */}
                <div className="w-full p-3 bg-white border border-accent/30 rounded-xl text-left text-[11px] space-y-1 shadow-flat">
                  <div className="font-bold text-accent-deep flex items-center justify-between border-b border-border-subtle/60 pb-1">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-accent" /> [{traceNodes[activeNodeIdx].code}] DIAGNOSIS
                    </span>
                    <span className="text-[9px] font-bold text-fg-dim">{traceNodes[activeNodeIdx].sub}</span>
                  </div>
                  <p className="text-fg-default font-body text-xs pt-1 leading-relaxed">
                    {traceNodes[activeNodeIdx].diagnosis}
                  </p>
                </div>

              </div>
            </div>

            {/* Right Card Text Content */}
            <div className="space-y-2 pt-2">
              <h3 className="font-display font-bold text-2xl text-fg-default tracking-tight">
                D-BST Root Cause Error Inspector
              </h3>
              <p className="text-xs sm:text-sm text-fg-dim leading-relaxed font-body">
                Deep telemetry cluster tracing through symptom, microservice function, signal anomaly, and root cause. Generates permanent architecture fixes that update your central knowledge vault.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
