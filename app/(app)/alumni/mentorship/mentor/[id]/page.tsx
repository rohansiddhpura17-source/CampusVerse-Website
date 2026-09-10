'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mentorshipApi } from '@/lib/api/mentorship';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Modal } from '@/components/ui/modal';
import {
  UserCheck,
  ArrowLeft,
  Building,
  Star,
  DollarSign,
  Calendar,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
} from 'lucide-react';

export default function AlumniMentorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const mentorId = params?.id as string;

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [goal, setGoal] = useState('');
  const [message, setMessage] = useState('');

  const {
    data: mentor,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['alumniMentorDetail', mentorId],
    queryFn: () => mentorshipApi.getMentorById(mentorId),
    enabled: !!mentorId,
  });

  const requestMutation = useMutation({
    mutationFn: () =>
      mentorshipApi.requestMentorship({
        mentorId,
        goal: goal.trim(),
        message: message.trim(),
      }),
    onSuccess: () => {
      toastSuccess('Mentorship request sent successfully!');
      setRequestModalOpen(false);
      setGoal('');
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['alumniMentorshipSessions'] });
      router.push('/alumni/mentorship/requests');
    },
    onError: (err: any) => toastError(err.message || 'Failed to submit mentorship request'),
  });

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || !message.trim()) {
      toastError('Please complete all required fields.');
      return;
    }
    requestMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !mentor) {
    return (
      <div className="text-center py-12 space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">Mentor Profile Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested mentor profile could not be located.
        </p>
        <Button variant="outline" size="sm" onClick={() => router.push('/alumni/mentorship')}>
          Back to Mentorship Hub
        </Button>
      </div>
    );
  }

  const name = mentor.user?.profile?.fullName || mentor.fullName || 'Campus Mentor';
  const headline = mentor.user?.profile?.headline || mentor.title;
  const isSelf = mentor.userId === user?.id;
  const expertiseList = Array.isArray(mentor.expertise)
    ? mentor.expertise
    : typeof mentor.expertise === 'string'
    ? mentor.expertise.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back Link */}
      <Link
        href="/alumni/mentorship"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Mentorship Hub
      </Link>

      {/* Main Mentor Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={mentor.isAcceptingMentees ? 'primary' : 'outline'} className="text-[10px]">
                  {mentor.isAcceptingMentees ? 'Accepting Mentees' : 'Currently Unavailable'}
                </Badge>
                <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {mentor.rating.toFixed(1)} ({mentor.reviewsCount} reviews)
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{name}</h1>
              <p className="text-sm text-purple-700 font-semibold">{headline}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <Building className="w-4 h-4 text-slate-400" />
                  {mentor.company}
                </span>
                <span className="flex items-center gap-1 font-bold text-slate-800">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {mentor.hourlyRate === 0 ? 'Complimentary Mentoring' : `₹${mentor.hourlyRate} / Session`}
                </span>
              </div>
            </div>

            {/* Action */}
            <div className="shrink-0 self-start sm:self-center">
              {!isSelf && mentor.isAcceptingMentees ? (
                <Button
                  onClick={() => setRequestModalOpen(true)}
                  className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Request Mentorship
                </Button>
              ) : isSelf ? (
                <Badge variant="outline" className="text-xs">
                  Your Mentor Profile
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-slate-400">
                  Not Accepting Requests
                </Badge>
              )}
            </div>
          </div>

          {/* Bio */}
          {mentor.bio && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">About & Background</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {mentor.bio}
              </p>
            </div>
          )}

          {/* Expertise */}
          {expertiseList.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Domain Expertise</h3>
              <div className="flex flex-wrap gap-1.5">
                {expertiseList.map((exp, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                    {exp}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Modal */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title={`Request Mentorship with ${name}`}
      >
        <form onSubmit={handleRequestSubmit} className="space-y-4">
          <Input
            label="Primary Goal / Objective"
            placeholder="e.g. System design guidance, career transition, resume review"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            helperText="What specific area would you like to focus on during your sessions?"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Personal Note & Expectations
            </label>
            <textarea
              rows={4}
              placeholder="Introduce yourself and explain why you would value this mentor's guidance..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRequestModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={requestMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
