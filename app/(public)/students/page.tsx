import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Library, ShoppingBag, Calendar, Bot, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CampusVerse for Students — Academics, Notes & Campus Life',
  description:
    'Manage enrolled courses, study notes, campus marketplace, library items, and hackathons with CampusVerse for students.',
  alternates: {
    canonical: 'https://campusverse.edu/students',
  },
  openGraph: {
    title: 'CampusVerse for Students — Academics, Notes & Campus Life',
    description:
      'Manage enrolled courses, study notes, campus marketplace, library items, and hackathons with CampusVerse for students.',
    url: 'https://campusverse.edu/students',
    siteName: 'CampusVerse',
    type: 'website',
  },
};

export default function StudentsPublicPage() {
  const studentFeatures = [
    {
      title: 'Course Management & GPA',
      desc: 'Keep track of current semester courses, departmental course codes, credits, and cumulative grade point averages in one place.',
      icon: <BookOpen className="w-5 h-5 text-blue-600" aria-hidden="true" />,
    },
    {
      title: 'Peer Notes Hub',
      desc: 'Access verified study notes uploaded by classmates. Upload your own notes with tags and track download popularity.',
      icon: <FileText className="w-5 h-5 text-indigo-600" aria-hidden="true" />,
    },
    {
      title: 'Digital Library Catalog',
      desc: 'Search institution library books, check shelf location codes, and view real-time available copy counts before heading to the stacks.',
      icon: <Library className="w-5 h-5 text-emerald-600" aria-hidden="true" />,
    },
    {
      title: 'Peer-to-Peer Marketplace',
      desc: 'Buy and sell textbooks, laboratory kits, scientific calculators, and dorm essentials directly with verified students.',
      icon: <ShoppingBag className="w-5 h-5 text-orange-600" aria-hidden="true" />,
    },
    {
      title: 'Hackathons & Events',
      desc: 'Discover technology hackathons, technical workshops, and club meetings with instant one-click registration.',
      icon: <Calendar className="w-5 h-5 text-rose-600" aria-hidden="true" />,
    },
    {
      title: 'AI Study Assistant',
      desc: 'Accelerate your learning with our specialized study tutor powered by Gemini AI, offering concept clarifications and practice drills.',
      icon: <Bot className="w-5 h-5 text-violet-600" aria-hidden="true" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="primary" className="mb-3">
          Undergraduate & Graduate Portal
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Everything You Need for Academic Success
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          From semester coursework and verified study notes to student-to-student marketplace listings and campus hackathons.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/auth/register?role=STUDENT">
            <Button size="lg" className="gap-2">
              Create Student Account <ArrowRight className="w-4 h-4" aria-hidden="true" />
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
        {studentFeatures.map((feat) => (
          <Card key={feat.title} className="hover:border-brand-300 transition-colors">
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

      {/* Trust Callout */}
      <div className="p-8 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-base text-blue-950">Official Student Verification</h3>
          <p className="text-xs text-blue-800 max-w-xl">
            Upload your student ID card or enrollment certificate to unlock verified status and connect with alumni mentors.
          </p>
        </div>
        <Link href="/auth/register?role=STUDENT">
          <Button size="sm" className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white">
            Join as a Student
          </Button>
        </Link>
      </div>
    </div>
  );
}
