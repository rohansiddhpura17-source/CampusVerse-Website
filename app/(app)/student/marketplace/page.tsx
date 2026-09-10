'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceApi } from '@/lib/api/marketplace';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShoppingBag,
  Search,
  Plus,
  Tag,
  DollarSign,
  User,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function StudentMarketplacePage() {
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState<'TEXTBOOK' | 'ELECTRONICS' | 'NOTES' | 'FURNITURE' | 'OTHER'>('TEXTBOOK');
  const [condition, setCondition] = useState<'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR'>('GOOD');

  const {
    data: items,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['marketplaceItems', search, selectedCategory],
    queryFn: () =>
      marketplaceApi.getItems({
        search: search || undefined,
        category: selectedCategory || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: async (payload: {
      title: string;
      description: string;
      price: number;
      category: string;
      condition: string;
    }) => {
      return marketplaceApi.createItem(payload);
    },
    onSuccess: () => {
      toastSuccess('Item listed on campus marketplace!');
      queryClient.invalidateQueries({ queryKey: ['marketplaceItems'] });
      setIsCreateModalOpen(false);
      setTitle('');
      setDescription('');
      setPrice(0);
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to list item');
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || description.length < 10) {
      toastError('Title is required and description must be at least 10 characters');
      return;
    }
    createMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      condition,
    });
  };

  const categories = [
    { label: 'All Categories', value: '' },
    { label: 'Textbooks', value: 'TEXTBOOK' },
    { label: 'Electronics', value: 'ELECTRONICS' },
    { label: 'Notes', value: 'NOTES' },
    { label: 'Furniture', value: 'FURNITURE' },
    { label: 'Other', value: 'OTHER' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Marketplace</h1>
          <p className="text-xs text-slate-500 mt-1">
            Buy and sell secondhand textbooks, lab instruments, electronics, and dorm essentials.
          </p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Post an Item
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search items by name or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === c.value
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Marketplace Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">Failed to load marketplace listings</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Try Again
            </Button>
          </CardContent>
        </Card>
      ) : !items || items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No listings active</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No items currently match your criteria. Post an item to sell it to fellow campus peers.
            </p>
            <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
              Post First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: any) => {
            const isOwner = user?.userId === item.sellerId || (user as any)?.id === item.sellerId;
            return (
              <Card key={item.id} className="hover:border-brand-200 transition-all flex flex-col justify-between">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {item.category}
                    </Badge>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {item.condition?.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <Link
                      href={`/student/marketplace/${item.id}`}
                      className="font-bold text-sm text-slate-900 hover:text-brand-600 line-clamp-1 transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Asking Price</p>
                      <p className="text-base font-black text-slate-900">₹{item.price}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isOwner && (
                        <Badge variant="primary" className="text-[10px]">
                          Your Listing
                        </Badge>
                      )}
                      <Link
                        href={`/student/marketplace/${item.id}`}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center"
                      >
                        View <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Post Listing Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Post Item on Marketplace"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Listing Title"
            placeholder="e.g. Engineering Mathematics - Kreyszig 10th Ed."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
              >
                <option value="TEXTBOOK">Textbook</option>
                <option value="ELECTRONICS">Electronics</option>
                <option value="NOTES">Notes / Binder</option>
                <option value="FURNITURE">Furniture / Dorm</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
              >
                <option value="NEW">New (Unused)</option>
                <option value="LIKE_NEW">Like New</option>
                <option value="GOOD">Good (Light Wear)</option>
                <option value="FAIR">Fair (Noticeable Wear)</option>
              </select>
            </div>
          </div>

          <Input
            label="Price (₹ INR)"
            type="number"
            min="0"
            step="1"
            placeholder="350"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Description (Min. 10 chars)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State edition, highlight markings, pickup location on campus..."
              className="block w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending}>
              List Item
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
