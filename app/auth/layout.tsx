import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { PublicRoute } from '@/components/guards/route-guards';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicRoute>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <a href="/" className="inline-flex items-center gap-2.5 font-bold text-xl text-slate-900">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span>CampusVerse</span>
          </a>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
          <div className="bg-white py-8 px-6 sm:px-8 shadow-sm border border-slate-200 rounded-2xl">
            <React.Suspense fallback={<div className="p-6 text-center text-xs text-slate-400">Loading auth...</div>}>
              {children}
            </React.Suspense>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-bit SSL encrypted campus ecosystem</span>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
