import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Terminal, Cpu, Layers, Search, Bell, Activity, ShieldCheck, CheckCircle2, Award } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface SourceNode {
  id: string;
  name: string;
  type: string;
  status: "active" | "synced" | "pending";
  entities: string;
  snippet: string;
}

interface AgentNode {
  id: string;
  name: string;
  role: string;
  status: "active" | "idle";
  metric: string;
}

const rotatingHeadlineItems = [
  {
    orange: "Smart, Sustainable &",
    bottom: "Scalable Solutions",
  },
  {
    orange: "Smart, Scalable, Secure &",
    bottom: "Sustainable Solutions",
  },
  {
    orange: "Sustainable & Reusable",
    bottom: "Modern Architecture",
  },
];

const sourcesList: SourceNode[] = [
  { id: "s1", name: "TruckMate TMS", type: "Transportation & Freight", status: "active", entities: "45,000", snippet: "Automated BOL ingestion and dispatch route optimization with 99.4% accuracy." },
  { id: "s2", name: "Odoo ERP Suite", type: "Enterprise ERP & Supply Chain", status: "synced", entities: "50,000+", snippet: "Unified manufacturing, inventory, accounting, and multi-channel synchronization." },
  { id: "s3", name: "Microsoft Azure SQL", type: "Cloud Infrastructure", status: "active", entities: "Zero Data Loss", snippet: "Modernized on-premise workloads to Azure with built-in high availability." },
  { id: "s4", name: "UiPath Automation", type: "RPA & Operational Workflows", status: "synced", entities: "85% Less Overhead", snippet: "Automated manual data entry, rate validations, and client onboarding workflows." },
  { id: "s5", name: "Predictive IoT Hub", type: "Manufacturing & Telemetry", status: "active", entities: "60% Less Downtime", snippet: "Real-time vibration and thermal sensor streams forecasting equipment failures." },
];

const agentsList: AgentNode[] = [
  { id: "a1", name: "TruckMate Integration Agent", role: "TMS & Fleet", status: "active", metric: "99.4% Accuracy" },
  { id: "a2", name: "Odoo ERP Connector", role: "ERP Suite", status: "active", metric: "Automated Sync" },
  { id: "a3", name: "Predictive Maintenance Agent", role: "IoT & Telemetry", status: "active", metric: "60% Downtime Drop" },
  { id: "a4", name: "Azure Cloud Modernizer", role: "Cloud Infra", status: "active", metric: "Zero Data Loss" },
  { id: "a5", name: "Customer Service AI Agent", role: "AI Automation", status: "active", metric: "24/7 Support" },
];

export const CapabilityMatrixHero = () => {
  const [selectedSource, setSelectedSource] = useState<SourceNode>(sourcesList[0]);
  const [rotationIdx, setRotationIdx] = useState(0);
  const [animPhase, setAnimPhase] = useState<"enter" | "exit">("enter");

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimPhase("exit");
      setTimeout(() => {
        setRotationIdx((prev) => (prev + 1) % rotatingHeadlineItems.length);
        setAnimPhase("enter");
      }, 450);
    }, 3200);

    return () => clearInterval(timer);
  }, []);

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

  // Counter References
  const entityCountRef = useRef<HTMLDivElement>(null);
  const kafkaCountRef = useRef<HTMLDivElement>(null);

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

      // 4. Counter Animation
      const counts = { entities: 0, kafka: 0 };
      gsap.to(counts, {
        entities: 48200,
        kafka: 142800,
        duration: 2,
        delay: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          if (entityCountRef.current) {
            entityCountRef.current.innerText = Math.round(counts.entities).toLocaleString();
          }
          if (kafkaCountRef.current) {
            kafkaCountRef.current.innerText = Math.round(counts.kafka).toLocaleString();
          }
        },
      });
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
            <span>Sustainable &amp; Reusable Architecture</span>
          </div>
        </div>

        {/* Centered D-BST 3-Line Headline & Subhead */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 ref={headlineRef} className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl text-fg-default tracking-tight leading-[1.04]">
            <div className="block">Drive your business with</div>
            <div className="block overflow-hidden py-1">
              <span
                className={cn(
                  "inline-block text-accent transition-all duration-500 transform ease-out will-change-transform",
                  animPhase === "enter"
                    ? "opacity-100 translate-y-0 scale-100 filter blur-0"
                    : "opacity-0 -translate-y-8 scale-95 filter blur-[2px]"
                )}
              >
                {rotatingHeadlineItems[rotationIdx].orange}
              </span>
            </div>
            <div className="block overflow-hidden py-1">
              <span
                className={cn(
                  "inline-block text-fg-default transition-all duration-500 transform ease-out will-change-transform",
                  animPhase === "enter"
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-6"
                )}
              >
                {rotatingHeadlineItems[rotationIdx].bottom}
              </span>
            </div>
          </h1>

          <p ref={subheadRef} className="text-base sm:text-lg md:text-xl text-fg-dim leading-relaxed max-w-3xl mx-auto font-body">
            Drive your business with Smart, Scalable, Secure &amp; Sustainable solutions. Built on sustainable and reusable architecture—transforming transportation, logistics, and enterprise operations with intelligent automation, custom TMS integrations, and AI-powered scalability.
          </p>

          {/* CTAs */}
          <div ref={ctaContainerRef} className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-accent text-white font-semibold text-sm hover:bg-accent-deep transition-all shadow-raised hover:shadow-floating hover:scale-105 active:scale-95"
            >
              <span>SCHEDULE DISCOVERY CALL</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/solutions"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-white/90 border border-border-subtle text-fg-default font-semibold text-sm hover:border-accent hover:text-accent transition-all shadow-flat backdrop-blur-md hover:scale-105 active:scale-95"
            >
              <Layers className="w-4 h-4 text-accent" />
              <span>EXPLORE SOLUTIONS</span>
            </Link>
          </div>

          {/* Compact Trust Strip */}
          <div ref={trustStripRef} className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-fg-dim">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span><strong className="text-accent font-bold">15+</strong> Years Experience</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span><strong className="text-fg-default font-bold">100+</strong> Systems Integrated</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-accent" />
              <span><strong className="text-accent font-bold">24/7</strong> Follow-the-Sun Support</span>
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

          {/* Console Mockup Card */}
          <div ref={consoleCardRef} className="bg-bg-surface/95 backdrop-blur-md border border-border-subtle rounded-lg shadow-floating overflow-hidden">
            
            {/* Window Bar */}
            <div className="bg-bg-muted px-4 py-3 border-b border-border-subtle flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
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
                    <div className="p-2 rounded bg-accent-tint text-accent-deep font-bold flex items-center justify-between">
                      <span>Overview</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-accent text-white rounded">Active</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-fg-dimmer font-bold uppercase tracking-wider mb-2">
                    DATA SOURCES (5)
                  </div>
                  <div className="space-y-1">
                    {sourcesList.map((src) => {
                      const isSelected = selectedSource.id === src.id;
                      return (
                        <button
                          key={src.id}
                          onClick={() => setSelectedSource(src)}
                          className={`w-full p-2 rounded text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-accent-tint text-accent-deep font-bold border-l-2 border-accent"
                              : "text-fg-dim hover:text-fg-default hover:bg-bg-muted"
                          }`}
                        >
                          <span className="truncate">{src.name}</span>
                          <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-accent animate-ping" : "bg-emerald-500"}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-fg-dimmer font-bold uppercase tracking-wider mb-2">
                    D-BST SERVICES
                  </div>
                  <ul className="space-y-1 text-fg-dim">
                    <li className="p-1.5 hover:text-accent cursor-pointer">&bull; Custom Software</li>
                    <li className="p-1.5 hover:text-accent cursor-pointer">&bull; AI Workflows</li>
                    <li className="p-1.5 hover:text-accent cursor-pointer">&bull; Data Analytics</li>
                    <li className="p-1.5 hover:text-accent cursor-pointer">&bull; Transformation</li>
                  </ul>
                </div>
              </div>

              {/* Center Map */}
              <div className="lg:col-span-9 p-6 bg-bg-base flex flex-col justify-between space-y-6">
                
                {/* Stats */}
                <div className="space-y-4 text-left">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-4">
                    <div>
                      <h3 className="font-display font-bold text-lg text-fg-default">
                        D-BST Engineering Ontology
                      </h3>
                      <p className="text-xs text-fg-dim font-mono">
                        5 sources feeding 1 unified D-BST architecture — consumed by 5 apps and 5 agents
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-3 bg-bg-surface border border-border-subtle rounded">
                      <div className="text-fg-dim font-semibold">Entities</div>
                      <div ref={entityCountRef} className="text-xl font-bold text-fg-default mt-1 font-mono">
                        48,200
                      </div>
                    </div>
                    <div className="p-3 bg-bg-surface border border-border-subtle rounded">
                      <div className="text-fg-dim font-semibold">Connections</div>
                      <div ref={kafkaCountRef} className="text-xl font-bold text-fg-default mt-1 font-mono">
                        142,800
                      </div>
                    </div>
                    <div className="p-3 bg-bg-surface border border-border-subtle rounded">
                      <div className="text-fg-dim font-semibold">Blueprints</div>
                      <div className="text-xl font-bold text-fg-default mt-1 font-mono">50+ Specs</div>
                    </div>
                    <div className="p-3 bg-bg-surface border border-border-subtle rounded">
                      <div className="text-fg-dim font-semibold">Data quality</div>
                      <div className="text-xl font-bold text-accent mt-1 font-mono">99.8%</div>
                    </div>
                  </div>
                </div>

                {/* Topology Network */}
                <div className="relative p-6 bg-bg-surface border border-border-subtle rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 my-4">
                  
                  {/* Sources */}
                  <div className="w-full md:w-1/3 space-y-2 text-left">
                    <div className="text-[10px] font-mono font-bold uppercase text-fg-dim">
                      SOURCES
                    </div>
                    {sourcesList.slice(0, 4).map((src) => {
                      const isSelected = selectedSource.id === src.id;
                      return (
                        <div
                          key={src.id}
                          onClick={() => setSelectedSource(src)}
                          className={`p-2.5 rounded border text-xs font-mono cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-accent-tint border-accent text-accent-deep font-bold shadow-flat"
                              : "bg-bg-base border-border-subtle text-fg-dim hover:border-accent/40"
                          }`}
                        >
                          <div className="truncate">
                            <div className="text-fg-default font-bold">{src.name}</div>
                          </div>
                          <div className={`w-2 h-2 rounded-full shrink-0 ml-2 ${isSelected ? "bg-accent animate-ping" : "bg-emerald-500"}`} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Wheel */}
                  <div className="flex flex-col items-center justify-center p-4 relative w-full md:w-1/3">
                    <div
                      ref={radialWheelRef}
                      className="w-32 h-32 rounded-full border-2 border-dashed border-accent/60 flex items-center justify-center relative"
                    />
                    <div className="absolute w-24 h-24 rounded-full bg-accent-tint border border-accent flex flex-col items-center justify-center text-center p-2 shadow-raised">
                      <Cpu className="w-5 h-5 text-accent" />
                      <span className="text-[10px] font-mono font-bold text-accent-deep mt-1 leading-tight">
                        D-BST CORE
                      </span>
                      <span className="text-[9px] font-mono text-fg-dim">48.2k</span>
                    </div>
                  </div>

                  {/* Agents */}
                  <div className="w-full md:w-1/3 space-y-2 text-right">
                    <div className="text-[10px] font-mono font-bold uppercase text-fg-dim">
                      AGENTS
                    </div>
                    {agentsList.slice(0, 4).map((agent) => (
                      <div
                        key={agent.id}
                        className="p-2.5 bg-bg-base border border-border-subtle rounded text-xs font-mono flex items-center justify-between"
                      >
                        <div className="truncate">
                          <div className="text-fg-default font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{agent.name}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Activity Feed */}
                <div className="p-3 bg-bg-surface border border-border-subtle rounded text-xs font-mono text-left space-y-2">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-1 text-[11px] text-fg-dim">
                    <span className="font-bold text-fg-default flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-accent" /> LIVE TELEMETRY &amp; ACTIVITY
                    </span>
                    <span className="text-accent font-semibold">{selectedSource.name}</span>
                  </div>
                  <p className="text-fg-default font-medium leading-relaxed">
                    &bull; <span className="text-accent font-bold">[{selectedSource.name}]</span> {selectedSource.snippet}
                  </p>
                </div>

                {/* Footer Bar */}
                <div className="pt-2 border-t border-border-subtle flex flex-wrap items-center justify-between text-[11px] font-mono text-fg-dim">
                  <span>&bull; All systems operational</span>
                  <span>5 data sources &bull; 5 apps &bull; 48,200 entities</span>
                  <span className="text-fg-default font-semibold">D-BST Solutions Gen3</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
