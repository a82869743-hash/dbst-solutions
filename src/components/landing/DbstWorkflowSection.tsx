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
    title: "Discover & Define",
    tagline: "Understand the problem before recommending technology",
    description: "We work closely with stakeholders to map existing workflows, clarify root causes, identify constraints, and prioritise high-value opportunities.",
    features: [
      "Stakeholder discovery & workflow mapping",
      "Pain-point and root-cause analysis",
      "Opportunity prioritisation & roadmap scoping",
    ],
    mobileScreenTitle: "Discover & Define",
  },
  {
    number: "STEP 02",
    title: "Design & De-risk",
    tagline: "Architecture-led design with clear trade-offs",
    description: "We architect secure, scalable target states, design integrations and APIs, and de-risk technical decisions before writing production code.",
    features: [
      "Target-state architecture & options analysis",
      "API, data, security and integration design",
      "Pilot scoping & human-in-the-loop oversight",
    ],
    mobileScreenTitle: "Design & De-risk",
  },
  {
    number: "STEP 03",
    title: "Deliver & Learn",
    tagline: "Iterative engineering with continuous user validation",
    description: "We engineer solutions iteratively in production-ready increments, validating early with actual users to ensure high adoption and tangible value.",
    features: [
      "Iterative solution engineering & API integration",
      "Agentic AI workflows with human oversight",
      "User validation, testing and change support",
    ],
    mobileScreenTitle: "Deliver & Learn",
  },
  {
    number: "STEP 04",
    title: "Support & Improve",
    tagline: "Stay supported beyond delivery",
    description: "After go-live, we provide the support agreed for the engagement, respond transparently to issues and use customer feedback to identify practical improvements.",
    features: [
      "Agreed post-go-live and ongoing support",
      "Clear communication and issue ownership",
      "Feedback-led enhancements and knowledge transfer",
    ],
    mobileScreenTitle: "Support & Improve",
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
            Our proven four-step methodology brings strategy, architecture and engineering together to turn complex challenges into lasting digital capability.
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
                  
                  {/* SCREEN STATE 01: Discover & Define */}
                  {safeActiveStep === 0 && (
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-fg-dim font-bold uppercase tracking-wider">
                        <span>OPERATIONAL DISCOVERY</span>
                        <span className="text-accent font-extrabold">STAGE 01</span>
                      </div>

                      <div className="p-3 bg-accent-tint border-2 border-accent rounded-xl space-y-1.5 shadow-flat text-left">
                        <div className="flex items-center justify-between font-bold text-accent-deep text-[11px]">
                          <span>Process &amp; Service Mapping</span>
                          <span className="text-[9px] px-1.5 py-0.5 bg-accent text-white font-bold rounded">Mapped</span>
                        </div>
                        <p className="text-[10px] text-fg-dim leading-snug">
                          Identified operational friction points across order ingestion, handoffs, and dispatch.
                        </p>
                      </div>

                      <div className="p-3 bg-white border border-border-subtle rounded-xl space-y-1.5 shadow-flat text-left">
                        <div className="flex items-center justify-between font-bold text-fg-default text-[11px]">
                          <span>Root-Cause Prioritisation</span>
                          <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">Scoped</span>
                        </div>
                        <p className="text-[10px] text-fg-dim leading-snug">
                          Targeting underlying operational causes rather than surface symptoms.
                        </p>
                      </div>

                      <div className="p-3 bg-white border border-border-subtle rounded-xl space-y-1.5 shadow-flat text-left">
                        <div className="flex items-center justify-between font-bold text-fg-default text-[11px]">
                          <span>Transformation Roadmap</span>
                          <span className="text-[9px] px-1.5 py-0.5 bg-zinc-100 text-zinc-700 font-bold rounded">Active</span>
                        </div>
                        <p className="text-[10px] text-fg-dim leading-snug">
                          Practical investment path aligned with measurable business outcomes.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SCREEN STATE 02: Design & De-risk */}
                  {safeActiveStep === 1 && (
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-fg-dim font-bold uppercase tracking-wider">
                        <span>ARCHITECTURE &amp; INTEGRATION</span>
                        <span className="text-accent font-extrabold">STAGE 02</span>
                      </div>

                      <div className="p-3.5 bg-white border border-border-subtle rounded-xl space-y-2 text-left shadow-flat">
                        <div className="flex items-center justify-between border-b border-border-subtle pb-1.5">
                          <span className="text-[11px] font-bold text-fg-default">Target-State Blueprint</span>
                          <span className="text-[10px] px-2 py-0.5 bg-accent-tint text-accent-deep font-bold rounded">Designed</span>
                        </div>
                        <p className="text-[10px] text-fg-dim leading-snug">
                          Structured options and trade-off analysis before implementation commitments.
                        </p>

                        <div className="flex items-center justify-between border-b border-border-subtle pb-1.5 pt-1">
                          <span className="text-[11px] font-bold text-fg-default">API &amp; System Connectors</span>
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">De-risked</span>
                        </div>

                        <div className="p-2 rounded bg-accent-tint border border-accent/30 text-[10px] font-bold text-accent-deep flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3 text-accent" /> Security &amp; Governance
                          </span>
                          <span>Role-Based &bull; Human Oversight</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-border-subtle rounded-xl space-y-1 text-[10px] text-left">
                        <div className="font-bold text-fg-default">PHASED TRANSITION PLAN</div>
                        <p className="text-fg-dim">Controlled pilot deployment protecting ongoing business operations.</p>
                      </div>
                    </div>
                  )}

                  {/* SCREEN STATE 03: Deliver & Learn — Growthmates AI Demo Workspace */}
                  {safeActiveStep === 2 && (
                    <div className="space-y-2 text-xs text-left">
                      {/* Workspace Header */}
                      <div className="p-2.5 bg-zinc-950 text-white rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-accent">Growthmates AI</span>
                          <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded">
                            Human-Guided Workflow
                          </span>
                        </div>
                        <div className="text-[11px] font-bold">Transport Operations &bull; Demo Workspace</div>
                      </div>

                      {/* Main Workflow Card */}
                      <div className="p-2.5 bg-white border-2 border-accent rounded-xl space-y-2 shadow-flat">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px] text-fg-default">Intelligent Trip Creation</span>
                          <span className="text-[8px] px-1.5 py-0.5 bg-accent-tint text-accent-deep font-bold rounded">Active</span>
                        </div>
                        <div className="text-[9px] text-fg-dim space-y-0.5 border-b border-border-subtle pb-1.5">
                          <div>Trigger: <span className="text-fg-default font-medium">New orders ready for planning</span></div>
                          <div>Schedule: <span className="text-fg-default font-medium">Checks every 30 minutes</span></div>
                        </div>

                        {/* Progress */}
                        <div className="space-y-1 text-[9px] font-mono">
                          <div className="flex items-center justify-between text-emerald-700">
                            <span>Orders retrieved</span> <span className="font-bold">✓</span>
                          </div>
                          <div className="flex items-center justify-between text-emerald-700">
                            <span>Trip recommendation generated</span> <span className="font-bold">✓</span>
                          </div>
                          <div className="flex items-center justify-between text-emerald-700">
                            <span>Planner approval received</span> <span className="font-bold">✓</span>
                          </div>
                          <div className="flex items-center justify-between text-emerald-700">
                            <span>Trip created in TruckMate</span> <span className="font-bold">✓</span>
                          </div>
                        </div>

                        {/* Success */}
                        <div className="p-1.5 bg-emerald-50 border border-emerald-200 rounded text-[9px] text-emerald-900 leading-snug">
                          <span className="font-bold">Trip TRP-1042 Created:</span> Approved recommendation written to TruckMate.
                        </div>
                      </div>

                      {/* Smaller capability cards */}
                      <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                        <div className="p-1.5 bg-[#F5F4F0] rounded-lg border border-border-subtle">
                          <div className="font-bold text-fg-default">Knowledge Agent</div>
                          <div className="text-emerald-600 font-bold">Ready</div>
                        </div>
                        <div className="p-1.5 bg-[#F5F4F0] rounded-lg border border-border-subtle">
                          <div className="font-bold text-fg-default">Exception Review</div>
                          <div className="text-amber-600 font-bold">1 awaiting</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCREEN STATE 04: Support & Improve */}
                  {safeActiveStep === 3 && (
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-fg-dim font-bold uppercase tracking-wider">
                        <span>POST-DELIVERY SUPPORT</span>
                        <span className="text-emerald-600 font-extrabold">ACTIVE</span>
                      </div>

                      <div className="p-3 bg-white border-2 border-accent rounded-xl space-y-2 shadow-flat">
                        <div className="font-bold text-fg-default text-xs flex items-center justify-between">
                          <span>Ongoing Support</span>
                          <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">Agreed</span>
                        </div>
                        <div className="space-y-1.5 text-[10px]">
                          <div className="p-1.5 bg-zinc-50 rounded border border-border-subtle flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> <span>Agreed post-go-live support</span>
                          </div>
                          <div className="p-1.5 bg-zinc-50 rounded border border-border-subtle flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> <span>Issue ownership & communication</span>
                          </div>
                          <div className="p-1.5 bg-zinc-50 rounded border border-border-subtle flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> <span>Knowledge transfer complete</span>
                          </div>
                        </div>
                        <p className="text-[9px] text-fg-dim pt-1 border-t border-border-subtle">
                          Feedback-led enhancements and practical improvements.
                        </p>
                      </div>

                      <div className="p-2 bg-zinc-950 text-emerald-400 font-mono text-[9px] rounded-lg border border-zinc-800 flex items-center justify-between">
                        <span className="truncate">&gt;_ Support & continuous improvement active</span>
                        <span className="text-emerald-400 font-bold">LIVE</span>
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
                      ? "bg-white border-accent shadow-floating card-bezel scale-[1.01]"
                      : "bg-white/70 border-border-subtle hover:border-accent/40 hover:bg-white shadow-flat"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold ${isActive ? "bg-accent text-white shadow-flat" : "bg-accent-tint text-accent-deep"}`}>
                      {step.number}
                    </span>
                    <span className="text-xs font-mono text-fg-dim font-semibold">
                      {step.tagline}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-fg-default mb-3 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-sm text-fg-dim leading-relaxed font-body mb-5">
                    {step.description}
                  </p>

                  {/* Modern Structured Capability Deliverable Chips (Replacing PPT Bullets) */}
                  <div className="pt-4 border-t border-border-subtle/60 space-y-2">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-fg-dimmer">
                      CORE DELIVERABLES
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {step.features.map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 transition-all ${
                            isActive
                              ? "bg-accent-tint text-accent-deep border border-accent/30 font-bold shadow-flat"
                              : "bg-bg-muted/70 text-fg-dim border border-border-subtle/70"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-accent" : "bg-fg-dimmer"}`} />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bottom CTA Button with Button-in-Button Trailing Icon */}
            <div className="pt-4 text-left">
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-white font-bold text-sm tracking-wider hover:bg-accent-deep transition-all shadow-raised hover:shadow-floating hover:scale-[1.02] active:scale-[0.98] group"
              >
                <span>Request Custom Architecture Review</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
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
