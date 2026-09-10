'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aspirantApi } from '@/lib/api/aspirant';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Mail,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Building,
  Save,
  Check,
  AlertCircle,
  Sparkles,
  TrendingUp,
  FileCheck,
} from 'lucide-react';

export default function AspirantProfilePage() {
  const { user, refreshSession } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['aspirantProfile'],
    queryFn: () => aspirantApi.getAspirantProfile(),
  });

  // Personal Info Form State
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');

  // Target Academics
  const [highSchool, setHighSchool] = useState('');
  const [targetDegree, setTargetDegree] = useState('B.Tech');
  const [targetMajor, setTargetMajor] = useState('Computer Science');
  const [targetUniversities, setTargetUniversities] = useState('');
  const [expectedGradYear, setExpectedGradYear] = useState<number>(2027);

  // Standardized Exam Scores & Critical IELTS State
  const [ieltsScore, setIeltsScore] = useState<string>('');
  const [satScore, setSatScore] = useState<string>('');
  const [jeeMainScore, setJeeMainScore] = useState<string>('');
  const [jeeAdvScore, setJeeAdvScore] = useState<string>('');
  const [gpaScore, setGpaScore] = useState<string>('');

  useEffect(() => {
    if (profileData) {
      setFullName(profileData.fullName || user?.name || '');
      setBio(profileData.bio || '');
      setHighSchool(profileData.highSchool || '');
      setTargetDegree(profileData.targetDegree || 'B.Tech');
      setTargetMajor(profileData.targetMajor || 'Computer Science');
      setTargetUniversities(profileData.targetUniversities || '');
      setExpectedGradYear(profileData.expectedGradYear || 2027);

      const scores = profileData.entranceExamScores || {};
      setIeltsScore(scores.IELTS !== undefined ? String(scores.IELTS) : scores.ielts !== undefined ? String(scores.ielts) : '');
      setSatScore(scores.SAT !== undefined ? String(scores.SAT) : '');
      setJeeMainScore(scores.JEE_MAIN !== undefined ? String(scores.JEE_MAIN) : '');
      setJeeAdvScore(scores.JEE_ADVANCED !== undefined ? String(scores.JEE_ADVANCED) : '');
      setGpaScore(scores.GPA !== undefined ? String(scores.GPA) : '');
    } else if (user) {
      setFullName(user.name || '');
    }
  }, [profileData, user]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      // Build entrance exam scores object
      const entranceExamScores: Record<string, number> = {};
      if (ieltsScore.trim()) {
        const parsed = Number(ieltsScore);
        if (isNaN(parsed) || parsed < 0 || parsed > 9.0) {
          throw new Error('IELTS band score must be a number between 0.0 and 9.0 (e.g. 7.5)');
        }
        entranceExamScores.IELTS = parsed;
      }
      if (satScore.trim()) {
        const parsed = Number(satScore);
        if (isNaN(parsed) || parsed < 400 || parsed > 1600) {
          throw new Error('SAT score must be between 400 and 1600');
        }
        entranceExamScores.SAT = parsed;
      }
      if (jeeMainScore.trim()) {
        const parsed = Number(jeeMainScore);
        entranceExamScores.JEE_MAIN = parsed;
      }
      if (jeeAdvScore.trim()) {
        const parsed = Number(jeeAdvScore);
        entranceExamScores.JEE_ADVANCED = parsed;
      }
      if (gpaScore.trim()) {
        const parsed = Number(gpaScore);
        if (isNaN(parsed) || parsed < 0 || parsed > 10.0) {
          throw new Error('GPA must be between 0.0 and 10.0');
        }
        entranceExamScores.GPA = parsed;
      }

      const payload = {
        fullName: fullName.trim() || undefined,
        bio: bio.trim() || undefined,
        targetDegree: targetDegree.trim() || undefined,
        targetMajor: targetMajor.trim() || undefined,
        targetUniversities: targetUniversities.trim() || undefined,
        highSchool: highSchool.trim() || undefined,
        expectedGradYear: Number(expectedGradYear),
        entranceExamScores: Object.keys(entranceExamScores).length > 0 ? entranceExamScores : undefined,
      };

      return aspirantApi.updateAspirantProfile(payload);
    },
    onSuccess: async () => {
      toastSuccess('Aspirant profile & test scores saved and persisted!');
      await refreshSession();
      queryClient.invalidateQueries({ queryKey: ['aspirantProfile'] });
      queryClient.invalidateQueries({ queryKey: ['aspirantHomeSummary'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to update profile');
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toastError('Full name is required');
      return;
    }
    if (expectedGradYear < 2024 || expectedGradYear > 2035) {
      toastError('Expected graduation year must be between 2024 and 2035');
      return;
    }
    updateMutation.mutate();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white shadow-sm flex flex-col sm:flex-row sm:items-center gap-6">
        <Avatar name={fullName || user?.name || 'Aspirant'} size="lg" className="h-20 w-20 text-xl font-bold ring-4 ring-white/20" />
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" className="bg-white/20 text-white border-white/30">
              Aspirant Candidate Profile
            </Badge>
            <span className="text-xs text-teal-200">
              Target Year: {expectedGradYear}
            </span>
          </div>
          <h1 className="text-2xl font-bold">{fullName || user?.name}</h1>
          <p className="text-xs sm:text-sm text-teal-100">
            Aspiring {targetDegree} in {targetMajor}
            {highSchool ? ` • ${highSchool}` : ''}
          </p>
        </div>
      </div>

      {/* Main Profile Editor */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Edit Aspirant Credentials & Target Benchmarks
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              All credentials and test scores sync directly with the central database and persist across sessions.
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Identity & Bio */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Personal Identity & High School
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Registered Email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  leftIcon={<Mail className="w-4 h-4" />}
                  helperText="Primary authentication email (managed via Auth settings)"
                />

                <Input
                  label="Current High School / Secondary College"
                  placeholder="e.g. National Model High School, Delhi"
                  value={highSchool}
                  onChange={(e) => setHighSchool(e.target.value)}
                  leftIcon={<Building className="w-4 h-4" />}
                />

                <Input
                  label="Expected Graduation Year"
                  type="number"
                  min={2024}
                  max={2035}
                  value={expectedGradYear}
                  onChange={(e) => setExpectedGradYear(Number(e.target.value))}
                  leftIcon={<Calendar className="w-4 h-4" />}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Statement of Purpose & Career Goals
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share your academic passion, career vision, and target fields..."
                  className="block w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Target Programs */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Target Higher Education Goals
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Target Degree Level"
                  placeholder="e.g. B.Tech, B.S., Integrated M.Sc."
                  value={targetDegree}
                  onChange={(e) => setTargetDegree(e.target.value)}
                  leftIcon={<GraduationCap className="w-4 h-4" />}
                />

                <Input
                  label="Target Major / Field of Study"
                  placeholder="e.g. Computer Science & AI"
                  value={targetMajor}
                  onChange={(e) => setTargetMajor(e.target.value)}
                  leftIcon={<BookOpen className="w-4 h-4" />}
                />
              </div>

              <Input
                label="Dream & Target Institutions"
                placeholder="e.g. National Institute of Technology, IIT Bombay, Stanford University"
                value={targetUniversities}
                onChange={(e) => setTargetUniversities(e.target.value)}
                helperText="Comma separated list of target institutions for recommendation matching"
              />
            </div>

            {/* Standardized Entrance Test Scores (Critical IELTS Section) */}
            <div className="space-y-4 pt-4 border-t border-slate-100 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Standardized Entrance Examination Scores
                </h3>
              </div>
              <p className="text-[11px] text-slate-600">
                Persisted directly into the backend database to calculate admission probabilities and match grants.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Critical IELTS Field */}
                <div>
                  <Input
                    label="IELTS Band Score (0.0 - 9.0)"
                    type="number"
                    step="0.5"
                    min={0.0}
                    max={9.0}
                    placeholder="7.5"
                    value={ieltsScore}
                    onChange={(e) => setIeltsScore(e.target.value)}
                    helperText="Valid academic band: 0.0 to 9.0"
                  />
                </div>

                {/* SAT */}
                <div>
                  <Input
                    label="SAT Composite Score (400 - 1600)"
                    type="number"
                    min={400}
                    max={1600}
                    placeholder="1480"
                    value={satScore}
                    onChange={(e) => setSatScore(e.target.value)}
                    helperText="Composite scale: 400 to 1600"
                  />
                </div>

                {/* High School GPA */}
                <div>
                  <Input
                    label="High School Cumulative GPA"
                    type="number"
                    step="0.01"
                    min={0.0}
                    max={10.0}
                    placeholder="9.2"
                    value={gpaScore}
                    onChange={(e) => setGpaScore(e.target.value)}
                    helperText="Standard 0.0 - 10.0 scale"
                  />
                </div>

                {/* JEE Main */}
                <div>
                  <Input
                    label="JEE Main Percentile / Marks"
                    type="number"
                    step="0.01"
                    placeholder="98.5"
                    value={jeeMainScore}
                    onChange={(e) => setJeeMainScore(e.target.value)}
                  />
                </div>

                {/* JEE Advanced */}
                <div>
                  <Input
                    label="JEE Advanced Score / Rank"
                    type="number"
                    placeholder="120"
                    value={jeeAdvScore}
                    onChange={(e) => setJeeAdvScore(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button
                type="submit"
                isLoading={updateMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-6"
              >
                <Save className="w-4 h-4" /> Save & Persist Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
