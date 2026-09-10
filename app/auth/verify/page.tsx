'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MailCheck, Mail, ShieldAlert, ArrowLeft } from 'lucide-react';

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const { refreshSession } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address');
      return;
    }

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setErrorMessage('Please enter the full 6-digit numeric verification code');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.verifyOtp(trimmedEmail, otp, 'EMAIL_VERIFICATION');
      toastSuccess('Email verified successfully!');

      const updatedUser = await refreshSession();

      if (updatedUser) {
        switch (updatedUser.role) {
          case 'STUDENT':
            router.push('/student/dashboard');
            break;
          case 'ASPIRANT':
            router.push('/aspirant/dashboard');
            break;
          case 'ALUMNI':
            router.push('/alumni/dashboard');
            break;
          case 'ADMIN':
            if (updatedUser.isAdminAuthorized) {
              router.push('/admin/dashboard');
            } else {
              router.push('/auth/unauthorized?reason=admin_authorization_required');
            }
            break;
          default:
            router.push('/');
        }
      } else {
        router.push('/auth/login?verified=true');
      }
    } catch (err: any) {
      const message = err.message || 'Invalid or expired verification code.';
      setErrorMessage(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address to resend the code');
      return;
    }

    setIsResending(true);
    setErrorMessage(null);
    try {
      await authApi.sendOtp(trimmedEmail, 'EMAIL_VERIFICATION');
      toastSuccess('New verification code sent to your email');
      setCooldown(60);
    } catch (err: any) {
      const message = err.message || 'Failed to resend verification code.';
      setErrorMessage(message);
      toastError(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
        <MailCheck className="w-6 h-6" aria-hidden="true" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Verify your email</h2>
        <p className="text-xs text-slate-500 mt-1">
          {email ? (
            <>
              Enter the 6-digit security code sent to{' '}
              <span className="font-semibold text-slate-800">{email}</span>
            </>
          ) : (
            'Enter your registered email and 6-digit verification code.'
          )}
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 text-left">
          <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4 text-left">
        {!initialEmail && (
          <Input
            label="Email Address"
            type="email"
            placeholder="student@campusverse.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" aria-hidden="true" />}
            required
          />
        )}

        <Input
          label="Verification Code"
          type="text"
          maxLength={6}
          placeholder="123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          className="text-center tracking-widest text-lg font-mono font-bold"
          autoComplete="one-time-code"
          autoFocus
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Confirm Code
        </Button>
      </form>

      <div className="text-xs text-slate-500">
        Didn&apos;t receive the code?{' '}
        <button
          type="button"
          disabled={cooldown > 0 || isResending}
          onClick={handleResend}
          className="font-semibold text-brand-600 hover:text-brand-700 disabled:text-slate-400 disabled:cursor-not-allowed focus:outline-none focus:underline"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}
        </button>
      </div>

      <div className="pt-2">
        <Link
          href="/auth/login"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" aria-hidden="true" /> Return to sign in
        </Link>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center p-6 text-xs text-slate-400">Loading verification...</div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}
