'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CommunitiesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/student/community');
  }, [router]);

  return null;
}
