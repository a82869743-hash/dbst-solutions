import { DbstNavigation } from "@/components/navigation/DbstNavigation";
import { DbstFooter } from "@/components/navigation/DbstFooter";
import { CapabilityMatrixHero } from "@/components/landing/CapabilityMatrixHero";
import { DbstWorkflowSection } from "@/components/landing/DbstWorkflowSection";
import { DbstTopologySection } from "@/components/landing/DbstTopologySection";
import { DbstIndustryShowcase } from "@/components/landing/DbstIndustryShowcase";
import { DbstProductFlowSection } from "@/components/landing/DbstProductFlowSection";
import { FounderNote } from "@/components/landing/FounderNote";
import { CapabilityIndex } from "@/components/landing/CapabilityIndex";
import { SolutionFinder } from "@/components/landing/SolutionFinder";
import { TechStackExplorer } from "@/components/landing/TechStackExplorer";
import { InsightsSignup } from "@/components/landing/InsightsSignup";
import { ConsultationPanel } from "@/components/landing/ConsultationPanel";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const Index = () => {
  useDocumentMeta({
    title: "D-BST Solutions | Smart, Sustainable & Scalable Tech",
    description: "D-BST Solutions delivers Smart, Sustainable & Scalable technology — Azure, Google Cloud, UiPath, OpenAI consulting, AI automation, and custom software.",
  });

  return (
    <div className="min-h-screen bg-bg-base text-fg-default font-body antialiased selection:bg-accent-tint selection:text-accent-deep">
      <DbstNavigation />
      <main>
        <CapabilityMatrixHero />
        <DbstWorkflowSection />
        <DbstTopologySection />
        <DbstIndustryShowcase />
        <DbstProductFlowSection />
        <CapabilityIndex />
        <TechStackExplorer />
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
