'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alumniApi } from '@/lib/api/alumni';
import { messagesApi } from '@/lib/api/messages';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  ArrowLeft,
  Building,
  MapPin,
  GraduationCap,
  Briefcase,
  Bookmark,
  BookmarkCheck,
  UserPlus,
  UserCheck,
  Clock,
  MessageSquare,
  Globe,
  Share2,
  Mail,
  Phone,
  AlertCircle,
  Award,
} from 'lucide-react';

export default function AlumniNetworkProfilePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();
  const memberId = params?.id as string;

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['alumniMemberDetail', memberId],
    queryFn: () => alumniApi.getAlumniById(memberId),
    enabled: !!memberId,
  });

  const connectMutation = useMutation({
    mutationFn: () => alumniApi.sendConnectionRequest(memberId),
    onSuccess: () => {
      toastSuccess('Connection request sent!');
      queryClient.invalidateQueries({ queryKey: ['alumniMemberDetail', memberId] });
      queryClient.invalidateQueries({ queryKey: ['alumniConnections'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to send connection request'),
  });

  const saveMutation = useMutation({
    mutationFn: () => alumniApi.saveAlumni(memberId),
    onSuccess: () => {
      toastSuccess('Profile saved to your network shortlist!');
      queryClient.invalidateQueries({ queryKey: ['alumniMemberDetail', memberId] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to save profile'),
  });

  const unsaveMutation = useMutation({
    mutationFn: () => alumniApi.unsaveAlumni(memberId),
    onSuccess: () => {
      toastSuccess('Profile removed from shortlist.');
      queryClient.invalidateQueries({ queryKey: ['alumniMemberDetail', memberId] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to remove profile'),
  });

  const startChatMutation = useMutation({
    mutationFn: () => messagesApi.createConversation(memberId),
    onSuccess: (conv) => {
      router.push(`/alumni/messages/${conv.id}`);
    },
    onError: (err: any) => toastError(err.message || 'Failed to open message conversation'),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="text-center py-12 space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">Alumni Profile Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested member profile could not be located in the network registry.
        </p>
        <Button variant="outline" size="sm" onClick={() => router.push('/alumni/network')}>
          Back to Directory
        </Button>
      </div>
    );
  }

  const isSaved = profile.isSaved;
  const status = profile.connectionStatus;
  const isSelf = profile.isSelf;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        href="/alumni/network"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Directory
      </Link>

      {/* Main Profile Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" className="bg-purple-100 text-purple-800 border-purple-300 text-[10px]">
                  Verified Alumnus
                </Badge>
                {profile.willingToMentor && (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    Open to Mentoring
                  </Badge>
                )}
                {profile.willingToRefer && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                    Offers Job Referrals
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {profile.fullName}
              </h1>
              <p className="text-sm font-semibold text-purple-700">{profile.headline || profile.designation}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <Building className="w-4 h-4 text-slate-400" />
                  {profile.company} ({profile.industry})
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  Class of {profile.graduationYear} • {profile.degree}
                </span>
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {profile.location}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            {!isSelf && (
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => (isSaved ? unsaveMutation.mutate() : saveMutation.mutate())}
                  className={`p-2 rounded-lg border transition-colors ${
                    isSaved
                      ? 'bg-purple-50 text-purple-700 border-purple-300'
                      : 'bg-white border-slate-200 text-slate-400 hover:text-purple-600'
                  }`}
                  title={isSaved ? 'Remove from saved' : 'Save profile'}
                >
                  {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>

                {status === 'ACCEPTED' ? (
                  <Button
                    size="sm"
                    onClick={() => startChatMutation.mutate()}
                    isLoading={startChatMutation.isPending}
                    className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Send Message
                  </Button>
                ) : status === 'PENDING' ? (
                  <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-800 border-amber-300 gap-1 py-1.5 px-3">
                    <Clock className="w-3.5 h-3.5" /> Request Pending
                  </Badge>
                ) : status === 'RECEIVED' ? (
                  <Link href="/alumni/connections">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                      Respond to Request
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => connectMutation.mutate()}
                    isLoading={connectMutation.isPending}
                    className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Connect
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Biography</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Skills & Experience */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Industry Experience
              </h3>
              <p className="text-xs text-slate-700">
                <strong>{profile.yearsOfExperience}</strong> years in {profile.industry} as {profile.designation}.
              </p>
              {profile.institution && (
                <p className="text-xs text-slate-500 mt-1">Alma Mater: {profile.institution}</p>
              )}
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Core Competencies & Skills
              </h3>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-slate-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No specific skills listed.</p>
              )}
            </div>
          </div>

          {/* Contact Details (Respecting privacy settings) */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Contact & Links</h3>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
              {profile.email && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {profile.email}
                </span>
              )}
              {profile.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {profile.phone}
                </span>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-purple-600 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Website
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
