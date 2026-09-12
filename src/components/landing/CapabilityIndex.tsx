import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, CheckCircle2, Layers, Cpu } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const servicesIndex = [
  {
    num: "01",
    title: "Digital Transformation & Advisory",
    href: "/services/digital-transformation",
    desc: "We help organisations understand complex operational challenges, prioritise investment and create a practical transformation path.",
    features: [
      "Business and technology discovery",
      "Process and service journey mapping",
      "Opportunity prioritisation and business cases",
      "Transformation and adoption roadmaps",
    ],
    techStack: ["Design Thinking", "Business Analysis", "Process Mapping", "Value Assessment", "Agile Delivery"],
  },
  {
    num: "02",
    title: "Enterprise & Solution Architecture",
    href: "/services/enterprise-architecture",
    desc: "We translate business priorities into secure, scalable architecture and clear technology decisions.",
    features: [
      "Current and target-state assessment",
      "Architecture options and recommendations",
      "Integration, API, data and security design",
      "Architecture standards and transition roadmaps",
    ],
    techStack: ["Enterprise Architecture", "Solution Architecture", "Cloud", "APIs", "Data", "Security"],
  },
  {
    num: "03",
    title: "AI Engineering & Adoption",
    href: "/services/ai-engineering",
    desc: "We identify valuable AI use cases, engineer controlled solutions and help embed them safely into real operations.",
    features: [
      "AI opportunity and value assessment",
      "Agent and workflow architecture",
      "MCP, data and system integration",
      "Human oversight, security and adoption planning",
    ],
    techStack: ["Agentic AI", "MCP", "OpenAI", "Azure AI", "Python", "TypeScript"],
    externalPlatformUrl: "https://growthmates.ai",
    externalPlatformLabel: "Explore Growthmates AI ↗",
  },
  {
    num: "04",
    title: "Custom Software & System Integration",
    href: "/services/custom-software",
    desc: "We build applications and integrations that close operational gaps and connect existing business systems.",
    features: [
      "Web, mobile and operational applications",
      "APIs, connectors and middleware",
      "Workflow and orchestration solutions",
      "Modernisation, testing and deployment",
    ],
    techStack: ["React", "Node.js", "TypeScript", "Python", ".NET", "REST APIs"],
  },
  {
    num: "05",
    title: "Data Analytics & Business Intelligence",
    href: "/services/data-analytics",
    desc: "We turn fragmented operational data into trusted information, actionable insights and better decisions.",
    features: [
      "Data and reporting discovery",
      "KPI and information model design",
      "Data integration, pipelines and dashboards",
      "Data quality and reporting governance",
    ],
    techStack: ["Power BI", "Microsoft Fabric", "Azure", "SQL", "Data Modelling", "Analytics"],
  },
  {
    num: "06",
    title: "Transport Technology & TruckMate",
    href: "/services/transport-technology",
    desc: "We provide specialist advisory, integration and solution engineering for transport and logistics operations, including TruckMate environments.",
    features: [
      "TruckMate consulting and custom extensions",
      "API, DB2 and third-party integrations",
      "Command Center and operational workflows",
      "Reporting and AI-assisted decision support",
    ],
    techStack: ["Trimble TruckMate", "DB2", "Command Center", "REST APIs", "Power BI", "Azure"],
  },
];

export const CapabilityIndex = () => {
  const [expandedIndex, setExpandedIndex] = useState<string | null>(servicesIndex[0].num);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Robust GSAP Entrance with clearProps: "all" so elements NEVER stay invisible
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 90%",
            },
          }
        );
      }

      if (listRef.current) {
        gsap.fromTo(
          listRef.current.children,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 90%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-20 lg:py-28 bg-bg-base border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-subtle">
          <div className="space-y-3 text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-tint text-accent-deep border border-accent/20 text-xs font-mono font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-accent" />
              <span>OUR CAPABILITIES</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-fg-default tracking-tight">
              6 Core Capability Areas
            </h2>
          </div>
          <p className="text-sm sm:text-base text-fg-dim font-body max-w-md text-left md:text-right">
            Click any service to inspect what we deliver, architecture capabilities, and methods &amp; technology.
          </p>
        </div>

        {/* Interactive High-End Accordion Index */}
        <div ref={listRef} className="space-y-4">
          {servicesIndex.map((service) => {
            const isExpanded = expandedIndex === service.num;

            return (
              <div
                key={service.num}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden text-left ${
                  isExpanded
                    ? "bg-white border-accent shadow-floating card-bezel"
                    : "bg-white/80 border-border-subtle/80 hover:border-accent/40 hover:bg-white shadow-flat"
                }`}
              >
                {/* Accordion Bar Header */}
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : service.num)}
                  className="w-full p-6 sm:p-7 flex items-center justify-between gap-4 text-left transition-colors"
                >
                  <div className="flex items-center gap-5 sm:gap-6">
                    <span
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-mono text-sm sm:text-base font-bold flex items-center justify-center transition-all ${
                        isExpanded
                          ? "bg-accent text-white shadow-flat"
                          : "bg-accent-tint text-accent-deep border border-accent/20"
                      }`}
                    >
                      {service.num}
                    </span>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-fg-default tracking-tight">
                      {service.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`hidden sm:inline text-xs font-mono font-bold tracking-wider uppercase transition-colors ${
                        isExpanded ? "text-accent" : "text-fg-dim"
                      }`}
                    >
                      {isExpanded ? "Collapse Service" : "Explore This Service"}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isExpanded ? "bg-accent-tint text-accent" : "bg-bg-muted text-fg-dim"
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isExpanded ? "rotate-180 text-accent" : ""
                        }`}
                      />
                    </div>
                  </div>
                </button>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-6 pb-7 sm:px-8 sm:pb-8 pt-2 border-t border-border-subtle/80 space-y-6 animate-in fade-in duration-200">
                    <p className="text-base text-fg-dim leading-relaxed font-body max-w-3xl">
                      {service.desc}
                    </p>

                    {/* Double-Bezel Inner Capabilities Specification Container */}
                    <div className="p-6 bg-bg-surface/90 border border-border-subtle/80 rounded-xl card-bezel grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      
                      {/* Structured Deliverables */}
                      <div className="space-y-3">
                        <div className="text-xs font-mono font-bold uppercase tracking-wider text-fg-default flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-accent" /> WHAT WE DELIVER
                        </div>
                        <div className="space-y-2">
                          {service.features.map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="p-2.5 rounded-lg bg-white border border-border-subtle/70 shadow-flat flex items-center gap-2.5 text-xs text-fg-default font-medium leading-snug"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Methods & Technology Stack Chips */}
                      <div className="space-y-3">
                        <div className="text-xs font-mono font-bold uppercase tracking-wider text-fg-default flex items-center gap-1.5">
                          <Cpu className="w-4 h-4 text-accent" /> METHODS &amp; TECHNOLOGY
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {service.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1.5 rounded-lg bg-white border border-border-subtle/80 text-xs font-mono text-fg-default font-bold shadow-flat hover:border-accent/40 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Service Detail Link & Secondary Links */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle/60">
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-tint text-accent-deep border border-accent/25 text-xs font-mono font-bold hover:bg-accent hover:text-white transition-all group"
                      >
                        <span>DISCUSS THIS CAPABILITY</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      {service.externalPlatformUrl && (
                        <a
                          href={service.externalPlatformUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-fg-dim hover:text-accent transition-colors"
                        >
                          <span>{service.externalPlatformLabel}</span>
                        </a>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
