import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import LogoMark from "../landing/LogoMark";

export const DbstFooter = () => {
  return (
    <footer className="bg-ink-deep text-ink-fg border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Column 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <LogoMark size="default" variant="full" onBackground="dark" />

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Transforming transportation and logistics operations with intelligent automation, custom TMS integrations, and AI-powered solutions.
            </p>

            <div className="space-y-3 pt-2 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-ink-accent" />
                <span>+61 430 981 166</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-ink-accent" />
                <span>info@dbstsolutions.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-ink-accent" />
                <span>Sydney, AU • Area served: AU</span>
              </div>
            </div>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Consulting Services
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link to="/services/strategic-consulting" className="hover:text-ink-accent transition-colors">
                  Strategic Consulting
                </Link>
              </li>
              <li>
                <Link to="/services/custom-software" className="hover:text-ink-accent transition-colors">
                  Custom Software Development
                </Link>
              </li>
              <li>
                <Link to="/services/automation-ai" className="hover:text-ink-accent transition-colors">
                  AI Automation &amp; RPA
                </Link>
              </li>
              <li>
                <Link to="/services/odoo-truckmate-erp" className="hover:text-ink-accent transition-colors">
                  Professional ERP Services
                </Link>
              </li>
              <li>
                <Link to="/services/data-analytics" className="hover:text-ink-accent transition-colors">
                  Data Analytics &amp; BI
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Solutions & Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link to="/solutions" className="hover:text-ink-accent transition-colors">
                  Solution Catalog
                </Link>
              </li>
              <li>
                <Link to="/use-cases" className="hover:text-ink-accent transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-ink-accent transition-colors">
                  About D-BST
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-ink-accent transition-colors">
                  Request Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Ecosystem & Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Product Ecosystem
            </h4>
            <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-md space-y-2">
              <div className="text-xs font-semibold text-white">GrowthMates.ai</div>
              <p className="text-xs text-zinc-400 leading-snug">
                D-BST&apos;s productized AI platform for automated workforce agents.
              </p>
              <a
                href="https://growthmates.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono text-ink-accent hover:underline pt-1"
              >
                <span>Visit Platform</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>

            <div className="pt-2 space-y-1.5 text-xs text-zinc-400">
              <div>
                <Link to="/privacy" className="hover:text-ink-accent transition-colors">
                  Privacy Policy
                </Link>
              </div>
              <div>
                <Link to="/terms" className="hover:text-ink-accent transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} D-BST Solutions. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>SOC2 Type II Certified</span>
            <span>•</span>
            <span>ISO 27001 Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
