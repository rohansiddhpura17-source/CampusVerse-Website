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
  HelpCircle,
  BookOpen,
  Code,
  FileQuestion,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: string;
  topic?: string;
  isUnavailableNotice?: boolean;
  suggestedTopics?: string[];
}

export default function StudentAiStudyPage() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState<'EXPLAIN' | 'SUMMARIZE' | 'CONCEPT_QA' | 'SOLVE_STEP_BY_STEP'>('EXPLAIN');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const askMutation = useMutation({
    mutationFn: async (payload: {
      query: string;
      mode: 'EXPLAIN' | 'SUMMARIZE' | 'CONCEPT_QA' | 'SOLVE_STEP_BY_STEP';
      topic?: string;
    }) => {
      return aiApi.askStudyAssistant(payload.query, payload.mode, payload.topic);
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
        // Server key not configured or service reported unavailable
        setMessages((prev) => [
          ...prev,
          {
            id: `notice_${Date.now()}`,
            role: 'assistant',
            content:
              data.message ||
              'The AI Study Assistant backend service is currently running without an external AI API key configured on the server.',
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
          content: `Backend request failed: ${err.message || 'Unable to connect to the AI service.'}. Please try again later.`,
          isUnavailableNotice: true,
        },
      ]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || askMutation.isPending) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: trimmed,
      mode,
      topic: topic.trim() || undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');

    // Trigger mutation
    askMutation.mutate({
      query: trimmed,
      mode,
      topic: topic.trim() || undefined,
    });
  };

  const handleTopicClick = (suggested: string) => {
    setQuery(`Explain the core principles of ${suggested} with an example.`);
    setTopic(suggested);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const modes: { value: 'EXPLAIN' | 'SUMMARIZE' | 'CONCEPT_QA' | 'SOLVE_STEP_BY_STEP'; label: string; desc: string }[] = [
    { value: 'EXPLAIN', label: 'Explain Concept', desc: 'Intuitive breakdown with analogies' },
    { value: 'SUMMARIZE', label: 'Summarize', desc: 'Concise bullet points & takeaways' },
    { value: 'CONCEPT_QA', label: 'Concept Q&A', desc: 'Exam questions & key answers' },
    { value: 'SOLVE_STEP_BY_STEP', label: 'Step-by-Step', desc: 'Mathematical & algorithmic walkthrough' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Study Assistant</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Connected to the CampusVerse AI tutor backend. Ask questions on DSA, operating systems, database theory, or network protocols.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {modes.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMode(m.value)}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              mode === m.value
                ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950 ring-1 ring-indigo-600'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <p className="text-xs font-bold">{m.label}</p>
            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{m.desc}</p>
          </button>
        ))}
      </div>

      {/* Conversation Feed */}
      <Card className="min-h-[380px] flex flex-col justify-between">
        <CardContent className="p-6 flex-1 flex flex-col">
          {messages.length === 0 ? (
            <div className="my-auto py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900">How can I assist your study session today?</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Type a concept question below, or select a syllabus topic to begin:
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto pt-2">
                {[
                  'B-Trees vs B+ Trees',
                  'Dijkstra Shortest Path',
                  'TCP 3-Way Handshake',
                  'Cache Coherence Protocols',
                  'Deadlock Prevention in OS',
                ].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTopicClick(t)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
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
                          ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                          : msg.isUnavailableNotice
                          ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-bl-xs'
                          : 'bg-slate-100 text-slate-900 rounded-bl-xs'
                      }`}
                    >
                      {!isUser && (
                        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-200/60">
                          <div className="flex items-center gap-1.5 font-bold text-[11px] text-indigo-900">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <span>CampusVerse AI Tutor</span>
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

                      {/* Suggested Topics from Backend Service */}
                      {msg.suggestedTopics && msg.suggestedTopics.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-amber-200/80 space-y-1.5">
                          <p className="font-bold text-[10px] uppercase text-amber-800">
                            Suggested Curricular Topics:
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
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    <span>Analyzing concept and synthesizing explanation...</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prompt Input Form */}
          <form onSubmit={handleSubmit} className="pt-4 mt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Specific course / topic (Optional, e.g. CS301 - Distributed Systems)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask your question (e.g. How does 2-Phase Commit prevent inconsistent distributed state?)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={askMutation.isPending}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Button
                type="submit"
                isLoading={askMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 px-4"
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
