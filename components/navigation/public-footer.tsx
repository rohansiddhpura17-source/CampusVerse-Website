import React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-slate-900 w-fit">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="tracking-tight">CampusVerse</span>
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Unified academic and career platform connecting university students, alumni, prospective
              applicants, and higher education institutions on a shared architecture.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/features" className="hover:text-brand-600 transition-colors">
                  All Capabilities
                </Link>
              </li>
              <li>
                <Link href="/students" className="hover:text-brand-600 transition-colors">
                  Students
                </Link>
              </li>
              <li>
                <Link href="/aspirants" className="hover:text-brand-600 transition-colors">
                  Aspirants
                </Link>
              </li>
              <li>
                <Link href="/alumni" className="hover:text-brand-600 transition-colors">
                  Alumni Network
                </Link>
              </li>
              <li>
                <Link href="/institutions" className="hover:text-brand-600 transition-colors">
                  Institutions & Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-brand-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-brand-600 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-600 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terms" className="hover:text-brand-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/community-guidelines" className="hover:text-brand-600 transition-colors">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 CampusVerse. Production Web Architecture.</p>
          <p>
            Connected to the unified CampusVerse backend & database ecosystem.
          </p>
        </div>
      </div>
    </footer>
  );
};
