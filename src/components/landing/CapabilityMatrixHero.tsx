import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Terminal, Cpu, Layers, Search, Bell, Activity, ShieldCheck, CheckCircle2, Award } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

import { AdminStore, SiteContentConfig } from "@/lib/admin/adminStore";

export interface ServiceOverviewItem {
  id: string;
  name: string;
  shortName: string;
  tag: string;
  challenges: string[];
  deliverables: string[];
  businessValue: string;
}

export const serviceOverviewList: ServiceOverviewItem[] = [
  {
    id: "ai-engineering",
    name: "AI Engineering & Adoption",
    shortName: "AI Engineering",
    tag: "Controlled AI",
    challenges: [
      "Unclear or low-value AI use cases",
      "Pilots that cannot reach production",
      "Security, governance and integration concerns",
      "Low user confidence and adoption",
    ],
    deliverables: [
      "AI opportunity and value assessment",
      "Agent and workflow architecture",
      "System integration and human approval controls",
      "Pilot, productionisation and adoption roadmap",
    ],
    businessValue:
      "Move from AI experimentation to controlled operational capability, with a clear purpose and people remaining in control.",
  },
  {
    id: "enterprise-architecture",
    name: "Enterprise & Solution Architecture",
    shortName: "Solution Architecture",
    tag: "Scalable Blueprint",
    challenges: [
      "Fragmented systems and point-to-point integrations",
      "Technology decisions without a target architecture",
      "Unclear security, scalability and ownership",
      "Competing transformation investments",
    ],
    deliverables: [
      "Current-state and capability assessment",
      "Target-state architecture and options analysis",
      "Integration, API, data and security design",
      "Architecture standards and transition roadmap",
    ],
    businessValue:
      "Make technology decisions with a secure, scalable and sustainable blueprint for change.",
  },
  {
    id: "digital-transformation",
    name: "Digital Transformation & Advisory",
    shortName: "Digital Transformation",
    tag: "Practical Path",
    challenges: [
      "Manual and duplicated processes",
      "Solutions addressing symptoms rather than causes",
      "Unclear priorities, value or return on investment",
      "Business and technology teams working separately",
    ],
    deliverables: [
      "Discovery workshops and stakeholder research",
      "Process and service journey mapping",
      "Opportunity prioritisation and business cases",
      "Transformation roadmap and adoption planning",
    ],
    businessValue:
      "Focus investment on the right problems and create a practical path from business intent to measurable outcomes.",
  },
  {
    id: "custom-software",
    name: "Custom Software & System Integration",
    shortName: "Custom Software",
    tag: "System Integration",
    challenges: [
      "Standard software does not fit the operation",
      "Re-keying between disconnected systems",
      "Legacy platforms restricting improvement",
      "Inconsistent user and customer experiences",
    ],
    deliverables: [
      "Web, mobile and operational applications",
      "APIs, connectors and system integrations",
      "Workflow and orchestration solutions",
      "Modernisation, testing and deployment support",
    ],
    businessValue:
      "Close operational gaps with maintainable software that works with your existing systems and processes.",
  },
  {
    id: "data-analytics",
    name: "Data Analytics & Business Intelligence",
    shortName: "Data & Analytics",
    tag: "Trusted Info",
    challenges: [
      "Data spread across systems and spreadsheets",
      "Conflicting reports and business definitions",
      "Slow, retrospective reporting",
      "Limited operational visibility",
    ],
    deliverables: [
      "Data and reporting discovery",
      "KPI and information model definition",
      "Data pipelines, semantic models and dashboards",
      "Power BI and Microsoft Fabric solutions",
    ],
    businessValue:
      "Turn fragmented operational data into trusted information that supports faster, more confident decisions.",
  },
  {
    id: "transport-technology",
    name: "Transport Technology & TruckMate",
    shortName: "Transport Tech",
    tag: "Transport Systems",
    challenges: [
      "Manual freight planning and administration",
      "Operational data that is difficult to access",
      "Fragile or disconnected system integrations",
      "Limited visibility across transport operations",
    ],
    deliverables: [
      "TruckMate advisory and custom extensions",
      "API, DB2 and third-party integrations",
      "Command Center and operational workflows",
      "Reporting and AI-assisted decision support",
    ],
    businessValue:
      "Improve transport operations by extending the systems, data and industry knowledge already within the business.",
  },
];

export const CapabilityMatrixHero = () => {
  const [selectedService, setSelectedService] = useState<ServiceOverviewItem>(serviceOverviewList[0]);
  const [contentConfig, setContentConfig] = useState<SiteContentConfig>(() => AdminStore.getContent("dbst"));

  // Subscribe to live content updates from Super Admin CMS
  useEffect(() => {
    AdminStore.fetchRemoteContent("dbst").then((remote) => {
      if (remote) setContentConfig(remote);
    });

    const handleUpdate = () => {
      setContentConfig(AdminStore.getContent("dbst"));
    };
    window.addEventListener("admin_content_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("admin_content_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const [rotationIdx, setRotationIdx] = useState(0);
  const [animPhase, setAnimPhase] = useState<"enter" | "exit">("enter");

  const rotatingOrangePhrases =
    contentConfig.heroAnimatedWords &&
    contentConfig.heroAnimatedWords.length > 0 &&
    contentConfig.heroAnimatedWords.some((w) => w.length > 8)
      ? contentConfig.heroAnimatedWords
      : [
          "Smart, Secure, Scalable and Sustainable",
          "Smart, Sustainable & Scalable",
          "Sustainable & Reusable Architecture",
          "Future-Ready & Practical",
        ];

  useEffect(() => {
    const count = rotatingOrangePhrases.length || 1;
    const timer = setInterval(() => {
      setAnimPhase("exit");
      setTimeout(() => {
        setRotationIdx((prev) => (prev + 1) % count);
        setAnimPhase("enter");
      }, 450);
    }, 3200);

    return () => clearInterval(timer);
  }, [rotatingOrangePhrases.length]);

  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const trustStripRef = useRef<HTMLDivElement>(null);
  const consoleCardRef = useRef<HTMLDivElement>(null);
  const radialWheelRef = useRef<HTMLDivElement>(null);
  const runnerRef = useRef<HTMLDivElement>(null);
  const runnerSpriteRef = useRef<SVGSVGElement>(null);

  // Interactive Mouse Touch Grid Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 800);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.offsetHeight || 800;
    };
    window.addEventListener("resize", handleResize);

    const gridSize = 40;
    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.1;
      mouseY += (targetMouseY - mouseY) * 0.1;

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(227, 225, 220, 0.65)";

      // Draw Vertical Lines
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        for (let y = 0; y <= height; y += 12) {
          const dx = x - mouseX;
          const dy = y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let offsetX = 0;
          if (dist < 180) {
            const factor = Math.cos((dist / 180) * (Math.PI / 2));
            offsetX = (dx / dist) * factor * 14;
          }

          const drawX = x + offsetX;

          if (y === 0) {
            ctx.moveTo(drawX, y);
          } else {
            ctx.lineTo(drawX, y);
          }
        }
        ctx.stroke();
      }

      // Draw Horizontal Lines
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 12) {
          const dx = x - mouseX;
          const dy = y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let offsetY = 0;
          if (dist < 180) {
            const factor = Math.cos((dist / 180) * (Math.PI / 2));
            offsetY = (dy / dist) * factor * 14;
          }

          const drawY = y + offsetY;

          if (x === 0) {
            ctx.moveTo(x, drawY);
          } else {
            ctx.lineTo(x, drawY);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // GSAP Animation Timelines
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Entrance Animation
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (headlineRef.current) {
        tl.from(headlineRef.current.children, {
          y: 25,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          clearProps: "all",
        });
      }

      if (subheadRef.current) {
        tl.from(subheadRef.current, { y: 20, opacity: 0, duration: 0.6 }, "-=0.4");
      }

      if (ctaContainerRef.current) {
        tl.from(ctaContainerRef.current, { y: 15, opacity: 0, duration: 0.5 }, "-=0.3");
      }

      if (trustStripRef.current) {
        tl.from(trustStripRef.current, { y: 10, opacity: 0, duration: 0.5 }, "-=0.2");
      }

      if (consoleCardRef.current) {
        tl.from(consoleCardRef.current, {
          y: 35,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          clearProps: "all",
        }, "-=0.4");
      }

      // 2. Red 8-Bit Pixel Creature Running from Left to Right Across Console Top Edge
      if (runnerRef.current) {
        gsap.fromTo(
          runnerRef.current,
          { left: "0%" },
          {
            left: "85%",
            duration: 10,
            repeat: -1,
            ease: "none",
          }
        );

        if (runnerSpriteRef.current) {
          gsap.to(runnerSpriteRef.current, {
            y: -4,
            rotation: 5,
            duration: 0.25,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          });
        }
      }

      // 3. Continuous Wheel Rotation
      if (radialWheelRef.current) {
        gsap.to(radialWheelRef.current, {
          rotation: 360,
          duration: 25,
          repeat: -1,
          ease: "none",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-12 sm:py-16 lg:py-24 bg-bg-base overflow-hidden selection:bg-accent-tint selection:text-accent-deep border-b border-border-subtle">
      
      {/* 1. Soft Ambient Accent Glow Orbs */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-accent/8 blur-[130px] animate-pulse" />
      <div className="pointer-events-none absolute top-10 left-10 w-96 h-96 rounded-full bg-amber-500/5 blur-[100px]" />

      {/* 2. Crisp Technical Grid Canvas with Touch Displacement */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full z-0 opacity-80"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Centered Bespoke D-BST Eyebrow Badge */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 text-accent-deep border border-accent/25 text-xs font-mono font-bold uppercase tracking-wider shadow-flat backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <Terminal className="w-3.5 h-3.5 text-accent" />
            <span>Smart, Secure, Scalable &amp; Sustainable</span>
          </div>
        </div>

        {/* Centered D-BST 3-Line Headline & Subhead */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 ref={headlineRef} className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl text-fg-default tracking-tight leading-[1.06] space-y-1">
            <div className="block">Strategy-Led. Architecture-Driven.</div>
            <div className="block overflow-hidden py-1 min-h-[1.25em]">
              <span
                className={cn(
                  "inline-block text-accent transition-all duration-500 transform ease-out will-change-transform",
                  animPhase === "enter"
                    ? "opacity-100 translate-y-0 scale-100 filter blur-0"
                    : "opacity-0 -translate-y-8 scale-95 filter blur-[2px]"
                )}
              >
                {rotatingOrangePhrases[rotationIdx % (rotatingOrangePhrases.length || 1)]}
              </span>
            </div>
            <div className="block text-fg-default">Digital Solutions by Design.</div>
          </h1>

          <p ref={subheadRef} className="text-base sm:text-lg md:text-xl text-fg-dim leading-relaxed max-w-3xl mx-auto font-body italic">
            Turning complex business challenges into practical, future-ready AI and digital solutions.
          </p>

          {/* CTAs - 3 Buttons in One Row */}
          <div ref={ctaContainerRef} className="flex flex-wrap md:flex-nowrap items-center justify-center gap-3 sm:gap-3.5 pt-3 max-w-3xl mx-auto px-2">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-accent text-white font-semibold text-xs sm:text-sm hover:bg-accent-deep transition-all shadow-raised hover:shadow-floating hover:scale-[1.02] active:scale-[0.98] group shrink-0"
            >
              <span>{contentConfig.primaryCtaText || "BOOK A CONSULTATION"}</span>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              to="/solutions"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white border border-border-subtle text-fg-default font-semibold text-xs sm:text-sm hover:border-accent hover:text-accent transition-all shadow-flat hover:shadow-raised hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <Layers className="w-4 h-4 text-accent" />
              <span>{contentConfig.secondaryCtaText || "EXPLORE CAPABILITIES"}</span>
            </Link>

            <a
              href="https://growthmates.ai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white border border-accent/40 text-fg-default hover:text-accent hover:border-accent font-semibold text-xs sm:text-sm transition-all shadow-flat hover:shadow-raised hover:scale-[1.02] active:scale-[0.98] shrink-0 group"
              title="Explore Growthmates AI Platform"
            >
              <Cpu className="w-4 h-4 text-accent" />
              <span>GROWTHMATES AI</span>
              <span className="text-accent text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 font-bold">↗</span>
            </a>
          </div>

          {/* Compact Trust Strip */}
          <div ref={trustStripRef} className="pt-5 flex flex-wrap items-center justify-center">
            <div className="px-6 py-2 rounded-full bg-white/90 border border-border-subtle/80 shadow-flat backdrop-blur-sm flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-fg-dim">
              {(contentConfig.trustMetrics || [
                { label: "Years Experience", value: "20+" },
                { label: "Projects Delivered", value: "70+" },
                { label: "Industries", value: "7+" },
                { label: "Regions", value: "5+" },
              ]).map((metric, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  {idx === 0 && <ShieldCheck className="w-4 h-4 text-accent" />}
                  {idx === 1 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {idx >= 2 && <Award className="w-4 h-4 text-accent" />}
                  <span>
                    <strong className="text-accent font-bold">{metric.value}</strong> {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Centered Interactive Console Card Container */}
        <div className="relative max-w-6xl mx-auto pt-10">
          
          {/* THE RED 8-BIT PIXELATED CREATURE RUNNER ("LAUNCHED") */}
          <div
            ref={runnerRef}
            className="absolute -top-4 z-40 flex flex-col items-center pointer-events-none"
            style={{ left: "0%" }}
          >
            {/* "LAUNCHED" Badge Tag */}
            <div className="px-2 py-0.5 rounded border border-accent bg-accent-tint text-accent-deep text-[9px] font-mono font-bold uppercase tracking-widest mb-1 shadow-flat animate-pulse">
              LAUNCHED
            </div>

            {/* 8-Bit Red/Orange Pixel Creature SVG */}
            <svg
              ref={runnerSpriteRef}
              width="24"
              height="28"
              viewBox="0 0 16 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-md"
            >
              {/* Head */}
              <rect x="6" y="1" width="4" height="4" fill="#E8622E" />
              {/* Eye */}
              <rect x="8" y="2" width="1" height="1" fill="#FFFFFF" />
              {/* Torso */}
              <rect x="5" y="5" width="6" height="6" fill="#E8622E" />
              {/* Left Arm */}
              <rect x="3" y="6" width="2" height="4" fill="#C24417" />
              {/* Right Arm */}
              <rect x="11" y="6" width="2" height="4" fill="#E8622E" />
              {/* Left Leg */}
              <rect x="4" y="11" width="3" height="6" fill="#E8622E" />
              {/* Right Leg */}
              <rect x="9" y="11" width="3" height="6" fill="#C24417" />
              {/* Foot Left */}
              <rect x="2" y="15" width="3" height="2" fill="#E8622E" />
              {/* Foot Right */}
              <rect x="10" y="15" width="3" height="2" fill="#C24417" />
            </svg>
          </div>

          {/* Console Mockup Card with Double-Bezel Tactile Elevation */}
          <div ref={consoleCardRef} className="bg-bg-surface/95 backdrop-blur-xl border border-border-subtle rounded-2xl shadow-floating card-bezel overflow-hidden">
            
            {/* Window Bar */}
            <div className="bg-bg-muted/80 px-4 py-3 border-b border-border-subtle flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                <span className="font-bold text-fg-default flex items-center gap-2 pl-2 border-l border-border-subtle">
                  <span className="text-accent font-extrabold">D-BST</span> Solutions &rsaquo; Scoping Overview
                </span>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2 px-3 py-1 bg-bg-surface border border-border-subtle rounded text-fg-dim text-xs">
                <Search className="w-3.5 h-3.5 text-accent" />
                <span>Search platform architecture...</span>
                <kbd className="px-1.5 py-0.5 bg-bg-muted border border-border-subtle rounded text-[10px]">⌘K</kbd>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-fg-dim">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> All Systems Operational
                </span>
                <Bell className="w-3.5 h-3.5 text-fg-dim" />
              </div>
            </div>

            {/* Console Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
              
              {/* Left Sidebar */}
              <div className="lg:col-span-3 p-4 bg-bg-surface border-r border-border-subtle space-y-6 text-xs font-mono text-left">
                <div>
                  <div className="text-[10px] text-fg-dimmer font-bold uppercase tracking-wider mb-2">
                    PLATFORM
                  </div>
                  <div className="space-y-1">
                    <div className="p-2 rounded bg-accent-tint text-accent-deep font-bold flex items-center justify-between shadow-flat">
                      <span>Overview</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-accent text-white rounded font-bold">Active</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-fg-dimmer font-bold uppercase tracking-wider mb-2">
                    CORE SERVICES (6)
                  </div>
                  <div className="space-y-1">
                    {serviceOverviewList.map((svc) => {
                      const isSelected = selectedService.id === svc.id;
                      return (
                        <button
                          key={svc.id}
                          onClick={() => setSelectedService(svc)}
                          className={`w-full p-2.5 rounded-lg text-left transition-all flex items-center justify-between text-xs font-mono ${
                            isSelected
                              ? "bg-accent-tint text-accent-deep font-bold border-l-2 border-accent shadow-flat"
                              : "text-fg-dim hover:text-fg-default hover:bg-bg-muted/70"
                          }`}
                        >
                          <span className="truncate">{svc.name}</span>
                          <span className={`w-2 h-2 rounded-full shrink-0 ml-1.5 ${isSelected ? "bg-accent animate-ping" : "bg-emerald-500"}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-fg-dimmer font-bold uppercase tracking-wider mb-2">
                    CORE CAPABILITIES
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {serviceOverviewList.map((svc) => (
                      <button
                        key={svc.id}
                        onClick={() => setSelectedService(svc)}
                        className={`px-2 py-1 rounded-md border text-[10px] font-mono transition-colors shadow-flat ${
                          selectedService.id === svc.id
                            ? "bg-accent text-white border-accent font-bold"
                            : "bg-white border-border-subtle text-fg-dim hover:text-accent hover:border-accent/40"
                        }`}
                      >
                        {svc.shortName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center Map */}
              <div className="lg:col-span-9 p-6 bg-bg-base flex flex-col justify-between space-y-6">
                
                {/* Stats */}
                <div className="space-y-4 text-left">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-lg text-fg-default">
                          D-BST Capability Explorer
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-accent-tint text-accent-deep border border-accent/20 text-[10px] font-mono font-bold">
                          {selectedService.name}
                        </span>
                      </div>
                      <p className="text-xs text-fg-dim font-mono mt-0.5">
                        6 capabilities delivering practical business outcomes across 7+ industries
                      </p>
                    </div>
                    <a
                      href="https://growthmates.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-tint text-accent-deep border border-accent/25 text-[10px] font-mono font-bold hover:bg-accent hover:text-white transition-all"
                    >
                      Growthmates AI ↗
                    </a>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-3.5 bg-white border border-border-subtle/80 rounded-xl shadow-flat card-bezel">
                      <div className="text-fg-dim font-semibold text-[11px]">Experience</div>
                      <div className="text-xl font-bold text-fg-default mt-1 font-mono tracking-tight">
                        20+ Years
                      </div>
                    </div>
                    <div className="p-3.5 bg-white border border-border-subtle/80 rounded-xl shadow-flat card-bezel">
                      <div className="text-fg-dim font-semibold text-[11px]">Delivery</div>
                      <div className="text-xl font-bold text-fg-default mt-1 font-mono tracking-tight">
                        70+ Projects
                      </div>
                    </div>
                    <div className="p-3.5 bg-white border border-border-subtle/80 rounded-xl shadow-flat card-bezel">
                      <div className="text-fg-dim font-semibold text-[11px]">Industry Reach</div>
                      <div className="text-xl font-bold text-fg-default mt-1 font-mono tracking-tight">7+ Industries</div>
                    </div>
                    <div className="p-3.5 bg-white border border-border-subtle/80 rounded-xl shadow-flat card-bezel">
                      <div className="text-fg-dim font-semibold text-[11px]">Regional Reach</div>
                      <div className="text-xl font-bold text-accent mt-1 font-mono tracking-tight">5+ Regions</div>
                    </div>
                  </div>
                </div>

                {/* Topology Network */}
                <div className="relative p-5 sm:p-6 bg-bg-surface border border-border-subtle rounded-xl flex flex-col lg:flex-row items-stretch justify-between gap-6 my-4 shadow-flat">
                  
                  {/* Sources: YOUR CHALLENGES */}
                  <div className="w-full lg:w-[42%] space-y-2.5 text-left">
                    <div className="flex items-center justify-between border-b border-border-subtle/80 pb-2">
                      <span className="text-[11px] font-mono font-bold uppercase text-fg-dim tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        YOUR CHALLENGES
                      </span>
                      <span className="text-[10px] font-mono text-fg-dimmer">Pain Points</span>
                    </div>
                    <div className="space-y-2">
                      {selectedService.challenges.map((challenge, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-bg-base border border-border-subtle/90 rounded-lg text-xs font-mono text-fg-default flex items-start gap-2 shadow-xs transition-all hover:border-accent/40"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                          <span className="leading-snug text-[13px]">{challenge}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Center Wheel */}
                  <div className="flex flex-col items-center justify-center p-2 relative w-full lg:w-[16%] min-h-[140px] my-auto">
                    <div
                      ref={radialWheelRef}
                      className="w-28 h-28 rounded-full border-2 border-dashed border-accent/60 flex items-center justify-center relative"
                    />
                    <div className="absolute w-20 h-20 rounded-full bg-accent-tint border border-accent flex flex-col items-center justify-center text-center p-1.5 shadow-raised">
                      <Cpu className="w-4 h-4 text-accent" />
                      <span className="text-[9px] font-mono font-bold text-accent-deep mt-0.5 leading-tight">
                        D-BST CORE
                      </span>
                      <span className="text-[8px] font-mono text-fg-dim">Architecture</span>
                    </div>
                  </div>

                  {/* Agents: WHAT WE DELIVER */}
                  <div className="w-full lg:w-[42%] space-y-2.5 text-left">
                    <div className="flex items-center justify-between border-b border-border-subtle/80 pb-2">
                      <span className="text-[11px] font-mono font-bold uppercase text-fg-dim tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        WHAT WE DELIVER
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">Solutions</span>
                    </div>
                    <div className="space-y-2">
                      {selectedService.deliverables.map((deliverable, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-white border border-border-subtle rounded-lg text-xs font-mono text-fg-default flex items-start gap-2 shadow-xs transition-all hover:border-emerald-500/50"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                          <span className="leading-snug text-[13px] font-medium">{deliverable}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Business Value Bar */}
                <div className="p-4 bg-accent-tint/40 border border-accent/30 rounded-xl text-xs font-mono text-left space-y-1.5 shadow-flat">
                  <div className="flex items-center justify-between border-b border-accent/20 pb-1.5 text-[11px]">
                    <span className="font-bold text-accent-deep flex items-center gap-1.5 uppercase tracking-wider">
                      <Terminal className="w-3.5 h-3.5 text-accent" /> BUSINESS OUTCOME
                    </span>
                    <span className="text-accent-deep font-bold text-[10px] px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                      {selectedService.name}
                    </span>
                  </div>
                  <p className="text-fg-default font-medium leading-relaxed text-[13.5px] pt-0.5">
                    &bull; <span className="text-accent font-bold">[{selectedService.shortName}]</span> {selectedService.businessValue}
                  </p>
                </div>



              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
