import { useState, useEffect, useRef } from "react";
import { Calendar, Mail, Phone, Clock, ArrowRight, CheckCircle2, ShieldCheck, MessageSquare, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AdminStore, SiteContentConfig } from "@/lib/admin/adminStore";

gsap.registerPlugin(ScrollTrigger);

export const ConsultationPanel = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [contentConfig, setContentConfig] = useState<SiteContentConfig>(() => AdminStore.getContent("dbst"));
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    notes: "",
  });

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

  const containerRef = useRef<HTMLDivElement>(null);
  const panelCardRef = useRef<HTMLDivElement>(null);

  // Robust GSAP Entrance with clearProps: "all" so elements NEVER stay opacity 0
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (panelCardRef.current) {
        gsap.fromTo(
          panelCardRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: panelCardRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      toast({
        title: "Missing Required Fields",
        description: "Please enter your name and work email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await AdminStore.recordInquiry({
        name: formData.fullName,
        email: formData.email,
        company: formData.company,
        message: formData.notes,
        serviceInterest: "Executive Architecture Consultation",
        source: "dbst",
      });

      toast({
        title: "Consultation Request Dispatched",
        description: "Thank you. A D-BST Senior Solutions Architect will reach out within 24 hours.",
      });
      setFormData({ fullName: "", email: "", company: "", notes: "" });
    } catch (err) {
      toast({
        title: "Submission Error",
        description: "Please email info@dbstsolutions.com directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={containerRef} className="py-20 lg:py-28 bg-bg-surface border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Consultation Panel Card */}
        <div ref={panelCardRef} className="p-8 sm:p-12 bg-white border border-border-subtle rounded-3xl shadow-floating max-w-5xl mx-auto text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-7">
              
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-tint text-accent-deep border border-accent/20 text-xs font-mono font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>START A CONVERSATION</span>
                </div>

                <h2 className="font-display font-bold text-3xl sm:text-4xl text-fg-default tracking-tight leading-tight">
                  Let&rsquo;s Discuss What You&rsquo;re Trying to Improve
                </h2>

                <p className="text-sm sm:text-base text-fg-dim font-body leading-relaxed">
                  You do not need a finished brief. Tell us what is happening today and the outcome you want to achieve. We&rsquo;ll help determine whether D-BST is the right fit and suggest a practical next step.
                </p>
              </div>

              {/* Secondary Direct Calendly CTA */}
              <div className="pt-2">
                <a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-accent-deep transition-all shadow-flat hover:shadow-floating"
                >
                  <Calendar className="w-4 h-4" />
                  <span>BOOK A DISCOVERY CONVERSATION</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Direct Support Details */}
              <div className="pt-6 border-t border-border-subtle space-y-3 font-mono text-xs text-fg-dim">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <a href={`mailto:${contentConfig.contactEmail || "info@dbstsolutions.com"}`} className="font-bold text-fg-default hover:text-accent transition-colors">
                    {contentConfig.contactEmail || "info@dbstsolutions.com"}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-accent shrink-0" />
                  <a href={`tel:${(contentConfig.contactPhone || "+61430981166").replace(/\s+/g, "")}`} className="hover:text-accent transition-colors">
                    {contentConfig.contactPhone || "+61 430 981 166"} &bull; Direct Technical Desk
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-accent shrink-0" />
                  <span>Melbourne, Australia &bull; Serving Asia Pacific and North America</span>
                </div>
              </div>

            </div>

            {/* Right Light-Grey Form Box */}
            <div className="lg:col-span-7 bg-[#F5F4F0] border border-border-subtle rounded-2xl p-6 sm:p-8 space-y-5 shadow-flat">
              
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 font-mono text-xs text-left">
                    <label className="font-bold text-fg-default flex items-center justify-between">
                      <span>Full Name</span>
                      <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Alex Morgan"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default placeholder:text-fg-dimmer text-sm font-body focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all shadow-flat"
                    />
                  </div>

                  <div className="space-y-1.5 font-mono text-xs text-left">
                    <label className="font-bold text-fg-default flex items-center justify-between">
                      <span>Work Email</span>
                      <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="alex@enterprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default placeholder:text-fg-dimmer text-sm font-body focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all shadow-flat"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 font-mono text-xs text-left">
                  <label className="font-bold text-fg-default">Company / Organization Name</label>
                  <input
                    type="text"
                    placeholder="Apex Logistics Ltd."
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default placeholder:text-fg-dimmer text-sm font-body focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all shadow-flat"
                  />
                </div>

                <div className="space-y-1.5 font-mono text-xs text-left">
                  <label className="font-bold text-fg-default">Tell Us About Your Challenge *</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what is happening today, who it affects and what a better outcome would look like. Please do not include passwords, personal information or confidential customer data."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-white border border-border-subtle text-fg-default placeholder:text-fg-dimmer text-sm font-body focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none shadow-flat"
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
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>SEND ENQUIRY</span>
                    </>
                  )}
                </button>

              </form>

              <div className="text-[10px] font-mono text-fg-dim text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>By submitting, you agree that D-BST Solutions may contact you regarding your enquiry. See our Privacy Policy.</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
