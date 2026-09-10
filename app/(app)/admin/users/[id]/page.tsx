'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DestructiveActionModal } from '@/components/admin/destructive-modal';
import { Modal } from '@/components/ui/modal';
import {
  ArrowLeft,
  User,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  MapPin,
  Globe,
  Phone,
  FileText,
  AlertTriangle,
  KeyRound,
  UserX,
  UserCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();
  const userId = params?.id as string;

  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['adminUserDetail', userId],
    queryFn: () => adminApi.getUserDetails(userId),
    enabled: !!userId,
  });

  const statusMutation = useMutation({
    mutationFn: ({ isActive, reason }: { isActive: boolean; reason?: string }) =>
      adminApi.updateUserStatus(userId, { isActive, suspensionReason: reason }),
    onSuccess: (data, variables) => {
      toastSuccess(`Account ${variables.isActive ? 'activated' : 'suspended'} successfully.`);
      setSuspendModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['adminUserDetail', userId] });
      queryClient.invalidateQueries({ queryKey: ['adminUsersList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to update account status'),
  });

  const resetMutation = useMutation({
    mutationFn: () => adminApi.resetUserPassword(userId),
    onSuccess: (data) => {
      setTemporaryPassword(data.tempPassword || 'TempPassword123!');
      toastSuccess('Password reset executed successfully.');
    },
    onError: (err: any) => toastError(err.message || 'Failed to reset password'),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">User Record Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested user account does not exist or you do not have permission to view it.
        </p>
        <Button variant="outline" size="sm" onClick={() => router.push('/admin/users')}>
          Back to Users Directory
        </Button>
      </div>
    );
  }

  const profile = user.profile;
  const verifications = user.verifications || [];
  const reports = user.submittedReports || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        href="/admin/users"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to User Directory
      </Link>

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    user.role === 'ADMIN'
                      ? 'danger'
                      : user.role === 'ALUMNI'
                      ? 'primary'
                      : user.role === 'STUDENT'
                      ? 'secondary'
                      : 'outline'
                  }
                  className="text-[10px] font-mono"
                >
                  {user.role}
                </Badge>

                <Badge
                  variant={user.isActive ? 'primary' : 'danger'}
                  className={
                    user.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
                      : 'bg-rose-50 text-rose-700 border-rose-200 text-[10px]'
                  }
                >
                  {user.isActive ? 'Active Account' : 'Suspended'}
                </Badge>

                {user.isEmailVerified && (
                  <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300">
                    <ShieldCheck className="w-3 h-3 mr-1 inline" /> Email Verified
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl font-bold text-slate-900">
                {profile?.fullName || 'Anonymous Member'}
              </h1>
              <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email} &bull; ID: {user.id}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setTemporaryPassword(null);
                  setResetModalOpen(true);
                }}
                className="text-xs gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" /> Reset Password
              </Button>

              {user.isActive ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSuspendModalOpen(true)}
                  className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200 gap-1.5"
                >
                  <UserX className="w-3.5 h-3.5" /> Suspend
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => statusMutation.mutate({ isActive: true })}
                  isLoading={statusMutation.isPending}
                  className="text-xs text-emerald-600 hover:bg-emerald-50 border-emerald-200 gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Restore Account
                </Button>
              )}
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Headline</span>
              <p className="text-slate-800 font-medium mt-0.5">{profile?.headline || 'None provided'}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Location</span>
              <p className="text-slate-800 font-medium mt-0.5">{profile?.location || 'Unspecified'}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Phone Contact</span>
              <p className="text-slate-800 font-medium mt-0.5">{profile?.phone || 'Not registered'}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Member Since</span>
              <p className="text-slate-800 font-medium mt-0.5">{new Date(user.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Biography */}
          {profile?.bio && (
            <div className="pt-4 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-semibold block text-[11px] mb-1">Biography</span>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100">
                {profile.bio}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification History */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Identity Verification History ({verifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {verifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No verification document submissions on record.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {verifications.map((v: any) => (
                <div key={v.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{v.documentType}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Submitted: {new Date(v.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      v.status === 'APPROVED'
                        ? 'primary'
                        : v.status === 'REJECTED'
                        ? 'danger'
                        : 'outline'
                    }
                    className="text-[10px]"
                  >
                    {v.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submitted Reports History */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Filed Safety Reports ({reports.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {reports.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No safety or abuse reports filed by this member.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {reports.map((r: any) => (
                <div key={r.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">Target: {r.targetType}</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">{r.reason}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {r.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suspend Confirmation Modal */}
      <DestructiveActionModal
        isOpen={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        onConfirm={(reason) =>
          statusMutation.mutate({
            isActive: false,
            reason,
          })
        }
        title="Confirm Account Suspension"
        targetName={`${profile?.fullName || 'User'} (${user.email})`}
        targetType="User Account"
        consequenceText="Suspending this account will immediately revoke all active JWT sessions and deny access to all CampusVerse web and mobile features. This action is permanently recorded in the audit trail."
        confirmButtonText="Suspend User Account"
        requireReason={true}
        isLoading={statusMutation.isPending}
      />

      {/* Reset Password Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Administrative Password Reset"
      >
        <div className="space-y-4 text-xs">
          {temporaryPassword ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <p className="font-bold text-emerald-900">Password Successfully Reset!</p>
              <p className="text-emerald-700">
                Provide this temporary password to the account owner:
              </p>
              <div className="p-2.5 rounded-lg bg-white border border-emerald-300 font-mono text-sm font-bold text-slate-900 select-all">
                {temporaryPassword}
              </div>
              <div className="flex justify-end pt-2">
                <Button size="sm" onClick={() => setResetModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-slate-600">
                Resetting credentials for <strong className="text-slate-900">{profile?.fullName || user.email}</strong>. A temporary randomized password will be generated and logged to the administrative audit trail.
              </p>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResetModalOpen(false)}
                  disabled={resetMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  isLoading={resetMutation.isPending}
                  onClick={() => resetMutation.mutate()}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Generate Temporary Password
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
