'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Shield,
  Eye,
  Lock,
  Save,
  Mail,
  AlertCircle,
} from 'lucide-react';

export default function AspirantSettingsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  // Privacy State
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showGpa, setShowGpa] = useState(false);
  const [allowMentorshipRequests, setAllowMentorshipRequests] = useState(true);

  // Security State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);

  // Recovery State
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryReason, setRecoveryReason] = useState('');

  const {
    data: privacy,
    isLoading: isPrivacyLoading,
  } = useQuery({
    queryKey: ['privacySettingsAspirant'],
    queryFn: async () => {
      const data = await usersApi.getPrivacySettings();
      setShowEmail(data.showEmail ?? false);
      setShowPhone(data.showPhone ?? false);
      setShowGpa(data.showGpa ?? false);
      setAllowMentorshipRequests(data.allowMentorshipRequests ?? true);
      return data;
    },
  });

  const {
    data: security,
    isLoading: isSecurityLoading,
  } = useQuery({
    queryKey: ['securitySettingsAspirant'],
    queryFn: async () => {
      const data = await usersApi.getSecuritySettings();
      setTwoFactorEnabled(data.twoFactorEnabled ?? false);
      setLoginAlertsEnabled(data.loginAlertsEnabled ?? true);
      return data;
    },
  });

  const updatePrivacyMutation = useMutation({
    mutationFn: async () => {
      return usersApi.updatePrivacySettings({
        showEmail,
        showPhone,
        showGpa,
        allowMentorshipRequests,
      });
    },
    onSuccess: () => {
      toastSuccess('Privacy preferences saved!');
      queryClient.invalidateQueries({ queryKey: ['privacySettingsAspirant'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to update privacy settings');
    },
  });

  const updateSecurityMutation = useMutation({
    mutationFn: async () => {
      return usersApi.updateSecuritySettings({
        twoFactorEnabled,
        loginAlertsEnabled,
      });
    },
    onSuccess: () => {
      toastSuccess('Security settings updated!');
      queryClient.invalidateQueries({ queryKey: ['securitySettingsAspirant'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to update security settings');
    },
  });

  const recoveryMutation = useMutation({
    mutationFn: async () => {
      return usersApi.submitAccountRecovery({
        recoveryEmail: recoveryEmail.trim(),
        reason: recoveryReason.trim(),
      });
    },
    onSuccess: () => {
      toastSuccess('Backup recovery email registered.');
      setRecoveryEmail('');
      setRecoveryReason('');
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to submit recovery email');
    },
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account & Privacy Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure prospective candidate visibility, admission counselor connections, and login security.
        </p>
      </div>

      {/* Privacy Preferences */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-600" /> Candidate Visibility & Privacy
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Control what contact details and GPA metrics admissions teams can see</p>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          {isPrivacyLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="font-semibold text-xs text-slate-900">Show Contact Email</p>
                  <p className="text-[11px] text-slate-500">Allow verified university admissions representatives to reach out via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={showEmail}
                  onChange={(e) => setShowEmail(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="font-semibold text-xs text-slate-900">Show Contact Phone</p>
                  <p className="text-[11px] text-slate-500">Permit SMS alerts regarding application status and counseling rounds</p>
                </div>
                <input
                  type="checkbox"
                  checked={showPhone}
                  onChange={(e) => setShowPhone(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="font-semibold text-xs text-slate-900">Show High School GPA</p>
                  <p className="text-[11px] text-slate-500">Display high school academic score to matched alumni mentors</p>
                </div>
                <input
                  type="checkbox"
                  checked={showGpa}
                  onChange={(e) => setShowGpa(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="font-semibold text-xs text-slate-900">Allow Mentorship & Counseling Outreach</p>
                  <p className="text-[11px] text-slate-500">Receive college guidance and scholarship application advice from verified alumni</p>
                </div>
                <input
                  type="checkbox"
                  checked={allowMentorshipRequests}
                  onChange={(e) => setAllowMentorshipRequests(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  onClick={() => updatePrivacyMutation.mutate()}
                  isLoading={updatePrivacyMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Save className="w-3.5 h-3.5 mr-1" /> Save Privacy Settings
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security & Authentication */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" /> Security & Device Protections
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Manage session alerts and multi-factor authentication</p>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          {isSecurityLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="font-semibold text-xs text-slate-900">New Login Email Alerts</p>
                  <p className="text-[11px] text-slate-500">Receive an instant email warning when an unrecognized device signs in</p>
                </div>
                <input
                  type="checkbox"
                  checked={loginAlertsEnabled}
                  onChange={(e) => setLoginAlertsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="font-semibold text-xs text-slate-900">Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-slate-500">Require an email OTP challenge code on new browser sessions</p>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  onClick={() => updateSecurityMutation.mutate()}
                  isLoading={updateSecurityMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Save className="w-3.5 h-3.5 mr-1" /> Update Security
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Recovery Backup */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" /> Secondary Recovery Contact
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Register a backup personal or parent email address in case primary login access is lost</p>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!recoveryEmail.trim()) return;
              recoveryMutation.mutate();
            }}
            className="space-y-3"
          >
            <Input
              label="Secondary Recovery Email"
              type="email"
              placeholder="parent.guardian@example.com"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Recovery Reason / Notes
              </label>
              <textarea
                rows={2}
                value={recoveryReason}
                onChange={(e) => setRecoveryReason(e.target.value)}
                placeholder="e.g. Backup email for college application updates and password resets."
                className="block w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="sm" isLoading={recoveryMutation.isPending}>
                Register Recovery Email
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
