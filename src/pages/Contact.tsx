import { useState } from "react";
import { DbstNavigation } from "@/components/navigation/DbstNavigation";
import { DbstFooter } from "@/components/navigation/DbstFooter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import {
  Mail, Phone, MapPin, Clock, ShieldCheck, CheckCircle2, ArrowRight,
  Building2, MessageSquare, Calendar, Loader2, Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const serviceOptions = [
  "Custom Software Engineering",
  "AI Automation & Workflows",
  "Data Analytics & Intelligence",
  "Digital Transformation",
  "Strategic Advisory & Consulting",
  "General Inquiry / Partnership",
];

const budgetRanges = [
  "Under $25k",
  "$25k - $50k",
  "$50k - $100k",
  "$100k+",
  "Flexible / To Be Scoped",
];

import { AdminStore, SiteContentConfig } from "@/lib/admin/adminStore";

const ContactPage = () => {
  useDocumentMeta({
    title: "Contact & Scoping Intake | D-BST Solutions",
    description: "Schedule a technical scoping session with D-BST Solutions engineering principals or submit custom software requirements.",
  });

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [contentConfig, setContentConfig] = useState<SiteContentConfig>(() => AdminStore.getContent("dbst"));

  useEffect(() => {
    AdminStore.fetchRemoteContent("dbst").then((remote) => {
      if (remote) setContentConfig(remote);
    });
    const handleUpdate = () => setContentConfig(AdminStore.getContent("dbst"));
    window.addEventListener("admin_content_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("admin_content_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    service: serviceOptions[0],
    budget: budgetRanges[2],
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      toast({
        title: "Missing Required Fields",
        description: "Please provide your name and work email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await AdminStore.recordInquiry({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        serviceInterest: `${formData.service} (${formData.budget})`,
        message: formData.notes,
        source: "dbst",
      });

      toast({
        title: "Message Sent Successfully!",
        description: "Thank you. A D-BST Solutions Engineer will reach out within 24 hours.",
      });
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        service: serviceOptions[0],
        budget: budgetRanges[2],
        notes: "",
      });
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: "Could not submit inquiry. Please try again or email info@dbstsolutions.com directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-fg-default font-body antialiased selection:bg-accent-tint selection:text-accent-deep">
      <DbstNavigation />
      
      <main className="pt-12 pb-24">
        
        {/* Page Hero Header */}
        <section className="py-12 bg-bg-surface border-b border-border-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-tint text-accent-deep border border-accent/20 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>DIRECT ENGINEERING INTAKE</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-fg-default tracking-tight">
              Get in Touch with <span className="text-accent">D-BST Engineering</span>
            </h1>
            <p className="text-base sm:text-lg text-fg-dim font-body max-w-2xl mx-auto">
              Schedule a technical scoping session with our engineering principals or submit your system architecture requirements below.
            </p>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
              
              {/* Left Column: Office Info & Direct Support Cards */}
              <div className="lg:col-span-5 space-y-8 font-mono">
                
                {/* Direct Consultation Card */}
                <div className="p-8 bg-white border border-border-subtle rounded-3xl shadow-floating space-y-6">
                  <div className="flex items-center justify-between text-xs border-b border-border-subtle pb-3">
                    <span className="font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent" /> FAST TRACK CALL
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-accent-tint text-accent-deep font-bold text-[10px]">
                      CALENDLY
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="font-display font-bold text-2xl text-fg-default font-sans">
                      Schedule a 30-Min Scoping Call
                    </h2>
                    <p className="text-xs text-fg-dim font-body leading-relaxed">
                      Prefer an immediate video call? Book directly on our lead architect&apos;s calendar for a 1-on-1 architecture review.
                    </p>
                  </div>

                  <a
                    href="https://calendly.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 w-full py-4 rounded-xl bg-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-accent-deep transition-all shadow-flat hover:shadow-floating"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>BOOK CALENDLY CALL DIRECTLY</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Office Locations */}
                <div className="p-8 bg-white border border-border-subtle rounded-3xl shadow-floating space-y-6">
                  <div className="text-xs font-bold text-fg-dimmer uppercase tracking-wider border-b border-border-subtle pb-3">
                    GLOBAL HEADQUARTERS &amp; HUBS
                  </div>

                  <div className="space-y-5 text-xs text-fg-dim font-body">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-fg-default font-mono">San Francisco Headquarters</div>
                        <p className="text-xs text-fg-dim pt-0.5">500 Howard Street, Suite 400, San Francisco, CA 94105</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-fg-default font-mono">Sydney Engineering Hub</div>
                        <p className="text-xs text-fg-dim pt-0.5">100 Barangaroo Avenue, Tower 3, Sydney NSW 2000</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-fg-default font-mono">Direct Technical Email</div>
                        <a href={`mailto:${contentConfig.contactEmail || "info@dbstsolutions.com"}`} className="text-xs text-fg-dim hover:text-accent pt-0.5 font-mono transition-colors block">
                          {contentConfig.contactEmail || "info@dbstsolutions.com"}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-fg-default font-mono">24/7 Technical Desk</div>
                        <a href={`tel:${(contentConfig.contactPhone || "+61430981166").replace(/\s+/g, "")}`} className="text-xs text-fg-dim hover:text-accent pt-0.5 font-mono transition-colors block">
                          {contentConfig.contactPhone || "+61 430 981 166"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commitment Box */}
                <div className="p-6 bg-[#FFF5F0] border border-accent/30 rounded-2xl space-y-2 text-xs">
                  <div className="font-bold text-accent flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" /> 24-HOUR SLA RESPONSE GUARANTEE
                  </div>
                  <p className="text-fg-dim font-body text-xs leading-relaxed">
                    All technical intake inquiries receive a direct response from a senior principal within 24 business hours.
                  </p>
                </div>

              </div>

              {/* Right Column: Full Intake Form */}
              <div className="lg:col-span-7 bg-[#F5F4F0] border border-border-subtle rounded-3xl p-8 sm:p-10 shadow-floating space-y-6">
                
                <div className="space-y-2 border-b border-border-subtle pb-4">
                  <h2 className="font-display font-bold text-2xl text-fg-default">
                    Submit Project Intake Form
                  </h2>
                  <p className="text-xs text-fg-dim font-body">
                    Fill out the technical requirements below to receive a custom architecture scope and estimate.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-fg-default flex items-center justify-between">
                        <span>Full Name</span>
                        <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Alex Morgan"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default text-sm font-body focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all shadow-flat"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-fg-default flex items-center justify-between">
                        <span>Work Email</span>
                        <span className="text-accent">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="alex@enterprise.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default text-sm font-body focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all shadow-flat"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-fg-default">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default text-sm font-body focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all shadow-flat"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-fg-default">Company Name</label>
                      <input
                        type="text"
                        placeholder="Apex Logistics Ltd."
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default text-sm font-body focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all shadow-flat"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-fg-default">Primary Service Practice</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default text-xs font-mono focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all shadow-flat"
                      >
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-fg-default">Target Budget Range</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default text-xs font-mono focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all shadow-flat"
                      >
                        {budgetRanges.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-fg-default">Project Description / System Requirements</label>
                    <textarea
                      rows={4}
                      placeholder="Detail your existing tech stack, legacy bottlenecks, or project objectives..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default text-sm font-body focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none shadow-flat"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-accent-deep transition-all shadow-raised hover:shadow-floating flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting Intake...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>SUBMIT TECHNICAL INTAKE FORM</span>
                      </>
                    )}
                  </button>

                </form>

                <div className="text-[10px] font-mono text-fg-dim text-center flex items-center justify-center gap-1.5 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>Strict NDA &amp; SOC2 Data Confidentiality Automatically Enforced</span>
                </div>

              </div>

            </div>
          </div>
        </section>

      </main>

      <DbstFooter />
    </div>
  );
};

export default ContactPage;
