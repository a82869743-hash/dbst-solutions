import { useState, useEffect, useRef } from "react";
import { Calendar, Mail, Phone, Clock, ArrowRight, CheckCircle2, ShieldCheck, MessageSquare, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AdminStore } from "@/lib/admin/adminStore";

gsap.registerPlugin(ScrollTrigger);

export const ConsultationPanel = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    notes: "",
  });

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
                  <span>DIRECT CONSULTATION</span>
                </div>

                <h2 className="font-display font-bold text-3xl sm:text-4xl text-fg-default tracking-tight leading-tight">
                  Schedule Your Free Engineering Consultation
                </h2>

                <p className="text-sm sm:text-base text-fg-dim font-body leading-relaxed">
                  Connect directly with a D-BST senior solutions architect. We will review your current software stack, operational bottlenecks, and scope a concrete implementation plan.
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
                  <span>BOOK CALENDLY CALL DIRECTLY</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Direct Support Details */}
              <div className="pt-6 border-t border-border-subtle space-y-3 font-mono text-xs text-fg-dim">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <span className="font-bold text-fg-default">info@dbstsolutions.com</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-accent shrink-0" />
                  <span>+61 430 981 166 &bull; Direct Technical Desk</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-accent shrink-0" />
                  <span>24-Hour SLA Response Commitment</span>
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
                  <label className="font-bold text-fg-default">Project Notes / Technical Requirements</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your existing system stack, timeline, or key objectives..."
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
                      <span>SUBMIT CONSULTATION REQUEST</span>
                    </>
                  )}
                </button>

              </form>

              <div className="text-[10px] font-mono text-fg-dim text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>NDA &amp; Confidentiality Automatically Applied to All Inquiries</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
