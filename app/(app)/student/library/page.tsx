'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentApi } from '@/lib/api/student';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Library as LibraryIcon,
  Search,
  Book,
  MapPin,
  Barcode,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function StudentLibraryPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const {
    data: items,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['libraryItems', search, selectedCategory],
    queryFn: () =>
      studentApi.getLibraryResources({
        search: search || undefined,
        category: selectedCategory === 'ALL' ? undefined : selectedCategory,
      }),
  });

  const categories = [
    { label: 'All Catalog', value: 'ALL' },
    { label: 'Computer Science', value: 'COMPUTER_SCIENCE' },
    { label: 'Mathematics', value: 'MATHEMATICS' },
    { label: 'Electronics', value: 'ELECTRONICS' },
    { label: 'Physics', value: 'PHYSICS' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Library Catalog</h1>
        <p className="text-xs text-slate-500 mt-1">
          Search physical textbooks, reference journals, and reserve copies in the university library.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search by title, author, or keyword..."
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

      {/* Library Grid */}
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
            <p className="text-sm font-semibold text-slate-800">Unable to load library resources</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : !items || items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Book className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No books found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No matching textbooks found for your search query. Try broadening your terms.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const isAvailable = (item.availableCopies || 0) > 0;
            return (
              <Card
                key={item.id}
                className="hover:border-brand-200 transition-all cursor-pointer flex flex-col justify-between"
                onClick={() => setSelectedItem(item)}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {item.category?.replace('_', ' ') || 'GENERAL'}
                    </Badge>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isAvailable
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {isAvailable ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> {item.availableCopies} Available
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> All Checked Out
                        </>
                      )}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">By {item.author}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.location || 'Main Stacks'}
                    </span>
                    <span className="text-brand-600 font-semibold hover:underline">
                      View Details &rarr;
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Book Details Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Resource Details"
      >
        {selectedItem && (
          <div className="space-y-4 text-xs">
            <div>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                {selectedItem.category?.replace('_', ' ')}
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1.5">{selectedItem.title}</h2>
              <p className="text-slate-600 mt-0.5">Author: <span className="font-medium text-slate-800">{selectedItem.author}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Shelf Location</p>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedItem.location || 'Section A - Stacks'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">ISBN / Identifier</p>
                <p className="font-mono text-slate-800 mt-0.5">{selectedItem.isbn || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Available Copies</p>
                <p className="font-semibold text-emerald-700 mt-0.5">{selectedItem.availableCopies || 0} copies</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Total Holding</p>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedItem.totalCopies || 0} copies</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
              <strong>Campus Circulation Notice:</strong> Physical items must be checked out at the campus central library circulation desk using your active Student ID card.
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedItem(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
