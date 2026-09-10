'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api/events';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  ArrowLeft,
  MapPin,
  Clock,
  Video,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Users,
} from 'lucide-react';

export default function AlumniEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();
  const eventId = params?.id as string;

  const {
    data: event,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['alumniEventDetail', eventId],
    queryFn: () => eventsApi.getEventById(eventId),
    enabled: !!eventId,
  });

  const registerMutation = useMutation({
    mutationFn: () => eventsApi.registerEvent(eventId),
    onSuccess: () => {
      toastSuccess('Registered for event successfully!');
      queryClient.invalidateQueries({ queryKey: ['alumniEventDetail', eventId] });
      queryClient.invalidateQueries({ queryKey: ['alumniEventsList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to register'),
  });

  const cancelMutation = useMutation({
    mutationFn: () => eventsApi.unregisterEvent(eventId),
    onSuccess: () => {
      toastSuccess('Event registration cancelled.');
      queryClient.invalidateQueries({ queryKey: ['alumniEventDetail', eventId] });
      queryClient.invalidateQueries({ queryKey: ['alumniEventsList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to cancel registration'),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="text-center py-12 space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">Event Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested event could not be located in the schedule.
        </p>
        <Button variant="outline" size="sm" onClick={() => router.push('/alumni/events')}>
          Back to Events
        </Button>
      </div>
    );
  }

  const isRegistered = event.isRegistered;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back Link */}
      <Link
        href="/alumni/events"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Events
      </Link>

      {/* Main Event Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {event.category || 'Event'}
                </Badge>
                {event.isOnline ? (
                  <Badge variant="secondary" className="bg-sky-50 text-sky-700 border-sky-200 text-[10px]">
                    Virtual Webinar
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px]">
                    In-Person
                  </Badge>
                )}
                {isRegistered && (
                  <Badge variant="primary" className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]">
                    Confirmed Registration
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {event.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(event.startTime).toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  {event.isOnline ? <Video className="w-4 h-4 text-slate-400" /> : <MapPin className="w-4 h-4 text-slate-400" />}
                  {event.isOnline ? 'Online / Remote' : event.location || 'Campus Auditorium'}
                </span>
              </div>
            </div>

            {/* Registration Action */}
            <div className="shrink-0 self-start sm:self-center">
              {!isRegistered ? (
                <Button
                  onClick={() => registerMutation.mutate()}
                  isLoading={registerMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-5"
                >
                  Register for Event
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => cancelMutation.mutate()}
                  isLoading={cancelMutation.isPending}
                  className="text-rose-600 hover:bg-rose-50 border-rose-200 text-xs gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" /> Cancel Seat
                </Button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">About this Event</h3>
            <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Location & Virtual Access Details */}
          <div className="pt-4 border-t border-slate-100 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
            <p className="font-bold text-slate-900">Venue & Access Instructions</p>
            <p className="text-slate-600">
              {event.isOnline
                ? 'Registered attendees will receive the meeting room link and livestream access 24 hours prior to the session.'
                : `Please present your alumni digital pass at the entrance of ${event.location || 'the main campus hall'}.`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
