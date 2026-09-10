'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { AdminJob } from '@/types/admin';
import { useToast } from '@/components/ui/toast';
import { AdminDataTable, Column } from '@/components/admin/data-table';
import { DestructiveActionModal } from '@/components/admin/destructive-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Trash2, CheckCircle2, XCircle, Building2, MapPin } from 'lucide-react';

export default function AdminJobsPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [page, setPage] = useState(1);
  const [removeTarget, setRemoveTarget] = useState<AdminJob | null>(null);

  const {
    data: jobsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['adminJobsFullList', page],
    queryFn: () => adminApi.getJobs({ page, limit: 20 }),
  });

  const jobs: AdminJob[] = Array.isArray(jobsData)
    ? jobsData
    : (jobsData as any)?.data || [];

  const moderateMutation = useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: any; reason?: string }) =>
      adminApi.moderateJob(id, action, reason),
    onSuccess: (data, variables) => {
      toastSuccess(`Job posting ${variables.action.toLowerCase()}d successfully.`);
      setRemoveTarget(null);
      queryClient.invalidateQueries({ queryKey: ['adminJobsFullList'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardMetrics'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to moderate job posting.');
    },
  });

  const columns: Column<AdminJob>[] = [
    {
      key: 'title',
      header: 'Role Title & Description',
      render: (job) => (
        <div>
          <span className="font-bold text-slate-900 block line-clamp-1">{job.title}</span>
          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{job.description}</p>
        </div>
      ),
    },
    {
      key: 'company',
      header: 'Company & Location',
      render: (job) => (
        <div className="space-y-0.5">
          <span className="font-semibold text-slate-800 text-[11px] flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            {job.company?.name || 'Recruiting Partner'}
          </span>
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {job.isRemote ? 'Remote' : job.location}
          </span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (job) => (
        <Badge variant="outline" className="text-[10px]">
          {job.roleType}
        </Badge>
      ),
    },
    {
      key: 'poster',
      header: 'Posted By',
      render: (job) => (
        <div>
          <span className="font-semibold text-slate-800 block text-[11px]">
            {job.poster?.profile?.fullName || 'Alumni / Recruiter'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{job.poster?.email}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (job) => (
        <Badge
          variant={job.status === 'ACTIVE' ? 'primary' : 'outline'}
          className={
            job.status === 'ACTIVE'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
              : 'text-[10px]'
          }
        >
          {job.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Moderation Actions',
      className: 'text-right',
      render: (job) => (
        <div className="flex items-center justify-end gap-1.5">
          {job.status !== 'ACTIVE' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => moderateMutation.mutate({ id: job.id, action: 'APPROVE' })}
              isLoading={moderateMutation.isPending}
              className="h-7 px-2 text-[11px] text-emerald-700 hover:bg-emerald-50 border-emerald-200"
            >
              Approve
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => setRemoveTarget(job)}
            className="h-7 px-2 text-[11px] text-rose-600 hover:bg-rose-50 border-rose-200 gap-1"
          >
            <Trash2 className="w-3 h-3" /> Remove
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Career Opportunities Moderation</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit campus job vacancies, internship postings, and employer recruiting disclosures.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <AdminDataTable
        columns={columns}
        data={jobs}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        page={page}
        totalPages={Math.max(1, Math.ceil(jobs.length / 20))}
        onPageChange={(p) => setPage(p)}
        emptyTitle="No job listings found"
        emptyDescription="There are currently no job opportunities awaiting review."
        emptyIcon={<Briefcase className="w-8 h-8 text-slate-300 mx-auto" />}
      />

      {/* Destructive Removal Modal */}
      {removeTarget && (
        <DestructiveActionModal
          isOpen={!!removeTarget}
          onClose={() => setRemoveTarget(null)}
          onConfirm={(reason) =>
            moderateMutation.mutate({
              id: removeTarget.id,
              action: 'REMOVE',
              reason,
            })
          }
          title="Confirm Job Listing Removal"
          targetName={`${removeTarget.title} (${removeTarget.company?.name || 'Company'})`}
          targetType="Job Posting"
          consequenceText="Permanently deleting this job posting from the platform. Active applicants will receive status updates reflecting opportunity closure."
          confirmButtonText="Permanently Purge Job"
          requireReason={true}
          isLoading={moderateMutation.isPending}
        />
      )}
    </div>
  );
}
