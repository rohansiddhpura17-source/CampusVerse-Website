'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alumniApi } from '@/lib/api/alumni';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Briefcase,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  MapPin,
  DollarSign,
} from 'lucide-react';

export default function AlumniCareerPreferencesSettingsPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const {
    data: preferences,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['alumniCareerPreferences'],
    queryFn: () => alumniApi.getCareerPreferences(),
  });

  const [preferredRolesStr, setPreferredRolesStr] = useState('');
  const [preferredLocationsStr, setPreferredLocationsStr] = useState('');
  const [remotePreference, setRemotePreference] = useState('HYBRID');
  const [targetSalary, setTargetSalary] = useState('');
  const [openToOpportunities, setOpenToOpportunities] = useState(true);

  useEffect(() => {
    if (preferences) {
      const roles = Array.isArray(preferences.preferredRoles)
        ? preferences.preferredRoles
        : typeof preferences.preferredRoles === 'string'
        ? JSON.parse(preferences.preferredRoles || '[]')
        : [];
      const locs = Array.isArray(preferences.preferredLocations)
        ? preferences.preferredLocations
        : typeof preferences.preferredLocations === 'string'
        ? JSON.parse(preferences.preferredLocations || '[]')
        : [];

      setPreferredRolesStr(roles.join(', '));
      setPreferredLocationsStr(locs.join(', '));
      setRemotePreference(preferences.remotePreference || 'HYBRID');
      setTargetSalary(preferences.targetSalary || '');
      setOpenToOpportunities(preferences.openToOpportunities ?? true);
    }
  }, [preferences]);

  const updateMutation = useMutation({
    mutationFn: () => {
      const roles = preferredRolesStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const locs = preferredLocationsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      return alumniApi.updateCareerPreferences({
        preferredRoles: roles,
        preferredLocations: locs,
        remotePreference,
        targetSalary: targetSalary.trim() || undefined,
        openToOpportunities,
      });
    },
    onSuccess: () => {
      toastSuccess('Career preferences saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['alumniCareerPreferences'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to save career preferences'),
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Career & Search Preferences</h1>
        <p className="text-xs text-slate-500 mt-1">
          Tune your job recommendations, target executive roles, and recruitment visibility.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <Input
              label="Target Roles & Titles (comma separated)"
              placeholder="e.g. Staff Engineer, Engineering Manager, Lead Architect"
              value={preferredRolesStr}
              onChange={(e) => setPreferredRolesStr(e.target.value)}
              helperText="Roles you are actively considering or want highlighted in career searches"
            />

            <Input
              label="Preferred Locations (comma separated)"
              placeholder="e.g. Bangalore, Hyderabad, Remote, London"
              value={preferredLocationsStr}
              onChange={(e) => setPreferredLocationsStr(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Remote Work Model Preference
                </label>
                <select
                  value={remotePreference}
                  onChange={(e) => setRemotePreference(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-purple-500 focus:outline-none"
                >
                  <option value="REMOTE_ONLY">Fully Remote Only</option>
                  <option value="HYBRID">Hybrid (Flexible Office / Remote)</option>
                  <option value="ON_SITE">On-site Preferred</option>
                  <option value="ANY">Open to Any Work Mode</option>
                </select>
              </div>

              <Input
                label="Target Compensation Expectation"
                placeholder="e.g. ₹45 - 60 LPA / $180k+"
                value={targetSalary}
                onChange={(e) => setTargetSalary(e.target.value)}
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div>
                <p className="text-xs font-bold text-slate-900">Open to New Career Opportunities</p>
                <p className="text-[11px] text-slate-500">
                  Allow campus verified partner recruiters to contact you about confidential roles.
                </p>
              </div>
              <input
                type="checkbox"
                checked={openToOpportunities}
                onChange={(e) => setOpenToOpportunities(e.target.checked)}
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
                <Save className="w-3.5 h-3.5" /> Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
