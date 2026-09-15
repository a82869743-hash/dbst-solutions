import { useState } from "react";
import { Link } from "react-router-dom";
import { Truck, ShoppingBag, Factory, Building2, Landmark, ChevronDown, CheckCircle2, Terminal, ArrowRight, Sparkles } from "lucide-react";

interface CaseFile {
  id: string;
  industry: string;
  icon: typeof Truck;
  title: string;
  topResult: string;
  challenge: string;
  solution: string;
  technicalReadout: string;
  resultsChecklist: string[];
}

const caseFiles: CaseFile[] = [
  {
    id: "case-doc-automation",
    industry: "Transportation",
    icon: Truck,
    title: "Fleet Document Processing Automation",
    topResult: "87% Time Reduction • 99.4% Parsing Accuracy",
    challenge: "Logistics company processing 500+ paper delivery documents daily. Manual data entry caused 4-6 hour reporting delays and 8% billing error rate.",
    solution: "Built custom intelligent document processing system with OCR, automated data extraction, validation against TMS data, and direct ERP integration.",
    technicalReadout: "STACK: Python • React • PostgreSQL • OCR Engine • TruckMate TMS Integration • REST APIs",
    resultsChecklist: [
      "87% reduction in document processing turnaround time",
      "Billing error rate dropped from 8% to under 0.3%",
      "Real-time delivery confirmation and customer invoice generation",
      "65% reduction in administrative processing overhead",
    ],
  },
  {
    id: "case-truckmate-upgrade",
    industry: "Transportation",
    icon: Truck,
    title: "TruckMate System Integration & Upgrade",
    topResult: "Zero Operational Downtime • 40% Faster Invoicing",
    challenge: "Mid-size freight carrier running an outdated TruckMate version with heavily siloed operational data and manual dispatch workarounds.",
    solution: "Executed seamless TruckMate version upgrade, developed custom bi-directional APIs, and integrated mobile driver dispatch workflows.",
    technicalReadout: "STACK: Trimble TruckMate • .NET • SQL Server • Azure Cloud • Custom Mobile Driver App",
    resultsChecklist: [
      "Upgraded legacy TruckMate version with zero operational disruption",
      "40% faster invoicing cycle through automated dispatch integration",
      "Real-time driver location and load status tracking across fleet",
      "Automated fuel and compliance reporting eliminating manual audits",
    ],
  },
  {
    id: "case-ai-customer-service",
    industry: "Retail",
    icon: ShoppingBag,
    title: "AI Customer Service Agent",
    topResult: "70% Support Time Reduction • 24/7 Multi-Channel Coverage",
    challenge: "Fast-growing e-commerce retailer overwhelmed with 2,000+ daily customer queries regarding order tracking, returns, and inventory stock.",
    solution: "Implemented an intelligent conversational AI agent integrated with Shopify, order management, and customer support ticketing.",
    technicalReadout: "STACK: Enterprise AI Engine • Python • React • WebSockets • Shopify API • Zendesk Connector",
    resultsChecklist: [
      "70% reduction in customer response and resolution times",
      "82% of tier-1 support queries resolved without human agent involvement",
      "24/7 instant order tracking and automated return label issuance",
      "Customer satisfaction (CSAT) rating increased from 3.6 to 4.8 / 5",
    ],
  },
  {
    id: "case-retail-analytics",
    industry: "Retail",
    icon: ShoppingBag,
    title: "Omnichannel Retail Analytics Platform",
    topResult: "18% Less Stockouts • Unified Cross-Channel Reporting",
    challenge: "Multi-location retail chain with fragmented data across in-store POS, Shopify, and warehouse management systems, leading to stockouts and excess inventory.",
    solution: "Engineered centralized data warehouse and Power BI executive dashboards providing real-time inventory visibility and sales forecasting.",
    technicalReadout: "STACK: Power BI • Azure SQL • Python ETL Pipelines • Shopify REST • POS Webhooks",
    resultsChecklist: [
      "Unified sales and inventory view across 18 store locations and online",
      "18% reduction in stockouts through automated velocity reordering",
      "Executive dashboards updated in real time vs 5-day month-end lag",
      "Optimized seasonal promotional discounting based on elasticity data",
    ],
  },
  {
    id: "case-predictive-maintenance",
    industry: "Manufacturing",
    icon: Factory,
    title: "Predictive Maintenance IPA",
    topResult: "60% Less Unplanned Downtime • $1.2M Annual Savings",
    challenge: "Industrial manufacturer faced 15% unplanned equipment downtime. Reactive repairs cost over $1.2M annually with zero advance warning on bearing failure.",
    solution: "Implemented intelligent predictive maintenance combining vibration/thermal IoT sensors with machine learning failure prediction algorithms.",
    technicalReadout: "STACK: Python • TensorFlow • MQTT IoT Sensors • Time Series DB • React Dashboard",
    resultsChecklist: [
      "60% reduction in unplanned factory line breakdowns",
      "Early warning alerts provided 10 to 14 days prior to component failure",
      "Saved $1.2M annually in emergency maintenance and replacement costs",
      "Automated preventive work-order creation in plant management software",
    ],
  },
  {
    id: "case-odoo-erp",
    industry: "Manufacturing",
    icon: Factory,
    title: "Odoo ERP Complete Implementation",
    topResult: "Complete ERP Unification • 35% Faster Order-to-Cash",
    challenge: "Manufacturing company running disconnected systems for inventory, production planning, accounting, and sales quotes, leading to order delays.",
    solution: "Complete end-to-end Odoo ERP implementation with custom modules tailored to multi-stage assembly, inventory bill of materials, and invoicing.",
    technicalReadout: "STACK: Odoo 17 • Python • PostgreSQL • Docker • Custom Manufacturing Add-ons",
    resultsChecklist: [
      "Replaced 5 disparate software tools with a single unified ERP suite",
      "Order-to-cash cycle time accelerated by 35%",
      "Real-time inventory valuation and automated material requirement planning",
      "Full visibility into job costing and production line scrap rates",
    ],
  },
  {
    id: "case-project-management",
    industry: "Enterprise",
    icon: Landmark,
    title: "Project Management & Resource Optimization",
    topResult: "95% On-Time Delivery • 30% Higher Resource Utilization",
    challenge: "Professional services firm managing 20+ concurrent client projects suffered from resource allocation conflicts, budget overruns, and delayed reporting.",
    solution: "Built custom project management and resource scheduling platform with real-time cost tracking, client portals, and automated reporting.",
    technicalReadout: "STACK: React • Node.js • PostgreSQL • Google Workspace API • Document Automation",
    resultsChecklist: [
      "30% improvement in billable resource utilization across teams",
      "95% on-time project milestone delivery rate achieved",
      "Self-service client visibility portals eliminating status update emails",
      "25% reduction in administrative project coordination overhead",
    ],
  },
  {
    id: "case-compliance-automation",
    industry: "Financial",
    icon: Landmark,
    title: "Compliance & Risk Assessment Automation",
    topResult: "85% Time Reduction • 99.7% Verification Accuracy",
    challenge: "Financial services firm spending 200+ hours per month on manual compliance checks, customer KYC reviews, and risk assessments across client accounts.",
    solution: "AI-powered system automating KYC verification, transaction screening, risk scoring, and regulatory audit trail generation with human review for edge cases.",
    technicalReadout: "STACK: Python • Azure Cognitive Services • SQL Server • Compliance Rules Engine",
    resultsChecklist: [
      "85% time reduction in recurring compliance and KYC audits",
      "99.7% document parsing and identity verification accuracy rate",
      "Real-time risk alerts and transaction anomaly notifications",
      "Audit-ready regulatory documentation generated on demand",
    ],
  },
];

const tabs = ["All", "Transportation", "Retail", "Manufacturing", "Financial", "Enterprise"];

export const CaseFileExplorer = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [expandedId, setExpandedId] = useState<string>("case-logistics");

  const filteredCases = activeTab === "All"
    ? caseFiles
    : caseFiles.filter((item) => item.industry === activeTab);

  return (
    <section className="py-16 lg:py-24 bg-bg-base border-b border-border-subtle selection:bg-accent-tint selection:text-accent-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Industry Pill Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-accent text-white shadow-floating scale-105"
                    : "bg-white border border-border-subtle text-fg-dim hover:text-fg-default hover:border-accent/40 hover:bg-bg-surface shadow-flat"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Pro Agency Case Files List */}
        <div className="space-y-6 text-left">
          {filteredCases.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-6 shadow-floating text-left bg-white card-bezel ${
                  isExpanded
                    ? "border-accent ring-1 ring-accent/20"
                    : "border-border-subtle hover:border-accent/60"
                }`}
              >
                {/* Header Row */}
                <div
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? "" : item.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`p-3 rounded-2xl transition-colors ${isExpanded ? "bg-accent text-white shadow-flat" : "bg-accent-tint text-accent"}`}>
                      <Icon className="w-6 h-6 shrink-0" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                        <span className="px-3 py-0.5 rounded-full bg-accent-tint text-accent-deep font-bold text-[11px]">
                          {item.industry}
                        </span>
                        <span className="text-[10px] text-fg-dimmer font-bold">&bull; VERIFIED CASE FILE</span>
                      </div>
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-fg-default tracking-tight leading-snug">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <span className="hidden md:inline-block font-mono text-xs text-accent font-bold bg-[#FFF5F0] px-4 py-1.5 rounded-full border border-accent/30 shadow-flat">
                      {item.topResult}
                    </span>
                    <button
                      className={`p-2.5 rounded-full transition-all ${
                        isExpanded ? "bg-accent-tint text-accent" : "bg-bg-muted text-fg-dim"
                      }`}
                      aria-label="Expand case details"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded Content Details */}
                {isExpanded && (
                  <div className="pt-4 border-t border-border-subtle animate-in fade-in duration-200 space-y-6">
                    
                    {/* Challenge vs Solution Split */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="p-6 bg-bg-surface border border-border-subtle/80 rounded-2xl space-y-2 font-mono text-xs shadow-flat card-bezel">
                        <div className="font-bold text-fg-default uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-fg-dim" /> 1. OPERATIONAL CHALLENGE
                        </div>
                        <p className="text-[14px] text-fg-dim font-body leading-relaxed pt-1">
                          {item.challenge}
                        </p>
                      </div>

                      <div className="p-6 bg-bg-surface border border-border-subtle/80 rounded-2xl space-y-2 font-mono text-xs shadow-flat card-bezel">
                        <div className="font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-accent" /> 2. D-BST ARCHITECTURE &amp; DELIVERY
                        </div>
                        <p className="text-[14px] text-fg-default font-body leading-relaxed pt-1">
                          {item.solution}
                        </p>
                      </div>
                    </div>

                    {/* Technical Readout Line */}
                    <div className="p-4 bg-[#18191B] border border-white/10 text-white rounded-2xl font-mono text-xs flex items-center gap-3 shadow-flat">
                      <Terminal className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-zinc-300 font-semibold">{item.technicalReadout}</span>
                    </div>

                    {/* Results Checklist */}
                    <div className="space-y-3 font-mono text-xs">
                      <div className="font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-accent" /> VERIFIED PROJECT DELIVERABLES &amp; ROI:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {item.resultsChecklist.map((res, idx) => (
                          <div key={idx} className="p-3.5 bg-white border border-border-subtle/80 rounded-xl text-[13.5px] text-fg-default font-body flex items-start gap-2.5 shadow-flat card-bezel">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                            <span className="font-medium">{res}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Footer with Button-in-Button Trailing Icon */}
                    <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                      <span className="text-fg-dim">
                        Have a similar system challenge in your organization?
                      </span>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-accent-deep transition-all shadow-flat hover:shadow-floating group"
                      >
                        <span>Schedule Architectural Review</span>
                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                          <ArrowRight className="w-3 h-3" />
                        </span>
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
