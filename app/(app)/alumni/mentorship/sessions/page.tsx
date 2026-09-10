'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { mentorshipApi } from '@/lib/api/mentorship';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  UserCheck,
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  CheckCircle,
  XCircle,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  FileText,
} from 'lucide-react';

export default function AlumniMentorshipSessionsPage() {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const {
    data: sessions,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['alumniMentorshipSessions'],
    queryFn: () => mentorshipApi.getMentorshipSessions(),
  });

  const filteredSessions = (sessions || []).filter((s) => {
    if (filterStatus === 'ALL') return true;
    return s.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/alumni/mentorship"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Mentorship Hub
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mentorship Sessions</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your scheduled, completed, and archived mentorship meetings.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start sm:self-auto text-xs">
          {['ALL', 'SCHEDULED', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                filterStatus === st ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Sessions' : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-800">Failed to load mentorship sessions</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : filteredSessions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No sessions found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no {filterStatus !== 'ALL' ? filterStatus.toLowerCase() : ''} mentorship sessions on record.
            </p>
            <Link href="/alumni/mentorship" className="inline-block pt-2">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
                Explore Mentors
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((sess) => {
            const isScheduled = sess.status === 'SCHEDULED';
            const isCompleted = sess.status === 'COMPLETED';
            const isCancelled = sess.status === 'CANCELLED';

            return (
              <Card key={sess.id} className="hover:border-purple-200 transition-colors">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={isScheduled ? 'primary' : isCompleted ? 'secondary' : 'outline'}
                        className="text-[10px]"
                      >
                        {sess.status}
                      </Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {sess.durationMinutes} Minutes
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {sess.notes || sess.request?.goal || 'Mentorship Guidance'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(sess.scheduledAt).toLocaleString()}
                        </span>
                        {sess.request?.mentee && (
                          <span>Mentee: <strong>{sess.request.mentee.profile?.fullName || sess.request.mentee.email}</strong></span>
                        )}
                        {sess.request?.mentor && (
                          <span>Mentor: <strong>{sess.request.mentor.user?.profile?.fullName || sess.request.mentor.title}</strong></span>
                        )}
                      </div>
                    </div>

                    {/* Video Meeting info */}
                    <div className="pt-2 text-xs">
                      {sess.meetingUrl ? (
                        <a
                          href={sess.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-purple-600 hover:underline font-semibold"
                        >
                          <Video className="w-4 h-4 text-purple-600" />
                          Join Scheduled Meeting Room <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">
                          Meeting Link: <code className="text-slate-500 font-mono">BACKEND CAPABILITY NOT AVAILABLE</code> (External video room URL not assigned)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Link href={`/alumni/mentorship/sessions/${sess.id}`}>
                      <Button size="sm" variant="outline" className="text-xs">
                        Manage Session
                      </Button>
                    </Link>
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
