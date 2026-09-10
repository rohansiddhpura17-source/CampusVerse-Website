'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { SafetyReport } from '@/types/admin';
import { useToast } from '@/components/ui/toast';
import { AdminDataTable, Column } from '@/components/admin/data-table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  ShoppingBag,
  MessageSquare,
  Scale,
} from 'lucide-react';

export default function AdminReportsPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [targetTypeFilter, setTargetTypeFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  // Resolution modal
  const [activeReport, setActiveReport] = useState<SafetyReport | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<'RESOLVED' | 'DISMISSED' | 'INVESTIGATING'>('RESOLVED');
  const [actionTaken, setActionTaken] = useState<'WARN' | 'REMOVE' | 'SUSPEND' | 'DISMISS' | 'RESOLVE' | 'NONE'>('WARN');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const {
    data: reportsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['adminReportsList', statusFilter, targetTypeFilter, page],
    queryFn: () =>
      adminApi.getReports({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        targetType: targetTypeFilter !== 'ALL' ? targetTypeFilter : undefined,
        page,
        limit: 20,
      }),
  });

  const reports: SafetyReport[] = Array.isArray(reportsData)
    ? reportsData
    : (reportsData as any)?.data || [];

  const resolveMutation = useMutation({
    mutationFn: (data: {
      id: string;
      status: 'RESOLVED' | 'DISMISSED' | 'INVESTIGATING';
      actionTaken: 'WARN' | 'REMOVE' | 'SUSPEND' | 'DISMISS' | 'RESOLVE' | 'NONE';
      resolutionNotes?: string;
    }) =>
      adminApi.resolveReport(data.id, {
        status: data.status,
        actionTaken: data.actionTaken,
        resolutionNotes: data.resolutionNotes,
      }),
    onSuccess: (data) => {
      toastSuccess('Safety report resolved and consequential actions recorded.');
      setActiveReport(null);
      setResolutionNotes('');
      queryClient.invalidateQueries({ queryKey: ['adminReportsList'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardMetrics'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to submit report resolution.');
    },
  });

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReport) return;
    resolveMutation.mutate({
      id: activeReport.id,
      status: resolutionStatus,
      actionTaken,
      resolutionNotes: resolutionNotes.trim() || undefined,
    });
  };

  const columns: Column<SafetyReport>[] = [
    {
      key: 'reporter',
      header: 'Filed By',
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 block line-clamp-1">
            {r.reporter?.profile?.fullName || r.reporter?.email || 'Anonymous Reporter'}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">{r.reporter?.email}</span>
        </div>
      ),
    },
    {
      key: 'target',
      header: 'Target Type & ID',
      render: (r) => (
        <div className="space-y-0.5">
          <Badge variant="outline" className="text-[10px] font-mono">
            {r.targetType}
          </Badge>
          <p className="text-[10px] font-mono text-slate-500 truncate max-w-[160px]">
            {r.targetId}
          </p>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Reported Infraction',
      render: (r) => (
        <div className="max-w-xs">
          <p className="font-semibold text-slate-800 line-clamp-2">{r.reason}</p>
          {r.resolutionNotes && (
            <p className="text-[10px] text-emerald-700 mt-1 bg-emerald-50 p-1.5 rounded-md border border-emerald-100">
              Note: {r.resolutionNotes}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Badge
          variant={
            r.status === 'RESOLVED'
              ? 'primary'
              : r.status === 'DISMISSED'
              ? 'secondary'
              : r.status === 'INVESTIGATING'
              ? 'outline'
              : 'danger'
          }
          className="text-[10px]"
        >
          {r.status}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Report Date',
      render: (r) => (
        <span className="text-slate-500 text-[11px] whitespace-nowrap">
          {new Date(r.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Resolution',
      className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            onClick={() => {
              setActiveReport(r);
              setResolutionStatus(r.status === 'PENDING' ? 'RESOLVED' : (r.status as any));
              setActionTaken('WARN');
              setResolutionNotes(r.resolutionNotes || '');
            }}
            className="h-7 px-2.5 text-[11px] bg-slate-900 hover:bg-slate-800 text-white gap-1"
          >
            <Scale className="w-3 h-3" /> Adjudicate
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Safety & Abuse Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit user misconduct flags, illegal marketplace listings, harassment reports, and policy infractions.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <AdminDataTable
        columns={columns}
        data={reports}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        filters={
          <>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-8 rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Report Statuses</option>
              <option value="PENDING">Pending Investigation</option>
              <option value="INVESTIGATING">Under Investigation</option>
              <option value="RESOLVED">Resolved Reports</option>
              <option value="DISMISSED">Dismissed Reports</option>
            </select>

            <select
              value={targetTypeFilter}
              onChange={(e) => {
                setTargetTypeFilter(e.target.value);
                setPage(1);
              }}
              className="h-8 rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Resource Types</option>
              <option value="USER">User Violations</option>
              <option value="POST">Community Posts</option>
              <option value="MARKETPLACE_ITEM">Marketplace Items</option>
              <option value="MESSAGE">Direct Messages</option>
            </select>
          </>
        }
        page={page}
        totalPages={Math.max(1, Math.ceil(reports.length / 20))}
        onPageChange={(p) => setPage(p)}
        emptyTitle="No safety reports found"
        emptyDescription="There are no reports on file matching your search criteria."
        emptyIcon={<AlertTriangle className="w-8 h-8 text-slate-300 mx-auto" />}
      />

      {/* Resolution Modal */}
      {activeReport && (
        <Modal
          isOpen={!!activeReport}
          onClose={() => setActiveReport(null)}
          title="Adjudicate Safety Report"
        >
          <form onSubmit={handleResolveSubmit} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Report ID:</span>
                <span className="font-mono text-slate-700 text-[11px]">{activeReport.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Type:</span>
                <span className="font-bold text-slate-900">{activeReport.targetType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reported Reason:</span>
                <span className="font-semibold text-rose-700">{activeReport.reason}</span>
              </div>
            </div>

            {/* Resolution Status */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Resolution Status</label>
              <select
                value={resolutionStatus}
                onChange={(e) => setResolutionStatus(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="RESOLVED">Resolved (Action Enacted)</option>
                <option value="INVESTIGATING">Under Ongoing Investigation</option>
                <option value="DISMISSED">Dismissed (No Violation Found)</option>
              </select>
            </div>

            {/* Consequential Action */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Enforced Moderation Action</label>
              <select
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="WARN">Formal Warning Dispatched</option>
                <option value="REMOVE">Remove Target Resource (Delete Content)</option>
                <option value="SUSPEND">Suspend Target User Account</option>
                <option value="DISMISS">Dismiss Without Action</option>
                <option value="NONE">No Action Taken</option>
              </select>
            </div>

            {/* Resolution Notes */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Adjudication Findings & Notes
              </label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Detail the audit findings or justification for the resolution action..."
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveReport(null)}
                disabled={resolveMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={resolveMutation.isPending}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5"
              >
                <Scale className="w-3.5 h-3.5" /> Enforce Resolution
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
