'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { studentApi } from '@/lib/api/student';
import { eventsApi } from '@/lib/api/events';
import { notificationsApi } from '@/lib/api/notifications';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  Calendar,
  FileText,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
  Library,
  Users,
  Bell,
  GraduationCap,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user } = useAuth();

  const {
    data: academics,
    isLoading: isAcademicsLoading,
    isError: isAcademicsError,
    error: academicsError,
    refetch: refetchAcademics,
  } = useQuery({
    queryKey: ['academicSummary'],
    queryFn: () => studentApi.getAcademicSummary(),
  });

  const {
    data: events,
    isLoading: isEventsLoading,
    isError: isEventsError,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ['campusEvents'],
    queryFn: () => eventsApi.getEvents(),
  });

  const {
    data: notifications,
    isLoading: isNotifsLoading,
    refetch: refetchNotifs,
  } = useQuery({
    queryKey: ['studentNotifications'],
    queryFn: () => notificationsApi.getNotifications(),
  });

  const quickActions = [
    { label: 'Academics', href: '/student/academics', icon: <BookOpen className="w-5 h-5 text-brand-600" />, desc: 'Courses & GPA' },
    { label: 'Notes Hub', href: '/student/notes', icon: <FileText className="w-5 h-5 text-amber-600" />, desc: 'Shared Notes' },
    { label: 'Library', href: '/student/library', icon: <Library className="w-5 h-5 text-emerald-600" />, desc: 'Catalog & Books' },
    { label: 'Marketplace', href: '/student/marketplace', icon: <ShoppingBag className="w-5 h-5 text-violet-600" />, desc: 'Buy & Sell' },
    { label: 'Events', href: '/student/events', icon: <Calendar className="w-5 h-5 text-sky-600" />, desc: 'Campus Life' },
    { label: 'Community', href: '/student/community', icon: <Users className="w-5 h-5 text-rose-600" />, desc: 'Student Groups' },
    { label: 'AI Study Assistant', href: '/student/ai-study', icon: <Sparkles className="w-5 h-5 text-indigo-600" />, desc: 'Tutoring & Q&A' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 text-white shadow-sm">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" className="bg-white/20 text-white border-white/30 backdrop-blur-xs">
              Semester {academics?.semester || 6}
            </Badge>
            <span className="text-xs text-brand-100 font-mono">
              ID: {academics?.studentIdNumber || 'Pending'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 max-w-xl">
            {academics?.degree || 'Degree'} in {academics?.major || 'Academic Program'}
            {academics?.institution?.name ? ` • ${academics.institution.name}` : ''}
          </p>
        </div>

        {/* Real Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 self-stretch lg:self-auto">
          <div>
            <p className="text-[10px] uppercase font-semibold text-brand-200 tracking-wider">CGPA</p>
            <p className="text-xl sm:text-2xl font-black mt-0.5">
              {academics?.cgpa !== undefined ? academics.cgpa.toFixed(2) : '—'}
            </p>
          </div>

          <div className="border-l border-white/20 pl-3">
            <p className="text-[10px] uppercase font-semibold text-brand-200 tracking-wider">Enrolled Courses</p>
            <p className="text-xl sm:text-2xl font-black mt-0.5">
              {academics?.courses?.length ?? 0}
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-white/20 pt-2 sm:pt-0 sm:pl-3">
            <p className="text-[10px] uppercase font-semibold text-brand-200 tracking-wider">Attendance</p>
            <p className="text-[10px] font-medium text-amber-200 mt-1 leading-tight">
              BACKEND CAPABILITY NOT AVAILABLE
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Quick Navigation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-xs transition-all flex flex-col items-center text-center group"
            >
              <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-brand-50 transition-colors mb-2">
                {action.icon}
              </div>
              <p className="text-xs font-bold text-slate-900 line-clamp-1">{action.label}</p>
              <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Courses & Recent Academic Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Courses Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-600" /> Current Courses
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Enrolled courses for current semester</p>
              </div>
              <Link href="/student/academics" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center">
                All courses <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              {isAcademicsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : isAcademicsError ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span>Failed to load academic data.</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => refetchAcademics()}>
                    <RefreshCw className="w-3 h-3 mr-1" /> Retry
                  </Button>
                </div>
              ) : !academics?.courses || academics.courses.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No courses enrolled currently.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {academics.courses.map((course) => (
                    <div key={course.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {course.code}
                          </span>
                          <span className="font-semibold text-slate-800">{course.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{course.department || 'Department'}</p>
                      </div>
                      <Badge variant="secondary">{course.credits} Credits</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Study Assistant Callout */}
          <Card className="bg-gradient-to-br from-indigo-50/70 via-white to-brand-50/50 border-indigo-100">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-sm text-slate-900">AI Study Tutor</h3>
                </div>
                <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                  Stuck on algorithms, database normalization, or operating systems? Get instant explanations tailored to your syllabus.
                </p>
              </div>
              <Link href="/student/ai-study" className="shrink-0">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs">
                  Launch Assistant
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Upcoming Events & Notifications */}
        <div className="space-y-6">
          {/* Notifications Widget */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-600" /> Notifications
              </CardTitle>
              <Link href="/student/notifications" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                View all
              </Link>
            </CardHeader>
            <CardContent className="pt-3">
              {isNotifsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : !notifications || notifications.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No unread notifications.</p>
              ) : (
                <div className="space-y-2">
                  {notifications.slice(0, 3).map((n) => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 text-xs">
                      <p className="font-semibold text-slate-900 line-clamp-1">{n.title}</p>
                      <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-600" /> Upcoming Events
              </CardTitle>
              <Link href="/student/events" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                Browse
              </Link>
            </CardHeader>
            <CardContent className="pt-3">
              {isEventsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : isEventsError ? (
                <div className="text-center py-4 text-xs text-slate-500">
                  <p>Unable to load events.</p>
                  <Button size="sm" variant="ghost" onClick={() => refetchEvents()} className="mt-1 text-xs">
                    Retry
                  </Button>
                </div>
              ) : !events || events.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No upcoming events scheduled.</p>
              ) : (
                <div className="space-y-3">
                  {events.slice(0, 3).map((e) => (
                    <Link
                      key={e.id}
                      href={`/student/events/${e.id}`}
                      className="block p-3 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/20 transition-all text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="secondary" className="text-[10px]">{e.category}</Badge>
                        <span className="text-[10px] text-slate-400">
                          {new Date(e.startTime).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-900 line-clamp-1">{e.title}</p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
