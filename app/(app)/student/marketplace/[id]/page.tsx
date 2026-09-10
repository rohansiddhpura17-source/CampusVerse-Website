'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceApi } from '@/lib/api/marketplace';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShoppingBag,
  ArrowLeft,
  DollarSign,
  Tag,
  User,
  Trash2,
  Edit2,
  AlertCircle,
  RefreshCw,
  Check,
  Phone,
  Mail,
} from 'lucide-react';

export default function StudentMarketplaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState<'AVAILABLE' | 'RESERVED' | 'SOLD'>('AVAILABLE');

  const {
    data: item,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['marketplaceItemDetail', id],
    queryFn: async () => {
      const data = await marketplaceApi.getItemById(id);
      setEditTitle(data.title);
      setEditPrice(data.price);
      setEditDescription(data.description);
      setEditStatus((data.status as any) || 'AVAILABLE');
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      return marketplaceApi.updateItem(id, payload);
    },
    onSuccess: () => {
      toastSuccess('Listing updated successfully');
      queryClient.invalidateQueries({ queryKey: ['marketplaceItemDetail', id] });
      setIsEditing(false);
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to update listing');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return marketplaceApi.deleteItem(id);
    },
    onSuccess: () => {
      toastSuccess('Listing deleted');
      router.push('/student/marketplace');
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to delete listing');
    },
  });

  const isOwner = user?.userId === item?.sellerId || (user as any)?.id === item?.sellerId || user?.role === 'ADMIN';

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || editDescription.length < 10) {
      toastError('Title is required and description must be at least 10 characters');
      return;
    }
    updateMutation.mutate({
      title: editTitle.trim(),
      price: Number(editPrice),
      description: editDescription.trim(),
      status: editStatus,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !item) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">Item Not Found</h2>
          <p className="text-xs text-slate-500">
            This marketplace listing may have been sold or removed.
          </p>
          <div className="pt-2">
            <Link href="/student/marketplace">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Marketplace
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/student/marketplace"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Marketplace
      </Link>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {item.condition?.replace('_', ' ')}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'AVAILABLE'
                      ? 'bg-emerald-50 text-emerald-700'
                      : item.status === 'RESERVED'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {!isEditing ? (
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{item.title}</h1>
              ) : (
                <Input
                  label="Title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-bold"
                />
              )}

              <p className="text-xs text-slate-500">
                Posted by {item.sellerName || (item as any).seller?.profile?.fullName || 'Campus Peer'}
                {item.createdAt ? ` • ${new Date(item.createdAt).toLocaleDateString()}` : ''}
              </p>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="flex items-center gap-2 self-start">
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit Listing
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleSaveEdit} isLoading={updateMutation.isPending}>
                    <Check className="w-3.5 h-3.5 mr-1" /> Save
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this listing?')) {
                      deleteMutation.mutate();
                    }
                  }}
                  className="text-rose-600 hover:bg-rose-50"
                  isLoading={deleteMutation.isPending}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>

          {/* Pricing & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Item Description
                </h3>
                {!isEditing ? (
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                ) : (
                  <textarea
                    rows={5}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
                  />
                )}
              </div>

              {isEditing && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Input
                    label="Price (₹ INR)"
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                  />
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="RESERVED">RESERVED</option>
                      <option value="SOLD">SOLD</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar with Price & Seller Contact */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] uppercase font-bold text-slate-400">Price</p>
                <p className="text-3xl font-black text-slate-900 mt-1">₹{item.price}</p>
                <p className="text-[11px] text-slate-500 mt-1">Firm peer asking price</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <h4 className="font-bold text-xs text-slate-900">Seller Information</h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium">{item.sellerName || 'Registered Student'}</span>
                  </div>
                  {item.sellerPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{item.sellerPhone}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Always arrange exchanges in public campus areas such as the student center or central library.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
