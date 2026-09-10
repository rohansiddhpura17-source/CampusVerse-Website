import React from 'react';
import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { ContactForm } from './contact-form';

export const metadata: Metadata = {
  title: 'Contact CampusVerse — Institutional & Support Inquiries',
  description:
    'Get in touch with the CampusVerse team for platform support, student verification inquiries, and university partnerships.',
  alternates: {
    canonical: 'https://campusverse.edu/contact',
  },
  openGraph: {
    title: 'Contact CampusVerse — Institutional & Support Inquiries',
    description:
      'Get in touch with the CampusVerse team for platform support, student verification inquiries, and university partnerships.',
    url: 'https://campusverse.edu/contact',
    siteName: 'CampusVerse',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="primary" className="mb-3">
          Get in Touch
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Contact CampusVerse
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Have an inquiry regarding student credentialing, institutional deployment, or account assistance? Send our operations team a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Contact Information Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-600" aria-hidden="true" />
                Support Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">Student & Member Inquiries</p>
                <p className="text-slate-500 mt-0.5">support@campusverse.edu</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">University Partnerships & Deans</p>
                <p className="text-slate-500 mt-0.5">institutions@campusverse.edu</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600" aria-hidden="true" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-2">
              <p>Monday – Friday: 9:00 AM – 6:00 PM IST</p>
              <p>Saturday: 10:00 AM – 2:00 PM IST</p>
              <p className="text-slate-400 pt-1 text-[11px]">Verification reviews process within 24 to 48 business hours.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                Security & Data Integrity
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600">
              For urgent vulnerability reports or account compromise alerts, mark the subject as URGENT SECURITY for priority triaging.
            </CardContent>
          </Card>
        </div>

        {/* Interactive Form Column */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Send an Inquiry</CardTitle>
              <p className="text-xs text-slate-500">All submissions are logged and routed to the appropriate campus operations coordinator.</p>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
