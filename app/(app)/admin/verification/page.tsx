'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { VerificationItem } from '@/types/admin';
import { useToast } from '@/components/ui/toast';
import { AdminDataTable, Column } from '@/components/admin/data-table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function AdminVerificationQueuePage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [page, setPage] = useState(1);

  // Review modal
  const [reviewItem, setReviewItem] = useState<VerificationItem | null>(null);
  const [reviewAction, setReviewAction] = useState<'APPROVED' | 'REJECTED' | 'REQUEST_INFO'>('APPROVED');
  const [rejectionReason, setRejectionReason] = useState('');

  const {
    data: verificationsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['adminVerificationsList', statusFilter, page],
    queryFn: () =>
      adminApi.getVerifications({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        page,
        limit: 20,
      }),
  });

  const verifications: VerificationItem[] = Array.isArray(verificationsData)
    ? verificationsData
    : (verificationsData as any)?.data || [];

  const reviewMutation = useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: 'APPROVED' | 'REJECTED' | 'REQUEST_INFO';
      reason?: string;
    }) =>
      adminApi.reviewVerification(id, {
        status,
        rejectionReason: reason,
      }),
    onSuccess: (data, variables) => {
      toastSuccess(`Verification submission marked as ${variables.status.toLowerCase()}.`);
      setReviewItem(null);
      setRejectionReason('');
      queryClient.invalidateQueries({ queryKey: ['adminVerificationsList'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardMetrics'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to submit verification review.');
    },
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewItem) return;
    if (reviewAction === 'REJECTED' && !rejectionReason.trim()) {
      toastError('Please specify a rejection reason for the applicant.');
      return;
    }
    reviewMutation.mutate({
      id: reviewItem.id,
      status: reviewAction,
      reason: rejectionReason.trim() || undefined,
    });
  };

  const columns: Column<VerificationItem>[] = [
    {
      key: 'applicant',
      header: 'Applicant',
      render: (v) => (
        <div>
          <Link
            href={`/admin/users/${v.userId}`}
            className="font-bold text-slate-900 hover:text-blue-600 transition-colors block line-clamp-1"
          >
            {v.user?.profile?.fullName || v.user?.email || 'Applicant'}
          </Link>
          <span className="text-[11px] text-slate-500 font-mono">{v.user?.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (v) => (
        <Badge variant="outline" className="text-[10px] font-mono">
          {v.user?.role || 'MEMBER'}
        </Badge>
      ),
    },
    {
      key: 'document',
      header: 'Credential Document Type',
      render: (v) => (
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-semibold text-slate-800">{v.documentType}</span>
          {v.documentUrl && (
            <a
              href={v.documentUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-700"
              title="Inspect submitted document"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Verification Status',
      render: (v) => (
        <Badge
          variant={
            v.status === 'APPROVED'
              ? 'primary'
              : v.status === 'REJECTED'
              ? 'danger'
              : 'outline'
          }
          className={
            v.status === 'APPROVED'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
              : v.status === 'REJECTED'
              ? 'bg-rose-50 text-rose-700 border-rose-200 text-[10px]'
              : 'bg-amber-50 text-amber-700 border-amber-200 text-[10px]'
          }
        >
          {v.status}
        </Badge>
      ),
    },
    {
      key: 'submitted',
      header: 'Submitted',
      render: (v) => (
        <span className="text-slate-500 text-[11px] whitespace-nowrap">
          {new Date(v.submittedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Review Actions',
      className: 'text-right',
      render: (v) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            onClick={() => {
              setReviewItem(v);
              setReviewAction(v.status === 'PENDING' ? 'APPROVED' : v.status);
              setRejectionReason(v.rejectionReason || '');
            }}
            className="h-7 px-2.5 text-[11px] bg-blue-600 hover:bg-blue-700 text-white gap-1"
          >
            <ShieldCheck className="w-3 h-3" /> Review Document
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Identity Verification Queue</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate official university enrollment and alumni identity documents for credential verification.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <AdminDataTable
        columns={columns}
        data={verifications}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        filters={
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-8 rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="PENDING">Pending Submissions</option>
            <option value="APPROVED">Approved Verifications</option>
            <option value="REJECTED">Rejected Submissions</option>
            <option value="REQUEST_INFO">Information Requested</option>
            <option value="ALL">All Submissions</option>
          </select>
        }
        page={page}
        totalPages={Math.max(1, Math.ceil(verifications.length / 20))}
        onPageChange={(p) => setPage(p)}
        emptyTitle="No verification records"
        emptyDescription="There are currently no verification documents matching this status filter."
        emptyIcon={<ShieldCheck className="w-8 h-8 text-slate-300 mx-auto" />}
      />

      {/* Review Modal */}
      {reviewItem && (
        <Modal
          isOpen={!!reviewItem}
          onClose={() => setReviewItem(null)}
          title="Review Credential Submission"
        >
          <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-900">
                  {reviewItem.user?.profile?.fullName || reviewItem.user?.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Document Type:</span>
                <span className="font-semibold text-slate-800">{reviewItem.documentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submission Date:</span>
                <span className="text-slate-700">{new Date(reviewItem.submittedAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Decision Radio */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">Administrative Decision</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setReviewAction('APPROVED')}
                  className={`p-2.5 rounded-xl border font-semibold flex flex-col items-center gap-1 transition-colors ${
                    reviewAction === 'APPROVED'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Approve
                </button>

                <button
                  type="button"
                  onClick={() => setReviewAction('REJECTED')}
                  className={`p-2.5 rounded-xl border font-semibold flex flex-col items-center gap-1 transition-colors ${
                    reviewAction === 'REJECTED'
                      ? 'bg-rose-50 border-rose-400 text-rose-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  Reject
                </button>

                <button
                  type="button"
                  onClick={() => setReviewAction('REQUEST_INFO')}
                  className={`p-2.5 rounded-xl border font-semibold flex flex-col items-center gap-1 transition-colors ${
                    reviewAction === 'REQUEST_INFO'
                      ? 'bg-amber-50 border-amber-400 text-amber-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  Need Info
                </button>
              </div>
            </div>

            {/* Rejection / Info Reason */}
            {reviewAction !== 'APPROVED' && (
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  {reviewAction === 'REJECTED' ? 'Rejection Reason' : 'Information Needed from Applicant'} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why the submitted documents are insufficient or what additional proof is required..."
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setReviewItem(null)}
                disabled={reviewMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={reviewMutation.isPending}
                className={`text-xs gap-1.5 ${
                  reviewAction === 'APPROVED'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : reviewAction === 'REJECTED'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                Save Review Decision
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
