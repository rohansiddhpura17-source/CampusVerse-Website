'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Filter, X } from 'lucide-react';
import { Badge } from './badge';

export interface FilterOption {
  id: string;
  label: string;
  active: boolean;
}

export interface FiltersProps {
  options: FilterOption[];
  onToggle: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export const Filters: React.FC<FiltersProps> = ({
  options,
  onToggle,
  onClearAll,
  className,
}) => {
  const activeCount = options.filter((o) => o.active).length;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
        <Filter className="w-3.5 h-3.5" />
        Filters
        {activeCount > 0 && (
          <Badge variant="primary" className="ml-1 px-1.5 py-0">
            {activeCount}
          </Badge>
        )}
      </div>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onToggle(opt.id)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors',
            opt.active
              ? 'bg-brand-50 border-brand-300 text-brand-700 shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          )}
        >
          {opt.label}
          {opt.active && <X className="w-3 h-3 text-brand-600" />}
        </button>
      ))}
      {activeCount > 0 && onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-slate-500 hover:text-slate-800 underline ml-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
};
