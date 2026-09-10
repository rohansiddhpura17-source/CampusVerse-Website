import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Compass, Scale, TrendingUp, Award, Bot, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CampusVerse for Aspirants — College Explorer, Cutoffs & Grants',
  description:
    'Discover universities, compare programs side-by-side, predict admission cutoffs, and search scholarships with CampusVerse for aspirants.',
  alternates: {
    canonical: 'https://campusverse.edu/aspirants',
  },
  openGraph: {
    title: 'CampusVerse for Aspirants — College Explorer, Cutoffs & Grants',
    description:
      'Discover universities, compare programs side-by-side, predict admission cutoffs, and search scholarships with CampusVerse for aspirants.',
    url: 'https://campusverse.edu/aspirants',
    siteName: 'CampusVerse',
    type: 'website',
  },
};

export default function AspirantsPublicPage() {
  const aspirantFeatures = [
    {
      title: 'Global College Explorer',
      desc: 'Browse accredited institutions with verifiable data on tuition fees, acceptance rates, NIRF/global rankings, and degree offerings.',
      icon: <Compass className="w-5 h-5 text-emerald-600" aria-hidden="true" />,
    },
    {
      title: 'Program Comparison Tool',
      desc: 'Evaluate prospective universities side-by-side across average fees, campus sizes, degree requirements, and location.',
      icon: <Scale className="w-5 h-5 text-teal-600" aria-hidden="true" />,
    },
    {
      title: 'Admission Predictor',
      desc: 'Input your GPA and standardized test scores (JEE Main, JEE Advanced, SAT) to calculate realistic cutoff probabilities: Strong Candidate, Competitive, or Reach.',
      icon: <TrendingUp className="w-5 h-5 text-blue-600" aria-hidden="true" />,
    },
    {
      title: 'Verified Scholarship Catalog',
      desc: 'Access verified grants and financial aid opportunities with explicit eligibility requirements and application links.',
      icon: <Award className="w-5 h-5 text-amber-600" aria-hidden="true" />,
    },
    {
      title: 'AI Admission Advisor',
      desc: 'Consult our specialized Gemini admission advisor for guidance on prerequisite courses, entrance exam preparation, and program fit.',
      icon: <Bot className="w-5 h-5 text-indigo-600" aria-hidden="true" />,
    },
    {
      title: 'Target Institution Bookmarks',
      desc: 'Save and organize your top university choices and track important deadlines from a centralized admissions dashboard.',
      icon: <CheckCircle2 className="w-5 h-5 text-fuchsia-600" aria-hidden="true" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="primary" className="mb-3">
          Prospective Applicant Portal
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Clarity on Your Path to Higher Education
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Explore institutions worldwide, compare programs with verified data, calculate admission cutoffs, and discover eligible financial aid.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/auth/register?role=ASPIRANT">
            <Button size="lg" className="gap-2">
              Explore as an Aspirant <ArrowRight className="w-4 h-4" aria-hidden="true" />
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
        {aspirantFeatures.map((feat) => (
          <Card key={feat.title} className="hover:border-emerald-300 transition-colors">
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

      {/* Decision Intelligence Banner */}
      <div className="p-8 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-base text-emerald-950">Data-Driven Admissions</h3>
          <p className="text-xs text-emerald-800 max-w-xl">
            Never make blind applications. Use verified historical scores and cutoff trends to map out your target, match, and safety schools.
          </p>
        </div>
        <Link href="/auth/register?role=ASPIRANT">
          <Button size="sm" className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white">
            Get Started Free
          </Button>
        </Link>
      </div>
    </div>
  );
}
