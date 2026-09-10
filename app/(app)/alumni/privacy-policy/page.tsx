'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Shield, Lock, Eye } from 'lucide-react';

export default function AlumniPrivacyPolicyPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/alumni/dashboard"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Alumni Privacy Policy</h1>
        <p className="text-xs text-slate-500 mt-1">
          How CampusVerse protects, scopes, and manages your professional credentials and network data.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Data Collection & Professional Attributes</h2>
            <p>
              We collect information provided directly by you, including your name, current designation, employer, past degrees, and skills. We do not sell your contact information to third-party marketing brokers.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Privacy Settings & Visibility Controls</h2>
            <p>
              Through your Privacy Settings, you have direct control over whether your email address, phone number, and academic grade history are visible in search results or restricted strictly to confirmed connections.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Multi-Tenant Account & Messaging Isolation</h2>
            <p>
              Direct messages, mentorship notes, and mock interview scorecards are strictly partitioned by database foreign-key relationships. Unauthorized users cannot inspect or mutate your private messages or records.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
