import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Bot,
  Compass,
  Award,
  Briefcase,
  Users,
  UserCheck,
  MessageSquare,
  Calendar,
  ShoppingBag,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Features & Platform Capabilities — CampusVerse',
  description:
    'Explore the 11 integrated modules of CampusVerse: Academics, AI Study Assistant, College Explorer, Scholarships, Mentorship, and Careers.',
  alternates: {
    canonical: 'https://campusverse.edu/features',
  },
  openGraph: {
    title: 'Features & Platform Capabilities — CampusVerse',
    description:
      'Explore the 11 integrated modules of CampusVerse: Academics, AI Study Assistant, College Explorer, Scholarships, Mentorship, and Careers.',
    url: 'https://campusverse.edu/features',
    siteName: 'CampusVerse',
    type: 'website',
  },
};

export default function FeaturesPage() {
  const modules = [
    {
      title: 'Academic Management',
      badge: 'Students',
      desc: 'Organize course schedules, syllabus details, semester credit loads, and track overall CGPA metrics.',
      icon: <BookOpen className="w-5 h-5 text-blue-600" aria-hidden="true" />,
      bullets: [
        'Enrolled semester course rosters and codes',
        'Cumulative Grade Point Average calculation',
        'Departmental course catalog browser',
      ],
    },
    {
      title: 'AI Study Assistant',
      badge: 'Students & Aspirants',
      desc: 'Multimodal Gemini AI academic tutor trained to break down complex theories, algorithms, and concept queries.',
      icon: <Bot className="w-5 h-5 text-indigo-600" aria-hidden="true" />,
      bullets: [
        'Context-aware study explanations and summaries',
        'Algorithmic and theoretical concept tutoring',
        'Suggested topic exploration prompts',
      ],
    },
    {
      title: 'College Discovery',
      badge: 'Aspirants',
      desc: 'Search, filter, and compare accredited higher education institutions across multiple criteria.',
      icon: <Compass className="w-5 h-5 text-emerald-600" aria-hidden="true" />,
      bullets: [
        'Filter by country, fees, ranking, and acceptance rate',
        'Side-by-side multi-program curriculum comparison',
        'Campus overview, size, and program specs',
      ],
    },
    {
      title: 'Scholarships & Grants',
      badge: 'Aspirants & Students',
      desc: 'Verified financial aid opportunities categorized by merit, need, background, and region.',
      icon: <Award className="w-5 h-5 text-teal-600" aria-hidden="true" />,
      bullets: [
        'Eligibility requirements and application deadlines',
        'Direct links to official grant providers',
        'Save and bookmark financial aid deadlines',
      ],
    },
    {
      title: 'Career Opportunities',
      badge: 'Alumni & Students',
      desc: 'Direct job and internship postings submitted by verified alumni and campus recruiters.',
      icon: <Briefcase className="w-5 h-5 text-purple-600" aria-hidden="true" />,
      bullets: [
        'Full-time, part-time, internship, and remote filters',
        'Resume submission and application status tracking',
        'Employee referral requests through alumni connections',
      ],
    },
    {
      title: 'Alumni Network',
      badge: 'Alumni & Students',
      desc: 'Searchable alumni directory enabling direct professional connections between graduates and undergraduates.',
      icon: <Users className="w-5 h-5 text-violet-600" aria-hidden="true" />,
      bullets: [
        'Search by company, designation, and graduation year',
        '1-on-1 connection requests with accept/reject controls',
        'Willingness to mentor and refer visibility indicators',
      ],
    },
    {
      title: 'Mentorship Lab',
      badge: 'Alumni & Students',
      desc: 'Structured 1-on-1 mentorship bookings with goal tracking, duration scheduling, and video meeting coordinates.',
      icon: <UserCheck className="w-5 h-5 text-fuchsia-600" aria-hidden="true" />,
      bullets: [
        'Mentor profile discovery by domain expertise',
        'Direct session booking with agenda description',
        'Session status management (Scheduled, Completed)',
      ],
    },
    {
      title: 'Direct Messaging',
      badge: 'All Roles',
      desc: 'Private, secure 1-on-1 text messaging channels between connected students, alumni mentors, and peers.',
      icon: <MessageSquare className="w-5 h-5 text-sky-600" aria-hidden="true" />,
      bullets: [
        'Dedicated conversation inbox with unread tracking',
        'Sender and recipient role identification badges',
        'Privacy controls restricting messages to connections only',
      ],
    },
    {
      title: 'Events & Hackathons',
      badge: 'All Roles',
      desc: 'Campus-wide technology hackathons, academic webinars, workshops, and career fairs.',
      icon: <Calendar className="w-5 h-5 text-rose-600" aria-hidden="true" />,
      bullets: [
        'Online meeting coordinates or physical room locations',
        'Capacity limits and live attendee counter',
        'One-click event registration and deregistration',
      ],
    },
    {
      title: 'Campus Marketplace',
      badge: 'Students',
      desc: 'Peer-to-peer commerce for buying and selling textbooks, scientific calculators, and hardware kits.',
      icon: <ShoppingBag className="w-5 h-5 text-orange-600" aria-hidden="true" />,
      bullets: [
        'Condition ratings (New, Like New, Good, Fair)',
        'Direct seller contact coordination',
        'Administrative moderation for fraudulent listings',
      ],
    },
    {
      title: 'Communities & Forums',
      badge: 'Students & Alumni',
      desc: 'Subject-specific student clubs, academic interest groups, discussion threads, and comments.',
      icon: <Layers className="w-5 h-5 text-cyan-600" aria-hidden="true" />,
      bullets: [
        'Join and participate in campus student communities',
        'Create rich discussion posts with likes and comments',
        'Author attribution with verified role badges',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="primary" className="mb-3">
          11 Core Modules
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          CampusVerse Capabilities
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Integrated modules engineered for student success, admission clarity, career acceleration, and institutional governance.
        </p>
      </div>

      {/* Grid of 11 Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m) => (
          <Card key={m.title} className="flex flex-col justify-between border-slate-200 hover:border-brand-300 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  {m.icon}
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {m.badge}
                </Badge>
              </div>
              <CardTitle className="text-lg">{m.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-slate-600 leading-relaxed flex-1 flex flex-col justify-between">
              <p>{m.desc}</p>
              <ul className="space-y-1.5 pt-3 border-t border-slate-100">
                {m.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-brand-600 font-bold mr-0.5">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center">
        <h2 className="text-2xl font-bold text-slate-900">Experience the Full Platform</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-md">
          Create an account to explore the features tailored specifically for your campus role.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/auth/register">
            <Button size="md" className="gap-2">
              Create Your Account <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="md">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
