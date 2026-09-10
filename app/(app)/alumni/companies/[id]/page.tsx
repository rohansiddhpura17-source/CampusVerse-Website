'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api/jobs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Building,
  ArrowLeft,
  ExternalLink,
  MapPin,
  Briefcase,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';

export default function AlumniCompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id as string;

  const {
    data: company,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
  } = useQuery({
    queryKey: ['alumniCompanyDetail', companyId],
    queryFn: () => jobsApi.getCompanyById(companyId),
    enabled: !!companyId,
  });

  const {
    data: companyJobs,
    isLoading: isJobsLoading,
  } = useQuery({
    queryKey: ['alumniCompanyJobs', companyId],
    queryFn: () => jobsApi.getCompanyJobs(companyId),
    enabled: !!companyId,
  });

  if (isCompanyLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isCompanyError || !company) {
    return (
      <div className="text-center py-12 space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">Company Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested company profile is not cataloged in the system.
        </p>
        <Button variant="outline" size="sm" onClick={() => router.push('/alumni/careers')}>
          Back to Careers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href="/alumni/careers"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Careers
      </Link>

      {/* Company Header Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {company.industry || 'Technology & Innovation'}
                </Badge>
                {company.location && (
                  <Badge variant="secondary" className="text-[10px]">
                    {company.location}
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {company.name}
              </h1>

              {company.location && (
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {company.location}
                </p>
              )}
            </div>

            {company.websiteUrl && (
              <a
                href={company.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start sm:self-auto"
              >
                <Button size="sm" variant="outline" className="text-xs gap-1.5">
                  Official Website <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            )}
          </div>

          {/* Overview */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Company Overview</h3>
            {company.overview ? (
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {company.overview}
              </p>
            ) : (
              <p className="text-xs text-slate-400 italic">No description provided by the organization.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Open Positions at this company */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-purple-600" /> Active Job Openings ({companyJobs?.length ?? 0})
          </h2>
        </div>

        {isJobsLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : !companyJobs || companyJobs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-xs text-slate-500">
              There are currently no active job vacancies listed for this organization.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {companyJobs.map((j) => (
              <Card key={j.id} className="hover:border-purple-200 transition-colors">
                <CardContent className="p-4 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">{j.roleType}</span>
                      {j.isRemote && (
                        <Badge variant="secondary" className="text-[10px]">
                          Remote
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm text-slate-900 line-clamp-1">{j.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{j.location}</p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-700">{j.salaryRange || 'Competitive'}</span>
                    <Link
                      href={`/alumni/jobs/${j.id}`}
                      className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center gap-0.5"
                    >
                      View Details <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
