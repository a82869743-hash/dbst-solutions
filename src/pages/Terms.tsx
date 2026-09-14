import { DbstNavigation } from "@/components/navigation/DbstNavigation";
import { DbstFooter } from "@/components/navigation/DbstFooter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const TermsPage = () => {
  useDocumentMeta({
    title: "Terms of Service | D-BST Solutions",
    description: "Terms of Service and consulting engagement policies for D-BST Solutions.",
  });

  return (
    <div className="min-h-screen bg-bg-base text-fg-default font-body antialiased">
      <DbstNavigation />

      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2 border-b border-border-subtle pb-6">
            <span className="text-xs font-mono font-bold uppercase text-accent">Legal & Terms</span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-fg-default">
              Terms of Service
            </h1>
            <p className="text-[12.5px] font-mono text-fg-dim">Last updated: August 2026</p>
          </div>

          <div className="prose max-w-none space-y-6 leading-relaxed text-[13.5px] sm:text-[14px] text-fg-dim">
            <section className="space-y-2">
              <h2 className="font-display font-bold text-lg text-fg-default">1. Engagement Scope</h2>
              <p>
                D-BST Solutions provides technical consulting, software engineering, and AI integration services under formally executed Statements of Work (SOW) and Master Services Agreements (MSA).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-bold text-lg text-fg-default">2. Intellectual Property</h2>
              <p>
                Unless explicitly agreed upon otherwise in writing, all custom code, software architectures, and deliverables created specifically for a client under a paid engagement are assigned to the client upon full payment.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-bold text-lg text-fg-default">3. Service Level Agreements (SLA)</h2>
              <p>
                Production SLAs, uptime guarantees, and maintenance support windows are governed by individual client contracts.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-bold text-lg text-fg-default">4. Governing Law</h2>
              <p>
                These terms are governed by the laws of California, USA and Victoria, Australia depending on the primary contracting entity.
              </p>
            </section>
          </div>
        </div>
      </main>

      <DbstFooter />
    </div>
  );
};

export default TermsPage;
