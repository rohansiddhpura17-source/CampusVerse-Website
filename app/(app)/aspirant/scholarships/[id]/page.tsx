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
  Award,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Calendar,
  DollarSign,
  Globe,
  ExternalLink,
  CheckCircle2,
  FileText,
  AlertCircle,
  Clock,
} from 'lucide-react';

export default function AspirantScholarshipDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const {
    data: scholarship,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['scholarshipDetail', id],
    queryFn: () => aspirantApi.getScholarshipById(id),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      return aspirantApi.saveScholarship(id);
    },
    onSuccess: () => {
      toastSuccess('Scholarship saved to your list!');
      queryClient.invalidateQueries({ queryKey: ['scholarshipDetail', id] });
      queryClient.invalidateQueries({ queryKey: ['scholarshipsList'] });
      queryClient.invalidateQueries({ queryKey: ['savedScholarshipsList'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to save scholarship');
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async () => {
      return aspirantApi.unsaveScholarship(id);
    },
    onSuccess: () => {
      toastSuccess('Scholarship removed from your saved list.');
      queryClient.invalidateQueries({ queryKey: ['scholarshipDetail', id] });
      queryClient.invalidateQueries({ queryKey: ['scholarshipsList'] });
      queryClient.invalidateQueries({ queryKey: ['savedScholarshipsList'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to remove scholarship');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !scholarship) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardContent className="p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">Scholarship Not Found</h2>
          <p className="text-xs text-slate-500">
            The requested grant or financial aid opportunity could not be found.
          </p>
          <div className="pt-2">
            <Link href="/aspirant/scholarships">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Scholarships
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isSaved = scholarship.isSaved;
  const isExpired = scholarship.deadline
    ? new Date(scholarship.deadline).getTime() < Date.now()
    : false;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/aspirant/scholarships"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Scholarships Directory
      </Link>

      {/* Hero Header */}
      <Card className="border-amber-200">
        <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {scholarship.category || 'General Grant'}
              </Badge>
              {isExpired ? (
                <Badge variant="outline" className="text-xs text-rose-600 border-rose-200 bg-rose-50">
                  Applications Closed
                </Badge>
              ) : (
                <Badge variant="primary" className="text-xs bg-emerald-100 text-emerald-800 border-emerald-300">
                  Applications Open
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{scholarship.name}</h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Offered by {scholarship.provider} • {scholarship.country || 'Global Eligibility'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {scholarship.applicationUrl && (
              <a
                href={scholarship.applicationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Apply on Official Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <Button
              variant={isSaved ? 'outline' : 'secondary'}
              size="sm"
              onClick={() => (isSaved ? unsaveMutation.mutate() : saveMutation.mutate())}
              isLoading={saveMutation.isPending || unsaveMutation.isPending}
              className="gap-1.5"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-emerald-600" /> Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" /> Save Grant
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grant Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span>Funding Amount</span>
          </div>
          <p className="text-xl font-bold text-slate-900">{scholarship.amount}</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Application Deadline</span>
          </div>
          <p className={`text-base font-bold ${isExpired ? 'text-rose-600 line-through' : 'text-slate-900'}`}>
            {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'Rolling Application'}
          </p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Eligible Region</span>
          </div>
          <p className="text-base font-bold text-slate-900 truncate">
            {scholarship.country || 'International / All'}
          </p>
        </Card>
      </div>

      {/* Eligibility Requirements */}
      <Card>
        <CardHeader className="pb-2 border-b border-slate-100">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" /> Eligibility Criteria
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {scholarship.eligibility || 'Refer to the official provider portal for complete candidate criteria.'}
        </CardContent>
      </Card>

      {/* Requirements & Documentation */}
      {scholarship.requirements && scholarship.requirements.length > 0 && (
        <Card>
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Required Application Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            {(scholarship.requirements || []).map((req: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{req}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Description */}
      {scholarship.description && (
        <Card>
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-bold">Program Description & Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {scholarship.description}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
