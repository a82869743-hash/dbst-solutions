import { motion } from "framer-motion";
import { Sparkles, Shield, Cpu, Network, CheckCircle2 } from "lucide-react";

export const PoweredByPlatformGrid = () => {
  return (
    <section className="py-20 md:py-28 bg-[#FAF9F6] border-b border-[#E7E5DE] text-[#14171F]">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF1FF] border border-[#2E5EFF]/20 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#2E5EFF]">
            <Sparkles className="h-3.5 w-3.5" /> PLATFORM ARCHITECTURE
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-[#14171F]">
            Powered by the <span className="text-[#2E5EFF]">GrowthMates AI platform</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5B616E] font-body">
            Everything enterprise leaders need to build, deploy, and govern autonomous AI agents.
          </p>
        </div>

        {/* 4-Card Vertical Bento Grid (Brand-Matched Color Palette) */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1: Clean White Surface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-white border border-[#E7E5DE] p-7 flex flex-col justify-between shadow-raised hover:shadow-floating transition-all duration-300 min-h-[460px]"
          >
            <div>
              <span className="text-xs font-mono font-bold text-[#5B616E] uppercase tracking-wider block mb-2">
                Agent Runtime
              </span>
              <h3 className="text-2xl font-extrabold font-display text-[#14171F] leading-tight mb-6">
                Describe It. Deploy It.
              </h3>

              {/* Graphic: Dotted Circle with Floating Prompt Bubble & Deploy Button */}
              <div className="relative my-6 h-48 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="75" stroke="#2E5EFF" strokeWidth="1.5" strokeDasharray="6 6" fill="none" opacity="0.5" />
                </svg>

                {/* Prompt Bubble */}
                <div className="relative z-10 rounded-xl bg-[#FAF9F6] border border-[#E7E5DE] p-3 text-[11px] font-mono text-[#14171F] shadow-sm max-w-[170px] -translate-y-8 -translate-x-4">
                  Optimize Melbourne route |
                </div>

                {/* Deploy Agent Button */}
                <div className="absolute bottom-6 right-2 z-10 rounded-full bg-[#2E5EFF] text-white px-3.5 py-1.5 text-xs font-bold font-display shadow-md flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Deploy Agent
                </div>

                {/* Agent Node */}
                <div className="absolute bottom-4 left-4 z-10 rounded-lg bg-white border border-[#E7E5DE] px-2.5 py-1 text-[11px] font-mono text-[#5B616E] shadow-2xs">
                  🤖 Agent #04
                </div>
              </div>
            </div>

            <p className="text-xs text-[#5B616E] leading-relaxed font-body border-t border-[#E7E5DE] pt-4 mt-4">
              Describe your operational goal in plain English. The GrowthMates AI runtime turns it into a self-executing agent in seconds.
            </p>
          </motion.div>

          {/* Card 2: GrowthMates Soft Blue Surface (#EEF1FF) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-3xl bg-[#EEF1FF] border border-[#2E5EFF]/20 p-7 flex flex-col justify-between shadow-raised hover:shadow-floating transition-all duration-300 min-h-[460px]"
          >
            <div>
              <span className="text-xs font-mono font-bold text-[#2E5EFF] uppercase tracking-wider block mb-2">
                Full Stack Infrastructure
              </span>
              <h3 className="text-2xl font-extrabold font-display text-[#16214F] leading-tight mb-6">
                Build &amp; Scale Your Agents Easily.
              </h3>

              {/* Graphic: Stack of Capsule Containers */}
              <div className="my-6 space-y-2.5 max-w-[200px] mx-auto">
                <div className="rounded-xl bg-white border border-[#2E5EFF]/20 p-2.5 text-center text-xs font-bold text-[#16214F] font-display shadow-2xs">
                  Route Optimization Engine
                </div>
                <div className="rounded-xl bg-white border border-[#2E5EFF]/20 p-2.5 text-center text-xs font-bold text-[#16214F] font-display shadow-2xs">
                  Zero-Trust Memory Context
                </div>
                <div className="rounded-xl bg-white border border-[#2E5EFF]/20 p-2.5 text-center text-xs font-bold text-[#16214F] font-display shadow-2xs">
                  Enterprise ERP Gateway
                </div>
                <div className="rounded-xl bg-white border border-[#2E5EFF]/20 p-2.5 text-center text-xs font-bold text-[#16214F] font-display shadow-2xs">
                  Immutable Audit Logs
                </div>
              </div>
            </div>

            <p className="text-xs text-[#5B616E] leading-relaxed font-body border-t border-[#2E5EFF]/15 pt-4 mt-4">
              Built-in transport services with zero setup — SAP, Oracle, Xero integration, enabling you to build fully autonomous workflows.
            </p>
          </motion.div>

          {/* Card 3: GrowthMates Signal Warm Soft Tint (#FFF1EC) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-3xl bg-[#FFF1EC] border border-[#FF6A3D]/25 p-7 flex flex-col justify-between shadow-raised hover:shadow-floating transition-all duration-300 min-h-[460px]"
          >
            <div>
              <span className="text-xs font-mono font-bold text-[#FF6A3D] uppercase tracking-wider block mb-2">
                Integrations &amp; MCP
              </span>
              <h3 className="text-2xl font-extrabold font-display text-[#14171F] leading-tight mb-6">
                Connect To AI &amp; Legacy Systems.
              </h3>

              {/* Graphic: Central Hub Node Connecting Out */}
              <div className="relative my-6 h-48 flex items-center justify-center">
                {/* Central Hub Icon */}
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF6A3D] text-white shadow-lg">
                  <Network className="h-7 w-7" />
                </div>

                {/* Dotted Connection Beams & Nodes */}
                <div className="absolute top-4 left-6 rounded-xl bg-white p-2.5 shadow-md border border-[#FF6A3D]/20 text-[11px] font-bold text-[#14171F]">
                  $ Xero
                </div>
                <div className="absolute top-4 right-6 rounded-xl bg-white p-2.5 shadow-md border border-[#FF6A3D]/20 text-[11px] font-bold text-[#14171F]">
                  🤖 LLMs
                </div>
                <div className="absolute bottom-4 right-8 rounded-xl bg-white p-2.5 shadow-md border border-[#FF6A3D]/20 text-[11px] font-bold text-[#14171F]">
                  📊 SAP
                </div>
              </div>
            </div>

            <p className="text-xs text-[#5B616E] leading-relaxed font-body border-t border-[#FF6A3D]/20 pt-4 mt-4">
              Enhance your supply chain with Model Context Protocol (MCP 1.0) and 100+ native connectors. Connect directly to enterprise ERPs.
            </p>
          </motion.div>

          {/* Card 4: GrowthMates Deep Navy (#16214F with Electric Blue & White Text) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-3xl bg-[#16214F] text-white p-7 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[460px] border border-[#2E5EFF]/30"
          >
            <div>
              <span className="text-xs font-mono font-bold text-[#7C97FF] uppercase tracking-wider block mb-2">
                Enterprise Control
              </span>
              <h3 className="text-2xl font-extrabold font-display text-white leading-tight mb-6">
                Secure Your Operations As They Scale.
              </h3>

              {/* Graphic: 3D Shield Outline Graphic */}
              <div className="my-6 h-48 flex items-center justify-center">
                <div className="relative flex h-28 w-24 items-center justify-center">
                  <svg className="w-full h-full text-[#2E5EFF]" viewBox="0 0 100 120" fill="none">
                    <path d="M 50 10 L 90 25 V 65 C 90 95, 50 110, 50 110 C 50 110, 10 95, 10 65 V 25 Z" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path d="M 50 20 L 80 32 V 62 C 80 87, 50 98, 50 98 C 50 98, 20 87, 20 62 V 32 Z" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.8" />
                  </svg>
                  <CheckCircle2 className="absolute h-10 w-10 text-white" />
                </div>
              </div>
            </div>

            <p className="text-xs text-white/80 leading-relaxed font-body border-t border-white/15 pt-4 mt-4">
              Enterprise-grade security controls: SAML 2.0 SSO, SOC2 compliance, granular role permissions, and immutable audit logs.
            </p>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default PoweredByPlatformGrid;
