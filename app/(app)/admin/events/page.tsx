'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { AdminEvent } from '@/types/admin';
import { useToast } from '@/components/ui/toast';
import { AdminDataTable, Column } from '@/components/admin/data-table';
import { DestructiveActionModal } from '@/components/admin/destructive-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Trash2, CheckCircle2, XCircle, MapPin, Globe } from 'lucide-react';

export default function AdminEventsPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [page, setPage] = useState(1);
  const [removeTarget, setRemoveTarget] = useState<AdminEvent | null>(null);

  const {
    data: eventsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['adminEventsFullList', page],
    queryFn: () => adminApi.getEvents({ page, limit: 20 }),
  });

  const events: AdminEvent[] = Array.isArray(eventsData)
    ? eventsData
    : (eventsData as any)?.data || [];

  const moderateMutation = useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: any; reason?: string }) =>
      adminApi.moderateEvent(id, action, reason),
    onSuccess: (data, variables) => {
      toastSuccess(`Event ${variables.action.toLowerCase()}d successfully.`);
      setRemoveTarget(null);
      queryClient.invalidateQueries({ queryKey: ['adminEventsFullList'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardMetrics'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to moderate event.');
    },
  });

  const columns: Column<AdminEvent>[] = [
    {
      key: 'title',
      header: 'Event Title & Synopsis',
      render: (ev) => (
        <div>
          <span className="font-bold text-slate-900 block line-clamp-1">{ev.title}</span>
          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ev.description}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (ev) => (
        <Badge variant="outline" className="text-[10px]">
          {ev.category}
        </Badge>
      ),
    },
    {
      key: 'schedule',
      header: 'Event Schedule',
      render: (ev) => (
        <div className="text-[11px] space-y-0.5">
          <span className="font-semibold text-slate-800 block">
            {new Date(ev.startTime).toLocaleDateString()}
          </span>
          <span className="text-slate-400">
            {new Date(ev.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      key: 'venue',
      header: 'Venue / Mode',
      render: (ev) => (
        <div className="flex items-center gap-1 text-[11px] text-slate-600">
          {ev.isOnline ? (
            <>
              <Globe className="w-3.5 h-3.5 text-blue-500" /> Virtual Webcast
            </>
          ) : (
            <>
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {ev.location || 'Campus Center'}
            </>
          )}
        </div>
      ),
    },
    {
      key: 'organizer',
      header: 'Organizer',
      render: (ev) => (
        <div>
          <span className="font-semibold text-slate-800 block text-[11px]">
            {ev.organizer?.profile?.fullName || 'Organizer'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{ev.organizer?.email}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (ev) => (
        <Badge
          variant={ev.status === 'UPCOMING' ? 'primary' : 'outline'}
          className={
            ev.status === 'UPCOMING'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
              : 'text-[10px]'
          }
        >
          {ev.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Moderation Actions',
      className: 'text-right',
      render: (ev) => (
        <div className="flex items-center justify-end gap-1.5">
          {ev.status !== 'UPCOMING' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => moderateMutation.mutate({ id: ev.id, action: 'APPROVE' })}
              isLoading={moderateMutation.isPending}
              className="h-7 px-2 text-[11px] text-emerald-700 hover:bg-emerald-50 border-emerald-200"
            >
              Approve
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => setRemoveTarget(ev)}
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Events Moderation</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Oversee university assemblies, tech symposiums, hackathons, and webinars.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <AdminDataTable
        columns={columns}
        data={events}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        page={page}
        totalPages={Math.max(1, Math.ceil(events.length / 20))}
        onPageChange={(p) => setPage(p)}
        emptyTitle="No campus events found"
        emptyDescription="There are currently no events registered in the platform database."
        emptyIcon={<Calendar className="w-8 h-8 text-slate-300 mx-auto" />}
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
          title="Confirm Event Cancellation / Removal"
          targetName={removeTarget.title}
          targetType="Campus Event"
          consequenceText="Permanently deleting this event record from the platform database. Registered attendees will be notified of the cancellation rationale."
          confirmButtonText="Permanently Purge Event"
          requireReason={true}
          isLoading={moderateMutation.isPending}
        />
      )}
    </div>
  );
}
