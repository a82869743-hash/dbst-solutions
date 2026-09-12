import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Cpu, X, ArrowRight, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface InspectionDetail {
  title: string;
  code: string;
  category: string;
  spec: string;
  metric: string;
  details: string[];
}

const inspectionData: Record<string, InspectionDetail> = {
  "TMS SYNC": {
    title: "Freight Dispatch & TMS Integration",
    code: "TMS-INTEGRATION",
    category: "TRANSPORTATION",
    spec: "Real-time bi-directional integration with Trimble TruckMate and logistics ERPs.",
    metric: "99.4% Dispatch Sync",
    details: ["Bi-directional load sync", "Automated driver assignment", "Zero data loss SLA"],
  },
  "OCR READ": {
    title: "Vision AI Bill-of-Lading Parser",
    code: "AI-OCR-PARSER",
    category: "TRANSPORTATION",
    spec: "Automated vision extraction parsing unstructured paper bills and receipts in seconds.",
    metric: "99.4% Parsing Acc",
    details: ["Handwriting recognition", "Automated seal validation", "ERP auto-reconciliation"],
  },
  "GPS NODE": {
    title: "Telematics & Fleet GPS Stream",
    code: "FLEET-TELEMATICS",
    category: "TRANSPORTATION",
    spec: "Real-time GPS tracking, route optimization, and driver safety compliance.",
    metric: "35% Fuel Savings",
    details: ["ETA prediction engine", "Route anomaly alerts", "Automated compliance reports"],
  },
  "ROUTE AI": {
    title: "Autonomous Route Optimizer",
    code: "ROUTE-OPTIMIZER",
    category: "TRANSPORTATION",
    spec: "Intelligent route planning algorithms reducing empty miles and fuel consumption.",
    metric: "24% Empty Mile Drop",
    details: ["Dynamic re-routing", "Fuel optimization", "HOS compliance sync"],
  },
  "01 JOINT TELEMETRY": {
    title: "Industrial IoT Sensor Telemetry",
    code: "IOT-TELEMETRY",
    category: "MANUFACTURING",
    spec: "Real-time sensor telemetry over MQTT for industrial machinery and factory floors.",
    metric: "Continuous Stream",
    details: ["Sensor data ingestion", "Real-time edge processing", "High-availability telemetry"],
  },
  "02 PREDICTIVE BEARING": {
    title: "Predictive Maintenance Platform",
    code: "PREDICTIVE-AI",
    category: "MANUFACTURING",
    spec: "AI-powered equipment monitoring to predict mechanical failures before they happen.",
    metric: "60% Downtime Drop",
    details: ["Predictive failure alerts", "Cost optimization", "Automated maintenance scheduling"],
  },
  "SRV.01 LEDGER": {
    title: "Financial Risk Assessment Tool",
    code: "RISK-ANALYSIS",
    category: "FINANCIAL",
    spec: "AI-powered risk analysis, compliance monitoring, and automated KYC verification.",
    metric: "Automated Scoring",
    details: ["Automated risk scoring", "Regulatory compliance", "Real-time monitoring"],
  },
  "SRV.02 RECON": {
    title: "Automated Wire & Ledger Reconciliation",
    code: "LEDGER-RECON",
    category: "FINANCIAL",
    spec: "Automated ledger reconciliation matching transactions across multi-currency accounts.",
    metric: "99.9% Precision",
    details: ["Automated discrepancy resolution", "Audit-ready reporting", "Fast transaction processing"],
  },
  "SRV.03 FRAUD": {
    title: "Transaction Anomaly Detection",
    code: "FRAUD-DETECTION",
    category: "FINANCIAL",
    spec: "Intelligent transaction screening alerting teams to irregular activity patterns.",
    metric: "Instant Alerts",
    details: ["Behavioral pattern detection", "Regulatory compliance check", "Zero false positives"],
  },
  "SRV.04 VAULT": {
    title: "Azure Cloud Security & Compliance",
    code: "AZURE-SECURITY",
    category: "CLOUD",
    spec: "Enterprise cloud security architecture with Entra ID, Azure Backup, and role-based controls.",
    metric: "99.99% Availability",
    details: ["End-to-end encryption", "Role-based access control", "Continuous audit logging"],
  },
};

const defaultInspection: InspectionDetail = {
  title: "D-BST Industry Solutions",
  code: "CORE-SOLUTION",
  category: "ENTERPRISE",
  spec: "Strategy, architecture and engineering solutions tailored to your industry workflows.",
  metric: "20+ Years Experience",
  details: ["Industry-led delivery", "Practical, secure solutions", "Proven business outcomes"],
};

export const DbstIndustryShowcase = () => {
  const [activeInspection, setActiveInspection] = useState<InspectionDetail | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const darkBannerRef = useRef<HTMLDivElement>(null);
  const textColumnsRef = useRef<HTMLDivElement>(null);

  // Motion References
  const wheelLeftRef = useRef<SVGCircleElement>(null);
  const wheelRightRef = useRef<SVGCircleElement>(null);
  const laserScannerRef = useRef<SVGLineElement>(null);
  const robotArmRef = useRef<SVGGElement>(null);
  const gearPivotRef = useRef<SVGGElement>(null);
  const packetRef = useRef<SVGCircleElement>(null);

  // GSAP Animations Engine
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Entrance ScrollTrigger
      if (darkBannerRef.current) {
        gsap.fromTo(
          darkBannerRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: darkBannerRef.current,
              start: "top 85%",
            },
          }
        );
      }

      if (textColumnsRef.current) {
        gsap.fromTo(
          textColumnsRef.current.children,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: textColumnsRef.current,
              start: "top 90%",
            },
          }
        );
      }

      // 2. Freight Truck Spinning Wheels
      if (wheelLeftRef.current && wheelRightRef.current) {
        gsap.to([wheelLeftRef.current, wheelRightRef.current], {
          rotation: 360,
          transformOrigin: "50% 50%",
          duration: 2.5,
          repeat: -1,
          ease: "none",
        });
      }

      // 3. Horizontal Laser Scanner Sweep Across Cargo Container
      if (laserScannerRef.current) {
        gsap.to(laserScannerRef.current, {
          x: 210,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // 4. Robotic Arm Articulation Angle Motion
      if (robotArmRef.current) {
        gsap.to(robotArmRef.current, {
          rotation: 12,
          transformOrigin: "35px 120px",
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // 5. Gear Motor Rotation
      if (gearPivotRef.current) {
        gsap.to(gearPivotRef.current, {
          rotation: 360,
          transformOrigin: "35px 120px",
          duration: 4,
          repeat: -1,
          ease: "none",
        });
      }

      // 6. High-Frequency Ledger Data Packet Animation
      if (packetRef.current) {
        gsap.to(packetRef.current, {
          x: 190,
          duration: 1.4,
          repeat: -1,
          ease: "power1.inOut",
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const openModal = (key: string) => {
    setActiveInspection(inspectionData[key] || defaultInspection);
  };

  return (
    <section ref={containerRef} className="py-20 lg:py-28 bg-bg-base border-b border-border-subtle overflow-hidden relative selection:bg-accent-tint selection:text-accent-deep">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-left space-y-3 max-w-3xl">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-accent">INDUSTRY EXPERIENCE</div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-fg-default tracking-tight leading-tight">
            Built Around How <span className="text-accent">Your Industry Works</span>
          </h2>

          <p className="text-base sm:text-lg text-fg-dim font-body leading-relaxed">
            We combine industry knowledge with strategy, architecture and engineering to design solutions that fit real workflows, connect existing systems and support sustainable growth.
          </p>
        </div>

        {/* Spread-Style UNIFIED DARK BANNER CONTAINER WITH D-BST UNIQUE HIGH-TECH DIAGRAMS */}
        <div ref={darkBannerRef} className="bg-[#18191B] border border-white/10 rounded-2xl overflow-hidden shadow-floating">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/10 font-mono text-zinc-300">
            
            {/* COLUMN 1: D-BST SEMI-FREIGHT TRUCK & CONTAINER TELEMATICS */}
            <div className="p-8 sm:p-10 flex flex-col justify-between min-h-[380px] space-y-6">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-bold tracking-wider border-b border-white/10 pb-3">
                <span>FLEET TELEMATICS &bull; CORE</span>
                <span className="text-accent font-extrabold flex items-center gap-1.5 cursor-pointer" onClick={() => openModal("TMS SYNC")}>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> LIVE
                </span>
              </div>

              {/* Unique Freight Semi-Truck Vector Line-Art */}
              <div className="py-4 flex flex-col items-center justify-center space-y-4">
                
                {/* Dimension Line */}
                <div className="w-full flex items-center justify-between text-[9px] text-zinc-500 font-mono px-4">
                  <span className="border-t border-zinc-700 w-12" />
                  <span className="text-zinc-400">CARGO BAY &bull; 13.6m</span>
                  <span className="border-t border-zinc-700 w-12" />
                </div>

                {/* Vector Freight Semi-Truck Wireframe SVG */}
                <div className="relative w-full max-w-[240px]">
                  <svg viewBox="0 0 240 85" fill="none" className="w-full h-auto text-white">
                    {/* Laser Scanner Vertical Line */}
                    <line
                      ref={laserScannerRef}
                      x1="15"
                      y1="5"
                      x2="15"
                      y2="75"
                      stroke="#E8622E"
                      strokeWidth="1.5"
                      opacity="0.75"
                    />

                    {/* Cargo Container Box */}
                    <rect x="15" y="15" width="130" height="42" rx="2" stroke="#FFFFFF" strokeWidth="1.5" fill="#18191B" />
                    {/* Container Grid Rib Lines */}
                    <line x1="45" y1="15" x2="45" y2="57" stroke="#3F3F46" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="75" y1="15" x2="75" y2="57" stroke="#3F3F46" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="105" y1="15" x2="105" y2="57" stroke="#3F3F46" strokeWidth="1" strokeDasharray="2 2" />

                    {/* Cabin Front Contour */}
                    <polygon points="150,25 185,25 210,42 210,57 150,57" stroke="#FFFFFF" strokeWidth="1.5" fill="#18191B" />
                    <path d="M 185 25 L 202 40 L 165 40 Z" stroke="#E8622E" strokeWidth="1" fill="#27272A" />

                    {/* Chassis Base */}
                    <line x1="10" y1="57" x2="220" y2="57" stroke="#FFFFFF" strokeWidth="1.5" />

                    {/* Triple Axle Wheels Assemblies */}
                    <circle cx="45" cy="62" r="8" stroke="#FFFFFF" strokeWidth="1.5" fill="#18191B" />
                    <circle ref={wheelLeftRef} cx="45" cy="62" r="3" fill="#E8622E" />

                    <circle cx="75" cy="62" r="8" stroke="#FFFFFF" strokeWidth="1.5" fill="#18191B" />
                    <circle cx="75" cy="62" r="3" fill="#E8622E" />

                    <circle cx="185" cy="62" r="8" stroke="#FFFFFF" strokeWidth="1.5" fill="#18191B" />
                    <circle ref={wheelRightRef} cx="185" cy="62" r="3" fill="#E8622E" />
                  </svg>
                </div>

                {/* Subsystem Chip Buttons */}
                <div className="grid grid-cols-4 gap-1.5 w-full text-center">
                  {["TMS SYNC", "OCR READ", "GPS NODE", "ROUTE AI"].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => openModal(chip)}
                      className="px-1.5 py-1 bg-zinc-900/90 hover:bg-accent/20 border border-white/10 hover:border-accent rounded text-[9px] font-bold text-zinc-400 hover:text-white transition-all cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase pt-1">
                  FLEET NODES &bull; 1,280 &bull; VIN 0001-9999
                </div>
              </div>

              {/* Clickable Variant Pills */}
              <div className="grid grid-cols-4 gap-1.5 pt-2">
                {["TMS SYNC", "OCR READ", "GPS NODE", "ROUTE AI"].map((key, idx) => (
                  <button
                    key={idx}
                    onClick={() => openModal(key)}
                    className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-accent rounded text-[9px] text-center font-bold text-zinc-300 hover:text-accent transition-all cursor-pointer"
                  >
                    &bull; VAR.{String.fromCharCode(65 + idx)}
                  </button>
                ))}
              </div>

            </div>

            {/* COLUMN 2: D-BST ROBOTIC AUTOMATION CELL WIREFRAME */}
            <div className="p-8 sm:p-10 flex flex-col justify-between min-h-[380px] space-y-6">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-bold tracking-wider border-b border-white/10 pb-3">
                <span>ROBOTIC CELL &bull; 04</span>
                <span className="text-accent font-extrabold flex items-center gap-1.5 cursor-pointer" onClick={() => openModal("01 JOINT TELEMETRY")}>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> READY
                </span>
              </div>

              {/* Robotic Arm Blueprint SVG & 4 Right-Side Callout Badges */}
              <div className="py-2 grid grid-cols-12 gap-3 items-center">
                
                {/* Robotic Arm Wireframe (Left 5 Cols) */}
                <div className="col-span-5 flex justify-center">
                  <svg viewBox="0 0 100 150" fill="none" className="w-20 sm:w-24 h-auto text-white">
                    {/* Base Pedestal */}
                    <rect x="20" y="125" width="30" height="15" rx="2" stroke="#FFFFFF" strokeWidth="1.5" fill="#18191B" />
                    
                    {/* Rotating Gear Motor Pivot */}
                    <g ref={gearPivotRef}>
                      <circle cx="35" cy="120" r="7" stroke="#E8622E" strokeWidth="1.5" fill="#18191B" />
                      <line x1="35" y1="113" x2="35" y2="127" stroke="#E8622E" strokeWidth="1" />
                      <line x1="28" y1="120" x2="42" y2="120" stroke="#E8622E" strokeWidth="1" />
                    </g>

                    {/* Articulating Robot Arm Segment */}
                    <g ref={robotArmRef}>
                      {/* Arm Segment 1 */}
                      <line x1="35" y1="120" x2="55" y2="65" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="55" cy="65" r="5" stroke="#E8622E" strokeWidth="1.5" fill="#18191B" />
                      
                      {/* Arm Segment 2 */}
                      <line x1="55" y1="65" x2="30" y2="25" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="30" cy="25" r="4" stroke="#E8622E" strokeWidth="1.5" fill="#18191B" />
                      
                      {/* Gripper Tool Tip */}
                      <path d="M 22 15 L 30 25 L 38 15" stroke="#E8622E" strokeWidth="1.5" />
                      <circle cx="30" cy="10" r="2" fill="#E8622E" />
                    </g>
                  </svg>
                </div>

                {/* 4 Clickable Subsystem Badges (Right 7 Cols) */}
                <div className="col-span-7 space-y-2">
                  {["01 JOINT TELEMETRY", "02 PREDICTIVE BEARING", "03 OEE LINE MONITOR", "04 PLC STEP ENGINE"].map((badge) => (
                    <button
                      key={badge}
                      onClick={() => openModal(badge)}
                      className="w-full px-2.5 py-1.5 bg-zinc-900/90 hover:bg-accent/20 border border-white/10 hover:border-accent rounded flex items-center justify-between text-[10px] font-bold text-zinc-200 hover:text-white transition-all cursor-pointer shadow-flat text-left"
                    >
                      <span className="truncate">{badge}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0 ml-1" />
                    </button>
                  ))}
                </div>

              </div>

              <div className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase text-center pt-2">
                TORQUE &bull; 3,600 RPM &bull; PLC SLOW 0.04ms
              </div>

            </div>

            {/* COLUMN 3: D-BST ENTERPRISE CORE BANKING LEDGER MESH */}
            <div className="p-8 sm:p-10 flex flex-col justify-between min-h-[380px] space-y-6">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-bold tracking-wider border-b border-white/10 pb-3">
                <span>MICROSERVICES MESH &bull; 04</span>
                <span className="text-accent font-extrabold cursor-pointer" onClick={() => openModal("SRV.01 LEDGER")}>
                  50k TPS
                </span>
              </div>

              {/* 4 Server Rack Modules & High-Frequency Data Packet Flow */}
              <div className="py-2 space-y-4">
                
                {/* Horizontal Data Bus Line with Flowing Packet Particle */}
                <div className="relative w-full h-4 bg-zinc-900 border border-white/10 rounded flex items-center px-2 overflow-hidden">
                  <span className="text-[8px] text-zinc-500 font-bold z-10">BUS SPREAD &bull; SUB-12ms</span>
                  <svg className="absolute inset-0 w-full h-full">
                    <circle ref={packetRef} cx="10" cy="8" r="3" fill="#E8622E" />
                  </svg>
                </div>

                {/* 4 Server Modules */}
                <div className="grid grid-cols-4 gap-2">
                  {["SRV.01 LEDGER", "SRV.02 RECON", "SRV.03 FRAUD", "SRV.04 VAULT"].map((srv) => (
                    <button
                      key={srv}
                      onClick={() => openModal(srv)}
                      className="p-2.5 bg-zinc-900/90 hover:bg-accent/20 border border-white/10 hover:border-accent rounded flex flex-col items-center justify-between h-20 text-center transition-all cursor-pointer"
                    >
                      {/* Server LED Activity Meter */}
                      <div className="space-y-1 w-full flex flex-col items-center">
                        <div className="w-full h-1 bg-zinc-800 rounded flex items-center justify-between px-0.5">
                          <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                          <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        </div>
                        <div className="w-full h-1 bg-zinc-800 rounded" />
                        <div className="w-full h-1 bg-zinc-800 rounded" />
                      </div>
                      <div className="text-[8px] text-zinc-300 font-bold mt-1 leading-tight">{srv.split(" ")[0]}</div>
                    </button>
                  ))}
                </div>

                {/* Throughput Segmented Waveform Bar */}
                <div className="space-y-1 pt-2 cursor-pointer" onClick={() => openModal("SRV.01 LEDGER")}>
                  <div className="flex items-center justify-between text-[9px] text-zinc-500">
                    <span>TPS THROUGHPUT</span>
                    <span className="text-accent font-bold">50,000 TPS CAP</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1 h-3">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm transition-all ${
                          i === 10 ? "bg-accent animate-pulse" : i < 10 ? "bg-zinc-700" : "bg-zinc-900"
                        }`}
                      />
                    ))}
                  </div>
                </div>

              </div>

              <div className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase text-center pt-2">
                SRV.01 LEDGER &bull; SRV.02 RECON &bull; SRV.03 FRAUD &bull; SRV.04 VAULT
              </div>

            </div>

          </div>

        </div>

        {/* MATCHING D-BST DATA COLUMNS DIRECTLY UNDER THE DARK BANNER */}
        <div ref={textColumnsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {/* Column 1 */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-accent font-mono uppercase tracking-wider">
              IND.01 &mdash; TRANSPORT &amp; LOGISTICS
            </div>
            <h3 className="font-display font-bold text-2xl text-fg-default tracking-tight">
              Transport &amp; Logistics
            </h3>
            <p className="text-sm text-fg-dim leading-relaxed font-body">
              Specialist advisory, integration and solution engineering for transport and logistics operations, including TruckMate environments and AI-assisted decision support.
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-accent font-mono uppercase tracking-wider">
              IND.02 &mdash; RETAIL &amp; SUPPLY CHAIN
            </div>
            <h3 className="font-display font-bold text-2xl text-fg-default tracking-tight">
              Retail &amp; Supply Chain
            </h3>
            <p className="text-sm text-fg-dim leading-relaxed font-body">
              Connect systems across the supply chain with custom integrations, data analytics and process transformation to support faster, more confident decisions.
            </p>
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-accent font-mono uppercase tracking-wider">
              IND.03 &mdash; ENTERPRISE &amp; BEYOND
            </div>
            <h3 className="font-display font-bold text-2xl text-fg-default tracking-tight">
              Manufacturing, Construction &amp; Financial Services
            </h3>
            <p className="text-sm text-fg-dim leading-relaxed font-body">
              Enterprise architecture, AI engineering, data analytics and custom software across manufacturing, construction, financial services and sustainable energy.
            </p>
          </div>
        </div>

      </div>

      {/* INTERACTIVE INSPECTOR MODAL POPUP */}
      {activeInspection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-bg-base border border-accent/40 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-floating relative text-left font-mono space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveInspection(null)}
              className="absolute top-5 right-5 p-1 rounded-full bg-bg-surface hover:bg-accent-tint text-fg-dim hover:text-accent transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-accent">
                <Cpu className="w-4 h-4 text-accent" />
                <span>[{activeInspection.code}] D-BST MODULE SPECS</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-fg-default">
                {activeInspection.title}
              </h3>
              <span className="inline-block px-2.5 py-0.5 rounded bg-accent-tint text-accent-deep text-[10px] font-bold">
                {activeInspection.category} DOMAIN
              </span>
            </div>

            {/* Spec Readout */}
            <div className="p-4 bg-bg-surface border border-border-subtle rounded-xl space-y-2 text-xs">
              <div className="text-fg-default font-bold flex items-center justify-between border-b border-border-subtle pb-2">
                <span>GUARANTEED SLA METRIC:</span>
                <span className="text-accent">{activeInspection.metric}</span>
              </div>
              <p className="text-fg-dim font-body pt-1 leading-relaxed text-xs">
                {activeInspection.spec}
              </p>
            </div>

            {/* Deliverable Details List */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-fg-dimmer uppercase tracking-wider">
                CORE ARCHITECTURE CAPABILITIES
              </div>
              <div className="space-y-1.5">
                {activeInspection.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-body text-fg-default">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setActiveInspection(null)}
                className="px-4 py-2 rounded text-xs text-fg-dim font-bold hover:text-fg-default"
              >
                Close Inspector
              </button>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white font-bold text-xs hover:bg-accent-deep transition-all shadow-flat"
              >
                <span>REQUEST SPECS BLUEPRINT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
