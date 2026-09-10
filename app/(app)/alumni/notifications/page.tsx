'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, NotificationItem } from '@/lib/api/notifications';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bell,
  CheckCircle2,
  Clock,
  Briefcase,
  UserCheck,
  Calendar,
  AlertCircle,
  RefreshCw,
  Share2,
} from 'lucide-react';

export default function AlumniNotificationsPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [onlyUnread, setOnlyUnread] = useState(false);

  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['alumniNotificationsList'],
    queryFn: () => notificationsApi.getNotifications(),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alumniNotificationsList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to mark as read'),
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const unreadList = (notifications || []).filter((n) => !n.isRead);
      for (const item of unreadList) {
        await notificationsApi.markAsRead(item.id);
      }
    },
    onSuccess: () => {
      toastSuccess('All notifications marked as read.');
      queryClient.invalidateQueries({ queryKey: ['alumniNotificationsList'] });
    },
  });

  const filteredNotifications = (notifications || []).filter((n) => {
    if (onlyUnread) return !n.isRead;
    return true;
  });

  const unreadCount = (notifications || []).filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications & Activity Feed</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates regarding student referral requests, mentorship inquiries, and network milestones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => markAllReadMutation.mutate()}
              isLoading={markAllReadMutation.isPending}
              className="text-xs gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark All Read
            </Button>
          )}

          <Button
            size="sm"
            variant={onlyUnread ? 'primary' : 'outline'}
            onClick={() => setOnlyUnread(!onlyUnread)}
            className="text-xs"
          >
            {onlyUnread ? 'Showing Unread' : 'Filter Unread'}
          </Button>
        </div>
      </div>

      {/* Content List */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-800">Failed to load notifications</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : filteredNotifications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              {onlyUnread ? 'No unread notifications' : 'No notifications on record'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You are completely caught up! New alerts regarding connections, referrals, and sessions will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filteredNotifications.map((n) => (
            <Card
              key={n.id}
              className={`transition-all ${
                !n.isRead ? 'border-purple-300 bg-purple-50/20 shadow-2xs' : 'border-slate-200'
              }`}
            >
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                      !n.isRead ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {n.type === 'APPLICATION' ? (
                      <Briefcase className="w-4 h-4" />
                    ) : n.type === 'MENTORSHIP' ? (
                      <UserCheck className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{n.title}</h3>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {!n.isRead && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAsReadMutation.mutate(n.id)}
                    className="text-xs text-purple-700 hover:bg-purple-50 border-purple-200 shrink-0"
                  >
                    Dismiss
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
