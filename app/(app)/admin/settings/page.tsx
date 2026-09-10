'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { PlatformSettings } from '@/types/admin';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Settings,
  ShieldCheck,
  Lock,
  UserPlus,
  Zap,
  Server,
  Save,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const {
    data: settings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['adminPlatformSettings'],
    queryFn: () => adminApi.getSettings(),
  });

  const [formState, setFormState] = useState<Partial<PlatformSettings>>({
    maintenanceMode: false,
    allowNewRegistrations: true,
    autoModeration: true,
    strictVerification: true,
    require2FAForAdmins: true,
  });

  useEffect(() => {
    if (settings) {
      setFormState({
        maintenanceMode: settings.maintenanceMode,
        allowNewRegistrations: settings.allowNewRegistrations,
        autoModeration: settings.autoModeration,
        strictVerification: settings.strictVerification,
        require2FAForAdmins: settings.require2FAForAdmins,
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<PlatformSettings>) => adminApi.updateSettings(updates),
    onSuccess: (updated) => {
      toastSuccess('Platform operational settings updated and committed to audit log.');
      queryClient.invalidateQueries({ queryKey: ['adminPlatformSettings'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardMetrics'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to update platform settings.');
    },
  });

  const handleToggle = (key: keyof PlatformSettings) => {
    setFormState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formState);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Operational Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure global access controls, autonomous moderation flags, and administrative security enforcement.
          </p>
        </div>

        <Badge variant="outline" className="text-slate-600 border-slate-300 text-[10px] self-start sm:self-auto font-mono">
          Engine: {settings?.systemVersion || 'v2.4.0-phase8'}
        </Badge>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Access & Registration Controls */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-600" /> Platform Access & User Registration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5 text-xs">
            {/* Maintenance Mode */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 block text-xs">Emergency Maintenance Mode</span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  When enabled, all student, aspirant, and alumni endpoints return temporary maintenance notices. Only admins can access the system.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('maintenanceMode')}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                  formState.maintenanceMode ? 'bg-rose-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    formState.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 block text-xs">Allow New Account Registrations</span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Permits new students, aspirants, and alumni to register credentials via the public portal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('allowNewRegistrations')}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                  formState.allowNewRegistrations ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    formState.allowNewRegistrations ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Moderation & Safety Settings */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Automated Moderation & Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5 text-xs">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 block text-xs">Automatic Keyword Moderation</span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Automatically holds marketplace listings and community discussion posts containing prohibited terms in the review queue.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('autoModeration')}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                  formState.autoModeration ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    formState.autoModeration ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 block text-xs">Strict Credential Verification</span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Requires manual administrative identity sign-off before granting verified badge and alumni mentorship access.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('strictVerification')}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                  formState.strictVerification ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    formState.strictVerification ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Security & Multi-Factor Authentication */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" /> Administrative Security Enforcement
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5 text-xs">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 block text-xs">Enforce 2FA for Administrative Roles</span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Mandates two-factor authentication verification on every admin console login attempt.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('require2FAForAdmins')}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                  formState.require2FAForAdmins ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    formState.require2FAForAdmins ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-slate-500">
              <span className="text-[11px] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Last Administrative Snapshot: {settings?.lastBackup ? new Date(settings.lastBackup).toLocaleString() : 'Recent'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Save Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            isLoading={updateMutation.isPending}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5 px-5"
          >
            <Save className="w-3.5 h-3.5" /> Commit Platform Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
