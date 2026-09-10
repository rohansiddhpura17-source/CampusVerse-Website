'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi } from '@/lib/api/student';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  Search,
  Check,
  Plus,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function StudentCommunityPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const {
    data: communities,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['studentCommunities', search],
    queryFn: () => studentApi.getCommunities(search || undefined),
  });

  const joinMutation = useMutation({
    mutationFn: async (id: string) => {
      return studentApi.joinCommunity(id);
    },
    onSuccess: () => {
      toastSuccess('Joined community successfully!');
      queryClient.invalidateQueries({ queryKey: ['studentCommunities'] });
      queryClient.invalidateQueries({ queryKey: ['communityDetail'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to join community');
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async (id: string) => {
      return studentApi.leaveCommunity(id);
    },
    onSuccess: () => {
      toastSuccess('Left community.');
      queryClient.invalidateQueries({ queryKey: ['studentCommunities'] });
      queryClient.invalidateQueries({ queryKey: ['communityDetail'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to leave community');
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Communities & Clubs</h1>
        <p className="text-xs text-slate-500 mt-1">
          Connect with departmental societies, technical clubs, study groups, and interest communities.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Input
          placeholder="Search communities by name or topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Communities Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">Failed to load communities</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Try Again
            </Button>
          </CardContent>
        </Card>
      ) : !communities || communities.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No communities found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No matching campus communities found.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((comm) => {
            const isMember = comm.isMember;
            return (
              <Card key={comm.id} className="hover:border-brand-200 transition-all flex flex-col justify-between">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                      {comm.name.substring(0, 2).toUpperCase()}
                    </div>
                    {isMember && (
                      <Badge variant="primary" className="text-[10px]">
                        Joined Member
                      </Badge>
                    )}
                  </div>

                  <div>
                    <Link
                      href={`/student/community/${comm.id}`}
                      className="font-bold text-sm text-slate-900 hover:text-brand-600 line-clamp-1 transition-colors"
                    >
                      {comm.name}
                    </Link>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{comm.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> {comm.memberCount || 0}
                      </span>
                      {comm.postsCount !== undefined && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> {comm.postsCount}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/student/community/${comm.id}`}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center"
                      >
                        Enter <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                      </Link>
                      {isMember ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => leaveMutation.mutate(comm.id)}
                          isLoading={leaveMutation.isPending}
                          className="text-xs text-slate-600 hover:text-rose-600"
                        >
                          Leave
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => joinMutation.mutate(comm.id)}
                          isLoading={joinMutation.isPending}
                          className="text-xs"
                        >
                          Join
                        </Button>
                      )}
                    </div>
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
