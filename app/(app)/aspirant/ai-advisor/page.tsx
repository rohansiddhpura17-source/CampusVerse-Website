'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AiAdvisorRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/aspirant/recommendations');
  }, [router]);

  return null;
}
