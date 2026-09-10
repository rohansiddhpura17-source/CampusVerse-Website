'use client';

import React from 'react';
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
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
} from 'lucide-react';

export default function AlumniMentorshipRequestsPage() {
  const {
    data: sessions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['alumniMentorshipSessions'],
    queryFn: () => mentorshipApi.getMentorshipSessions(),
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mentorship Requests & Status</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your accepted mentorship engagements and scheduled sessions.
          </p>
        </div>

        <Link href="/alumni/mentorship/sessions">
          <Button size="sm" variant="outline" className="text-xs gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-600" /> View Scheduled Sessions
          </Button>
        </Link>
      </div>

      {/* Backend Capability Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 space-y-1">
          <p className="font-bold">Backend Specification Note</p>
          <p>
            <code className="font-semibold text-amber-900">BACKEND CAPABILITY NOT AVAILABLE</code>: A dedicated unreviewed requests query endpoint (<code className="text-amber-900">GET /mentorship/requests</code>) is not implemented in the backend API.
          </p>
          <p className="text-amber-700">
            Per the CampusVerse architecture, incoming requests that have been accepted are automatically transitioned into confirmed <code className="text-amber-900">MentorshipSession</code> records shown below.
          </p>
        </div>
      </div>

      {/* Sessions / Engagements List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Active Mentorship Engagements ({sessions?.length ?? 0})</h2>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : !sessions || sessions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-10 text-center space-y-3">
              <UserCheck className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">No mentorship engagements found</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Explore the mentor directory or accept mentorship requests to start scheduling sessions.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {sessions.map((sess) => (
              <Card key={sess.id} className="hover:border-purple-200 transition-colors">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant={sess.status === 'SCHEDULED' ? 'primary' : 'outline'} className="text-[10px]">
                        {sess.status}
                      </Badge>
                      <span className="text-slate-400">
                        {new Date(sess.scheduledAt).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">
                      {sess.request?.goal || sess.notes || 'Mentorship Engagement'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-slate-600 pt-0.5">
                      {sess.request?.mentee && (
                        <span>Mentee: <strong>{sess.request.mentee.profile?.fullName || sess.request.mentee.email}</strong></span>
                      )}
                      {sess.request?.mentor && (
                        <span>Mentor: <strong>{sess.request.mentor.user?.profile?.fullName || sess.request.mentor.title}</strong></span>
                      )}
                      <span>Duration: {sess.durationMinutes} minutes</span>
                    </div>
                  </div>

                  <Link href={`/alumni/mentorship/sessions/${sess.id}`}>
                    <Button size="sm" variant="outline" className="text-xs">
                      Session Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
