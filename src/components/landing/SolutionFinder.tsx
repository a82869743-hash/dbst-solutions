import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Terminal, ArrowRight, Loader2, Cpu, Zap, TrendingUp, BookOpen, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AdminStore } from "@/lib/admin/adminStore";
import { useToast } from "@/hooks/use-toast";

gsap.registerPlugin(ScrollTrigger);

const SYSTEM_PROMPT = `You are the D-BST Capability Advisor.
Your purpose is to help prospective clients clarify a business, operational, data, AI or technology challenge and understand whether it fits D-BST Solutions' capabilities.
You provide an initial capability assessment. You do not provide a final architecture, formal proposal, quotation, guaranteed business case or implementation commitment.

Expert Behaviour:
Approach enquiries through the appropriate professional lens: Enterprise Architect, Solution Architect, AI Engineer, Digital Transformation Consultant, Senior Business Analyst, Data/BI Consultant, or Transport Technology Consultant.
Think critically and consultatively. Understand the underlying business problem, users, workflows, and constraints.

D-BST Services Knowledge:
1. Digital Transformation & Advisory: Discovery workshops, process mapping, opportunity prioritisation, transformation roadmaps.
2. Enterprise & Solution Architecture: Current/target-state assessment, API/data/security design, architecture standards, transition roadmaps.
3. AI Engineering & Adoption: AI opportunity assessment, agent & workflow architecture, MCP/system integration, human oversight & adoption planning. Growthmates AI is D-BST's modular agentic AI platform.
4. Custom Software & System Integration: Web/mobile/operational applications, APIs/connectors, workflow orchestration, legacy modernisation.
5. Data Analytics & Business Intelligence: Data discovery, KPI/information models, data pipelines, Power BI & Microsoft Fabric.
6. Transport Technology & TruckMate: Specialist Trimble TruckMate advisory, DB2/API integrations, Command Center, reporting, AI-assisted decision support.

D-BST Delivery Method:
Discover and Define -> Design and De-risk -> Deliver and Learn -> Support and Improve.

Honesty Rules:
- Never invent or guarantee ROI percentages, delivery timeframes, project costs, client names, case studies, or SLAs.
- Describe potential outcomes qualitatively and realistically as things to validate during discovery.
- Keep people in control (AI assists workflows, humans supervise).

Return STRICT JSON format:
{
  "whatWeHeard": "Concise summary of the challenge and context",
  "bestFitCapability": "Primary D-BST service capability",
  "supportingCapabilities": "1-2 supporting D-BST capabilities",
  "howDbstCouldHelp": "Practical explanation of how D-BST would approach this problem",
  "suggestedStartingPoint": "The first practical step (e.g. Discover & Define workshop or focused assessment)",
  "whatSuccessCouldLookLike": "Qualitative operational outcomes and business value to validate during discovery",
  "assumptionsOrQuestions": "Key questions or operational details to clarify in a discovery conversation",
  "fitClassification": "Strong Fit" or "Potential Fit" or "Outside Scope"
}`;

const presetChallenges = [
  {
    label: "AI adoption uncertainty",
    text: "We want to use AI but are unsure where to start.",
    whatWeHeard: "Desire to adopt AI but seeking clarity on where to begin and how to create tangible operational value without disruption.",
    bestFitCapability: "AI Engineering & Adoption",
    supportingCapabilities: "Enterprise & Solution Architecture, Digital Transformation",
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
    const textToSubmit = customText || challengeInput;
    if (!textToSubmit.trim() || loading) return;

    setLoading(true);

    const matchedPreset = presetChallenges.find((p) => p.text.toLowerCase() === textToSubmit.trim().toLowerCase());

    // Try server-side proxy first (production), then fallback to direct API call (local dev)
    try {
      let aiResponse: Response | null = null;

      // 1. Try server-side endpoint (API key is NOT exposed to client)
      try {
        aiResponse = await fetch("/api/capability-advisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: textToSubmit }),
        });
      } catch {
        // Server endpoint not available (local dev without Vercel)
        aiResponse = null;
      }

      // 2. Fallback: direct API call for local development only
      if (!aiResponse || !aiResponse.ok) {
        const adminCreds = AdminStore.getCredentials();
        const apiKey = (adminCreds.openaiApiKey || import.meta.env.VITE_OPENAI_API_KEY || "").trim();
        const model = adminCreds.activeAiModel?.startsWith("gpt") ? adminCreds.activeAiModel : "gpt-4o-mini";

        if (apiKey) {
          aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
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

          if (aiResponse.ok) {
            const json = await aiResponse.json();
            const content = json.choices?.[0]?.message?.content;
            if (content) {
              const parsed = JSON.parse(content);
              if (parsed.whatWeHeard && parsed.howDbstCouldHelp) {
                setResult({
                  whatWeHeard: parsed.whatWeHeard,
                  bestFitCapability: parsed.bestFitCapability || "AI Engineering & Adoption",
                  supportingCapabilities: parsed.supportingCapabilities || "Enterprise & Solution Architecture",
                  howDbstCouldHelp: parsed.howDbstCouldHelp,
                  suggestedStartingPoint: parsed.suggestedStartingPoint || "Discover & Define: Initial discovery conversation",
                  whatSuccessCouldLookLike: parsed.whatSuccessCouldLookLike || "Validated operational workflow improvements with teams in control.",
                  assumptionsOrQuestions: parsed.assumptionsOrQuestions || "Current system landscape and operational priorities.",
                  fitClassification: parsed.fitClassification || "Strong Fit",
                });
                setIsLiveAi(true);
                setTimeout(() => setLoading(false), 300);
                return;
              }
            }
          } else {
            const errorData = await aiResponse.json().catch(() => ({}));
            console.error("OpenAI API request failed:", aiResponse.status, errorData);
            if (aiResponse.status === 401) {
              toast({
                title: "OpenAI Authentication Failed",
                description: "API key is invalid (401). Check the key in Admin Vault (/admin) or .env.",
                variant: "destructive",
              });
            } else if (aiResponse.status === 429) {
              toast({
                title: "OpenAI Quota Exceeded",
                description: "OpenAI rate limit or usage quota reached (429). Check your billing at platform.openai.com.",
                variant: "destructive",
              });
            }
          }
        } else if (aiResponse && aiResponse.ok) {
          // Server-side response was OK — parse it directly
          const parsed = await aiResponse.json();
          if (parsed.whatWeHeard && parsed.howDbstCouldHelp) {
            setResult({
              whatWeHeard: parsed.whatWeHeard,
              bestFitCapability: parsed.bestFitCapability || "AI Engineering & Adoption",
              supportingCapabilities: parsed.supportingCapabilities || "Enterprise & Solution Architecture",
              howDbstCouldHelp: parsed.howDbstCouldHelp,
              suggestedStartingPoint: parsed.suggestedStartingPoint || "Discover & Define: Initial discovery conversation",
              whatSuccessCouldLookLike: parsed.whatSuccessCouldLookLike || "Validated operational workflow improvements with teams in control.",
              assumptionsOrQuestions: parsed.assumptionsOrQuestions || "Current system landscape and operational priorities.",
              fitClassification: parsed.fitClassification || "Strong Fit",
            });
            setIsLiveAi(true);
            setTimeout(() => setLoading(false), 300);
            return;
          }
        }
      } else {
        // Server-side response was OK — parse it directly
        const parsed = await aiResponse.json();
        if (parsed.whatWeHeard && parsed.howDbstCouldHelp) {
          setResult({
            whatWeHeard: parsed.whatWeHeard,
            bestFitCapability: parsed.bestFitCapability || "AI Engineering & Adoption",
            supportingCapabilities: parsed.supportingCapabilities || "Enterprise & Solution Architecture",
            howDbstCouldHelp: parsed.howDbstCouldHelp,
            suggestedStartingPoint: parsed.suggestedStartingPoint || "Discover & Define: Initial discovery conversation",
            whatSuccessCouldLookLike: parsed.whatSuccessCouldLookLike || "Validated operational workflow improvements with teams in control.",
            assumptionsOrQuestions: parsed.assumptionsOrQuestions || "Current system landscape and operational priorities.",
            fitClassification: parsed.fitClassification || "Strong Fit",
          });
          setIsLiveAi(true);
          setTimeout(() => setLoading(false), 300);
          return;
        }
      }
    } catch (err: any) {
      console.warn("Capability Advisor fallback:", err);
    }

    setIsLiveAi(false);

    // Fallback if API key missing or network error
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

    setTimeout(() => setLoading(false), 300);
  };

  const handleSelectPreset = (preset: typeof presetChallenges[0]) => {
    setChallengeInput(preset.text);
    setIsLiveAi(false);
    setResult({
      whatWeHeard: preset.whatWeHeard,
      bestFitCapability: preset.bestFitCapability,
      supportingCapabilities: preset.supportingCapabilities,
      howDbstCouldHelp: preset.howDbstCouldHelp,
      suggestedStartingPoint: preset.suggestedStartingPoint,
      whatSuccessCouldLookLike: preset.whatSuccessCouldLookLike,
      assumptionsOrQuestions: preset.assumptionsOrQuestions,
      fitClassification: "Strong Fit",
    });
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
                    className={`p-3 rounded-xl border text-xs font-mono text-left transition-all flex items-center justify-between ${
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
              placeholder="Tell us what is happening today, who it affects, the systems involved and what a better outcome would look like."
              className="w-full p-4 rounded-xl bg-white border border-border-subtle text-fg-default placeholder:text-fg-dimmer text-sm font-body focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none h-28 shadow-flat"
            />

            <div className="text-xs text-fg-dimmer font-mono mb-2">
              Please do not enter passwords, personal information or confidential customer data.
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono text-fg-dim font-medium">
                Free Instant AI Architecture Scoping &bull; Confidential
              </span>
              <button
                onClick={() => handleGenerate()}
                disabled={loading || !challengeInput.trim()}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-accent-deep transition-all shadow-raised disabled:opacity-50"
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
            <div className="pt-8 border-t border-border-subtle space-y-6 animate-in fade-in duration-300">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="flex items-center gap-2 text-accent font-bold">
                    <Terminal className="w-4 h-4 text-accent" /> INITIAL CAPABILITY ASSESSMENT
                  </span>
                  {isLiveAi ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live OpenAI Analysis</span>
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
                <p className="text-fg-default font-body text-sm leading-relaxed">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
                {/* How D-BST Could Help */}
                <div className="p-5 bg-[#F5F4F0] border border-border-subtle rounded-2xl space-y-2 text-left shadow-flat">
                  <div className="font-bold text-fg-default flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" /> HOW D-BST COULD HELP
                  </div>
                  <p className="text-fg-dim leading-relaxed font-body text-xs pt-1">
                    {result.howDbstCouldHelp}
                  </p>
                </div>

                {/* What Success Could Look Like */}
                <div className="p-5 bg-[#F5F4F0] border border-border-subtle rounded-2xl space-y-2 text-left shadow-flat">
                  <div className="font-bold text-fg-default flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" /> WHAT SUCCESS COULD LOOK LIKE
                  </div>
                  <p className="text-fg-dim leading-relaxed font-body text-xs pt-1">
                    {result.whatSuccessCouldLookLike}
                  </p>
                </div>
              </div>

              {/* Suggested Starting Point & Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
                <div className="p-4 bg-white border border-border-subtle rounded-xl space-y-1 text-left shadow-flat">
                  <div className="text-[10px] font-bold text-fg-dimmer uppercase tracking-wider">
                    SUGGESTED STARTING POINT
                  </div>
                  <p className="text-fg-default font-body text-xs leading-snug">
                    {result.suggestedStartingPoint}
                  </p>
                </div>

                {result.assumptionsOrQuestions && (
                  <div className="p-4 bg-white border border-border-subtle rounded-xl space-y-1 text-left shadow-flat">
                    <div className="text-[10px] font-bold text-fg-dimmer uppercase tracking-wider">
                      QUESTIONS TO EXPLORE
                    </div>
                    <p className="text-fg-dim font-body text-xs leading-snug">
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
                  <p className="text-fg-default font-body text-xs">
                    Based on this initial assessment, the next practical step would be a focused discovery conversation with D-BST Solutions.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white font-bold text-xs shrink-0 hover:bg-accent-deep transition-all shadow-flat"
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
