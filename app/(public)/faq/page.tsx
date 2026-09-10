import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — CampusVerse',
  description:
    'Answers to common questions about CampusVerse accounts, student notes, admission predictor cutoffs, alumni referrals, and data privacy.',
  alternates: {
    canonical: 'https://campusverse.edu/faq',
  },
  openGraph: {
    title: 'Frequently Asked Questions — CampusVerse',
    description:
      'Answers to common questions about CampusVerse accounts, student notes, admission predictor cutoffs, alumni referrals, and data privacy.',
    url: 'https://campusverse.edu/faq',
    siteName: 'CampusVerse',
    type: 'website',
  },
};

export default function FaqPage() {
  const faqs = [
    {
      category: 'General & Access',
      questions: [
        {
          q: 'Is CampusVerse free for university students and aspirants?',
          a: 'Yes. Enrolling in courses, accessing peer study notes, viewing the library catalog, and searching for colleges and scholarships is completely free for individual students and aspirants.',
        },
        {
          q: 'Can I access CampusVerse on my mobile device?',
          a: 'Yes. CampusVerse provides a dedicated native Android application as well as this fully responsive web application. Your account, notes, bookmarks, and chat conversations sync in real time across both platforms.',
        },
        {
          q: 'How do I choose between Student, Aspirant, and Alumni accounts?',
          a: 'Select Student if you are currently enrolled in a degree program, Aspirant if you are preparing for college admissions, and Alumni if you have already graduated and are working professionally.',
        },
      ],
    },
    {
      category: 'Students & Academics',
      questions: [
        {
          q: 'Can anyone upload study notes to the platform?',
          a: 'Verified students can upload notes for their respective courses. Uploaded notes undergo automatic extension checks (PDF, DOCX) and are attributed with the uploader’s verified name.',
        },
        {
          q: 'How does the library resource tracker work?',
          a: 'The library catalog integrates with campus library records to show ISBN numbers, shelf call numbers, total copies, and currently available copies.',
        },
        {
          q: 'Is buying and selling on the marketplace safe?',
          a: 'All marketplace sellers are authenticated campus community members. We recommend conducting all physical textbook or hardware handoffs in public campus locations like the university library or student center.',
        },
      ],
    },
    {
      category: 'Admissions & Aspirants',
      questions: [
        {
          q: 'How does the Admission Predictor determine qualification status?',
          a: 'The predictor evaluates historical institutional cutoff scores, standardized exam percentiles (JEE Main, JEE Advanced, SAT), and high school GPA to categorize odds into Strong Candidate, Competitive, or Reach.',
        },
        {
          q: 'Are the scholarship opportunities kept up to date?',
          a: 'Yes. Institutional administrators and campus partners review scholarship criteria, application links, and deadlines periodically.',
        },
      ],
    },
    {
      category: 'Alumni, Careers & Mentorship',
      questions: [
        {
          q: 'Who can request employee referrals from alumni?',
          a: 'Enrolled students who have established a 1-on-1 connection with an alumnus can request an employee referral for open roles listed at the alumnus’s organization.',
        },
        {
          q: 'Are mentorship sessions paid or volunteer-based?',
          a: 'Alumni mentors designate whether sessions are complimentary (the default) or specify an hourly consultation rate on their profile.',
        },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="primary" className="mb-3">
          FAQ
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Common inquiries about platform operations, verified roles, admission cutoffs, and mentorship.
        </p>
      </div>

      <div className="space-y-12 mb-16">
        {faqs.map((cat) => (
          <div key={cat.category} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-200">
              {cat.category}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {cat.questions.map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-white">
                  <h3 className="font-semibold text-sm text-slate-900">{item.q}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-left">
          <h3 className="font-bold text-base text-slate-900">Need specific assistance?</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Reach out to our campus administration team with your inquiry.
          </p>
        </div>
        <Link href="/contact">
          <Button size="sm" className="gap-1.5">
            Contact Us <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
