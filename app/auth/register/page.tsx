'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, ShieldAlert } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid university or personal email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain both letters and numbers'),
  role: z.enum(['STUDENT', 'ASPIRANT', 'ALUMNI'] as const),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterForm() {
  const { register: registerAuth } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRole = searchParams.get('role') || 'STUDENT';
  const preselectedRole = ['STUDENT', 'ASPIRANT', 'ALUMNI'].includes(requestedRole)
    ? (requestedRole as 'STUDENT' | 'ASPIRANT' | 'ALUMNI')
    : 'STUDENT';

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: preselectedRole,
    },
  });

  const selectedRole = watch('role');

  const roleOptions: { value: 'STUDENT' | 'ASPIRANT' | 'ALUMNI'; label: string; desc: string }[] = [
    { value: 'STUDENT', label: 'University Student', desc: 'Active student taking courses and joining campus clubs' },
    { value: 'ASPIRANT', label: 'College Aspirant', desc: 'Prospective applicant researching schools and admissions' },
    { value: 'ALUMNI', label: 'Graduate / Alumni', desc: 'Professional alumnus mentoring and sharing opportunities' },
  ];

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await registerAuth(data as any);
      toastSuccess('Account created! Verification code sent to email.');
      router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      const message = err.message || 'Registration failed. Please check your details.';
      setErrorMessage(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create your account</h2>
        <p className="text-xs text-slate-500 mt-1">
          Select your campus role to unlock tailored capabilities
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role Selector Cards */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            I am joining as:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {roleOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('role', opt.value)}
                className={`p-2.5 rounded-xl border text-left transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  selectedRole === opt.value
                    ? 'border-brand-600 bg-brand-50/50 text-brand-900 ring-1 ring-brand-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <p className="text-xs font-bold leading-tight">{opt.label}</p>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Full Name"
          placeholder="Aarav Sharma"
          error={errors.name?.message}
          leftIcon={<UserIcon className="w-4 h-4" aria-hidden="true" />}
          autoComplete="name"
          {...register('name')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="student@campusverse.edu"
          error={errors.email?.message}
          leftIcon={<Mail className="w-4 h-4" aria-hidden="true" />}
          autoComplete="email"
          {...register('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.password?.message}
          helperText="At least 8 characters with letters and numbers required"
          leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
          autoComplete="new-password"
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-900"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Eye className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          }
          {...register('password')}
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Create Account
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
        Already have an account?{' '}
        <Link
          href="/auth/login"
          className="font-semibold text-brand-600 hover:text-brand-700 focus:outline-none focus:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center p-6 text-xs text-slate-400">Loading registration...</div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
