'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { MentorOverview } from '@/types/admin';
import { useToast } from '@/components/ui/toast';
import { AdminDataTable, Column } from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, ShieldCheck, UserX, Star, DollarSign } from 'lucide-react';

export default function AdminMentorshipPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const {
    data: mentors,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['adminMentorshipOverviewList'],
    queryFn: () => adminApi.getMentorship(),
  });

  const moderateMutation = useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: any; reason?: string }) =>
      adminApi.moderateMentor(id, action, reason),
    onSuccess: (data, vars) => {
      toastSuccess(`Mentor profile status updated to ${vars.action}.`);
      queryClient.invalidateQueries({ queryKey: ['adminMentorshipOverviewList'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardMetrics'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to update mentor profile status.');
    },
  });

  const columns: Column<MentorOverview>[] = [
    {
      key: 'mentor',
      header: 'Mentor Name & Identity',
      render: (m) => (
        <div>
          <span className="font-bold text-slate-900 block line-clamp-1">
            {m.user?.profile?.fullName || m.user?.email || 'Campus Mentor'}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">{m.user?.email}</span>
        </div>
      ),
    },
    {
      key: 'expertise',
      header: 'Domain Expertise',
      render: (m) => (
        <span className="text-slate-700 font-medium text-[11px]">
          {m.expertise || 'Career & Technical Mentorship'}
        </span>
      ),
    },
    {
      key: 'rate',
      header: 'Hourly Honorarium',
      render: (m) => (
        <span className="font-bold text-slate-900 font-mono text-[11px]">
          {m.hourlyRate ? `₹${m.hourlyRate}/hr` : 'Pro-bono'}
        </span>
      ),
    },
    {
      key: 'requests',
      header: 'Student Inquiries',
      render: (m) => (
        <span className="font-bold text-slate-900 font-mono text-[11px]">
          {m._count?.requests ?? 0}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Accepting Mentees',
      render: (m) => (
        <Badge
          variant={m.isAcceptingMentees ? 'primary' : 'outline'}
          className={
            m.isAcceptingMentees
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
              : 'text-[10px]'
          }
        >
          {m.isAcceptingMentees ? 'Active & Receiving' : 'Suspended / Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Administrative Action',
      className: 'text-right',
      render: (m) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              moderateMutation.mutate({
                id: m.id,
                action: m.isAcceptingMentees ? 'REJECT' : 'APPROVE',
              })
            }
            isLoading={moderateMutation.isPending}
            className={`h-7 px-2.5 text-[11px] gap-1 ${
              m.isAcceptingMentees
                ? 'text-rose-600 hover:bg-rose-50 border-rose-200'
                : 'text-emerald-700 hover:bg-emerald-50 border-emerald-200'
            }`}
          >
            {m.isAcceptingMentees ? (
              <>
                <UserX className="w-3 h-3" /> Disable Inquiries
              </>
            ) : (
              <>
                <UserCheck className="w-3 h-3" /> Enable Inquiries
              </>
            )}
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mentorship Program Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit alumni mentors, track guidance demand, and oversee mentor availability status.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <AdminDataTable
        columns={columns}
        data={mentors || []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No mentors registered"
        emptyDescription="There are currently no mentor profiles on record."
        emptyIcon={<UserCheck className="w-8 h-8 text-slate-300 mx-auto" />}
      />
    </div>
  );
}
