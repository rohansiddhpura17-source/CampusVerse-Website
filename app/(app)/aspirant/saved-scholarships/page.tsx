'use client';

import React from 'react';
import Link from 'next/link';
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
  Trash2,
  Calendar,
  DollarSign,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Clock,
} from 'lucide-react';

export default function AspirantSavedScholarshipsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const {
    data: savedScholarships,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['savedScholarshipsList'],
    queryFn: () => aspirantApi.getSavedScholarships(),
  });

  const unsaveMutation = useMutation({
    mutationFn: async (id: string) => {
      return aspirantApi.unsaveScholarship(id);
    },
    onSuccess: () => {
      toastSuccess('Scholarship removed from saved list.');
      queryClient.invalidateQueries({ queryKey: ['savedScholarshipsList'] });
      queryClient.invalidateQueries({ queryKey: ['scholarshipsList'] });
      queryClient.invalidateQueries({ queryKey: ['aspirantHomeSummary'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to remove scholarship');
    },
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Saved Scholarships</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track grant deadlines, required documentation, and application portals for your shortlisted funding awards.
          </p>
        </div>

        <Link href="/aspirant/scholarships" className="self-start sm:self-auto">
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Scholarships
          </Button>
        </Link>
      </div>

      {/* Saved Scholarships List */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">Failed to load saved scholarships</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : !savedScholarships || savedScholarships.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No scholarships saved yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t bookmarked any scholarships. Browse the catalog and save grants to track upcoming deadlines.
            </p>
            <div className="pt-2">
              <Link href="/aspirant/scholarships">
                <Button size="sm">Explore Scholarships &rarr;</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedScholarships.map((s) => (
            <Card key={s.id} className="hover:border-amber-200 transition-all flex flex-col justify-between">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {s.category || 'General Grant'}
                  </Badge>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => unsaveMutation.mutate(s.id)}
                    isLoading={unsaveMutation.isPending}
                    className="text-slate-400 hover:text-rose-600 h-7 w-7 p-0"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <Link
                    href={`/aspirant/scholarships/${s.id}`}
                    className="font-bold text-sm text-slate-900 hover:text-amber-600 line-clamp-1 transition-colors"
                  >
                    {s.name}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">By {s.provider}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-amber-800/80">Grant Value</p>
                    <p className="font-extrabold text-amber-900 mt-0.5">{s.amount}</p>
                  </div>
                  {s.deadline && (
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Deadline</p>
                      <p className="font-semibold text-slate-800">
                        {new Date(s.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">{s.country || 'Global'}</span>
                  <Link
                    href={`/aspirant/scholarships/${s.id}`}
                    className="font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center"
                  >
                    View Details <ExternalLink className="w-3 h-3 ml-0.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
