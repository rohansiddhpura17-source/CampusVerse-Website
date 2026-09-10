'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { mentorshipApi } from '@/lib/api/mentorship';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  UserCheck,
  Search,
  Building,
  Star,
  Calendar,
  Clock,
  ArrowUpRight,
  AlertCircle,
  RefreshCw,
  Award,
} from 'lucide-react';

export default function AlumniMentorshipPage() {
  const [search, setSearch] = useState('');
  const [expertise, setExpertise] = useState('');

  const {
    data: mentors,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['alumniMentorsList', search, expertise],
    queryFn: () =>
      mentorshipApi.getMentors({
        search: search || undefined,
        expertise: expertise || undefined,
      }),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mentorship Hub</h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect with senior alumni leaders, industry guides, and campus domain advisors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Link href="/alumni/mentorship/sessions">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-600" /> My Sessions
            </Button>
          </Link>
          <Link href="/alumni/mentorship/requests">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Requests & Status
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search by mentor name, role, company, or bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div>
          <Input
            placeholder="Filter by expertise (e.g. AI, Cloud, Product)..."
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
          />
        </div>
      </div>

      {/* Mentors Grid */}
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
            <p className="text-sm font-semibold text-slate-800">Failed to load mentors</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : !mentors || mentors.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No mentors found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No mentors match your search query. Try broadening your criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((mentor) => {
            const name = mentor.user?.profile?.fullName || mentor.fullName || 'Campus Mentor';
            const headline = mentor.user?.profile?.headline || mentor.title;
            const expertiseList = Array.isArray(mentor.expertise)
              ? mentor.expertise
              : typeof mentor.expertise === 'string'
              ? mentor.expertise.split(',').map((s) => s.trim()).filter(Boolean)
              : [];

            return (
              <Card key={mentor.id} className="hover:border-purple-200 transition-all flex flex-col justify-between">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{name}</h3>
                      <p className="text-xs text-purple-700 font-semibold line-clamp-1">{headline}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400" />
                        {mentor.company}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md text-xs font-bold shrink-0">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {mentor.rating.toFixed(1)}
                    </div>
                  </div>

                  {mentor.bio && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {mentor.bio}
                    </p>
                  )}

                  {expertiseList.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {expertiseList.slice(0, 3).map((exp, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] bg-slate-50">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">
                      {mentor.hourlyRate === 0 ? 'Free Mentorship' : `₹${mentor.hourlyRate}/session`}
                    </span>

                    <Link href={`/alumni/mentorship/mentor/${mentor.id}`}>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1">
                        Profile & Request <ArrowUpRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
