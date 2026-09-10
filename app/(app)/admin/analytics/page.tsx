'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  Users,
  ShieldCheck,
  Briefcase,
  ShoppingBag,
  Calendar,
  AlertTriangle,
  Server,
  Activity,
  BarChart3,
  PieChart,
  Info,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['adminAnalyticsTelemetry'],
    queryFn: () => adminApi.getDashboard(),
  });

  const metrics = dashboard?.metrics;

  const totalUsers = metrics?.users?.total || 0;
  const students = metrics?.users?.students || 0;
  const alumni = metrics?.users?.alumni || 0;
  const aspirants = metrics?.users?.aspirants || 0;

  const studentPct = totalUsers > 0 ? Math.round((students / totalUsers) * 100) : 0;
  const alumniPct = totalUsers > 0 ? Math.round((alumni / totalUsers) * 100) : 0;
  const aspirantPct = totalUsers > 0 ? Math.round((aspirants / totalUsers) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Authoritative Platform Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational telemetry derived strictly from live backend database counts and entity records.
          </p>
        </div>

        <Badge variant="outline" className="bg-slate-900 text-white border-slate-800 text-[10px] self-start sm:self-auto">
          Authoritative Telemetry Only
        </Badge>
      </div>

      {/* Real Platform Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Demographics Breakdown */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> User Role Distribution
            </CardTitle>
            <span className="text-xs font-mono font-bold text-slate-700">{totalUsers} Total Accounts</span>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {isLoading ? (
              <Skeleton className="h-36 w-full" />
            ) : totalUsers === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No users in database.</p>
            ) : (
              <>
                {/* Horizontal Progress bar */}
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div style={{ width: `${studentPct}%` }} className="bg-blue-600 h-full" title={`Students: ${studentPct}%`} />
                  <div style={{ width: `${alumniPct}%` }} className="bg-indigo-600 h-full" title={`Alumni: ${alumniPct}%`} />
                  <div style={{ width: `${aspirantPct}%` }} className="bg-amber-500 h-full" title={`Aspirants: ${aspirantPct}%`} />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <span className="text-blue-600 font-bold block text-sm">{students}</span>
                    <span className="text-slate-600 text-[11px]">Students ({studentPct}%)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                    <span className="text-indigo-600 font-bold block text-sm">{alumni}</span>
                    <span className="text-slate-600 text-[11px]">Alumni ({alumniPct}%)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <span className="text-amber-600 font-bold block text-sm">{aspirants}</span>
                    <span className="text-slate-600 text-[11px]">Aspirants ({aspirantPct}%)</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Career Opportunities Status */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" /> Career Vacancy Pipeline
            </CardTitle>
            <span className="text-xs font-mono font-bold text-slate-700">
              {(metrics?.jobs?.active || 0) + (metrics?.jobs?.pending || 0)} Total Jobs
            </span>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {isLoading ? (
              <Skeleton className="h-36 w-full" />
            ) : (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1">
                  <span className="text-emerald-800 font-semibold block text-[11px] uppercase tracking-wider">Active Published Jobs</span>
                  <p className="text-2xl font-black text-emerald-950">{metrics?.jobs?.active ?? 0}</p>
                  <p className="text-[10px] text-emerald-700">Live vacancies accessible by students</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 space-y-1">
                  <span className="text-amber-800 font-semibold block text-[11px] uppercase tracking-wider">Pending Moderation</span>
                  <p className="text-2xl font-black text-amber-950">{metrics?.jobs?.pending ?? 0}</p>
                  <p className="text-[10px] text-amber-700">Submitted by alumni & companies</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Safety & Moderation Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pending Verifications</span>
              <ShieldCheck className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {isLoading ? <Skeleton className="h-8 w-12" /> : metrics?.verifications?.pending ?? 'DATA NOT AVAILABLE'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Credentials awaiting admin approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pending Safety Flags</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {isLoading ? <Skeleton className="h-8 w-12" /> : metrics?.safety?.pendingReports ?? 'DATA NOT AVAILABLE'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Open reports requiring investigation</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Marketplace Listings</span>
              <ShoppingBag className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {isLoading ? <Skeleton className="h-8 w-12" /> : metrics?.marketplace?.activeListings ?? 'DATA NOT AVAILABLE'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Active items in student catalog</p>
          </CardContent>
        </Card>
      </div>

      {/* Strict Real Telemetry Policy Banner */}
      <Card className="border-slate-200 bg-slate-50/75">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            Backend Telemetry Specification Notice
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium block text-[11px]">Daily Active Users (DAU)</span>
              <span className="font-mono text-slate-400 text-[11px] font-semibold mt-1 block">DATA NOT AVAILABLE</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Time-series tracking not stored in SQLite</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium block text-[11px]">Clickstream Retention Cohorts</span>
              <span className="font-mono text-slate-400 text-[11px] font-semibold mt-1 block">DATA NOT AVAILABLE</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Requires external telemetry pipeline</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium block text-[11px]">Host Infrastructure CPU / Memory</span>
              <span className="font-mono text-slate-400 text-[11px] font-semibold mt-1 block">DATA NOT AVAILABLE</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">OS-level metrics not exposed over REST</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
