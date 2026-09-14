import { useState, useEffect } from "react";
import { DbstNavigation } from "@/components/navigation/DbstNavigation";
import { DbstFooter } from "@/components/navigation/DbstFooter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import {
  Mail, Phone, MapPin, Clock, ShieldCheck, CheckCircle2, ArrowRight,
  Building2, MessageSquare, Calendar, Loader2, Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { AdminStore, SiteContentConfig } from "@/lib/admin/adminStore";

const serviceOptions = [
  "AI Engineering and Adoption",
  "Enterprise and Solution Architecture",
  "Digital Transformation and Advisory",
  "Custom Software and System Integration",
  "Data Analytics and Business Intelligence",
  "Transport Technology and TruckMate",
  "Growthmates AI",
  "Not Sure Yet",
];

const budgetRanges = [
  "Under $25k",
  "$25k - $50k",
  "$50k - $100k",
  "$100k+",
  "Flexible / To Be Scoped",
];

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
              <span>START A CONVERSATION</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-fg-default tracking-tight">
              Let&apos;s Discuss What You&apos;re Trying to <span className="text-accent">Improve</span>
            </h1>
            <p className="text-base sm:text-lg text-fg-dim font-body max-w-2xl mx-auto">
              You do not need a finished brief. Tell us what is happening today and the outcome you want to achieve. We&apos;ll help determine whether D-BST is the right fit and suggest a practical next step.
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
                      <Calendar className="w-4 h-4 text-accent" /> DISCOVERY SESSION
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-accent-tint text-accent-deep font-bold text-xs">
                      DIRECT CALL
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="font-display font-bold text-2xl text-fg-default font-sans">
                      Book a Discovery Conversation
                    </h2>
                    <p className="text-sm text-fg-dim font-body leading-relaxed">
                      Speak directly with a D-BST principal consultant to explore your business problem, constraints, and whether D-BST is the right fit.
                    </p>
                  </div>

                  <a
                    href="https://calendly.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 w-full py-4 rounded-xl bg-accent text-white font-bold text-[13px] uppercase tracking-wider hover:bg-accent-deep transition-all shadow-flat hover:shadow-floating"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>BOOK A DISCOVERY CONVERSATION</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Office Locations */}
                <div className="p-8 bg-white border border-border-subtle rounded-3xl shadow-floating space-y-6">
                  <div className="text-[13px] font-bold text-fg-dimmer uppercase tracking-wider border-b border-border-subtle pb-3">
                    OFFICE &amp; COVERAGE
                  </div>

                  <div className="space-y-5 text-[13.5px] text-fg-dim font-body">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-fg-default font-mono">Melbourne, Australia</div>
                        <p className="text-[13.5px] text-fg-dim pt-0.5">Serving Asia Pacific and North America</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-fg-default font-mono">Email</div>
                        <a href="mailto:info@dbstsolutions.com" className="text-[13.5px] text-fg-dim hover:text-accent pt-0.5 font-mono transition-colors block">
                          info@dbstsolutions.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-fg-default font-mono">Direct Phone</div>
                        <a href="tel:+61430981166" className="text-[13.5px] text-fg-dim hover:text-accent pt-0.5 font-mono transition-colors block">
                          +61 430 981 166
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commitment Box */}
                <div className="p-6 bg-[#FFF5F0] border border-accent/30 rounded-2xl space-y-2 text-xs">
                  <div className="font-bold text-accent flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" /> DIRECT DISCOVERY CONVERSATION
                  </div>
                  <p className="text-fg-dim font-body text-[13.5px] leading-relaxed">
                    We listen, challenge assumptions, and suggest practical next steps focused on tangible operational outcomes.
                  </p>
                </div>

              </div>

              {/* Right Column: Full Intake Form */}
              <div className="lg:col-span-7 bg-[#F5F4F0] border border-border-subtle rounded-3xl p-8 sm:p-10 shadow-floating space-y-6">
                
                <div className="space-y-2 border-b border-border-subtle pb-4">
                  <h2 className="font-display font-bold text-2xl text-fg-default">
                    Send an Enquiry
                  </h2>
                  <p className="text-sm text-fg-dim font-body">
                    Tell us what is happening today and the outcome you want to achieve.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 font-mono text-[13px]">
                  
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
                        placeholder="+61 400 000 000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default text-sm font-body focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all shadow-flat"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-fg-default">Company or Organisation</label>
                      <input
                        type="text"
                        placeholder="Apex Operations Ltd."
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default text-sm font-body focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all shadow-flat"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-fg-default">How Can We Help?</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default text-sm font-mono focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all shadow-flat"
                    >
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-fg-default">Tell Us About Your Challenge *</label>
                    <textarea
                      rows={4}
                      placeholder="Briefly describe what is happening today, who it affects and what a better outcome would look like. Please do not include passwords, personal information or confidential customer data."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default text-sm font-body focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none shadow-flat"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-accent text-white font-bold text-[13px] uppercase tracking-wider hover:bg-accent-deep transition-all shadow-raised hover:shadow-floating flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>SEND ENQUIRY →</span>
                      </>
                    )}
                  </button>

                </form>

                <div className="text-[13px] font-body text-fg-dim text-center pt-2 leading-relaxed">
                  By submitting this form, you agree that D-BST Solutions may contact you regarding your enquiry. Please review our Privacy Policy for information about how submitted details are handled.
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
