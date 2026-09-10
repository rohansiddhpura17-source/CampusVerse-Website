'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (item: T) => React.ReactNode;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  page?: number;
  totalPages?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
}

export function AdminDataTable<T extends { id?: string | number }>({
  columns,
  data,
  isLoading = false,
  isError = false,
  onRetry,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filters,
  actions,
  page = 1,
  totalPages = 1,
  totalCount,
  onPageChange,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching your criteria in the database.',
  emptyIcon,
}: AdminDataTableProps<T>) {
  return (
    <div className="space-y-3">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {onSearchChange && (
            <div className="w-full sm:w-64">
              <Input
                placeholder={searchPlaceholder}
                value={searchValue || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
                className="h-8 text-xs"
              />
            </div>
          )}
          {filters}
        </div>

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>

      {/* Table Body Card */}
      <Card className="overflow-hidden border-slate-200 shadow-2xs">
        {isLoading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : isError ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-800">
              Failed to load administrative records from server.
            </p>
            {onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry} className="text-xs">
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry Query
              </Button>
            )}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            {emptyIcon}
            <h3 className="text-sm font-bold text-slate-800">{emptyTitle}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">{emptyDescription}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  {columns.map((col) => (
                    <th key={col.key} className={`py-2.5 px-3.5 ${col.className || ''}`}>
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {data.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={`py-2.5 px-3.5 ${col.className || ''}`}>
                        {col.render(item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && onPageChange && (
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
            <div>
              {totalCount !== undefined ? (
                <span>
                  Showing page <strong className="text-slate-900">{page}</strong> of{' '}
                  <strong className="text-slate-900">{totalPages}</strong> ({totalCount} total)
                </span>
              ) : (
                <span>
                  Page <strong className="text-slate-900">{page}</strong> of{' '}
                  <strong className="text-slate-900">{totalPages}</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="h-7 px-2 text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="h-7 px-2 text-xs"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
