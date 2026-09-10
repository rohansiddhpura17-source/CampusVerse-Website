'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api/events';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  Search,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Clock,
  Video,
} from 'lucide-react';

export default function StudentEventsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const {
    data: events,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['campusEvents', search, selectedCategory],
    queryFn: () =>
      eventsApi.getEvents({
        search: search || undefined,
        category: selectedCategory === 'ALL' ? undefined : selectedCategory,
      }),
  });

  const registerMutation = useMutation({
    mutationFn: async (id: string) => {
      return eventsApi.registerEvent(id);
    },
    onSuccess: () => {
      toastSuccess('Successfully registered for event!');
      queryClient.invalidateQueries({ queryKey: ['campusEvents'] });
      queryClient.invalidateQueries({ queryKey: ['eventDetail'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to register for event');
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: async (id: string) => {
      return eventsApi.unregisterEvent(id);
    },
    onSuccess: () => {
      toastSuccess('Event registration cancelled.');
      queryClient.invalidateQueries({ queryKey: ['campusEvents'] });
      queryClient.invalidateQueries({ queryKey: ['eventDetail'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to cancel registration');
    },
  });

  const categories = [
    { label: 'All Events', value: 'ALL' },
    { label: 'Hackathons', value: 'HACKATHON' },
    { label: 'Academic', value: 'ACADEMIC' },
    { label: 'Career Fair', value: 'CAREER' },
    { label: 'Cultural', value: 'CULTURAL' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Events & Activities</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore campus seminars, hackathons, club meetups, and register with real seat reservations.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search events by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === c.value
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">Unable to load campus events</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : !events || events.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No events scheduled</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Check back soon for upcoming campus hackathons, technical symposia, and guest lectures.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const isRegistered = event.isRegistered;
            const isFull = event.capacity > 0 && event.registeredCount >= event.capacity;
            return (
              <Card key={event.id} className="hover:border-brand-200 transition-all flex flex-col justify-between">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="primary" className="text-[10px]">
                      {event.category}
                    </Badge>
                    {isRegistered ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Registered
                      </span>
                    ) : isFull ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        Full
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <Link
                      href={`/student/events/${event.id}`}
                      className="font-bold text-sm text-slate-900 hover:text-brand-600 line-clamp-1 transition-colors"
                    >
                      {event.title}
                    </Link>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{event.description}</p>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{new Date(event.startTime).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {event.isOnline ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="text-indigo-600 font-medium">Online Event</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{event.location || 'Campus Auditorium'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {event.registeredCount || 0}
                      {event.capacity ? ` / ${event.capacity}` : ''} attendees
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/student/events/${event.id}`}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center"
                      >
                        Details
                      </Link>
                      {isRegistered ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => unregisterMutation.mutate(event.id)}
                          isLoading={unregisterMutation.isPending}
                          className="text-xs text-rose-600 hover:bg-rose-50"
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          disabled={isFull}
                          onClick={() => registerMutation.mutate(event.id)}
                          isLoading={registerMutation.isPending}
                          className="text-xs"
                        >
                          Register
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
