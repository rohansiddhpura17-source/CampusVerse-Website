'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { MarketplaceListing } from '@/types/admin';
import { useToast } from '@/components/ui/toast';
import { AdminDataTable, Column } from '@/components/admin/data-table';
import { DestructiveActionModal } from '@/components/admin/destructive-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Trash2, CheckCircle2, XCircle, Tag, DollarSign } from 'lucide-react';

export default function AdminMarketplacePage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  const [removeTarget, setRemoveTarget] = useState<MarketplaceListing | null>(null);

  const {
    data: itemsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['adminMarketplaceFullList', search, categoryFilter, page],
    queryFn: () =>
      adminApi.getMarketplaceListings({
        search: search || undefined,
        category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
        page,
        limit: 20,
      }),
  });

  const items: MarketplaceListing[] = Array.isArray(itemsData)
    ? itemsData
    : (itemsData as any)?.data || [];

  const moderateMutation = useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: any; reason?: string }) =>
      adminApi.moderateMarketplace(id, action, reason),
    onSuccess: (data, variables) => {
      toastSuccess(`Listing ${variables.action.toLowerCase()}d successfully.`);
      setRemoveTarget(null);
      queryClient.invalidateQueries({ queryKey: ['adminMarketplaceFullList'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardMetrics'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to moderate listing.');
    },
  });

  const columns: Column<MarketplaceListing>[] = [
    {
      key: 'title',
      header: 'Product / Item Title',
      render: (item) => (
        <div>
          <span className="font-bold text-slate-900 block line-clamp-1">{item.title}</span>
          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (item) => (
        <Badge variant="outline" className="text-[10px]">
          {item.category}
        </Badge>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (item) => (
        <span className="font-bold text-slate-900 font-mono">₹{item.price}</span>
      ),
    },
    {
      key: 'seller',
      header: 'Seller Account',
      render: (item) => (
        <div>
          <span className="font-semibold text-slate-800 block text-[11px]">
            {item.seller?.profile?.fullName || 'Seller'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{item.seller?.email}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Listing Status',
      render: (item) => (
        <Badge
          variant={item.status === 'AVAILABLE' ? 'primary' : 'outline'}
          className={
            item.status === 'AVAILABLE'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
              : 'text-[10px]'
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Listed On',
      render: (item) => (
        <span className="text-slate-500 text-[11px] whitespace-nowrap">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Moderation Actions',
      className: 'text-right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          {item.status !== 'AVAILABLE' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => moderateMutation.mutate({ id: item.id, action: 'APPROVE' })}
              isLoading={moderateMutation.isPending}
              className="h-7 px-2 text-[11px] text-emerald-700 hover:bg-emerald-50 border-emerald-200"
            >
              Approve
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => setRemoveTarget(item)}
            className="h-7 px-2 text-[11px] text-rose-600 hover:bg-rose-50 border-rose-200 gap-1"
          >
            <Trash2 className="w-3 h-3" /> Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Marketplace Catalog Moderation</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit peer-to-peer student product listings, enforce community commerce policies, and remove contraband.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <AdminDataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search listings by title or description..."
        filters={
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="h-8 rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="TEXTBOOKS">Textbooks & Notes</option>
            <option value="ELECTRONICS">Electronics & Hardware</option>
            <option value="HOSTEL_ESSENTIALS">Hostel & Dorm Gear</option>
            <option value="OTHER">Other Goods</option>
          </select>
        }
        page={page}
        totalPages={Math.max(1, Math.ceil(items.length / 20))}
        onPageChange={(p) => setPage(p)}
        emptyTitle="No marketplace listings found"
        emptyDescription="There are no products matching your search criteria."
        emptyIcon={<ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />}
      />

      {/* Destructive Removal Modal */}
      {removeTarget && (
        <DestructiveActionModal
          isOpen={!!removeTarget}
          onClose={() => setRemoveTarget(null)}
          onConfirm={(reason) =>
            moderateMutation.mutate({
              id: removeTarget.id,
              action: 'REMOVE',
              reason,
            })
          }
          title="Confirm Marketplace Removal"
          targetName={`${removeTarget.title} (₹${removeTarget.price})`}
          targetType="Marketplace Listing"
          consequenceText="Permanently deleting this marketplace item from the active database. The seller will be notified of the removal rationale."
          confirmButtonText="Permanently Purge Listing"
          requireReason={true}
          isLoading={moderateMutation.isPending}
        />
      )}
    </div>
  );
}
