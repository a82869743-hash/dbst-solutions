import React, { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  Download,
  Upload,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  Phone,
  Mail,
  MapPin,
  Eye,
  Sliders,
} from "lucide-react";
import {
  AdminStore,
  SiteContentConfig,
  SiteTarget,
  defaultDbstContent,
  defaultGrowthMatesContent,
} from "@/lib/admin/adminStore";
import { toast } from "@/hooks/use-toast";

interface AdminContentManagerProps {
  adminEmail: string;
}

export const AdminContentManager: React.FC<AdminContentManagerProps> = ({ adminEmail }) => {
  const [activeSite, setActiveSite] = useState<SiteTarget>("dbst");
  const [config, setConfig] = useState<SiteContentConfig>(AdminStore.getContent("dbst"));
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSection, setActiveSection] = useState<"hero" | "metrics" | "services" | "contact">("hero");

  useEffect(() => {
    setConfig(AdminStore.getContent(activeSite));
    setHasChanges(false);
  }, [activeSite]);

  const handleChange = (field: keyof SiteContentConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    AdminStore.saveContent(activeSite, config, adminEmail);
    setHasChanges(false);
    toast({
      title: "Content Saved & Published",
      description: `Changes for ${config.siteName} have been deployed to the live store.`,
    });
  };

  const handleReset = () => {
    if (
      !window.confirm(
        `Are you sure you want to reset all content for ${config.siteName} back to official factory defaults?`
      )
    )
      return;
    const defaults = activeSite === "dbst" ? defaultDbstContent : defaultGrowthMatesContent;
    setConfig(defaults);
    AdminStore.saveContent(activeSite, defaults, adminEmail);
    setHasChanges(false);
    toast({ title: "Reset Complete", description: "Content restored to default baseline." });
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${activeSite}_content_backup.json`);
    dlAnchorElem.click();
    toast({ title: "Backup Exported", description: `Downloaded ${activeSite}_content_backup.json` });
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        setConfig(imported);
        setHasChanges(true);
        toast({ title: "Config Loaded", description: "Click 'Save & Publish' to commit imported values." });
      } catch (err) {
        toast({ title: "Import Error", description: "Invalid JSON file structure.", variant: "destructive" });
      }
    };
    reader.readAsText(file);
  };

  // Rotating words helpers
  const handleWordChange = (idx: number, val: string) => {
    const copy = [...config.heroAnimatedWords];
    copy[idx] = val;
    handleChange("heroAnimatedWords", copy);
  };

  const addWord = () => {
    handleChange("heroAnimatedWords", [...config.heroAnimatedWords, "New Animated Phrase"]);
  };

  const removeWord = (idx: number) => {
    if (config.heroAnimatedWords.length <= 1) return;
    handleChange(
      "heroAnimatedWords",
      config.heroAnimatedWords.filter((_, i) => i !== idx)
    );
  };

  // Trust metrics helpers
  const handleMetricChange = (idx: number, field: "label" | "value", val: string) => {
    const copy = [...config.trustMetrics];
    copy[idx] = { ...copy[idx], [field]: val };
    handleChange("trustMetrics", copy);
  };

  // Services helpers
  const handleServiceChange = (idx: number, field: "title" | "desc" | "tag", val: string) => {
    const copy = [...config.services];
    copy[idx] = { ...copy[idx], [field]: val };
    handleChange("services", copy);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Site Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold font-display text-fg-default flex items-center gap-2">
            <Sliders className="w-5 h-5 text-accent" />
            <span>Multi-Site Visual Content CMS</span>
          </h2>
          <p className="text-xs text-fg-dim">
            Edit headlines, rotating animation pillars, services, and company narrative in real time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <label className="px-3 py-2 text-xs font-mono font-medium rounded-md border border-border-subtle bg-white hover:bg-zinc-50 flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-fg-dim" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          <button
            onClick={handleExportJson}
            className="px-3 py-2 text-xs font-mono font-medium rounded-md border border-border-subtle bg-white hover:bg-zinc-50 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-fg-dim" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-2 text-xs font-mono font-medium rounded-md border border-border-subtle bg-white text-zinc-600 hover:bg-zinc-100 flex items-center gap-1.5 transition-colors"
            title="Reset to official baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-5 py-2 text-xs font-medium rounded-md flex items-center gap-2 shadow-sm transition-all ${
              hasChanges
                ? "bg-accent text-white hover:bg-accent-deep animate-pulse"
                : "bg-zinc-200 text-zinc-500 cursor-not-allowed"
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save &amp; Publish</span>
          </button>
        </div>
      </div>

      {/* Website Target Switcher Selector */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-border-subtle">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-fg-dim uppercase tracking-wider">Editing Website:</span>
          <div className="inline-flex rounded-lg border border-border-subtle bg-white p-1 text-xs font-mono">
            <button
              onClick={() => setActiveSite("dbst")}
              className={`px-4 py-1.5 rounded-md font-bold flex items-center gap-2 transition-all ${
                activeSite === "dbst"
                  ? "bg-accent text-white shadow-xs"
                  : "text-fg-dim hover:text-fg-default"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>🌐 D-BST Solutions (dbstsolutions.com)</span>
            </button>

            <button
              onClick={() => setActiveSite("growthmates")}
              className={`px-4 py-1.5 rounded-md font-bold flex items-center gap-2 transition-all ${
                activeSite === "growthmates"
                  ? "bg-purple-700 text-white shadow-xs"
                  : "text-fg-dim hover:text-fg-default"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🚀 GrowthMates.ai (growthmates.vercel.app)</span>
            </button>
          </div>
        </div>

        {hasChanges && (
          <span className="text-[11px] font-mono font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            ● Unsaved modifications pending
          </span>
        )}
      </div>

      {/* Section Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle text-xs font-mono font-bold">
        {[
          { id: "hero", label: "Hero & Animated Headline", icon: Sparkles },
          { id: "metrics", label: "Trust & Proof Metrics", icon: CheckCircle2 },
          { id: "services", label: "Core Capabilities & Products", icon: Layers },
          { id: "contact", label: "Corporate Contact & Location", icon: MapPin },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2.5 border-b-2 flex items-center gap-2 transition-all ${
                isActive
                  ? "border-accent text-accent bg-accent-tint/10"
                  : "border-transparent text-fg-dim hover:text-fg-default"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: HERO & ANIMATED WORDS */}
      {activeSection === "hero" && (
        <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-xs space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
                Announcement Eyebrow Badge
              </label>
              <input
                type="text"
                value={config.announcementBadge}
                onChange={(e) => handleChange("announcementBadge", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs font-mono focus:ring-2 focus:ring-accent/20 focus:outline-none"
              />
              <p className="text-[10px] text-fg-dimmer mt-1">Rendered inside the rounded pill badge above the H1.</p>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
                Primary Brand Tagline
              </label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs focus:ring-2 focus:ring-accent/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
                Static Main Headline (Line 1)
              </label>
              <input
                type="text"
                value={config.heroHeadline}
                onChange={(e) => handleChange("heroHeadline", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle text-sm font-display font-bold focus:ring-2 focus:ring-accent/20 focus:outline-none"
              />
            </div>

            {/* Dynamic Coming-and-Going Animated Words */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono font-semibold text-fg-dim">
                  Animated Rotating Orange Text Sequence (Coming &amp; Going Loop)
                </label>
                <button
                  type="button"
                  onClick={addWord}
                  className="text-[10px] font-mono text-accent hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Phrase
                </button>
              </div>

              <div className="space-y-2">
                {config.heroAnimatedWords.map((word, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-fg-dimmer w-5">0{idx + 1}.</span>
                    <input
                      type="text"
                      value={word}
                      onChange={(e) => handleWordChange(idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent-tint/10 text-xs font-semibold text-accent-deep focus:ring-2 focus:ring-accent/20 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeWord(idx)}
                      disabled={config.heroAnimatedWords.length <= 1}
                      className="p-1.5 text-zinc-400 hover:text-red-500 disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
              Hero Definition Subhead / Tagline Paragraph
            </label>
            <textarea
              rows={3}
              value={config.heroSubhead}
              onChange={(e) => handleChange("heroSubhead", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs leading-relaxed focus:ring-2 focus:ring-accent/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
                Primary CTA Button Label
              </label>
              <input
                type="text"
                value={config.primaryCtaText}
                onChange={(e) => handleChange("primaryCtaText", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs font-mono font-bold focus:ring-2 focus:ring-accent/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
                Secondary CTA Button Label
              </label>
              <input
                type="text"
                value={config.secondaryCtaText}
                onChange={(e) => handleChange("secondaryCtaText", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs font-mono font-bold focus:ring-2 focus:ring-accent/20 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: TRUST METRICS */}
      {activeSection === "metrics" && (
        <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-xs space-y-4 text-xs">
          <p className="text-xs text-fg-dim">
            These trust metrics appear directly beneath the primary CTAs on the homepage hero.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {config.trustMetrics.map((metric, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-border-subtle bg-zinc-50 space-y-2">
                <div className="text-[10px] font-mono font-bold text-fg-dim uppercase">Metric #{idx + 1}</div>
                <div>
                  <label className="block text-[10px] font-mono text-fg-dimmer">Display Value</label>
                  <input
                    type="text"
                    value={metric.value}
                    onChange={(e) => handleMetricChange(idx, "value", e.target.value)}
                    className="w-full px-3 py-1.5 rounded border border-border-subtle text-sm font-bold text-fg-default bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-fg-dimmer">Metric Label</label>
                  <input
                    type="text"
                    value={metric.label}
                    onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                    className="w-full px-3 py-1.5 rounded border border-border-subtle text-xs text-fg-dim bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: SERVICES & CAPABILITIES */}
      {activeSection === "services" && (
        <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs text-fg-dim">
              Core consulting practices displayed in the navigation megamenu, capability accordion, and footer.
            </p>
            <span className="text-xs font-mono font-bold text-accent">{config.services.length} Core Practices Active</span>
          </div>

          <div className="space-y-3">
            {config.services.map((srv, idx) => (
              <div key={srv.id || idx} className="p-4 rounded-xl border border-border-subtle bg-zinc-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-fg-dim uppercase">Practice #{idx + 1}</span>
                  <input
                    type="text"
                    value={srv.tag}
                    onChange={(e) => handleServiceChange(idx, "tag", e.target.value)}
                    placeholder="Discipline Tag"
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white border border-border-subtle"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-mono text-fg-dimmer">Practice Title</label>
                    <input
                      type="text"
                      value={srv.title}
                      onChange={(e) => handleServiceChange(idx, "title", e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-border-subtle text-xs font-bold text-fg-default bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono text-fg-dimmer">Executive Summary</label>
                    <input
                      type="text"
                      value={srv.desc}
                      onChange={(e) => handleServiceChange(idx, "desc", e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-border-subtle text-xs text-fg-dim bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: CORPORATE CONTACT INFO */}
      {activeSection === "contact" && (
        <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-xs space-y-6 text-xs">
          <p className="text-xs text-fg-dim">
            Corporate contact channels displayed across the top contact bar, footer, and consultation forms.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-accent" /> Official Email
              </label>
              <input
                type="email"
                value={config.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-accent" /> Corporate Phone
              </label>
              <input
                type="text"
                value={config.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent" /> Headquarters Address &amp; Coverage
            </label>
            <input
              type="text"
              value={config.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContentManager;
