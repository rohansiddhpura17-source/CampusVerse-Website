'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aspirantApi } from '@/lib/api/aspirant';
import { PredictionRequest, AdmissionPrediction } from '@/types/aspirant';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  GraduationCap,
  Award,
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function AspirantPredictorPage() {
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [selectedInstitutionId, setSelectedInstitutionId] = useState('');
  const [customInstitutionName, setCustomInstitutionName] = useState('');
  const [degree, setDegree] = useState('B.TECH');
  const [programName, setProgramName] = useState('Computer Science and Engineering');
  const [gpa, setGpa] = useState<number>(8.5);
  const [testType, setTestType] = useState<
    'JEE_MAIN' | 'JEE_ADVANCED' | 'SAT' | 'ACT' | 'GRE' | 'NEET' | 'BITSAT' | 'IELTS' | 'TOEFL'
  >('JEE_MAIN');
  const [testScore, setTestScore] = useState<number>(95.5);

  // Fetch available institutions for dropdown
  const { data: colleges } = useQuery({
    queryKey: ['collegesListForPredictor'],
    queryFn: () => aspirantApi.getColleges(),
  });

  // Fetch past prediction history
  const { data: history, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['predictionHistory'],
    queryFn: () => aspirantApi.getPredictionHistory(),
  });

  const predictMutation = useMutation({
    mutationFn: async (payload: PredictionRequest) => {
      return aspirantApi.predictAdmission(payload);
    },
    onSuccess: (data: AdmissionPrediction) => {
      toastSuccess('Admission forecast computed!');
      queryClient.invalidateQueries({ queryKey: ['predictionHistory'] });
      queryClient.invalidateQueries({ queryKey: ['aspirantHomeSummary'] });
      // Store latest result in session storage for instant retrieval
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('latestPrediction', JSON.stringify(data));
      }
      router.push(`/aspirant/predictor/results?id=${data.id}`);
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to compute prediction. Please check inputs.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const chosenInst = (colleges || []).find((c) => c.id === selectedInstitutionId);
    const targetName = chosenInst ? chosenInst.name : customInstitutionName.trim();

    if (!targetName) {
      toastError('Please select or specify a target institution.');
      return;
    }

    if (!programName.trim()) {
      toastError('Program name is required.');
      return;
    }

    if (gpa < 0.0 || gpa > 10.0) {
      toastError('GPA must be between 0.0 and 10.0.');
      return;
    }

    if (testScore < 0.0) {
      toastError('Test score cannot be negative.');
      return;
    }

    const payload: PredictionRequest = {
      institutionId: selectedInstitutionId || undefined,
      institutionName: targetName,
      programName: programName.trim(),
      degree,
      gpa: Number(gpa),
      testType,
      testScore: Number(testScore),
    };

    predictMutation.mutate(payload);
  };

  const getScoreHint = () => {
    switch (testType) {
      case 'IELTS':
        return 'Standard band scale: 0.0 - 9.0';
      case 'TOEFL':
        return 'Standard score scale: 0 - 120';
      case 'SAT':
        return 'Standard composite: 400 - 1600';
      case 'ACT':
        return 'Standard composite: 1 - 36';
      case 'GRE':
        return 'Standard composite: 260 - 340';
      case 'JEE_MAIN':
        return 'Percentile (0.0 - 100.0) or raw marks (0 - 300)';
      case 'JEE_ADVANCED':
        return 'Total score or rank equivalent (0 - 360)';
      case 'BITSAT':
        return 'Total examination score (0 - 390)';
      case 'NEET':
        return 'Total examination marks (0 - 720)';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admission Predictor</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Compute your admission probability based on academic GPA, standardized entrance test performance, and institutional selectivity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Evaluation Parameters
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Inputs are evaluated using the backend statistical admission model
              </p>
            </CardHeader>

            <CardContent className="pt-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Institution Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Institution
                  </label>
                  <select
                    value={selectedInstitutionId}
                    onChange={(e) => {
                      setSelectedInstitutionId(e.target.value);
                      if (e.target.value) setCustomInstitutionName('');
                    }}
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">-- Choose from accredited institutions catalog --</option>
                    {(colleges || []).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (#{c.ranking || 'N/A'}, {c.country})
                      </option>
                    ))}
                  </select>
                </div>

                {!selectedInstitutionId && (
                  <Input
                    label="Or Enter Institution Name Directly"
                    placeholder="e.g. University of California, Berkeley"
                    value={customInstitutionName}
                    onChange={(e) => setCustomInstitutionName(e.target.value)}
                  />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Level</label>
                    <select
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="B.TECH">B.Tech / B.E.</option>
                      <option value="B.S.">B.S. (Bachelor of Science)</option>
                      <option value="B.A.">B.A. (Bachelor of Arts)</option>
                      <option value="M.S.">M.S. (Master of Science)</option>
                      <option value="M.TECH">M.Tech</option>
                      <option value="PHD">Ph.D.</option>
                    </select>
                  </div>

                  <Input
                    label="Target Program / Major"
                    placeholder="Computer Science and Engineering"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Academic GPA (0.0 - 10.0 scale)"
                    type="number"
                    step="0.01"
                    min={0.0}
                    max={10.0}
                    value={gpa}
                    onChange={(e) => setGpa(Number(e.target.value))}
                    required
                  />

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Entrance Test</label>
                    <select
                      value={testType}
                      onChange={(e) => setTestType(e.target.value as any)}
                      className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="JEE_MAIN">JEE Main</option>
                      <option value="JEE_ADVANCED">JEE Advanced</option>
                      <option value="SAT">SAT</option>
                      <option value="ACT">ACT</option>
                      <option value="IELTS">IELTS</option>
                      <option value="TOEFL">TOEFL</option>
                      <option value="GRE">GRE</option>
                      <option value="NEET">NEET</option>
                      <option value="BITSAT">BITSAT</option>
                    </select>
                  </div>

                  <Input
                    label="Test Score / Band"
                    type="number"
                    step="0.1"
                    value={testScore}
                    onChange={(e) => setTestScore(Number(e.target.value))}
                    helperText={getScoreHint()}
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    isLoading={predictMutation.isPending}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-6"
                  >
                    Calculate Chances <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Past History */}
        <div>
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" /> Past Evaluations
              </CardTitle>
              <Badge variant="outline">{history?.length || 0}</Badge>
            </CardHeader>
            <CardContent className="pt-3">
              {isHistoryLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : !history || history.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No previous forecasts generated.</p>
              ) : (
                <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                  {history.map((h) => (
                    <Link
                      key={h.id}
                      href={`/aspirant/predictor/results?id=${h.id}`}
                      className="block p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                        <span className="line-clamp-1">{h.institutionName}</span>
                        <span className="text-emerald-700">{h.predictionPercentage}%</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{h.programName}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                        <span>{h.testType}: {h.testScore}</span>
                        <span>{h.createdAt ? new Date(h.createdAt).toLocaleDateString() : ''}</span>
                      </div>
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
