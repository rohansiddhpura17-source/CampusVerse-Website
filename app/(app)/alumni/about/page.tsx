'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  ArrowLeft,
  Users,
  Target,
  Globe,
  Award,
  ShieldCheck,
} from 'lucide-react';

export default function AlumniAboutPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/alumni/dashboard"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">About CampusVerse Alumni Association</h1>
        <p className="text-xs text-slate-500 mt-1">
          Uniting global graduates to foster career acceleration, mentorship, and collegiate pride.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">Our Mission</h2>
            <p>
              The CampusVerse Alumni Association bridges graduating classes with current undergraduates, aspiring scholars, and enterprise innovators. We build an interconnected ecosystem that drives lifelong learning, professional sponsorship, and institutional stewardship.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
              <Users className="w-5 h-5 text-purple-600 mb-1" />
              <h3 className="font-bold text-slate-900 text-xs">Global Network</h3>
              <p className="text-[11px] text-slate-600">
                Thousands of verified alumni spanning premier technology, finance, research, and public leadership organizations.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
              <Target className="w-5 h-5 text-purple-600 mb-1" />
              <h3 className="font-bold text-slate-900 text-xs">Active Mentorship</h3>
              <p className="text-[11px] text-slate-600">
                1-on-1 career guidance, resume reviews, and technical interview simulations for undergraduates.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
              <Award className="w-5 h-5 text-purple-600 mb-1" />
              <h3 className="font-bold text-slate-900 text-xs">Opportunity Sponsoring</h3>
              <p className="text-[11px] text-slate-600">
                Verified candidate job referrals and direct alumni recruiter connections to fast-track career mobility.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
