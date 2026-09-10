'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { useToast } from '@/components/ui/toast';
import { DestructiveActionModal } from '@/components/admin/destructive-modal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShieldAlert,
  ShoppingBag,
  Calendar,
  Briefcase,
  UserCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export default function AdminModerationPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<'MARKETPLACE' | 'EVENTS' | 'JOBS' | 'MENTORSHIP'>('MARKETPLACE');

  // Destructive removal modal
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    type: 'MARKETPLACE' | 'EVENTS' | 'JOBS';
    name: string;
  } | null>(null);

  // Queries for each resource
  const { data: marketplaceItems, isLoading: loadingMarketplace } = useQuery({
    queryKey: ['adminMarketplaceList'],
    queryFn: () => adminApi.getMarketplaceListings({ limit: 50 }),
  });

  const { data: events, isLoading: loadingEvents } = useQuery({
    queryKey: ['adminEventsList'],
    queryFn: () => adminApi.getEvents({ limit: 50 }),
  });

  const { data: jobs, isLoading: loadingJobs } = useQuery({
    queryKey: ['adminJobsList'],
    queryFn: () => adminApi.getJobs({ limit: 50 }),
  });

  const { data: mentors, isLoading: loadingMentors } = useQuery({
    queryKey: ['adminMentorshipList'],
    queryFn: () => adminApi.getMentorship(),
  });

  // Mutations
  const marketplaceMutation = useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: any; reason?: string }) =>
      adminApi.moderateMarketplace(id, action, reason),
    onSuccess: (data, vars) => {
      toastSuccess(`Marketplace listing ${vars.action.toLowerCase()}d successfully.`);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['adminMarketplaceList'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardMetrics'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to moderate marketplace listing.'),
  });

  const eventMutation = useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: any; reason?: string }) =>
      adminApi.moderateEvent(id, action, reason),
    onSuccess: (data, vars) => {
      toastSuccess(`Event ${vars.action.toLowerCase()}d successfully.`);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['adminEventsList'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardMetrics'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to moderate event.'),
  });

  const jobMutation = useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: any; reason?: string }) =>
      adminApi.moderateJob(id, action, reason),
    onSuccess: (data, vars) => {
      toastSuccess(`Job posting ${vars.action.toLowerCase()}d successfully.`);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['adminJobsList'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardMetrics'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to moderate job opportunity.'),
  });

  const mentorMutation = useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: any; reason?: string }) =>
      adminApi.moderateMentor(id, action, reason),
    onSuccess: (data, vars) => {
      toastSuccess(`Mentor status updated to ${vars.action}.`);
      queryClient.invalidateQueries({ queryKey: ['adminMentorshipList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to update mentor status.'),
  });

  const handleExecuteDestructiveAction = (reason?: string) => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'MARKETPLACE') {
      marketplaceMutation.mutate({ id: deleteTarget.id, action: 'REMOVE', reason });
    } else if (deleteTarget.type === 'EVENTS') {
      eventMutation.mutate({ id: deleteTarget.id, action: 'REMOVE', reason });
    } else if (deleteTarget.type === 'JOBS') {
      jobMutation.mutate({ id: deleteTarget.id, action: 'REMOVE', reason });
    }
  };

  const isPendingDestructive =
    marketplaceMutation.isPending || eventMutation.isPending || jobMutation.isPending;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Content Moderation Operations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate, approve, or permanently purge flagged marketplace goods, campus gatherings, career vacancies, and mentors.
          </p>
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        {[
          { id: 'MARKETPLACE', label: 'Marketplace Goods', icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'EVENTS', label: 'Campus Gatherings', icon: <Calendar className="w-4 h-4" /> },
          { id: 'JOBS', label: 'Career Vacancies', icon: <Briefcase className="w-4 h-4" /> },
          { id: 'MENTORSHIP', label: 'Mentor Profiles', icon: <UserCheck className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Marketplace */}
      {activeTab === 'MARKETPLACE' && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Marketplace Item Moderation</CardTitle>
            <Link href="/admin/marketplace" className="text-xs text-blue-600 font-semibold hover:underline">
              Open Full Marketplace &rarr;
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loadingMarketplace ? (
              <div className="p-6 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : !marketplaceItems || marketplaceItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No marketplace listings to moderate.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-2.5 px-4">Item & Description</th>
                      <th className="py-2.5 px-4">Price</th>
                      <th className="py-2.5 px-4">Seller</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {marketplaceItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4">
                          <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">₹{item.price}</td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {item.seller?.profile?.fullName || item.seller?.email || 'Seller'}
                        </td>
                        <td className="py-2.5 px-4">
                          <Badge variant="outline" className="text-[10px] font-mono">{item.status}</Badge>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => marketplaceMutation.mutate({ id: item.id, action: 'APPROVE' })}
                              isLoading={marketplaceMutation.isPending}
                              className="h-7 px-2 text-[11px] text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setDeleteTarget({
                                  id: item.id,
                                  type: 'MARKETPLACE',
                                  name: item.title,
                                })
                              }
                              className="h-7 px-2 text-[11px] text-rose-600 hover:bg-rose-50 border-rose-200"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab: Events */}
      {activeTab === 'EVENTS' && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Campus Event Moderation</CardTitle>
            <Link href="/admin/events" className="text-xs text-blue-600 font-semibold hover:underline">
              Open Full Events &rarr;
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loadingEvents ? (
              <div className="p-6 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : !events || events.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No campus events to moderate.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-2.5 px-4">Event Title</th>
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4">Organizer</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {events.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4">
                          <p className="font-bold text-slate-900 line-clamp-1">{ev.title}</p>
                          <p className="text-[11px] text-slate-500">{new Date(ev.startTime).toLocaleDateString()}</p>
                        </td>
                        <td className="py-2.5 px-4">
                          <Badge variant="outline" className="text-[10px]">{ev.category}</Badge>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {ev.organizer?.profile?.fullName || ev.organizer?.email || 'Organizer'}
                        </td>
                        <td className="py-2.5 px-4">
                          <Badge variant="outline" className="text-[10px] font-mono">{ev.status}</Badge>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => eventMutation.mutate({ id: ev.id, action: 'APPROVE' })}
                              isLoading={eventMutation.isPending}
                              className="h-7 px-2 text-[11px] text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setDeleteTarget({
                                  id: ev.id,
                                  type: 'EVENTS',
                                  name: ev.title,
                                })
                              }
                              className="h-7 px-2 text-[11px] text-rose-600 hover:bg-rose-50 border-rose-200"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab: Jobs */}
      {activeTab === 'JOBS' && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Job Opportunity Moderation</CardTitle>
            <Link href="/admin/jobs" className="text-xs text-blue-600 font-semibold hover:underline">
              Open Full Jobs &rarr;
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loadingJobs ? (
              <div className="p-6 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : !jobs || jobs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No job opportunities to moderate.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-2.5 px-4">Position & Company</th>
                      <th className="py-2.5 px-4">Role Type</th>
                      <th className="py-2.5 px-4">Posted By</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobs.map((jb) => (
                      <tr key={jb.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4">
                          <p className="font-bold text-slate-900 line-clamp-1">{jb.title}</p>
                          <p className="text-[11px] text-slate-500">{jb.company?.name || 'Company'}</p>
                        </td>
                        <td className="py-2.5 px-4">
                          <Badge variant="outline" className="text-[10px]">{jb.roleType}</Badge>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {jb.poster?.profile?.fullName || jb.poster?.email || 'Poster'}
                        </td>
                        <td className="py-2.5 px-4">
                          <Badge variant="outline" className="text-[10px] font-mono">{jb.status}</Badge>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => jobMutation.mutate({ id: jb.id, action: 'APPROVE' })}
                              isLoading={jobMutation.isPending}
                              className="h-7 px-2 text-[11px] text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setDeleteTarget({
                                  id: jb.id,
                                  type: 'JOBS',
                                  name: jb.title,
                                })
                              }
                              className="h-7 px-2 text-[11px] text-rose-600 hover:bg-rose-50 border-rose-200"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab: Mentorship */}
      {activeTab === 'MENTORSHIP' && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Mentor Profile Moderation</CardTitle>
            <Link href="/admin/mentorship" className="text-xs text-blue-600 font-semibold hover:underline">
              Open Full Mentorship &rarr;
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loadingMentors ? (
              <div className="p-6 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : !mentors || mentors.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No mentor profiles to moderate.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-2.5 px-4">Mentor Name & Email</th>
                      <th className="py-2.5 px-4">Domain Expertise</th>
                      <th className="py-2.5 px-4">Total Inquiries</th>
                      <th className="py-2.5 px-4">Accepting Mentees</th>
                      <th className="py-2.5 px-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mentors.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4">
                          <p className="font-bold text-slate-900">
                            {m.user?.profile?.fullName || m.user?.email || 'Mentor'}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">{m.user?.email}</p>
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">{m.expertise || 'General'}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{m._count?.requests || 0}</td>
                        <td className="py-2.5 px-4">
                          <Badge
                            variant={m.isAcceptingMentees ? 'primary' : 'outline'}
                            className="text-[10px]"
                          >
                            {m.isAcceptingMentees ? 'Active' : 'Disabled'}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              mentorMutation.mutate({
                                id: m.id,
                                action: m.isAcceptingMentees ? 'REJECT' : 'APPROVE',
                              })
                            }
                            isLoading={mentorMutation.isPending}
                            className="h-7 px-2 text-[11px]"
                          >
                            {m.isAcceptingMentees ? 'Disable Mentor' : 'Enable Mentor'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Destructive Action Modal */}
      {deleteTarget && (
        <DestructiveActionModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={(reason) => handleExecuteDestructiveAction(reason)}
          title={`Confirm Removal of ${deleteTarget.type}`}
          targetName={deleteTarget.name}
          targetType={deleteTarget.type}
          consequenceText={`Permanently deleting this ${deleteTarget.type.toLowerCase()} record from the database. All dependent associations will be purged immediately and logged to the administrative audit trail.`}
          confirmButtonText="Permanently Delete"
          requireReason={true}
          isLoading={isPendingDestructive}
        />
      )}
    </div>
  );
}
