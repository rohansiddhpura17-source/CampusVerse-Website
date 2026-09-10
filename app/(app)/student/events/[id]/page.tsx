'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api/events';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Building,
} from 'lucide-react';

export default function StudentEventDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const {
    data: event,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['eventDetail', id],
    queryFn: () => eventsApi.getEventById(id),
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      return eventsApi.registerEvent(id);
    },
    onSuccess: () => {
      toastSuccess('Successfully registered for this event!');
      queryClient.invalidateQueries({ queryKey: ['eventDetail', id] });
      queryClient.invalidateQueries({ queryKey: ['campusEvents'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to register for event');
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: async () => {
      return eventsApi.unregisterEvent(id);
    },
    onSuccess: () => {
      toastSuccess('Registration cancelled.');
      queryClient.invalidateQueries({ queryKey: ['eventDetail', id] });
      queryClient.invalidateQueries({ queryKey: ['campusEvents'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to cancel registration');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">Event Not Found</h2>
          <p className="text-xs text-slate-500">
            This campus event may have concluded or been removed.
          </p>
          <div className="pt-2">
            <Link href="/student/events">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isRegistered = event.isRegistered;
  const isFull = event.capacity > 0 && event.registeredCount >= event.capacity;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/student/events"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
      </Link>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" className="text-xs">
                  {event.category}
                </Badge>
                {isRegistered && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-3xl font-bold text-slate-900">{event.title}</h1>
              <p className="text-xs text-slate-500">
                Organized by {(event as any).organizer?.profile?.fullName || 'Campus Club / Department'}
              </p>
            </div>

            {/* Action Button */}
            <div className="self-start">
              {isRegistered ? (
                <Button
                  variant="outline"
                  onClick={() => unregisterMutation.mutate()}
                  isLoading={unregisterMutation.isPending}
                  className="text-rose-600 hover:bg-rose-50 border-rose-200"
                >
                  Cancel Registration
                </Button>
              ) : (
                <Button
                  disabled={isFull}
                  onClick={() => registerMutation.mutate()}
                  isLoading={registerMutation.isPending}
                  className="shadow-xs"
                >
                  {isFull ? 'Event Fully Booked' : 'Register for Event'}
                </Button>
              )}
            </div>
          </div>

          {/* Details & Location Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Event Overview
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {event.isOnline && event.meetingUrl && isRegistered && (
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                    <Video className="w-4 h-4 text-indigo-600" />
                    <span>Meeting Access Link (Attendees Only)</span>
                  </div>
                  <a
                    href={event.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-indigo-700 hover:underline flex items-center gap-1"
                  >
                    {event.meetingUrl} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Logistics Card */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900">Event Logistics</h4>

                <div className="space-y-2.5 text-slate-600">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Date & Time</p>
                      <p className="text-[11px] mt-0.5">
                        {new Date(event.startTime).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {event.endTime ? ` - ${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    {event.isOnline ? (
                      <Video className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    ) : (
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-slate-800">Location</p>
                      <p className="text-[11px] mt-0.5">{event.isOnline ? 'Online / Remote' : event.location || 'Campus Auditorium'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Seat Capacity</p>
                      <p className="text-[11px] mt-0.5">
                        {event.registeredCount || 0}
                        {event.capacity ? ` / ${event.capacity} seats taken` : ' registered'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
