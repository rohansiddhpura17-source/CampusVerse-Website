'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alumniApi } from '@/lib/api/alumni';
import { messagesApi } from '@/lib/api/messages';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bookmark,
  BookmarkX,
  ArrowLeft,
  Building,
  MapPin,
  MessageSquare,
  Users,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function AlumniSavedProfilesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const {
    data: savedAlumni,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['alumniSavedList'],
    queryFn: () => alumniApi.getSavedAlumni(),
  });

  const unsaveMutation = useMutation({
    mutationFn: (userId: string) => alumniApi.unsaveAlumni(userId),
    onSuccess: () => {
      toastSuccess('Profile removed from shortlist.');
      queryClient.invalidateQueries({ queryKey: ['alumniSavedList'] });
      queryClient.invalidateQueries({ queryKey: ['alumniDirectoryList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to remove profile'),
  });

  const startChatMutation = useMutation({
    mutationFn: (userId: string) => messagesApi.createConversation(userId),
    onSuccess: (conv) => router.push(`/alumni/messages/${conv.id}`),
    onError: (err: any) => toastError(err.message || 'Failed to open message conversation'),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/alumni/network"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Directory
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Saved Profiles</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your shortlisted alumni members, potential mentors, and professional contacts.
          </p>
        </div>

        <Link href="/alumni/network">
          <Button size="sm" variant="outline" className="text-xs gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-600" /> Browse Directory
          </Button>
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-800">Failed to load saved profiles</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : !savedAlumni || savedAlumni.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No saved profiles</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t bookmarked any alumni profiles yet. Browse the network directory to save colleagues or mentors.
            </p>
            <Link href="/alumni/network" className="inline-block pt-2">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
                Browse Alumni Directory
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedAlumni.map((alumnus) => (
            <Card key={alumnus.userId} className="hover:border-purple-200 transition-colors">
              <CardContent className="p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <Link
                    href={`/alumni/network/${alumnus.userId}`}
                    className="font-bold text-sm text-slate-900 hover:text-purple-600 line-clamp-1 block transition-colors"
                  >
                    {alumnus.fullName}
                  </Link>
                  <p className="text-xs text-purple-700 font-semibold line-clamp-1">
                    {alumnus.designation} @ {alumnus.company}
                  </p>
                  {alumnus.location && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {alumnus.location}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Link href={`/alumni/network/${alumnus.userId}`}>
                      <Button size="sm" variant="outline" className="text-xs">
                        View Profile
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      onClick={() => startChatMutation.mutate(alumnus.userId)}
                      isLoading={startChatMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1"
                    >
                      <MessageSquare className="w-3 h-3" /> Message
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => unsaveMutation.mutate(alumnus.userId)}
                    isLoading={unsaveMutation.isPending}
                    className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                    title="Remove from saved"
                  >
                    <BookmarkX className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
