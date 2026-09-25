'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aspirantApi } from '@/lib/api/aspirant';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Compass,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Scale,
  MapPin,
  GraduationCap,
  Globe,
  Building,
  DollarSign,
  Percent,
  Calendar,
  AlertCircle,
  RefreshCw,
  Award,
} from 'lucide-react';

export default function AspirantCollegeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const {
    data: college,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['collegeDetail', id],
    queryFn: () => aspirantApi.getCollegeById(id),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      return aspirantApi.saveCollege(id);
    },
    onSuccess: () => {
      toastSuccess('College added to your shortlist!');
      queryClient.invalidateQueries({ queryKey: ['collegeDetail', id] });
      queryClient.invalidateQueries({ queryKey: ['collegesList'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to save college');
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async () => {
      return aspirantApi.unsaveCollege(id);
    },
    onSuccess: () => {
      toastSuccess('College removed from shortlist.');
      queryClient.invalidateQueries({ queryKey: ['collegeDetail', id] });
      queryClient.invalidateQueries({ queryKey: ['collegesList'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to remove college');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !college) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">Institution Not Found</h2>
          <p className="text-xs text-slate-500">
            The requested college record could not be located in the database catalog.
          </p>
          <div className="pt-2">
            <Link href="/aspirant/colleges">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Colleges
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isSaved = college.isSaved;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link
        href="/aspirant/colleges"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to College Explorer
      </Link>

      {/* College Header Banner */}
      <Card>
        <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                National Ranking #{college.ranking || 'N/A'}
              </span>
              <span className="font-mono text-xs text-slate-500 px-2 py-0.5 rounded bg-slate-100">
                Code: {college.code}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{college.name}</h1>

            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>
                {college.city ? `${college.city}, ` : ''}
                {college.state ? `${college.state}, ` : ''}
                {college.country}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {college.websiteUrl && (
              <a
                href={college.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Globe className="w-3.5 h-3.5" /> Official Website
              </a>
            )}

            <Button
              variant={isSaved ? 'outline' : 'primary'}
              size="sm"
              onClick={() => (isSaved ? unsaveMutation.mutate() : saveMutation.mutate())}
              isLoading={saveMutation.isPending || unsaveMutation.isPending}
              className="gap-1.5"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" /> Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" /> Save College
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Core Institutional Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Percent className="w-4 h-4 text-emerald-600" />
            <span>Acceptance Rate</span>
          </div>
          <p className="text-xl font-bold text-slate-900">{college.acceptanceRate}%</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span>Average Fees</span>
          </div>
          <p className="text-xl font-bold text-slate-900 truncate">{college.averageFees}</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Campus Size</span>
          </div>
          <p className="text-xl font-bold text-slate-900 truncate">{college.campusSize || 'N/A'}</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>Active Programs</span>
          </div>
          <p className="text-xl font-bold text-slate-900">{college.programs?.length || 0}</p>
        </Card>
      </div>

      {/* Overview */}
      {college.overview && (
        <Card>
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-bold">Institutional Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {college.overview}
          </CardContent>
        </Card>
      )}

      {/* Academic Programs Catalog */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">Academic Degree Programs</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Programs offered by {college.name} verified in the database</p>
          </div>
          <Badge variant="outline">{college.programs?.length || 0} Listed</Badge>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-slate-100">
          {!college.programs || college.programs.length === 0 ? (
            <p className="p-6 text-xs text-slate-500 text-center">No program details recorded.</p>
          ) : (
            college.programs.map((prog: any) => (
              <div key={prog.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{prog.name}</h4>
                    <Badge variant="primary" className="text-[10px]">
                      {prog.degree}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Major: {prog.major} • Duration: {prog.durationYears} Years
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs self-start sm:self-auto">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Tuition</p>
                    <p className="font-bold text-slate-800">{prog.tuitionFee}</p>
                  </div>
                  {prog.minGpa && (
                    <div className="text-right pl-3 border-l border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Min GPA</p>
                      <p className="font-bold text-emerald-600">{prog.minGpa}</p>
                    </div>
                  )}
                  {prog.deadline && (
                    <div className="text-right pl-3 border-l border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Deadline</p>
                      <p className="font-semibold text-slate-700">{prog.deadline}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
