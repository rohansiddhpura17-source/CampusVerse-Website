'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerificationsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/verification');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-xs text-slate-500 font-mono">Redirecting to Verification Queue...</p>
    </div>
  );
}
