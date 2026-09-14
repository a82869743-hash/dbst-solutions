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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const apiKey = (process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "").trim();
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "OpenAI API key not configured on server" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const body = await req.json();
    const userMessage = body.message || "";

    if (!userMessage.trim()) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: body.model || "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          error: `OpenAI API error: ${response.status}`,
          details: errorData,
        }),
        { status: response.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "No content returned from OpenAI" }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(content, {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Server error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}
