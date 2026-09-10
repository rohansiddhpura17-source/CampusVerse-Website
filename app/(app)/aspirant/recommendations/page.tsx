'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { aiApi, AiResponse } from '@/lib/api/ai';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sparkles,
  Send,
  Compass,
  Award,
  BookOpen,
  GraduationCap,
  Copy,
  Check,
  Lightbulb,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface RecommendationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: string;
  topic?: string;
  isUnavailableNotice?: boolean;
  suggestedTopics?: string[];
}

export default function AspirantRecommendationsPage() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState<
    'COLLEGE_RECOMMENDATION' | 'SCHOLARSHIP_ADVICE' | 'COURSE_SELECTION' | 'CAREER_DIRECTION' | 'EXAM_PREP'
  >('COLLEGE_RECOMMENDATION');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<RecommendationMessage[]>([]);

  const askMutation = useMutation({
    mutationFn: async (payload: {
      query: string;
      mode: 'COLLEGE_RECOMMENDATION' | 'SCHOLARSHIP_ADVICE' | 'COURSE_SELECTION' | 'CAREER_DIRECTION' | 'EXAM_PREP';
      topic?: string;
    }) => {
      return aiApi.getAspirantRecommendations(payload.query, payload.mode, payload.topic);
    },
    onSuccess: (data: AiResponse) => {
      if (data.available && data.response) {
        setMessages((prev) => [
          ...prev,
          {
            id: `asst_${Date.now()}`,
            role: 'assistant',
            content: data.response || '',
            mode: data.mode,
            topic,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `notice_${Date.now()}`,
            role: 'assistant',
            content:
              data.message ||
              'The AI Admissions & Recommendations Assistant backend service is currently running without an external AI API key configured on the server.',
            isUnavailableNotice: true,
            suggestedTopics: data.suggestedTopics,
          },
        ]);
      }
    },
    onError: (err: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `Backend request failed: ${err.message || 'Unable to connect to admissions service.'}. Please try again later.`,
          isUnavailableNotice: true,
        },
      ]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || askMutation.isPending) return;

    const userMsg: RecommendationMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: trimmed,
      mode,
      topic: topic.trim() || undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');

    askMutation.mutate({
      query: trimmed,
      mode,
      topic: topic.trim() || undefined,
    });
  };

  const handleTopicClick = (suggested: string) => {
    setQuery(`What are the key admissions criteria and strategies for ${suggested}?`);
    setTopic(suggested);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const modes: {
    value: 'COLLEGE_RECOMMENDATION' | 'SCHOLARSHIP_ADVICE' | 'COURSE_SELECTION' | 'CAREER_DIRECTION' | 'EXAM_PREP';
    label: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    { value: 'COLLEGE_RECOMMENDATION', label: 'College Matching', desc: 'Find target, reach & safety colleges', icon: <Compass className="w-3.5 h-3.5" /> },
    { value: 'SCHOLARSHIP_ADVICE', label: 'Scholarships & Grants', desc: 'Identify merit & need-based funding', icon: <Award className="w-3.5 h-3.5" /> },
    { value: 'COURSE_SELECTION', label: 'Degree & Major', desc: 'Compare curriculum specs & specializations', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { value: 'EXAM_PREP', label: 'Standardized Tests', desc: 'JEE, SAT, IELTS, TOEFL benchmarks', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { value: 'CAREER_DIRECTION', label: 'Career Outcomes', desc: 'Post-graduation placement & roles', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Admissions & Recommendations</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Connected to the CampusVerse admissions intelligence backend. Ask for personalized institution shortlists, test preparation targets, or scholarship opportunities.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {modes.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMode(m.value)}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              mode === m.value
                ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 ring-1 ring-emerald-600'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs">
              {m.icon}
              <span className="truncate">{m.label}</span>
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{m.desc}</p>
          </button>
        ))}
      </div>

      {/* Conversation / Advisory Feed */}
      <Card className="min-h-[400px] flex flex-col justify-between">
        <CardContent className="p-6 flex-1 flex flex-col">
          {messages.length === 0 ? (
            <div className="my-auto py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900">How can we assist your university journey today?</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Type an admissions query below or pick a common topic to get started:
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto pt-2">
                {[
                  'Top CS programs in India vs USA',
                  'Engineering scholarships for 2026',
                  'JEE Main vs SAT dual prep strategy',
                  'B.Tech CSE vs AI & Data Science comparison',
                  'Target IELTS band score for Top 50 universities',
                ].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTopicClick(t)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 flex-1 overflow-y-auto">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                          : msg.isUnavailableNotice
                          ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-bl-xs'
                          : 'bg-slate-100 text-slate-900 rounded-bl-xs'
                      }`}
                    >
                      {!isUser && (
                        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-200/60">
                          <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-900">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span>CampusVerse Admissions Advisor</span>
                          </div>
                          {!msg.isUnavailableNotice && (
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="text-slate-400 hover:text-slate-700"
                              title="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      )}

                      <div className="whitespace-pre-line">{msg.content}</div>

                      {msg.suggestedTopics && msg.suggestedTopics.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-amber-200/80 space-y-1.5">
                          <p className="font-bold text-[10px] uppercase text-amber-800">
                            Suggested Curricular Inquiries:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.suggestedTopics.map((s, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleTopicClick(s)}
                                className="px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-300 text-[10px] hover:bg-amber-100"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {askMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-2xl rounded-bl-xs p-4 text-xs text-slate-500 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Evaluating admissions context and computing recommendations...</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prompt Form */}
          <form onSubmit={handleSubmit} className="pt-4 mt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Specific context or dream institutions (Optional, e.g. B.Tech in CSE with 92% JEE)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about college selectivity, cutoff trends, exam benchmarks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={askMutation.isPending}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Button
                type="submit"
                isLoading={askMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
