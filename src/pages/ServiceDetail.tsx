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
    title: "Outcome-Focused",
    desc: "We define success metrics upfront and deliver measurable results.",
    detail: "Clear KPI alignment before any engineering sprint begins.",
    icon: Target,
  },
  {
    step: "02",
    title: "Agile Delivery",
    desc: "Iterative development with regular demos and feedback loops.",
    detail: "Bi-weekly sprint demos with production-ready increments.",
    icon: Repeat,
  },
  {
    step: "03",
    title: "Production-Ready",
    desc: "Enterprise-grade security, testing, and documentation.",
    detail: "Zero-trust auth, automated testing & SOC2 compliance scans.",
    icon: ShieldCheck,
  },
  {
    step: "04",
    title: "Knowledge Transfer",
    desc: "We train your team to maintain and extend what we build.",
    detail: "Complete source code ownership & team training workshops.",
    icon: Workflow,
  },
];

const serviceMap: Record<string, ServiceData> = {
  "strategic-consulting": {
    slug: "strategic-consulting",
    title: "Strategy That Actually Works",
    tagline: "No buzzwords, no cookie-cutter frameworks. We provide practical, actionable strategic consulting that delivers real business outcomes—not just reports you'll file away.",
    badgeText: "Strategic Advisory & Consulting",
    primaryCtaText: "Schedule Strategy Session",
    secondaryCtaText: "View Case Studies",
    icon: Compass,
    overview: "From digital strategy to process optimization, we help you make smarter decisions. Practical, actionable strategic consulting.",
    capabilitiesHeader: "Strategic Consulting Capabilities",
    capabilitiesSubtitle: "From digital strategy to process optimization, we help you make smarter decisions",
    capabilitiesList: [
      {
        name: "Digital Strategy & Roadmapping",
        desc: "Chart your path to digital maturity with actionable, prioritized technology roadmaps.",
        stack: ["Strategic Frameworks", "Technology Assessment", "ROI Modeling", "Change Management"],
        benefit: "Clear direction, aligned stakeholders, prioritized investments, reduced technology debt",
      },
      {
        name: "Process Optimization",
        desc: "Identify inefficiencies and design streamlined processes powered by the right technology.",
        stack: ["Process Mining", "Value Stream Mapping", "Lean Six Sigma", "Automation Opportunity Analysis"],
        benefit: "30-50% efficiency gains, reduced cycle times, improved quality, cost reduction",
      },
      {
        name: "Agile Transformation",
        desc: "Shift your organization to agile ways of working for faster delivery and better outcomes.",
        stack: ["Scrum", "Kanban", "SAFe", "DevOps", "Agile Tools (Jira, Azure DevOps)"],
        benefit: "2-3x faster delivery, improved team morale, better product-market fit, reduced rework",
      },
      {
        name: "Technology Due Diligence",
        desc: "Assess technology assets and risks for M&A, investments, or strategic partnerships.",
        stack: ["Code Quality Analysis", "Architecture Review", "Security Assessment", "Technical Debt Evaluation"],
        benefit: "Informed decisions, risk mitigation, accurate valuations, smooth integrations",
      },
    ],
    architectureDetails: "Our advisory team consists of senior engineering principals who have built and scaled enterprise systems.",
    techStackNodes: [
      { name: "Design Thinking", role: "User-Centric Scoping Framework", category: "Design Framework" },
      { name: "Value Stream Mapping", role: "Process Efficiency Analysis", category: "Process Mining" },
      { name: "Agile", role: "Iterative Delivery Protocol", category: "Delivery Engine" },
      { name: "Scrum", role: "Sprint Execution Framework", category: "Agile Framework" },
      { name: "SAFe", role: "Scaled Enterprise Alignment", category: "Enterprise Scale" },
      { name: "ROI Analysis", role: "Financial & Tech Investment Modeling", category: "ROI Modeling" },
    ],
    slaHighlight: "Senior Principal Lead • Unbiased Architecture Guidance",
    protocolBadge: "ADVISORY PROTOCOL",
    protocolHeadline: "Executive Engineering Scoping Framework",
    nodes: [
      { label: "01. CODE & SECURITY AUDIT", detail: "Comprehensive vulnerability & bottleneck inspection", status: "COMPLETE" },
      { label: "02. STRATEGIC ROADMAP", detail: "ROI-prioritized engineering execution blueprint", status: "SCOPED" },
      { label: "03. GOVERNANCE & SOC2", detail: "Immutable compliance audit readiness framework", status: "VERIFIED" },
    ],
  },
  "data-analytics": {
    slug: "data-analytics",
    title: "Transform Data into Decisions",
    tagline: "Turn your data into your competitive advantage. From interactive dashboards to predictive analytics, we build solutions that deliver insights you can act on—not just reports you file away.",
    badgeText: "Data & Intelligence",
    primaryCtaText: "Schedule Data Assessment",
    secondaryCtaText: "View Sample Dashboards",
    icon: BarChart3,
    overview: "End-to-end analytics solutions from data collection to actionable insights. We build real-time event streaming, cloud data warehouses, and predictive ML models.",
    capabilitiesHeader: "Data Analytics Capabilities",
    capabilitiesSubtitle: "End-to-end analytics solutions from data collection to actionable insights",
    capabilitiesList: [
      {
        name: "Power BI Dashboards",
        desc: "Transform raw data into actionable insights with interactive, real-time visualizations.",
        stack: ["Power BI", "DAX", "Power Query", "Power BI Service", "Azure Analysis Services"],
        benefit: "Decision-making speed increased by 5x, 360° business visibility, mobile-ready insights",
      },
      {
        name: "Predictive Analytics",
        desc: "Leverage machine learning to forecast trends, predict outcomes, and optimize strategies.",
        stack: ["Python", "scikit-learn", "XGBoost", "ARIMA", "Prophet", "Azure ML"],
        benefit: "95% forecast accuracy, 30% cost reduction, proactive decision-making",
      },
      {
        name: "Data Engineering",
        desc: "Build robust data pipelines and warehouses that scale with your business.",
        stack: ["SQL", "Python", "Apache Airflow", "dbt", "Snowflake", "Azure Data Factory"],
        benefit: "99.9% data reliability, 70% faster queries, single source of truth",
      },
      {
        name: "Real-time Analytics",
        desc: "Monitor business metrics as they happen with streaming analytics and live dashboards.",
        stack: ["Apache Kafka", "Spark Streaming", "Azure Stream Analytics", "Elasticsearch", "Grafana"],
        benefit: "Sub-second insights, immediate anomaly detection, operational agility",
      },
    ],
    architectureDetails: "Using stream processing architecture coupled with dbt data modeling tools.",
    techStackNodes: [
      { name: "Power BI", role: "Interactive Executive Dashboards", category: "Visualization" },
      { name: "Python", role: "Data Science & ML Pipeline Core", category: "Language Core" },
      { name: "SQL", role: "Relational Query Engine", category: "Query Engine" },
      { name: "Snowflake", role: "Cloud Data Warehouse Vault", category: "Warehouse Vault" },
      { name: "BigQuery", role: "Serverless Analytical Database", category: "Warehouse Vault" },
      { name: "TensorFlow", role: "Deep Learning Neural Core", category: "ML Engine" },
      { name: "scikit-learn", role: "Predictive Machine Learning", category: "ML Engine" },
      { name: "dbt", role: "Real-Time Data Modeling", category: "Transformation" },
      { name: "Airflow", role: "DAG Workflow Orchestration", category: "Pipeline DAG" },
    ],
    slaHighlight: "Stream Processing Engine • Zero DB Query Overhead",
    protocolBadge: "TELEMETRY PROTOCOL",
    protocolHeadline: "High-Throughput Kafka Event Stream",
    nodes: [
      { label: "01. TELEMETRY INGESTION", detail: "High-frequency Kafka event log broker", status: "STREAMING" },
      { label: "02. DBT TRANSFORMER", detail: "Real-time dimensional data modeling", status: "MODELING" },
      { label: "03. WAREHOUSE VAULT", detail: "Snowflake & ClickHouse executive analytics", status: "QUERY READY" },
    ],
  },
  "ai-automation": {
    slug: "ai-automation",
    title: "Intelligent Automation & AI",
    tagline: "Leverage intelligent automation and artificial intelligence to optimize processes, reduce manual work, and unlock new capabilities for your business. From RPA to custom AI agents, we build solutions that work.",
    badgeText: "Automation & AI Solutions",
    primaryCtaText: "Schedule Discovery Call",
    secondaryCtaText: "View Use Cases",
    icon: Bot,
    overview: "From rule-based automation to autonomous AI agents, we deliver the full spectrum of intelligent automation solutions. Fully isolated, privacy-compliant, and built for enterprise scale.",
    capabilitiesHeader: "Core Capabilities",
    capabilitiesSubtitle: "From rule-based automation to autonomous AI agents, we deliver the full spectrum of intelligent automation solutions",
    capabilitiesList: [
      {
        name: "Robotic Process Automation (RPA)",
        desc: "Software robots that mimic human actions to automate repetitive, rule-based tasks.",
        stack: ["UiPath", "Automation Anywhere", "Blue Prism", "Microsoft Power Automate"],
        benefit: "80% time savings, 99% accuracy, 24/7 operation",
      },
      {
        name: "Intelligent Process Automation (IPA)",
        desc: "RPA + AI (NLP, ML, Computer Vision) for complex, judgment-based processes.",
        stack: ["IBM Watson", "Microsoft Azure AI", "Google Cloud AI", "Custom ML models"],
        benefit: "60% reduction in processing time, adaptive learning, handles exceptions",
      },
      {
        name: "AI Agents & Copilots",
        desc: "Autonomous agents that can plan, execute tasks, and make decisions.",
        stack: ["LangChain", "AutoGPT", "OpenAI GPT-4", "Anthropic Claude", "Custom LLM fine-tuning"],
        benefit: "10x productivity boost, 24/7 availability, consistent quality",
      },
      {
        name: "Custom AI Agents",
        desc: "Purpose-built AI systems tailored to your specific business logic and data.",
        stack: ["Python", "TensorFlow/PyTorch", "Hugging Face", "Vector databases", "MLOps pipelines"],
        benefit: "Competitive advantage, proprietary intelligence, perfect fit for your needs",
      },
    ],
    architectureDetails: "We build secure, privacy-compliant AI pipelines with full data isolation.",
    techStackNodes: [
      { name: "UiPath", role: "RPA Automation Robot", category: "RPA Engine" },
      { name: "Power Automate", role: "Enterprise Workflow Engine", category: "Workflow Automation" },
      { name: "OpenAI", role: "Foundation LLM & Vision Models", category: "AI Foundation" },
      { name: "LangChain", role: "Multi-Agent Orchestration", category: "AI Framework" },
      { name: "TensorFlow", role: "Deep Learning ML Core", category: "ML Engine" },
      { name: "Python", role: "AI & Model Training Language", category: "Language Core" },
      { name: "AWS", role: "Multi-Region Cloud AI Infrastructure", category: "Cloud Vault" },
      { name: "Azure", role: "Enterprise Security & Azure AI", category: "Cloud Vault" },
    ],
    slaHighlight: "Isolated Data Vault • Multimodal Vision OCR Engine",
    protocolBadge: "AI VAULT PROTOCOL",
    protocolHeadline: "Privacy-Isolated RAG Vector Pipeline",
    nodes: [
      { label: "01. DOCUMENT PARSER", detail: "Multimodal Vision OCR paper & PDF scanner", status: "EXTRACTING" },
      { label: "02. VECTOR RAG RETRIEVER", detail: "Hybrid BM25 + Supabase pgvector embedding search", status: "INDEXED" },
      { label: "03. LLM AGENT TRIAGE", detail: "Autonomous execution agent with human fallback", status: "VALIDATED" },
    ],
  },
  "custom-software": {
    slug: "custom-software",
    title: "Software Built Your Way",
    tagline: "Off-the-shelf doesn't always fit. We build custom web, mobile, and enterprise software that matches your exact business processes—not the other way around.",
    badgeText: "Tailored Solutions",
    primaryCtaText: "Discuss Your Project",
    secondaryCtaText: "View Portfolio",
    icon: Code,
    overview: "From concept to deployment, we build software that fits your business like a glove. Designed with type-safe modern frameworks and scalable microservices.",
    capabilitiesHeader: "Custom Software Development Capabilities",
    capabilitiesSubtitle: "From concept to deployment, we build software that fits your business like a glove",
    capabilitiesList: [
      {
        name: "Web Applications",
        desc: "Build scalable, responsive web applications that deliver exceptional user experiences.",
        stack: ["React", "Next.js", "Vue.js", "Node.js", "Python Django", "PostgreSQL"],
        benefit: "70% faster time-to-market, scalable to millions of users, 99.9% uptime",
      },
      {
        name: "Mobile Applications",
        desc: "Native and cross-platform mobile apps that users love, on iOS and Android.",
        stack: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
        benefit: "Single codebase for iOS + Android, 50% cost savings, app store optimization",
      },
      {
        name: "Enterprise Software",
        desc: "Robust, secure enterprise solutions designed for complex business processes.",
        stack: ["Java Spring", "C# .NET", "Microservices", "Docker", "Kubernetes", "Azure/AWS"],
        benefit: "99.99% reliability, enterprise-grade security, scales with business growth",
      },
      {
        name: "API Development & Integration",
        desc: "Connect your systems with robust APIs and seamless third-party integrations.",
        stack: ["RESTful APIs", "GraphQL", "gRPC", "WebSockets", "OAuth 2.0", "API Gateway"],
        benefit: "Systems talk seamlessly, automated workflows, real-time data flow",
      },
    ],
    architectureDetails: "We're technology-agnostic: selecting the right tools for your needs, not our comfort zone.",
    techStackNodes: [
      { name: "React", role: "UI Framework", category: "Frontend Core" },
      { name: "Next.js", role: "Server-Rendered Web Engine", category: "Full-Stack" },
      { name: "Node.js", role: "High-Concurrency Async Runtime", category: "Backend Engine" },
      { name: "Python", role: "Data Processing & AI Workflows", category: "Language Core" },
      { name: "Go", role: "High-Throughput Microservices", category: "Backend Engine" },
      { name: "PostgreSQL", role: "Relational Ledger Storage", category: "Database Vault" },
      { name: "MongoDB", role: "Document Storage Engine", category: "Database Vault" },
      { name: "Redis", role: "Atomic In-Memory Cache", category: "Cache Buffer" },
      { name: "AWS", role: "Multi-Region Cloud Infrastructure", category: "Cloud Vault" },
      { name: "Azure", role: "Enterprise Security & Cloud", category: "Cloud Vault" },
    ],
    slaHighlight: "High-Concurrency gRPC Stream • High Availability Architecture",
    protocolBadge: "SYSTEM PROTOCOL",
    protocolHeadline: "Event-Driven Microservices Router",
    nodes: [
      { label: "01. INGESTION GATEWAY", detail: "High-concurrency gRPC & REST API router", status: "ONLINE" },
      { label: "02. KAFKA QUEUE BUFFER", detail: "Atomic in-memory event-driven message stream", status: "PROCESSING" },
      { label: "03. STORAGE LEDGER", detail: "PostgreSQL relational & Redis cache cluster", status: "SYNCED" },
    ],
  },
  "digital-transformation": {
    slug: "digital-transformation",
    title: "Modernize Your Operations",
    tagline: "From legacy systems to modern cloud platforms, we transform your technology foundation to support growth, efficiency, and competitive advantage.",
    badgeText: "Modernization Experts",
    primaryCtaText: "Start Your Transformation",
    secondaryCtaText: "Assessment Checklist",
    icon: RefreshCw,
    overview: "Comprehensive modernization services from ERP implementation to legacy migration. We help mid-market and enterprise organizations transition off brittle monoliths onto scalable cloud infrastructure.",
    capabilitiesHeader: "Digital Transformation Capabilities",
    capabilitiesSubtitle: "Comprehensive modernization services from ERP implementation to legacy migration",
    capabilitiesList: [
      {
        name: "Odoo ERP Implementation",
        desc: "End-to-end ERP deployment customized for manufacturing, distribution, and service industries.",
        stack: ["Odoo 17", "Python", "PostgreSQL", "XML Views", "OWL Framework", "Odoo Studio"],
        benefit: "Single unified system, 60% faster operations, real-time business visibility",
      },
      {
        name: "Truckmate TMS Optimization",
        desc: "Maximize your TMS investment with custom integrations, reporting, and workflow automation.",
        stack: ["Truckmate", "SQL Server", "Crystal Reports", "REST APIs", "EDI Integration"],
        benefit: "50% faster dispatch, automated invoicing, better customer experience",
      },
      {
        name: "Legacy System Modernization",
        desc: "Breathe new life into outdated systems or migrate to modern platforms.",
        stack: ["API Wrappers", "Database Migration Tools", "React", "Node.js", "Cloud Platforms"],
        benefit: "Reduced maintenance costs, improved performance, modern user experience",
      },
      {
        name: "System Integration",
        desc: "Connect disparate systems to create seamless data flow across your organization.",
        stack: ["REST APIs", "GraphQL", "Apache Kafka", "Azure Logic Apps", "Zapier", "Custom Middleware"],
        benefit: "Eliminate data silos, automated workflows, single source of truth",
      },
      {
        name: "Cloud Modernization (Azure)",
        desc: "Migrate on-premise SQL Server, apps, and infrastructure to Microsoft Azure with zero data loss.",
        stack: ["Azure SQL", "Azure DMS", "App Service", "Entra ID", "Microsoft 365", "Azure Backup"],
        benefit: "30-50% lower TCO, enterprise-grade security, scale on demand",
      },
    ],
    architectureDetails: "We're technology-agnostic: selecting the right tools for your needs, not our comfort zone.",
    techStackNodes: [
      { name: "Odoo 17", role: "Modular Enterprise ERP", category: "ERP Engine" },
      { name: "Truckmate", role: "Fleet Dispatch & Logistics TMS", category: "TMS Platform" },
      { name: "Azure", role: "Enterprise Cloud Infrastructure", category: "Cloud Vault" },
      { name: "AWS", role: "Multi-Region Cloud Microservices", category: "Cloud Vault" },
      { name: "Power BI", role: "Executive Analytics Dashboards", category: "Data Stream" },
      { name: "Python", role: "AI & Fast ETL Data Pipelines", category: "Language Core" },
      { name: "PostgreSQL", role: "Relational Ledger Database", category: "Storage Vault" },
      { name: "REST APIs", role: "High-Concurrency Integration Layer", category: "API Gateway" },
    ],
    slaHighlight: "Zero Downtime Cutover • Technology-Agnostic Architecture",
    protocolBadge: "MODERNIZATION PROTOCOL",
    protocolHeadline: "Enterprise Modernization Framework",
    nodes: [
      { label: "01. LEGACY SYSTEM WRAPPER", detail: "Safely wrap monolithic ERP/TMS APIs without operational disruption", status: "CONTAINED" },
      { label: "02. MIDDLEWARE ROUTER", detail: "Decouple data streams with Kafka & Azure Logic Apps", status: "ROUTING" },
      { label: "03. CLOUD PLATFORM DEPLOYMENT", detail: "Deploy scalable Azure/Odoo 17 cloud microservices", status: "DEPLOYED" },
    ],
  },
};

const ServiceDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();

  // Normalized slug matching
  const normalizedSlug = (slug || "").toLowerCase().replace(/\s+/g, "-");
  const slugAliases: Record<string, string> = {
    "automation-ai": "ai-automation",
    "odoo-truckmate-erp": "digital-transformation",
    "advisory": "strategic-consulting",
  };
  const resolvedSlug = slugAliases[normalizedSlug] || normalizedSlug;
  const service = serviceMap[resolvedSlug] || serviceMap["strategic-consulting"];

  const [activeNodeIdx, setActiveNodeIdx] = useState(0);
  const [activeDeliveryStep, setActiveDeliveryStep] = useState(0);
  const [selectedTechIdx, setSelectedTechIdx] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);

  const pipelinePathRefs = useRef<(SVGPathElement | null)[]>([]);
  const techBezierRefs = useRef<(SVGPathElement | null)[]>([]);
  const deliveryBezierRefs = useRef<(SVGPathElement | null)[]>([]);

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

      [...pipelinePathRefs.current, ...techBezierRefs.current, ...deliveryBezierRefs.current].forEach((path) => {
        if (path) {
          gsap.to(path, {
            strokeDashoffset: -24,
            duration: 1.2,
            repeat: -1,
            ease: "none",
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [slug]);

  // 3D Interactive Card Tilt
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    gsap.to(card, {
      rotateX,
      rotateY,
      scale: 1.01,
      duration: 0.3,
      ease: "power1.out",
      transformPerspective: 1000,
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const activeTech = service.techStackNodes[selectedTechIdx] || service.techStackNodes[0];

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
              <Link
                to="/use-cases"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-border-subtle text-fg-default font-bold hover:border-accent/40 hover:bg-bg-surface transition-all shadow-flat hover:scale-[1.02]"
              >
                <FolderGit2 className="w-4 h-4 text-accent" />
                <span>{service.secondaryCtaText}</span>
              </Link>
            </div>

            {/* Industry Ticker Strip */}
            <div className="pt-6 border-t border-border-subtle/80 flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="text-fg-dimmer font-bold uppercase tracking-wider text-[10px] mr-2">
                INDUSTRIES SERVED:
              </span>
              {industriesList.map((ind, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-border-subtle text-fg-dim font-semibold shadow-flat"
                >
                  {ind}
                </span>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE ARCHITECTURE TOPOLOGY PIPELINE DIAGRAM */}
      <section className="py-16 lg:py-20 bg-bg-base border-b border-border-subtle overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left font-mono">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-accent" /> ARCHITECTURE PIPELINE TOPOLOGY
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-fg-default font-sans">
                {service.title} Execution Flow
              </h2>
            </div>
            <div className="px-4 py-2 rounded-full bg-accent-tint border border-accent/20 text-accent-deep text-xs font-bold w-fit flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>SLA GUARANTEED &bull; PRODUCTION READY</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              {service.nodes.map((node, idx) => {
                const isSelected = activeNodeIdx === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveNodeIdx(idx)}
                    className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer shadow-flat ${
                      isSelected
                        ? "bg-white border-2 border-accent ring-2 ring-accent/20 shadow-floating scale-[1.01]"
                        : "bg-white/80 border-border-subtle hover:border-accent/40 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-accent flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-accent" /> {node.label}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {node.status}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-fg-dim font-body leading-relaxed">
                      {node.detail}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Center Animated Bezier Curve */}
            <div className="hidden lg:block lg:col-span-1 relative h-[320px] w-full flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 320" fill="none">
                {[50, 160, 270].map((yStart, idx) => (
                  <path
                    key={idx}
                    ref={(el) => (pipelinePathRefs.current[idx] = el)}
                    d={`M 0 ${yStart} C 60 ${yStart}, 40 160, 100 160`}
                    stroke="#E8622E"
                    strokeWidth={activeNodeIdx === idx ? "2.5" : "1.5"}
                    strokeDasharray="6 4"
                    opacity={activeNodeIdx === idx ? "1" : "0.3"}
                  />
                ))}
              </svg>
            </div>

            <div className="lg:col-span-5 bg-white border-2 border-accent rounded-3xl p-8 sm:p-10 shadow-floating space-y-6">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3 text-xs font-bold">
                <span className="text-accent uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent animate-pulse" /> PRODUCTION PROTOCOL SPECIFICATION
                </span>
                <span className="px-3 py-1 rounded-full bg-accent text-white font-bold text-[10px]">
                  VERIFIED
                </span>
              </div>

              <div className="p-6 bg-[#FFF5F0] border border-accent/30 rounded-2xl space-y-2 text-left">
                <div className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                  {service.protocolBadge}
                </div>
                <h3 className="font-display font-bold text-2xl text-fg-default font-sans">
                  {service.protocolHeadline}
                </h3>
              </div>

              <div className="space-y-3 text-xs font-body text-fg-default">
                <div className="font-mono font-bold text-fg-dimmer uppercase text-[10px]">
                  ACTIVE STAGE SPECIFICATION
                </div>
                <div className="p-4 bg-[#F5F4F0] rounded-xl border border-border-subtle font-mono text-xs leading-relaxed text-fg-default">
                  {service.nodes[activeNodeIdx].detail}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CAPABILITIES SECTION WITH 3D TILT CARDS */}
      <section className="py-20 lg:py-28 bg-bg-surface border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-left space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-tint text-accent-deep border border-accent/20 text-xs font-mono font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4 text-accent" />
              <span>CORE ENGINEERING SERVICES</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-fg-default tracking-tight">
              {service.capabilitiesHeader}
            </h2>
            <p className="text-base text-fg-dim font-body leading-relaxed">
              {service.capabilitiesSubtitle}
            </p>
          </div>

          <div className="space-y-6 text-left font-mono">
            {service.capabilitiesList.map((cap, idx) => (
              <div
                key={idx}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                className="p-8 bg-white border border-border-subtle rounded-3xl shadow-floating hover:border-accent transition-all space-y-5 cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
                  <h3 className="font-display font-bold text-2xl text-fg-default font-sans">
                    {cap.name}
                  </h3>
                  <span className="text-[10px] px-3 py-1 rounded-full bg-accent-tint text-accent-deep font-bold uppercase tracking-wider w-fit">
                    CAPABILITY 0{idx + 1}
                  </span>
                </div>

                <p className="text-base sm:text-lg text-fg-dim font-body leading-relaxed">
                  {cap.desc}
                </p>

                <div className="space-y-2 pt-1">
                  <div className="text-[10px] font-mono font-bold text-fg-dimmer uppercase tracking-wider">
                    TECHNOLOGY STACK
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cap.stack.map((st) => (
                      <span
                        key={st}
                        className="px-4 py-2 rounded-full bg-[#F5F4F0] border border-border-subtle text-xs font-mono font-bold text-fg-default shadow-flat hover:border-accent/40 transition-colors"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[#FFF5F0] border border-accent/30 rounded-2xl text-xs sm:text-sm font-body text-fg-default font-semibold flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <span>{cap.benefit}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. GSAP CONNECTED TECHNOLOGY STACK TOPOLOGY NODE NETWORK */}
      <section className="py-20 lg:py-28 bg-bg-base border-b border-border-subtle overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left font-mono">
          
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent-tint text-accent-deep border border-accent/25 text-xs font-mono font-bold uppercase tracking-wider shadow-flat">
              <Cpu className="w-4 h-4 text-accent" />
              <span>PROVEN TOOLS &amp; FRAMEWORKS</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-fg-default tracking-tight">
              Technology Stack Ecosystem
            </h2>
            <p className="text-base text-fg-dim font-body">
              Proven tools and frameworks connected in a unified enterprise topology
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.techStackNodes.map((tech, idx) => {
                const isSelected = selectedTechIdx === idx;
                return (
                  <div
                    key={tech.name}
                    onClick={() => setSelectedTechIdx(idx)}
                    className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer shadow-flat ${
                      isSelected
                        ? "bg-white border-2 border-accent ring-2 ring-accent/20 shadow-floating scale-[1.02]"
                        : "bg-white/80 border-border-subtle hover:border-accent/40 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-accent flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-accent" /> NODE 0{idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-accent-tint text-accent-deep text-[10px] font-bold">
                        {tech.category}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-fg-default font-sans">
                      {tech.name}
                    </h3>
                    <p className="text-xs text-fg-dim font-body mt-1">
                      {tech.role}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Center Animated Bezier Flow Wire */}
            <div className="hidden lg:block lg:col-span-1 relative h-[380px] w-full flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 380" fill="none">
                {[40, 90, 140, 190, 240, 290, 340].map((yStart, idx) => (
                  <path
                    key={idx}
                    ref={(el) => (techBezierRefs.current[idx] = el)}
                    d={`M 0 ${yStart} C 60 ${yStart}, 40 190, 100 190`}
                    stroke="#E8622E"
                    strokeWidth={selectedTechIdx === idx ? "2.5" : "1.5"}
                    strokeDasharray="6 4"
                    opacity={selectedTechIdx === idx ? "1" : "0.25"}
                  />
                ))}
              </svg>
            </div>

            <div className="lg:col-span-5 bg-white border-2 border-accent rounded-3xl p-8 sm:p-10 shadow-floating space-y-6">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3 text-xs font-bold">
                <span className="text-accent uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent animate-pulse" /> SELECTED TECH NODE
                </span>
                <span className="px-3 py-1 rounded-full bg-accent text-white font-bold text-[10px]">
                  VERIFIED ADAPTER
                </span>
              </div>

              <div className="p-6 bg-[#FFF5F0] border border-accent/30 rounded-2xl space-y-2 text-left">
                <div className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                  [{activeTech.category}]
                </div>
                <h3 className="font-display font-bold text-3xl text-fg-default font-sans">
                  {activeTech.name}
                </h3>
                <p className="text-xs text-fg-dim font-body pt-1">
                  {activeTech.role}
                </p>
              </div>

              <div className="p-5 bg-[#F5F4F0] border border-border-subtle rounded-2xl text-xs font-body text-fg-default space-y-2 text-left">
                <div className="font-mono font-bold text-accent text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-accent" /> TECHNOLOGY-AGNOSTIC COMMITMENT
                </div>
                <p className="text-fg-dim leading-relaxed">
                  We&apos;re technology-agnostic: selecting the right tools for your needs, not our comfort zone.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. GSAP CONNECTED STEPPER: HOW WE DELIVER */}
      <section className="py-20 lg:py-28 bg-bg-surface border-b border-border-subtle overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 text-left font-mono">
          
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent-tint text-accent-deep border border-accent/25 text-xs font-mono font-bold uppercase tracking-wider shadow-flat">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>THE D-BST DELIVERY STANDARD</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-fg-default tracking-tight">
              How We Deliver
            </h2>
            <p className="text-base sm:text-lg text-fg-dim font-body">
              A proven approach that combines technical excellence with business understanding
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              {deliveryPillars.map((pillar, idx) => {
                const isSelected = activeDeliveryStep === idx;
                const PillarIcon = pillar.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveDeliveryStep(idx)}
                    className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer shadow-flat ${
                      isSelected
                        ? "bg-white border-2 border-accent ring-2 ring-accent/20 shadow-floating scale-[1.01]"
                        : "bg-white/80 border-border-subtle hover:border-accent/40 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-accent flex items-center gap-2">
                        <PillarIcon className="w-4 h-4 text-accent" /> STEP {pillar.step}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-accent-tint text-accent-deep text-[10px] font-bold">
                        ACTIVE PRINCIPLE
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-xl text-fg-default font-sans mb-1">
                      {pillar.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-fg-dim font-body leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Center Animated Bezier Flow Wire */}
            <div className="hidden lg:block lg:col-span-1 relative h-[420px] w-full flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 420" fill="none">
                {[55, 160, 265, 370].map((yStart, idx) => (
                  <path
                    key={idx}
                    ref={(el) => (deliveryBezierRefs.current[idx] = el)}
                    d={`M 0 ${yStart} C 60 ${yStart}, 40 210, 100 210`}
                    stroke="#E8622E"
                    strokeWidth={activeDeliveryStep === idx ? "2.5" : "1.5"}
                    strokeDasharray="6 4"
                    opacity={activeDeliveryStep === idx ? "1" : "0.3"}
                  />
                ))}
              </svg>
            </div>

            <div className="lg:col-span-5 bg-white border-2 border-accent rounded-3xl p-8 sm:p-10 shadow-floating space-y-6">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3 text-xs font-bold">
                <span className="text-accent uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent" /> DELIVERY PRINCIPLE INSPECTOR
                </span>
                <span className="px-3 py-1 rounded-full bg-accent text-white font-bold text-[10px]">
                  VERIFIED
                </span>
              </div>

              <div className="p-6 bg-[#FFF5F0] border border-accent/30 rounded-2xl space-y-2 text-left">
                <div className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                  STEP {deliveryPillars[activeDeliveryStep].step} PRINCIPLE
                </div>
                <h3 className="font-display font-bold text-3xl text-fg-default font-sans">
                  {deliveryPillars[activeDeliveryStep].title}
                </h3>
                <p className="text-xs sm:text-sm text-fg-dim font-body pt-1 leading-relaxed">
                  {deliveryPillars[activeDeliveryStep].desc}
                </p>
              </div>

              <div className="p-4 bg-[#F5F4F0] rounded-xl border border-border-subtle font-mono text-xs leading-relaxed text-fg-default space-y-1">
                <div className="text-[10px] font-bold text-fg-dimmer uppercase tracking-wider">
                  OPERATIONAL COMMITMENT SPECIFICATION
                </div>
                <p className="text-fg-default font-semibold font-sans">
                  {deliveryPillars[activeDeliveryStep].detail}
                </p>
              </div>

              <Link
                to="/contact"
                className="w-full py-4 px-8 rounded-full bg-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-accent-deep transition-all shadow-raised hover:shadow-floating flex items-center justify-center gap-2"
              >
                <span>{service.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
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
