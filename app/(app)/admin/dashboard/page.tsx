'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Briefcase,
  ShoppingBag,
  Calendar,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Server,
  RefreshCw,
  Clock,
  Terminal,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const {
    data: dashboard,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['adminDashboardMetrics'],
    queryFn: () => adminApi.getDashboard(),
    refetchInterval: 15000,
  });

  const metrics = dashboard?.metrics;
  const auditLogs = dashboard?.recentAuditLogs || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Executive Operations Header */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px]">
              Authoritative Admin Console
            </Badge>
            <span className="text-xs text-slate-400 font-mono">
              Session: {user?.email}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Operations & Telemetry</h1>
          <p className="text-xs text-slate-400">
            Real-time infrastructure health, security audits, verification queues, and content moderation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">System Status</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {metrics?.system?.status || 'OPERATIONAL'}
            </span>
          </div>

          <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">DB Uptime</span>
            <span className="font-bold text-slate-100 mt-0.5 block">
              {metrics?.system?.databaseUptime || '99.98%'}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Users</span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {isLoading ? <Skeleton className="h-8 w-16" /> : metrics?.users?.total ?? 'DATA NOT AVAILABLE'}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 mt-2">
              <span>{metrics?.users?.students ?? 0} Students</span> &bull;
              <span>{metrics?.users?.alumni ?? 0} Alumni</span> &bull;
              <span>{metrics?.users?.aspirants ?? 0} Aspirants</span>
            </div>
            <Link href="/admin/users" className="text-xs text-blue-600 font-semibold hover:underline mt-2 inline-flex items-center gap-0.5">
              Manage Users &rarr;
            </Link>
          </CardContent>
        </Card>

        {/* Verifications Queue */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Verifications</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {isLoading ? <Skeleton className="h-8 w-16" /> : metrics?.verifications?.pending ?? 'DATA NOT AVAILABLE'}
            </p>
            <p className="text-[11px] text-slate-500 mt-2">
              Awaiting institutional credential review
            </p>
            <Link href="/admin/verification" className="text-xs text-amber-600 font-semibold hover:underline mt-2 inline-flex items-center gap-0.5">
              Review Queue &rarr;
            </Link>
          </CardContent>
        </Card>

        {/* Safety Reports */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Reports</span>
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {isLoading ? <Skeleton className="h-8 w-16" /> : metrics?.safety?.pendingReports ?? 'DATA NOT AVAILABLE'}
            </p>
            <p className="text-[11px] text-slate-500 mt-2">
              Platform flags & safety incidents
            </p>
            <Link href="/admin/reports" className="text-xs text-rose-600 font-semibold hover:underline mt-2 inline-flex items-center gap-0.5">
              Investigate Reports &rarr;
            </Link>
          </CardContent>
        </Card>

        {/* Job Postings */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Career Postings</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {isLoading ? <Skeleton className="h-8 w-16" /> : metrics?.jobs?.active ?? 'DATA NOT AVAILABLE'}
            </p>
            <p className="text-[11px] text-slate-500 mt-2">
              {metrics?.jobs?.pending ?? 0} Pending moderations
            </p>
            <Link href="/admin/jobs" className="text-xs text-emerald-600 font-semibold hover:underline mt-2 inline-flex items-center gap-0.5">
              Moderate Jobs &rarr;
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics & Quick Operational Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Marketplace Items</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {isLoading ? <Skeleton className="h-6 w-12" /> : metrics?.marketplace?.activeListings ?? 'DATA NOT AVAILABLE'}
              </p>
            </div>
            <Link href="/admin/marketplace">
              <Button size="sm" variant="outline" className="text-xs">
                Inspect Listings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Campus Events</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {isLoading ? <Skeleton className="h-6 w-12" /> : metrics?.events?.total ?? 'DATA NOT AVAILABLE'}
              </p>
            </div>
            <Link href="/admin/events">
              <Button size="sm" variant="outline" className="text-xs">
                Manage Events
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active User Sessions</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {isLoading ? <Skeleton className="h-6 w-12" /> : metrics?.system?.activeSessions ?? 'DATA NOT AVAILABLE'}
              </p>
            </div>
            <Link href="/admin/analytics">
              <Button size="sm" variant="outline" className="text-xs">
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Live Audit Log Section */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-600" />
            <CardTitle className="text-sm font-bold text-slate-900">
              Live Administrative Audit Trail
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono">
            {auditLogs.length} Recent Mutations
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No recent audit logs on record.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-2 px-4">Timestamp</th>
                    <th className="py-2 px-4">Administrator</th>
                    <th className="py-2 px-4">Action</th>
                    <th className="py-2 px-4">Target Resource</th>
                    <th className="py-2 px-4">Target ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => {
                    const actorName = log.actor?.profile?.fullName || log.actor?.email || log.actorEmail || 'Admin';
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/70 font-mono text-[11px]">
                        <td className="py-2 px-4 text-slate-500 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-2 px-4 text-slate-900 font-semibold whitespace-nowrap">
                          {actorName}
                        </td>
                        <td className="py-2 px-4">
                          <Badge variant="outline" className="text-[10px] font-mono border-slate-300">
                            {log.action}
                          </Badge>
                        </td>
                        <td className="py-2 px-4 text-slate-600 whitespace-nowrap">
                          {log.targetType}
                        </td>
                        <td className="py-2 px-4 text-slate-500 font-mono text-[10px] truncate max-w-[200px]">
                          {log.targetId}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
