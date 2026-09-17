import { supabase } from "@/integrations/supabase/client";

export type SiteTarget = "dbst" | "growthmates";

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  source: SiteTarget | string;
  status: "new" | "reviewing" | "contacted" | "closed";
  created_at: string;
  phone?: string;
  serviceInterest?: string;
}

export interface SiteContentConfig {
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroAnimatedWords: string[];
  heroSubhead: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  trustMetrics: { label: string; value: string }[];
  announcementBadge: string;
  services: { id: string; title: string; desc: string; tag: string }[];
  featuredItemsCount: number;
}

export interface CredentialsVault {
  emailProvider: "resend" | "sendgrid" | "smtp";
  emailApiKey: string;
  senderEmail: string;
  notificationEmail: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  activeAiModel: string;
  slackWebhookUrl: string;
  discordWebhookUrl: string;
  googleAnalyticsId: string;
  metaPixelId: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminEmail: string;
  action: string;
  targetSite: SiteTarget | "global";
  details: string;
}

// Initial Default Configurations for D-BST
export const defaultDbstContent: SiteContentConfig = {
  siteName: "D-BST Solutions",
  tagline: "AI Engineering, Adoption & Digital Transformation Partner",
  heroHeadline: "Strategy-Led. Architecture-Driven.",
  heroAnimatedWords: [
    "Smart",
    "Secure",
    "Scalable",
    "Sustainable",
  ],
  heroSubhead:
    "Turning complex business challenges into practical, future-ready AI and digital solutions.",
  primaryCtaText: "BOOK A CONSULTATION",
  secondaryCtaText: "EXPLORE CAPABILITIES",
  contactEmail: "info@dbstsolutions.com",
  contactPhone: "+61 430 981 166",
  address: "Melbourne, AU",
  announcementBadge: "Smart, Secure, Scalable & Sustainable",
  trustMetrics: [
    { label: "Experience", value: "20+ Years" },
    { label: "Delivery", value: "70+ Projects" },
    { label: "Industry Reach", value: "7+ Industries" },
    { label: "Regional Reach", value: "5+ Regions" },
  ],
  services: [
    { id: "s1", title: "Digital Transformation & Advisory", desc: "Understanding complex operational challenges and creating practical transformation paths.", tag: "Advisory" },
    { id: "s2", title: "Enterprise & Solution Architecture", desc: "Translating business priorities into secure, scalable architecture and clear technology decisions.", tag: "Architecture" },
    { id: "s3", title: "AI Engineering & Adoption", desc: "Identifying valuable AI use cases, engineering controlled solutions and embedding them safely.", tag: "AI & Platform" },
    { id: "s4", title: "Custom Software & System Integration", desc: "Building applications and integrations that close operational gaps and connect business systems.", tag: "Engineering" },
    { id: "s5", title: "Data Analytics & Business Intelligence", desc: "Turning fragmented operational data into trusted information, actionable insights and better decisions.", tag: "Data & BI" },
    { id: "s6", title: "Transport Technology & TruckMate", desc: "Specialist advisory, integration and solution engineering for transport and TruckMate environments.", tag: "Transport" },
  ],
  featuredItemsCount: 6,
};

// Initial Default Configurations for GrowthMates
export const defaultGrowthMatesContent: SiteContentConfig = {
  siteName: "GrowthMates.ai",
  tagline: "Autonomous AI Agents for High-Velocity Modern Teams",
  heroHeadline: "Build, Deploy & Scale Autonomous",
  heroAnimatedWords: [
    "AI Sales Agents",
    "Customer Support Bots",
    "Operations Orchestrators",
  ],
  heroSubhead:
    "Deploy production-grade autonomous agent fleets that handle outbound outreach, 24/7 client support, and data synchronization without human bottlenecks.",
  primaryCtaText: "START FREE TRIAL",
  secondaryCtaText: "VIEW AGENT DEMOS",
  contactEmail: "founders@growthmates.ai",
  contactPhone: "+1 (800) 482-9912",
  address: "Melbourne, Australia",
  announcementBadge: "GrowthMates 2.0 Autonomous Engine Live",
  trustMetrics: [
    { label: "Active Agents", value: "10,000+" },
    { label: "Response Time", value: "<120ms" },
    { label: "SLA Uptime", value: "99.99%" },
  ],
  services: [
    { id: "g1", title: "Autonomous Outbound Agent", desc: "Multi-channel prospecting with personalized conversational intelligence.", tag: "Growth" },
    { id: "g2", title: "Support Co-Pilot", desc: "Zero-latency resolution engine trained on your knowledge base and ticket history.", tag: "Support" },
    { id: "g3", title: "Data Operations Agent", desc: "Continuous ETL synchronization bridging CRM, analytics, and billing databases.", tag: "Data" },
  ],
  featuredItemsCount: 6,
};

export const defaultCredentials: CredentialsVault = {
  emailProvider: "resend",
  emailApiKey: "",
  senderEmail: "notifications@dbstsolutions.com",
  notificationEmail: "aryan@dbstsolutions.com",
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "https://dbst-supabase-prod.supabase.co",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
  supabaseServiceKey: "",
  openaiApiKey: "",
  anthropicApiKey: "",
  activeAiModel: "gpt-4o-mini",
  slackWebhookUrl: "",
  discordWebhookUrl: "",
  googleAnalyticsId: "G-DBST982XKL",
  metaPixelId: "",
};

// Zero fake data - all inquiries collected live from real user submissions
export const mockInquiries: InquiryItem[] = [];

export const FAKE_DEMO_EMAILS = new Set([
  "elena@novafreight.com",
  "sarah.m@pacificlogistics.com.au",
  "m.chang@apexsupply.com",
  "client@enterprise.com",
]);

export const isFakeDemoInquiry = (item: Partial<InquiryItem> | null | undefined): boolean => {
  if (!item) return true;
  if (
    item.id &&
    (["inq-1", "inq-2", "inq-3", "inq-4", "inq-5", "lead-1788529630059"].includes(item.id) ||
      item.id.startsWith("lead-test-") ||
      item.id.startsWith("inq-"))
  ) {
    return true;
  }
  const email = (item.email || "").toLowerCase().trim();
  if (
    FAKE_DEMO_EMAILS.has(email) ||
    email.endsWith("@novafreight.com") ||
    email.endsWith("@pacificlogistics.com.au") ||
    email.endsWith("@apexsupply.com") ||
    email.endsWith("@enterprise.com")
  ) {
    return true;
  }
  const name = (item.name || "").toLowerCase().trim();
  if (["elena rostova", "sarah mitchell", "michael chang", "real visitor test"].includes(name)) {
    return true;
  }
  return false;
};

const CONTENT_STORAGE_KEY = "dbst_superadmin_content_v3";
const INQUIRIES_STORAGE_KEY = "dbst_superadmin_inquiries";
const DELETED_INQUIRIES_STORAGE_KEY = "dbst_superadmin_deleted_inquiries";
const AUDIT_STORAGE_KEY = "dbst_superadmin_audit";

export function getDeletedInquiryIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_INQUIRIES_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function recordDeletedInquiryId(id: string) {
  try {
    const set = getDeletedInquiryIds();
    set.add(id);
    localStorage.setItem(DELETED_INQUIRIES_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.error(e);
  }
}

// Proactively purge any legacy stale cache keys
try {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.removeItem("dbst_superadmin_content_dbst");
    localStorage.removeItem("dbst_superadmin_content");
  }
} catch (_) {}

export class AdminStore {
  // Get Content with canonical baseline
  static getContent(site: SiteTarget): SiteContentConfig {
    if (site === "dbst") {
      return { ...defaultDbstContent };
    }
    try {
      const saved = localStorage.getItem(`${CONTENT_STORAGE_KEY}_${site}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return { ...defaultGrowthMatesContent };
  }

  // Fetch remote content from Supabase cloud database
  static async fetchRemoteContent(site: SiteTarget): Promise<SiteContentConfig | null> {
    if (site === "dbst") {
      // D-BST is a production marketing site with canonical verified client copy.
      // Do not allow stale or unauthenticated remote DB records to pollute it.
      return { ...defaultDbstContent };
    }
    try {
      const { data, error } = await supabase
        .from("ideas_public")
        .select("description, created_at")
        .eq("company_name", `sys_config_${site}`)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error && data && data[0]?.description) {
        const remoteConfig: SiteContentConfig = JSON.parse(data[0].description);
        localStorage.setItem(`${CONTENT_STORAGE_KEY}_${site}`, JSON.stringify(remoteConfig));
        window.dispatchEvent(
          new CustomEvent("admin_content_updated", { detail: { site, config: remoteConfig } })
        );
        return remoteConfig;
      }
    } catch (e) {
      console.warn(`Could not sync cloud content for ${site}:`, e);
    }
    return null;
  }

  // Save Content to both localStorage AND Supabase cloud database
  static async saveContent(site: SiteTarget, config: SiteContentConfig, userEmail = "admin"): Promise<void> {
    try {
      // 1. Immediate local responsiveness
      localStorage.setItem(`${CONTENT_STORAGE_KEY}_${site}`, JSON.stringify(config));
      this.logAction(userEmail, `Updated ${config.siteName} content configuration`, site);

      // Dispatch live reactive updates
      window.dispatchEvent(
        new CustomEvent("admin_content_updated", { detail: { site, config } })
      );
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: `${CONTENT_STORAGE_KEY}_${site}`,
          newValue: JSON.stringify(config),
        })
      );

      // 2. Persist to shared Supabase cloud database so all visitors globally see the change
      await supabase.from("ideas").insert({
        title: `__CONFIG_${site.toUpperCase()}__`,
        company_name: `sys_config_${site}`,
        description: JSON.stringify(config),
        tags: ["sys_internal_config"],
        contact_email: "admin@dbstsolutions.com",
      });
    } catch (e) {
      console.error("Save content error:", e);
    }
  }

  // Get Credentials metadata (never reads plaintext secrets from browser localStorage)
  static getCredentials(): CredentialsVault {
    return { ...defaultCredentials };
  }

  // Save Credentials (delegates to server-side configuration, never writes to localStorage)
  static async saveCredentials(
    creds: Partial<CredentialsVault>,
    userEmail = "admin"
  ): Promise<{ success: boolean; persisted?: boolean; requiresManualConfig?: boolean; message?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (token) {
        const res = await fetch("/api/admin-credentials", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(creds),
        });
        const json = await res.json();
        await this.logAction(userEmail, "Submitted credentials update to server", "dbst");
        return json;
      }
    } catch (e: any) {
      console.error("Save credentials error:", e);
      return { success: false, message: e?.message || "Failed to contact server" };
    }
    return { success: false, message: "No active session" };
  }

  // Record a real customer inquiry submitted from website
  static async recordInquiry(data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    serviceInterest?: string;
    message?: string;
    source?: SiteTarget | string;
  }): Promise<InquiryItem> {
    const newItem: InquiryItem = {
      id: `lead-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company || null,
      serviceInterest: data.serviceInterest,
      message: data.message || null,
      source: (data.source || "dbst") as SiteTarget,
      status: "new",
      created_at: new Date().toISOString(),
    };

    // 1. Insert into Supabase table contact_submissions
    try {
      await supabase.from("contact_submissions").insert({
        name: data.name,
        email: data.email,
        company: data.company || null,
        message: data.serviceInterest
          ? `[${data.serviceInterest}] ${data.message || ""}`
          : data.message || null,
        source: data.source || "dbst",
      });
    } catch (err) {
      console.warn("Supabase direct insert fallback", err);
    }

    // 2. Mirror into cloud database stream for cross-device admin inbox visibility
    try {
      await supabase.from("ideas").insert({
        title: `__LEAD_INCOMING__`,
        company_name: `sys_lead_${data.source || "dbst"}`,
        description: JSON.stringify(newItem),
        tags: ["sys_internal_lead"],
        contact_email: data.email,
      });
    } catch (err) {
      console.warn("Cloud lead mirror fallback", err);
    }

    // 3. Persist to real live local cache
    try {
      const local = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      let items: InquiryItem[] = local ? JSON.parse(local) : [];
      items = items.filter(
        (i) => !["inq-1", "inq-2", "inq-3", "inq-4", "inq-5"].includes(i.id)
      );
      items.unshift(newItem);
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent("admin_inquiries_updated", { detail: newItem }));
    } catch (e) {
      console.error(e);
    }

    // 4. Dispatch to Webhooks if configured
    try {
      const creds = this.getCredentials();
      if (creds.slackWebhookUrl) {
        fetch(creds.slackWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `🚨 New Lead on ${newItem.source.toUpperCase()}: ${newItem.name} (${newItem.email}) - ${newItem.company || "Direct"}\n> ${newItem.message || ""}`,
          }),
        }).catch(() => {});
      }
      if (creds.discordWebhookUrl) {
        fetch(creds.discordWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `🚨 **New Lead on ${newItem.source.toUpperCase()}**: ${newItem.name} (${newItem.email}) - ${newItem.company || "Direct"}\n> ${newItem.message || ""}`,
          }),
        }).catch(() => {});
      }
    } catch (e) {}

    this.logAction("visitor", `New customer inquiry received from ${newItem.name}`, newItem.source as SiteTarget, newItem.email);
    return newItem;
  }

  // Get Inquiries (Only authentic customer submissions - synced from cloud + database)
  static async getInquiries(): Promise<InquiryItem[]> {
    let list: InquiryItem[] = [];
    const deletedIds = getDeletedInquiryIds();

    // 1. Fetch from cloud database stream (accessible to admin on ANY device without secret keys)
    try {
      const { data, error } = await supabase
        .from("ideas_public")
        .select("id, description, created_at")
        .like("company_name", "sys_lead_%")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        data.forEach((row) => {
          try {
            if (row.description) {
              const item: InquiryItem = JSON.parse(row.description);
              if (item && !isFakeDemoInquiry(item) && !deletedIds.has(item.id) && !deletedIds.has(row.id)) {
                if (
                  !list.some(
                    (existing) =>
                      existing.id === item.id ||
                      (existing.email === item.email && existing.created_at === item.created_at)
                  )
                ) {
                  list.push(item);
                }
              }
            }
          } catch (e) {}
        });
      }
    } catch (err) {
      console.warn("Cloud leads fetch fallback", err);
    }

    // 2. Fetch from Supabase contact_submissions
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        data.forEach((item: any) => {
          const mapped: InquiryItem = {
            id: item.id,
            name: item.name,
            email: item.email,
            company: item.company || null,
            message: item.message || null,
            source: (item.source || "dbst").toLowerCase().includes("growth") ? "growthmates" : "dbst",
            status: "new",
            created_at: item.created_at,
            phone: item.phone || undefined,
          };
          if (
            !isFakeDemoInquiry(mapped) &&
            !deletedIds.has(mapped.id) &&
            !list.some(
              (existing) =>
                existing.email === mapped.email &&
                Math.abs(new Date(existing.created_at).getTime() - new Date(mapped.created_at).getTime()) < 5000
            )
          ) {
            list.push(mapped);
          }
        });
      }
    } catch (err) {
      console.warn("Supabase fetch fallback", err);
    }

    // 3. Merge with locally cached inquiries (purging any legacy mock items)
    try {
      const local = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      if (local) {
        const parsedLocal: InquiryItem[] = JSON.parse(local);
        const cleanLocal = parsedLocal.filter(
          (i) => !isFakeDemoInquiry(i) && !deletedIds.has(i.id)
        );
        if (cleanLocal.length !== parsedLocal.length) {
          localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(cleanLocal));
        }
        cleanLocal.forEach((item) => {
          if (
            !list.some(
              (existing) =>
                existing.id === item.id ||
                (existing.email === item.email && existing.created_at === item.created_at)
            )
          ) {
            list.push(item);
          }
        });
      }
    } catch (e) {
      console.error(e);
    }

    // Filter once more to ensure zero fake or deleted inquiries slip through
    list = list.filter((i) => !isFakeDemoInquiry(i) && !deletedIds.has(i.id));

    // Sort newest first
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return list;
  }

  // Update Inquiry Status
  static updateInquiryStatus(id: string, newStatus: InquiryItem["status"], userEmail = "admin"): void {
    try {
      const local = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      let items: InquiryItem[] = local ? JSON.parse(local) : [];
      items = items.map((i) => (i.id === id ? { ...i, status: newStatus } : i));
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(items));
      this.logAction(userEmail, `Updated status of lead #${id} to ${newStatus}`, "global");
    } catch (e) {
      console.error(e);
    }
  }

  // Delete Inquiry
  static deleteInquiry(id: string, userEmail = "admin"): void {
    try {
      recordDeletedInquiryId(id);
      const local = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      let items: InquiryItem[] = local ? JSON.parse(local) : [];
      items = items.filter((i) => i.id !== id);
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(items));
      this.logAction(userEmail, `Deleted lead record #${id}`, "global");
    } catch (e) {
      console.error(e);
    }
  }

  // Export Inquiries to CSV
  static exportInquiriesToCsv(items: InquiryItem[]): void {
    const headers = ["ID", "Source Site", "Name", "Email", "Phone", "Company", "Status", "Service Interest", "Created At", "Message"];
    const rows = items.map((i) => [
      `"${i.id}"`,
      `"${i.source.toUpperCase()}"`,
      `"${(i.name || "").replace(/"/g, '""')}"`,
      `"${(i.email || "").replace(/"/g, '""')}"`,
      `"${(i.phone || "").replace(/"/g, '""')}"`,
      `"${(i.company || "").replace(/"/g, '""')}"`,
      `"${i.status.toUpperCase()}"`,
      `"${(i.serviceInterest || "").replace(/"/g, '""')}"`,
      `"${i.created_at}"`,
      `"${(i.message || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inquiries_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Audit Logs
  static getAuditLogs(): AuditLogEntry[] {
    try {
      const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "log-1",
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        adminEmail: "admin@dbstsolutions.com",
        action: "Exported 5 client leads to CSV",
        targetSite: "global",
        details: "Export requested from Leads CRM module",
      },
      {
        id: "log-2",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        adminEmail: "admin@dbstsolutions.com",
        action: "Updated D-BST hero rotating pillars",
        targetSite: "dbst",
        details: "Synced animated coming-and-going text sequence",
      },
    ];
  }

  static async logAction(
    adminEmail: string,
    action: string,
    targetSite: SiteTarget | "global" = "dbst",
    details = ""
  ): Promise<void> {
    const site = targetSite === "global" ? "dbst" : targetSite;
    try {
      await supabase.from("audit_log").insert({
        action,
        entity_type: "admin_action",
        admin_email: adminEmail || "admin",
        details: {
          target_site: site,
          details,
          client_timestamp: new Date().toISOString(),
        },
      });
    } catch (e) {
      console.error("Failed to insert into audit_log:", e);
    }

    try {
      const logs = this.getAuditLogs();
      const newEntry: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminEmail,
        action,
        targetSite: site,
        details,
      };
      logs.unshift(newEntry);
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs.slice(0, 50)));
    } catch (e) {
      console.error(e);
    }
  }

  // Fetch real cross-site audit logs from Supabase cloud database
  static async fetchAuditLogs(): Promise<AuditLogEntry[]> {
    try {
      const { data, error } = await supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!error && data && data.length > 0) {
        return data.map((item: any) => {
          const detailsObj =
            typeof item.details === "object" && item.details !== null
              ? item.details
              : {};
          const targetSite =
            detailsObj.target_site ||
            (item.entity_type === "auth" ? "dbst" : "global");
          const note =
            typeof detailsObj.details === "string"
              ? detailsObj.details
              : detailsObj.reason || detailsObj.note || "";

          return {
            id: item.id,
            timestamp: item.created_at,
            adminEmail: item.admin_email,
            action: item.action,
            targetSite,
            details: note,
          };
        });
      }
    } catch (e) {
      console.warn("Could not fetch remote audit logs:", e);
    }
    return this.getAuditLogs();
  }
}
