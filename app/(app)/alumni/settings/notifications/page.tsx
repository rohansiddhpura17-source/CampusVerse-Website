'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bell,
  ArrowLeft,
  Save,
  CheckCircle2,
  Mail,
  Smartphone,
  Calendar,
  Briefcase,
} from 'lucide-react';

export default function AlumniNotificationSettingsPage() {
  const { success: toastSuccess } = useToast();

  const [mentorshipAlerts, setMentorshipAlerts] = useState(true);
  const [referralRequests, setReferralRequests] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toastSuccess('Notification dispatch preferences updated!');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back Link */}
      <Link
        href="/alumni/settings"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Settings
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notification Preferences</h1>
        <p className="text-xs text-slate-500 mt-1">
          Control how and when you receive updates regarding mentorship, referrals, and campus events.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Mentorship Inquiries & Session Updates</p>
                <p className="text-[11px] text-slate-500">
                  Notify when a student requests 1-on-1 mentorship or when a scheduled session is updated.
                </p>
              </div>
              <input
                type="checkbox"
                checked={mentorshipAlerts}
                onChange={(e) => setMentorshipAlerts(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Job Referral Inquiries</p>
                <p className="text-[11px] text-slate-500">
                  Receive real-time alerts when qualified students request referral endorsements for your employer.
                </p>
              </div>
              <input
                type="checkbox"
                checked={referralRequests}
                onChange={(e) => setReferralRequests(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Relevant Career Matches</p>
                <p className="text-[11px] text-slate-500">
                  Alert when new executive or senior roles matching your preferences are cataloged.
                </p>
              </div>
              <input
                type="checkbox"
                checked={jobAlerts}
                onChange={(e) => setJobAlerts(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Campus Reunions & Event Reminders</p>
                <p className="text-[11px] text-slate-500">
                  Reminders 24 hours prior to scheduled alumni webinars, technical panels, and homecomings.
                </p>
              </div>
              <input
                type="checkbox"
                checked={eventReminders}
                onChange={(e) => setEventReminders(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Weekly Network Digest via Email</p>
                <p className="text-[11px] text-slate-500">
                  Receive a consolidated weekly recap of mutual connections and alumni news.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={(e) => setEmailDigest(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5 px-5">
                <Save className="w-3.5 h-3.5" /> Save Notification Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
