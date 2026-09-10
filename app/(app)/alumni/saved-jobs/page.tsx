'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api/jobs';
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
  ExternalLink,
  Briefcase,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function AlumniSavedJobsPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const {
    data: savedJobs,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['alumniSavedJobs'],
    queryFn: () => jobsApi.getSavedJobs(),
  });

  const unsaveMutation = useMutation({
    mutationFn: (id: string) => jobsApi.unsaveJob(id),
    onSuccess: () => {
      toastSuccess('Job removed from saved list.');
      queryClient.invalidateQueries({ queryKey: ['alumniSavedJobs'] });
      queryClient.invalidateQueries({ queryKey: ['alumniJobsList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to remove job'),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/alumni/careers"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Careers
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Saved Jobs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your shortlisted positions and track upcoming deadlines.
          </p>
        </div>

        <Link href="/alumni/careers">
          <Button size="sm" variant="outline" className="text-xs gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-purple-600" /> Browse More Jobs
          </Button>
        </Link>
      </div>

      {/* Saved Jobs List */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-800">Failed to load saved jobs</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : !savedJobs || savedJobs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No saved jobs</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t bookmarked any opportunities yet. Browse the careers directory and save roles to review them later.
            </p>
            <Link href="/alumni/careers" className="inline-block pt-2">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
                Explore Careers
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {savedJobs.map((job) => (
            <Card key={job.id} className="hover:border-purple-200 transition-colors">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {job.roleType}
                    </Badge>
                    {job.isRemote && (
                      <Badge variant="secondary" className="text-[10px] bg-sky-50 text-sky-700 border-sky-200">
                        Remote
                      </Badge>
                    )}
                  </div>

                  <Link
                    href={`/alumni/jobs/${job.id}`}
                    className="text-base font-bold text-slate-900 hover:text-purple-600 block line-clamp-1 transition-colors"
                  >
                    {job.title}
                  </Link>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {job.companyName || job.company?.name || 'Enterprise'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    {job.salaryRange && (
                      <span className="font-bold text-purple-700">{job.salaryRange}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Link href={`/alumni/jobs/${job.id}`}>
                    <Button size="sm" variant="outline" className="text-xs">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => unsaveMutation.mutate(job.id)}
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
