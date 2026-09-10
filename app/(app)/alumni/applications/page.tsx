'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api/jobs';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Modal } from '@/components/ui/modal';
import {
  FileSpreadsheet,
  Building,
  MapPin,
  Calendar,
  ExternalLink,
  Ban,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';

export default function AlumniApplicationsPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [selectedAppToWithdraw, setSelectedAppToWithdraw] = useState<string | null>(null);

  const {
    data: applications,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['alumniApplications'],
    queryFn: () => jobsApi.getApplications(),
  });

  const withdrawMutation = useMutation({
    mutationFn: (id: string) => jobsApi.withdrawApplication(id),
    onSuccess: () => {
      toastSuccess('Application withdrawn.');
      setSelectedAppToWithdraw(null);
      queryClient.invalidateQueries({ queryKey: ['alumniApplications'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to withdraw application'),
  });

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACCEPTED':
        return (
          <Badge variant="primary" className="bg-emerald-100 text-emerald-800 border-emerald-300">
            Accepted
          </Badge>
        );
      case 'SHORTLISTED':
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-300">
            Shortlisted
          </Badge>
        );
      case 'UNDER_REVIEW':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">
            Under Review
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
            Rejected
          </Badge>
        );
      case 'WITHDRAWN':
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-300">
            Withdrawn
          </Badge>
        );
      case 'APPLIED':
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300">
            Applied
          </Badge>
        );
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Job Applications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your candidate submissions and recruitment status across campus hiring partners.
          </p>
        </div>

        <Link href="/alumni/careers">
          <Button size="sm" variant="outline" className="text-xs gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-purple-600" /> Browse Positions
          </Button>
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-800">Failed to load applications</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : !applications || applications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No active applications</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t submitted any job applications through the CampusVerse portal yet.
            </p>
            <Link href="/alumni/careers" className="inline-block pt-2">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
                Explore Job Openings
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const isWithdrawn = app.status === 'WITHDRAWN';
            const isTerminal = app.status === 'REJECTED' || app.status === 'WITHDRAWN';

            return (
              <Card key={app.id} className="hover:border-purple-200 transition-colors">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(app.status)}
                      <Badge variant="outline" className="text-[10px]">
                        {app.roleType || 'Full-Time'}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                        {app.jobTitle || 'Career Position'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {app.companyName || 'Enterprise Partner'}
                        </span>
                        {app.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {app.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          Applied {app.appliedAt || app.createdAt ? new Date(app.appliedAt || app.createdAt!).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                    </div>

                    {app.resumeUrl && (
                      <div className="pt-2 text-xs">
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-purple-600 hover:underline font-medium"
                        >
                          View Submitted Resume <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {app.jobId && (
                      <Link href={`/alumni/jobs/${app.jobId}`}>
                        <Button size="sm" variant="outline" className="text-xs">
                          View Job
                        </Button>
                      </Link>
                    )}

                    {!isTerminal && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedAppToWithdraw(app.id)}
                        className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200 gap-1"
                      >
                        <Ban className="w-3.5 h-3.5" /> Withdraw
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={Boolean(selectedAppToWithdraw)}
        onClose={() => setSelectedAppToWithdraw(null)}
        title="Withdraw Application"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to withdraw this application? The hiring company will be notified that your candidacy is no longer active.
          </p>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedAppToWithdraw(null)}
            >
              Keep Application
            </Button>
            <Button
              type="button"
              size="sm"
              isLoading={withdrawMutation.isPending}
              onClick={() => {
                if (selectedAppToWithdraw) withdrawMutation.mutate(selectedAppToWithdraw);
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Confirm Withdrawal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
