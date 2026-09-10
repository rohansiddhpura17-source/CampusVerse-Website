'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ComparisonRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/aspirant/compare');
  }, [router]);

  return null;
}
