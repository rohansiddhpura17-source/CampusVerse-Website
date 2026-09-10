'use client';

import React, { useState, useEffect } from 'react';
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
  Bell,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Mail,
} from 'lucide-react';

export default function StudentSettingsPage() {
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
    refetch: refetchPrivacy,
  } = useQuery({
    queryKey: ['privacySettings'],
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
    refetch: refetchSecurity,
  } = useQuery({
    queryKey: ['securitySettings'],
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
      toastSuccess('Privacy preferences updated and saved!');
      queryClient.invalidateQueries({ queryKey: ['privacySettings'] });
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
      toastSuccess('Security preferences saved to database!');
      queryClient.invalidateQueries({ queryKey: ['securitySettings'] });
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
      toastSuccess('Account recovery request submitted.');
      setRecoveryEmail('');
      setRecoveryReason('');
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to submit recovery details');
    },
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account & Privacy Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your peer visibility preferences, login alerts, and account security parameters.
        </p>
      </div>

      {/* Privacy Preferences */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-600" /> Peer Visibility & Privacy
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Control what information other students can see on your public profile</p>
          </div>
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
                  <p className="font-semibold text-xs text-slate-900">Show University Email</p>
                  <p className="text-[11px] text-slate-500">Allow peer students to view your email on note uploads and profile</p>
                </div>
                <input
                  type="checkbox"
                  checked={showEmail}
                  onChange={(e) => setShowEmail(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="font-semibold text-xs text-slate-900">Show Contact Phone</p>
                  <p className="text-[11px] text-slate-500">Display phone number to buyers in the campus marketplace</p>
                </div>
                <input
                  type="checkbox"
                  checked={showPhone}
                  onChange={(e) => setShowPhone(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="font-semibold text-xs text-slate-900">Show Cumulative GPA</p>
                  <p className="text-[11px] text-slate-500">Display your verified academic GPA to study group peers</p>
                </div>
                <input
                  type="checkbox"
                  checked={showGpa}
                  onChange={(e) => setShowGpa(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="font-semibold text-xs text-slate-900">Allow Mentorship Connections</p>
                  <p className="text-[11px] text-slate-500">Permit verified alumni mentors to view your profile and connect</p>
                </div>
                <input
                  type="checkbox"
                  checked={allowMentorshipRequests}
                  onChange={(e) => setAllowMentorshipRequests(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
              </label>

              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  onClick={() => updatePrivacyMutation.mutate()}
                  isLoading={updatePrivacyMutation.isPending}
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
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-600" /> Security & Login Alerts
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Manage session protections and multi-factor alerts</p>
          </div>
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
                  <p className="font-semibold text-xs text-slate-900">Login Activity Alerts</p>
                  <p className="text-[11px] text-slate-500">Receive an email notice when a new device authenticates into your account</p>
                </div>
                <input
                  type="checkbox"
                  checked={loginAlertsEnabled}
                  onChange={(e) => setLoginAlertsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="font-semibold text-xs text-slate-900">Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-slate-500">Require email OTP confirmation on new browser sessions</p>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
              </label>

              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  onClick={() => updateSecurityMutation.mutate()}
                  isLoading={updateSecurityMutation.isPending}
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
            <Lock className="w-5 h-5 text-brand-600" /> Emergency Account Recovery
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Register a secondary personal email address for password recovery in case campus email access is lost</p>
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
              label="Secondary Personal Email"
              type="email"
              placeholder="personal.email@gmail.com"
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
                placeholder="e.g. Backup address for account recovery in case of university portal downtime."
                className="block w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
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
