import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Community Guidelines — CampusVerse',
  description:
    'Standards of conduct for students, alumni, and campus community members on CampusVerse.',
  alternates: {
    canonical: 'https://campusverse.edu/community-guidelines',
  },
  openGraph: {
    title: 'Community Guidelines — CampusVerse',
    description:
      'Standards of conduct for students, alumni, and campus community members on CampusVerse.',
    url: 'https://campusverse.edu/community-guidelines',
    siteName: 'CampusVerse',
    type: 'website',
  },
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-slate-700">
      <div className="mb-12">
        <Badge variant="secondary" className="mb-3">
          Campus Standards
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Community Guidelines
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          Last Updated: September 2, 2026
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Respect, Inclusivity & Professionalism</h2>
          <p>
            CampusVerse brings together undergraduate students, prospective applicants, alumni, and faculty. We expect all interactions—whether in discussion forums, marketplace chats, or mentorship sessions—to be constructive and courteous.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>Zero tolerance for harassment, hate speech, bullying, defamation, or discrimination.</li>
            <li>Do not spam discussion boards, direct messages, or mentorship request queues.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Academic Integrity & Study Notes</h2>
          <p>
            The Notes Hub is designed for collaborative learning, lecture summaries, and concept overviews.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>Never upload live examination questions, active test solutions, or copyrighted textbook scans.</li>
            <li>Honor your university’s code of academic integrity at all times.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Honest Mentorship & Referrals</h2>
          <p>
            Mentorship relies on mutual trust and preparation.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>Students should research their mentor’s background and prepare thoughtful questions ahead of scheduled sessions.</li>
            <li>Alumni mentors agree to offer honest, constructive career guidance and accurate job referral recommendations.</li>
            <li>Charging unauthorized fees outside of documented profile consultation settings is prohibited.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Transparent Peer Commerce</h2>
          <p>
            All marketplace listings must accurately depict item condition, edition year (for textbooks), and any physical wear or defects.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Enforcement & Reporting</h2>
          <p>
            Users can flag any content or behavior violating these standards. Campus safety administrators review the moderation queue daily and will issue warnings, remove listings, or suspend accounts where necessary.
          </p>
        </section>
      </div>
    </div>
  );
}
