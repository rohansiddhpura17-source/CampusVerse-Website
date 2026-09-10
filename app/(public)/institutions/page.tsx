import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Activity, Users, Megaphone, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CampusVerse for Institutions — Campus Governance & Operations',
  description:
    'Institutional control center for university leadership: student verifications, moderation queues, safety, and campus broadcasts.',
  alternates: {
    canonical: 'https://campusverse.edu/institutions',
  },
  openGraph: {
    title: 'CampusVerse for Institutions — Campus Governance & Operations',
    description:
      'Institutional control center for university leadership: student verifications, moderation queues, safety, and campus broadcasts.',
    url: 'https://campusverse.edu/institutions',
    siteName: 'CampusVerse',
    type: 'website',
  },
};

export default function InstitutionsPublicPage() {
  const institutionFeatures = [
    {
      title: 'Official Credential Verification',
      desc: 'Review submitted student IDs and graduation degree certificates to authenticate campus members with audit-logged decision tracking.',
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" aria-hidden="true" />,
    },
    {
      title: 'Live Operational Telemetry',
      desc: 'Monitor real-time active users, session counts, database availability, and system uptime across mobile and web platforms.',
      icon: <Activity className="w-5 h-5 text-blue-600" aria-hidden="true" />,
    },
    {
      title: 'Trust & Safety Moderation Queue',
      desc: 'Investigate flagged forum posts, inappropriate marketplace listings, and user behavior reports with actionable resolution workflows.',
      icon: <Lock className="w-5 h-5 text-rose-600" aria-hidden="true" />,
    },
    {
      title: 'Campus-Wide Broadcasts',
      desc: 'Publish official institutional announcements and urgent updates targeted to specific cohorts (e.g. students only, alumni only, or all).',
      icon: <Megaphone className="w-5 h-5 text-purple-600" aria-hidden="true" />,
    },
    {
      title: 'User Directory Governance',
      desc: 'Access the complete registered user index with role assignment controls, account activation toggles, and secure password reset tooling.',
      icon: <Users className="w-5 h-5 text-emerald-600" aria-hidden="true" />,
    },
    {
      title: 'Comprehensive Audit Trails',
      desc: 'Every administrative status modification, report dismissal, and verification decision is recorded with actor ID and timestamp.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" aria-hidden="true" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="primary" className="mb-3">
          Institutional Governance & Operations
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Enterprise Campus Governance
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Comprehensive administrative tools for university leadership, student welfare deans, and campus IT to maintain institutional trust.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/auth/login">
            <Button size="lg" className="gap-2">
              Administrator Sign In <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact Operations Team
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {institutionFeatures.map((feat) => (
          <Card key={feat.title} className="hover:border-amber-300 transition-colors">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-2 border border-slate-100">
                {feat.icon}
              </div>
              <CardTitle className="text-base">{feat.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 leading-relaxed">
              {feat.desc}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Provisioning Security Note */}
      <div className="p-8 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-base text-amber-950">Administrative Clearance Required</h3>
          <p className="text-xs text-amber-800 max-w-xl">
            Administrative privileges cannot be obtained through self-service registration. Accounts require database provisioning or elevation by an existing superadmin.
          </p>
        </div>
        <Link href="/auth/login">
          <Button size="sm" className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white">
            Access Operations Portal
          </Button>
        </Link>
      </div>
    </div>
  );
}
