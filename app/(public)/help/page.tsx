import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KeyRound, ShieldCheck, ShoppingBag, UserCheck, Settings, HelpCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help Center & Support Guides — CampusVerse',
  description:
    'Find guides on account verification, OTP security, mentorship session scheduling, and privacy settings on CampusVerse.',
  alternates: {
    canonical: 'https://campusverse.edu/help',
  },
  openGraph: {
    title: 'Help Center & Support Guides — CampusVerse',
    description:
      'Find guides on account verification, OTP security, mentorship session scheduling, and privacy settings on CampusVerse.',
    url: 'https://campusverse.edu/help',
    siteName: 'CampusVerse',
    type: 'website',
  },
};

export default function HelpPage() {
  const helpSections = [
    {
      title: 'Authentication & OTP Verification',
      icon: <KeyRound className="w-5 h-5 text-brand-600" aria-hidden="true" />,
      items: [
        {
          q: 'What should I do if my OTP code expires?',
          a: 'One-time security codes expire after 5 minutes. You can request a new code after a 60-second cooldown period by clicking "Resend Code" on the verification screen.',
        },
        {
          q: 'How do I reset a forgotten password?',
          a: 'Visit /auth/forgot-password, enter your registered email address, and submit the 6-digit verification code sent to your inbox alongside your new password.',
        },
      ],
    },
    {
      title: 'Document Credential Verification',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />,
      items: [
        {
          q: 'What documents are accepted for student verification?',
          a: 'Official student ID cards with current academic year stickers, recent tuition receipts, or official enrollment letters from your university registrar.',
        },
        {
          q: 'How long does credential review take?',
          a: 'Campus administrators review submitted documents within 24 to 48 hours. You will receive an in-app notification once your badge status is updated.',
        },
      ],
    },
    {
      title: 'Campus Marketplace Safety',
      icon: <ShoppingBag className="w-5 h-5 text-orange-600" aria-hidden="true" />,
      items: [
        {
          q: 'How are marketplace transactions completed?',
          a: 'CampusVerse provides the listing and communication platform. Buyers and sellers coordinate safe on-campus meetups (e.g. library, campus center) for inspection and exchange.',
        },
        {
          q: 'How do I report an inaccurate or suspicious listing?',
          a: 'Click the report flag on any listing item. Campus safety administrators review flagged items in the moderation queue and can remove listings immediately.',
        },
      ],
    },
    {
      title: '1:1 Mentorship Guidelines',
      icon: <UserCheck className="w-5 h-5 text-purple-600" aria-hidden="true" />,
      items: [
        {
          q: 'How do I request mentorship from an alumnus?',
          a: 'Browse the Mentors directory, select an alumnus matching your target industry, specify your career goal and questions, and submit a session request.',
        },
        {
          q: 'What happens after a mentor accepts?',
          a: 'You will receive the scheduled date, time, and video meeting coordinates directly in your mentorship dashboard.',
        },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="primary" className="mb-3">
          Knowledge Base
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Help Center & Guides
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Step-by-step assistance for managing your credentials, account security, and campus workflows.
        </p>
      </div>

      <div className="space-y-8 mb-16">
        {helpSections.map((sec) => (
          <div key={sec.title} className="p-6 rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">{sec.icon}</div>
              <h2 className="text-lg font-bold text-slate-900">{sec.title}</h2>
            </div>
            <div className="space-y-4">
              {sec.items.map((it, idx) => (
                <div key={idx} className="space-y-1">
                  <h3 className="text-sm font-semibold text-slate-900">{it.q}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{it.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Further Help Contact */}
      <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-left">
          <h3 className="font-bold text-base text-slate-900">Still have questions?</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Visit our comprehensive FAQ section or send a message to our campus support team.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/faq">
            <Button variant="outline" size="sm">
              Read FAQ
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="sm" className="gap-1.5">
              Contact Support <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
