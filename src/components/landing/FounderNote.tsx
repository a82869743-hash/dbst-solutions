import { useState, useEffect, useRef } from "react";
import ceoPhoto from "@/assets/ceo-photo.jpg";
import { ShieldCheck, HeartHandshake, Flame, ChevronDown, CheckCircle2, Quote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const coreValues = [
  {
    name: "Integrity",
    tagline: "Uncompromising technical truth.",
    detail: "We never over-promise or recommend unnecessary stack bloat. If a simpler architecture solves your problem, that is what we scope.",
    icon: ShieldCheck,
  },
  {
    name: "Care",
    tagline: "Deep ownership of customer outcomes.",
    detail: "We treat your production environment with the same rigor as our own infrastructure, taking full end-to-end accountability.",
    icon: HeartHandshake,
  },
  {
    name: "GRIT",
    tagline: "Relentless execution on complex systems.",
    detail: "When legacy migrations or hard integration bottlenecks emerge, our senior engineers push through until the system is bulletproof.",
    icon: Flame,
  },
];

export const FounderNote = () => {
  const [expandedValue, setExpandedValue] = useState<string | null>(coreValues[0].name);
  const containerRef = useRef<HTMLDivElement>(null);
  const letterCardRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  // Robust GSAP Entrance with clearProps: "all" so elements NEVER stay opacity 0
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (letterCardRef.current) {
        gsap.fromTo(
          letterCardRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: letterCardRef.current,
              start: "top 85%",
            },
          }
        );
      }

      if (valuesRef.current) {
        gsap.fromTo(
          valuesRef.current.children,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: valuesRef.current,
              start: "top 90%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-bg-surface/50 border-y border-border-subtle relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Founder Letter Card */}
        <div ref={letterCardRef} className="p-8 sm:p-12 bg-white border border-border-subtle rounded-3xl shadow-floating card-bezel max-w-5xl mx-auto space-y-10 text-left">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-7">
            {/* Framed Founder Photo with Verified Badge */}
            <div className="relative shrink-0">
              <img
                src={ceoPhoto}
                alt="Bimal Thakkar — Founder & Principal Consultant"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white shadow-floating ring-1 ring-border-subtle"
              />
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-accent text-white text-xs font-mono flex items-center justify-center font-bold shadow-flat">
                ✓
              </div>
            </div>

            {/* Note Content */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2 text-accent">
                <Quote className="w-5 h-5 fill-accent/10 text-accent" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">FROM OUR FOUNDER</span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-4xl text-fg-default tracking-tight leading-tight">
                Technology Should Create Practical Value
              </h2>
              <p className="text-base sm:text-lg text-fg-dim leading-relaxed font-body italic">
                &ldquo;At D-BST Solutions, we begin with the business problem, not a preferred technology. We listen, challenge assumptions and bring strategy, architecture and engineering together to deliver solutions that are practical, secure and built to evolve. Our responsibility is not simply to complete a project, but to help create value that lasts.&rdquo;
              </p>
              <div className="text-xs font-mono text-fg-default pt-2 border-t border-border-subtle/60 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-fg-default">Bimal Thakkar</span>
                  <span className="text-fg-dimmer">&bull;</span>
                  <span className="text-fg-dim">Founder &amp; Principal Consultant</span>
                  <span className="text-fg-dimmer">&bull;</span>
                  <span className="text-accent font-bold">D-BST Solutions</span>
                </div>
                <span className="text-fg-dimmer text-[11px]">20+ years across transport, retail and enterprise transformation</span>
              </div>
            </div>
          </div>

          {/* Interactive Core Values Row */}
          <div className="pt-8 border-t border-border-subtle space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-fg-dimmer">
              HOW WE WORK
            </div>
            
            <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coreValues.map((val) => {
                const IconComponent = val.icon;
                const isExpanded = expandedValue === val.name;

                return (
                  <div
                    key={val.name}
                    onClick={() => setExpandedValue(isExpanded ? null : val.name)}
                    className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 card-bezel ${
                      isExpanded
                        ? "bg-accent-tint/60 border-accent shadow-raised"
                        : "bg-white/80 border-border-subtle/80 hover:border-accent/40 hover:bg-white shadow-flat"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-base text-fg-default mb-2">
                      <span className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${isExpanded ? "bg-accent text-white" : "bg-white text-accent border border-border-subtle"}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="font-display font-bold">{val.name}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-fg-dim transition-transform duration-300 ${
                          isExpanded ? "rotate-180 text-accent" : ""
                        }`}
                      />
                    </div>
                    
                    <p className="text-xs text-fg-dim font-medium leading-relaxed font-body">
                      {val.tagline}
                    </p>

                    {isExpanded && (
                      <div className="text-xs text-fg-default mt-3 pt-3 border-t border-accent/20 leading-relaxed font-body animate-in fade-in duration-200 space-y-1">
                        <p>{val.detail}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
