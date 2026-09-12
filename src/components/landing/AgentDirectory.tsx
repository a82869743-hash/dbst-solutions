import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck, Store, Search, ChevronDown, MessageCircle, Send, Loader2, Sparkles,
  Navigation, Package, MapPin, ShieldCheck, Fuel, Clock, Wallet,
  BarChart3, Boxes, Users, FileText, ShoppingCart, Megaphone
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface UseCase {
  id: string;
  icon: typeof Truck;
  title: string;
  description: string;
  capabilities: string[];
}

const USE_CASES: Record<"transportation" | "retail", UseCase[]> = {
  transportation: [
    { id: "fleet-mgmt", icon: Navigation, title: "Fleet Management AI", description: "Comprehensive fleet visibility with predictive maintenance, driver performance scoring, and real-time health monitoring.", capabilities: ["Vehicle Health Monitoring", "Driver Analytics", "Fuel Optimization", "Predictive Maintenance"] },
    { id: "route-opt", icon: MapPin, title: "Route Optimization", description: "AI-powered dynamic routing that adapts to traffic, weather, and delivery constraints in real time.", capabilities: ["Dynamic Recalculation", "Multi-Stop Planning", "Traffic Integration", "Cost Reduction"] },
    { id: "freight-track", icon: Package, title: "Freight Tracking", description: "End-to-end shipment visibility with predictive ETAs and automated exception handling.", capabilities: ["Real-Time GPS Tracking", "Predictive ETA", "Exception Alerts", "Multi-Carrier Support"] },
    { id: "compliance", icon: ShieldCheck, title: "Compliance Automation", description: "Automate regulatory compliance, documentation, and audit trails across your fleet operations.", capabilities: ["Regulatory Updates", "Document Management", "Audit Logging", "Safety Scoring"] },
    { id: "fuel-analytics", icon: Fuel, title: "Fuel & Carbon Analytics", description: "Track fuel consumption patterns, identify waste, and measure carbon footprint across your entire fleet in real time.", capabilities: ["Consumption Tracking", "Carbon Reporting", "Idle Detection", "Green Route Suggestions"] },
    { id: "driver-sched", icon: Clock, title: "Driver Scheduling AI", description: "Intelligent shift planning that balances driver availability, HOS compliance, and delivery deadlines automatically.", capabilities: ["HOS Compliance", "Shift Optimization", "Fatigue Prediction", "Demand Matching"] },
    { id: "rate-bid", icon: Wallet, title: "Rate & Bid Management", description: "AI-powered freight rate quoting and bid analysis that maximizes margin while staying competitive in real-time markets.", capabilities: ["Dynamic Pricing", "Market Analysis", "Bid Scoring", "Margin Optimization"] },
  ],
  retail: [
    { id: "demand-forecast", icon: BarChart3, title: "Demand Forecasting", description: "Predict sales trends with ML models trained on historical data, seasonality, and external signals.", capabilities: ["Seasonal Prediction", "Trend Analysis", "Stock Planning", "Revenue Optimization"] },
    { id: "inv-intel", icon: Boxes, title: "Inventory Intelligence", description: "Smart inventory management with automated reorder points and warehouse optimization.", capabilities: ["Automated Reordering", "Stockout Prevention", "Warehouse Optimization", "Supplier Insights"] },
    { id: "last-mile", icon: Navigation, title: "Last-Mile Delivery AI", description: "Optimize delivery routes, predict arrival times, and improve customer satisfaction scores.", capabilities: ["Route Optimization", "Delivery Windows", "Driver Assignment", "Customer Notifications"] },
    { id: "cust-insights", icon: Users, title: "Customer Insights", description: "AI-driven customer segmentation, behavior analysis, and personalized engagement strategies.", capabilities: ["Behavior Segmentation", "Churn Prediction", "Personalization", "Lifetime Value Analysis"] },
    { id: "dyn-pricing", icon: FileText, title: "Dynamic Pricing Engine", description: "Adjust product pricing in real time based on competitor data, demand signals, and inventory levels to maximize revenue.", capabilities: ["Competitor Monitoring", "Price Elasticity", "Margin Rules", "A/B Testing"] },
    { id: "returns-fraud", icon: ShoppingCart, title: "Returns & Fraud Prevention", description: "AI agents that detect fraudulent returns, automate RMA workflows, and reduce reverse-logistics costs.", capabilities: ["Fraud Detection", "RMA Automation", "Refund Scoring", "Pattern Analysis"] },
    { id: "campaign-ai", icon: Megaphone, title: "Omnichannel Campaign AI", description: "Orchestrate personalized marketing campaigns across email, SMS, push, and social channels using real-time customer signals.", capabilities: ["Cross-Channel Sync", "Audience Targeting", "Send-Time Optimization", "ROI Attribution"] },
  ],
};

const STREAM_URL = `${import.meta.env.VITE_SUPABASE_URL || "https://pmfyqcmoqrgxfplugqid.supabase.co"}/functions/v1/use-case-qa`;

type Msg = { role: "user" | "assistant"; content: string };

const InlineAIChat = ({ useCase }: { useCase: UseCase }) => {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: `Ask me anything about **${useCase.title}** (${useCase.capabilities.join(", ")}).`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    setInput("");

    const userMsg: Msg = { role: "user", content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsStreaming(true);

    let accumulated = "";
    const upsertAssistant = (chunk: string) => {
      accumulated += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > newMessages.length) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: accumulated } : m));
        }
        return [...prev.slice(0, newMessages.length), { role: "assistant", content: accumulated }];
      });
    };

    try {
      const resp = await fetch(STREAM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages, useCase }),
      });

      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) upsertAssistant(c);
          } catch {
            break;
          }
        }
      }
    } catch {
      upsertAssistant("\n\n*Connection error. Please try asking again.*");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="mt-6 rounded-md bg-bg-base border border-border-subtle p-4 font-sans space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
        <Sparkles className="h-3.5 w-3.5" /> Live Agent Q&amp;A
      </div>

      <div ref={scrollRef} className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-xs p-3 rounded-md ${
              m.role === "user"
                ? "bg-accent text-white font-medium ml-auto max-w-[85%]"
                : "bg-bg-surface border border-border-subtle text-fg-default max-w-[95%]"
            }`}
          >
            {m.role === "assistant" ? (
              <div className="prose prose-xs max-w-none dark:prose-invert">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            ) : (
              m.content
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`Ask about ${useCase.title}...`}
          className="flex-1 rounded-md border border-border-subtle bg-bg-surface px-3 py-2 text-xs text-fg-default focus:outline-none focus:border-accent"
          disabled={isStreaming}
        />
        <button
          onClick={send}
          disabled={isStreaming || !input.trim()}
          className="rounded-md bg-accent px-3 py-2 text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
        >
          {isStreaming ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
};

const AgentDirectory = () => {
  const [industry, setIndustry] = useState<"transportation" | "retail">("transportation");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("fleet-mgmt");

  const items = USE_CASES[industry].filter(
    (uc) =>
      uc.title.toLowerCase().includes(search.toLowerCase()) ||
      uc.description.toLowerCase().includes(search.toLowerCase()) ||
      uc.capabilities.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <section id="usecases" className="bg-bg-base py-20 md:py-28 border-b border-border-subtle">
      <div className="container">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="inline-block rounded-full bg-accent-dim px-3.5 py-1 text-xs font-semibold text-accent mb-3">
            Product Catalog
          </span>
          <h2 className="text-3xl font-extrabold text-fg-default sm:text-5xl font-display tracking-tight">
            Agent Directory &amp; Capabilities
          </h2>
          <p className="mt-3 text-base text-fg-dim">
            Browse domain-tailored AI agents ready for enterprise integration. Click any agent row to test inline capabilities.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="grid gap-6 md:grid-cols-12 items-center mb-8">
          {/* Segmented Industry Filter */}
          <div className="md:col-span-6 flex items-center gap-1 rounded-md bg-bg-muted p-1 border border-border-subtle w-fit">
            <button
              onClick={() => {
                setIndustry("transportation");
                setExpandedId(USE_CASES.transportation[0].id);
              }}
              className={`flex items-center gap-2 rounded-md px-5 py-2 text-xs font-semibold transition-all ${
                industry === "transportation"
                  ? "bg-bg-surface text-fg-default shadow-flat"
                  : "text-fg-dim hover:text-fg-default"
              }`}
            >
              <Truck className="h-4 w-4 text-accent" /> Transportation &amp; Logistics
            </button>

            <button
              onClick={() => {
                setIndustry("retail");
                setExpandedId(USE_CASES.retail[0].id);
              }}
              className={`flex items-center gap-2 rounded-md px-5 py-2 text-xs font-semibold transition-all ${
                industry === "retail"
                  ? "bg-bg-surface text-fg-default shadow-flat"
                  : "text-fg-dim hover:text-fg-default"
              }`}
            >
              <Store className="h-4 w-4 text-accent" /> Retail &amp; E-Commerce
            </button>
          </div>

          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-dimmer" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agent capabilities, titles, or features..."
              className="w-full rounded-md border border-border-subtle bg-bg-surface pl-10 pr-4 py-2.5 text-xs text-fg-default focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Accordion Rows List */}
        <div className="space-y-3">
          {items.map((uc) => {
            const isExpanded = expandedId === uc.id;
            const IconComponent = uc.icon;

            return (
              <div
                key={uc.id}
                className={`rounded-md border transition-all duration-200 ${
                  isExpanded
                    ? "border-accent/40 bg-bg-surface shadow-raised"
                    : "border-border-subtle bg-bg-surface hover:border-fg-dimmer/40"
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : uc.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-dim text-accent">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-fg-default font-display">
                        {uc.title}
                      </h3>
                      <p className="text-xs text-fg-dim line-clamp-1 mt-0.5">
                        {uc.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-block text-[11px] font-mono text-fg-dimmer">
                      {uc.capabilities.length} Capabilities
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-fg-dim transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-accent" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Accordion Body */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-border-subtle"
                    >
                      <div className="p-6 bg-bg-surface">
                        <p className="text-sm text-fg-dim leading-relaxed">
                          {uc.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {uc.capabilities.map((cap) => (
                            <span
                              key={cap}
                              className="rounded-full bg-accent-dim px-3 py-1 text-xs font-semibold text-accent"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>

                        {/* Embedded Inline Streaming Chat */}
                        <InlineAIChat useCase={uc} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="p-12 text-center text-fg-dim bg-bg-surface rounded-md border border-border-subtle">
              No matching agents found. Try adjusting your search query.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AgentDirectory;
