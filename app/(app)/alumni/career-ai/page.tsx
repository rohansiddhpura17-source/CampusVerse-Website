'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { aiApi, AiResponse } from '@/lib/api/ai';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Send,
  Compass,
  Briefcase,
  Target,
  FileText,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';

export default function AlumniCareerAiPage() {
  const { error: toastError } = useToast();

  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'CAREER_GUIDANCE' | 'JOB_MATCHING' | 'SKILL_RECOMMENDATION' | 'INTERVIEW_PREP' | 'RESUME_REVIEW' | 'CAREER_ROADMAP'>('CAREER_GUIDANCE');
  const [topic, setTopic] = useState('');
  const [response, setResponse] = useState<AiResponse | null>(null);

  const aiMutation = useMutation({
    mutationFn: () => aiApi.askCareerAssistant(query.trim(), mode, topic.trim() || undefined),
    onSuccess: (data) => {
      setResponse(data);
    },
    onError: (err: any) => {
      toastError(err.message || 'AI Career Assistant encountered an error.');
    },
  });

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    aiMutation.mutate();
  };

  const samplePrompts: Record<string, string[]> = {
    CAREER_GUIDANCE: [
      'How to transition from Senior Engineer to Staff / Principal level?',
      'Best strategies for negotiating compensation packages at Series B/C startups?',
      'Developing cross-functional leadership skills as an IC engineer.'
    ],
    JOB_MATCHING: [
      'What roles should a 5-year full stack developer target next?',
      'High-growth tech sectors hiring engineering managers this quarter.'
    ],
    SKILL_RECOMMENDATION: [
      'Essential distributed systems concepts to master for L6 interviews.',
      'Kubernetes, Go, and eBPF learning trajectory for cloud engineers.'
    ],
    INTERVIEW_PREP: [
      'How to effectively structure the 45-minute System Design interview?',
      'Crafting compelling STAR method answers for behavioral leadership rounds.'
    ],
    RESUME_REVIEW: [
      'How to quantify business impact on a tech lead resume?',
      'Transforming generic bullet points into outcome-driven statements.'
    ],
    CAREER_ROADMAP: [
      '12-month engineering leadership progression milestones.',
      'Transition roadmap from software engineering into technical product management.'
    ]
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary" className="bg-purple-100 text-purple-800 border-purple-300 text-[10px]">
              AI Career Intelligence
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Career & Leadership Advisor</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Context-aware career coaching, executive transition guidance, and technical interview strategy.
          </p>
        </div>

        {/* Quick Hub Links */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/alumni/roadmap">
            <Button size="sm" variant="outline" className="text-xs gap-1">
              <Layers className="w-3.5 h-3.5 text-purple-600" /> Roadmaps
            </Button>
          </Link>
          <Link href="/alumni/skills">
            <Button size="sm" variant="outline" className="text-xs gap-1">
              <Award className="w-3.5 h-3.5 text-indigo-600" /> Skills
            </Button>
          </Link>
          <Link href="/alumni/mock-interview">
            <Button size="sm" variant="outline" className="text-xs gap-1">
              <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" /> Mock Interview
            </Button>
          </Link>
        </div>
      </div>

      {/* Advisory Modes */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'CAREER_GUIDANCE', label: 'Career Coaching', icon: <Compass className="w-3.5 h-3.5" /> },
          { id: 'JOB_MATCHING', label: 'Role Strategy', icon: <Briefcase className="w-3.5 h-3.5" /> },
          { id: 'SKILL_RECOMMENDATION', label: 'Skill Growth', icon: <Award className="w-3.5 h-3.5" /> },
          { id: 'INTERVIEW_PREP', label: 'Interview Strategy', icon: <BrainCircuit className="w-3.5 h-3.5" /> },
          { id: 'RESUME_REVIEW', label: 'Resume Impact', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'CAREER_ROADMAP', label: 'Milestone Planning', icon: <Layers className="w-3.5 h-3.5" /> },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id as any)}
            className={`px-3 py-2 rounded-xl font-medium shrink-0 flex items-center gap-1.5 transition-colors ${
              mode === m.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300'
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Query Form */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <form onSubmit={handleAsk} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Career or Leadership Query
              </label>
              <textarea
                rows={3}
                placeholder="Ask for advice on career promotions, system design frameworks, team leadership, or resume impact..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-purple-500 focus:outline-none leading-relaxed"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
              {/* Sample Prompts */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Suggestions:</span>
                {(samplePrompts[mode] || []).slice(0, 2).map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuery(prompt)}
                    className="text-[11px] text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-md transition-colors truncate max-w-[260px]"
                  >
                    &ldquo;{prompt}&rdquo;
                  </button>
                ))}
              </div>

              <Button
                type="submit"
                size="sm"
                isLoading={aiMutation.isPending}
                disabled={!query.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" /> Generate Advice
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Advisor Response Area */}
      {aiMutation.isPending && (
        <Card className="border-purple-200 bg-purple-50/20 animate-pulse">
          <CardContent className="p-6 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-purple-900">Synthesizing personalized career insights...</p>
            <p className="text-[11px] text-purple-600">Cross-referencing your alumni profile, seniority, and skills.</p>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card className={response.available ? 'border-purple-200' : 'border-amber-200 bg-amber-50/20'}>
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Advisor Analysis & Recommendations
            </CardTitle>
            <Badge variant={response.available ? 'primary' : 'outline'} className="text-[10px]">
              {response.available ? 'Live Gemini Engine' : 'Advisory Fallback Mode'}
            </Badge>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {response.available && response.response ? (
              <div className="prose prose-sm max-w-none text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                {response.response}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Live AI Gateway Status</p>
                    <p className="mt-0.5 text-amber-800 leading-relaxed">
                      {response.message || 'AI service key is not configured in server environment (GEMINI_API_KEY).'}
                    </p>
                  </div>
                </div>

                {response.suggestedTopics && response.suggestedTopics.length > 0 && (
                  <div className="pt-2 border-t border-amber-200">
                    <p className="text-xs font-bold text-slate-800 mb-2">Recommended Career Inquiry Topics:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {response.suggestedTopics.map((top, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setQuery(top)}
                          className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-purple-300 text-left text-xs text-slate-700 font-medium transition-colors"
                        >
                          &bull; {top}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
