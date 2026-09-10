'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyRound, ArrowLeft, Mail, ShieldAlert } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      await authApi.forgotPassword(trimmedEmail);
      toastSuccess('Reset code dispatched! Check your email.');
      router.push(`/auth/reset-password?email=${encodeURIComponent(trimmedEmail)}`);
    } catch (err: any) {
      const message = err.message || 'Failed to dispatch password reset code.';
      setErrorMessage(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
        <KeyRound className="w-6 h-6" aria-hidden="true" />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Forgot Password</h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter your registered email and we will dispatch a 6-digit password reset code.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="student@campusverse.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" aria-hidden="true" />}
          autoComplete="email"
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Send Reset Code
        </Button>
      </form>

      <div className="pt-2 text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 focus:outline-none focus:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" aria-hidden="true" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
