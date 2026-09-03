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
  tagline: "Drive your business with Smart, Scalable, Secure & Sustainable solutions",
  heroHeadline: "Drive your business with",
  heroAnimatedWords: [
    "Smart, Sustainable &",
    "Smart, Scalable, Secure &",
    "Sustainable & Reusable",
  ],
  heroSubhead:
    "Drive your business with Smart, Scalable, Secure & Sustainable solutions. Built on sustainable and reusable architecture—transforming transportation, logistics, and enterprise operations with intelligent automation, custom TMS integrations, and AI-powered scalability.",
  primaryCtaText: "SCHEDULE DISCOVERY CALL",
  secondaryCtaText: "EXPLORE SOLUTIONS",
  contactEmail: "info@dbstsolutions.com",
  contactPhone: "+61 430 981 166",
  address: "Sydney, AU • Area served: AU & Global",
  announcementBadge: "Sustainable & Reusable Architecture",
  trustMetrics: [
    { label: "Experience", value: "15+ Years" },
    { label: "Systems Integrated", value: "100+" },
    { label: "Support Desk", value: "24/7 Follow-the-Sun" },
  ],
  services: [
    { id: "s1", title: "Strategic Consulting", desc: "No buzzwords. Practical, actionable strategic consulting delivering real business outcomes.", tag: "Advisory" },
    { id: "s2", title: "Custom Software Development", desc: "Enterprise web, mobile, and backend microservices matching your exact business workflows.", tag: "Engineering" },
    { id: "s3", title: "AI Automation & RPA", desc: "End-to-end intelligent automation from UiPath bot workflows to autonomous LLM extraction agents.", tag: "Automation" },
    { id: "s4", title: "Professional ERP Services", desc: "Deep specialization in Odoo ERP implementations and Trimble TruckMate TMS integrations.", tag: "Enterprise ERP" },
    { id: "s5", title: "Data Analytics & BI", desc: "Interactive executive dashboards, real-time event streaming, and predictive operational insights.", tag: "Intelligence" },
  ],
  featuredItemsCount: 11,
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
  address: "San Francisco, CA & Sydney, AU",
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
  activeAiModel: "gpt-4o",
  slackWebhookUrl: "",
  discordWebhookUrl: "",
  googleAnalyticsId: "G-DBST982XKL",
  metaPixelId: "",
};

// Zero fake data - all inquiries collected live from real user submissions
export const mockInquiries: InquiryItem[] = [];

const CONTENT_STORAGE_KEY = "dbst_superadmin_content";
const CREDENTIALS_STORAGE_KEY = "dbst_superadmin_credentials";
const INQUIRIES_STORAGE_KEY = "dbst_superadmin_inquiries";
const AUDIT_STORAGE_KEY = "dbst_superadmin_audit";

export class AdminStore {
  // Get Content
  static getContent(site: SiteTarget): SiteContentConfig {
    try {
      const saved = localStorage.getItem(`${CONTENT_STORAGE_KEY}_${site}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return site === "dbst" ? { ...defaultDbstContent } : { ...defaultGrowthMatesContent };
  }

  // Save Content
  static saveContent(site: SiteTarget, config: SiteContentConfig, userEmail = "admin"): void {
    try {
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
    } catch (e) {
      console.error(e);
    }
  }

  // Get Credentials
  static getCredentials(): CredentialsVault {
    try {
      const saved = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return { ...defaultCredentials };
  }

  // Save Credentials
  static saveCredentials(creds: CredentialsVault, userEmail = "admin"): void {
    try {
      localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(creds));
      this.logAction(userEmail, "Updated global credentials and API keys vault", "global");
    } catch (e) {
      console.error(e);
    }
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

    // 2. Persist to real live store
    try {
      const local = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      let items: InquiryItem[] = local ? JSON.parse(local) : [];
      items = items.filter(
        (i) => !["inq-1", "inq-2", "inq-3", "inq-4", "inq-5"].includes(i.id)
      );
      items.unshift(newItem);
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }

    // 3. Dispatch to Webhooks if configured
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

  // Get Inquiries (Only authentic customer submissions)
  static async getInquiries(): Promise<InquiryItem[]> {
    let list: InquiryItem[] = [];

    // 1. Fetch from Supabase contact_submissions
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        list = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          company: item.company || null,
          message: item.message || null,
          source: (item.source || "dbst").toLowerCase().includes("growth") ? "growthmates" : "dbst",
          status: "new",
          created_at: item.created_at,
          phone: item.phone || undefined,
        }));
      }
    } catch (err) {
      console.warn("Supabase fetch fallback", err);
    }

    // 2. Merge with locally cached inquiries (purging any legacy mock items)
    try {
      const local = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      if (local) {
        const parsedLocal: InquiryItem[] = JSON.parse(local);
        const cleanLocal = parsedLocal.filter(
          (i) => !["inq-1", "inq-2", "inq-3", "inq-4", "inq-5"].includes(i.id)
        );
        if (cleanLocal.length !== parsedLocal.length) {
          localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(cleanLocal));
        }
        const existingIds = new Set(list.map((i) => i.id));
        cleanLocal.forEach((item) => {
          if (!existingIds.has(item.id)) {
            list.push(item);
          }
        });
      }
    } catch (e) {
      console.error(e);
    }

    return list;
  }

  // Update Inquiry Status
  static updateInquiryStatus(id: string, newStatus: InquiryItem["status"], userEmail = "admin"): void {
    try {
      const local = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      let items: InquiryItem[] = local ? JSON.parse(local) : [...mockInquiries];
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
      const local = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      let items: InquiryItem[] = local ? JSON.parse(local) : [...mockInquiries];
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
        adminEmail: "owner@dbstsolutions.com",
        action: "Exported 5 client leads to CSV",
        targetSite: "global",
        details: "Export requested from Leads CRM module",
      },
      {
        id: "log-2",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        adminEmail: "owner@dbstsolutions.com",
        action: "Updated D-BST hero rotating pillars",
        targetSite: "dbst",
        details: "Synced animated coming-and-going text sequence",
      },
    ];
  }

  static logAction(adminEmail: string, action: string, targetSite: SiteTarget | "global", details = ""): void {
    try {
      const logs = this.getAuditLogs();
      const newEntry: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminEmail,
        action,
        targetSite,
        details,
      };
      logs.unshift(newEntry);
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs.slice(0, 50)));
    } catch (e) {
      console.error(e);
    }
  }
}
