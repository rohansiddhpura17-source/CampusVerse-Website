'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { aspirantApi } from '@/lib/api/aspirant';
import { AdmissionPrediction } from '@/types/aspirant';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Compass,
  FileText,
  UserCheck,
  Percent,
} from 'lucide-react';

export default function AspirantPredictorResultsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [fallbackPrediction, setFallbackPrediction] = useState<AdmissionPrediction | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('latestPrediction');
      if (stored) {
        try {
          setFallbackPrediction(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const { data: history, isLoading } = useQuery({
    queryKey: ['predictionHistory'],
    queryFn: () => aspirantApi.getPredictionHistory(),
  });

  const prediction = (history || []).find((p) => p.id === id) || (fallbackPrediction?.id === id ? fallbackPrediction : fallbackPrediction || history?.[0]);

  if (isLoading && !prediction) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!prediction) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardContent className="p-10 text-center space-y-3">
          <TrendingUp className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">No Prediction Selected</h2>
          <p className="text-xs text-slate-500">
            Please run the admission predictor to calculate admission odds for your chosen program.
          </p>
          <div className="pt-2">
            <Link href="/aspirant/predictor">
              <Button size="sm">Go to Predictor</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'STRONG_CANDIDATE':
        return <Badge variant="primary" className="text-xs px-3 py-1">Strong Candidate (High Selectivity Match)</Badge>;
      case 'COMPETITIVE':
        return <Badge variant="secondary" className="text-xs px-3 py-1">Competitive Candidate (Target Range)</Badge>;
      case 'REACH':
        return <Badge variant="warning" className="text-xs px-3 py-1">Reach Institution (Challenging Match)</Badge>;
      default:
        return <Badge variant="outline" className="text-xs px-3 py-1 text-slate-600">Unlikely Match (Safety Suggested)</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/aspirant/predictor"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Admission Predictor
      </Link>

      {/* Result Hero Banner */}
      <Card className="border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40">
        <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge(prediction.qualificationStatus)}
              {prediction.createdAt && (
                <span className="text-[11px] text-slate-500">
                  Evaluated: {new Date(prediction.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {prediction.institutionName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Program: <span className="font-semibold text-slate-800">{prediction.programName}</span> ({prediction.degree})
            </p>
          </div>

          <div className="text-center p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs shrink-0 min-w-[160px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Calculated Chance</p>
            <p className="text-4xl font-black text-emerald-600 mt-1">
              {prediction.predictionPercentage}%
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Statistical probability</p>
          </div>
        </CardContent>
      </Card>

      {/* User Entered Data Card */}
      <Card>
        <CardHeader className="pb-2 border-b border-slate-100">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" /> User-Entered Evaluation Data
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Undergraduate GPA</p>
              <p className="font-bold text-slate-800 mt-0.5">{prediction.gpa} / 10.0</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Standardized Test</p>
              <p className="font-bold text-slate-800 mt-0.5">{prediction.testType}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Candidate Score</p>
              <p className="font-bold text-slate-800 mt-0.5">{prediction.testScore}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Target Degree</p>
              <p className="font-bold text-slate-800 mt-0.5">{prediction.degree}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluator Qualitative Feedback */}
      <Card>
        <CardHeader className="pb-2 border-b border-slate-100">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" /> Backend Analysis & Evaluator Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {prediction.feedback}
        </CardContent>
      </Card>

      {/* Recommended Next Actions */}
      {prediction.recommendations && prediction.recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" /> Preparation & Strategy Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            {prediction.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">Admission Forecast Disclaimer:</p>
        <p>
          Predictions are algorithmic estimates computed from institutional selectivity factors, admitted cohort GPA statistics, and historical standardized test thresholds. They are intended for guidance and self-assessment only and do not constitute an official university admission offer or guarantee.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Link href="/aspirant/predictor">
          <Button variant="outline" size="sm">
            Calculate Another Forecast
          </Button>
        </Link>
        <Link href="/aspirant/colleges">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
            <Compass className="w-4 h-4" /> Explore Accredited Colleges
          </Button>
        </Link>
      </div>
    </div>
  );
}
