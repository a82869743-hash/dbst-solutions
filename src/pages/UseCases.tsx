import { DbstNavigation } from "@/components/navigation/DbstNavigation";
import { DbstFooter } from "@/components/navigation/DbstFooter";
import { CaseFileExplorer } from "@/components/usecases/CaseFileExplorer";
import { ConsultationPanel } from "@/components/landing/ConsultationPanel";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const UseCasesPage = () => {
  useDocumentMeta({
    title: "Engineering Case Studies | D-BST Solutions",
    description: "Detailed technical case studies showcasing system architecture, ROI metrics, and software deliverables for enterprise clients.",
  });

  return (
    <div className="min-h-screen bg-bg-base text-fg-default font-body antialiased">
      <DbstNavigation />

      {/* Page Header */}
      <section className="py-16 bg-bg-surface border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
              Proven Track Record
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-fg-default tracking-tight">
              Real-World Impact Stories
            </h1>
            <p className="text-base text-fg-dim leading-relaxed">
              See how we've helped businesses across industries transform their operations with custom solutions, AI automation, and strategic implementation.
            </p>
          </div>
        </div>
      </section>

      <main>
        <CaseFileExplorer />
        <ConsultationPanel />
      </main>

      <DbstFooter />
    </div>
  );
};

export default UseCasesPage;
