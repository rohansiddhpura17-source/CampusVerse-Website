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
  KeyRound,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  Lock,
} from 'lucide-react';

export default function AlumniSecuritySettingsPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const {
    data: security,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['alumniSecuritySettings'],
    queryFn: () => usersApi.getSecuritySettings(),
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);

  useEffect(() => {
    if (security) {
      setTwoFactorEnabled(security.twoFactorEnabled ?? false);
      setLoginAlertsEnabled(security.loginAlertsEnabled ?? true);
    }
  }, [security]);

  const updateMutation = useMutation({
    mutationFn: () =>
      usersApi.updateSecuritySettings({
        twoFactorEnabled,
        loginAlertsEnabled,
      }),
    onSuccess: () => {
      toastSuccess('Security parameters updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['alumniSecuritySettings'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to update security settings'),
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Security & Multi-Factor Auth</h1>
        <p className="text-xs text-slate-500 mt-1">
          Safeguard your alumni credentials, session authenticity, and account integrity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
                <p className="text-[11px] text-slate-500">
                  Require a one-time passcode confirmation sent to your registered email when logging in from new devices.
                </p>
              </div>
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Suspicious Login & New Session Alerts</p>
                <p className="text-[11px] text-slate-500">
                  Receive an immediate notification whenever your account logs in from an unrecognized IP address.
                </p>
              </div>
              <input
                type="checkbox"
                checked={loginAlertsEnabled}
                onChange={(e) => setLoginAlertsEnabled(e.target.checked)}
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
                <Save className="w-3.5 h-3.5" /> Save Security Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
