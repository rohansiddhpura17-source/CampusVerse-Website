'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AiTutorRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/student/ai-study');
  }, [router]);

  return null;
}
