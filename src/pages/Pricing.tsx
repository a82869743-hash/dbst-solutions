import { useState } from "react";
import { Send, MessageSquare, ShieldCheck, Zap, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { AdminStore } from "@/lib/admin/adminStore";

type CompanySize = "1-25" | "26-100" | "100+";
type UserCount = "1-10" | "11-50" | "50+";

const PlanEstimator = () => {
  const { toast } = useToast();
  const [fleetSize, setFleetSize] = useState<CompanySize>("26-100");
  const [userCount, setUserCount] = useState<UserCount>("11-50");
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  // Live Tier Badge Logic
  const getTier = () => {
    if (fleetSize === "100+" || userCount === "50+") return { label: "Enterprise Tier", desc: "Dedicated MCP server cluster, 24/7 SLA & custom agent engineering" };
    if (fleetSize === "26-100" || userCount === "11-50") return { label: "Scale Tier", desc: "Multi-agent workflows, ERP/TMS integrations & advanced analytics" };
    return { label: "Growth Tier", desc: "Core agent framework, pre-built integrations & standard support" };
  };

  const currentTier = getTier();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setSubmitting(true);
    try {
      await AdminStore.recordInquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company?.trim() || undefined,
        message: form.message?.trim() || `Fleet Scale: ${fleetSize}, User Count: ${userCount}`,
        serviceInterest: `Pricing Estimator: ${currentTier.label} (${fleetSize} fleet, ${userCount} users)`,
        source: "dbst",
      });

      toast({
        title: "Inquiry received!",
        description: `Thank you ${form.name}! We'll send pricing details for your ${currentTier.label} within 24 hours.`,
      });
      setForm({ name: "", email: "", company: "", message: "" });
    } catch {
      toast({
        title: "Submission Error",
        description: "Please email info@dbstsolutions.com directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-fg-default font-body">
      <Navbar />

      <section className="container py-16 md:py-24">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-14">
          <span className="inline-block rounded-full bg-accent-dim px-3.5 py-1 text-xs font-semibold text-accent mb-3">
            Custom Enterprise Quotes
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-display">
            Plan &amp; Scope Estimator
          </h1>
          <p className="mt-4 text-base text-fg-dim max-w-xl mx-auto">
            Select your operational scale below to see recommended platform tier options and get a tailored proposal.
          </p>
        </div>

        {/* Two-Part Layout */}
        <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Interactive Estimator Controls (5 cols) */}
          <div className="lg:col-span-5 rounded-md bg-bg-surface border border-border-subtle p-6 shadow-raised space-y-6">
            <h2 className="text-lg font-bold text-fg-default font-display border-b border-border-subtle pb-3">
              1. Estimate Scale
            </h2>

            {/* Fleet / Company Size Control */}
            <div>
              <label className="block text-xs font-semibold text-fg-dim uppercase tracking-wider mb-2">
                Fleet / Company Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["1-25", "26-100", "100+"] as CompanySize[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFleetSize(val)}
                    className={`py-2.5 px-3 rounded-md text-xs font-semibold border transition-all ${
                      fleetSize === val
                        ? "bg-accent text-white border-accent shadow-flat"
                        : "bg-bg-base text-fg-dim border-border-subtle hover:border-fg-dimmer"
                    }`}
                  >
                    {val} vehicles
                  </button>
                ))}
              </div>
            </div>

            {/* Active User Count Control */}
            <div>
              <label className="block text-xs font-semibold text-fg-dim uppercase tracking-wider mb-2">
                Active System Users
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["1-10", "11-50", "50+"] as UserCount[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setUserCount(val)}
                    className={`py-2.5 px-3 rounded-md text-xs font-semibold border transition-all ${
                      userCount === val
                        ? "bg-accent text-white border-accent shadow-flat"
                        : "bg-bg-base text-fg-dim border-border-subtle hover:border-fg-dimmer"
                    }`}
                  >
                    {val} users
                  </button>
                ))}
              </div>
            </div>

            {/* Live Tier Output Badge */}
            <div className="rounded-md bg-accent-dim border border-accent/30 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-accent font-bold">
                  RECOMMENDED TIER
                </span>
                <span className="rounded-full bg-accent text-white text-[10px] font-bold px-2.5 py-0.5">
                  Custom Quote
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-accent font-display">
                {currentTier.label}
              </h3>
              <p className="text-xs text-fg-dim leading-relaxed">
                {currentTier.desc}
              </p>
            </div>

            <div className="space-y-2 text-xs text-fg-dim pt-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent shrink-0" /> Unlimited agent executions
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-accent shrink-0" /> Full MCP Server access
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent shrink-0" /> Enterprise Security &amp; SAML SSO
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form (7 cols) */}
          <div className="lg:col-span-7 rounded-md bg-bg-surface border border-border-subtle p-8 shadow-raised">
            <div className="flex items-center gap-3 mb-6 border-b border-border-subtle pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-dim text-accent">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-fg-default font-display">2. Request Tailored Proposal</h2>
                <p className="text-xs text-fg-dim">Fill in your details and our team will prepare a custom proposal.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="pricing-name" className="block text-xs font-semibold text-fg-default mb-1.5">
                  Full Name <span className="text-signal-warm">*</span>
                </label>
                <input
                  id="pricing-name"
                  type="text"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full rounded-md border border-border-subtle bg-bg-base px-4 py-2.5 text-xs text-fg-default focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label htmlFor="pricing-email" className="block text-xs font-semibold text-fg-default mb-1.5">
                  Work Email <span className="text-signal-warm">*</span>
                </label>
                <input
                  id="pricing-email"
                  type="email"
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full rounded-md border border-border-subtle bg-bg-base px-4 py-2.5 text-xs text-fg-default focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label htmlFor="pricing-company" className="block text-xs font-semibold text-fg-default mb-1.5">
                  Company Name
                </label>
                <input
                  id="pricing-company"
                  type="text"
                  placeholder="Acme Logistics Inc."
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full rounded-md border border-border-subtle bg-bg-base px-4 py-2.5 text-xs text-fg-default focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label htmlFor="pricing-message" className="block text-xs font-semibold text-fg-default mb-1.5">
                  Use-Case Requirements &amp; Goals
                </label>
                <textarea
                  id="pricing-message"
                  placeholder="Describe what workflows you're looking to automate (e.g. route optimization, driver scheduling, freight rate quoting)..."
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-md border border-border-subtle bg-bg-base px-4 py-2.5 text-xs text-fg-default focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-flat"
              >
                {submitting ? "Sending Request..." : "Request Proposal & Pricing"}
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlanEstimator;
