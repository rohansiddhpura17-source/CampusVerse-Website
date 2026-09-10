'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alumniApi } from '@/lib/api/alumni';
import { SkillProgress } from '@/types/alumni';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Modal } from '@/components/ui/modal';
import {
  Award,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function AlumniSkillsPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('TECHNICAL');
  const [level, setLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('ADVANCED');
  const [assessmentScore, setAssessmentScore] = useState<number>(85);

  const {
    data: skills,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['alumniSkillsList'],
    queryFn: () => alumniApi.getSkills(),
  });

  const upsertMutation = useMutation({
    mutationFn: () =>
      alumniApi.upsertSkill({
        skillName: skillName.trim(),
        category,
        level,
        assessmentScore: Number(assessmentScore),
      }),
    onSuccess: () => {
      toastSuccess('Skill verified and saved!');
      setModalOpen(false);
      setSkillName('');
      queryClient.invalidateQueries({ queryKey: ['alumniSkillsList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to save skill'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => alumniApi.deleteSkill(id),
    onSuccess: () => {
      toastSuccess('Skill removed.');
      queryClient.invalidateQueries({ queryKey: ['alumniSkillsList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to delete skill'),
  });

  const handleUpsertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) {
      toastError('Please specify skill name.');
      return;
    }
    upsertMutation.mutate();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/alumni/career-ai"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Career AI
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Competency & Skill Development</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Catalog verified technical competencies, leadership proficiencies, and assessment benchmarks.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Add Competency
        </Button>
      </div>

      {/* Skills Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-800">Failed to load skills</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : !skills || skills.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Award className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No skills cataloged</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your technical specialties (e.g. Distributed Systems, Kubernetes, Go, System Design) to showcase competencies to recruiters and peers.
            </p>
            <Button
              size="sm"
              onClick={() => setModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
            >
              Add First Competency
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((s) => (
            <Card key={s.id || s.skillName} className="hover:border-purple-200 transition-colors">
              <CardContent className="p-5 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{s.skillName}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{s.category}</p>
                  </div>

                  <Badge
                    variant={
                      s.level === 'EXPERT'
                        ? 'primary'
                        : s.level === 'ADVANCED'
                        ? 'secondary'
                        : 'outline'
                    }
                    className="text-[10px]"
                  >
                    {s.level}
                  </Badge>
                </div>

                {/* Score bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Benchmark Rating</span>
                    <span className="font-bold text-purple-700">{s.assessmentScore || 85}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-600"
                      style={{ width: `${s.assessmentScore || 85}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>

                  {s.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMutation.mutate(s.id!)}
                      isLoading={deleteMutation.isPending}
                      className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200 p-1.5 h-auto"
                      title="Remove skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Skill Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Skill or Competency">
        <form onSubmit={handleUpsertSubmit} className="space-y-4">
          <Input
            label="Skill / Competency Name"
            placeholder="e.g. Distributed Consensus (Raft/Paxos), Kubernetes, Go"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-purple-500 focus:outline-none"
            >
              <option value="TECHNICAL">Technical & Architecture</option>
              <option value="LEADERSHIP">Engineering Leadership & Mentorship</option>
              <option value="INFRASTRUCTURE">Cloud & DevOps Infrastructure</option>
              <option value="PRODUCT">Technical Product Management</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Proficiency Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-purple-500 focus:outline-none"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Staff / Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assessment Score Benchmark ({assessmentScore}%)
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={assessmentScore}
              onChange={(e) => setAssessmentScore(parseInt(e.target.value, 10))}
              className="w-full accent-purple-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={upsertMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Save Competency
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
