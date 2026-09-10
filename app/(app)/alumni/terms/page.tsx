'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react';

export default function AlumniTermsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/alumni/dashboard"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Alumni Terms of Engagement</h1>
        <p className="text-xs text-slate-500 mt-1">
          Rules governing verified alumni participation, referral endorsements, and mentorship conduct.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Verification & Credential Authenticity</h2>
            <p>
              Alumni accounts require verified graduation credentials from accredited partner institutions. Misrepresentation of degrees, current employer, or leadership designations will result in immediate credential revocation.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Mentorship Responsibilities & Safety</h2>
            <p>
              Mentors provide non-commercial guidance in good faith. Mentorship sessions must adhere to campus safety guidelines, remain professional, and comply with all applicable collegiate ethics codes.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Job Referrals & Candidate Privacy</h2>
            <p>
              Candidate resumes and notes shared through the referral system are confidential. Alumni members agree to use candidate materials solely for legitimate internal referral evaluations at their respective organizations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
