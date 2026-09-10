'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { Announcement } from '@/types/admin';
import { useToast } from '@/components/ui/toast';
import { AdminDataTable, Column } from '@/components/admin/data-table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Megaphone, Plus, Bell, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetRole, setTargetRole] = useState<'ALL' | 'ASPIRANT' | 'STUDENT' | 'ALUMNI' | 'MENTOR'>('ALL');
  const [priority, setPriority] = useState<'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');

  const {
    data: announcements,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['adminAnnouncementsList'],
    queryFn: () => adminApi.getAnnouncements(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: {
      title: string;
      content: string;
      targetRole?: any;
      priority?: any;
    }) => adminApi.createAnnouncement(payload),
    onSuccess: (data) => {
      toastSuccess(`Campus broadcast published! Delivered to ${data.deliveredCount ?? 'targeted'} members.`);
      setCreateModalOpen(false);
      setTitle('');
      setContent('');
      setTargetRole('ALL');
      setPriority('NORMAL');
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncementsList'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to publish campus announcement.');
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toastError('Title and message content are required.');
      return;
    }
    createMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      targetRole: targetRole === 'ALL' ? null : targetRole,
      priority,
    });
  };

  const columns: Column<Announcement>[] = [
    {
      key: 'title',
      header: 'Announcement Title & Message',
      render: (a) => (
        <div>
          <span className="font-bold text-slate-900 block line-clamp-1">{a.title}</span>
          <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{a.content}</p>
        </div>
      ),
    },
    {
      key: 'audience',
      header: 'Target Audience',
      render: (a) => (
        <Badge variant="outline" className="text-[10px] font-mono">
          {a.targetRole || 'ALL CAMPUS'}
        </Badge>
      ),
    },
    {
      key: 'priority',
      header: 'Broadcast Priority',
      render: (a) => (
        <Badge
          variant={
            a.priority === 'URGENT' || a.priority === 'HIGH' ? 'danger' : 'secondary'
          }
          className="text-[10px]"
        >
          {a.priority}
        </Badge>
      ),
    },
    {
      key: 'author',
      header: 'Dispatched By',
      render: (a) => (
        <div>
          <span className="font-semibold text-slate-800 block text-[11px]">
            {a.author?.profile?.fullName || 'Campus Administrator'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{a.author?.email}</span>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Published Date',
      render: (a) => (
        <span className="text-slate-500 text-[11px] whitespace-nowrap">
          {new Date(a.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Announcements & Alerts</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast emergency alerts, institutional circulars, and role-targeted campus updates.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setCreateModalOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Broadcast Announcement
        </Button>
      </div>

      {/* Main Table */}
      <AdminDataTable
        columns={columns}
        data={announcements || []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No announcements published"
        emptyDescription="There are currently no active campus broadcast messages on record."
        emptyIcon={<Megaphone className="w-8 h-8 text-slate-300 mx-auto" />}
      />

      {/* Create Announcement Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Broadcast Campus Announcement"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5">
            <Bell className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-blue-800 leading-relaxed text-[11px]">
              Publishing will immediately dispatch real-time system notifications to all users matching the targeted campus role.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Announcement Title <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Campus Network Maintenance Tonight 10 PM"
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="ALL">All Campus (Universal)</option>
                <option value="STUDENT">Students Only</option>
                <option value="ALUMNI">Alumni Only</option>
                <option value="ASPIRANT">Aspirants Only</option>
                <option value="MENTOR">Mentors Only</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Broadcast Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="NORMAL">Normal Notice</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent / Emergency Alert</option>
                <option value="LOW">Informational (Low)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Message Content <span className="text-rose-500">*</span></label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detail the operational notice or instructions for the student and campus community..."
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={createMutation.isPending}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5"
            >
              <Megaphone className="w-3.5 h-3.5" /> Dispatch Broadcast
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
