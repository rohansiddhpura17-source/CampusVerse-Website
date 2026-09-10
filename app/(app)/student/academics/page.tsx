'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentApi } from '@/lib/api/student';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  GraduationCap,
  Award,
  Search,
  AlertCircle,
  FileText,
  Info,
  RefreshCw,
  Clock,
  Layers,
} from 'lucide-react';

export default function StudentAcademicsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>(undefined);

  const {
    data: academics,
    isLoading: isAcademicsLoading,
    isError: isAcademicsError,
    refetch: refetchAcademics,
  } = useQuery({
    queryKey: ['academicSummary'],
    queryFn: () => studentApi.getAcademicSummary(),
  });

  const {
    data: catalogCourses,
    isLoading: isCatalogLoading,
    refetch: refetchCourses,
  } = useQuery({
    queryKey: ['courseCatalog', searchQuery, selectedSemester],
    queryFn: () =>
      studentApi.getCourses({
        search: searchQuery || undefined,
        semester: selectedSemester,
      }),
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Program Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Records & Curriculum</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your enrolled courses, cumulative GPA, and institutional curriculum catalog.
        </p>
      </div>

      {/* Program Summary Card */}
      <Card className="border-brand-100 bg-gradient-to-r from-brand-50/50 via-white to-indigo-50/30">
        <CardContent className="p-6">
          {isAcademicsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : isAcademicsError ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span>Unable to load academic profile.</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => refetchAcademics()}>
                <RefreshCw className="w-3 h-3 mr-1" /> Retry
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Degree & Major</p>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {academics?.degree || 'B.Tech'} in {academics?.major || 'CSE'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{academics?.institution?.name || 'Institution'}</p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Current Standing</p>
                <p className="text-sm font-bold text-slate-900 mt-1">Semester {academics?.semester || 6}</p>
                <p className="text-xs text-slate-500 mt-0.5">Roll: {academics?.studentIdNumber || 'N/A'}</p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Cumulative GPA</p>
                <p className="text-2xl font-black text-brand-600 mt-0.5">
                  {academics?.cgpa !== undefined ? academics.cgpa.toFixed(2) : '—'}
                </p>
                <p className="text-[10px] text-slate-400">Scale of 10.0</p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Official Transcript</p>
                <p className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mt-1">
                  BACKEND CAPABILITY NOT AVAILABLE
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enrolled Courses Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-brand-600" />
              Active Enrolled Courses (Semester {academics?.semester || 6})
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Courses currently credited to your student account</p>
          </div>
          <Badge variant="primary">{academics?.courses?.length || 0} Registered</Badge>
        </CardHeader>
        <CardContent>
          {isAcademicsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : !academics?.courses || academics.courses.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No registered courses found for the active semester.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {academics.courses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-brand-200 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-md">
                      {course.code}
                    </span>
                    <Badge variant="secondary">{course.credits} Credits</Badge>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{course.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Department: {course.department}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Institutional Course Catalog Explorer */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-600" />
                Institutional Course Catalog
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Browse all accredited courses across departments</p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 sm:w-64"
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isCatalogLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : !catalogCourses || catalogCourses.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              No courses matching your search filter.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {catalogCourses.map((c) => (
                <div key={c.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {c.code}
                      </span>
                      <span className="font-semibold text-slate-900">{c.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {c.department} • {c.semester ? `Semester ${c.semester}` : 'Curriculum Course'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Badge variant="secondary">{c.credits} Credits</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
