import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  RefreshCw,
  Plus,
  Send,
  X,
  MessageSquare,
  Globe,
  Sparkles,
} from "lucide-react";
import { AdminStore, InquiryItem, SiteTarget, isFakeDemoInquiry } from "@/lib/admin/adminStore";
import { toast } from "@/hooks/use-toast";

interface AdminInquiriesInboxProps {
  selectedSite: SiteTarget | "all";
  adminEmail: string;
}

export const AdminInquiriesInbox: React.FC<AdminInquiriesInboxProps> = ({
  selectedSite,
  adminEmail,
}) => {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeInquiry, setActiveInquiry] = useState<InquiryItem | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // New manual inquiry form state
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceInterest: "",
    message: "",
    source: "dbst" as SiteTarget,
  });

  const loadData = async () => {
    setLoading(true);
    // Purge any legacy fake/demo data from browser cache immediately
    try {
      const local = localStorage.getItem("dbst_superadmin_inquiries");
      if (local) {
        const parsed: InquiryItem[] = JSON.parse(local);
        const filteredLocal = parsed.filter((i) => !isFakeDemoInquiry(i));
        localStorage.setItem("dbst_superadmin_inquiries", JSON.stringify(filteredLocal));
      }
    } catch {}

    const data = await AdminStore.getInquiries();
    setInquiries(data.filter((i) => !isFakeDemoInquiry(i)));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered inquiries
  const filtered = inquiries.filter((item) => {
    // Site filter
    if (selectedSite !== "all" && item.source !== selectedSite) return false;
    // Status filter
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchEmail = item.email?.toLowerCase().includes(q);
      const matchCompany = item.company?.toLowerCase().includes(q);
      const matchMsg = item.message?.toLowerCase().includes(q);
      return matchName || matchEmail || matchCompany || matchMsg;
    }
    return true;
  });

  // KPI counts
  const totalCount = inquiries.length;
  const newCount = inquiries.filter((i) => i.status === "new").length;
  const dbstCount = inquiries.filter((i) => i.source === "dbst").length;
  const growthCount = inquiries.filter((i) => i.source === "growthmates").length;

  const handleStatusChange = (id: string, newStatus: InquiryItem["status"]) => {
    AdminStore.updateInquiryStatus(id, newStatus, adminEmail);
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (activeInquiry?.id === id) {
      setActiveInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    toast({ title: "Status Updated", description: `Lead marked as ${newStatus}.` });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    AdminStore.deleteInquiry(id, adminEmail);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    if (activeInquiry?.id === id) setActiveInquiry(null);
    toast({ title: "Lead Deleted", description: "Inquiry removed from the database." });
  };

  const handlePurgeAll = () => {
    if (!window.confirm("Purge all locally cached data and reload real live submissions only?")) return;
    localStorage.removeItem("dbst_superadmin_inquiries");
    loadData();
    toast({ title: "Cache Purged", description: "Showing real live inquiries only." });
  };

  const handleExport = () => {
    AdminStore.exportInquiriesToCsv(filtered);
    toast({ title: "Export Started", description: "Downloading CSV spreadsheet." });
  };

  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.email) {
      toast({ title: "Missing fields", description: "Name and email are required.", variant: "destructive" });
      return;
    }

    const createdItem: InquiryItem = {
      id: `manual-${Date.now()}`,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone || undefined,
      company: newLead.company || null,
      serviceInterest: newLead.serviceInterest || "Direct Enquiry",
      message: newLead.message || null,
      source: newLead.source,
      status: "new",
      created_at: new Date().toISOString(),
    };

    const updated = [createdItem, ...inquiries];
    setInquiries(updated);
    localStorage.setItem("dbst_superadmin_inquiries", JSON.stringify(updated));
    AdminStore.logAction(adminEmail, `Created manual inquiry for ${newLead.name}`, newLead.source);

    setShowNewModal(false);
    setNewLead({ name: "", email: "", phone: "", company: "", serviceInterest: "", message: "", source: "dbst" });
    toast({ title: "Lead Created", description: "New inquiry logged successfully." });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold font-display text-fg-default flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-accent" />
            <span>Unified Lead &amp; Email Inbox</span>
          </h2>
          <p className="text-xs text-fg-dim">
            Centralized customer communications from both D-BST Solutions &amp; GrowthMates.ai
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="px-3 py-2 text-xs font-mono font-medium rounded-md border border-border-subtle bg-bg-surface hover:bg-zinc-50 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handlePurgeAll}
            className="px-3 py-2 text-xs font-mono font-medium rounded-md border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 flex items-center gap-1.5 transition-colors"
            title="Purge cached test records"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Mock Data</span>
          </button>

          <button
            onClick={handleExport}
            className="px-3.5 py-2 text-xs font-mono font-medium rounded-md border border-border-subtle bg-bg-surface hover:bg-zinc-50 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-accent" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 text-xs font-medium rounded-md bg-accent text-white hover:bg-accent-deep flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Manual Lead</span>
          </button>
        </div>
      </div>

      {/* KPI Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl border border-border-subtle bg-white shadow-xs">
          <div className="text-[11px] text-fg-dim uppercase tracking-wider font-semibold">Total Inquiries</div>
          <div className="text-2xl font-bold text-fg-default mt-1">{totalCount}</div>
        </div>
        <div className="p-4 rounded-xl border border-accent/20 bg-accent-tint/30 shadow-xs">
          <div className="text-[11px] text-accent-deep uppercase tracking-wider font-semibold">New / Unread</div>
          <div className="text-2xl font-bold text-accent-deep mt-1 flex items-center gap-2">
            <span>{newCount}</span>
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border-subtle bg-white shadow-xs">
          <div className="text-[11px] text-fg-dim uppercase tracking-wider font-semibold">D-BST Solutions</div>
          <div className="text-2xl font-bold text-fg-default mt-1">{dbstCount}</div>
        </div>
        <div className="p-4 rounded-xl border border-border-subtle bg-white shadow-xs">
          <div className="text-[11px] text-fg-dim uppercase tracking-wider font-semibold">GrowthMates.ai</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">{growthCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-zinc-50 border border-border-subtle">
        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fg-dimmer" />
          <input
            type="text"
            placeholder="Search leads by name, email, company, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border-subtle bg-white focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-border-subtle text-xs font-mono">
          {["all", "new", "reviewing", "contacted", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-md capitalize font-semibold transition-colors ${
                statusFilter === status
                  ? "bg-accent text-white"
                  : "text-fg-dim hover:text-fg-default"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table / Feed */}
      <div className="rounded-xl border border-border-subtle bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-fg-dim flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-accent" />
            <span>Synchronizing inquiries...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-fg-dim space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold font-display text-fg-default">No Incoming Client Inquiries Yet</p>
              <p className="text-xs text-fg-dim mt-1 max-w-md mx-auto">
                Real inquiries submitted by visitors via <code className="text-accent font-mono">/contact</code> or the consultation booking panel will appear here live in real time.
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Ingestion Listener Active
              </span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-border-subtle text-fg-dim font-mono uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Origin Site</th>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Message Preview</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Received</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map((item) => {
                  const isDbst = item.source === "dbst";
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-zinc-50/80 transition-colors cursor-pointer ${
                        item.status === "new" ? "bg-accent-tint/10 font-medium" : ""
                      }`}
                      onClick={() => setActiveInquiry(item)}
                    >
                      {/* Origin Site Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            isDbst
                              ? "bg-orange-100 text-orange-800 border border-orange-200"
                              : "bg-purple-100 text-purple-800 border border-purple-200"
                          }`}
                        >
                          <Globe className="w-3 h-3" />
                          <span>{isDbst ? "D-BST" : "GrowthMates"}</span>
                        </span>
                      </td>

                      {/* Client Name & Contact */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-fg-default">{item.name}</div>
                        <div className="text-[11px] text-fg-dim font-mono">{item.email}</div>
                      </td>

                      {/* Company */}
                      <td className="py-3 px-4 text-fg-default">
                        {item.company ? (
                          <div className="flex items-center gap-1">
                            <Building className="w-3 h-3 text-fg-dim" />
                            <span>{item.company}</span>
                          </div>
                        ) : (
                          <span className="text-fg-dimmer italic">Individual</span>
                        )}
                      </td>

                      {/* Message Preview */}
                      <td className="py-3 px-4 max-w-xs">
                        <p className="truncate text-fg-dim text-[11px]">
                          {item.message || "No message provided"}
                        </p>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as InquiryItem["status"])}
                          className={`text-[11px] font-mono font-bold px-2 py-1 rounded-md border focus:outline-none cursor-pointer ${
                            item.status === "new"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : item.status === "reviewing"
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : item.status === "contacted"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : "bg-zinc-100 text-zinc-600 border-zinc-200"
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="reviewing">In Review</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 whitespace-nowrap text-fg-dim font-mono text-[11px]">
                        {new Date(item.created_at).toLocaleDateString("en-AU", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-2">
                          <a
                            href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(
                              item.serviceInterest || "Inquiry from " + item.name
                            )}&body=Hi ${encodeURIComponent(
                              item.name
                            )},\n\nThank you for reaching out to us regarding: "${encodeURIComponent(
                              item.message || ""
                            )}".\n\nBest regards,\nBimal Thakkar & Team`}
                            className="p-1.5 rounded-md hover:bg-zinc-200 text-fg-dim hover:text-accent transition-colors"
                            title="Reply via Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-md hover:bg-red-50 text-fg-dim hover:text-red-600 transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Drawer / Modal */}
      {activeInquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-border-subtle shadow-floating overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                    activeInquiry.source === "dbst"
                      ? "bg-orange-100 text-orange-800 border border-orange-200"
                      : "bg-purple-100 text-purple-800 border border-purple-200"
                  }`}
                >
                  {activeInquiry.source === "dbst" ? "D-BST Solutions" : "GrowthMates.ai"}
                </span>
                <span className="text-xs font-mono text-fg-dim">#{activeInquiry.id}</span>
              </div>
              <button
                onClick={() => setActiveInquiry(null)}
                className="p-1.5 rounded-md text-fg-dim hover:text-fg-default hover:bg-zinc-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div>
                <h3 className="text-lg font-bold font-display text-fg-default">{activeInquiry.name}</h3>
                <div className="flex flex-wrap items-center gap-4 text-fg-dim mt-1 font-mono text-[11px]">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-accent" />
                    <a href={`mailto:${activeInquiry.email}`} className="hover:underline">
                      {activeInquiry.email}
                    </a>
                  </span>
                  {activeInquiry.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-accent" />
                      <a href={`tel:${activeInquiry.phone}`} className="hover:underline">
                        {activeInquiry.phone}
                      </a>
                    </span>
                  )}
                  {activeInquiry.company && (
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-accent" />
                      {activeInquiry.company}
                    </span>
                  )}
                </div>
              </div>

              {activeInquiry.serviceInterest && (
                <div className="p-3 bg-zinc-50 rounded-lg border border-border-subtle">
                  <div className="text-[10px] font-mono uppercase font-bold text-fg-dim">Target Practice / Interest</div>
                  <div className="font-semibold text-fg-default mt-0.5">{activeInquiry.serviceInterest}</div>
                </div>
              )}

              <div>
                <div className="text-[10px] font-mono uppercase font-bold text-fg-dim mb-1">Full Message Content</div>
                <div className="p-4 bg-zinc-50 rounded-xl border border-border-subtle font-body text-fg-default text-xs leading-relaxed whitespace-pre-wrap">
                  {activeInquiry.message || "No detailed message was left by the client."}
                </div>
              </div>

              {/* Status Update Bar */}
              <div className="pt-2 flex items-center justify-between border-t border-border-subtle">
                <span className="text-fg-dim font-mono">Current Status:</span>
                <div className="flex items-center gap-1.5">
                  {(["new", "reviewing", "contacted", "closed"] as InquiryItem["status"][]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(activeInquiry.id, st)}
                      className={`px-3 py-1 rounded-md font-mono text-[11px] capitalize transition-colors ${
                        activeInquiry.status === st
                          ? "bg-accent text-white font-bold"
                          : "bg-zinc-100 text-fg-dim hover:text-fg-default"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-zinc-50 border-t border-border-subtle flex items-center justify-end gap-3">
              <button
                onClick={() => handleDelete(activeInquiry.id)}
                className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                Delete Lead
              </button>
              <a
                href={`mailto:${activeInquiry.email}?subject=Re: Inquiry from ${encodeURIComponent(
                  activeInquiry.name
                )}&body=Hi ${encodeURIComponent(activeInquiry.name)},\n\n`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-accent text-white font-medium text-xs hover:bg-accent-deep transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Launch Email Reply</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Manual Lead Logging Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-border-subtle shadow-floating overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-zinc-50">
              <h3 className="font-bold font-display text-base text-fg-default flex items-center gap-2">
                <Plus className="w-4 h-4 text-accent" />
                <span>Log New Customer Inquiry</span>
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1.5 rounded-md text-fg-dim hover:text-fg-default hover:bg-zinc-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">Target Website *</label>
                  <select
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value as SiteTarget })}
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="dbst">D-BST Solutions</option>
                    <option value="growthmates">GrowthMates.ai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bimal Thakkar"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">Client Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+61 400 000 000"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="Logistics Corp Pty Ltd"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">Practice / Solution</label>
                  <input
                    type="text"
                    placeholder="e.g. TruckMate TMS, Odoo ERP"
                    value={newLead.serviceInterest}
                    onChange={(e) => setNewLead({ ...newLead, serviceInterest: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">Notes / Inquiry Message</label>
                <textarea
                  rows={3}
                  placeholder="Details regarding the requirements, timeline, or meeting notes..."
                  value={newLead.message}
                  onChange={(e) => setNewLead({ ...newLead, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-md text-fg-dim hover:bg-zinc-100 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-accent text-white hover:bg-accent-deep text-xs font-medium shadow-sm transition-colors"
                >
                  Save Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiriesInbox;
