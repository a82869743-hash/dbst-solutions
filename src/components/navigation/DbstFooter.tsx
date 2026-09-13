import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import LogoMark from "../landing/LogoMark";
import { AdminStore, SiteContentConfig } from "@/lib/admin/adminStore";

export const DbstFooter = () => {
  const [contentConfig, setContentConfig] = useState<SiteContentConfig>(() => AdminStore.getContent("dbst"));

  useEffect(() => {
    AdminStore.fetchRemoteContent("dbst").then((remote) => {
      if (remote) setContentConfig(remote);
    });

    const handleUpdate = () => {
      setContentConfig(AdminStore.getContent("dbst"));
    };
    window.addEventListener("admin_content_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("admin_content_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <footer className="bg-ink-deep text-ink-fg border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Column 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <LogoMark size="default" variant="full" onBackground="dark" />

            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 pt-1">
              AI Engineering, Adoption and Digital Transformation
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              We bring strategy, architecture and engineering together to solve complex business and operational challenges.
            </p>

            <div className="space-y-3 pt-2 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-ink-accent" />
                <a href="tel:+61430981166" className="hover:text-ink-accent transition-colors">
                  +61 430 981 166
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-ink-accent" />
                <a href="mailto:info@dbstsolutions.com" className="hover:text-ink-accent transition-colors">
                  info@dbstsolutions.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-ink-accent" />
                <span>Melbourne, Australia • Serving Asia Pacific and North America</span>
              </div>
            </div>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Our Capabilities
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link to="/services/digital-transformation" className="hover:text-ink-accent transition-colors">
                  Digital Transformation & Advisory
                </Link>
              </li>
              <li>
                <Link to="/services/enterprise-architecture" className="hover:text-ink-accent transition-colors">
                  Enterprise & Solution Architecture
                </Link>
              </li>
              <li>
                <Link to="/services/ai-engineering" className="hover:text-ink-accent transition-colors">
                  AI Engineering & Adoption
                </Link>
              </li>
              <li>
                <Link to="/services/custom-software" className="hover:text-ink-accent transition-colors">
                  Custom Software & System Integration
                </Link>
              </li>
              <li>
                <Link to="/services/data-analytics" className="hover:text-ink-accent transition-colors">
                  Data Analytics & Business Intelligence
                </Link>
              </li>
              <li>
                <Link to="/services/transport-technology" className="hover:text-ink-accent transition-colors">
                  Transport Technology & TruckMate
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link to="/solutions" className="hover:text-ink-accent transition-colors">
                  Our Approach
                </Link>
              </li>
              <li>
                <Link to="/use-cases" className="hover:text-ink-accent transition-colors">
                  Industry Experiences
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-ink-accent transition-colors">
                  About D-BST
                </Link>
              </li>
              <li>
                <a href="https://growthmates.ai" target="_blank" rel="noreferrer" className="hover:text-ink-accent transition-colors">
                  Growthmates AI
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-ink-accent transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Ecosystem & Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Our Agentic AI Platform
            </h4>
            <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-md space-y-2">
              <div className="text-xs font-semibold text-white">Growthmates AI</div>
              <p className="text-xs text-zinc-400 leading-snug">
                Connect business systems with modular AI agents, tools and controlled workflows&mdash;while keeping people informed and in control.
              </p>
              <a
                href="https://growthmates.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono text-ink-accent hover:underline pt-1"
              >
                <span>Explore Growthmates AI</span>
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
            © {new Date().getFullYear()} D-BST Solutions Pty Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-zinc-400 font-bold tracking-widest uppercase text-[10px]">
            <span>Smart</span>
            <span>•</span>
            <span>Secure</span>
            <span>•</span>
            <span>Scalable</span>
            <span>•</span>
            <span>Sustainable</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
