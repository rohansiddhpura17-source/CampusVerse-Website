'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { alumniApi } from '@/lib/api/alumni';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BrainCircuit,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Award,
  Terminal,
  Calendar,
  Clock,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export default function AlumniInterviewResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params?.id as string;

  const {
    data: session,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['alumniInterviewResult', interviewId],
    queryFn: () => alumniApi.getMockInterviewById(interviewId),
    enabled: !!interviewId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="text-center py-12 space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">Evaluation Report Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested interview evaluation report could not be found or you do not have permission to view it.
        </p>
        <Button variant="outline" size="sm" onClick={() => router.push('/alumni/career-ai')}>
          Back to Career AI
        </Button>
      </div>
    );
  }

  const strengths = Array.isArray(session.strengths) ? session.strengths : [];
  const improvements = Array.isArray(session.improvements) ? session.improvements : [];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back Link */}
      <Link
        href="/alumni/interview-prep"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Interview Prep
      </Link>

      {/* Main Scorecard Header */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" className="bg-purple-100 text-purple-800 border-purple-300 text-[10px]">
                  Archived Assessment
                </Badge>
                <span className="text-xs text-slate-400">
                  Completed on {new Date(session.completedAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900">
                Evaluation Scorecard: {session.roleTarget}
              </h1>
              <p className="text-xs font-semibold text-purple-700">{session.topic}</p>
            </div>

            {/* Score Badge */}
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center shrink-0 self-start sm:self-auto">
              <p className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">Overall Score</p>
              <p className="text-3xl font-black text-purple-900 mt-0.5">{session.feedbackScore}%</p>
              <span className="text-[10px] font-semibold text-purple-700">
                {session.feedbackScore >= 85 ? 'Strong Hire' : 'Competitive'}
              </span>
            </div>
          </div>

          {/* Key Strengths */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Strengths Observed
            </h3>
            {strengths.length > 0 ? (
              <div className="space-y-1.5">
                {strengths.map((str, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs text-slate-700 flex items-start gap-2">
                    <span className="font-bold text-emerald-700">&bull;</span>
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No specific strengths cataloged.</p>
            )}
          </div>

          {/* Areas for Growth */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Areas for Growth & Follow-up
            </h3>
            {improvements.length > 0 ? (
              <div className="space-y-1.5">
                {improvements.map((imp, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 text-xs text-slate-700 flex items-start gap-2">
                    <span className="font-bold text-amber-700">&bull;</span>
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No specific improvement points cataloged.</p>
            )}
          </div>

          {/* Transcript / Submission Log */}
          {session.transcript && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-purple-600" /> Response Transcript
              </h3>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-72">
                {session.transcript}
              </pre>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <Link href="/alumni/mock-interview">
              <Button size="sm" variant="outline" className="text-xs">
                Take Another Simulation
              </Button>
            </Link>
            <Link href="/alumni/career-ai">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
                Back to Career Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
