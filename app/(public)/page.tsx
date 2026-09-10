import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Briefcase,
  Compass,
  ShieldCheck,
  ArrowRight,
  Bot,
  Award,
  Users,
  UserCheck,
  MessageSquare,
  Calendar,
  ShoppingBag,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'CampusVerse — Unified Campus Academic & Career Ecosystem',
  description:
    'One platform for students, aspirants, alumni, mentorship, careers and campus communities.',
  alternates: {
    canonical: 'https://campusverse.edu',
  },
  openGraph: {
    title: 'CampusVerse — Unified Campus Academic & Career Ecosystem',
    description:
      'One platform for students, aspirants, alumni, mentorship, careers and campus communities.',
    url: 'https://campusverse.edu',
    siteName: 'CampusVerse',
    type: 'website',
  },
};

export default function HomePage() {
  const audienceSegments = [
    {
      title: 'Students',
      role: 'Active Undergraduates & Graduates',
      desc: 'Organize enrolled semester courses, download peer-verified notes, reserve library resources, and trade textbooks.',
      icon: <BookOpen className="w-5 h-5 text-blue-600" aria-hidden="true" />,
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      href: '/students',
      features: ['Course Schedules & CGPA', 'Notes Hub with Analytics', 'Peer Marketplace', 'Campus Hackathons'],
    },
    {
      title: 'Aspirants',
      role: 'Prospective University Applicants',
      desc: 'Explore higher education institutions worldwide, compare programs side-by-side, forecast cutoffs, and track scholarships.',
      icon: <Compass className="w-5 h-5 text-emerald-600" aria-hidden="true" />,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      href: '/aspirants',
      features: ['College Directory & Rankings', 'Program Comparison Tool', 'Admission Score Predictor', 'Financial Aid & Grants'],
    },
    {
      title: 'Alumni',
      role: 'Graduates & Industry Professionals',
      desc: 'Keep in touch with your alma mater, mentor students, post openings, and support applicants through employee referrals.',
      icon: <Briefcase className="w-5 h-5 text-purple-600" aria-hidden="true" />,
      color: 'bg-purple-50 border-purple-200 text-purple-900',
      href: '/alumni',
      features: ['Verified Alumni Directory', 'Job Board & Referrals', '1:1 Mentorship Booking', 'Career Milestones'],
    },
    {
      title: 'Institutions & Admin',
      role: 'Deans, Faculty & Governance',
      desc: 'Maintain platform integrity with student credential verification, moderation queues, campus alerts, and live telemetry.',
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" aria-hidden="true" />,
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      href: '/institutions',
      features: ['Official ID Verifications', 'Platform Telemetry Metrics', 'Community Moderation', 'Broadcast Announcements'],
    },
  ];

  const featurePillars = [
    {
      name: 'Academic Management',
      desc: 'Comprehensive semester course overviews, credits calculations, and student academic standing tracking.',
      icon: <BookOpen className="w-5 h-5 text-blue-600" aria-hidden="true" />,
    },
    {
      name: 'AI Study Assistant',
      desc: 'Context-aware academic explanations, concept breakdowns, and algorithm tutoring powered by Gemini AI.',
      icon: <Bot className="w-5 h-5 text-indigo-600" aria-hidden="true" />,
    },
    {
      name: 'College Discovery',
      desc: 'Filter verified university profiles by country, degrees offered, tuition fees, and admission acceptance rates.',
      icon: <Compass className="w-5 h-5 text-emerald-600" aria-hidden="true" />,
    },
    {
      name: 'Scholarships',
      desc: 'Curated directory of merit-based and need-based financial aid opportunities with direct requirements.',
      icon: <Award className="w-5 h-5 text-teal-600" aria-hidden="true" />,
    },
    {
      name: 'Career Opportunities',
      desc: 'Full-time positions, summer internships, and graduate trainee listings directly posted by campus recruiters.',
      icon: <Briefcase className="w-5 h-5 text-purple-600" aria-hidden="true" />,
    },
    {
      name: 'Alumni Network',
      desc: 'Search verified alumni by company, designation, industry, and graduation year with direct connection requests.',
      icon: <Users className="w-5 h-5 text-violet-600" aria-hidden="true" />,
    },
    {
      name: 'Mentorship',
      desc: 'Structured 1-on-1 mentorship bookings with dedicated scheduling, agenda goals, and meeting coordinates.',
      icon: <UserCheck className="w-5 h-5 text-fuchsia-600" aria-hidden="true" />,
    },
    {
      name: 'Messaging',
      desc: 'Direct, focused 1-on-1 private messaging channels between connected students, mentors, and peers.',
      icon: <MessageSquare className="w-5 h-5 text-sky-600" aria-hidden="true" />,
    },
    {
      name: 'Events',
      desc: 'Campus workshops, technology webinars, hackathons, and career fairs with built-in attendee registration.',
      icon: <Calendar className="w-5 h-5 text-rose-600" aria-hidden="true" />,
    },
    {
      name: 'Marketplace',
      desc: 'Secure student-to-student peer marketplace for secondhand textbooks, engineering kits, and electronics.',
      icon: <ShoppingBag className="w-5 h-5 text-orange-600" aria-hidden="true" />,
    },
    {
      name: 'Community',
      desc: 'Subject-specific campus clubs, discussion boards, post threads, comments, and real-time upvotes.',
      icon: <Layers className="w-5 h-5 text-cyan-600" aria-hidden="true" />,
    },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      {/* 1. Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center flex flex-col items-center">
        <Badge variant="primary" className="mb-6 gap-2 py-1.5 px-3.5 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-brand-600" aria-hidden="true" />
          The Unified Higher Education Ecosystem
        </Badge>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-5xl leading-[1.1]">
          CampusVerse
        </h1>

        <p className="mt-6 text-lg sm:text-2xl text-slate-600 max-w-3xl font-medium leading-relaxed">
          One platform for students, aspirants, alumni, mentorship, careers and campus communities.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/auth/register">
            <Button size="lg" className="shadow-md text-base px-6 py-3 gap-2">
              Get Started <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/features">
            <Button variant="outline" size="lg" className="text-base px-6 py-3">
              Explore CampusVerse
            </Button>
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-600" aria-hidden="true" /> Real-time mobile & web synchronization
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-600" aria-hidden="true" /> Role-based access control
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-600" aria-hidden="true" /> Verified institutional identities
          </span>
        </div>
      </section>

      {/* 2. Four Audience Segments */}
      <section className="w-full bg-slate-50/75 border-y border-slate-200 py-20" aria-labelledby="audiences-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 id="audiences-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tailored for Every Higher Education Stakeholder
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-500">
              CampusVerse provides distinct, role-specialized workflows while maintaining complete institutional continuity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {audienceSegments.map((aud) => (
              <Card key={aud.title} className="flex flex-col justify-between hover:shadow-md transition-shadow border-slate-200">
                <CardHeader>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                    {aud.icon}
                  </div>
                  <CardTitle className="text-xl font-bold">{aud.title}</CardTitle>
                  <p className="text-xs font-semibold text-brand-600">{aud.role}</p>
                </CardHeader>
                <CardContent className="space-y-4 text-xs text-slate-600 leading-relaxed flex-1 flex flex-col justify-between">
                  <p>{aud.desc}</p>
                  <ul className="space-y-2 pt-2 border-t border-slate-100">
                    {aud.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" aria-hidden="true" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    <Link
                      href={aud.href}
                      className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700 focus:outline-none focus:underline"
                    >
                      Explore {aud.title} portal <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 11 Feature Pillars */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" aria-labelledby="features-heading">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-3">
            Platform Capabilities
          </Badge>
          <h2 id="features-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Higher Education Modules
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Every feature connects directly to the core CampusVerse data model, ensuring instant parity across devices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featurePillars.map((fp) => (
            <div
              key={fp.name}
              className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-brand-200 transition-colors shadow-xs hover:shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                {fp.icon}
              </div>
              <h3 className="font-bold text-base text-slate-900">{fp.name}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{fp.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/features">
            <Button variant="outline" size="md">
              View Detailed Specifications <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 4. Architecture & Institutional Trust */}
      <section className="w-full bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="primary" className="bg-brand-500/20 text-brand-300 border-brand-500/30 mb-4">
                Architecture & Security
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Engineered for Integrity, Scalability, and Privacy
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                CampusVerse maintains a strict single-database, single-backend paradigm. Whether a user accesses the platform through our native Android application or this responsive web client, actions are synchronized immediately.
              </p>

              <div className="mt-8 space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-white/10 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm">Role-Based Access Enforcement</strong>
                    <span>Express JWT middleware verifies user identity, role permissions, and administrative clearance on every request.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-white/10 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm">Verified Document Credentialing</strong>
                    <span>Student enrollment and alumni graduation claims are verified by campus administrators before badges are awarded.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-white/10 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm">Granular Privacy Preferences</strong>
                    <span>Users control who can message them, view their contact details, or request 1-on-1 mentorship.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-6">
              <h3 className="text-xl font-bold tracking-tight text-white">Platform Topology</h3>
              <div className="p-4 rounded-xl bg-slate-950/60 font-mono text-xs text-slate-300 leading-loose border border-white/10">
                <p className="text-brand-400 font-bold">{'// CampusVerse Architecture'}</p>
                <p>Express REST API: <span className="text-emerald-400">http://localhost:4000/api/v1</span></p>
                <p>Web Client: <span className="text-sky-400">Next.js 14 App Router</span></p>
                <p>Mobile Client: <span className="text-sky-400">Android Jetpack Compose</span></p>
                <p>Database: <span className="text-amber-400">Prisma ORM (Unified Models)</span></p>
                <p>AI Engine: <span className="text-purple-400">Google Gemini Flash</span></p>
              </div>
              <p className="text-xs text-slate-400">
                Zero parallel databases. Zero business logic duplication. Built for seamless cross-device collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA Banner */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to connect your academic journey?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-brand-100">
              Create an account as a student, prospective applicant, or graduate to access customized tools.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-slate-100 shadow-sm font-semibold">
                Get Started Now
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
