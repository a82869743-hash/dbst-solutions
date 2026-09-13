import { motion } from "framer-motion";
import {
  ArrowUpRight, CalendarDays, Clock, MapPin, Sparkles, Truck, Store, BrainCircuit, ShieldCheck, Cpu, BarChart3, QrCode, ArrowRight
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ScrollReveal from "@/components/landing/ScrollReveal";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const CALENDLY_URL = "https://calendly.com/d-bstsolutions/book-your-free-consultation";

const openCalendly = () => (window as any).Calendly?.initPopupWidget({ url: CALENDLY_URL });

const MegaTrans = () => {
  useDocumentMeta({
    title: "Meet us at MegaTrans 2026 — Melbourne",
    description:
      "Come meet GrowthMates.ai at MegaTrans 2026, Australia's largest logistics & supply chain expo. Visit our Startup POD at the Melbourne Convention & Exhibition Centre, 16-17 September 2026.",
    url: "/megatrans",
    type: "website",
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#14171F] font-body">
      <Navbar />

      {/* Main Hero Container with Multi-Modal Logistics Background */}
      <section className="py-12 md:py-16 bg-[#FAF9F6]">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Large Hero Banner Box */}
          <ScrollReveal variant="scale">
            <div
              className="relative overflow-hidden rounded-3xl text-white p-8 md:p-14 shadow-2xl min-h-[600px] flex flex-col justify-between border-2 border-[#2E5EFF]/40"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(16, 23, 53, 0.82) 0%, rgba(16, 23, 53, 0.6) 50%, rgba(16, 23, 53, 0.4) 100%), url('/images/megatrans-bg.png')`,
                backgroundPosition: "center 30%",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Top Text Content inside Banner */}
              <div className="relative z-10 max-w-3xl space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#16214F]/90 backdrop-blur-md border border-white/30 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-lg">
                  <Sparkles className="h-3.5 w-3.5 text-[#FF6A3D]" /> WE DELIVER · MEGATRANS 2026 STARTUP POD #04
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-[1.08] text-white [text-shadow:_0_4px_12px_rgba(0,0,0,0.8)]">
                  Why Transportation Leaders Choose GrowthMates AI
                </h1>
                
                <p className="text-base md:text-lg text-white/90 font-medium max-w-2xl font-body leading-relaxed [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)]">
                  Come meet us at Australia’s largest integrated logistics and supply chain expo. Visit our Startup POD at MCEC Melbourne to see live agentic decision execution.
                </p>
              </div>

              {/* Bottom 4 Glassmorphism Cards Grid */}
              <div className="relative z-10 mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                
                {/* Card 1 */}
                <div className="rounded-2xl bg-[#16214F]/85 backdrop-blur-md border border-white/25 p-5 hover:bg-[#16214F]/95 hover:border-white/50 transition-all duration-300 shadow-2xl">
                  <div className="flex items-center gap-3 mb-2.5 text-[#7C97FF]">
                    <Truck className="h-5 w-5" />
                    <span className="text-xs font-mono uppercase font-bold text-white/90">FLEET DISPATCH</span>
                  </div>
                  <h3 className="text-base font-bold font-display text-white mb-1.5">
                    Autonomous Fleet Dispatch
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Multi-stop route optimisation, real-time traffic rerouting, and lane margin enforcement.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="rounded-2xl bg-[#16214F]/85 backdrop-blur-md border border-white/25 p-5 hover:bg-[#16214F]/95 hover:border-white/50 transition-all duration-300 shadow-2xl">
                  <div className="flex items-center gap-3 mb-2.5 text-[#FF6A3D]">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="text-xs font-mono uppercase font-bold text-white/90">GOVERNANCE</span>
                  </div>
                  <h3 className="text-base font-bold font-display text-white mb-1.5">
                    Security-First Design
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed">
                    SOC2 compliant runtime, zero-trust memory isolation, and SAML 2.0 SSO enterprise authentication.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="rounded-2xl bg-[#16214F]/85 backdrop-blur-md border border-white/25 p-5 hover:bg-[#16214F]/95 hover:border-white/50 transition-all duration-300 shadow-2xl">
                  <div className="flex items-center gap-3 mb-2.5 text-[#7C97FF]">
                    <Cpu className="h-5 w-5" />
                    <span className="text-xs font-mono uppercase font-bold text-white/90">PARTNERSHIP</span>
                  </div>
                  <h3 className="text-base font-bold font-display text-white mb-1.5">
                    Hands-On Partnership
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Embedded collaboration with engineering teams to deploy pre-built transport agents in days.
                  </p>
                </div>

                {/* Card 4 */}
                <div className="rounded-2xl bg-[#16214F]/85 backdrop-blur-md border border-white/25 p-5 hover:bg-[#16214F]/95 hover:border-white/50 transition-all duration-300 shadow-2xl">
                  <div className="flex items-center gap-3 mb-2.5 text-[#1FAA59]">
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-xs font-mono uppercase font-bold text-white/90">PROVEN ROI</span>
                  </div>
                  <h3 className="text-base font-bold font-display text-white mb-1.5">
                    Proven Methodologies
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Frameworks for high-volume, scalable transport operations with measurable operational improvements.
                  </p>
                </div>

              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Boarding Pass Style Ticket Stub Strip */}
      <section className="py-12 bg-[#FAF9F6] border-b border-[#E7E5DE]">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal variant="fade-up">
            <div className="mx-auto max-w-4xl rounded-3xl bg-white border-2 border-[#2E5EFF]/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
              
              {/* Top Pass Header Bar */}
              <div className="flex justify-between items-center border-b border-[#E7E5DE] pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#2E5EFF] uppercase tracking-wider">
                    MEGATRANS 2026 VIP EVENT PASS
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#1FAA59] animate-ping" />
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6A3D] text-white px-3 py-1 text-xs font-mono font-bold">
                  STARTUP POD #04
                </div>
              </div>

              {/* Ticket Stub Grid with Perforated Lines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-center relative">
                <div className="hidden md:block absolute top-0 bottom-0 left-1/4 w-px border-r-2 border-dashed border-[#E7E5DE]" />
                <div className="hidden md:block absolute top-0 bottom-0 left-2/4 w-px border-r-2 border-dashed border-[#E7E5DE]" />
                <div className="hidden md:block absolute top-0 bottom-0 left-3/4 w-px border-r-2 border-dashed border-[#E7E5DE]" />

                {/* Stub 1 */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[#5B616E] text-xs font-mono font-bold uppercase">
                    <CalendarDays className="h-4 w-4 text-[#2E5EFF]" /> DATES
                  </div>
                  <p className="text-base font-bold text-[#14171F] font-display">16–17 Sept 2026</p>
                  <p className="text-xs text-[#8B8F99] font-mono">2-Day Expo Pass</p>
                </div>

                {/* Stub 2 */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[#5B616E] text-xs font-mono font-bold uppercase">
                    <Clock className="h-4 w-4 text-[#2E5EFF]" /> HOURS
                  </div>
                  <p className="text-base font-bold text-[#14171F] font-display">10am – 5pm</p>
                  <p className="text-xs text-[#8B8F99] font-mono">Daily Expo Hours</p>
                </div>

                {/* Stub 3 */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[#5B616E] text-xs font-mono font-bold uppercase">
                    <MapPin className="h-4 w-4 text-[#2E5EFF]" /> VENUE
                  </div>
                  <p className="text-base font-bold text-[#14171F] font-display">MCEC Melbourne</p>
                  <p className="text-xs text-[#8B8F99] font-mono">South Wharf VIC</p>
                </div>

                {/* Stub 4 (QR Code Ticket Badge) */}
                <div className="space-y-1.5 flex flex-col items-start md:items-end justify-center">
                  <div className="flex items-center gap-2 text-[#5B616E] text-xs font-mono font-bold uppercase">
                    <QrCode className="h-4 w-4 text-[#FF6A3D]" /> POD ENTRY
                  </div>
                  <button
                    onClick={openCalendly}
                    className="rounded-xl bg-[#2E5EFF] px-4 py-2 text-xs font-bold text-white hover:bg-[#1B3BB3] transition-all shadow-md flex items-center gap-1.5"
                  >
                    Reserve Pass <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Upgraded "Why Stop By Our POD" Bento Cards Section */}
      <section className="py-20 md:py-28 bg-[#FAF9F6] border-b border-[#E7E5DE]">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          
          <ScrollReveal variant="fade-up">
            <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
              <span className="text-xs font-mono font-bold text-[#2E5EFF] uppercase tracking-wider bg-[#EEF1FF] px-3.5 py-1 rounded-full border border-[#2E5EFF]/20">
                LIVE DEMOS &amp; EXCLUSIVE ARCHITECTURE REVIEWS
              </span>
              <h2 className="text-3xl font-extrabold text-[#14171F] font-display sm:text-5xl tracking-tight">
                Why Stop By Our POD
              </h2>
              <p className="text-base sm:text-lg text-[#5B616E] font-body max-w-xl mx-auto">
                A few minutes with our engineering team could reshape how your supply chain operates.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            
            {/* Bento Card 1 */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl bg-white border border-[#E7E5DE] p-8 shadow-raised flex flex-col justify-between space-y-6 hover:border-[#2E5EFF] transition-all"
            >
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-[#EEF1FF] text-[#2E5EFF] flex items-center justify-center shadow-xs">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#14171F] font-display">
                  AI that decides, not just automates
                </h3>
                <p className="text-xs sm:text-sm text-[#5B616E] leading-relaxed font-body">
                  See how our agents act as a decision engine for operations — reasoning over live data instead of running rigid scripts.
                </p>
              </div>
            </motion.div>

            {/* Bento Card 2 */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl bg-white border border-[#E7E5DE] p-8 shadow-raised flex flex-col justify-between space-y-6 hover:border-[#2E5EFF] transition-all"
            >
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-[#FF6A3D]/10 text-[#FF6A3D] flex items-center justify-center shadow-xs">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#14171F] font-display">
                  Built for transport &amp; logistics
                </h3>
                <p className="text-xs sm:text-sm text-[#5B616E] leading-relaxed font-body">
                  Route optimisation, freight tracking, fleet health, and fuel &amp; carbon analytics tailored to future supply chains.
                </p>
              </div>
            </motion.div>

            {/* Bento Card 3 */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl bg-white border border-[#E7E5DE] p-8 shadow-raised flex flex-col justify-between space-y-6 hover:border-[#2E5EFF] transition-all"
            >
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-[#1FAA59]/10 text-[#1FAA59] flex items-center justify-center shadow-xs">
                  <Store className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#14171F] font-display">
                  Smarter retail supply chains
                </h3>
                <p className="text-xs sm:text-sm text-[#5B616E] leading-relaxed font-body">
                  Demand forecasting, inventory intelligence, and last-mile delivery agents that cut waste and lift margins.
                </p>
              </div>
            </motion.div>

          </div>

          <div className="mt-12 text-center">
            <button
              onClick={openCalendly}
              className="inline-flex items-center gap-2 rounded-full bg-[#2E5EFF] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#1B3BB3] transition-all shadow-lg hover:scale-105"
            >
              Book a 15-Min Consult at POD #04 <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-20 bg-[#16214F] text-white text-center border-t border-[#2E5EFF]/30">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal variant="fade-up">
            <h2 className="text-3xl font-extrabold font-display sm:text-4xl text-white">
              Let's Talk at MegaTrans 2026
            </h2>
            <p className="mt-3 text-sm text-white/80 max-w-xl mx-auto font-body">
              Reserve a dedicated 15-minute slot with our engineering founders at Startup POD #04, Melbourne.
            </p>
            <button
              onClick={openCalendly}
              className="mt-8 rounded-full bg-[#2E5EFF] px-8 py-4 text-sm font-bold text-white hover:bg-[#1B3BB3] inline-flex items-center gap-2 shadow-xl transition-all hover:scale-105"
            >
              Book a Meeting <ArrowUpRight className="h-4 w-4" />
            </button>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MegaTrans;
