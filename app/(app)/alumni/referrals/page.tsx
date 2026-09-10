'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api/jobs';
import { Referral } from '@/types/alumni';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Modal } from '@/components/ui/modal';
import {
  Share2,
  Building,
  User,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Send,
} from 'lucide-react';

export default function AlumniReferralsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<'RECEIVED' | 'REQUESTED'>('RECEIVED');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [newStatus, setNewStatus] = useState<'ACCEPTED' | 'DECLINED' | 'REFERRED'>('ACCEPTED');
  const [notes, setNotes] = useState('');

  const {
    data: referrals,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['alumniReferrals'],
    queryFn: () => jobsApi.getReferrals(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: () => {
      if (!selectedReferral) throw new Error('No referral selected');
      return jobsApi.respondToReferral(selectedReferral.id, newStatus, notes);
    },
    onSuccess: () => {
      toastSuccess('Referral status updated successfully!');
      setStatusModalOpen(false);
      setSelectedReferral(null);
      setNotes('');
      queryClient.invalidateQueries({ queryKey: ['alumniReferrals'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to update referral status'),
  });

  const receivedReferrals = (referrals || []).filter((r) => r.alumniId === user?.id);
  const requestedReferrals = (referrals || []).filter((r) => r.studentId === user?.id);

  const displayedList = activeTab === 'RECEIVED' ? receivedReferrals : requestedReferrals;

  const handleOpenStatusModal = (ref: Referral, status: 'ACCEPTED' | 'DECLINED' | 'REFERRED') => {
    setSelectedReferral(ref);
    setNewStatus(status);
    setNotes('');
    setStatusModalOpen(true);
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Referral Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review referral requests from students and manage your alumni endorsement submissions.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('RECEIVED')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'RECEIVED' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Requests Received ({receivedReferrals.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('REQUESTED')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'REQUESTED' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Requests ({requestedReferrals.length})
          </button>
        </div>
      </div>

      {/* Content List */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-800">Failed to load referrals</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : displayedList.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Share2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              {activeTab === 'RECEIVED' ? 'No incoming referral requests' : 'No submitted referral requests'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeTab === 'RECEIVED'
                ? 'When campus candidates request endorsements for your organization, they will appear here.'
                : 'Browse alumni in the directory to request referrals for open positions.'}
            </p>
            {activeTab === 'REQUESTED' && (
              <Link href="/alumni/network" className="inline-block pt-2">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
                  Browse Alumni Network
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {displayedList.map((ref) => {
            const isAlumniRecipient = ref.alumniId === user?.id;

            return (
              <Card key={ref.id} className="hover:border-purple-200 transition-colors">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          ref.status === 'ACCEPTED' || ref.status === 'REFERRED'
                            ? 'primary'
                            : ref.status === 'DECLINED'
                            ? 'outline'
                            : 'secondary'
                        }
                        className="text-[10px]"
                      >
                        {ref.status}
                      </Badge>

                      <span className="text-xs text-slate-400">
                        {new Date(ref.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Company: {ref.companyName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                        <span className="flex items-center gap-1 font-medium">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          Candidate: {ref.student?.profile?.fullName || ref.student?.email || 'Campus Member'}
                        </span>
                        {ref.job && (
                          <span className="flex items-center gap-1 text-purple-700 font-semibold">
                            Position: {ref.job.title}
                          </span>
                        )}
                      </div>
                    </div>

                    {ref.notes && (
                      <div className="p-2.5 rounded-lg bg-slate-50 text-xs text-slate-700 leading-relaxed border border-slate-100">
                        <span className="font-semibold text-slate-900 block mb-0.5">Applicant Note:</span>
                        {ref.notes}
                      </div>
                    )}
                  </div>

                  {/* Alumni Actions (if user is the endorsing alumni) */}
                  {isAlumniRecipient && ref.status === 'REQUESTED' && (
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleOpenStatusModal(ref, 'ACCEPTED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Endorse / Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenStatusModal(ref, 'DECLINED')}
                        className="text-rose-600 hover:bg-rose-50 border-rose-200 text-xs gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Decline
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Referral Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={`${newStatus === 'ACCEPTED' ? 'Endorse Candidate' : 'Decline Referral'}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Updating referral status for <span className="font-bold text-slate-900">{selectedReferral?.student?.profile?.fullName || 'Candidate'}</span> at <span className="font-bold text-slate-900">{selectedReferral?.companyName}</span>.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Feedback / Internal Referral Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add guidance, internal submission confirmation ID, or feedback for candidate..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStatusModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              isLoading={updateStatusMutation.isPending}
              onClick={() => updateStatusMutation.mutate()}
              className={`text-white text-xs ${
                newStatus === 'ACCEPTED' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Confirm {newStatus === 'ACCEPTED' ? 'Endorsement' : 'Decline'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
