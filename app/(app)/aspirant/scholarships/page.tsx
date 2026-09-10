'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aspirantApi } from '@/lib/api/aspirant';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Award,
  Search,
  Bookmark,
  BookmarkCheck,
  Calendar,
  DollarSign,
  Globe,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Clock,
  Filter,
} from 'lucide-react';

export default function AspirantScholarshipsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [country, setCountry] = useState('');

  const {
    data: scholarships,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['scholarshipsList', search, category, country],
    queryFn: () =>
      aspirantApi.getScholarships({
        search: search || undefined,
        category: category || undefined,
        country: country || undefined,
      }),
  });

  const saveMutation = useMutation({
    mutationFn: async (id: string) => {
      return aspirantApi.saveScholarship(id);
    },
    onSuccess: () => {
      toastSuccess('Scholarship saved to your list!');
      queryClient.invalidateQueries({ queryKey: ['scholarshipsList'] });
      queryClient.invalidateQueries({ queryKey: ['savedScholarshipsList'] });
      queryClient.invalidateQueries({ queryKey: ['aspirantHomeSummary'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to save scholarship');
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async (id: string) => {
      return aspirantApi.unsaveScholarship(id);
    },
    onSuccess: () => {
      toastSuccess('Scholarship removed from saved list.');
      queryClient.invalidateQueries({ queryKey: ['scholarshipsList'] });
      queryClient.invalidateQueries({ queryKey: ['savedScholarshipsList'] });
      queryClient.invalidateQueries({ queryKey: ['aspirantHomeSummary'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to remove scholarship');
    },
  });

  const isExpired = (deadlineStr?: string) => {
    if (!deadlineStr) return false;
    const d = new Date(deadlineStr);
    return !isNaN(d.getTime()) && d.getTime() < Date.now();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scholarships & Financial Aid</h1>
          <p className="text-xs text-slate-500 mt-1">
            Search merit grants, research fellowships, and institutional aid programs.
          </p>
        </div>

        <Link href="/aspirant/saved-scholarships" className="self-start sm:self-auto">
          <Button variant="outline" className="gap-2 text-xs">
            <BookmarkCheck className="w-4 h-4 text-emerald-600" /> View Saved Scholarships
          </Button>
        </Link>
      </div>

      {/* Filter Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search by scholarship title, provider, or eligibility criteria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All Grant Categories</option>
            <option value="MERIT">Merit Based</option>
            <option value="NEED_BASED">Need Based</option>
            <option value="RESEARCH">Research & Fellowship</option>
            <option value="INTERNATIONAL">International Study</option>
            <option value="DIVERSITY">Diversity & Inclusion</option>
          </select>
        </div>
      </div>

      {/* Scholarships Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">Failed to load scholarships</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Try Again
            </Button>
          </CardContent>
        </Card>
      ) : !scholarships || scholarships.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Award className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No scholarships found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No grant opportunities match your current filter parameters. Try clearing your filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scholarships.map((s) => {
            const isSaved = s.isSaved;
            const expired = isExpired(s.deadline);
            return (
              <Card key={s.id} className="hover:border-amber-200 transition-all flex flex-col justify-between">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary" className="text-[10px]">
                        {s.category || 'General Aid'}
                      </Badge>
                      {expired && (
                        <Badge variant="outline" className="text-[10px] text-rose-600 border-rose-200 bg-rose-50">
                          Closed
                        </Badge>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        isSaved ? unsaveMutation.mutate(s.id) : saveMutation.mutate(s.id)
                      }
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-amber-600'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save scholarship'}
                    >
                      {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div>
                    <Link
                      href={`/aspirant/scholarships/${s.id}`}
                      className="font-bold text-sm text-slate-900 hover:text-amber-600 line-clamp-1 transition-colors"
                    >
                      {s.name}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Provided by {s.provider}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-amber-800/80">Grant Value</p>
                      <p className="font-extrabold text-amber-900 mt-0.5">{s.amount}</p>
                    </div>
                    {s.deadline && (
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Deadline</p>
                        <p className={`font-semibold ${expired ? 'text-rose-600 line-through' : 'text-slate-800'}`}>
                          {new Date(s.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {s.eligibility || s.description || 'Check official guidelines for full eligibility criteria.'}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">{s.country || 'Global Eligibility'}</span>

                    <Link
                      href={`/aspirant/scholarships/${s.id}`}
                      className="font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center"
                    >
                      Details <ExternalLink className="w-3 h-3 ml-0.5" />
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
