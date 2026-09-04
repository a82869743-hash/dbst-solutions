import { useState, useEffect, useCallback, useMemo } from "react";
import { Map, Lightbulb, LayoutGrid, LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/landing/Navbar";
import ScrollReveal from "@/components/landing/ScrollReveal";
import RoadmapFilters from "@/components/roadmap/RoadmapFilters";
import KanbanBoard from "@/components/roadmap/KanbanBoard";
import CardDetailDrawer from "@/components/roadmap/CardDetailDrawer";
import IdeaSubmitForm from "@/components/roadmap/IdeaSubmitForm";
import IdeasList from "@/components/roadmap/IdeasList";
import AdminPanel from "@/components/roadmap/AdminPanel";
import AdminLoginDialog from "@/components/roadmap/AdminLoginDialog";
import AccessGate from "@/components/roadmap/AccessGate";
import type {
  RoadmapItem,
  Idea,
  Comment,
  IndustryTag,
  RoadmapStatus,
} from "@/components/roadmap/types";

const RoadmapPage = () => {
  const { toast } = useToast();
  const [hasAccess, setHasAccess] = useState(
    () => sessionStorage.getItem("roadmap_access") === "granted"
  );
  const [isAdmin, setIsAdmin] = useState(false);

  // Data
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [votedIdeaIds, setVotedIdeaIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Filters
  const [industry, setIndustry] = useState<IndustryTag | "all">("all");
  const [status, setStatus] = useState<RoadmapStatus | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Drawer
  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Tab
  const [tab, setTab] = useState<string>("roadmap");

  // Check admin status
  const checkAdminStatus = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setIsAdmin(false);
      return false;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    const isUserAdmin = !!roleData;
    setIsAdmin(isUserAdmin);
    return isUserAdmin;
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsRes, ideasRes, commentsRes] = await Promise.all([
        supabase.from("roadmap_items").select("*").order("display_order"),
        supabase.from("ideas_public").select("*").order("upvotes", { ascending: false }),
        supabase.from("comments_public").select("*").order("created_at", { ascending: true }),
      ]);

      const filterPublicIdeas = (raw: any[]) =>
        raw.filter(
          (i: any) =>
            !i.title?.startsWith("__") &&
            !i.title?.includes("CONFIG") &&
            i.title !== "test" &&
            !i.tags?.includes("sys_internal_config") &&
            !i.tags?.includes("sys_internal_lead")
        );

      if (itemsRes.data) setRoadmapItems(itemsRes.data as unknown as RoadmapItem[]);
      if (ideasRes.data) setIdeas(filterPublicIdeas(ideasRes.data) as unknown as Idea[]);
      if (commentsRes.data) setComments(commentsRes.data as unknown as Comment[]);

      const adminConfirmed = await checkAdminStatus();
      if (adminConfirmed) {
        try {
          const { data: adminData } = await supabase.functions.invoke("get-admin-ideas");
          if (adminData?.ideas) {
            setIdeas(filterPublicIdeas(adminData.ideas) as unknown as Idea[]);
          }
        } catch (err) {
          console.warn("Admin ideas fetch failed, using public data:", err);
        }
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [checkAdminStatus]);

  useEffect(() => {
    if (hasAccess) fetchData();
  }, [hasAccess, fetchData]);

  useEffect(() => {
    const stored = localStorage.getItem("roadmap_voted_ideas");
    if (stored) {
      try {
        setVotedIdeaIds(new Set(JSON.parse(stored)));
      } catch {}
    }
  }, []);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;

  const handleVote = async (ideaId: string) => {
    let voterEmail = localStorage.getItem("roadmap_voter_email");
    if (!voterEmail) {
      const entered = prompt("Enter your email to vote:");
      if (!entered || !isValidEmail(entered)) {
        toast({ title: "Invalid email", description: "Email is required to vote.", variant: "destructive" });
        return;
      }
      voterEmail = entered.trim();
      localStorage.setItem("roadmap_voter_email", voterEmail);
    }

    const action = votedIdeaIds.has(ideaId) ? "unvote" : "vote";

    const newVoted = new Set(votedIdeaIds);
    if (action === "vote") newVoted.add(ideaId);
    else newVoted.delete(ideaId);
    setVotedIdeaIds(newVoted);
    localStorage.setItem("roadmap_voted_ideas", JSON.stringify(Array.from(newVoted)));

    setIdeas((prev) =>
      prev.map((i) =>
        i.id === ideaId ? { ...i, upvotes: i.upvotes + (action === "vote" ? 1 : -1) } : i
      )
    );

    try {
      const { data, error } = await supabase.functions.invoke("vote-idea", {
        body: { ideaId, email: voterEmail, action },
      });
      if (error) throw error;
      if (data?.upvotes !== undefined) {
        setIdeas((prev) =>
          prev.map((i) => (i.id === ideaId ? { ...i, upvotes: data.upvotes } : i))
        );
      }
    } catch {
      toast({ title: "Vote failed", description: "Please try again.", variant: "destructive" });
      fetchData();
    }
  };

  const handleAddComment = async (targetType: "roadmap_item" | "idea", targetId: string, authorName: string, content: string) => {
    const { error } = await supabase.from("comments").insert({
      target_type: targetType,
      target_id: targetId,
      author_name: authorName,
      content: content,
    });

    if (error) {
      toast({ title: "Failed to post comment", variant: "destructive" });
      return;
    }

    const { data: refreshed } = await supabase
      .from("comments_public")
      .select("*")
      .order("created_at", { ascending: true });
    if (refreshed) setComments(refreshed as unknown as Comment[]);

    toast({ title: "Comment posted" });
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    toast({ title: "Logged out" });
    fetchData();
  };

  const filteredItems = useMemo(() => {
    return roadmapItems.filter((item) => {
      if (industry !== "all" && !item.industries.includes(industry)) return false;
      if (status !== "all" && item.status !== status) return false;
      if (selectedTags.length > 0 && !selectedTags.some((t) => item.tags.includes(t))) return false;
      return true;
    });
  }, [roadmapItems, industry, status, selectedTags]);

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      if (industry !== "all" && !idea.industries.includes(industry)) return false;
      return true;
    });
  }, [ideas, industry]);

  if (!hasAccess) {
    return <AccessGate onAccessGranted={() => setHasAccess(true)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Navbar />

      <section className="container py-10 md:py-16">
        {/* Header */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Map className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl font-display">
                  Product Roadmap
                </h1>
              </div>
              <p className="text-sm text-muted-foreground max-w-xl">
                Explore upcoming features across transport, retail &amp; supply chain AI. Upvote ideas or submit your custom integration request.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <IdeaSubmitForm onSubmitted={fetchData} />
              {isAdmin && (
                <>
                  <AdminPanel
                    ideas={ideas}
                    roadmapItems={roadmapItems}
                    onRefresh={fetchData}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-muted-foreground"
                    onClick={handleAdminLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Filters */}
        <RoadmapFilters
          industry={industry}
          status={status}
          selectedTags={selectedTags}
          onIndustryChange={setIndustry}
          onStatusChange={setStatus}
          onTagToggle={handleTagToggle}
        />

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="mt-6">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <TabsList className="bg-muted">
              <TabsTrigger value="roadmap" className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                Kanban View
              </TabsTrigger>
              <TabsTrigger value="ideas" className="gap-2">
                <Lightbulb className="h-4 w-4" />
                Community Ideas ({ideas.length})
              </TabsTrigger>
            </TabsList>

            <AdminLoginDialog onLoginSuccess={fetchData} />
          </div>

          <TabsContent value="roadmap" className="mt-6">
            <KanbanBoard
              items={filteredItems}
              comments={comments}
              onCardClick={(item) => {
                setSelectedItem(item);
                setDrawerOpen(true);
              }}
            />
          </TabsContent>

          <TabsContent value="ideas" className="mt-6">
            <IdeasList
              ideas={filteredIdeas}
              comments={comments}
              votedIdeaIds={votedIdeaIds}
              onVote={handleVote}
              onAddComment={handleAddComment}
            />
          </TabsContent>
        </Tabs>

        {/* Detail Drawer */}
        <CardDetailDrawer
          item={selectedItem}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          comments={comments.filter(
            (c) => c.target_type === "roadmap_item" && c.target_id === selectedItem?.id
          )}
          onAddComment={(content, author) =>
            selectedItem && handleAddComment("roadmap_item", selectedItem.id, author, content)
          }
        />
      </section>
    </div>
  );
};

export default RoadmapPage;
