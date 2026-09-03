import { useState, useEffect, useRef } from "react";
import { Database, Cpu, Rocket, ArrowRight, CheckCircle2, Terminal, Activity, Layers, ShieldCheck, Sparkles, Server, Smartphone, Zap, Sliders, Play, RefreshCw, BarChart3, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StepItem {
  number: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  mobileScreenTitle: string;
}

const stepsData: StepItem[] = [
  {
    number: "STEP 01",
    title: "Discovery & Operational Assessment",
    tagline: "Identify operational bottlenecks and automation opportunities",
    description: "Analyze manual data entry points, legacy TMS/ERP workflows, and operational friction to establish a measurable digital transformation baseline.",
    features: [
      "Legacy TMS & ERP workflow auditing",
      "Bottleneck & manual overhead analysis",
      "Strategic roadmap & ROI scoping",
    ],
    mobileScreenTitle: "Discovery Scope",
  },
  {
    number: "STEP 02",
    title: "Architecture & Integration Design",
    tagline: "Engineer custom bridges across TMS, ERP, and cloud",
    description: "Architect bi-directional data connectors, RPA bot workflows, and cloud migrations bridging TruckMate, Odoo, and Microsoft Azure.",
    features: [
      "Trimble TruckMate & Odoo ERP mapping",
      "UiPath & OpenAI workflow blueprints",
      "Azure cloud infrastructure & SSO design",
    ],
    mobileScreenTitle: "Architecture Spec",
  },
  {
    number: "STEP 03",
    title: "Iterative Implementation & Deployment",
    tagline: "Agile deployment with zero business downtime",
    description: "Deploy custom web/mobile applications, automated rate validation, and predictive maintenance models in rapid, high-visibility milestones.",
    features: [
      "Automated bill-of-lading document processing",
      "Custom software & API integration delivery",
      "Live staff training & change management",
    ],
    mobileScreenTitle: "Deploy Systems",
  },
  {
    number: "STEP 04",
    title: "24/7 Follow-the-Sun Support",
    tagline: "Continuous monitoring across 4 global hubs",
    description: "Distributed engineering coverage across Australia, India, Spain, and Singapore ensuring continuous monitoring, rapid incident support, and zero timezone headaches.",
    features: [
      "Round-the-clock technical coverage",
      "Proactive system optimization & tuning",
      "Dedicated SLA response guarantees",
    ],
    mobileScreenTitle: "Global Support",
  },
];

export const DbstWorkflowSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ragActive, setRagActive] = useState(true);
  const [kafkaActive, setKafkaActive] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const stepCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const phoneScreenRef = useRef<HTMLDivElement>(null);
  const phoneFrameRef = useRef<HTMLDivElement>(null);

  // Bounds-safe current active step
  const safeActiveStep = Math.min(Math.max(0, activeStep), stepsData.length - 1);
  const currentStepData = stepsData[safeActiveStep];

  // Mouse 3D Phone Tilt Physics
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  // GSAP Step Change Trigger
  const handleStepClick = (index: number) => {
    const validIndex = Math.min(Math.max(0, index), stepsData.length - 1);
    setActiveStep(validIndex);
    if (phoneScreenRef.current) {
      gsap.fromTo(
        phoneScreenRef.current,
        { scale: 0.94, opacity: 0.4, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.4)" }
      );
    }
  };

  // GSAP ScrollTrigger strictly attached to individual step cards only (NOT CTA container)
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      stepCardRefs.current.forEach((card, index) => {
        if (!card) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top 65%",
          end: "bottom 65%",
          onEnter: () => handleStepClick(index),
          onEnterBack: () => handleStepClick(index),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="py-20 lg:py-32 bg-gradient-to-b from-[#FFFDFB] via-[#FAF6F0] to-[#F5EFF6] border-b border-border-subtle overflow-hidden relative selection:bg-accent-tint selection:text-accent-deep"
    >
      
      {/* Background Volumetric Glow Orbs */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-accent/12 via-amber-400/8 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-accent/10 via-amber-300/5 to-transparent blur-[140px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 text-accent-deep border border-accent/25 text-xs font-mono font-bold uppercase tracking-wider shadow-flat backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <Smartphone className="w-3.5 h-3.5 text-accent" />
            <span>Four-Step Strategic Transformation</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-fg-default tracking-tight leading-tight">
            From Operational Bottlenecks to <span className="text-accent">Scalable Growth</span>
          </h2>

          <p className="text-base sm:text-lg text-fg-dim font-body max-w-2xl mx-auto">
            Our proven four-step methodology combines market analysis, digital transformation roadmapping, and 24/7 follow-the-sun support.
          </p>
        </div>

        {/* Milkshake-Style Interactive 3D Phone Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: 3D Interactive iPhone 15 Pro Device Frame (Milkshake Style) */}
          <div className="lg:col-span-5 flex justify-center lg:sticky lg:top-24">
            
            <div
              ref={phoneFrameRef}
              className="relative w-[310px] sm:w-[340px] h-[640px] rounded-[52px] bg-zinc-950 p-3.5 shadow-[0_30px_90px_rgba(20,24,31,0.3)] border-[5px] border-zinc-800 flex flex-col justify-between overflow-hidden cursor-pointer"
              style={{
                transform: `perspective(1000px) rotateX(${mousePos.y * -10}deg) rotateY(${mousePos.x * 10}deg)`,
                transition: "transform 0.15s ease-out",
              }}
            >
              
              {/* Glass Glare Reflective Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none z-40" />

              {/* iPhone Dynamic Island Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 w-28 h-6 bg-black rounded-full flex items-center justify-between px-3 shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700" />
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-mono text-zinc-400">D-BST</span>
                </div>
              </div>

              {/* Inside iPhone Screen */}
              <div className="w-full h-full bg-bg-base rounded-[42px] pt-12 pb-6 px-4 flex flex-col justify-between overflow-hidden relative font-mono text-left">
                
                {/* Mobile Header Bar */}
                <div className="flex items-center justify-between text-[11px] font-bold text-fg-default border-b border-border-subtle pb-2.5">
                  <span className="text-accent font-extrabold text-xs tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                    D-BST MOBILE
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent-tint text-accent-deep font-extrabold uppercase tracking-wider">
                    {currentStepData.mobileScreenTitle}
                  </span>
                </div>

                {/* Animated Mobile Screen Content Container */}
                <div ref={phoneScreenRef} className="flex-1 my-3 flex flex-col justify-between space-y-3">
                  
                  {/* SCREEN STATE 01: Pick/Select Ingestion Source */}
                  {safeActiveStep === 0 && (
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-fg-dim font-bold uppercase tracking-wider">
                        <span>DATA INGESTION PIPELINES</span>
                        <span className="text-emerald-600 font-extrabold">ACTIVE</span>
                      </div>

                      {/* Card 1 */}
                      <div className="p-3 bg-accent-tint border-2 border-accent rounded-xl space-y-1.5 shadow-flat transition-transform hover:scale-[1.02]">
                        <div className="flex items-center justify-between font-bold text-accent-deep">
                          <span className="flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-accent" /> TruckMate TMS
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 bg-accent text-white font-bold rounded">Live OCR</span>
                        </div>
                        <p className="text-[10px] text-fg-dim leading-snug">
                          Automated BOL parsing &amp; route dispatch active.
                        </p>
                        <div className="w-full bg-accent/20 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-accent h-full w-[94%] animate-pulse" />
                        </div>
                      </div>

                      {/* Card 2 */}
                      <div className="p-3 bg-white border border-border-subtle rounded-xl space-y-1.5 shadow-flat transition-transform hover:scale-[1.02]">
                        <div className="flex items-center justify-between font-bold text-fg-default">
                          <span className="flex items-center gap-1.5">
                            <Database className="w-3.5 h-3.5 text-blue-600" /> Odoo ERP Suite
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">Active Sync</span>
                        </div>
                        <p className="text-[10px] text-fg-dim leading-snug">
                          Manufacturing, inventory &amp; accounting workflows synced.
                        </p>
                      </div>

                      {/* Card 3 */}
                      <div className="p-3 bg-white border border-border-subtle rounded-xl space-y-1.5 shadow-flat transition-transform hover:scale-[1.02]">
                        <div className="flex items-center justify-between font-bold text-fg-default">
                          <span className="flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-amber-600" /> Microsoft Azure SQL
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-800 font-bold rounded">Cloud Infra</span>
                        </div>
                        <p className="text-[10px] text-fg-dim leading-snug">
                          Zero data loss database migration with continuous backup.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SCREEN STATE 02: Integration & Architecture Spec */}
                  {safeActiveStep === 1 && (
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-fg-dim font-bold uppercase tracking-wider">
                        <span>INTEGRATION ARCHITECTURE</span>
                        <span className="text-accent font-extrabold">VERIFIED</span>
                      </div>

                      <div className="p-3.5 bg-white border border-border-subtle rounded-xl space-y-2.5 shadow-flat">
                        <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                          <span className="text-[11px] font-bold text-fg-default">TruckMate &amp; Odoo Bridge</span>
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">Connected</span>
                        </div>

                        <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                          <span className="text-[11px] font-bold text-fg-default">UiPath RPA Bot Triggers</span>
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">Active</span>
                        </div>

                        <div className="p-2 rounded bg-accent-tint border border-accent/30 text-[10px] font-bold text-accent-deep flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3 text-accent" /> Azure Cloud Security
                          </span>
                          <span>Entra ID &bull; SSO</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-border-subtle rounded-xl space-y-1 text-[10px]">
                        <div className="font-bold text-fg-default">SYSTEM INTEROPERABILITY</div>
                        <p className="text-fg-dim">Zero downtime cutover roadmap ready for deployment.</p>
                      </div>
                    </div>
                  )}

                  {/* SCREEN STATE 03: Live Deployment */}
                  {safeActiveStep === 2 && (
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-fg-dim font-bold uppercase tracking-wider">
                        <span>ACTIVE DEPLOYMENTS</span>
                        <span className="text-emerald-600 font-extrabold">PRODUCTION</span>
                      </div>

                      <div className="p-3 bg-accent text-white rounded-xl space-y-1 shadow-floating">
                        <div className="flex items-center justify-between font-bold text-xs">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-white" /> Automated BOL Parsing
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 bg-white/20 text-white rounded font-bold">99.4%</span>
                        </div>
                        <p className="text-[10px] text-white/90">
                          Automated rate validation and paperwork extraction live.
                        </p>
                      </div>

                      <div className="p-3 bg-white border border-border-subtle rounded-xl space-y-1 shadow-flat">
                        <div className="flex items-center justify-between font-bold text-fg-default text-xs">
                          <span className="flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5 text-emerald-600" /> IoT Predictive Telemetry
                          </span>
                          <span className="text-[9px] text-emerald-600 font-bold">Active</span>
                        </div>
                        <p className="text-[10px] text-fg-dim">
                          Real-time equipment monitoring &amp; early alerts online.
                        </p>
                      </div>

                      <div className="p-2 bg-zinc-950 text-emerald-400 font-mono text-[9px] rounded-lg border border-zinc-800 flex items-center justify-between">
                        <span className="truncate">&gt;_ Zero business disruption achieved</span>
                        <span className="text-accent font-bold">LIVE</span>
                      </div>
                    </div>
                  )}

                  {/* SCREEN STATE 04: 24/7 Follow-the-Sun Support */}
                  {safeActiveStep === 3 && (
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-fg-dim font-bold uppercase tracking-wider">
                        <span>GLOBAL COVERAGE</span>
                        <span className="text-emerald-600 font-extrabold">24/7 LIVE</span>
                      </div>

                      <div className="p-3 bg-white border-2 border-accent rounded-xl space-y-2 shadow-flat">
                        <div className="font-bold text-fg-default text-xs flex items-center justify-between">
                          <span>Follow-the-Sun Network</span>
                          <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">Active</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <div className="p-1.5 bg-zinc-50 rounded border border-border-subtle flex items-center gap-1">
                            <span>🇦🇺</span> <span>Sydney</span>
                          </div>
                          <div className="p-1.5 bg-zinc-50 rounded border border-border-subtle flex items-center gap-1">
                            <span>🇮🇳</span> <span>India</span>
                          </div>
                          <div className="p-1.5 bg-zinc-50 rounded border border-border-subtle flex items-center gap-1">
                            <span>🇪🇸</span> <span>Madrid</span>
                          </div>
                          <div className="p-1.5 bg-zinc-50 rounded border border-border-subtle flex items-center gap-1">
                            <span>🇸🇬</span> <span>Singapore</span>
                          </div>
                        </div>
                        <p className="text-[9px] text-fg-dim pt-1 border-t border-border-subtle">
                          When you sleep, we work. Faster delivery, zero timezone lag.
                        </p>
                      </div>

                      <div className="p-2 bg-zinc-950 text-emerald-400 font-mono text-[9px] rounded-lg border border-zinc-800 flex items-center justify-between">
                        <span className="truncate">&gt;_ 24/7 direct technical desk active</span>
                        <span className="text-emerald-400 font-bold">ONLINE</span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Mobile Bottom Home Indicator */}
                <div className="pt-2 border-t border-border-subtle flex flex-col items-center gap-1.5">
                  <div className="flex items-center justify-between w-full text-[9px] text-fg-dim font-bold">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operational
                    </span>
                    <span>D-BST Gen3 Mobile</span>
                  </div>
                  <div className="w-24 h-1 bg-zinc-800 rounded-full mt-1" />
                </div>

              </div>

            </div>

          </div>

          {/* Right Column (Milkshake-Style Vertical Step Timeline) */}
          <div className="lg:col-span-7 space-y-8 pl-0 lg:pl-6 border-l-2 border-border-subtle/80">
            {stepsData.map((step, idx) => {
              const isActive = safeActiveStep === idx;
              return (
                <div
                  key={step.number}
                  ref={(el) => (stepCardRefs.current[idx] = el)}
                  onClick={() => handleStepClick(idx)}
                  className={`p-7 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
                    isActive
                      ? "bg-white/95 border-accent shadow-floating scale-[1.02]"
                      : "bg-white/60 border-border-subtle/60 hover:border-accent/40 hover:bg-white/80 shadow-flat"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold ${isActive ? "bg-accent text-white" : "bg-accent-tint text-accent-deep"}`}>
                      {step.number}
                    </span>
                    <span className="text-xs font-mono text-fg-dim font-semibold">
                      {step.tagline}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-fg-default mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-fg-dim leading-relaxed font-body mb-5">
                    {step.description}
                  </p>

                  {/* Feature Bullet Points */}
                  <div className="space-y-2.5 pt-3 border-t border-border-subtle/60 text-xs font-mono text-fg-default">
                    {step.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                        <span className="font-semibold">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Bottom CTA Button */}
            <div className="pt-4 text-left">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-accent text-white font-bold text-sm uppercase tracking-wider hover:bg-accent-deep transition-all shadow-raised hover:shadow-floating hover:scale-105 active:scale-95"
              >
                <span>Request Custom Architecture Review</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

// Helper Truck Icon
const Truck = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
