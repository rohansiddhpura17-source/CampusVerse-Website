'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  HelpCircle,
  ArrowLeft,
  Mail,
  UserCheck,
  Briefcase,
  Shield,
  Calendar,
} from 'lucide-react';

export default function AlumniHelpPage() {
  const faqs = [
    {
      q: 'How do student mentorship requests work?',
      a: 'Verified students and aspirants can request 1-on-1 mentorship from your public mentor card. When you accept an inquiry, the platform automatically schedules a kickoff Mentorship Session in your Sessions tab.'
    },
    {
      q: 'How are candidate job referrals handled?',
      a: 'Students can request internal referral endorsements for your employer. You can review their submitted resume and note under Careers > Referrals, and mark the status as Endorsed or Declined with custom feedback.'
    },
    {
      q: 'Can I control who sees my personal contact information?',
      a: 'Yes. In Settings > Privacy, you can toggle the visibility of your email address, phone number, and academic grade history. By default, contact details are only shared with confirmed connections.'
    },
    {
      q: 'How do I schedule video calls for mentorship sessions?',
      a: 'Inside your Mentorship Session Details, you can assign any standard virtual meeting URL (Google Meet, Zoom, Microsoft Teams). Both parties will see the direct link to join the session.'
    },
    {
      q: 'Are mock interview evaluations visible to employers?',
      a: 'No. Mock interview simulations and scorecards in the Career AI Hub are strictly private to your account for personal skill calibration and interview preparation.'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <Link
          href="/alumni/dashboard"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Alumni Help & Support Center</h1>
        <p className="text-xs text-slate-500 mt-1">
          Frequently asked questions, mentorship best practices, and platform assistance.
        </p>
      </div>

      {/* FAQs */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <Card key={idx}>
            <CardContent className="p-5 space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
                {faq.q}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {faq.a}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Support Card */}
      <Card className="bg-purple-50/40 border-purple-200">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-purple-900">Need Specialized Alumni Assistance?</h3>
            <p className="text-xs text-purple-700">
              Our campus alumni relations desk is available for enterprise partnerships and account inquiries.
            </p>
          </div>
          <Link href="/contact">
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5 shrink-0">
              <Mail className="w-3.5 h-3.5" /> Contact Alumni Desk
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
