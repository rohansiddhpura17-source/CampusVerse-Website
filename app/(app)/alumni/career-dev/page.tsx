'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CareerDevRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/alumni/career-ai');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-xs text-slate-500">Redirecting to Career AI Advisor...</p>
    </div>
  );
}
