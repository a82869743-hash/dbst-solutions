import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Terminal, ArrowRight, Loader2, Cpu, Zap, TrendingUp, BookOpen, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AdminStore } from "@/lib/admin/adminStore";
import { useToast } from "@/hooks/use-toast";

gsap.registerPlugin(ScrollTrigger);

const SYSTEM_PROMPT = `You are the D-BST Capability Advisor for D-BST Solutions (dbstsolutions.com).
Your purpose is to help prospective enterprise clients clarify a business, operational, data, AI or technology challenge and understand how D-BST can solve it.

You think and consult like an elite Enterprise Architect, Solution Architect, and AI Operations Director.
Analyze the user's specific enquiry with precision: extract their industry, specific systems or platforms mentioned (e.g. Trimble TruckMate, SAP, Salesforce, Shopify, NetSuite, Excel, legacy databases), operational bottlenecks, and stakeholders.

Choose the primary capability from D-BST's core service matrix:
1. "AI Engineering & Adoption" - Autonomous workflow agents, custom LLM fine-tuning, Model Context Protocol (MCP) integrations, human oversight architecture, Growthmates AI platform.
2. "Enterprise & Solution Architecture" - Current/target-state blueprints, secure API/data architecture, integration standards, cloud modernization transition roadmaps.
3. "Transport Technology & TruckMate" - Specialist Trimble TruckMate advisory, multi-depot fleet dispatch optimization, DB2 & REST API integrations, custom Command Centers, real-time telematics.
4. "Custom Software & System Integration" - Mission-critical web/mobile applications, legacy ERP modernisation, custom middleware & event-driven data sync.
5. "Data Analytics & Business Intelligence" - Enterprise data warehouses, unified KPI/information models, automated ETL pipelines, Power BI & Microsoft Fabric reporting suites.
6. "Digital Transformation & Advisory" - Operational journey mapping, executive discovery workshops, change management, prioritisation roadmaps.

Rules:
- Be consultative, deeply relevant to the exact user prompt, and realistic.
- Do NOT generate generic copy. Explicitly address the specific systems, teams, or operational challenges from the prompt.
- Keep humans in control (AI assists workflows, humans supervise).
- Never guarantee fictional ROI percentages, delivery timeframes, or formal quotes.
- Return ONLY a valid JSON object matching this structure (all property values must be strings, not nested objects or arrays):
{
  "whatWeHeard": "Concise, perceptive summary of their specific challenge, acknowledging their systems, scale, and operational pain points.",
  "bestFitCapability": "Exact name of the primary D-BST service capability from the list of 6 above.",
  "supportingCapabilities": "1 or 2 supporting D-BST service capabilities from the list above.",
  "howDbstCouldHelp": "Practical, step-by-step architectural and operational approach D-BST would implement to resolve this challenge.",
  "suggestedStartingPoint": "The exact first practical milestone (e.g. 'Discover & Define: 2-week technical discovery & system mapping workshop').",
  "whatSuccessCouldLookLike": "Tangible operational outcomes, process acceleration, and workflow visibility to validate during discovery.",
  "assumptionsOrQuestions": "2-3 sharp operational or technical questions to clarify during discovery.",
  "fitClassification": "Strong Fit"
}`;

const presetChallenges = [
  {
    label: "AI adoption uncertainty",
    text: "We want to use AI but are unsure where to start.",
    whatWeHeard: "Desire to adopt AI but seeking clarity on where to begin and how to create tangible operational value without disruption.",
    bestFitCapability: "AI Engineering & Adoption",
    supportingCapabilities: "Enterprise & Solution Architecture, Digital Transformation & Advisory",
    howDbstCouldHelp: "D-BST can conduct an AI opportunity and value assessment to identify practical use cases aligned with your business priorities and operational workflows, establishing agent architecture and human oversight.",
    suggestedStartingPoint: "Discover & Define: An initial discovery conversation and opportunity mapping session.",
    whatSuccessCouldLookLike: "Moving from AI experimentation to a controlled operational capability with clear purpose and teams in control.",
    assumptionsOrQuestions: "Current systems in place, data sensitivity, and specific operational pain points.",
  },
  {
    label: "Manual process bottlenecks",
    text: "Manual processes are slowing our operation.",
    whatWeHeard: "Operational drag and duplicated effort from manual processes across business teams.",
    bestFitCapability: "Digital Transformation & Advisory",
    supportingCapabilities: "Custom Software & System Integration",
    howDbstCouldHelp: "D-BST can conduct discovery workshops, process and service journey mapping, opportunity prioritisation and a transformation roadmap.",
    suggestedStartingPoint: "Discover & Define: Process journey mapping workshop with key operational stakeholders.",
    whatSuccessCouldLookLike: "Eliminating duplicated effort, focusing investment on root causes, and creating a practical path from business intent to measurable outcomes.",
    assumptionsOrQuestions: "Specific workflows with highest volume, team bottlenecks, and handoff points.",
  },
  {
    label: "System information silos",
    text: "Our systems do not share information reliably.",
    whatWeHeard: "Disconnected business systems causing data fragmentation and unreliable information exchange.",
    bestFitCapability: "Enterprise & Solution Architecture",
    supportingCapabilities: "Custom Software & System Integration",
    howDbstCouldHelp: "A suitable starting point is a current-state assessment and integration architecture review, leading to API, data and security design with a transition roadmap.",
    suggestedStartingPoint: "Discover & Define: Current-state systems and integration audit.",
    whatSuccessCouldLookLike: "Making technology decisions with a secure, scalable and sustainable blueprint for change, connecting your core systems.",
    assumptionsOrQuestions: "Core applications involved, API availability, and data synchronization frequency.",
  },
  {
    label: "Reporting inconsistency",
    text: "Our reporting is inconsistent or arrives too late.",
    whatWeHeard: "Fragmented reporting across multiple spreadsheets and tools resulting in conflicting numbers and delayed decisions.",
    bestFitCapability: "Data Analytics & Business Intelligence",
    supportingCapabilities: "Enterprise & Solution Architecture",
    howDbstCouldHelp: "D-BST can help through data and reporting discovery, KPI and information model definition, data pipelines and Power BI or Microsoft Fabric solutions.",
    suggestedStartingPoint: "Discover & Define: Data source discovery and KPI definitions workshop.",
    whatSuccessCouldLookLike: "Turning fragmented operational data into trusted information that supports faster, more confident decisions.",
    assumptionsOrQuestions: "Primary reporting tools used today, data source platforms, and executive reporting cadence.",
  },
];

interface SolutionResult {
  whatWeHeard: string;
  bestFitCapability: string;
  supportingCapabilities: string;
  howDbstCouldHelp: string;
  suggestedStartingPoint: string;
  whatSuccessCouldLookLike: string;
  assumptionsOrQuestions?: string;
  fitClassification?: string;
}

export const SolutionFinder = () => {
  const { toast } = useToast();
  const [challengeInput, setChallengeInput] = useState(presetChallenges[0].text);
  const [loading, setLoading] = useState(false);
  const [isLiveAi, setIsLiveAi] = useState(false);
  const [activeModelName, setActiveModelName] = useState("GPT-4o");
  const [result, setResult] = useState<SolutionResult>({
    whatWeHeard: presetChallenges[0].whatWeHeard,
    bestFitCapability: presetChallenges[0].bestFitCapability,
    supportingCapabilities: presetChallenges[0].supportingCapabilities,
    howDbstCouldHelp: presetChallenges[0].howDbstCouldHelp,
    suggestedStartingPoint: presetChallenges[0].suggestedStartingPoint,
    whatSuccessCouldLookLike: presetChallenges[0].whatSuccessCouldLookLike,
    assumptionsOrQuestions: presetChallenges[0].assumptionsOrQuestions,
    fitClassification: "Strong Fit",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const finderCardRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance with clearProps: "all"
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (finderCardRef.current) {
        gsap.fromTo(
          finderCardRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: finderCardRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleGenerate = async (customText?: string) => {
    const textToSubmit = (customText !== undefined ? customText : challengeInput).trim();
    if (!textToSubmit || loading) return;

    setLoading(true);

    const adminCreds = AdminStore.getCredentials();
    const effectiveApiKey = AdminStore.getEffectiveOpenAiKey();
    const model = (adminCreds.activeAiModel && adminCreds.activeAiModel.startsWith("gpt"))
      ? adminCreds.activeAiModel
      : "gpt-4o-mini";
    const displayModel = model === "gpt-4o" ? "GPT-4o" : "GPT-4o Mini";
    setActiveModelName(displayModel);

    let liveResult: SolutionResult | null = null;

    // 1. Direct OpenAI API execution (local dev and client-side with key)
    if (effectiveApiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${effectiveApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: textToSubmit },
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            if (parsed.whatWeHeard && parsed.howDbstCouldHelp) {
              liveResult = {
                whatWeHeard: String(parsed.whatWeHeard),
                bestFitCapability: String(parsed.bestFitCapability || "AI Engineering & Adoption"),
                supportingCapabilities: Array.isArray(parsed.supportingCapabilities)
                  ? parsed.supportingCapabilities.join(", ")
                  : String(parsed.supportingCapabilities || "Enterprise & Solution Architecture"),
                howDbstCouldHelp: String(parsed.howDbstCouldHelp),
                suggestedStartingPoint: String(parsed.suggestedStartingPoint || "Discover & Define: Initial discovery conversation"),
                whatSuccessCouldLookLike: String(parsed.whatSuccessCouldLookLike || "Validated operational workflow improvements with teams in control."),
                assumptionsOrQuestions: Array.isArray(parsed.assumptionsOrQuestions)
                  ? parsed.assumptionsOrQuestions.join(" ")
                  : String(parsed.assumptionsOrQuestions || "Current system landscape and operational priorities."),
                fitClassification: String(parsed.fitClassification || "Strong Fit"),
              };
            }
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("OpenAI API direct call error:", response.status, errorData);
          if (response.status === 401) {
            toast({
              title: "OpenAI Authentication Failed",
              description: "API key is invalid or expired (401). Check the key in Admin Vault (/admin) or .env.",
              variant: "destructive",
            });
          } else if (response.status === 429) {
            toast({
              title: "OpenAI Quota Exceeded",
              description: "OpenAI rate limit or usage quota reached (429). Check your billing at platform.openai.com.",
              variant: "destructive",
            });
          }
        }
      } catch (directErr: any) {
        console.warn("Direct OpenAI API request error:", directErr);
      }
    }

    // 2. Fallback to server endpoint if direct call did not succeed
    if (!liveResult) {
      try {
        const srvResponse = await fetch("/api/capability-advisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: textToSubmit, model }),
        });

        const contentType = srvResponse.headers.get("content-type") || "";
        if (srvResponse.ok && contentType.includes("application/json")) {
          const parsed = await srvResponse.json();
          if (parsed.whatWeHeard && parsed.howDbstCouldHelp) {
            liveResult = {
              whatWeHeard: String(parsed.whatWeHeard),
              bestFitCapability: String(parsed.bestFitCapability || "AI Engineering & Adoption"),
              supportingCapabilities: Array.isArray(parsed.supportingCapabilities)
                ? parsed.supportingCapabilities.join(", ")
                : String(parsed.supportingCapabilities || "Enterprise & Solution Architecture"),
              howDbstCouldHelp: String(parsed.howDbstCouldHelp),
              suggestedStartingPoint: String(parsed.suggestedStartingPoint || "Discover & Define: Initial discovery conversation"),
              whatSuccessCouldLookLike: String(parsed.whatSuccessCouldLookLike || "Validated operational workflow improvements with teams in control."),
              assumptionsOrQuestions: Array.isArray(parsed.assumptionsOrQuestions)
                ? parsed.assumptionsOrQuestions.join(" ")
                : String(parsed.assumptionsOrQuestions || "Current system landscape and operational priorities."),
              fitClassification: String(parsed.fitClassification || "Strong Fit"),
            };
          }
        }
      } catch (srvErr) {
        // Server endpoint not reachable or offline
      }
    }

    // 3. If AI response obtained, present it
    if (liveResult) {
      setResult(liveResult);
      setIsLiveAi(true);
      setLoading(false);
      toast({
        title: "AI Assessment Generated",
        description: `Bespoke capability analysis completed using ${displayModel}.`,
      });
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 150);
      return;
    }

    // 4. Fallback only if no AI response could be generated
    setIsLiveAi(false);
    const matchedPreset = presetChallenges.find((p) => p.text.toLowerCase() === textToSubmit.toLowerCase());
    if (matchedPreset) {
      setResult({
        whatWeHeard: matchedPreset.whatWeHeard,
        bestFitCapability: matchedPreset.bestFitCapability,
        supportingCapabilities: matchedPreset.supportingCapabilities,
        howDbstCouldHelp: matchedPreset.howDbstCouldHelp,
        suggestedStartingPoint: matchedPreset.suggestedStartingPoint,
        whatSuccessCouldLookLike: matchedPreset.whatSuccessCouldLookLike,
        assumptionsOrQuestions: matchedPreset.assumptionsOrQuestions,
        fitClassification: "Strong Fit",
      });
    } else {
      setResult({
        whatWeHeard: `Operational challenge: "${textToSubmit.slice(0, 120)}..."`,
        bestFitCapability: "Enterprise & Solution Architecture",
        supportingCapabilities: "Digital Transformation & Advisory",
        howDbstCouldHelp: "D-BST can help through current-state capability discovery and architecture options analysis, identifying integration points and designing a secure transition roadmap.",
        suggestedStartingPoint: "Discover & Define: A structured discovery session to map workflows and data requirements.",
        whatSuccessCouldLookLike: "A cohesive target architecture connecting your operational systems with measurable visibility.",
        assumptionsOrQuestions: "Systems and applications currently in use, and key operational stakeholders.",
        fitClassification: "Potential Fit",
      });
    }

    setLoading(false);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 150);
  };

  const handleSelectPreset = (preset: typeof presetChallenges[0]) => {
    setChallengeInput(preset.text);
    handleGenerate(preset.text);
  };

  return (
    <section ref={containerRef} className="py-20 lg:py-28 bg-bg-surface border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Solution Finder Card */}
        <div ref={finderCardRef} className="p-8 sm:p-12 bg-white border border-border-subtle rounded-3xl shadow-floating max-w-5xl mx-auto space-y-9 text-left">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-tint text-accent-deep border border-accent/20 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>GUIDED CAPABILITY DISCOVERY</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-fg-default tracking-tight">
              What Are You Trying to Improve?
            </h2>
            <p className="text-base text-fg-dim leading-relaxed font-body max-w-2xl">
              Describe a business challenge, operational bottleneck or technology opportunity. Our guided advisor will ask a few focused questions and identify where D-BST may be able to help.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-fg-dimmer">
              TRY A COMMON BUSINESS CHALLENGE
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {presetChallenges.map((preset, idx) => {
                const isSelected = challengeInput === preset.text;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-[13px] font-mono text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-accent-tint/70 border-accent text-accent-deep font-bold shadow-flat ring-1 ring-accent/20"
                        : "bg-[#F5F4F0] border-border-subtle text-fg-dim hover:text-fg-default hover:border-accent/40"
                    }`}
                  >
                    <span className="truncate pr-2">&rsaquo; {preset.label}</span>
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSelected ? "text-accent" : "text-fg-dimmer opacity-40"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input & Action */}
          <div className="p-5 bg-[#F5F4F0] border border-border-subtle rounded-2xl space-y-4">
            <textarea
              value={challengeInput}
              onChange={(e) => setChallengeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              placeholder="Tell us what is happening today, who it affects, the systems involved and what a better outcome would look like."
              className="w-full p-4 rounded-xl bg-white border border-border-subtle text-fg-default placeholder:text-fg-dimmer text-[15px] font-body focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none h-28 shadow-flat leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-fg-dimmer font-mono mb-2">
              <span>Please do not enter passwords, personal information or confidential customer data.</span>
              <span className="text-[10px] text-accent/80 font-semibold">Tip: Press Ctrl+Enter to assess</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono text-fg-dim font-medium">
                Free Instant AI Architecture Scoping &bull; Confidential
              </span>
              <button
                onClick={() => handleGenerate()}
                disabled={loading || !challengeInput.trim()}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-bold text-[13px] uppercase tracking-wider hover:bg-accent-deep transition-all shadow-raised disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mapping Capability Fit...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    <span>Start Guided Assessment</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Result Display */}
          {result && (
            <div ref={resultRef} className="pt-8 border-t border-border-subtle space-y-6 animate-in fade-in duration-300">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="flex items-center gap-2 text-accent font-bold">
                    <Terminal className="w-4 h-4 text-accent" /> INITIAL CAPABILITY ASSESSMENT
                  </span>
                  {isLiveAi ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live OpenAI Analysis ({activeModelName})</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 text-[10px] font-mono font-medium">
                      <span>Curated Baseline</span>
                    </span>
                  )}
                </div>
                <span className="px-3 py-1 rounded-full bg-accent-tint text-accent-deep font-bold text-[10px] border border-accent/20">
                  {result.fitClassification || "D-BST CAPABILITY MATCHED"}
                </span>
              </div>

              {/* What We Heard */}
              <div className="p-5 bg-white border border-border-subtle rounded-2xl space-y-3 text-left shadow-flat">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-fg-dimmer">
                  WHAT WE HEARD
                </div>
                <p className="text-fg-default font-body text-[15px] leading-relaxed">
                  {result.whatWeHeard}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                  <span className="px-2.5 py-1 rounded-md bg-accent text-white font-bold">
                    Primary: {result.bestFitCapability}
                  </span>
                  {result.supportingCapabilities && (
                    <span className="px-2.5 py-1 rounded-md bg-accent-tint text-accent-deep border border-accent/20">
                      Supporting: {result.supportingCapabilities}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-sm">
                {/* How D-BST Could Help */}
                <div className="p-5 bg-[#F5F4F0] border border-border-subtle rounded-2xl space-y-2 text-left shadow-flat">
                  <div className="font-bold text-fg-default flex items-center gap-2 text-xs">
                    <Zap className="w-4 h-4 text-accent" /> HOW D-BST COULD HELP
                  </div>
                  <p className="text-fg-dim leading-relaxed font-body text-sm pt-1">
                    {result.howDbstCouldHelp}
                  </p>
                </div>

                {/* What Success Could Look Like */}
                <div className="p-5 bg-[#F5F4F0] border border-border-subtle rounded-2xl space-y-2 text-left shadow-flat">
                  <div className="font-bold text-fg-default flex items-center gap-2 text-xs">
                    <TrendingUp className="w-4 h-4 text-emerald-600" /> WHAT SUCCESS COULD LOOK LIKE
                  </div>
                  <p className="text-fg-dim leading-relaxed font-body text-sm pt-1">
                    {result.whatSuccessCouldLookLike}
                  </p>
                </div>
              </div>

              {/* Suggested Starting Point & Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
                <div className="p-4 bg-white border border-border-subtle rounded-xl space-y-1.5 text-left shadow-flat">
                  <div className="text-[10px] font-bold text-fg-dimmer uppercase tracking-wider">
                    SUGGESTED STARTING POINT
                  </div>
                  <p className="text-fg-default font-body text-[13.5px] leading-normal">
                    {result.suggestedStartingPoint}
                  </p>
                </div>

                {result.assumptionsOrQuestions && (
                  <div className="p-4 bg-white border border-border-subtle rounded-xl space-y-1.5 text-left shadow-flat">
                    <div className="text-[10px] font-bold text-fg-dimmer uppercase tracking-wider">
                      QUESTIONS TO EXPLORE
                    </div>
                    <p className="text-fg-dim font-body text-[13.5px] leading-normal">
                      {result.assumptionsOrQuestions}
                    </p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="p-5 bg-accent-tint/70 border border-accent/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-left shadow-flat">
                <div className="space-y-1">
                  <div className="font-bold text-accent-deep flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-accent" /> SUGGESTED NEXT STEP
                  </div>
                  <p className="text-fg-default font-body text-sm">
                    Based on this initial assessment, the next practical step would be a focused discovery conversation with D-BST Solutions.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white font-bold text-[13px] shrink-0 hover:bg-accent-deep transition-all shadow-flat"
                >
                  <span>Book a Discovery Conversation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
