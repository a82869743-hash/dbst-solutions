import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Plus, RefreshCw, Truck, ShoppingBag, Sprout, ShieldCheck } from "lucide-react";

interface PresetPrompt {
  id: string;
  category: "dispatch" | "retail" | "agriculture" | "enterprise";
  label: string;
  prompt: string;
}

const PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: "dispatch-1",
    category: "dispatch",
    label: "Reroute 12-stop freight truck",
    prompt: "Deploy an autonomous dispatch agent to optimize a 12-stop interstate freight truck route considering live Melbourne interstate traffic delays.",
  },
  {
    id: "retail-1",
    category: "retail",
    label: "Auto-verify customer RMA refund",
    prompt: "Verify return tracking status and auto-process $185 RMA refund for order #GM-8821 with zero human intervention.",
  },
  {
    id: "ag-1",
    category: "agriculture",
    label: "Predict inventory stockouts",
    prompt: "Analyze soil moisture sensors & weather telemetry to forecast crop water demands and auto-generate supplier PO for fertilizer.",
  },
  {
    id: "sec-1",
    category: "enterprise",
    label: "Audit driver HOS compliance",
    prompt: "Audit electronic logging device (ELD) logs across 45 active drivers for HOS compliance and flag potential rest breaks required.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Agents", icon: Sparkles },
  { id: "dispatch", label: "Fleet Dispatch", icon: Truck },
  { id: "retail", label: "Retail RMA", icon: ShoppingBag },
  { id: "agriculture", label: "Ag Telemetry", icon: Sprout },
  { id: "enterprise", label: "MCP Security", icon: ShieldCheck },
];

export const AgentPromptLauncher = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [inputValue, setInputValue] = useState<string>("");

  const filteredPresets = selectedCategory === "all"
    ? PRESET_PROMPTS
    : PRESET_PROMPTS.filter((p) => p.category === selectedCategory);

  const handleSelectPreset = (preset: PresetPrompt) => {
    setInputValue(preset.prompt);
  };

  const handleRandomPreset = () => {
    const random = PRESET_PROMPTS[Math.floor(Math.random() * PRESET_PROMPTS.length)];
    handleSelectPreset(random);
  };

  return (
    <section className="py-16 md:py-24 bg-[#FAF9F6] border-b border-[#E7E5DE] text-[#14171F]">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Replit Style Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3 mb-8"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-[#14171F]">
            What will you build with GrowthMates AI?
          </h2>
          
          <p className="text-base sm:text-lg text-[#5B616E] max-w-xl mx-auto font-body">
            Turn operational goals into autonomous transport, retail &amp; supply chain AI agents in minutes.
          </p>
        </motion.div>

        {/* Replit Style Clean Interactive Prompt Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          {/* Main Input Box Container */}
          <div className="relative rounded-2xl bg-white border-2 border-[#2E5EFF]/30 p-4 shadow-xl focus-within:border-[#2E5EFF] focus-within:ring-4 focus-within:ring-[#2E5EFF]/10 transition-all">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF9F6] border border-[#E7E5DE] text-[#5B616E] hover:bg-[#EEF1FF] hover:text-[#2E5EFF] transition-colors"
                title="Attach ERP context file or schema"
              >
                <Plus className="h-5 w-5" />
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Create a fleet dispatch or retail agent that..."
                className="w-full bg-transparent text-sm sm:text-base text-[#14171F] placeholder-[#8B8F99] focus:outline-none font-body"
              />

              <button
                onClick={() => {
                  if (inputValue.trim()) {
                    window.location.href = `/contact?prompt=${encodeURIComponent(inputValue)}`;
                  }
                }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF6A3D] text-white hover:bg-[#E5592E] transition-all shadow-md hover:scale-105"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Category Filter Pills Bar */}
            <div className="mt-4 pt-3 border-t border-[#E7E5DE] flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-[#2E5EFF] text-white shadow-sm"
                          : "bg-[#FAF9F6] text-[#5B616E] hover:bg-[#EEF1FF] hover:text-[#2E5EFF]"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleRandomPreset}
                className="inline-flex items-center gap-1 text-xs font-mono text-[#8B8F99] hover:text-[#2E5EFF] transition-colors shrink-0"
              >
                <RefreshCw className="h-3 w-3" /> Try example
              </button>
            </div>
          </div>

          {/* Quick Example Prompt Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-[#8B8F99] font-mono">Try an example prompt:</span>
            {filteredPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="rounded-full bg-white border border-[#E7E5DE] px-3.5 py-1 text-xs font-medium text-[#14171F] hover:border-[#2E5EFF] hover:bg-[#EEF1FF] hover:text-[#2E5EFF] transition-all shadow-2xs"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AgentPromptLauncher;
