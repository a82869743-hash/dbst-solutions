import { DbstNavigation } from "@/components/navigation/DbstNavigation";
import { DbstFooter } from "@/components/navigation/DbstFooter";
import { CapabilityMatrixHero } from "@/components/landing/CapabilityMatrixHero";
import { DbstWorkflowSection } from "@/components/landing/DbstWorkflowSection";
import { DbstTopologySection } from "@/components/landing/DbstTopologySection";
import { DbstIndustryShowcase } from "@/components/landing/DbstIndustryShowcase";
import { FounderNote } from "@/components/landing/FounderNote";
import { CapabilityIndex } from "@/components/landing/CapabilityIndex";
import { SolutionFinder } from "@/components/landing/SolutionFinder";
import { InsightsSignup } from "@/components/landing/InsightsSignup";
import { ConsultationPanel } from "@/components/landing/ConsultationPanel";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const Index = () => {
  useDocumentMeta({
    title: "D-BST Solutions | AI Engineering, Adoption & Digital Transformation",
    description: "D-BST Solutions brings strategy, architecture and engineering together to solve complex business and operational challenges. AI Engineering, Enterprise Architecture, Digital Transformation and more.",
  });

  return (
    <div className="min-h-screen bg-bg-base text-fg-default font-body antialiased selection:bg-accent-tint selection:text-accent-deep">
      <DbstNavigation />
      <main>
        <CapabilityMatrixHero />
        <DbstWorkflowSection />
        <DbstTopologySection />
        <DbstIndustryShowcase />
        <CapabilityIndex />
        <SolutionFinder />
        <FounderNote />
        <ConsultationPanel />
        <InsightsSignup />
      </main>
      <DbstFooter />
    </div>
  );
};

export default Index;
