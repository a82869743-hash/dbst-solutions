import { useState, useEffect, useRef } from "react";
import { DbstNavigation } from "@/components/navigation/DbstNavigation";
import { DbstFooter } from "@/components/navigation/DbstFooter";
import { ConsultationPanel } from "@/components/landing/ConsultationPanel";
import { InteractiveGridCanvas } from "@/components/common/InteractiveGridCanvas";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import ceoPhoto from "@/assets/ceo-photo.jpg";
import {
  Globe, ShieldCheck, HeartHandshake, Flame, ArrowRight, CheckCircle2, Clock, Cpu,
  Sparkles, Terminal, Check, Activity, Award, Users
} from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const clientLogos = [
  "Roadmasters", "Wickhams Freight Lines", "Linfox", "DigitXL",
  "Global Insurance", "MBG Services", "Key Basics Consulting", "Gray Box Solutions",
  "Total Tools & Hardware", "Apex Australia", "Brout", "Logic Driven Consulting",
];

const partnersData = [
  { name: "Trimble TMS", domain: "Transportation", badge: "TMS PLATFORM" },
  { name: "Truckmate", domain: "Transportation", badge: "FLEET DISPATCH" },
  { name: "McLeod Software", domain: "Transportation", badge: "LOGISTICS ERP" },
  { name: "Blue Yonder", domain: "Supply Chain", badge: "WMS EXECUTION" },
  { name: "Manhattan Associates", domain: "WMS/TMS", badge: "SUPPLY CHAIN" },
  { name: "Oracle TMS", domain: "Transportation", badge: "ENTERPRISE TMS" },
  { name: "Odoo ERP", domain: "Enterprise ERP", badge: "MODULAR ERP" },
];

interface GlobalHubStep {
  step: string;
  flag: string;
  country: string;
  role: string;
  headline: string;
  description: string;
  phoneFeedTitle: string;
  phoneFeedMetric: string;
  phoneFeedDetail: string;
  bullets: string[];
}

const globalHubSteps: GlobalHubStep[] = [
  {
    step: "STEP 01",
    flag: "🇦🇺",
    country: "Australia",
    role: "Headquarters & Architecture",
    headline: "Executive Strategy & Core Systems Design",
    description: "Our Melbourne headquarters leads client relationship management, technology roadmaps, and enterprise architecture design.",
    phoneFeedTitle: "Australia HQ",
    phoneFeedMetric: "ACTIVE LEADERSHIP",
    phoneFeedDetail: "Principal Consultants & Architects online.",
    bullets: [
      "Executive digital transformation strategy",
      "Pragmatic, outcome-focused technology scoping",
      "Direct senior principal accountability",
    ],
  },
  {
    step: "STEP 02",
    flag: "🇮🇳",
    country: "India",
    role: "Development & AI R&D Hub",
    headline: "High-Density Software & AI Engineering",
    description: "Our India engineering hub drives full-stack software development, AI model integration, and continuous automated testing.",
    phoneFeedTitle: "India Dev Hub",
    phoneFeedMetric: "ENGINEERING HUB",
    phoneFeedDetail: "Microservices & AI workflow development active.",
    bullets: [
      "Full-stack React, TypeScript, Python & .NET solutions",
      "Agentic AI, MCP tool & system connector R&D",
      "Continuous CI/CD pipeline & automated regression testing",
    ],
  },
  {
    step: "STEP 03",
    flag: "🇪🇸",
    country: "Spain",
    role: "European Operations & Cloud",
    headline: "EMEA Operations & Cloud Security",
    description: "Our European team handles EMEA client integration, multi-cloud infrastructure automation, and security reviews.",
    phoneFeedTitle: "Spain EU Hub",
    phoneFeedMetric: "EMEA PRACTICE",
    phoneFeedDetail: "Multi-cloud infrastructure monitoring active.",
    bullets: [
      "AWS, Azure & multi-cloud architecture management",
      "Privacy-by-design & enterprise data governance",
      "European enterprise logistics & workflow integrations",
    ],
  },
  {
    step: "STEP 04",
    flag: "🇸🇬",
    country: "Singapore",
    role: "Asia-Pacific Regional Hub",
    headline: "APAC Trade & Freight Connectivity",
    description: "Our Singapore hub manages cross-border supply chain telemetry, port freight APIs, and APAC regional support.",
    phoneFeedTitle: "Singapore APAC",
    phoneFeedMetric: "TRADE LOGISTICS",
    phoneFeedDetail: "Cross-border supply chain telemetry active.",
    bullets: [
      "Port & maritime freight API connectors",
      "Real-time IoT sensor telemetry stream ingestion",
      "APAC regional support desk with zero timezone lag",
    ],
  },
];

interface ConvergenceNode {
  id: string;
  code: string;
  title: string;
  badge: string;
  badgeColor: string;
  timeBoxLabel: string;
  timeBoxValue: string;
  desc: string;
  details: string[];
}

const valueNodes: ConvergenceNode[] = [
  {
    id: "care",
    code: "VAL-CARE",
    title: "Client Success First & Outcome Ownership",
    badge: "CARE",
    badgeColor: "bg-accent-tint text-accent-deep",
    timeBoxLabel: "PARTNERSHIP COMMITMENT",
    timeBoxValue: "FULL SLA",
    desc: "We measure our success strictly by your operational outcomes, taking full end-to-end accountability for production systems.",
    details: ["Outcome-driven success metrics", "No billable hour fluff", "Direct principal involvement"],
  },
  {
    id: "integrity",
    code: "VAL-INTEGRITY",
    title: "Uncompromising Technical Truth & Zero-Fluff",
    badge: "INTEGRITY",
    badgeColor: "bg-accent-tint text-accent-deep",
    timeBoxLabel: "CODE QUALITY STANDARD",
    timeBoxValue: "ZERO FLUFF",
    desc: "We never over-promise or recommend unnecessary stack bloat. If a simpler architecture solves your bottleneck, that is what we scope.",
    details: ["Pragmatic stack recommendation", "Clean comprehensive documentation", "Full source code ownership"],
  },
  {
    id: "grit",
    code: "VAL-GRIT",
    title: "Relentless Execution on Complex Systems",
    badge: "GRIT",
    badgeColor: "bg-amber-100 text-amber-800",
    timeBoxLabel: "SYSTEM RESILIENCE",
    timeBoxValue: "BULLETPROOF",
    desc: "When legacy migrations or hard integration bottlenecks arise, our senior architects push through until the system is bulletproof.",
    details: ["Legacy mainframe modernization", "Fault-tolerant queue buffers", "24/7 emergency incident dispatch"],
  },
  {
    id: "global",
    code: "VAL-GLOBAL",
    title: "Follow-the-Sun 24/7 Multi-Continent Delivery",
    badge: "GLOBAL",
    badgeColor: "bg-blue-100 text-blue-800",
    timeBoxLabel: "CONTINUOUS DELIVERY",
    timeBoxValue: "24/7 COVERAGE",
    desc: "Our distributed team across 4 continents provides continuous round-the-clock coverage with zero timezone headaches.",
    details: ["Australia, India, Spain & Singapore hubs", "Follow-the-sun development cycle", "Equal opportunity global team"],
  },
];

export const AboutPage = () => {
  useDocumentMeta({
    title: "About D-BST Solutions | Powered by Team, Driven by Values",
    description: "Learn about D-BST Solutions' 15+ years of engineering experience, 4-continent global hub network, and core operating values.",
  });

  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [activeValueNode, setActiveValueNode] = useState<ConvergenceNode>(valueNodes[0]);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const stepperRef = useRef<HTMLDivElement>(null);
  const bezierPathRefs = useRef<(SVGPathElement | null)[]>([]);

  // GSAP Animations with ScrollTrigger Sticky Sync
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Hero Entrance
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", clearProps: "all" }
        );
      }

      // 2. ScrollTrigger Stepper Auto Active Switch
      if (stepperRef.current) {
        const stepElements = Array.from(stepperRef.current.children);
        stepElements.forEach((el, index) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => setActiveStepIdx(index),
            onEnterBack: () => setActiveStepIdx(index),
          });
        });
      }

      // 3. Continuous Dash Animation for Bezier Curves
      bezierPathRefs.current.forEach((path) => {
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

  const activeHubStep = globalHubSteps[activeStepIdx];

  return (
    <div ref={containerRef} className="min-h-screen bg-bg-base text-fg-default font-body antialiased selection:bg-accent-tint selection:text-accent-deep overflow-hidden">
      <DbstNavigation />

      {/* HERO SECTION WITH TOUCH INTERACTIVE GRID CANVAS */}
      <section className="py-20 lg:py-28 bg-bg-surface border-b border-border-subtle relative overflow-hidden">
        
        {/* Interactive Mouse & Touch Ripple Canvas */}
        <InteractiveGridCanvas />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          <div ref={heroRef} className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent-tint text-accent-deep border border-accent/25 text-xs font-mono font-bold uppercase tracking-wider shadow-flat">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>ABOUT D-BST SOLUTIONS</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-fg-default tracking-tight leading-[1.05]">
              Powered by Team, <span className="text-accent">Driven by Values</span>
            </h1>

            <p className="text-base sm:text-xl text-fg-dim font-body leading-relaxed max-w-3xl mx-auto">
              D-BST Solutions is built on a foundation of Care, Integrity, and GRIT. We are a global engineering team united by our commitment to your operational success across 4 continents.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 font-mono text-xs">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-accent text-white font-bold hover:bg-accent-deep transition-all shadow-raised hover:shadow-floating hover:scale-105"
              >
                <span>Partner With Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#hubs"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white border border-border-subtle text-fg-default font-bold hover:border-accent/40 hover:bg-bg-surface transition-all shadow-flat"
              >
                <span>Explore Global Hubs</span>
                <Globe className="w-4 h-4 text-accent" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SPREAD-STYLE STICKY PHONE MOCKUP WITH CLEAN WHITE INTERIOR */}
      <section id="hubs" className="py-20 lg:py-28 bg-bg-base border-b border-border-subtle overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent-tint text-accent-deep border border-accent/25 text-xs font-mono font-bold uppercase tracking-wider shadow-flat">
              <Globe className="w-4 h-4 text-accent" />
              <span>ONE TEAM, FOUR CONTINENTS</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-fg-default tracking-tight leading-tight">
              Follow-the-Sun <span className="text-accent">Global Operations</span>
            </h2>
            <p className="text-base sm:text-lg text-fg-dim font-body leading-relaxed max-w-2xl mx-auto">
              With teams across Australia, India, Spain, and Singapore, we provide round-the-clock coverage. When you sleep, we work. Faster delivery, better support, zero timezone headaches.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
            
            {/* LEFT COLUMN: SLEEK BLACK PHONE FRAME WITH CLEAN WHITE INTERIOR SCREEN */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 self-start flex justify-center py-4">
              <div className="relative w-[300px] sm:w-[340px] h-[580px] sm:h-[620px] bg-[#FDFBF7] border-[10px] border-zinc-900 rounded-[50px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] p-4 flex flex-col justify-between overflow-hidden">
                
                {/* iPhone Dynamic Island Bezel */}
                <div className="w-28 h-5 bg-zinc-900 rounded-full mx-auto mb-4 flex items-center justify-between px-3">
                  <div className="w-2 h-2 rounded-full bg-zinc-700" />
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                </div>

                {/* Clean White Live App Screen Feed */}
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between text-fg-dim border-b border-border-subtle pb-2">
                    <span className="font-bold text-accent">D-BST GLOBAL NETWORK</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">24/7 ONLINE</span>
                  </div>

                  {/* Active Hub Card Feed inside Phone */}
                  <div className="p-5 bg-white border-2 border-accent/60 rounded-2xl space-y-3.5 shadow-floating transition-all duration-300">
                    <div className="flex items-center justify-between text-fg-default font-bold">
                      <span className="flex items-center gap-2 text-sm sm:text-base font-display">
                        <span className="text-xl">{activeHubStep.flag}</span>
                        <span>{activeHubStep.phoneFeedTitle}</span>
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-accent text-white font-mono font-bold">
                        {activeHubStep.phoneFeedMetric}
                      </span>
                    </div>

                    <div className="text-[13.5px] text-fg-dim font-body leading-relaxed">
                      {activeHubStep.phoneFeedDetail}
                    </div>

                    <div className="pt-3 border-t border-border-subtle space-y-2 text-[13px] text-fg-default font-body">
                      {activeHubStep.bullets.map((b, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-accent shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4 Mini Hub Quick Indicators */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {globalHubSteps.map((h, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveStepIdx(idx)}
                        className={`p-2.5 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                          activeStepIdx === idx
                            ? "bg-accent text-white border-accent font-bold shadow-flat"
                            : "bg-white border-border-subtle text-fg-dim hover:text-fg-default hover:border-accent/40"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{h.flag}</span>
                          <span className="truncate font-bold">{h.country}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Speaker Indicator */}
                <div className="w-28 h-1 bg-zinc-400 rounded-full mx-auto mt-2" />

              </div>
            </div>

            {/* RIGHT COLUMN: 4-STEP SCROLLING ACCORDION STEPPER */}
            <div ref={stepperRef} className="lg:col-span-7 space-y-6 font-mono">
              {globalHubSteps.map((hub, idx) => {
                const isSelected = activeStepIdx === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveStepIdx(idx)}
                    className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 cursor-pointer shadow-flat ${
                      isSelected
                        ? "bg-white border-2 border-accent shadow-floating card-bezel scale-[1.01]"
                        : "bg-white/80 border-border-subtle hover:border-accent/40 hover:bg-white card-bezel"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3 mb-3 text-xs font-bold">
                      <span className="text-accent flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-accent-tint text-accent-deep font-mono">{hub.step}</span>
                        <span className="text-xl">{hub.flag}</span>
                        <span className="text-fg-default font-sans text-xl">{hub.country}</span>
                      </span>
                      <span className="text-accent text-xs uppercase tracking-wider font-mono font-bold">{hub.role}</span>
                    </div>

                    <h3 className="font-display font-bold text-xl sm:text-2xl text-fg-default font-sans mb-2 tracking-tight">
                      {hub.headline}
                    </h3>

                    <p className="text-sm sm:text-[15px] text-fg-dim font-body leading-relaxed mb-4">
                      {hub.description}
                    </p>

                    <div className="pt-4 border-t border-border-subtle/80 space-y-2">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-fg-dimmer">
                        REGIONAL CAPABILITIES
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {hub.bullets.map((b, bIdx) => (
                          <span
                            key={bIdx}
                            className={`px-3 py-1.5 rounded-lg text-[13px] font-mono flex items-center gap-2 transition-all ${
                              isSelected
                                ? "bg-accent-tint text-accent-deep border border-accent/30 font-bold shadow-flat"
                                : "bg-bg-muted/70 text-fg-dim border border-border-subtle/70"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-accent" : "bg-fg-dimmer"}`} />
                            <span>{b}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* SPREAD-STYLE BEZIER FLOW CONVERGENCE DIAGRAM FOR CORE VALUES */}
      <section className="py-20 lg:py-28 bg-bg-surface border-b border-border-subtle overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="text-left max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent-tint text-accent-deep border border-accent/25 text-xs font-mono font-bold uppercase tracking-wider shadow-flat">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>CORE OPERATING VALUES &amp; COMMITMENT</span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-fg-default tracking-tight leading-tight">
              Care, Integrity, and <span className="text-accent">GRIT</span>
            </h2>

            <p className="text-base sm:text-lg text-fg-dim font-body leading-relaxed">
              See how our core operating values converge into one unified D-BST partnership commitment.
            </p>
          </div>

          {/* Spread-Style Bezier Flow Diagram Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left font-mono">
            
            {/* LEFT STACK: 4 Value Nodes */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-bold text-fg-dimmer uppercase tracking-wider mb-2">
                CORE GUIDING VALUES
              </div>

              {valueNodes.map((node) => {
                const isSelected = activeValueNode.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveValueNode(node)}
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
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${node.badgeColor}`}>
                        {node.badge}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-fg-default tracking-tight font-sans">
                      {node.title}
                    </h3>
                  </div>
                );
              })}
            </div>

            {/* CENTER: SVG BEZIER FLOW CURVES */}
            <div className="hidden lg:block lg:col-span-1 relative h-[420px] w-full flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 420" fill="none">
                {[55, 160, 265, 370].map((yStart, idx) => (
                  <path
                    key={idx}
                    ref={(el) => (bezierPathRefs.current[idx] = el)}
                    d={`M 0 ${yStart} C 60 ${yStart}, 40 210, 100 210`}
                    stroke="#E8622E"
                    strokeWidth={activeValueNode.id === valueNodes[idx].id ? "2.5" : "1.5"}
                    strokeDasharray="6 4"
                    opacity={activeValueNode.id === valueNodes[idx].id ? "1" : "0.3"}
                  />
                ))}
              </svg>
              <span className="absolute top-2 left-0 text-[9px] font-mono text-accent font-bold uppercase tracking-widest whitespace-nowrap bg-accent-tint px-2 py-0.5 rounded-full border border-accent/20">
                CONVERGENCE &rarr;
              </span>
            </div>

            {/* RIGHT: MAIN D-BST PARTNERSHIP ENGINE FOCAL CARD */}
            <div className="lg:col-span-5 bg-white border-2 border-accent rounded-3xl p-8 sm:p-10 shadow-floating space-y-7 relative overflow-hidden">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border-subtle pb-4 text-xs font-mono">
                  <span className="font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent" /> D-BST PARTNERSHIP ENGINE
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-accent text-white font-bold text-xs">
                    GUARANTEED
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-accent">
                    SELECTED VALUE: [{activeValueNode.badge}]
                  </span>
                  <h3 className="font-display font-bold text-2xl text-fg-default tracking-tight leading-tight font-sans">
                    {activeValueNode.title}
                  </h3>
                  <p className="text-[15px] text-fg-dim font-body leading-relaxed pt-1">
                    {activeValueNode.desc}
                  </p>
                </div>

                {/* Qualitative Protocol Commitment Box */}
                <div className="p-6 bg-[#FFF5F0] border border-accent/30 rounded-2xl space-y-2 text-center shadow-flat">
                  <div className="text-[13px] font-mono font-bold text-accent uppercase tracking-wider">
                    {activeValueNode.timeBoxLabel}
                  </div>
                  <div className="font-display font-extrabold text-2xl sm:text-3xl text-accent tracking-tight">
                    {activeValueNode.timeBoxValue}
                  </div>
                </div>

                {/* Specs Breakdown */}
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-mono font-bold text-fg-dimmer uppercase tracking-wider">
                    VERIFIED COMMITMENT PRINCIPLES
                  </div>
                  <div className="space-y-2">
                    {activeValueNode.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm font-body text-fg-default">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Equal Opportunity Commitment Statement Banner */}
          <div className="p-8 sm:p-10 bg-white border border-border-subtle rounded-3xl font-mono text-xs space-y-3 shadow-floating text-left max-w-5xl mx-auto">
            <div className="font-bold text-accent uppercase tracking-wider flex items-center gap-2 text-sm border-b border-border-subtle pb-3">
              <Users className="w-4 h-4 text-accent" /> EQUAL OPPORTUNITY EMPLOYER STATEMENT
            </div>
            <p className="text-fg-default font-body text-[15px] sm:text-base leading-relaxed pt-1">
              At D-BST Solutions, we believe that diversity drives innovation. We are committed to creating an inclusive environment where everyone—regardless of race, gender, nationality, religion, age, or background—has equal opportunities to thrive. Our global team is our strength, and every voice matters.
            </p>
          </div>

        </div>
      </section>

      {/* CLIENT LOGOS & PARTNERS MARQUEE GRID */}
      <section className="py-20 bg-bg-base border-b border-border-subtle overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
              TRUSTED ENTERPRISE CLIENTS &amp; ECOSYSTEM
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-fg-default tracking-tight">
              Clients &amp; Technology Partners We Support
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 font-mono text-[13px]">
            {clientLogos.map((client, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-border-subtle shadow-flat hover:border-accent hover:text-accent font-bold text-fg-default transition-all flex items-center justify-center text-center min-h-[72px]"
              >
                {client}
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-border-subtle">
            <div className="text-xs font-mono font-bold text-fg-dimmer uppercase tracking-wider mb-4">
              ENTERPRISE PLATFORM ADAPTERS
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
              {partnersData.map((p) => (
                <span
                  key={p.name}
                  className="px-4 py-2 rounded-full bg-white border border-border-subtle font-bold text-fg-default shadow-flat flex items-center gap-2 text-[13px]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>{p.name}</span>
                  <span className="text-[11px] text-accent-deep bg-accent-tint px-2 py-0.5 rounded-full">{p.domain}</span>
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* LEADERSHIP SECTION */}
      <section className="py-20 bg-bg-surface border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 bg-white border border-border-subtle rounded-3xl shadow-floating max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-8 text-left">
            <div className="relative shrink-0">
              <img
                src={ceoPhoto}
                alt="Bimal Thakkar — Founder & Principal Consultant"
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-white shadow-floating ring-1 ring-border-subtle"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent text-white text-xs font-mono flex items-center justify-center font-bold shadow-flat">
                ✓
              </div>
            </div>

            <div className="space-y-3 flex-1 font-mono text-sm">
              <div className="font-bold text-accent uppercase tracking-wider text-xs">
                FOUNDER &amp; PRINCIPAL CONSULTANT
              </div>
              <h3 className="font-display font-bold text-2xl text-fg-default font-sans">
                Bimal Thakkar
              </h3>
              <p className="text-sm sm:text-[15px] text-fg-dim font-body leading-relaxed">
                20+ years guiding businesses through digital transformation, enterprise architecture, and operational modernization across transport, retail, and enterprise sectors.
              </p>
              <div className="pt-2 flex items-center gap-2 text-fg-default font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>Founder &amp; Principal Consultant &bull; D-BST Solutions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CONSULTATION INTAKE */}
      <main>
        <ConsultationPanel />
      </main>

      <DbstFooter />
    </div>
  );
};

export default AboutPage;
