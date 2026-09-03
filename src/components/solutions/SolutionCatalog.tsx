import { useState, useEffect, useRef } from "react";
import { Clock, DollarSign, ArrowRight, CheckCircle2, Sparkles, X, Send, Loader2, Cpu, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface SolutionCatalogItem {
  id: string;
  title: string;
  industry: string;
  summary: string;
  timeline: string;
  priceRange: string;
  techStack: string[];
  benefits: string[];
  fullDescription: string;
  architectureHighlight: string;
}

const catalogData: SolutionCatalogItem[] = [
  {
    id: "fleet-management-system",
    title: "Fleet Management System",
    industry: "Transportation",
    summary: "Real-time tracking, route optimization, and driver management for transportation fleets.",
    timeline: "8–12 WEEKS",
    priceRange: "Custom Pricing",
    techStack: ["React", "Node.js", "PostgreSQL", "Google Maps API"],
    benefits: [
      "35% reduction in fuel costs",
      "Real-time GPS tracking and live telematics",
      "Automated compliance reporting & HOS tracking",
    ],
    fullDescription: "Comprehensive fleet telematics and dispatch management platform with live driver tracking, route optimization, and automated hours-of-service compliance reporting.",
    architectureHighlight: "Live GPS telematics stream with sub-second route recalculation.",
  },
  {
    id: "ai-customer-service-agent",
    title: "AI Customer Service Agent",
    industry: "Retail",
    summary: "24/7 intelligent chatbot handling customer inquiries with natural language understanding.",
    timeline: "4–6 WEEKS",
    priceRange: "$15,000 – $30,000",
    techStack: ["OpenAI", "Python", "React", "WebSocket"],
    benefits: [
      "70% reduction in customer response time",
      "24/7 availability across web, mobile, and messaging",
      "Multi-language natural language support",
    ],
    fullDescription: "Conversational AI customer support agent tailored to your company's product catalog, order tracking APIs, and support ticket workflows.",
    architectureHighlight: "Context-aware LLM retrieval with bi-directional CRM integration.",
  },
  {
    id: "predictive-maintenance-platform",
    title: "Predictive Maintenance Platform",
    industry: "Manufacturing",
    summary: "AI-powered equipment monitoring to predict failures before they happen.",
    timeline: "10–14 WEEKS",
    priceRange: "Custom Pricing",
    techStack: ["Python", "TensorFlow", "IoT Sensors", "React Dashboard"],
    benefits: [
      "60% reduction in unplanned equipment downtime",
      "Predictive vibration and thermal anomaly alerts",
      "Significant maintenance cost optimization",
    ],
    fullDescription: "Connects directly to machinery and vehicle telematics, streaming vibration and thermal telemetry into machine learning models that forecast component failure days in advance.",
    architectureHighlight: "Time-series anomaly forecasting with automated maintenance ticketing.",
  },
  {
    id: "retail-analytics-dashboard",
    title: "Retail Analytics Dashboard",
    industry: "Retail",
    summary: "Real-time sales, inventory, and customer insights for data-driven decisions.",
    timeline: "6–8 WEEKS",
    priceRange: "$10,000 – $25,000",
    techStack: ["Power BI", "Azure", "SQL Server", "React"],
    benefits: [
      "Real-time sales & margin reporting",
      "Multi-store inventory optimization",
      "Customer behavior and foot-traffic insights",
    ],
    fullDescription: "Consolidated retail analytics suite connecting physical POS, e-commerce storefronts, and warehouse inventories into intuitive executive dashboards.",
    architectureHighlight: "Real-time Azure data pipeline powering executive Power BI visualizations.",
  },
  {
    id: "truckmate-tms-integration",
    title: "TruckMate TMS Integration",
    industry: "Transportation",
    summary: "Seamless integration and upgrade consulting for Trimble TruckMate transportation management.",
    timeline: "4–8 WEEKS",
    priceRange: "Custom Pricing",
    techStack: ["TruckMate API", ".NET", "SQL Server", "React"],
    benefits: [
      "Smooth TruckMate version upgrades & cloud migration",
      "Automated bill-of-lading (BOL) data extraction",
      "Custom load dispatch & billing API connectors",
    ],
    fullDescription: "End-to-end consulting, customization, and upgrade implementation for fleets running Trimble TruckMate TMS. Includes custom BOL parsers and route dispatch connectors.",
    architectureHighlight: "High-throughput TruckMate API connector with automated data validation.",
  },
  {
    id: "odoo-erp-implementation",
    title: "Odoo ERP Implementation",
    industry: "Manufacturing",
    summary: "Complete ERP solution for manufacturing, inventory, accounting, and HR.",
    timeline: "12–20 WEEKS",
    priceRange: "Custom Pricing",
    techStack: ["Odoo", "Python", "PostgreSQL", "React"],
    benefits: [
      "Unified business management across departments",
      "End-to-end inventory & manufacturing automation",
      "Real-time enterprise financial visibility",
    ],
    fullDescription: "Custom deployment and configuration of Odoo ERP across manufacturing scheduling, warehouse inventory, general ledger accounting, and sales pipelines.",
    architectureHighlight: "Modular Odoo ERP implementation with tailored Python business logic.",
  },
  {
    id: "energy-optimization-platform",
    title: "Energy Optimization Platform",
    industry: "Sustainable Energy",
    summary: "Monitor and optimize energy consumption for sustainable operations.",
    timeline: "8–12 WEEKS",
    priceRange: "$20,000 – $40,000",
    techStack: ["IoT Sensors", "Python", "React", "Time Series DB"],
    benefits: [
      "25% average energy cost reduction",
      "Continuous carbon footprint and emissions tracking",
      "Predictive consumption & peak-load optimization",
    ],
    fullDescription: "Industrial energy telemetry platform that monitors facility electricity, gas, and renewable power feeds to identify waste and optimize consumption schedules.",
    architectureHighlight: "Automated load-shifting algorithms reducing peak demand tariff penalties.",
  },
  {
    id: "financial-risk-assessment-tool",
    title: "Financial Risk Assessment Tool",
    industry: "Financial",
    summary: "AI-powered risk analysis and compliance monitoring for financial services.",
    timeline: "10–16 WEEKS",
    priceRange: "Custom Pricing",
    techStack: ["Python", "TensorFlow", "Azure", "React"],
    benefits: [
      "Automated risk scoring algorithms",
      "Strict regulatory compliance & AML monitoring",
      "Instant transaction anomaly screening",
    ],
    fullDescription: "Automates KYC verification, AML compliance checking, and risk scoring across loan, investment, and client portfolios with audit-ready reporting.",
    architectureHighlight: "Secure Azure-hosted compliance rules engine with human-in-the-loop review.",
  },
  {
    id: "azure-sql-migration",
    title: "SQL Server → Azure SQL Migration",
    industry: "Cloud",
    summary: "Migrate on-premise SQL Server workloads to Azure SQL with zero data loss and minimal downtime.",
    timeline: "4–8 WEEKS",
    priceRange: "Custom Pricing",
    techStack: ["Azure SQL", "Azure DMS", "SSMA", "Azure Monitor"],
    benefits: [
      "Zero data loss guaranteed migration",
      "30–50% lower total cost of ownership (TCO)",
      "Built-in high availability, automated backups, and patching",
    ],
    fullDescription: "Full database assessment, schema conversion, and live replication migrating on-premise SQL Server workloads to managed Azure SQL databases.",
    architectureHighlight: "Azure Database Migration Service pipeline with zero downtime cutover.",
  },
  {
    id: "azure-smb-starter-pack",
    title: "Azure for SMB Starter Pack",
    industry: "Cloud",
    summary: "Get cloud-ready in weeks: Entra ID, Microsoft 365, Azure Backup, and secure networking.",
    timeline: "3–6 WEEKS",
    priceRange: "$8,000 – $20,000",
    techStack: ["Entra ID", "Microsoft 365", "Azure Backup", "Intune"],
    benefits: [
      "Centralized identity & Single Sign-On (SSO)",
      "Automated immutable cloud backups",
      "Modern workplace security and endpoint management",
    ],
    fullDescription: "Turnkey cloud modernization package for small-to-medium businesses migrating off aging on-premise servers into a secure Microsoft 365 and Azure environment.",
    architectureHighlight: "Standardized Azure cloud blueprint with Microsoft security best practices.",
  },
  {
    id: "cloud-cost-optimization",
    title: "Cloud Cost Optimization",
    industry: "Cloud",
    summary: "Cut Azure spend 20–40% with rightsizing, reserved instances, and architectural review.",
    timeline: "2–4 WEEKS",
    priceRange: "Outcome-Based",
    techStack: ["Azure Cost Management", "Azure Advisor", "Terraform", "FinOps"],
    benefits: [
      "20–40% immediate Azure cost reduction",
      "Compute & storage rightsizing and cleanup",
      "Optimized reserved instance & savings plan allocation",
    ],
    fullDescription: "Comprehensive FinOps and architectural audit of your Azure infrastructure, eliminating unused resources and optimizing reservations.",
    architectureHighlight: "Automated resource scaling and lifecycle policies cutting idle compute spend.",
  },
];

const categories = ["All", "Transportation", "Retail", "Manufacturing", "Financial", "Sustainable Energy", "Cloud"];

export const SolutionCatalog = () => {
  const { toast } = useToast();
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [proposalModalItem, setProposalModalItem] = useState<SolutionCatalogItem | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalForm, setModalForm] = useState({ name: "", email: "", notes: "" });

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Alternating Left & Right Airborne GSAP Entrance Animation
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;

        const isLeft = idx % 2 === 0;

        gsap.fromTo(
          card,
          {
            x: isLeft ? -90 : 90,
            y: 40,
            rotate: isLeft ? -3 : 3,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [selectedIndustry]);

  const filteredSolutions = selectedIndustry === "All"
    ? catalogData
    : catalogData.filter((item) => item.industry === selectedIndustry);

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.name || !modalForm.email) {
      toast({
        title: "Missing Fields",
        description: "Please enter your name and email address.",
        variant: "destructive",
      });
      return;
    }

    setModalLoading(true);
    setTimeout(() => {
      setModalLoading(false);
      toast({
        title: "Blueprint Proposal Requested",
        description: `Thank you. A D-BST Senior Architect will dispatch proposal specs for "${proposalModalItem?.title}" within 24 hours.`,
      });
      setProposalModalItem(null);
      setModalForm({ name: "", email: "", notes: "" });
    }, 1000);
  };

  return (
    <section ref={containerRef} className="py-16 lg:py-24 bg-bg-base border-b border-border-subtle selection:bg-accent-tint selection:text-accent-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Industry Pill Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {categories.map((cat) => {
            const isActive = selectedIndustry === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedIndustry(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-accent text-white shadow-floating scale-105"
                    : "bg-white border border-border-subtle text-fg-dim hover:text-fg-default hover:border-accent/40 hover:bg-bg-surface shadow-flat"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Full Open Cards Grid with Left/Right Airborne Scroll Animations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          {filteredSolutions.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => (cardsRef.current[idx] = el)}
              className="p-8 sm:p-10 rounded-3xl border border-border-subtle hover:border-accent bg-white shadow-floating flex flex-col justify-between space-y-7 text-left transition-all duration-300 hover:-translate-y-1.5 group relative overflow-hidden"
            >
              <div className="space-y-6">
                
                {/* Top Header: Industry Tag + Timeline & Price */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle/80 pb-4 font-mono text-xs">
                  <span className="px-3.5 py-1 rounded-full bg-accent-tint text-accent-deep font-bold text-xs shadow-flat">
                    {item.industry}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-fg-dim">
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5F4F0] border border-border-subtle">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      <span>{item.timeline}</span>
                    </span>
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5F4F0] border border-border-subtle text-fg-default">
                      <DollarSign className="w-3.5 h-3.5 text-accent" />
                      <span>{item.priceRange}</span>
                    </span>
                  </div>
                </div>

                {/* Title & Summary */}
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-fg-default tracking-tight leading-snug group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-fg-dim font-body leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Architecture Highlight Spec */}
                <div className="p-4 bg-accent-tint/60 border border-accent/30 rounded-2xl font-mono text-xs space-y-1">
                  <div className="font-bold text-accent flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-accent" /> D-BST ARCHITECTURE HIGHLIGHT
                  </div>
                  <p className="text-fg-default font-body text-xs leading-relaxed pt-0.5">
                    {item.architectureHighlight}
                  </p>
                </div>

                {/* Tech Stack Chips */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-fg-dimmer">
                    CORE TECHNOLOGY STACK
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full bg-white border border-border-subtle text-xs font-mono text-fg-default font-bold shadow-flat"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Full Details Box (Always Open & Detailed) */}
                <div className="p-6 sm:p-7 bg-[#F5F4F0] border border-border-subtle rounded-2xl space-y-4 font-mono text-xs shadow-flat">
                  <p className="text-xs text-fg-default font-body leading-relaxed">
                    {item.fullDescription}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-border-subtle">
                    <div className="text-xs font-mono font-bold uppercase text-accent flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-accent" /> PROVEN BUSINESS ROI &amp; IMPACT:
                    </div>
                    <div className="space-y-2">
                      {item.benefits.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2.5 text-xs text-fg-dim font-body leading-snug">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Button Footer */}
              <div className="pt-6 border-t border-border-subtle/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-fg-dim font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Production Ready SLA
                </span>

                <button
                  onClick={() => setProposalModalItem(item)}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-accent-deep transition-all shadow-flat hover:shadow-floating"
                >
                  <span>Request Proposal Blueprint</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* PROPOSAL BLUEPRINT MODAL */}
      {proposalModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-bg-base border border-accent/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-floating relative text-left font-mono space-y-6">
            
            <button
              onClick={() => setProposalModalItem(null)}
              className="absolute top-5 right-5 p-1 rounded-full bg-bg-surface hover:bg-accent-tint text-fg-dim hover:text-accent transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-accent">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>REQUEST PROPOSAL BLUEPRINT</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-fg-default font-sans">
                {proposalModalItem.title}
              </h3>
              <p className="text-xs text-fg-dim font-body">
                {proposalModalItem.summary}
              </p>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-fg-default">Full Name *</label>
                <input
                  type="text"
                  placeholder="Alex Morgan"
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default text-sm font-body focus:outline-none focus:border-accent shadow-flat"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-fg-default">Work Email *</label>
                <input
                  type="email"
                  placeholder="alex@enterprise.com"
                  value={modalForm.email}
                  onChange={(e) => setModalForm({ ...modalForm, email: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default text-sm font-body focus:outline-none focus:border-accent shadow-flat"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-fg-default">Custom Notes / Timeline</label>
                <textarea
                  rows={3}
                  placeholder="Briefly state your target launch window or current tech stack..."
                  value={modalForm.notes}
                  onChange={(e) => setModalForm({ ...modalForm, notes: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default text-sm font-body focus:outline-none focus:border-accent resize-none shadow-flat"
                />
              </div>

              <button
                type="submit"
                disabled={modalLoading}
                className="w-full py-4 rounded-xl bg-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-accent-deep transition-all shadow-raised flex items-center justify-center gap-2"
              >
                {modalLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SUBMIT BLUEPRINT PROPOSAL REQUEST</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-[10px] font-mono text-fg-dim text-center flex items-center justify-center gap-1.5 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Automated 24-Hour Architect SLA Response Guarantee</span>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
