'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { alumniApi } from '@/lib/api/alumni';
import { jobsApi } from '@/lib/api/jobs';
import { mentorshipApi } from '@/lib/api/mentorship';
import { eventsApi } from '@/lib/api/events';
import { messagesApi } from '@/lib/api/messages';
import { notificationsApi } from '@/lib/api/notifications';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  Briefcase,
  UserCheck,
  Calendar,
  MessageSquare,
  Bell,
  Sparkles,
  TrendingUp,
  Bookmark,
  FileSpreadsheet,
  ArrowUpRight,
  MapPin,
  Clock,
  Award,
  AlertCircle,
  RefreshCw,
  Share2,
} from 'lucide-react';

export default function AlumniDashboardPage() {
  const { user } = useAuth();

  // Queries for real backend data
  const { data: profile } = useQuery({
    queryKey: ['alumniProfileMe', user?.id],
    queryFn: () => alumniApi.getAlumniById(user?.id || ''),
    enabled: !!user?.id,
  });

  const { data: connectionsData } = useQuery({
    queryKey: ['alumniConnections'],
    queryFn: () => alumniApi.getConnections(),
  });

  const { data: sessions } = useQuery({
    queryKey: ['alumniMentorshipSessions'],
    queryFn: () => mentorshipApi.getMentorshipSessions(),
  });

  const { data: savedJobs } = useQuery({
    queryKey: ['alumniSavedJobs'],
    queryFn: () => jobsApi.getSavedJobs(),
  });

  const { data: applications } = useQuery({
    queryKey: ['alumniApplications'],
    queryFn: () => jobsApi.getApplications(),
  });

  const { data: recommendedJobs, isLoading: isJobsLoading } = useQuery({
    queryKey: ['alumniRecommendedJobs'],
    queryFn: () => jobsApi.getRecommendedJobs(),
  });

  const { data: upcomingEvents } = useQuery({
    queryKey: ['alumniUpcomingEvents'],
    queryFn: () => eventsApi.getEvents(),
  });

  const { data: conversations } = useQuery({
    queryKey: ['alumniConversations'],
    queryFn: () => messagesApi.getConversations(),
  });

  const { data: notifications } = useQuery({
    queryKey: ['alumniNotifications'],
    queryFn: () => notificationsApi.getNotifications(),
  });

  const { data: networkActivity, isLoading: isActivityLoading } = useQuery({
    queryKey: ['alumniNetworkActivity'],
    queryFn: () => alumniApi.getNetworkActivity(),
  });

  // Calculate real profile completion
  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    const checks = [
      Boolean(profile.fullName),
      Boolean(profile.headline),
      Boolean(profile.bio),
      Boolean(profile.company),
      Boolean(profile.designation),
      Boolean(profile.industry),
      Boolean(profile.location),
      Boolean(profile.skills && profile.skills.length > 0),
      Boolean(profile.graduationYear),
    ];
    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();
  const connectionsCount = connectionsData?.connections?.length ?? 0;
  const pendingRequestsCount = connectionsData?.pendingRequests?.length ?? 0;
  const activeSessionsCount = (sessions || []).filter((s) => s.status === 'SCHEDULED').length;
  const savedJobsCount = savedJobs?.length ?? 0;
  const applicationsCount = applications?.length ?? 0;
  const unreadNotificationsCount = (notifications || []).filter((n) => !n.isRead).length;

  const quickActions = [
    { label: 'Alumni Directory', href: '/alumni/network', icon: <Users className="w-5 h-5 text-purple-600" />, desc: 'Browse Network' },
    { label: 'My Connections', href: '/alumni/connections', icon: <Share2 className="w-5 h-5 text-indigo-600" />, desc: `${connectionsCount} Active` },
    { label: 'Job Board', href: '/alumni/careers', icon: <Briefcase className="w-5 h-5 text-blue-600" />, desc: 'Explore Openings' },
    { label: 'My Applications', href: '/alumni/applications', icon: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />, desc: `${applicationsCount} Tracked` },
    { label: 'Mentorship Hub', href: '/alumni/mentorship', icon: <UserCheck className="w-5 h-5 text-amber-600" />, desc: 'Host Mentees' },
    { label: 'Messages', href: '/alumni/messages', icon: <MessageSquare className="w-5 h-5 text-rose-600" />, desc: 'Chat Threads' },
    { label: 'Career AI', href: '/alumni/career-ai', icon: <Sparkles className="w-5 h-5 text-purple-600" />, desc: 'Advisor & Roadmap' },
    { label: 'Events', href: '/alumni/events', icon: <Calendar className="w-5 h-5 text-sky-600" />, desc: 'Campus & Webinars' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-800 via-indigo-800 to-slate-900 text-white shadow-sm">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" className="bg-white/20 text-white border-white/30 backdrop-blur-xs">
              Verified Alumnus • Class of {profile?.graduationYear || 2021}
            </Badge>
            <span className="text-xs text-purple-200 font-medium">
              Profile: {profileCompletion}% Complete
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome, {user?.name || profile?.fullName || 'Alumni Member'}!
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 max-w-xl">
            {profile?.designation || 'Software Professional'}
            {profile?.company ? ` @ ${profile.company}` : ''}
            {profile?.location ? ` • ${profile.location}` : ''}
          </p>
        </div>

        {/* Real Metrics Card */}
        <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 self-stretch lg:self-auto">
          <div>
            <p className="text-[10px] uppercase font-semibold text-purple-200 tracking-wider">Connections</p>
            <p className="text-xl sm:text-2xl font-black mt-0.5">{connectionsCount}</p>
          </div>

          <div className="border-l border-white/20 pl-3">
            <p className="text-[10px] uppercase font-semibold text-purple-200 tracking-wider">Sessions</p>
            <p className="text-xl sm:text-2xl font-black mt-0.5">{activeSessionsCount}</p>
          </div>

          <div className="border-l border-white/20 pl-3">
            <p className="text-[10px] uppercase font-semibold text-purple-200 tracking-wider">Saved Jobs</p>
            <p className="text-xl sm:text-2xl font-black mt-0.5">{savedJobsCount}</p>
          </div>
        </div>
      </div>

      {/* Pending Connection Requests Banner */}
      {pendingRequestsCount > 0 && (
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-purple-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-purple-900">
                You have {pendingRequestsCount} pending connection {pendingRequestsCount === 1 ? 'request' : 'requests'}
              </p>
              <p className="text-[11px] text-purple-700">Connect with students and fellow alumni from your campus.</p>
            </div>
          </div>
          <Link href="/alumni/connections">
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
              Review Requests
            </Button>
          </Link>
        </div>
      )}

      {/* Quick Navigation Hub */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Alumni Portal</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-purple-300 hover:shadow-xs transition-all flex flex-col items-center text-center group"
            >
              <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-purple-50 transition-colors mb-2">
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
        {/* Left 2 Cols: Career Opportunities & Network Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Career Opportunities */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  Featured Career Opportunities
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Verified positions cataloged on CampusVerse</p>
              </div>
              <Link href="/alumni/careers" className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center">
                View all jobs <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              {isJobsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : !recommendedJobs || recommendedJobs.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">No active job listings found</p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Check back soon as hiring teams publish new campus and alumni career roles.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recommendedJobs.slice(0, 4).map((j) => (
                    <div
                      key={j.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-purple-200 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-900 line-clamp-1">{j.companyName || j.company?.name || 'Enterprise'}</span>
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            {j.roleType}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-xs text-slate-900 line-clamp-1">{j.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {j.location} {j.isRemote ? '• Remote' : ''}
                        </p>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-700">{j.salaryRange || 'Competitive'}</span>
                        <Link href={`/alumni/jobs/${j.id}`} className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center text-xs">
                          Details <ArrowUpRight className="w-3 h-3 ml-0.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real Network Activity Feed */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  Recent Network Activity
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Live campus connections, career postings, and mentorship updates</p>
              </div>
              <Link href="/alumni/network" className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center">
                Directory <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              {isActivityLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : !networkActivity || networkActivity.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No recent network activity recorded.</p>
              ) : (
                <div className="space-y-3">
                  {networkActivity.slice(0, 5).map((act: any) => (
                    <div key={act.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3 text-xs">
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-purple-600 mt-0.5 shrink-0">
                        {act.type === 'JOB' ? (
                          <Briefcase className="w-4 h-4" />
                        ) : act.type === 'MENTORSHIP' ? (
                          <UserCheck className="w-4 h-4" />
                        ) : (
                          <Users className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900">{act.title}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{act.description}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {act.timestamp ? new Date(act.timestamp).toLocaleDateString() : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Mentorship Sessions, Events & Messages */}
        <div className="space-y-6">
          {/* Mentorship Sessions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" /> Mentorship Sessions
              </CardTitle>
              <Link href="/alumni/mentorship/sessions" className="text-xs font-semibold text-purple-600 hover:text-purple-700">
                View all ({sessions?.length ?? 0})
              </Link>
            </CardHeader>
            <CardContent className="pt-3">
              {!sessions || sessions.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 space-y-1">
                  <UserCheck className="w-6 h-6 text-slate-300 mx-auto" />
                  <p>No active mentorship sessions scheduled.</p>
                  <Link href="/alumni/mentorship" className="text-purple-600 font-semibold text-[11px] hover:underline block pt-1">
                    Manage Mentor Profile &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sessions.slice(0, 3).map((sess) => (
                    <div key={sess.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-900 mb-0.5">
                        <span className="line-clamp-1">{sess.notes || 'Mentorship Session'}</span>
                        <Badge variant={sess.status === 'SCHEDULED' ? 'primary' : 'outline'} className="text-[10px]">
                          {sess.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(sess.scheduledAt).toLocaleString()} ({sess.durationMinutes}m)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600" /> Upcoming Events
              </CardTitle>
              <Link href="/alumni/events" className="text-xs font-semibold text-purple-600 hover:text-purple-700">
                Explore
              </Link>
            </CardHeader>
            <CardContent className="pt-3">
              {!upcomingEvents || upcomingEvents.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No campus events currently scheduled.</p>
              ) : (
                <div className="space-y-2">
                  {upcomingEvents.slice(0, 3).map((ev) => (
                    <Link
                      key={ev.id}
                      href={`/alumni/events/${ev.id}`}
                      className="block p-2.5 rounded-lg bg-slate-50 hover:bg-purple-50/50 transition-colors text-xs"
                    >
                      <p className="font-semibold text-slate-900 line-clamp-1">{ev.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(ev.startTime).toLocaleDateString()} • {ev.isOnline ? 'Virtual' : ev.location}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-600" /> Alerts & Notices
              </CardTitle>
              <Link href="/alumni/notifications" className="text-xs font-semibold text-purple-600 hover:text-purple-700">
                All {unreadNotificationsCount > 0 ? `(${unreadNotificationsCount})` : ''}
              </Link>
            </CardHeader>
            <CardContent className="pt-3">
              {!notifications || notifications.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No notifications.</p>
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
        </div>
      </div>
    </div>
  );
}
