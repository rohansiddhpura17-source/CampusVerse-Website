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
  Clock,
  Video,
  CheckCircle2,
  ArrowUpRight,
  AlertCircle,
  RefreshCw,
  Users,
} from 'lucide-react';

export default function AlumniEventsPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const {
    data: events,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['alumniEventsList', search, category],
    queryFn: () =>
      eventsApi.getEvents({
        search: search || undefined,
        category: category || undefined,
      }),
  });

  const registerMutation = useMutation({
    mutationFn: (id: string) => eventsApi.registerEvent(id),
    onSuccess: () => {
      toastSuccess('Successfully registered for event!');
      queryClient.invalidateQueries({ queryKey: ['alumniEventsList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to register for event'),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Events, Webinars & Reunions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect with campus communities, participate in industry panels, and join alumni reunions.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search events by title, topic, or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-purple-500 focus:outline-none"
          >
            <option value="">All Event Categories</option>
            <option value="CAREER">Career & Tech Panels</option>
            <option value="REUNION">Alumni Homecoming & Reunions</option>
            <option value="WORKSHOP">Technical Workshops</option>
            <option value="NETWORKING">Networking Mixers</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">Failed to load events</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : !events || events.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No events found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no events matching your criteria. Check back soon for upcoming campus gatherings.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => {
            const isRegistered = ev.isRegistered;

            return (
              <Card key={ev.id} className="hover:border-purple-200 transition-all flex flex-col justify-between">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px]">
                        {ev.category || 'Event'}
                      </Badge>
                      {ev.isOnline && (
                        <Badge variant="secondary" className="bg-sky-50 text-sky-700 border-sky-200 text-[10px]">
                          Virtual
                        </Badge>
                      )}
                      {isRegistered && (
                        <Badge variant="primary" className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]">
                          Registered
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <Link
                      href={`/alumni/events/${ev.id}`}
                      className="font-bold text-sm text-slate-900 hover:text-purple-600 line-clamp-1 block transition-colors"
                    >
                      {ev.title}
                    </Link>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(ev.startTime).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      {ev.isOnline ? <Video className="w-3.5 h-3.5 text-slate-400" /> : <MapPin className="w-3.5 h-3.5 text-slate-400" />}
                      {ev.isOnline ? 'Online Webinar' : ev.location || 'Campus Auditorium'}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <Link
                      href={`/alumni/events/${ev.id}`}
                      className="text-slate-600 hover:text-purple-600 font-semibold inline-flex items-center gap-0.5"
                    >
                      Details <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    {!isRegistered ? (
                      <Button
                        size="sm"
                        onClick={() => registerMutation.mutate(ev.id)}
                        isLoading={registerMutation.isPending}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                      >
                        Register
                      </Button>
                    ) : (
                      <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                      </span>
                    )}
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
