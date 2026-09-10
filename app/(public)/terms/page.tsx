import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Terms of Service — CampusVerse',
  description:
    'Read the terms of service governing access to CampusVerse, student accounts, verified credentials, and marketplace commerce.',
  alternates: {
    canonical: 'https://campusverse.edu/terms',
  },
  openGraph: {
    title: 'Terms of Service — CampusVerse',
    description:
      'Read the terms of service governing access to CampusVerse, student accounts, verified credentials, and marketplace commerce.',
    url: 'https://campusverse.edu/terms',
    siteName: 'CampusVerse',
    type: 'website',
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-slate-700">
      <div className="mb-12">
        <Badge variant="secondary" className="mb-3">
          Legal Agreement
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          Last Updated & Effective: September 2, 2026
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using CampusVerse across web, mobile, or API interfaces, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service and our{' '}
            <Link href="/privacy" className="text-brand-600 hover:underline">
              Privacy Policy
            </Link>
            . If you do not agree, you must immediately discontinue using the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Account Registration & Role Integrity</h2>
          <p>
            Users must register with an accurate, active email address and select the role that accurately reflects their affiliation (Student, Aspirant, or Alumni).
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>
              <strong>Credential Authenticity:</strong> You agree that all identification documents, transcripts, and degree certificates submitted for verification are authentic and belong to you.
            </li>
            <li>
              <strong>Zero Unauthorized Admin Elevation:</strong> Public visitors cannot self-provision administrator privileges. Any attempt to forge authorization tokens or bypass RBAC will result in permanent termination of access.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Academic Integrity & Study Materials</h2>
          <p>
            CampusVerse provides an open study notes repository to support peer learning.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>
              You may only upload original notes, summaries, and authorized study materials.
            </li>
            <li>
              Uploading live examination papers, copyrighted textbooks, test leaks, or proprietary institutional materials in violation of university honor codes is strictly prohibited.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Campus Marketplace & Commerce</h2>
          <p>
            The campus marketplace is a peer-to-peer facilitation bulletin. CampusVerse is not a party to individual transactions between students. Sellers are solely responsible for accurately describing items, condition ratings, and price representations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Termination & Suspension</h2>
          <p>
            Campus administrators reserve the right to suspend or terminate accounts that violate our{' '}
            <Link href="/community-guidelines" className="text-brand-600 hover:underline">
              Community Guidelines
            </Link>
            , upload malicious code, or engage in harassment.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">6. Contact & Questions</h2>
          <p>
            For questions regarding these Terms, contact our governance office at{' '}
            <a href="mailto:support@campusverse.edu" className="text-brand-600 hover:underline">
              support@campusverse.edu
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
