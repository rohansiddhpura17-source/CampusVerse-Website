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
  Check,
  Clock,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function StudentNotificationsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['studentNotifications'],
    queryFn: () => notificationsApi.getNotifications(),
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return notificationsApi.markAsRead(id);
    },
    onSuccess: () => {
      toastSuccess('Notification marked as read');
      queryClient.invalidateQueries({ queryKey: ['studentNotifications'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to update notification');
    },
  });

  const filteredNotifications = (notifications || []).filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    return true;
  });

  const unreadCount = (notifications || []).filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'EVENT':
        return <Calendar className="w-4 h-4 text-sky-600" />;
      case 'ACADEMIC':
        return <Sparkles className="w-4 h-4 text-brand-600" />;
      case 'COMMUNITY':
        return <MessageSquare className="w-4 h-4 text-indigo-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications & Alerts</h1>
            {unreadCount > 0 && (
              <Badge variant="primary" className="text-xs">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates regarding your enrolled courses, registered events, peer discussions, and marketplace inquiries.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={filter === 'ALL' ? 'primary' : 'outline'}
            onClick={() => setFilter('ALL')}
            className="text-xs"
          >
            All Notifications
          </Button>
          <Button
            size="sm"
            variant={filter === 'UNREAD' ? 'primary' : 'outline'}
            onClick={() => setFilter('UNREAD')}
            className="text-xs"
          >
            Unread Only {unreadCount > 0 ? `(${unreadCount})` : ''}
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0 divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : isError ? (
            <div className="p-8 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">Unable to load notifications</p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
              </Button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Bell className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">
                {filter === 'UNREAD' ? 'No unread notifications' : 'No notifications yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Campus activity notices and course announcements will appear here as they are published.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  !notif.isRead ? 'bg-brand-50/20' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 mt-0.5 shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">{notif.title}</h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0" title="Unread" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(notif.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {!notif.isRead && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsReadMutation.mutate(notif.id)}
                      isLoading={markAsReadMutation.isPending}
                      className="text-xs text-brand-600 hover:bg-brand-50"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Mark Read
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
