'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api/jobs';
import { JobOpportunity } from '@/types/alumni';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Modal } from '@/components/ui/modal';
import {
  Briefcase,
  Search,
  Bookmark,
  BookmarkCheck,
  MapPin,
  Building,
  DollarSign,
  Send,
  ExternalLink,
  FileSpreadsheet,
  AlertCircle,
  RefreshCw,
  Share2,
} from 'lucide-react';

export default function AlumniCareersPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [roleType, setRoleType] = useState('');
  const [isRemote, setIsRemote] = useState<boolean | undefined>(undefined);

  // Apply Modal state
  const [applyJobModalOpen, setApplyJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  const {
    data: jobs,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['alumniJobsList', search, roleType, isRemote],
    queryFn: () =>
      jobsApi.getJobs({
        search: search || undefined,
        roleType: roleType || undefined,
        isRemote: isRemote !== undefined ? isRemote : undefined,
      }),
  });

  const saveMutation = useMutation({
    mutationFn: async (id: string) => {
      return jobsApi.saveJob(id);
    },
    onSuccess: () => {
      toastSuccess('Job saved to your shortlist!');
      queryClient.invalidateQueries({ queryKey: ['alumniJobsList'] });
      queryClient.invalidateQueries({ queryKey: ['alumniSavedJobs'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to save job');
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async (id: string) => {
      return jobsApi.unsaveJob(id);
    },
    onSuccess: () => {
      toastSuccess('Job removed from shortlist.');
      queryClient.invalidateQueries({ queryKey: ['alumniJobsList'] });
      queryClient.invalidateQueries({ queryKey: ['alumniSavedJobs'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to remove job');
    },
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      if (!selectedJob) return;
      return jobsApi.applyJob(selectedJob.id, {
        resumeUrl: resumeUrl.trim(),
        coverLetter: coverLetter.trim() || undefined,
      });
    },
    onSuccess: () => {
      toastSuccess('Application submitted successfully!');
      setApplyJobModalOpen(false);
      setResumeUrl('');
      setCoverLetter('');
      setSelectedJob(null);
      queryClient.invalidateQueries({ queryKey: ['alumniJobsList'] });
      queryClient.invalidateQueries({ queryKey: ['alumniApplications'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to submit application');
    },
  });

  const handleOpenApply = (job: JobOpportunity) => {
    setSelectedJob(job);
    setResumeUrl('');
    setCoverLetter('');
    setApplyJobModalOpen(true);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeUrl.trim()) {
      toastError('A valid resume document URL is required');
      return;
    }
    applyMutation.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Links */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Careers & Opportunities</h1>
          <p className="text-xs text-slate-500 mt-1">
            Discover verified roles posted by alumni networks and campus partner companies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Link href="/alumni/saved-jobs">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-purple-600" /> Saved Jobs
            </Button>
          </Link>
          <Link href="/alumni/applications">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> My Applications
            </Button>
          </Link>
          <Link href="/alumni/referrals">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-blue-600" /> Referrals
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search by job title, description, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div>
          <select
            value={roleType}
            onChange={(e) => setRoleType(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-purple-500 focus:outline-none"
          >
            <option value="">All Employment Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="CONTRACT">Contract</option>
          </select>
        </div>

        <div>
          <select
            value={isRemote === undefined ? '' : isRemote ? 'true' : 'false'}
            onChange={(e) => {
              if (e.target.value === '') setIsRemote(undefined);
              else setIsRemote(e.target.value === 'true');
            }}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-purple-500 focus:outline-none"
          >
            <option value="">All Work Modes</option>
            <option value="true">Remote Only</option>
            <option value="false">On-site / Hybrid</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">Failed to load career listings</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : !jobs || jobs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No job openings found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or clear role filters to view available career postings.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => {
            const isSaved = job.isSaved;
            const hasApplied = job.hasApplied;
            return (
              <Card key={job.id} className="hover:border-purple-200 transition-all flex flex-col justify-between">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px]">
                        {job.roleType}
                      </Badge>
                      {job.isRemote && (
                        <Badge variant="secondary" className="text-[10px] bg-sky-50 text-sky-700 border-sky-200">
                          Remote
                        </Badge>
                      )}
                      {hasApplied && (
                        <Badge variant="primary" className="text-[10px] bg-emerald-100 text-emerald-800 border-emerald-300">
                          Applied
                        </Badge>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        isSaved ? unsaveMutation.mutate(job.id) : saveMutation.mutate(job.id)
                      }
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-purple-50 text-purple-700 border-purple-300'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-purple-600'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save job'}
                    >
                      {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div>
                    <Link
                      href={`/alumni/jobs/${job.id}`}
                      className="font-bold text-sm text-slate-900 hover:text-purple-600 line-clamp-1 transition-colors"
                    >
                      {job.title}
                    </Link>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      {job.company?.id ? (
                        <Link href={`/alumni/companies/${job.company.id}`} className="hover:underline">
                          {job.companyName || job.company?.name || 'Enterprise'}
                        </Link>
                      ) : (
                        <span>{job.companyName || job.company?.name || 'Enterprise'}</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {job.location}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-700">{job.salaryRange || 'Competitive'}</span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/alumni/jobs/${job.id}`}
                        className="text-slate-600 hover:text-purple-600 font-semibold"
                      >
                        Details
                      </Link>

                      {!hasApplied ? (
                        <Button size="sm" onClick={() => handleOpenApply(job)} className="text-xs">
                          Apply
                        </Button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-600">
                          {job.applicationStatus || 'Applied'}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      <Modal
        isOpen={applyJobModalOpen}
        onClose={() => setApplyJobModalOpen(false)}
        title={`Apply for ${selectedJob?.title || 'Position'}`}
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <div>
            <p className="text-xs text-slate-600">
              Applying to <span className="font-bold text-slate-900">{selectedJob?.companyName || 'Hiring Team'}</span>
            </p>
          </div>

          <Input
            label="Resume Document URL"
            type="url"
            placeholder="https://drive.google.com/file/d/your-resume.pdf"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            helperText="Provide a public viewable link to your PDF resume (e.g. Google Drive, Dropbox, LinkedIn)"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cover Letter / Referral Pitch (Optional)
            </label>
            <textarea
              rows={4}
              placeholder="Highlight your key achievements, relevance to this role, or mutual alumni connections..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setApplyJobModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={applyMutation.isPending}
              className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Send className="w-3.5 h-3.5" /> Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
