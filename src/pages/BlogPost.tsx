import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { DbstNavigation } from "@/components/navigation/DbstNavigation";
import { DbstFooter } from "@/components/navigation/DbstFooter";
import DecisionEngineArticle from "@/components/blog/articles/DecisionEngineArticle";
import SecureArchitectureArticle from "@/components/blog/articles/SecureArchitectureArticle";
import AgentToolsArticle from "@/components/blog/articles/AgentToolsArticle";
import AiAgentVsAgenticAiArticle from "@/components/blog/articles/AiAgentVsAgenticAiArticle";
import SocialShareButtons from "@/components/blog/SocialShareButtons";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const RICH_ARTICLES: Record<string, React.ComponentType> = {
  "ai-agent-vs-agentic-ai": AiAgentVsAgenticAiArticle,
  "ai-workflow-automation-guide": DecisionEngineArticle,
  "enterprise-ai-architecture": SecureArchitectureArticle,
  "agent-tools-vs-core-systems": AgentToolsArticle,
};

const DEFAULT_POSTS = [
  {
    id: "post-0",
    title: "AI AGENT vs AGENTIC AI: Understanding the Difference for Enterprise Operations",
    slug: "ai-agent-vs-agentic-ai",
    excerpt: "Understanding the fundamental shift from rule-based AI agents with limited memory to goal-driven Agentic AI that plans, reasons, and executes autonomous end-to-end enterprise workflows.",
    cover_image_url: "/images/ai-agent-vs-agentic-ai.png",
    author_name: "GrowthMates AI Research",
    published_at: "2026-03-28T00:00:00Z",
    tags: ["Agentic AI", "AI Architecture", "Decision Intelligence"],
  },
  {
    id: "post-1",
    title: "Building Secure, Scalable Enterprise AI Agent Architectures",
    slug: "enterprise-ai-architecture",
    excerpt: "A deep dive into the architectural patterns, security layers, and scalability considerations for deploying autonomous AI agents across enterprise environments.",
    cover_image_url: "/images/blog-1.png",
    author_name: "GrowthMates Engineering",
    published_at: "2026-03-25T00:00:00Z",
    tags: ["Enterprise AI", "Architecture"],
  },
  {
    id: "post-2",
    title: "AI Agents Are Decision Engines, Not Workflow Tools — Here's What That Means for Your Enterprise",
    slug: "ai-workflow-automation-guide",
    excerpt: "Traditional automation follows scripts. AI agents reason, decide, and act. Backed by research, this analysis reveals why the shift from process automation is accelerating.",
    cover_image_url: "/images/blog-2.png",
    author_name: "GrowthMates Strategy",
    published_at: "2026-03-24T00:00:00Z",
    tags: ["AI Agents", "Decision Intelligence"],
  },
  {
    id: "post-3",
    title: "Model Context Protocol (MCP): The New Standard for Enterprise System Integration",
    slug: "agent-tools-vs-core-systems",
    excerpt: "Why model context protocol (MCP 1.0) is superseding legacy REST/GraphQL connectors across enterprise ERP, TMS, and warehouse management platforms.",
    cover_image_url: "/images/blog-3.png",
    author_name: "GrowthMates Architecture",
    published_at: "2026-03-20T00:00:00Z",
    tags: ["MCP Protocol", "System Integration"],
  },
];

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollPct((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: postFromDb, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const post = postFromDb || DEFAULT_POSTS.find((p) => p.slug === slug);
  const RichComponent = slug ? RICH_ARTICLES[slug] : undefined;

  useDocumentMeta(
    post
      ? {
          title: post.title,
          description: post.excerpt,
          image: post.cover_image_url || undefined,
          url: `/blog/${post.slug}`,
          author: post.author_name,
          publishedTime: post.published_at || undefined,
          tags: post.tags,
        }
      : null
  );

  if (isLoading && !post) {
    return (
      <div className="min-h-screen bg-bg-base text-fg-default font-body">
        <DbstNavigation />
        <div className="container max-w-[680px] py-20 space-y-4">
          <div className="h-8 bg-border-subtle animate-pulse rounded w-3/4" />
          <div className="h-4 bg-border-subtle animate-pulse rounded w-1/2" />
          <div className="h-64 bg-border-subtle animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-bg-base text-fg-default font-body">
        <DbstNavigation />
        <div className="container flex flex-col items-center justify-center py-32 text-center">
          <h1 className="text-3xl font-extrabold font-display">Article not found</h1>
          <p className="mt-2 text-sm text-fg-dim">This article may have been removed or updated.</p>
          <Link to="/blog" className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs font-semibold text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>
        <DbstFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base text-fg-default font-body relative">
      {/* Fixed Top Scroll Progress Rail */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-border-subtle">
        <div className="h-full bg-accent transition-all duration-150" style={{ width: `${scrollPct}%` }} />
      </div>

      <DbstNavigation />

      {/* Header Container */}
      <header className="container max-w-3xl pt-14 pb-8 border-b border-[#E7E5DE] px-4 sm:px-6">
        <Link
          to="/blog"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-mono text-[#5B616E] hover:text-[#14171F] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All Publications
        </Link>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.map((tag: string) => (
            <span key={tag} className="text-[10px] font-mono text-[#2E5EFF] bg-[#EEF1FF] px-2.5 py-0.5 rounded-full font-bold">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl font-extrabold sm:text-4xl leading-tight font-display text-[#14171F]">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center justify-between text-xs text-[#5B616E] font-mono border-t border-[#E7E5DE] pt-4">
          <div className="flex items-center gap-3">
            <span>By {post.author_name}</span>
            <span>•</span>
            <span>{post.published_at ? format(new Date(post.published_at), "MMMM d, yyyy") : ""}</span>
          </div>
          <SocialShareButtons url={`/blog/${post.slug}`} title={post.title} excerpt={post.excerpt} />
        </div>
      </header>

      {/* Cover Image */}
      {post.cover_image_url && !RichComponent && (
        <div className="container max-w-3xl my-8 px-4 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-[#E7E5DE] shadow-md">
            <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover max-h-[420px]" />
          </div>
        </div>
      )}

      {/* Reading Body */}
      <main className="container max-w-3xl py-8 px-4 sm:px-6">
        {RichComponent ? (
          <RichComponent />
        ) : (
          <article className="prose prose-sm max-w-none text-[#14171F] leading-relaxed font-body">
            <ReactMarkdown>{(post as any).content}</ReactMarkdown>
          </article>
        )}

        {/* Post Footer CTA */}
        <div className="mt-16 rounded-3xl bg-[#16214F] text-white p-8 text-center space-y-3 shadow-xl border border-[#2E5EFF]/30">
          <h3 className="text-xl font-bold text-white font-display">
            Ready to transition to Agentic Decision Intelligence?
          </h3>
          <p className="text-xs text-white/80 max-w-md mx-auto font-body">
            Discover how custom AI agents can automate your logistics or retail operations.
          </p>
          <button
            onClick={() =>
              (window as any).Calendly?.initPopupWidget({
                url: "https://calendly.com/d-bstsolutions/book-your-free-consultation",
              })
            }
            className="mt-3 rounded-full bg-[#2E5EFF] px-7 py-3 text-xs font-bold text-white hover:bg-[#1B3BB3] transition-all inline-block shadow-md hover:scale-105"
          >
            Book a Free Consultation
          </button>
        </div>
      </main>

      <DbstFooter />
    </div>
  );
};

export default BlogPost;
