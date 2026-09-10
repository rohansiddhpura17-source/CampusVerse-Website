'use client';

import React, { useState } from 'react';
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
  Users,
  ArrowLeft,
  Building,
  UserCheck,
  CheckCircle,
  XCircle,
  MessageSquare,
  Trash2,
  Share2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function AlumniConnectionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PENDING'>('ACTIVE');

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['alumniConnections'],
    queryFn: () => alumniApi.getConnections(),
  });

  const respondMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACCEPTED' | 'DECLINED' }) =>
      alumniApi.respondToConnection(id, status),
    onSuccess: (_, vars) => {
      toastSuccess(`Connection request ${vars.status === 'ACCEPTED' ? 'accepted' : 'declined'}.`);
      queryClient.invalidateQueries({ queryKey: ['alumniConnections'] });
      queryClient.invalidateQueries({ queryKey: ['alumniDirectoryList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to respond to connection request'),
  });

  const deleteMutation = useMutation({
    mutationFn: (connectionId: string) => alumniApi.deleteConnection(connectionId),
    onSuccess: () => {
      toastSuccess('Connection removed.');
      queryClient.invalidateQueries({ queryKey: ['alumniConnections'] });
      queryClient.invalidateQueries({ queryKey: ['alumniDirectoryList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to remove connection'),
  });

  const startChatMutation = useMutation({
    mutationFn: (userId: string) => messagesApi.createConversation(userId),
    onSuccess: (conv) => router.push(`/alumni/messages/${conv.id}`),
    onError: (err: any) => toastError(err.message || 'Failed to open message conversation'),
  });

  const activeConnections = data?.connections || [];
  const pendingRequests = data?.pendingRequests || [];

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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Connections</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your network relationships and pending campus invitations.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'ACTIVE' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Connections ({activeConnections.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'PENDING' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Invitations ({pendingRequests.length})
          </button>
        </div>
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
            <p className="text-xs font-semibold text-slate-800">Failed to load connections</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : activeTab === 'ACTIVE' ? (
        activeConnections.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center space-y-3">
              <Share2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No active connections</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven&apos;t established any connections yet. Search the alumni directory to expand your network.
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
            {activeConnections.map((conn) => (
              <Card key={conn.connectionId} className="hover:border-purple-200 transition-colors">
                <CardContent className="p-4 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/alumni/network/${conn.userId}`}
                        className="font-bold text-sm text-slate-900 hover:text-purple-600 line-clamp-1 transition-colors"
                      >
                        {conn.fullName}
                      </Link>
                      <p className="text-xs text-purple-700 font-semibold line-clamp-1 mt-0.5">
                        {conn.headline || conn.designation || 'Alumni Member'}
                      </p>
                      {conn.company && (
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          {conn.company}
                        </p>
                      )}
                    </div>

                    <Badge variant="primary" className="text-[10px] bg-emerald-100 text-emerald-800 border-emerald-300 shrink-0">
                      Connected
                    </Badge>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <Button
                      size="sm"
                      onClick={() => startChatMutation.mutate(conn.userId)}
                      isLoading={startChatMutation.isPending}
                      className="text-xs gap-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Message
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMutation.mutate(conn.connectionId)}
                      isLoading={deleteMutation.isPending}
                      className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200 gap-1"
                      title="Remove Connection"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : pendingRequests.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No pending invitations</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You do not have any pending connection requests waiting for approval.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((req) => (
            <Card key={req.connectionId} className="hover:border-purple-200 transition-colors">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <Link
                    href={`/alumni/network/${req.userId}`}
                    className="font-bold text-sm text-slate-900 hover:text-purple-600"
                  >
                    {req.fullName}
                  </Link>
                  <p className="text-xs text-purple-700 font-semibold">{req.headline || req.designation || 'Campus Member'}</p>
                  {req.company && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-slate-400" />
                      {req.company}
                    </p>
                  )}
                  {req.requestedAt && (
                    <p className="text-[10px] text-slate-400 mt-1">
                      Received {new Date(req.requestedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Button
                    size="sm"
                    onClick={() => respondMutation.mutate({ id: req.connectionId, status: 'ACCEPTED' })}
                    isLoading={respondMutation.isPending}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => respondMutation.mutate({ id: req.connectionId, status: 'DECLINED' })}
                    isLoading={respondMutation.isPending}
                    className="text-rose-600 hover:bg-rose-50 border-rose-200 text-xs gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Decline
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
