'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alumniApi } from '@/lib/api/alumni';
import { CareerRoadmap } from '@/types/alumni';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Modal } from '@/components/ui/modal';
import {
  Layers,
  ArrowLeft,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function AlumniRoadmapPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTargetRole, setNewTargetRole] = useState('');
  const [milestonesInput, setMilestonesInput] = useState([
    { title: 'Master Distributed Systems & High-Throughput Pipelines', targetQuarter: 'Q1', completed: true },
    { title: 'Drive Architecture Review for Core Microservices', targetQuarter: 'Q2', completed: false },
    { title: 'Publish Engineering Design RFC & Mentor 2 Senior Engineers', targetQuarter: 'Q3', completed: false },
  ]);

  const {
    data: roadmaps,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['alumniRoadmapsList'],
    queryFn: () => alumniApi.getCareerRoadmaps(),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      alumniApi.createRoadmap({
        title: newTitle.trim(),
        targetRole: newTargetRole.trim(),
        milestones: milestonesInput.map((m, idx) => ({ id: `m_${Date.now()}_${idx}`, ...m })),
      }),
    onSuccess: () => {
      toastSuccess('Career roadmap created!');
      setCreateModalOpen(false);
      setNewTitle('');
      setNewTargetRole('');
      queryClient.invalidateQueries({ queryKey: ['alumniRoadmapsList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to create roadmap'),
  });

  const toggleMilestoneMutation = useMutation({
    mutationFn: async ({ roadmap, milestoneIndex }: { roadmap: CareerRoadmap; milestoneIndex: number }) => {
      const updatedMilestones = [...roadmap.milestones];
      updatedMilestones[milestoneIndex] = {
        ...updatedMilestones[milestoneIndex],
        completed: !updatedMilestones[milestoneIndex].completed,
      };
      return alumniApi.updateRoadmap(roadmap.id, { milestones: updatedMilestones });
    },
    onSuccess: () => {
      toastSuccess('Milestone updated!');
      queryClient.invalidateQueries({ queryKey: ['alumniRoadmapsList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to update milestone'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => alumniApi.deleteRoadmap(id),
    onSuccess: () => {
      toastSuccess('Roadmap deleted.');
      queryClient.invalidateQueries({ queryKey: ['alumniRoadmapsList'] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to delete roadmap'),
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTargetRole.trim()) {
      toastError('Please specify roadmap title and target role.');
      return;
    }
    createMutation.mutate();
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Career Roadmaps & Milestones</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured quarterly progression goals, executive transitions, and skill milestones.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setCreateModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Create Roadmap
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-800">Failed to load career roadmaps</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : !roadmaps || roadmaps.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No career roadmaps created</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Build your first milestone roadmap targeting Staff Engineer, Engineering Manager, or Founder.
            </p>
            <Button
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
            >
              Create Career Roadmap
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {roadmaps.map((rm) => {
            const milestones = Array.isArray(rm.milestones) ? rm.milestones : [];
            const completedCount = milestones.filter((m) => m.completed).length;
            const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

            return (
              <Card key={rm.id} className="hover:border-purple-200 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="primary" className="bg-purple-100 text-purple-800 border-purple-300 text-[10px]">
                          Target: {rm.targetRole}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {completedCount} of {milestones.length} Milestones Achieved
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 mt-1">{rm.title}</h2>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteMutation.mutate(rm.id)}
                        isLoading={deleteMutation.isPending}
                        className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                        title="Delete Roadmap"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">Progress</span>
                      <span className="text-purple-700">{progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestones Checklist */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    {milestones.map((m, idx) => (
                      <div
                        key={m.id || idx}
                        onClick={() => toggleMilestoneMutation.mutate({ roadmap: rm, milestoneIndex: idx })}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          m.completed
                            ? 'bg-purple-50/40 border-purple-200 text-slate-800'
                            : 'bg-white border-slate-200 hover:border-purple-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {m.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                          )}
                          <span
                            className={`text-xs font-medium line-clamp-1 ${
                              m.completed ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {m.title}
                          </span>
                        </div>

                        {m.targetQuarter && (
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            {m.targetQuarter}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Roadmap Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Career Roadmap"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Roadmap Title"
            placeholder="e.g. 2026 Staff Engineer Technical Promotion Plan"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <Input
            label="Target Professional Role"
            placeholder="e.g. Staff Software Engineer, Tech Lead Manager"
            value={newTargetRole}
            onChange={(e) => setNewTargetRole(e.target.value)}
            required
          />

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Initial Milestones</label>
            {milestonesInput.map((m, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={m.title}
                  onChange={(e) => {
                    const copy = [...milestonesInput];
                    copy[idx].title = e.target.value;
                    setMilestonesInput(copy);
                  }}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  placeholder={`Milestone ${idx + 1}`}
                  required
                />
                <input
                  type="text"
                  value={m.targetQuarter}
                  onChange={(e) => {
                    const copy = [...milestonesInput];
                    copy[idx].targetQuarter = e.target.value;
                    setMilestonesInput(copy);
                  }}
                  className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-center font-bold"
                  placeholder="Q1/Q2"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={createMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Save Roadmap
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
