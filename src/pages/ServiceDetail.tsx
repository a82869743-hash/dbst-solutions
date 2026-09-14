import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { DbstNavigation } from "@/components/navigation/DbstNavigation";
import { DbstFooter } from "@/components/navigation/DbstFooter";
import { ConsultationPanel } from "@/components/landing/ConsultationPanel";
import { InteractiveGridCanvas } from "@/components/common/InteractiveGridCanvas";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import {
  ArrowLeft, CheckCircle2, Code, Bot, BarChart3, RefreshCw, Compass, ArrowRight,
  Sparkles, Cpu, ShieldCheck, Zap, Activity, Terminal, GitBranch, Layers, FileCheck,
  Target, Repeat, Workflow, FolderGit2
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const industriesList = [
  "Transportation", "Retail", "Manufacturing", "Construction", "Financial", "Sustainable Energy",
];

interface CapabilityItem {
  name: string;
  desc: string;
  stack: string[];
  benefit: string;
}

interface TechNode {
  name: string;
  role: string;
  category: string;
}

interface ServiceData {
  slug: string;
  title: string;
  tagline: string;
  badgeText: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  icon: typeof Code;
  overview: string;
  capabilitiesHeader: string;
  capabilitiesSubtitle: string;
  capabilitiesList: CapabilityItem[];
  architectureDetails: string;
  techStackNodes: TechNode[];
  slaHighlight: string;
  protocolBadge: string;
  protocolHeadline: string;
  nodes: { label: string; detail: string; status: string }[];
}

const deliveryPillars = [
  {
    step: "01",
    title: "Discover & Define",
    desc: "Understand the real business problem, workflows and constraints before selecting technology.",
    detail: "Stakeholder research, journey mapping and root-cause analysis.",
    icon: Target,
  },
  {
    step: "02",
    title: "Design & De-risk",
    desc: "Create architecture options, validate assumptions with prototypes, and align stakeholders.",
    detail: "Target architecture blueprints, interface contracts and technical feasibility validation.",
    icon: Repeat,
  },
  {
    step: "03",
    title: "Deliver & Learn",
    desc: "Build in controlled increments with working software, regular reviews and user feedback.",
    detail: "Bi-weekly sprint demos, automated testing and continuous working software increments.",
    icon: ShieldCheck,
  },
  {
    step: "04",
    title: "Support & Improve",
    desc: "Stay supported beyond delivery with transparent issue ownership and practical improvements.",
    detail: "Agreed post-go-live support, transparent issue ownership and knowledge transfer.",
    icon: Workflow,
  },
];

const serviceMap: Record<string, ServiceData> = {
  "digital-transformation": {
    slug: "digital-transformation",
    title: "Digital Transformation & Advisory",
    tagline: "We help organisations understand complex operational challenges, prioritise investment and create a practical transformation path.",
    badgeText: "Advisory & Transformation",
    primaryCtaText: "Discuss This Capability →",
    secondaryCtaText: "Explore Solutions",
    icon: Compass,
    overview: "We help organisations understand complex operational challenges, prioritise investment and create a practical transformation path from business intent to measurable outcomes.",
    capabilitiesHeader: "What We Deliver",
    capabilitiesSubtitle: "Focus investment on the right problems and create a practical path from business intent to measurable outcomes.",
    capabilitiesList: [
      {
        name: "Business & Technology Discovery",
        desc: "Discovery workshops, stakeholder research, and root-cause analysis to clarify what is really holding the operation back.",
        stack: ["Design Thinking", "Business Analysis", "Stakeholder Research", "Discovery Workshops"],
        benefit: "Clear diagnosis of root operational causes, not just surface symptoms",
      },
      {
        name: "Process & Service Journey Mapping",
        desc: "End-to-end mapping of operational workflows and customer touchpoints to identify friction, manual handoffs and duplication.",
        stack: ["Process Mapping", "Value Stream Mapping", "Service Design", "Lean Workflows"],
        benefit: "Identified bottlenecks, manual re-keying, and clear efficiency opportunities",
      },
      {
        name: "Opportunity Prioritisation & Business Cases",
        desc: "Structured evaluation of technology and digital opportunities with defensible business cases and practical value metrics.",
        stack: ["Value Assessment", "ROI Modeling", "Feasibility Analysis", "Investment Scoping"],
        benefit: "Capital focused on high-leverage problems with measurable returns",
      },
      {
        name: "Transformation & Adoption Roadmaps",
        desc: "Pragmatic sequencing, change management, and user enablement plans that ensure lasting adoption across teams.",
        stack: ["Agile Delivery", "Change Management", "Roadmapping", "Team Enablement"],
        benefit: "Sustained organizational adoption with minimal delivery disruption",
      },
    ],
    architectureDetails: "We bring strategy, architecture and engineering together to create a practical transformation path.",
    techStackNodes: [
      { name: "Design Thinking", role: "User & Stakeholder Discovery Framework", category: "Discovery" },
      { name: "Business Analysis", role: "Requirements & Opportunity Scoping", category: "Analysis" },
      { name: "Process Mapping", role: "Workflow & Value Stream Analysis", category: "Process" },
      { name: "Value Assessment", role: "ROI & Impact Evaluation", category: "Strategy" },
      { name: "Agile Delivery", role: "Iterative Implementation Protocol", category: "Execution" },
    ],
    slaHighlight: "Strategy-Led • Architecture-Driven • Practical Value",
    protocolBadge: "TRANSFORMATION FRAMEWORK",
    protocolHeadline: "Operational Discovery & Adoption Blueprint",
    nodes: [
      { label: "01. DISCOVER & DEFINE", detail: "Stakeholder research, root cause analysis and opportunity scoping", status: "SCOPED" },
      { label: "02. PROCESS & JOURNEY MAPPING", detail: "End-to-end workflow analysis and friction point identification", status: "MAPPED" },
      { label: "03. TRANSFORMATION ROADMAP", detail: "Prioritised investment blueprint with adoption milestones", status: "PLANNED" },
    ],
  },
  "enterprise-architecture": {
    slug: "enterprise-architecture",
    title: "Enterprise & Solution Architecture",
    tagline: "We translate business priorities into secure, scalable architecture and clear technology decisions.",
    badgeText: "Architecture & Systems Design",
    primaryCtaText: "Discuss This Capability →",
    secondaryCtaText: "Explore Solutions",
    icon: Layers,
    overview: "Make technology decisions with a secure, scalable and sustainable blueprint for change.",
    capabilitiesHeader: "What We Deliver",
    capabilitiesSubtitle: "Translate business priorities into secure, scalable architecture and clear technology decisions.",
    capabilitiesList: [
      {
        name: "Current & Target-State Assessment",
        desc: "Comprehensive review of application landscapes, technical debt, dependencies, and future-state target vision.",
        stack: ["Enterprise Architecture", "Capability Mapping", "Gap Analysis", "System Auditing"],
        benefit: "Full visibility into architectural risk, bottlenecks, and modernization runway",
      },
      {
        name: "Architecture Options & Recommendations",
        desc: "Structured trade-off analysis between build, buy, and modernise pathways with clear architectural decision records.",
        stack: ["Solution Architecture", "Architecture Decision Records", "Trade-Off Analysis"],
        benefit: "Confident, unbiased decisions aligned with business priorities",
      },
      {
        name: "Integration, API, Data & Security Design",
        desc: "Decoupled integration patterns, robust API standards, and privacy-preserving security architectures.",
        stack: ["APIs", "Data Architecture", "Cloud Security", "Event-Driven Patterns"],
        benefit: "Decoupled systems that scale reliably without fragile point-to-point links",
      },
      {
        name: "Architecture Standards & Transition Roadmaps",
        desc: "Pragmatic multi-phase transition plans that minimise operational disruption and technical risk.",
        stack: ["Architecture Governance", "Transition Roadmaps", "Engineering Standards"],
        benefit: "Sustainable engineering governance and de-risked system evolution",
      },
    ],
    architectureDetails: "We design resilient architectures tailored to your operational scale and security constraints.",
    techStackNodes: [
      { name: "Enterprise Architecture", role: "Holistic Systems Landscape & Alignment", category: "Strategy" },
      { name: "Solution Architecture", role: "Component, Flow & System Design", category: "Architecture" },
      { name: "Cloud Architecture", role: "Scalable AWS & Azure Deployments", category: "Infrastructure" },
      { name: "API & Event Streams", role: "Decoupled Modern Integration Layer", category: "Integration" },
      { name: "Data Architecture", role: "Unified Storage, Models & Governance", category: "Data" },
      { name: "Security Architecture", role: "Zero-Trust, Identity & Data Protection", category: "Security" },
    ],
    slaHighlight: "Secure • Scalable • Sustainable Blueprint",
    protocolBadge: "ARCHITECTURE PROTOCOL",
    protocolHeadline: "Target-State Architectural Blueprint",
    nodes: [
      { label: "01. CURRENT-STATE AUDIT", detail: "Comprehensive review of applications, integrations, data and debt", status: "AUDITED" },
      { label: "02. TARGET ARCHITECTURE", detail: "Modular target blueprint with security and scalability baked in", status: "DESIGNED" },
      { label: "03. TRANSITION ROADMAP", detail: "De-risked phased transition plan with clear milestones", status: "ROADMAP" },
    ],
  },
  "ai-engineering": {
    slug: "ai-engineering",
    title: "AI Engineering & Adoption",
    tagline: "We identify valuable AI use cases, engineer controlled solutions and help embed them safely into real operations.",
    badgeText: "Agentic AI & Engineering",
    primaryCtaText: "Discuss This Capability →",
    secondaryCtaText: "Explore Growthmates AI",
    icon: Bot,
    overview: "Move from AI experimentation to controlled operational capability, with a clear purpose and people remaining in control.",
    capabilitiesHeader: "What We Deliver",
    capabilitiesSubtitle: "Identify valuable AI use cases, engineer controlled solutions and help embed them safely into operations.",
    capabilitiesList: [
      {
        name: "AI Opportunity & Value Assessment",
        desc: "Identify high-leverage workflows and evaluate technical feasibility, business value, and operational impact.",
        stack: ["AI Opportunity Assessment", "Feasibility Analysis", "Value Modeling"],
        benefit: "Targeted investment in use cases that produce real, measurable business impact",
      },
      {
        name: "Agent & Workflow Architecture",
        desc: "Modular agentic systems, deterministic safeguards, and human-in-the-loop validation checkpoints.",
        stack: ["Agentic AI", "Human-in-the-Loop", "Workflow Orchestration"],
        benefit: "Reliable, controlled autonomous workflows that keep human operators in control",
      },
      {
        name: "MCP, Data & System Integration",
        desc: "Connecting foundation models directly to operational databases and enterprise APIs using Model Context Protocol.",
        stack: ["Model Context Protocol (MCP)", "REST APIs", "Vector Retrieval"],
        benefit: "Seamless execution without copy-pasting data across disconnected applications",
      },
      {
        name: "Human Oversight, Security & Adoption Planning",
        desc: "Governance guardrails, team enablement, privacy-preserving architecture, and rollout planning.",
        stack: ["AI Governance", "Privacy & Security", "User Enablement"],
        benefit: "High user trust, responsible adoption, and zero data leakage",
      },
    ],
    architectureDetails: "We engineer controlled, privacy-first AI solutions where people stay in the loop.",
    techStackNodes: [
      { name: "Agentic AI", role: "Modular Autonomous Task Coordination", category: "AI Core" },
      { name: "Model Context Protocol", role: "Standardized Tool & System Connectors", category: "Protocol" },
      { name: "OpenAI Models", role: "Advanced Reasoning & Transformation", category: "Foundation" },
      { name: "Azure AI", role: "Enterprise-Grade Isolated AI Infrastructure", category: "Cloud AI" },
      { name: "Python", role: "Agent Logic, Pipelines & Evaluation", category: "Language" },
      { name: "TypeScript", role: "Type-Safe Client Interfaces & Integration", category: "Runtime" },
    ],
    slaHighlight: "Human-in-the-Loop • Privacy Preserving • Production Ready",
    protocolBadge: "AI ADOPTION PROTOCOL",
    protocolHeadline: "Controlled Agentic Workflow Engine",
    nodes: [
      { label: "01. USE CASE DISCOVERY", detail: "Operational triage and value feasibility assessment", status: "VALIDATED" },
      { label: "02. AGENT & MCP DESIGN", detail: "Tool-connected workflows with human-in-the-loop gates", status: "CONFIGURED" },
      { label: "03. CONTROLLED PILOT", detail: "Production rollout with observability, guardrails and training", status: "DEPLOYED" },
    ],
  },
  "custom-software": {
    slug: "custom-software",
    title: "Custom Software & System Integration",
    tagline: "We build applications and integrations that close operational gaps and connect existing business systems.",
    badgeText: "Software Engineering & APIs",
    primaryCtaText: "Discuss This Capability →",
    secondaryCtaText: "Explore Solutions",
    icon: Code,
    overview: "Close operational gaps with maintainable software that works with your existing systems and processes.",
    capabilitiesHeader: "What We Deliver",
    capabilitiesSubtitle: "Build applications and integrations that close operational gaps and connect business systems.",
    capabilitiesList: [
      {
        name: "Web, Mobile & Operational Applications",
        desc: "Purpose-built business portals, mobile field apps, and responsive operational tools designed for real users.",
        stack: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
        benefit: "Intuitive, fast interfaces that match your exact operational workflows",
      },
      {
        name: "APIs, Connectors & Middleware",
        desc: "Robust bi-directional system connectors and high-throughput integration layers between legacy and cloud platforms.",
        stack: ["REST APIs", "GraphQL", "Webhooks", "Event Brokers"],
        benefit: "Eliminates duplicate manual data entry and bridges disconnected systems",
      },
      {
        name: "Workflow & Orchestration Solutions",
        desc: "Automated business logic, scheduled batch processing, and rule-based workflow pipelines.",
        stack: ["Workflow Engines", "Microservices", "Queue Systems"],
        benefit: "Reduced operational cycle times and continuous process consistency",
      },
      {
        name: "Modernisation, Testing & Deployment Support",
        desc: "Systematic refactoring, automated regression testing, and controlled cloud deployment pipelines.",
        stack: ["Docker", "Automated Testing", "CI/CD", "Cloud Infrastructure"],
        benefit: "Long-term software maintainability and reduced technical risk",
      },
    ],
    architectureDetails: "We build maintainable, well-documented software that integrates seamlessly with your existing technology stack.",
    techStackNodes: [
      { name: "React", role: "High-Performance Modern Web Interfaces", category: "Frontend" },
      { name: "Node.js", role: "Scalable Event-Driven Services", category: "Backend" },
      { name: "TypeScript", role: "Type-Safe Architecture & Reliability", category: "Language" },
      { name: "Python", role: "Data Processing & Automation Services", category: "Language" },
      { name: ".NET", role: "Enterprise Services & System Components", category: "Backend" },
      { name: "REST APIs", role: "Standardized Secure Integration Interfaces", category: "Integration" },
    ],
    slaHighlight: "Maintainable Codebase • Secure Integration Layer",
    protocolBadge: "SOFTWARE PROTOCOL",
    protocolHeadline: "Integrated Application Architecture",
    nodes: [
      { label: "01. SPECIFICATION & DESIGN", detail: "Technical architecture, API schemas and user flows", status: "SPECIFIED" },
      { label: "02. AGILE BUILD & INTEGRATE", detail: "Iterative development with bi-directional system connectors", status: "ENGINEERED" },
      { label: "03. TESTED DEPLOYMENT", detail: "Automated test suites, staging validation and production cutover", status: "DEPLOYED" },
    ],
  },
  "data-analytics": {
    slug: "data-analytics",
    title: "Data Analytics & Business Intelligence",
    tagline: "We turn fragmented operational data into trusted information, actionable insights and better decisions.",
    badgeText: "BI & Data Engineering",
    primaryCtaText: "Discuss This Capability →",
    secondaryCtaText: "Explore Solutions",
    icon: BarChart3,
    overview: "Turn fragmented operational data into trusted information that supports faster, more confident decisions.",
    capabilitiesHeader: "What We Deliver",
    capabilitiesSubtitle: "Turn fragmented operational data into trusted information, actionable insights and better decisions.",
    capabilitiesList: [
      {
        name: "Data & Reporting Discovery",
        desc: "Audit data sources, identify conflicting metrics, and understand user decision-making requirements.",
        stack: ["Data Discovery", "Source Auditing", "Requirements Analysis"],
        benefit: "Clarity on data availability, quality gaps, and priority reports",
      },
      {
        name: "KPI & Information Model Definition",
        desc: "Establish consistent business definitions, metric hierarchies, and clean semantic data models.",
        stack: ["Information Architecture", "Semantic Models", "KPI Design"],
        benefit: "Single source of truth with aligned definitions across business units",
      },
      {
        name: "Data Pipelines, Semantic Models & Dashboards",
        desc: "Automated ingestion, transformation pipelines, and interactive executive dashboards.",
        stack: ["Power BI", "Microsoft Fabric", "SQL", "ETL Pipelines"],
        benefit: "Self-service reporting and live operational visibility",
      },
      {
        name: "Data Quality & Reporting Governance",
        desc: "Data validation rules, automated reconciliation checks, and access management governance.",
        stack: ["Data Governance", "Quality Control", "Access Security"],
        benefit: "Trusted reports that leadership and operational teams can rely upon",
      },
    ],
    architectureDetails: "We build modern data foundations using Microsoft Fabric, Power BI, and robust cloud pipelines.",
    techStackNodes: [
      { name: "Power BI", role: "Interactive Visualisation & Reporting", category: "BI Visuals" },
      { name: "Microsoft Fabric", role: "Unified Enterprise Data Analytics Lake", category: "Platform" },
      { name: "Azure Data", role: "Scalable Cloud Data Services", category: "Cloud Vault" },
      { name: "SQL", role: "Relational Query & Transformation Core", category: "Query Core" },
      { name: "Data Modelling", role: "Star Schema & Semantic Metric Modeling", category: "Architecture" },
      { name: "Analytics Pipelines", role: "Automated Data Ingestion & Cleansing", category: "Data Pipeline" },
    ],
    slaHighlight: "Trusted Metrics • Real-Time Operational Visibility",
    protocolBadge: "ANALYTICS PROTOCOL",
    protocolHeadline: "End-to-End Data Intelligence Pipeline",
    nodes: [
      { label: "01. DATA SOURCE DISCOVERY", detail: "Source system audit and KPI definition modeling", status: "AUDITED" },
      { label: "02. PIPELINE & SEMANTIC MODEL", detail: "Automated transformations and unified metric calculation", status: "MODELLED" },
      { label: "03. EXECUTIVE DASHBOARDS", detail: "Interactive Power BI reports with role-based visibility", status: "PUBLISHED" },
    ],
  },
  "transport-technology": {
    slug: "transport-technology",
    title: "Transport Technology & TruckMate",
    tagline: "We provide specialist advisory, integration and solution engineering for transport and logistics operations, including TruckMate environments.",
    badgeText: "Transport & TruckMate Specialist",
    primaryCtaText: "Discuss This Capability →",
    secondaryCtaText: "Explore Transport Solutions",
    icon: Compass,
    overview: "Improve transport operations by extending the systems, data and industry knowledge already within the business.",
    capabilitiesHeader: "What We Deliver",
    capabilitiesSubtitle: "Specialist advisory, integration and solution engineering for transport and logistics operations.",
    capabilitiesList: [
      {
        name: "TruckMate Consulting & Custom Extensions",
        desc: "Specialist consulting, configuration, custom modules, and workflow optimisation for Trimble TruckMate environments.",
        stack: ["Trimble TruckMate", "Custom Modules", "Process Optimisation"],
        benefit: "Extract full value from existing TruckMate transport investments",
      },
      {
        name: "API, DB2 & Third-Party Integrations",
        desc: "Direct database connectors, telematics feeds, customer portals, and EDI links with dispatch and billing.",
        stack: ["IBM DB2", "REST APIs", "Telematics Feeds", "EDI Systems"],
        benefit: "Seamless data exchange across dispatch, drivers, and customers",
      },
      {
        name: "Command Center & Operational Workflows",
        desc: "Tailored dispatch dashboards, automated trip planning, and exception handling for operations teams.",
        stack: ["Command Center", "Workflow Automation", "Dispatch Tools"],
        benefit: "Faster turnaround times, reduced dispatch stress, and fewer errors",
      },
      {
        name: "Reporting & AI-Assisted Decision Support",
        desc: "Fleet telemetry analytics, profit-per-trip metrics, and intelligent trip recommendations that assist human planners.",
        stack: ["Power BI", "AI Trip Recommendations", "Azure Analytics"],
        benefit: "Operational visibility and intelligent suggestions that assist planners",
      },
    ],
    architectureDetails: "Deep domain expertise in transport logistics, fleet dispatch, and Trimble TruckMate environments.",
    techStackNodes: [
      { name: "Trimble TruckMate", role: "Core Fleet TMS Dispatch & Logistics Platform", category: "TMS Core" },
      { name: "IBM DB2", role: "TruckMate Relational Database Layer", category: "Database" },
      { name: "Command Center", role: "Real-Time Fleet & Dispatch Orchestration", category: "Operations" },
      { name: "REST APIs", role: "Bi-Directional Telematics & Partner Connectors", category: "Integration" },
      { name: "Power BI", role: "Transport Analytics & Operational Reporting", category: "Analytics" },
      { name: "Azure Cloud", role: "Scalable Integration & Middleware Services", category: "Cloud" },
    ],
    slaHighlight: "Specialist TruckMate Practice • Deep Transport Domain",
    protocolBadge: "LOGISTICS PROTOCOL",
    protocolHeadline: "Transport Operations Integration Framework",
    nodes: [
      { label: "01. TMS LANDSCAPE AUDIT", detail: "Assessment of TruckMate setup, DB2 schemas and dispatch flows", status: "AUDITED" },
      { label: "02. INTEGRATION & EXTENSION", detail: "Custom API connectors, telematics links and workflow triggers", status: "INTEGRATED" },
      { label: "03. OPERATIONAL ROLLOUT", detail: "Live dispatch adoption, planner enablement and ongoing support", status: "ACTIVE" },
    ],
  },
};

const ServiceDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();

  // Normalized slug matching
  const normalizedSlug = (slug || "").toLowerCase().replace(/\s+/g, "-");
  const slugAliases: Record<string, string> = {
    "digital-transformation-advisory": "digital-transformation",
    "strategic-consulting": "digital-transformation",
    "advisory": "digital-transformation",
    "enterprise-solution-architecture": "enterprise-architecture",
    "ai-engineering-adoption": "ai-engineering",
    "ai-automation": "ai-engineering",
    "automation-ai": "ai-engineering",
    "custom-software-system-integration": "custom-software",
    "data-analytics-bi": "data-analytics",
    "data-analytics-business-intelligence": "data-analytics",
    "transport-technology-truckmate": "transport-technology",
    "truckmate": "transport-technology",
    "odoo-truckmate-erp": "transport-technology",
  };
  const resolvedSlug = slugAliases[normalizedSlug] || normalizedSlug;
  const service = serviceMap[resolvedSlug] || serviceMap["digital-transformation"];

  const containerRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);

  useDocumentMeta({
    title: `${service.title} | D-BST Solutions`,
    description: service.overview,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (heroTitleRef.current) {
        gsap.fromTo(
          heroTitleRef.current,
          { y: 20, opacity: 0.3 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", clearProps: "all" }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [slug]);

  return (
    <div ref={containerRef} className="min-h-screen bg-bg-base text-fg-default font-body antialiased selection:bg-accent-tint selection:text-accent-deep overflow-hidden">
      <DbstNavigation />

      {/* 1. HERO SECTION WITH TOUCH INTERACTIVE CANVAS GRID */}
      <section className="py-20 lg:py-28 bg-bg-surface border-b border-border-subtle relative overflow-hidden">
        <InteractiveGridCanvas />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          
          <Link
            to="/#services"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-border-subtle text-xs font-mono font-bold text-fg-dim hover:text-accent hover:border-accent/40 transition-all shadow-flat"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Capabilities</span>
          </Link>

          <div className="max-w-4xl space-y-4 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-tint text-accent-deep border border-accent/25 text-xs font-mono font-bold uppercase tracking-wider shadow-flat">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>{service.badgeText}</span>
            </div>

            <h1 ref={heroTitleRef} className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-fg-default tracking-tight leading-[1.08]">
              {service.title}
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-fg-dim font-body leading-relaxed max-w-3xl">
              {service.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-accent text-white font-bold hover:bg-accent-deep transition-all shadow-raised hover:shadow-floating hover:scale-[1.02]"
              >
                <span>{service.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {service.slug === "ai-engineering" ? (
                <a
                  href="https://growthmates.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-border-subtle text-fg-default font-bold hover:border-accent/40 hover:bg-bg-surface transition-all shadow-flat hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Explore Growthmates AI ↗</span>
                </a>
              ) : (
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-border-subtle text-fg-default font-bold hover:border-accent/40 hover:bg-bg-surface transition-all shadow-flat hover:scale-[1.02]"
                >
                  <FolderGit2 className="w-4 h-4 text-accent" />
                  <span>{service.secondaryCtaText}</span>
                </Link>
              )}
            </div>

            {/* Industry Ticker Strip */}
            <div className="pt-6 border-t border-border-subtle/80 flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="text-fg-dimmer font-bold uppercase tracking-wider text-[11px] mr-2">
                INDUSTRIES SERVED:
              </span>
              {industriesList.map((ind, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-border-subtle text-[13px] text-fg-dim font-semibold shadow-flat"
                >
                  {ind}
                </span>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 2. CORE CAPABILITIES (WHAT WE DELIVER) */}
      <section className="py-20 lg:py-24 bg-bg-base border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-tint text-accent-deep border border-accent/20 text-xs font-mono font-bold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-accent" />
                <span>WHAT WE DELIVER</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-fg-default tracking-tight">
                {service.capabilitiesHeader}
              </h2>
              <p className="text-sm sm:text-base text-fg-dim font-body leading-relaxed">
                {service.capabilitiesSubtitle}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-fg-dim bg-white px-4 py-2 rounded-full border border-border-subtle shadow-flat self-start md:self-auto">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>{service.capabilitiesList.length} Core Capability Modules</span>
            </div>
          </div>

          {/* 2x2 Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 text-left">
            {service.capabilitiesList.map((cap, idx) => (
              <div
                key={idx}
                className="p-7 sm:p-8 bg-white border border-border-subtle rounded-2xl shadow-flat hover:shadow-floating hover:border-accent/40 transition-all duration-300 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg font-mono text-xs font-bold bg-accent-tint text-accent border border-accent/20 flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-fg-dimmer">
                      MODULAR DELIVERABLE
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl sm:text-2xl text-fg-default group-hover:text-accent transition-colors">
                    {cap.name}
                  </h3>

                  <p className="text-[13.5px] sm:text-[15px] text-fg-dim font-body leading-relaxed">
                    {cap.desc}
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-mono font-bold text-fg-dimmer uppercase tracking-wider">
                      METHODS &amp; TOOLS
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cap.stack.map((st) => (
                        <span
                          key={st}
                          className="px-2.5 py-1 rounded-md bg-bg-muted border border-border-subtle text-[13px] font-mono font-medium text-fg-default"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-subtle/80">
                  <div className="p-3 bg-accent-tint/40 border border-accent/15 rounded-xl text-[13.5px] font-body text-fg-default flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span className="leading-snug">{cap.benefit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. ARCHITECTURE & EXECUTION STAGES */}
      <section className="py-20 lg:py-24 bg-bg-surface border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-tint text-accent-deep border border-accent/20 text-xs font-mono font-bold uppercase tracking-wider">
                <GitBranch className="w-3.5 h-3.5 text-accent" />
                <span>{service.protocolBadge || "EXECUTION BLUEPRINT"}</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-fg-default tracking-tight">
                {service.protocolHeadline || "Operational Execution Framework"}
              </h2>
              <p className="text-sm text-fg-dim font-body">
                {service.architectureDetails || "Structured architectural progression ensuring zero disruption to live operations."}
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-bg-muted border border-border-subtle text-xs font-mono text-fg-dim font-semibold w-fit self-start sm:self-auto">
              <span>{service.slaHighlight}</span>
            </div>
          </div>

          {/* 3-Stage Progressive Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {service.nodes.map((node, idx) => (
              <div
                key={idx}
                className="p-7 bg-white border border-border-subtle rounded-2xl shadow-flat hover:shadow-floating hover:border-accent/40 transition-all duration-300 space-y-4 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-accent flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" /> STAGE 0{idx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-mono font-bold">
                      {node.status}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-fg-default font-sans">
                    {node.label}
                  </h3>

                  <p className="text-[13.5px] text-fg-dim font-body leading-relaxed">
                    {node.detail}
                  </p>
                </div>

                <div className="pt-4 border-t border-border-subtle/60 flex items-center justify-between text-xs font-mono text-fg-dimmer">
                  <span>PROGRESSION</span>
                  <span className="text-accent font-bold">
                    {idx === 0 ? "Step 1 of 3" : idx === 1 ? "Step 2 of 3" : "Step 3 of 3"}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. METHODS & TECHNOLOGY ECOSYSTEM */}
      <section className="py-20 lg:py-24 bg-bg-base border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-tint text-accent-deep border border-accent/20 text-xs font-mono font-bold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-accent" />
              <span>PROVEN TOOLS &amp; METHODS</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-fg-default tracking-tight">
              Methods &amp; Technology Stack
            </h2>
            <p className="text-sm sm:text-[15px] text-fg-dim font-body">
              Production tools, enterprise standards and platforms selected specifically for your environment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Tech Stack Chips Grid (8 cols) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.techStackNodes.map((tech) => (
                <div
                  key={tech.name}
                  className="p-5 bg-white border border-border-subtle rounded-xl shadow-flat hover:border-accent/40 hover:shadow-floating transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-display font-bold text-base text-fg-default">
                      {tech.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-accent-tint text-accent-deep text-[11px] font-mono font-bold">
                      {tech.category}
                    </span>
                  </div>
                  <p className="text-[13.5px] text-fg-dim font-body leading-relaxed">
                    {tech.role}
                  </p>
                </div>
              ))}
            </div>

            {/* Technology-Agnostic Commitment Card (4 cols) */}
            <div className="lg:col-span-4 p-8 bg-white border border-border-subtle rounded-2xl shadow-flat space-y-5">
              <div className="w-10 h-10 rounded-xl bg-accent-tint border border-accent/20 flex items-center justify-center text-accent">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-fg-default">
                  Technology-Agnostic Commitment
                </h3>
                <p className="text-sm sm:text-[15px] text-fg-dim font-body leading-relaxed">
                  We begin with your business problem, not a preferred vendor. We select the simplest, most responsible tools that solve the operational challenge, respect your constraints, and integrate cleanly with your existing systems.
                </p>
              </div>
              <div className="pt-4 border-t border-border-subtle space-y-2 text-[13px] font-mono text-fg-dim">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>No proprietary vendor lock-in</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>Full source code ownership</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>Sustainable architecture runway</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. HOW WE DELIVER (THE 4 PILLARS) */}
      <section className="py-20 lg:py-24 bg-bg-surface border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-tint text-accent-deep border border-accent/20 text-xs font-mono font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>THE D-BST DELIVERY STANDARD</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-fg-default tracking-tight">
                How We Deliver
              </h2>
              <p className="text-sm sm:text-[15px] text-fg-dim font-body">
                A structured, four-step delivery method designed to minimise risk and deliver lasting business value.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-accent hover:text-accent-deep transition-all group self-start md:self-auto"
            >
              <span>DISCUSS YOUR PROJECT SCOPE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryPillars.map((pillar) => {
              const PillarIcon = pillar.icon;
              return (
                <div
                  key={pillar.step}
                  className="p-7 bg-white border border-border-subtle rounded-2xl shadow-flat hover:shadow-floating hover:border-accent/40 transition-all duration-300 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="w-9 h-9 rounded-xl font-mono text-xs font-bold bg-accent-tint text-accent border border-accent/20 flex items-center justify-center">
                        {pillar.step}
                      </span>
                      <PillarIcon className="w-4 h-4 text-accent" />
                    </div>

                    <h3 className="font-display font-bold text-xl text-fg-default">
                      {pillar.title}
                    </h3>

                    <p className="text-[13.5px] text-fg-dim font-body leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border-subtle/80">
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-fg-dimmer mb-1">
                      DELIVERY COMMITMENT
                    </div>
                    <p className="text-[13.5px] text-fg-default font-body font-medium leading-snug">
                      {pillar.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. FOCUSED CALL-TO-ACTION RIBBON */}
      <section className="py-14 bg-bg-muted border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 bg-white border border-border-subtle rounded-3xl shadow-floating flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                NEXT STEP FOR {service.title.toUpperCase()}
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-fg-default">
                Ready to Discuss What You&apos;re Trying to Improve?
              </h3>
              <p className="text-sm sm:text-[15px] text-fg-dim font-body">
                You do not need a finished brief. Speak with a D-BST principal consultant to evaluate fit, scope priorities, and explore practical solutions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-accent-deep transition-all shadow-raised hover:shadow-floating hover:scale-[1.02]"
              >
                <span>Book Discovery Conversation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {service.slug === "ai-engineering" && (
                <a
                  href="https://growthmates.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-bg-surface border border-border-subtle text-fg-default font-bold text-xs font-mono hover:border-accent/40 transition-all shadow-flat"
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Explore Growthmates AI ↗</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <ConsultationPanel />
      <DbstFooter />
    </div>
  );
};

export default ServiceDetailPage;
