import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Privacy Policy — CampusVerse',
  description:
    'Learn how CampusVerse protects your academic data, handles document verifications, and empowers users with privacy controls.',
  alternates: {
    canonical: 'https://campusverse.edu/privacy',
  },
  openGraph: {
    title: 'Privacy Policy — CampusVerse',
    description:
      'Learn how CampusVerse protects your academic data, handles document verifications, and empowers users with privacy controls.',
    url: 'https://campusverse.edu/privacy',
    siteName: 'CampusVerse',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-slate-700">
      <div className="mb-12">
        <Badge variant="secondary" className="mb-3">
          User Privacy
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          Last Updated & Effective: September 2, 2026
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            CampusVerse collects information necessary to deliver authentic academic, admissions, and career networking tools:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>
              <strong>Identity & Authentication:</strong> Name, university email address, salted password hash, and assigned role.
            </li>
            <li>
              <strong>Verification Documents:</strong> Uploaded student IDs, enrollment verification letters, and alumni degree credentials submitted for badge validation.
            </li>
            <li>
              <strong>Academic & Career Records:</strong> Enrolled courses, major, semester, CGPA, graduation year, employment designations, and career roadmaps.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. How Information is Used</h2>
          <p>
            Your information is used strictly to power platform features:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>Personalizing academic dashboards and AI study assistant context.</li>
            <li>Executing admission probability predictions against university cutoffs.</li>
            <li>Authenticating role access perimeters across web and mobile applications.</li>
            <li>Facilitating 1-on-1 mentorship bookings and employee referral requests.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Granular Privacy Settings</h2>
          <p>
            Every user has access to dedicated Privacy Settings in their profile:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li><strong>Show/Hide Email & Phone:</strong> Keep contact details hidden from search results.</li>
            <li><strong>Show/Hide GPA:</strong> Restrict academic performance visibility from public profiles.</li>
            <li><strong>Message Filtering:</strong> Choose to accept messages from All Users, Connections Only, or Nobody.</li>
            <li><strong>Mentorship Requests:</strong> Toggle your availability to receive student mentorship requests.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Data Security & Storage</h2>
          <p>
            CampusVerse uses 256-bit SSL encryption in transit. Authentication tokens are securely verified on each request. Uploaded verification documents are stored in access-restricted buckets accessible only by authorized campus reviewers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Contact Our Privacy Officer</h2>
          <p>
            If you have questions about your personal data or wish to request data erasure, contact our data privacy coordinator at{' '}
            <a href="mailto:privacy@campusverse.edu" className="text-brand-600 hover:underline">
              privacy@campusverse.edu
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
