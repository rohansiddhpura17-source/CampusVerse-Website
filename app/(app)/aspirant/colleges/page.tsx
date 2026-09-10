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
  Compass,
  Search,
  Bookmark,
  BookmarkCheck,
  Scale,
  MapPin,
  GraduationCap,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

export default function AspirantCollegesPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [sortBy, setSortBy] = useState('ranking');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const {
    data: colleges,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['collegesList', search, country, sortBy],
    queryFn: () =>
      aspirantApi.getColleges({
        search: search || undefined,
        country: country || undefined,
        sortBy: sortBy === 'ranking' ? undefined : sortBy,
      }),
  });

  const saveMutation = useMutation({
    mutationFn: async (id: string) => {
      return aspirantApi.saveCollege(id);
    },
    onSuccess: () => {
      toastSuccess('College saved to your shortlist!');
      queryClient.invalidateQueries({ queryKey: ['collegesList'] });
      queryClient.invalidateQueries({ queryKey: ['aspirantHomeSummary'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to save college');
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async (id: string) => {
      return aspirantApi.unsaveCollege(id);
    },
    onSuccess: () => {
      toastSuccess('College removed from shortlist.');
      queryClient.invalidateQueries({ queryKey: ['collegesList'] });
      queryClient.invalidateQueries({ queryKey: ['aspirantHomeSummary'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to remove college');
    },
  });

  const toggleCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((cId) => cId !== id));
    } else {
      if (selectedForCompare.length >= 4) {
        toastError('You can compare a maximum of 4 colleges at a time.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">University & College Explorer</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified institutions, inspect program curriculums, and compare acceptance metrics.
          </p>
        </div>

        {/* Floating Compare Launcher if 2+ selected */}
        {selectedForCompare.length >= 2 && (
          <Link
            href={`/aspirant/compare?ids=${selectedForCompare.join(',')}`}
            className="self-start sm:self-auto"
          >
            <Button className="bg-sky-600 hover:bg-sky-700 text-white gap-2 shadow-xs">
              <Scale className="w-4 h-4" /> Compare Selected ({selectedForCompare.length})
            </Button>
          </Link>
        )}
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search colleges by name, city, or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
          >
            <option value="ranking">Sort by National Rank</option>
            <option value="acceptance">Sort by Acceptance Rate</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Colleges Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">Failed to load institutions</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Try Again
            </Button>
          </CardContent>
        </Card>
      ) : !colleges || colleges.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Compass className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No institutions found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or filters to view available universities.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colleges.map((col) => {
            const isSaved = col.isSaved;
            const isSelectedForCompare = selectedForCompare.includes(col.id);
            return (
              <Card key={col.id} className="hover:border-emerald-200 transition-all flex flex-col justify-between">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700">
                      Rank #{col.ranking || 'N/A'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleCompare(col.id)}
                        className={`p-1.5 rounded-lg border text-[11px] font-medium transition-colors ${
                          isSelectedForCompare
                            ? 'bg-sky-50 text-sky-700 border-sky-300 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                        title="Add to comparison table"
                      >
                        <Scale className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          isSaved ? unsaveMutation.mutate(col.id) : saveMutation.mutate(col.id)
                        }
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isSaved
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-white border-slate-200 text-slate-400 hover:text-emerald-600'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save college'}
                      >
                        {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Link
                      href={`/aspirant/colleges/${col.id}`}
                      className="font-bold text-sm text-slate-900 hover:text-emerald-600 line-clamp-1 transition-colors"
                    >
                      {col.name}
                    </Link>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{col.city ? `${col.city}, ` : ''}{col.state ? `${col.state}, ` : ''}{col.country}</span>
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Acceptance</p>
                      <p className="font-bold text-slate-800">{col.acceptanceRate}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Average Fees</p>
                      <p className="font-bold text-slate-800 truncate">{col.averageFees}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      {col.programsCount || (col.programs ? col.programs.length : 0)} Programs
                    </span>

                    <Link
                      href={`/aspirant/colleges/${col.id}`}
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
