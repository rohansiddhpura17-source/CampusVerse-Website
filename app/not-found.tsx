import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowLeft, Search, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 shadow-xs">
        <GraduationCap className="w-8 h-8" aria-hidden="true" />
      </div>

      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Error 404</p>
      <h1 className="mt-2 text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
        The page you are looking for doesn&apos;t exist or may have moved. Explore our public sections below.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button size="md" className="gap-2">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Home
          </Button>
        </Link>
        <Link href="/features">
          <Button variant="outline" size="md" className="gap-2">
            <Search className="w-4 h-4" aria-hidden="true" /> Explore Features
          </Button>
        </Link>
        <Link href="/help">
          <Button variant="ghost" size="md" className="gap-2">
            <HelpCircle className="w-4 h-4" aria-hidden="true" /> Help Center
          </Button>
        </Link>
      </div>
    </div>
  );
}
