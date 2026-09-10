'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { AdminUser } from '@/types/admin';
import { useToast } from '@/components/ui/toast';
import { AdminDataTable, Column } from '@/components/admin/data-table';
import { DestructiveActionModal } from '@/components/admin/destructive-modal';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  KeyRound,
  Eye,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  // Modals state
  const [suspendModalUser, setSuspendModalUser] = useState<AdminUser | null>(null);
  const [activateModalUser, setActivateModalUser] = useState<AdminUser | null>(null);
  const [resetModalUser, setResetModalUser] = useState<AdminUser | null>(null);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);

  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['adminUsersList', search, roleFilter, statusFilter, page],
    queryFn: () =>
      adminApi.getUsers({
        search: search || undefined,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        page,
        limit: 20,
      }),
  });

  const users: AdminUser[] = Array.isArray(usersData)
    ? usersData
    : (usersData as any)?.data || [];

  // Update Status Mutation
  const statusMutation = useMutation({
    mutationFn: ({ userId, isActive, reason }: { userId: string; isActive: boolean; reason?: string }) =>
      adminApi.updateUserStatus(userId, { isActive, suspensionReason: reason }),
    onSuccess: (data, variables) => {
      toastSuccess(`User account ${variables.isActive ? 'activated' : 'suspended'} successfully.`);
      setSuspendModalUser(null);
      setActivateModalUser(null);
      queryClient.invalidateQueries({ queryKey: ['adminUsersList'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardMetrics'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to update account status.');
    },
  });

  // Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (userId: string) => adminApi.resetUserPassword(userId),
    onSuccess: (data) => {
      setTemporaryPassword(data.tempPassword || 'TempPassword123!');
      toastSuccess('Password reset executed successfully.');
      queryClient.invalidateQueries({ queryKey: ['adminUsersList'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to reset password.');
    },
  });

  const columns: Column<AdminUser>[] = [
    {
      key: 'user',
      header: 'Identity & Email',
      render: (u) => (
        <div>
          <Link
            href={`/admin/users/${u.id}`}
            className="font-bold text-slate-900 hover:text-blue-600 transition-colors block line-clamp-1"
          >
            {u.profile?.fullName || 'Anonymous Member'}
          </Link>
          <span className="text-[11px] text-slate-500 font-mono">{u.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (u) => (
        <Badge
          variant={
            u.role === 'ADMIN'
              ? 'danger'
              : u.role === 'ALUMNI'
              ? 'primary'
              : u.role === 'STUDENT'
              ? 'secondary'
              : 'outline'
          }
          className="text-[10px] font-mono"
        >
          {u.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (u) => (
        <Badge
          variant={u.isActive ? 'primary' : 'danger'}
          className={
            u.isActive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
              : 'bg-rose-50 text-rose-700 border-rose-200 text-[10px]'
          }
        >
          {u.isActive ? 'Active' : 'Suspended'}
        </Badge>
      ),
    },
    {
      key: 'verification',
      header: 'Verification',
      render: (u) => {
        const vStatus = u.verifications?.[0]?.status || (u.isEmailVerified ? 'VERIFIED' : 'UNVERIFIED');
        return (
          <span
            className={`text-[11px] font-medium flex items-center gap-1 ${
              vStatus === 'APPROVED' || vStatus === 'VERIFIED'
                ? 'text-emerald-600'
                : vStatus === 'PENDING'
                ? 'text-amber-600'
                : 'text-slate-400'
            }`}
          >
            {vStatus === 'APPROVED' || vStatus === 'VERIFIED' ? (
              <ShieldCheck className="w-3.5 h-3.5" />
            ) : vStatus === 'PENDING' ? (
              <ShieldAlert className="w-3.5 h-3.5" />
            ) : null}
            {vStatus}
          </span>
        );
      },
    },
    {
      key: 'created',
      header: 'Joined Date',
      render: (u) => (
        <span className="text-slate-500 text-[11px] whitespace-nowrap">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Administrative Actions',
      className: 'text-right',
      render: (u) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link href={`/admin/users/${u.id}`}>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-[11px] gap-1"
              title="View full profile and telemetry"
            >
              <Eye className="w-3 h-3" /> Inspect
            </Button>
          </Link>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setTemporaryPassword(null);
              setResetModalUser(u);
            }}
            className="h-7 px-2 text-[11px] text-slate-700 gap-1"
            title="Reset user password"
          >
            <KeyRound className="w-3 h-3" /> Reset
          </Button>

          {u.isActive ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSuspendModalUser(u)}
              className="h-7 px-2 text-[11px] text-rose-600 hover:bg-rose-50 border-rose-200 gap-1"
              title="Suspend user account"
            >
              <UserX className="w-3 h-3" /> Suspend
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActivateModalUser(u)}
              className="h-7 px-2 text-[11px] text-emerald-600 hover:bg-emerald-50 border-emerald-200 gap-1"
              title="Restore user account"
            >
              <UserCheck className="w-3 h-3" /> Restore
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit user accounts, enforce suspension policies, manage credentials, and inspect verification records.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <AdminDataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search users by name or email address..."
        filters={
          <>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="h-8 rounded-lg border border-slate-300 bg-white px-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Campus Roles</option>
              <option value="STUDENT">Students</option>
              <option value="ALUMNI">Alumni</option>
              <option value="ASPIRANT">Aspirants</option>
              <option value="ADMIN">Administrators</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-8 rounded-lg border border-slate-300 bg-white px-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Account Statuses</option>
              <option value="ACTIVE">Active Accounts</option>
              <option value="SUSPENDED">Suspended Accounts</option>
            </select>
          </>
        }
        page={page}
        totalPages={Math.max(1, Math.ceil(users.length / 20))}
        onPageChange={(p) => setPage(p)}
        emptyTitle="No matching users found"
        emptyDescription="Try adjusting your search terms or role filters to locate user records."
        emptyIcon={<Users className="w-8 h-8 text-slate-300 mx-auto" />}
      />

      {/* Suspend Confirmation Modal */}
      {suspendModalUser && (
        <DestructiveActionModal
          isOpen={!!suspendModalUser}
          onClose={() => setSuspendModalUser(null)}
          onConfirm={(reason) =>
            statusMutation.mutate({
              userId: suspendModalUser.id,
              isActive: false,
              reason,
            })
          }
          title="Confirm Account Suspension"
          targetName={`${suspendModalUser.profile?.fullName || 'User'} (${suspendModalUser.email})`}
          targetType="User Account"
          consequenceText="Suspending this account will immediately revoke all active JWT sessions and deny access to all CampusVerse web and mobile features. This action is permanently recorded in the audit trail."
          confirmButtonText="Suspend User Account"
          requireReason={true}
          isLoading={statusMutation.isPending}
        />
      )}

      {/* Activate Confirmation Modal */}
      {activateModalUser && (
        <Modal
          isOpen={!!activateModalUser}
          onClose={() => setActivateModalUser(null)}
          title="Restore User Account"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Are you sure you want to restore access for{' '}
              <strong className="text-slate-900 font-semibold">
                {activateModalUser.profile?.fullName || activateModalUser.email}
              </strong>
              ? The user will be permitted to log in and access all platform features.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActivateModalUser(null)}
                disabled={statusMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                isLoading={statusMutation.isPending}
                onClick={() =>
                  statusMutation.mutate({
                    userId: activateModalUser.id,
                    isActive: true,
                  })
                }
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" /> Restore Account
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reset Password Modal */}
      {resetModalUser && (
        <Modal
          isOpen={!!resetModalUser}
          onClose={() => setResetModalUser(null)}
          title="Administrative Password Reset"
        >
          <div className="space-y-4 text-xs">
            {temporaryPassword ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <p className="font-bold text-emerald-900">Password Successfully Reset!</p>
                <p className="text-emerald-700">
                  Provide this temporary password to the account owner. They will be prompted to change it upon next login:
                </p>
                <div className="p-2.5 rounded-lg bg-white border border-emerald-300 font-mono text-sm font-bold text-slate-900 select-all">
                  {temporaryPassword}
                </div>
                <div className="flex justify-end pt-2">
                  <Button size="sm" onClick={() => setResetModalUser(null)}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-slate-600">
                  Resetting credentials for{' '}
                  <strong className="text-slate-900">
                    {resetModalUser.profile?.fullName || resetModalUser.email}
                  </strong>
                  . A temporary randomized password will be generated and logged to the administrative audit trail.
                </p>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setResetModalUser(null)}
                    disabled={resetPasswordMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    isLoading={resetPasswordMutation.isPending}
                    onClick={() => resetPasswordMutation.mutate(resetModalUser.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" /> Generate Temporary Password
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
