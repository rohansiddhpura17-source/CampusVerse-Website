'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { aspirantApi } from '@/lib/api/aspirant';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Compass,
  TrendingUp,
  Award,
  ArrowUpRight,
  Sparkles,
  Bookmark,
  Calendar,
  Bell,
  Scale,
  UserCircle,
  AlertCircle,
  RefreshCw,
  Clock,
  MapPin,
} from 'lucide-react';

export default function AspirantDashboardPage() {
  const { user } = useAuth();

  const {
    data: summary,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['aspirantHomeSummary'],
    queryFn: () => aspirantApi.getHomeSummary(),
  });

  // Calculate real Profile Completion based on populated fields
  const calculateProfileCompletion = () => {
    if (!summary?.profile) return 0;
    const p = summary.profile;
    const checks = [
      Boolean(user?.name),
      Boolean(p.bio),
      Boolean(p.targetDegree),
      Boolean(p.targetMajor),
      Boolean(p.targetUniversities),
      Boolean(p.highSchool),
      Boolean(p.expectedGradYear),
      Boolean(p.entranceExamScores && Object.keys(p.entranceExamScores).length > 0),
    ];
    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  const quickActions = [
    { label: 'College Explorer', href: '/aspirant/colleges', icon: <Compass className="w-5 h-5 text-emerald-600" />, desc: 'Browse Institutions' },
    { label: 'Compare', href: '/aspirant/compare', icon: <Scale className="w-5 h-5 text-sky-600" />, desc: 'Side-by-Side Analysis' },
    { label: 'Predictor', href: '/aspirant/predictor', icon: <TrendingUp className="w-5 h-5 text-brand-600" />, desc: 'Admission Forecast' },
    { label: 'Scholarships', href: '/aspirant/scholarships', icon: <Award className="w-5 h-5 text-amber-600" />, desc: 'Funding Directory' },
    { label: 'Saved Items', href: '/aspirant/saved-scholarships', icon: <Bookmark className="w-5 h-5 text-indigo-600" />, desc: 'Shortlisted Grants' },
    { label: 'Recommendations', href: '/aspirant/recommendations', icon: <Sparkles className="w-5 h-5 text-rose-600" />, desc: 'AI Admissions Match' },
    { label: 'Test Scores', href: '/aspirant/profile', icon: <UserCircle className="w-5 h-5 text-teal-600" />, desc: 'IELTS / SAT / JEE' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white shadow-sm">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" className="bg-white/20 text-white border-white/30 backdrop-blur-xs">
              Class of {summary?.profile?.expectedGradYear || 2027} Aspirant
            </Badge>
            <span className="text-xs text-teal-100 font-medium">
              Profile: {profileCompletion}% Complete
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome, {user?.name || 'Prospective Student'}!
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
            Targeting {summary?.profile?.targetDegree || 'Undergraduate Degree'} in{' '}
            {summary?.profile?.targetMajor || 'Field of Study'}
            {summary?.profile?.targetUniversities ? ` at ${summary.profile.targetUniversities}` : ''}
          </p>
        </div>

        {/* Real Metrics Cards */}
        <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 self-stretch lg:self-auto">
          <div>
            <p className="text-[10px] uppercase font-semibold text-teal-200 tracking-wider">Saved Colleges</p>
            <p className="text-xl sm:text-2xl font-black mt-0.5">{summary?.savedCollegesCount ?? 0}</p>
          </div>

          <div className="border-l border-white/20 pl-3">
            <p className="text-[10px] uppercase font-semibold text-teal-200 tracking-wider">Predictions</p>
            <p className="text-xl sm:text-2xl font-black mt-0.5">{summary?.recentPredictionsCount ?? 0}</p>
          </div>

          <div className="border-l border-white/20 pl-3">
            <p className="text-[10px] uppercase font-semibold text-teal-200 tracking-wider">Scholarships</p>
            <p className="text-xl sm:text-2xl font-black mt-0.5">{summary?.savedScholarshipsCount ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Bar */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Aspirant Hub</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col items-center text-center group"
            >
              <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-emerald-50 transition-colors mb-2">
                {action.icon}
              </div>
              <p className="text-xs font-bold text-slate-900 line-clamp-1">{action.label}</p>
              <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Predictions & Saved Colleges */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Predictions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Recent Admission Forecasts
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Statistical chances calculated by CampusVerse backend</p>
              </div>
              <Link href="/aspirant/predictor" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center">
                New forecast <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : isError ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span>Failed to load prediction history.</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => refetch()}>
                    <RefreshCw className="w-3 h-3 mr-1" /> Retry
                  </Button>
                </div>
              ) : !summary?.recentPredictions || summary.recentPredictions.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <TrendingUp className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">No predictions generated yet</p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Input your GPA and entrance exam scores (JEE, SAT, IELTS) in the admission predictor to calculate admission odds.
                  </p>
                  <Link href="/aspirant/predictor" className="inline-block pt-1">
                    <Button size="sm">Calculate Chances</Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {summary.recentPredictions.map((pred: any) => (
                    <div key={pred.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{pred.institutionName}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600">{pred.programName}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Evaluated: {new Date(pred.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <Badge
                          variant={
                            pred.qualificationStatus === 'STRONG_CANDIDATE'
                              ? 'primary'
                              : pred.qualificationStatus === 'COMPETITIVE'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {pred.predictionPercentage}% {pred.qualificationStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Colleges */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  Accredited Institutions Directory
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Verified university rankings and program catalogs</p>
              </div>
              <Link href="/aspirant/colleges" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center">
                Explore catalog <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ) : !summary?.recommendedColleges || summary.recommendedColleges.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No institutions cataloged currently.</p>
              ) : (
                <div className="space-y-3">
                  {summary.recommendedColleges.slice(0, 3).map((col: any) => (
                    <div
                      key={col.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-200 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                            Rank #{col.ranking || 'N/A'}
                          </span>
                          <h4 className="font-bold text-xs text-slate-900">{col.name}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {col.city ? `${col.city}, ` : ''}{col.country} • Acceptance: {col.acceptanceRate}%
                        </p>
                      </div>
                      <Link href={`/aspirant/colleges/${col.id}`}>
                        <Button size="sm" variant="outline" className="text-xs">
                          Details
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Saved Scholarships & Deadlines */}
        <div className="space-y-6">
          {/* Saved Scholarships */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" /> Saved Scholarships
              </CardTitle>
              <Link href="/aspirant/saved-scholarships" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                View all ({summary?.savedScholarshipsCount ?? 0})
              </Link>
            </CardHeader>
            <CardContent className="pt-3">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : !summary?.savedScholarships || summary.savedScholarships.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 space-y-1">
                  <Award className="w-6 h-6 text-slate-300 mx-auto" />
                  <p>No scholarships saved.</p>
                  <Link href="/aspirant/scholarships" className="text-emerald-600 font-semibold text-[11px] hover:underline block pt-1">
                    Browse Scholarship Directory &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {summary.savedScholarships.slice(0, 3).map((s: any) => (
                    <div key={s.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-900 mb-0.5">
                        <span className="line-clamp-1">{s.name}</span>
                        <span className="text-amber-700 font-bold shrink-0">{s.amount}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">By {s.provider}</p>
                      {s.deadline && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>Deadline: {new Date(s.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Unread Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" /> Notifications
              </CardTitle>
              <Link href="/aspirant/notifications" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                View all
              </Link>
            </CardHeader>
            <CardContent className="pt-3">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : !summary?.notifications || summary.notifications.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No unread notifications.</p>
              ) : (
                <div className="space-y-2">
                  {summary.notifications.slice(0, 3).map((n: any) => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 text-xs">
                      <p className="font-semibold text-slate-900 line-clamp-1">{n.title}</p>
                      <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{n.message}</p>
                    </div>
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
