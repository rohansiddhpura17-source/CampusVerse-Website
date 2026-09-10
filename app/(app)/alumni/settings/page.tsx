'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Settings,
  Briefcase,
  Bell,
  Shield,
  KeyRound,
  LifeBuoy,
  ArrowRight,
} from 'lucide-react';

export default function AlumniSettingsIndexPage() {
  const sections = [
    {
      title: 'Career Preferences',
      href: '/alumni/settings/career-preferences',
      icon: <Briefcase className="w-5 h-5 text-purple-600" />,
      description: 'Manage target roles, preferred locations, remote work preferences, and opportunity visibility.',
    },
    {
      title: 'Privacy & Visibility',
      href: '/alumni/settings/privacy',
      icon: <Shield className="w-5 h-5 text-indigo-600" />,
      description: 'Control who can view your email, contact number, GPA, and mentorship inquiry availability.',
    },
    {
      title: 'Security & 2-Factor Auth',
      href: '/alumni/settings/security',
      icon: <KeyRound className="w-5 h-5 text-emerald-600" />,
      description: 'Manage two-factor authentication toggles, session security, and suspicious login alert notices.',
    },
    {
      title: 'Notification Preferences',
      href: '/alumni/settings/notifications',
      icon: <Bell className="w-5 h-5 text-amber-600" />,
      description: 'Configure notifications for candidate referral requests, event invites, and mentorship sessions.',
    },
    {
      title: 'Emergency Account Recovery',
      href: '/alumni/settings/account-recovery',
      icon: <LifeBuoy className="w-5 h-5 text-rose-600" />,
      description: 'Register an emergency secondary recovery email address and identity backup verification.',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account & Platform Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure your career parameters, privacy visibility, notification dispatch, and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((sec) => (
          <Link key={sec.href} href={sec.href} className="block group">
            <Card className="h-full hover:border-purple-300 hover:shadow-xs transition-all">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-purple-50 transition-colors shrink-0">
                  {sec.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-purple-600 transition-colors">
                      {sec.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {sec.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
