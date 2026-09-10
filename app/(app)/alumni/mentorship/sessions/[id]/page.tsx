'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mentorshipApi } from '@/lib/api/mentorship';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  UserCheck,
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
} from 'lucide-react';

export default function AlumniMentorshipSessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();
  const sessionId = params?.id as string;

  // Retrieve sessions from backend
  const {
    data: sessions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['alumniMentorshipSessions'],
    queryFn: () => mentorshipApi.getMentorshipSessions(),
  });

  const session = (sessions || []).find((s) => s.id === sessionId);

  const [notes, setNotes] = useState<string>('');
  const [meetingUrl, setMeetingUrl] = useState<string>('');
  const [hasInitializedState, setHasInitializedState] = useState(false);

  // Sync state once session is loaded
  if (session && !hasInitializedState) {
    setNotes(session.notes || '');
    setMeetingUrl(session.meetingUrl || '');
    setHasInitializedState(true);
  }

  const updateMutation = useMutation({
    mutationFn: (data: { status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'; notes?: string; meetingUrl?: string }) =>
      mentorshipApi.updateSession(sessionId, data),
    onSuccess: (updated) => {
      toastSuccess('Mentorship session updated.');
      queryClient.invalidateQueries({ queryKey: ['alumniMentorshipSessions'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to update session'),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="text-center py-12 space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">Session Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested mentorship session could not be located.
        </p>
        <Button variant="outline" size="sm" onClick={() => router.push('/alumni/mentorship/sessions')}>
          Back to Sessions
        </Button>
      </div>
    );
  }

  const isScheduled = session.status === 'SCHEDULED';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/alumni/mentorship/sessions"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Mentorship Sessions
      </Link>

      {/* Main Details Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={isScheduled ? 'primary' : session.status === 'COMPLETED' ? 'secondary' : 'outline'}
                  className="text-[10px]"
                >
                  {session.status}
                </Badge>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {session.durationMinutes} Minutes Duration
                </span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900">
                {session.notes || session.request?.goal || 'Mentorship Session'}
              </h1>

              <div className="space-y-1 text-xs text-slate-600 pt-1">
                <p className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Scheduled for: <strong>{new Date(session.scheduledAt).toLocaleString()}</strong>
                </p>
                {session.request?.mentee && (
                  <p>Mentee: <strong>{session.request.mentee.profile?.fullName || session.request.mentee.email}</strong></p>
                )}
                {session.request?.mentor && (
                  <p>Mentor: <strong>{session.request.mentor.user?.profile?.fullName || session.request.mentor.title}</strong></p>
                )}
              </div>
            </div>

            {/* Quick Status Buttons */}
            {isScheduled && (
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => updateMutation.mutate({ status: 'COMPLETED' })}
                  isLoading={updateMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Mark Completed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateMutation.mutate({ status: 'CANCELLED' })}
                  isLoading={updateMutation.isPending}
                  className="text-rose-600 hover:bg-rose-50 border-rose-200 text-xs gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" /> Cancel Session
                </Button>
              </div>
            )}
          </div>

          {/* Video Call Integration Section */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Video className="w-4 h-4 text-purple-600" /> Video Conferencing
            </h3>

            {session.meetingUrl ? (
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-purple-900">Virtual Meeting Room Ready</p>
                  <p className="text-[11px] text-purple-700 truncate max-w-sm">{session.meetingUrl}</p>
                </div>
                <a
                  href={session.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1">
                    Join Call <ExternalLink className="w-3 h-3" />
                  </Button>
                </a>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">
                  <code className="text-slate-900 font-mono">BACKEND CAPABILITY NOT AVAILABLE</code>: Native WebRTC in-app video calling is not provided by the backend.
                </p>
                <p className="text-[11px] text-slate-500">
                  Please assign a Google Meet, Zoom, or Teams URL below for this session.
                </p>
              </div>
            )}

            {/* Meeting URL Input */}
            <div className="flex gap-2 pt-2">
              <Input
                placeholder="https://meet.google.com/abc-defg-hij"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                className="text-xs"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateMutation.mutate({ meetingUrl: meetingUrl.trim() || undefined })}
                isLoading={updateMutation.isPending}
                className="text-xs shrink-0"
              >
                Save URL
              </Button>
            </div>
          </div>

          {/* Session Notes & Action Items */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Session Agenda & Notes
            </h3>
            <textarea
              rows={4}
              placeholder="Record talking points, code review feedback, or action items..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-none"
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={() => updateMutation.mutate({ notes: notes.trim() })}
                isLoading={updateMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save Notes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
