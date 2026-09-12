import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import ROIChatMessage from "./ROIChatMessage";
import ROIResultsDashboard from "./ROIResultsDashboard";
import { useROICalculations } from "./useROICalculations";
import type { ROIInputs } from "./types";

type Msg = { role: "user" | "assistant"; content: string };

const STREAM_URL = `${import.meta.env.VITE_SUPABASE_URL || "https://pmfyqcmoqrgxfplugqid.supabase.co"}/functions/v1/roi-chat`;

const ConversationalROI = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "👋 Hi! I'm your ROI Calculator assistant. Tell me about your fleet operations and I'll estimate how much you can save with AI automation.\n\nTo get started, could you tell me:\n- How many trucks/vehicles in your fleet?\n- Roughly how many orders do you process per month?\n- Are you based in the USA or Australia?" },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [roiInputs, setRoiInputs] = useState<ROIInputs | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const results = useROICalculations(roiInputs || {
    business: { fleetSize: 0, monthlyOrders: 0, avgRevenuePerLoad: 0, country: "USA" },
    operations: { staff: { orderEntry: 0, invoicing: 0, reconciliation: 0, customerQueries: 0 }, hourlyRate: 0, weeklyHours: { manualOrderEntry: 0, invoiceProcessing: 0, trackingUpdates: 0, dataReconciliation: 0 } },
    painPoints: [],
    automation: { currentSystems: [], willingnessPercent: 0 },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    setInput("");

    const userMsg: Msg = { role: "user", content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsStreaming(true);

    let accumulated = "";
    let toolCallArgs = "";
    let isToolCall = false;

    const upsertAssistant = (chunk: string) => {
      accumulated += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > newMessages.length) {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: accumulated } : m);
        }
        return [...prev.slice(0, newMessages.length), { role: "assistant", content: accumulated }];
      });
    };

    try {
      const resp = await fetch(STREAM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const choice = parsed.choices?.[0];
            
            // Check for tool calls
            if (choice?.delta?.tool_calls) {
              isToolCall = true;
              const tc = choice.delta.tool_calls[0];
              if (tc?.function?.arguments) {
                toolCallArgs += tc.function.arguments;
              }
            }
            
            const c = choice?.delta?.content;
            if (c) upsertAssistant(c);
          } catch { break; }
        }
      }

      // Process tool call result
      if (isToolCall && toolCallArgs) {
        try {
          const inputs = JSON.parse(toolCallArgs) as ROIInputs;
          setRoiInputs(inputs);
          if (!accumulated) {
            upsertAssistant("✅ I've gathered enough information to calculate your ROI. Check out the results below!");
          }
        } catch {
          console.error("Failed to parse tool call args");
        }
      }
    } catch {
      upsertAssistant("\n\n*Sorry, something went wrong. Please try again.*");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">ROI Chat Assistant</h3>
            <p className="text-xs text-muted-foreground">Describe your business and I'll calculate your savings</p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="h-[400px] overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg, i) => (
            <ROIChatMessage key={i} role={msg.role} content={msg.content} />
          ))}
          {isStreaming && !messages[messages.length - 1]?.content && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-muted px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Tell me about your fleet operations..."
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              disabled={isStreaming}
            />
            <Button size="icon" onClick={send} disabled={isStreaming || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ROI Results */}
      {roiInputs && (
        <ROIResultsDashboard results={results} business={roiInputs.business} />
      )}
    </div>
  );
};

export default ConversationalROI;
