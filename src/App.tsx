import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/common/ScrollToTop";
import Index from "./pages/Index";
import SolutionsPage from "./pages/Solutions";
import UseCasesPage from "./pages/UseCases";
import AboutPage from "./pages/About";
import ServiceDetailPage from "./pages/ServiceDetail";
import ContactPage from "./pages/Contact";
import PrivacyPage from "./pages/Privacy";
import TermsPage from "./pages/Terms";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogAdminPage from "./pages/BlogAdmin";
import SuperAdminPage from "./pages/SuperAdmin";
import NotFound from "./pages/NotFound";
import OAuthConsent from "./pages/OAuthConsent";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/use-cases" element={<UseCasesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/admin" element={<BlogAdminPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/super-admin" element={<SuperAdminPage />} />
          <Route path="/admin" element={<SuperAdminPage />} />
          <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
          <Route path="/login" element={<Login />} />
          {/* CATCH-ALL ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
