import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, CheckCircle2, Layers, Cpu } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const servicesIndex = [
  {
    num: "01",
    title: "Strategic Consulting",
    href: "/services/strategic-consulting",
    desc: "Four-step strategic approach combining market analysis, digital transformation planning, and change management.",
    features: [
      "Digital Transformation Strategy",
      "Market Analysis & Competitive Audits",
      "Process Reengineering & Optimization",
      "Change Management & Staff Upskilling",
    ],
    techStack: ["Strategic Frameworks", "Digital Roadmapping", "Agile", "Process Mapping"],
  },
  {
    num: "02",
    title: "Custom Software Development",
    href: "/services/custom-software",
    desc: "Tailored software solutions for business optimization and scalable growth with enterprise-grade web, mobile, and API architectures.",
    features: [
      "Enterprise Web & Mobile Applications",
      "High-Throughput API Gateway Engineering",
      "Custom Integration Connectors",
      "Cloud-Native Architecture",
    ],
    techStack: ["React", "Node.js", "Python", "PostgreSQL", "Docker", "AWS", "Azure"],
  },
  {
    num: "03",
    title: "AI Automation & RPA",
    href: "/services/automation-ai",
    desc: "AI-driven automation with UiPath RPA, OpenAI integration, and machine learning solutions using TensorFlow and Python.",
    features: [
      "UiPath Robotic Process Automation (RPA)",
      "OpenAI Integration & Intelligent Chatbots",
      "Document & Invoice Processing (OCR)",
      "Predictive Machine Learning Models",
    ],
    techStack: ["Python", "TensorFlow", "UiPath", "OpenAI APIs", "FastAPI"],
  },
  {
    num: "04",
    title: "Professional ERP Services",
    href: "/services/odoo-truckmate-erp",
    desc: "Specialized consulting for Odoo ERP and Trimble TruckMate transportation management systems.",
    features: [
      "Odoo ERP Implementation & Customization",
      "Trimble TruckMate TMS Upgrades & Integrations",
      "Database & Workload Migration",
      "Dedicated 24/7 Training & Support",
    ],
    techStack: ["Odoo ERP", "Trimble TruckMate", "PostgreSQL", "SQL Server", "Python", ".NET"],
  },
  {
    num: "05",
    title: "Data Analytics & BI",
    href: "/services/data-analytics",
    desc: "Transform raw business data into actionable insights with real-time analytics, predictive modeling, and executive dashboards.",
    features: [
      "Real-Time Executive BI Dashboards",
      "Predictive Equipment & Demand Analytics",
      "Data Warehouse & Pipeline Consolidation",
      "Automated Regulatory & KPI Reporting",
    ],
    techStack: ["Power BI", "Azure SQL", "Python", "SQL Server", "PostgreSQL"],
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
              <span>CAPABILITIES INDEX</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-fg-default tracking-tight">
              5 Core Engineering Practices
            </h2>
          </div>
          <p className="text-sm sm:text-base text-fg-dim font-body max-w-md text-left md:text-right">
            Click any service practice to inspect deliverable capabilities, architecture features, and core technology stacks.
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
                    ? "bg-white border-accent shadow-floating ring-1 ring-accent/20"
                    : "bg-bg-surface border-border-subtle hover:border-accent/50 hover:bg-white"
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
                      {isExpanded ? "Collapse Practice" : "Inspect Practice"}
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

                    {/* Light Grey Inner Capabilities Grid Container */}
                    <div className="p-6 bg-[#F5F4F0] border border-border-subtle rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      
                      {/* Features */}
                      <div className="space-y-3">
                        <div className="text-xs font-mono font-bold uppercase tracking-wider text-fg-default flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-accent" /> DELIVERABLE CAPABILITIES
                        </div>
                        <div className="space-y-2">
                          {service.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2.5 text-xs text-fg-dim font-body leading-snug">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tech Stack Chips */}
                      <div className="space-y-3">
                        <div className="text-xs font-mono font-bold uppercase tracking-wider text-fg-default flex items-center gap-1.5">
                          <Cpu className="w-4 h-4 text-accent" /> ENGINEERING STACK
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {service.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 rounded-full bg-white border border-border-subtle text-xs font-mono text-fg-default font-bold shadow-flat"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Service Detail Link */}
                    <div className="pt-2 flex items-center justify-between border-t border-border-subtle/60">
                      <Link
                        to={service.href}
                        className="inline-flex items-center gap-2 text-xs font-mono font-bold text-accent hover:text-accent-deep transition-all group"
                      >
                        <span>VIEW PRACTICE SPECS &amp; CASE STUDIES</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
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
