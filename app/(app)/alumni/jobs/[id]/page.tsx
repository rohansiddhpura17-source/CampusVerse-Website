'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api/jobs';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Modal } from '@/components/ui/modal';
import {
  Briefcase,
  ArrowLeft,
  Building,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  Send,
  ExternalLink,
  CheckCircle,
  FileSpreadsheet,
  Share2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function AlumniJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();
  const jobId = params?.id as string;

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  const {
    data: job,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['alumniJobDetail', jobId],
    queryFn: () => jobsApi.getJobById(jobId),
    enabled: !!jobId,
  });

  const saveMutation = useMutation({
    mutationFn: () => jobsApi.saveJob(jobId),
    onSuccess: () => {
      toastSuccess('Job saved to your shortlist!');
      queryClient.invalidateQueries({ queryKey: ['alumniJobDetail', jobId] });
      queryClient.invalidateQueries({ queryKey: ['alumniSavedJobs'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to save job'),
  });

  const unsaveMutation = useMutation({
    mutationFn: () => jobsApi.unsaveJob(jobId),
    onSuccess: () => {
      toastSuccess('Job removed from shortlist.');
      queryClient.invalidateQueries({ queryKey: ['alumniJobDetail', jobId] });
      queryClient.invalidateQueries({ queryKey: ['alumniSavedJobs'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to remove job'),
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      return jobsApi.applyJob(jobId, {
        resumeUrl: resumeUrl.trim(),
        coverLetter: coverLetter.trim() || undefined,
      });
    },
    onSuccess: () => {
      toastSuccess('Application submitted successfully!');
      setApplyModalOpen(false);
      setResumeUrl('');
      setCoverLetter('');
      queryClient.invalidateQueries({ queryKey: ['alumniJobDetail', jobId] });
      queryClient.invalidateQueries({ queryKey: ['alumniApplications'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to submit application'),
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeUrl.trim()) {
      toastError('A valid resume document URL is required');
      return;
    }
    applyMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="text-center py-12 space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">Job Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested job posting may have been closed or removed by the hiring company.
        </p>
        <Button variant="outline" size="sm" onClick={() => router.push('/alumni/careers')}>
          Back to Careers
        </Button>
      </div>
    );
  }

  const isSaved = job.isSaved;
  const hasApplied = job.hasApplied;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        href="/alumni/careers"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Careers
      </Link>

      {/* Main Job Header Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{job.roleType}</Badge>
                {job.isRemote && (
                  <Badge variant="secondary" className="bg-sky-50 text-sky-700 border-sky-200">
                    Remote
                  </Badge>
                )}
                {hasApplied && (
                  <Badge variant="primary" className="bg-emerald-100 text-emerald-800 border-emerald-300">
                    Application Status: {job.applicationStatus || 'Submitted'}
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                {job.company?.id ? (
                  <Link
                    href={`/alumni/companies/${job.company.id}`}
                    className="flex items-center gap-1.5 text-purple-600 hover:underline"
                  >
                    <Building className="w-4 h-4" />
                    {job.companyName || job.company?.name}
                  </Link>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-slate-400" />
                    {job.companyName || job.company?.name || 'Enterprise'}
                  </span>
                )}

                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {job.location}
                </span>

                {job.salaryRange && (
                  <span className="flex items-center gap-1.5 text-purple-700 font-bold">
                    <DollarSign className="w-4 h-4" />
                    {job.salaryRange}
                  </span>
                )}

                {job.createdAt && (
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-4 h-4" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => (isSaved ? unsaveMutation.mutate() : saveMutation.mutate())}
                className={`p-2.5 rounded-lg border transition-colors ${
                  isSaved
                    ? 'bg-purple-50 text-purple-700 border-purple-300'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-purple-600'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save job'}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>

              {!hasApplied ? (
                <Button
                  onClick={() => setApplyModalOpen(true)}
                  className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Send className="w-3.5 h-3.5" /> Apply Now
                </Button>
              ) : (
                <Link href="/alumni/applications">
                  <Button variant="outline" className="gap-1.5 text-emerald-700 border-emerald-300">
                    <CheckCircle className="w-3.5 h-3.5" /> View Application
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Role Description</h3>
            <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Requirements (if provided) */}
          {job.requirements && (
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Requirements & Qualifications</h3>
              <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {job.requirements}
              </p>
            </div>
          )}

          {/* Hiring Company Snapshot */}
          {job.company && (
            <div className="pt-6 border-t border-slate-100 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-900">About {job.company.name}</p>
                {job.company.websiteUrl && (
                  <a
                    href={job.company.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-600 hover:underline flex items-center gap-1"
                  >
                    Official Site <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              {job.company.overview ? (
                <p className="text-xs text-slate-600 leading-relaxed">{job.company.overview}</p>
              ) : (
                <p className="text-xs text-slate-400 italic">No additional company overview registered.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Apply Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <div>
            <p className="text-xs text-slate-600">
              Submitting application directly to <span className="font-bold text-slate-900">{job.companyName || job.company?.name}</span>
            </p>
          </div>

          <Input
            label="Resume Link (PDF / Portfolio)"
            type="url"
            placeholder="https://drive.google.com/file/d/your-resume.pdf"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            helperText="A publicly accessible URL to your resume document"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cover Note & Statement of Interest
            </label>
            <textarea
              rows={4}
              placeholder="Introduce yourself, your graduation background, and why you are interested in this position..."
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
              onClick={() => setApplyModalOpen(false)}
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
