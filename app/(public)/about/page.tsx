import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, ShieldCheck, Database, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About CampusVerse — Platform Mission & Architecture',
  description:
    'Learn about CampusVerse, our unified ecosystem architecture, role-based workflows, and commitment to academic integrity.',
  alternates: {
    canonical: 'https://campusverse.edu/about',
  },
  openGraph: {
    title: 'About CampusVerse — Platform Mission & Architecture',
    description:
      'Learn about CampusVerse, our unified ecosystem architecture, role-based workflows, and commitment to academic integrity.',
    url: 'https://campusverse.edu/about',
    siteName: 'CampusVerse',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="primary" className="mb-3">
          Our Foundation
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          About CampusVerse
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Unifying every chapter of higher education into a single, cohesive digital experience.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">Connecting Campus Life with Lifelong Careers</h2>
          <p>
            Historically, universities have relied on fragmented software tools: admissions portals for applicants, learning management systems for enrolled coursework, disjointed social groups for peer discussions, and outdated spreadsheets for alumni relations.
          </p>
          <p>
            CampusVerse bridges these silos. We connect prospective applicants researching institutions, active students managing courses and peer notes, graduates mentoring the next generation, and university administration governing campus operations.
          </p>
          <div className="pt-2">
            <Link href="/auth/register">
              <Button size="sm" className="gap-2">
                Join CampusVerse <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" aria-hidden="true" />
            Core Architectural Principles
          </h3>
          <ul className="space-y-3 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
              <span><strong>Single Source of Truth:</strong> One Express REST API and unified Prisma database serving both Android and Web clients.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
              <span><strong>Role-Based Integrity:</strong> Four specialized security perimeters with elevated administrative authorization checks.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
              <span><strong>Verified Data:</strong> Document credential submissions reviewed by campus authorities before status elevation.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Platform Commitments</h2>
          <p className="text-xs text-slate-500 mt-2">The standards guiding every feature and integration on CampusVerse.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <Database className="w-5 h-5" aria-hidden="true" />
              </div>
              <CardTitle className="text-base">System Integrity</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 leading-relaxed">
              No mock databases or parallel tables. All actions taken on web synchronize live with our native Android app and central backend.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                <Users className="w-5 h-5" aria-hidden="true" />
              </div>
              <CardTitle className="text-base">Verified Community</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 leading-relaxed">
              Academic credentials, graduation claims, and administrative status require verification to prevent misinformation.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <CardTitle className="text-base">Student Data Privacy</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 leading-relaxed">
              Students have granular controls to hide contact numbers, restrict messaging, and manage visibility to peer networks.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
