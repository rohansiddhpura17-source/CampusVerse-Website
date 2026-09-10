'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { aspirantApi } from '@/lib/api/aspirant';
import { CollegeComparison } from '@/types/aspirant';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Scale,
  Plus,
  Trash2,
  MapPin,
  Percent,
  DollarSign,
  Building,
  GraduationCap,
  Globe,
  ExternalLink,
  AlertCircle,
  X,
} from 'lucide-react';

export default function AspirantComparePage() {
  const searchParams = useSearchParams();
  const { error: toastError } = useToast();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Initialize from search params ?ids=id1,id2
  useEffect(() => {
    const idsParam = searchParams.get('ids');
    if (idsParam) {
      const parsed = idsParam.split(',').filter(Boolean);
      setSelectedIds(parsed.slice(0, 4));
    }
  }, [searchParams]);

  // Fetch all colleges for the selection dropdown
  const { data: allColleges } = useQuery({
    queryKey: ['collegesListForCompare'],
    queryFn: () => aspirantApi.getColleges(),
  });

  // Fetch comparison data when >= 2 colleges are selected
  const {
    data: comparisonResults,
    isLoading: isComparing,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['compareColleges', selectedIds],
    queryFn: async () => {
      if (selectedIds.length < 2) return null;
      return aspirantApi.compareColleges(selectedIds);
    },
    enabled: selectedIds.length >= 2,
  });

  const handleAddCollege = (id: string) => {
    if (!id) return;
    if (selectedIds.includes(id)) {
      toastError('College is already selected.');
      return;
    }
    if (selectedIds.length >= 4) {
      toastError('Maximum 4 colleges can be compared at once.');
      return;
    }
    setSelectedIds([...selectedIds, id]);
  };

  const handleRemoveCollege = (id: string) => {
    setSelectedIds(selectedIds.filter((cId) => cId !== id));
  };

  const handleClear = () => {
    setSelectedIds([]);
  };

  const unselectedColleges = (allColleges || []).filter((c) => !selectedIds.includes(c.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">College Comparison Matrix</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare acceptance selectivity, tuition fees, campus infrastructure, and programs side-by-side.
          </p>
        </div>

        {selectedIds.length > 0 && (
          <Button size="sm" variant="outline" onClick={handleClear} className="text-xs text-rose-600 self-start sm:self-auto">
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear Comparison
          </Button>
        )}
      </div>

      {/* College Selector Ribbon */}
      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-700">Selected ({selectedIds.length}/4):</span>

          {selectedIds.map((id) => {
            const collegeMatch = (allColleges || []).find((c) => c.id === id);
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-800 border border-sky-200"
              >
                {collegeMatch?.name || 'Selected College'}
                <button
                  type="button"
                  onClick={() => handleRemoveCollege(id)}
                  className="hover:text-rose-600"
                  title="Remove from comparison"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}

          {selectedIds.length < 4 && unselectedColleges.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => {
                  handleAddCollege(e.target.value);
                  e.target.value = '';
                }}
                defaultValue=""
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none"
              >
                <option value="" disabled>
                  + Add institution to compare...
                </option>
                {unselectedColleges.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name} (#{col.ranking || 'N/A'})
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* State Views */}
      {selectedIds.length < 2 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Scale className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              {selectedIds.length === 0
                ? 'Select at least 2 colleges to compare'
                : 'Select 1 more college to begin comparison'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Use the dropdown selector above or click the compare icon on any college in the College Explorer.
            </p>
            <div className="pt-2">
              <Link href="/aspirant/colleges">
                <Button size="sm" variant="outline">
                  Browse College Explorer &rarr;
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : isComparing ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
        </div>
      ) : isError || !comparisonResults ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">Failed to load comparison data</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Comparison Table */
        <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider w-48 shrink-0">
                  Attribute
                </th>
                {comparisonResults.map((c) => (
                  <th key={c.id} className="p-4 font-bold text-slate-900 min-w-[220px]">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                          Rank #{c.ranking || 'N/A'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCollege(c.id)}
                          className="text-slate-400 hover:text-rose-600"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <Link
                        href={`/aspirant/colleges/${c.id}`}
                        className="font-bold text-sm text-slate-900 hover:text-sky-600 block line-clamp-2"
                      >
                        {c.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Location */}
              <tr>
                <td className="p-4 font-semibold text-slate-600 bg-slate-50/50">Location</td>
                {comparisonResults.map((c) => (
                  <td key={c.id} className="p-4 text-slate-800">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {c.city ? `${c.city}, ` : ''}{c.country}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Acceptance Selectivity */}
              <tr>
                <td className="p-4 font-semibold text-slate-600 bg-slate-50/50">Acceptance Rate</td>
                {comparisonResults.map((c) => (
                  <td key={c.id} className="p-4 font-bold text-slate-900">
                    {c.acceptanceRate}%
                  </td>
                ))}
              </tr>

              {/* Average Fees */}
              <tr>
                <td className="p-4 font-semibold text-slate-600 bg-slate-50/50">Average Tuition</td>
                {comparisonResults.map((c) => (
                  <td key={c.id} className="p-4 font-bold text-slate-800">
                    {c.averageFees}
                  </td>
                ))}
              </tr>

              {/* Campus Size */}
              <tr>
                <td className="p-4 font-semibold text-slate-600 bg-slate-50/50">Campus Size</td>
                {comparisonResults.map((c) => (
                  <td key={c.id} className="p-4 text-slate-700">
                    {c.campusSize || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Programs Count */}
              <tr>
                <td className="p-4 font-semibold text-slate-600 bg-slate-50/50">Programs Catalog</td>
                {comparisonResults.map((c) => (
                  <td key={c.id} className="p-4 text-slate-700">
                    <p className="font-bold text-slate-900">{c.programs?.length || 0} Programs</p>
                    <div className="space-y-1 mt-1.5">
                      {(c.programs || []).slice(0, 3).map((p, idx) => (
                        <p key={idx} className="text-[11px] text-slate-500 line-clamp-1">
                          • {p.name} ({p.degree})
                        </p>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Official Link */}
              <tr>
                <td className="p-4 font-semibold text-slate-600 bg-slate-50/50">Actions</td>
                {comparisonResults.map((c) => (
                  <td key={c.id} className="p-4">
                    <Link href={`/aspirant/colleges/${c.id}`}>
                      <Button size="sm" variant="outline" className="w-full text-xs">
                        View College Details
                      </Button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
