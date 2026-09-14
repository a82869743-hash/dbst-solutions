import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { DbstNavigation } from "@/components/navigation/DbstNavigation";
import { DbstFooter } from "@/components/navigation/DbstFooter";
import ScrollReveal from "@/components/landing/ScrollReveal";

const FEATURED_INFOGRAPHIC_POST = {
  id: "post-featured-infographic",
  title: "AI AGENT vs AGENTIC AI: Understanding the Difference for Enterprise Operations",
  slug: "ai-agent-vs-agentic-ai",
  excerpt: "Understanding the fundamental shift from rule-based AI agents with limited memory to goal-driven Agentic AI that plans, reasons, and executes autonomous end-to-end enterprise workflows.",
  cover_image_url: "/images/ai-agent-vs-agentic-ai.png",
  author_name: "GrowthMates AI Research",
  published_at: "2026-03-28T00:00:00Z",
  tags: ["Agentic AI", "AI Architecture", "Decision Intelligence"],
};

const DEFAULT_EDITORIAL_POSTS = [
  {
    id: "post-1",
    title: "Agent Tools vs. Building AI Into Your Core System: A Data-Driven Decision Framework",
    slug: "agent-tools-vs-core-systems",
    excerpt: "74% faster time to value. 62% lower TCO over five years. 3.8x more use cases deployed. The data is clear — here is the practical framework for when to build an agent vs core system integration.",
    cover_image_url: "/images/blog-unique-1.png",
    author_name: "GrowthMates Architecture",
    published_at: "2026-03-25T00:00:00Z",
    tags: ["Agent Tools", "Build vs Buy"],
  },
  {
    id: "post-2",
    title: "Building Secure, Scalable Enterprise AI Agent Architectures",
    slug: "enterprise-ai-architecture",
    excerpt: "A deep dive into the architectural patterns, security layers, and scalability considerations for deploying autonomous AI agents across enterprise environments.",
    cover_image_url: "/images/blog-unique-2.png",
    author_name: "GrowthMates Engineering",
    published_at: "2026-03-24T00:00:00Z",
    tags: ["Enterprise AI", "Architecture"],
  },
  {
    id: "post-3",
    title: "AI Agents Are Decision Engines, Not Workflow Tools — Here's What That Means for Your Enterprise",
    slug: "ai-workflow-automation-guide",
    excerpt: "Traditional automation follows scripts. AI agents reason, decide, and act. Backed by research from Gartner, McKinsey, and Forrester, this analysis reveals why the shift from process automation is accelerating.",
    cover_image_url: "/images/blog-unique-3.png",
    author_name: "GrowthMates Strategy",
    published_at: "2026-03-20T00:00:00Z",
    tags: ["AI Agents", "Decision Intelligence"],
  },
];

const ArticleList = () => {
  const { data: postsFromDb } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image_url, author_name, tags, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const featuredPost = FEATURED_INFOGRAPHIC_POST;
  const remainingPosts = DEFAULT_EDITORIAL_POSTS;

  return (
    <div className="min-h-screen bg-bg-base text-fg-default font-body">
      <DbstNavigation />

      {/* Hero Header */}
      <section className="border-b border-border-subtle bg-bg-surface py-16 md:py-24">
        <ScrollReveal variant="fade-up">
          <div className="container max-w-4xl text-center px-4 sm:px-6">
            <span className="inline-block rounded-full bg-accent-tint border border-accent/20 px-3.5 py-1 text-xs font-mono font-bold uppercase text-accent mb-3">
              D-BST Perspectives & Insights
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-display text-[#14171F]">
              Perspectives &amp; Insights
            </h1>
            <p className="mt-3 text-base text-[#5B616E] max-w-xl mx-auto font-body">
              Deep-dive articles on Agentic AI, supply chain decision engines, and enterprise workflow automation.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Editorial Article List Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl px-4 sm:px-6 space-y-12">
          
          {/* FEATURED ARTICLE: AI AGENT vs AGENTIC AI */}
          <ScrollReveal variant="scale">
            <div className="border-b border-[#E7E5DE] pb-12">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono font-bold text-[#FF6A3D] bg-[#FF6A3D]/10 px-2.5 py-0.5 rounded uppercase tracking-wider">
                  FEATURED ARTICLE
                </span>
                <span className="text-[10px] font-mono text-[#2E5EFF] bg-[#EEF1FF] px-2.5 py-0.5 rounded font-bold">
                  Agentic AI
                </span>
              </div>

              <Link to={`/blog/${featuredPost.slug}`} className="group block space-y-4">
                <div className="overflow-hidden rounded-2xl border-2 border-[#2E5EFF]/20 mb-4 shadow-xl bg-white p-2 sm:p-3">
                  <img
                    src={featuredPost.cover_image_url}
                    alt={featuredPost.title}
                    className="h-full w-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14171F] font-display group-hover:text-[#2E5EFF] transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-sm text-[#5B616E] leading-relaxed line-clamp-2 font-body">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-[#8B8F99] font-mono pt-1">
                  <span>{featuredPost.author_name}</span>
                  <span>•</span>
                  <span>March 28, 2026</span>
                  <span>•</span>
                  <span className="text-[#2E5EFF] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Full Article &rarr;
                  </span>
                </div>
              </Link>
            </div>
          </ScrollReveal>

          {/* Remaining Posts Editorial List */}
          <div className="space-y-8">
            <h3 className="text-xs font-mono font-bold text-[#8B8F99] uppercase tracking-wider">
              LATEST RESEARCH &amp; ANALYSIS
            </h3>

            {remainingPosts.map((post, idx) => (
              <ScrollReveal key={post.id} variant="fade-up" delay={idx * 0.1}>
                <article className="border-b border-[#E7E5DE] pb-8 last:border-b-0 last:pb-0">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group grid gap-6 md:grid-cols-12 items-center"
                  >
                    <div className="md:col-span-4">
                      <div className="aspect-video overflow-hidden rounded-xl border border-[#E7E5DE] shadow-sm bg-white">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-8 space-y-2">
                      <div className="flex flex-wrap gap-2 mb-1">
                        {post.tags?.map((t: string) => (
                          <span key={t} className="text-[10px] font-mono font-bold text-[#2E5EFF] bg-[#EEF1FF] px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-[#14171F] font-display group-hover:text-[#2E5EFF] transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-[#5B616E] line-clamp-2 leading-relaxed font-body">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-[#8B8F99] pt-2 font-mono">
                        <span>
                          {post.published_at
                            ? format(new Date(post.published_at), "MMM d, yyyy")
                            : "March 2026"}
                        </span>
                        <span className="text-[#2E5EFF] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Read Article <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      <DbstFooter />
    </div>
  );
};

export default ArticleList;
