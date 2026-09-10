'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LifeBuoy,
  ArrowLeft,
  Mail,
  Send,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export default function AlumniAccountRecoverySettingsPage() {
  const { success: toastSuccess, error: toastError } = useToast();

  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [reason, setReason] = useState('Emergency backup recovery email registration');
  const [submitted, setSubmitted] = useState(false);

  const recoveryMutation = useMutation({
    mutationFn: () =>
      usersApi.submitAccountRecovery({
        recoveryEmail: recoveryEmail.trim(),
        reason: reason.trim(),
      }),
    onSuccess: () => {
      toastSuccess('Backup recovery email verified and archived!');
      setSubmitted(true);
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to register recovery contact');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) {
      toastError('Please specify a valid recovery email address.');
      return;
    }
    recoveryMutation.mutate();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back Link */}
      <Link
        href="/alumni/settings"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Settings
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Emergency Account Recovery</h1>
        <p className="text-xs text-slate-500 mt-1">
          Register an alternate emergency email address to regain platform access in the event of primary mailbox loss.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-900">Recovery Contact Registered</h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                <span className="font-bold">{recoveryEmail}</span> is now archived as your designated secondary recovery address.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Secondary Emergency Email Address"
                type="email"
                placeholder="e.g. personal.backup@gmail.com"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                helperText="Must be distinct from your primary CampusVerse login email address"
                required
              />

              <Input
                label="Verification Justification"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  size="sm"
                  isLoading={recoveryMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5 px-5"
                >
                  <Send className="w-3.5 h-3.5" /> Register Recovery Contact
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
