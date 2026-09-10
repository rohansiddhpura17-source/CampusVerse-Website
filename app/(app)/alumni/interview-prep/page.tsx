'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BrainCircuit,
  ArrowLeft,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-react';

export default function AlumniInterviewPrepPage() {
  const frameworks = [
    {
      title: 'System Design Framework (45-Minute Blueprint)',
      category: 'Architecture',
      description: 'Structured methodology for scalable distributed system interviews.',
      steps: [
        'Clarify Requirements & Constraints (5 mins: DAU, Read/Write ratio, Latency budget)',
        'Capacity Estimation & Back-of-the-envelope calculations (5 mins: QPS, Storage/5 yrs, Bandwidth)',
        'High-Level API & Data Model Definition (10 mins: Endpoints, relational vs NoSQL, schema)',
        'Core Component Deep-Dive & Bottleneck Mitigation (20 mins: Caching, Partitioning, Replication)',
        'Resilience & Edge-Case Failure Handling (5 mins: Circuit breakers, rate limiters, fallback queues)'
      ]
    },
    {
      title: 'STAR Leadership Framework for Senior Engineers',
      category: 'Behavioral',
      description: 'Demonstrate measurable organizational impact and conflict resolution.',
      steps: [
        'Situation: Contextualize the critical business challenge, cross-functional team scope, and stakes.',
        'Task: Clearly define your specific ownership and leadership mandate.',
        'Action: Detail technical decisions, architectural trade-offs, and team alignment initiatives.',
        'Result: Highlight quantified business outcomes (e.g. 40% latency reduction, $120k cloud savings).'
      ]
    },
    {
      title: 'Distributed Consensus & Data Consistency',
      category: 'Distributed Systems',
      description: 'Key principles tested in Staff & Principal engineering rounds.',
      steps: [
        'Raft vs Multi-Paxos leader election and log replication guarantees.',
        'Eventual consistency mitigation with Vector Clocks and Read-Repair.',
        'Two-Phase Commit (2PC) vs Saga pattern for distributed transactions across microservices.',
        'Idempotent API design using unique client tokens and dedup caches.'
      ]
    }
  ];

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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Interview Preparation Hub</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Architectural frameworks, behavioral rubrics, and interactive mock interview simulations.
          </p>
        </div>

        <Link href="/alumni/mock-interview">
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5 self-start sm:self-auto">
            <BrainCircuit className="w-3.5 h-3.5" /> Launch Mock Interview
          </Button>
        </Link>
      </div>

      {/* Framework Cards */}
      <div className="space-y-4">
        {frameworks.map((fw, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <Badge variant="outline" className="text-[10px] mb-1">
                  {fw.category}
                </Badge>
                <CardTitle className="text-base font-bold text-slate-900">{fw.title}</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">{fw.description}</p>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-2">
                {fw.steps.map((st, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Simulator Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-800 to-indigo-900 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold">Ready to test your responses?</h3>
          <p className="text-xs text-purple-200">
            Run an interactive mock interview evaluation with recorded transcript and real benchmark scoring.
          </p>
        </div>
        <Link href="/alumni/mock-interview">
          <Button size="sm" className="bg-white text-purple-900 hover:bg-purple-50 text-xs font-bold shrink-0">
            Start Mock Session &rarr;
          </Button>
        </Link>
      </div>
    </div>
  );
}
