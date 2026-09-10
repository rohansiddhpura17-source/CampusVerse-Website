import React from 'react';
import { PublicNav } from '@/components/navigation/public-nav';
import { PublicFooter } from '@/components/navigation/public-footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <PublicNav />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
