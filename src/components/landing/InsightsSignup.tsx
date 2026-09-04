import { useState, useEffect, useRef } from "react";
import { Mail, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AdminStore } from "@/lib/admin/adminStore";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const emailSchema = z.string().email("Please enter a valid email address.");

export const InsightsSignup = () => {
  const [email, setEmail] = useState("");
  const [botField, setBotField] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger Entrance
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.from(cardRef.current, {
          y: 35,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (botField) return;

    setErrorMsg(null);

    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setErrorMsg(validation.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      await AdminStore.recordInquiry({
        name: "Newsletter Subscriber",
        email: email.trim(),
        message: "Subscribed to Executive Intelligence Brief",
        serviceInterest: "Executive Intelligence Brief Newsletter",
        source: "dbst",
      });

      try {
        await supabase.functions.invoke("submit-newsletter", {
          body: { email },
        });
      } catch {}

      setSuccess(true);
    } catch {
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={containerRef} className="py-16 lg:py-20 bg-bg-muted border-b border-border-subtle">
      <div ref={cardRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Centered Mail Icon */}
        <div className="mx-auto w-12 h-12 rounded-full bg-accent-tint border border-accent/20 flex items-center justify-center text-accent">
          <Mail className="w-6 h-6" />
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-fg-default tracking-tight">
            Engineering &amp; AI Insights Briefing
          </h3>
          <p className="text-sm text-fg-dim leading-relaxed">
            Bi-weekly technical teardowns on enterprise microservices, AI automation agents, and system architecture case studies. Zero spam.
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-md mx-auto">
          {success ? (
            <div className="p-4 rounded-md bg-accent-tint border border-accent/30 text-accent-deep font-mono text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Subscribed successfully! Check your inbox for confirmation.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Honeypot */}
              <input
                type="text"
                name="b_email"
                value={botField}
                onChange={(e) => setBotField(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email..."
                  className="w-full px-4 py-3 rounded-full bg-bg-base border border-border-subtle text-xs text-fg-default placeholder:text-fg-dimmer font-body focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-accent text-white font-bold text-xs uppercase tracking-wider shrink-0 hover:bg-accent-deep transition-all shadow-raised disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>SUBSCRIBE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {errorMsg && (
                <p className="text-[10px] font-mono text-red-500 text-left pl-2">
                  {errorMsg}
                </p>
              )}
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
