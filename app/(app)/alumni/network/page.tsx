'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alumniApi } from '@/lib/api/alumni';
import { AlumniProfile } from '@/types/alumni';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  Search,
  Building,
  MapPin,
  GraduationCap,
  Bookmark,
  BookmarkCheck,
  UserPlus,
  UserCheck,
  Clock,
  ArrowUpRight,
  Share2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function AlumniNetworkPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [graduationYear, setGraduationYear] = useState<number | undefined>(undefined);

  const {
    data: alumniList,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['alumniDirectoryList', search, company, industry, graduationYear],
    queryFn: () =>
      alumniApi.getAlumni({
        search: search || undefined,
        company: company || undefined,
        industry: industry || undefined,
        graduationYear: graduationYear || undefined,
      }),
  });

  const connectMutation = useMutation({
    mutationFn: (userId: string) => alumniApi.sendConnectionRequest(userId),
    onSuccess: () => {
      toastSuccess('Connection request sent!');
      queryClient.invalidateQueries({ queryKey: ['alumniDirectoryList'] });
      queryClient.invalidateQueries({ queryKey: ['alumniConnections'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to send connection request'),
  });

  const saveMutation = useMutation({
    mutationFn: (userId: string) => alumniApi.saveAlumni(userId),
    onSuccess: () => {
      toastSuccess('Profile saved to your network shortlist!');
      queryClient.invalidateQueries({ queryKey: ['alumniDirectoryList'] });
      queryClient.invalidateQueries({ queryKey: ['alumniSavedList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to save profile'),
  });

  const unsaveMutation = useMutation({
    mutationFn: (userId: string) => alumniApi.unsaveAlumni(userId),
    onSuccess: () => {
      toastSuccess('Profile removed from shortlist.');
      queryClient.invalidateQueries({ queryKey: ['alumniDirectoryList'] });
      queryClient.invalidateQueries({ queryKey: ['alumniSavedList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to remove profile'),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Alumni Network Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Search and connect with verified graduates, entrepreneurs, and industry specialists.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Link href="/alumni/connections">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-purple-600" /> My Connections
            </Button>
          </Link>
          <Link href="/alumni/saved-profiles">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-indigo-600" /> Saved Profiles
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search by member name, headline, location, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div>
          <Input
            placeholder="Filter by company..."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div>
          <Input
            placeholder="Filter by graduation year..."
            type="number"
            value={graduationYear || ''}
            onChange={(e) => setGraduationYear(e.target.value ? parseInt(e.target.value, 10) : undefined)}
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-800">Failed to load alumni directory</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : !alumniList || alumniList.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No alumni profiles found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or clearing filters to view graduates in the network.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {alumniList.map((alumnus) => {
            const isSaved = alumnus.isSaved;
            const status = alumnus.connectionStatus;
            const isSelf = alumnus.isSelf;

            return (
              <Card key={alumnus.userId} className="hover:border-purple-200 transition-all flex flex-col justify-between">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/alumni/network/${alumnus.userId}`}
                        className="font-bold text-sm text-slate-900 hover:text-purple-600 block line-clamp-1 transition-colors"
                      >
                        {alumnus.fullName}
                      </Link>
                      <p className="text-xs text-purple-700 font-semibold line-clamp-1 mt-0.5">
                        {alumnus.designation} @ {alumnus.company}
                      </p>
                    </div>

                    {!isSelf && (
                      <button
                        type="button"
                        onClick={() =>
                          isSaved ? unsaveMutation.mutate(alumnus.userId) : saveMutation.mutate(alumnus.userId)
                        }
                        className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                          isSaved
                            ? 'bg-purple-50 text-purple-700 border-purple-300'
                            : 'bg-white border-slate-200 text-slate-400 hover:text-purple-600'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save profile'}
                      >
                        {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-slate-500">
                    <p className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      Class of {alumnus.graduationYear} • {alumnus.degree}
                    </p>
                    {alumnus.location && (
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {alumnus.location}
                      </p>
                    )}
                  </div>

                  {alumnus.skills && alumnus.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {alumnus.skills.slice(0, 3).map((sk, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] bg-slate-50">
                          {sk}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <Link
                      href={`/alumni/network/${alumnus.userId}`}
                      className="text-slate-600 hover:text-purple-600 font-semibold text-xs inline-flex items-center gap-0.5"
                    >
                      Profile <ArrowUpRight className="w-3 h-3" />
                    </Link>

                    {isSelf ? (
                      <Badge variant="outline" className="text-[10px]">
                        You
                      </Badge>
                    ) : status === 'ACCEPTED' ? (
                      <Badge variant="primary" className="text-[10px] bg-emerald-100 text-emerald-800 border-emerald-300 gap-1">
                        <UserCheck className="w-3 h-3" /> Connected
                      </Badge>
                    ) : status === 'PENDING' ? (
                      <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-800 border-amber-300 gap-1">
                        <Clock className="w-3 h-3" /> Request Sent
                      </Badge>
                    ) : status === 'RECEIVED' ? (
                      <Link href="/alumni/connections">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                          Respond
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => connectMutation.mutate(alumnus.userId)}
                        isLoading={connectMutation.isPending}
                        className="text-xs gap-1 text-purple-700 border-purple-200 hover:bg-purple-50"
                      >
                        <UserPlus className="w-3 h-3" /> Connect
                      </Button>
                    )}
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
