import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, UserCheck, TrendingUp, Bot, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CampusVerse for Alumni — Network, Mentorship & Careers',
  description:
    'Connect with fellow graduates, post hiring opportunities with employee referrals, and mentor students on CampusVerse.',
  alternates: {
    canonical: 'https://campusverse.edu/alumni',
  },
  openGraph: {
    title: 'CampusVerse for Alumni — Network, Mentorship & Careers',
    description:
      'Connect with fellow graduates, post hiring opportunities with employee referrals, and mentor students on CampusVerse.',
    url: 'https://campusverse.edu/alumni',
    siteName: 'CampusVerse',
    type: 'website',
  },
};

export default function AlumniPublicPage() {
  const alumniFeatures = [
    {
      title: 'Verified Alumni Directory',
      desc: 'Discover fellow graduates by current company, industry domain, graduation year, and location with direct 1-on-1 connection requests.',
      icon: <Users className="w-5 h-5 text-purple-600" aria-hidden="true" />,
    },
    {
      title: 'Job Board & Employee Referrals',
      desc: 'Post open roles directly to student talent and offer verified employee referrals to accelerate student hiring pipelines.',
      icon: <Briefcase className="w-5 h-5 text-indigo-600" aria-hidden="true" />,
    },
    {
      title: '1:1 Mentorship Sessions',
      desc: 'Share your industry experience by offering structured mentorship. Set your availability, review booking requests, and host video calls.',
      icon: <UserCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />,
    },
    {
      title: 'Career Progression Roadmaps',
      desc: 'Track professional milestones, manage career progression goals, and log skill endorsements to mentor students on their career paths.',
      icon: <TrendingUp className="w-5 h-5 text-blue-600" aria-hidden="true" />,
    },
    {
      title: 'AI Career Coach',
      desc: 'Use our AI career coach to optimize job requirements, benchmark skill competencies, and review resume profiles.',
      icon: <Bot className="w-5 h-5 text-fuchsia-600" aria-hidden="true" />,
    },
    {
      title: 'Alumni Credential Verification',
      desc: 'Obtain an official verified alumni badge by linking your graduation degree, increasing trust across the network.',
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" aria-hidden="true" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="primary" className="mb-3">
          Alumni & Professional Portal
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Stay Connected with Your Alma Mater
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Reconnect with classmates, find verified student talent for your company, provide employee referrals, and mentor students shaping tomorrow.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/auth/register?role=ALUMNI">
            <Button size="lg" className="gap-2">
              Join Alumni Network <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {alumniFeatures.map((feat) => (
          <Card key={feat.title} className="hover:border-purple-300 transition-colors">
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

      {/* Alumni Impact Callout */}
      <div className="p-8 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-base text-purple-950">Empower Future Graduates</h3>
          <p className="text-xs text-purple-800 max-w-xl">
            A 30-minute mentorship session or a company referral can shape a student&apos;s career trajectory. Join your alumni chapter today.
          </p>
        </div>
        <Link href="/auth/register?role=ALUMNI">
          <Button size="sm" className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white">
            Register as Alumni
          </Button>
        </Link>
      </div>
    </div>
  );
}
