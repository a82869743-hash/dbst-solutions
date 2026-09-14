import { DbstNavigation } from "@/components/navigation/DbstNavigation";
import { DbstFooter } from "@/components/navigation/DbstFooter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const PrivacyPage = () => {
  useDocumentMeta({
    title: "Privacy Policy | D-BST Solutions",
    description: "Privacy Policy and data governance standards for D-BST Solutions.",
  });

  return (
    <div className="min-h-screen bg-bg-base text-fg-default font-body antialiased">
      <DbstNavigation />

      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2 border-b border-border-subtle pb-6">
            <span className="text-xs font-mono font-bold uppercase text-accent">Legal & Governance</span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-fg-default">
              Privacy Policy
            </h1>
            <p className="text-[12.5px] font-mono text-fg-dim">Last updated: August 2026</p>
          </div>

          <div className="prose max-w-none space-y-6 leading-relaxed text-[13.5px] sm:text-[14px] text-fg-dim">
            <section className="space-y-2">
              <h2 className="font-display font-bold text-lg text-fg-default">1. Information Collection</h2>
              <p>
                D-BST Solutions collects business contact information submitted voluntarily via our scoping intake forms, AI solution finder diagnostic tool, and newsletter signups. We do not sell or monetize client data.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-bold text-lg text-fg-default">2. Enterprise Data Protection & Security</h2>
              <p>
                Client system specifications, codebase audits, and architecture data shared during consulting engagements are treated as strictly confidential under non-disclosure agreements (NDAs). We adhere to enterprise-grade data protection principles and robust security controls.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-bold text-lg text-fg-default">3. AI & Data Isolation</h2>
              <p>
                Inputs processed through our AI Solution Finder or custom client AI agents are never used to train public foundation LLMs. All data vectors are stored in isolated, encrypted cloud infrastructure.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-bold text-lg text-fg-default">4. Contact Information</h2>
              <p>
                For questions regarding data privacy or security compliance, contact our team at <a href="mailto:info@dbstsolutions.com" className="text-accent underline font-mono">info@dbstsolutions.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <DbstFooter />
    </div>
  );
};

export default PrivacyPage;
