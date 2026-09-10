'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Users, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function AlumniCommunityGuidelinesPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/alumni/dashboard"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Alumni Community Guidelines</h1>
        <p className="text-xs text-slate-500 mt-1">
          Guiding principles for ethical mentorship, collegiate networking, and professional communication.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Mutual Respect & Constructive Feedback</h2>
            <p>
              CampusVerse is dedicated to a welcoming environment for all members regardless of background. All mentorship feedback, code reviews, and discussions must remain respectful, professional, and constructive.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Zero Tolerance for Harassment or Solicitation</h2>
            <p>
              Unsolicited commercial advertisements, pyramid schemes, predatory recruitment, or any form of harassment will result in immediate termination of network access.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Integrity in Recommendations</h2>
            <p>
              Alumni members offering job referrals should evaluate candidates honestly based on merit, aptitude, and alignment with target role requirements.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
