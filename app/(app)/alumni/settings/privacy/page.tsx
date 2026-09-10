'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Shield,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Lock,
} from 'lucide-react';

export default function AlumniPrivacySettingsPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const {
    data: privacy,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['alumniPrivacySettings'],
    queryFn: () => usersApi.getPrivacySettings(),
  });

  const [showEmail, setShowEmail] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [showGpa, setShowGpa] = useState(false);
  const [allowMentorshipRequests, setAllowMentorshipRequests] = useState(true);

  useEffect(() => {
    if (privacy) {
      setShowEmail(privacy.showEmail ?? true);
      setShowPhone(privacy.showPhone ?? false);
      setShowGpa(privacy.showGpa ?? false);
      setAllowMentorshipRequests(privacy.allowMentorshipRequests ?? true);
    }
  }, [privacy]);

  const updateMutation = useMutation({
    mutationFn: () =>
      usersApi.updatePrivacySettings({
        showEmail,
        showPhone,
        showGpa,
        allowMentorshipRequests,
      }),
    onSuccess: () => {
      toastSuccess('Privacy visibility rules saved!');
      queryClient.invalidateQueries({ queryKey: ['alumniPrivacySettings'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to update privacy settings'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Privacy & Network Visibility</h1>
        <p className="text-xs text-slate-500 mt-1">
          Control which contact vectors and profile attributes are displayed to campus members.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Show Email Address in Directory</p>
                <p className="text-[11px] text-slate-500">
                  Allow verified alumni connections and campus faculty to view your registered email address.
                </p>
              </div>
              <input
                type="checkbox"
                checked={showEmail}
                onChange={(e) => setShowEmail(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Show Phone Number on Profile</p>
                <p className="text-[11px] text-slate-500">
                  Display contact number to confirmed 1-on-1 connections only.
                </p>
              </div>
              <input
                type="checkbox"
                checked={showPhone}
                onChange={(e) => setShowPhone(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Show Academic CGPA / Grade History</p>
                <p className="text-[11px] text-slate-500">
                  Display university GPA on alumni profile for verified academic inquiries.
                </p>
              </div>
              <input
                type="checkbox"
                checked={showGpa}
                onChange={(e) => setShowGpa(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Allow Incoming Mentorship Inquiries</p>
                <p className="text-[11px] text-slate-500">
                  Permit students and aspirants to send 1-on-1 mentorship session requests.
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowMentorshipRequests}
                onChange={(e) => setAllowMentorshipRequests(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                size="sm"
                isLoading={updateMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5 px-5"
              >
                <Save className="w-3.5 h-3.5" /> Save Privacy Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
