'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

function UnauthorizedContent() {
  const { user, status, logout } = useAuth();
  const router = useRouter();

  const handleReturnDashboard = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    switch (user.role) {
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
        if (user.isAdminAuthorized) {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
        break;
      default:
        router.push('/');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <div className="space-y-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
        <ShieldAlert className="w-7 h-7" aria-hidden="true" />
      </div>

      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Access Restricted</h1>
        <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
          Your account does not have permission to access this area of the CampusVerse platform.
        </p>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        {status === 'authenticated' && user && (
          <Button onClick={handleReturnDashboard} className="w-full gap-2">
            <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> Return to My Dashboard
          </Button>
        )}

        <Link href="/">
          <Button variant="outline" className="w-full gap-2">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Return to Campus Homepage
          </Button>
        </Link>

        {status === 'authenticated' && (
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50">
            <LogOut className="w-4 h-4" aria-hidden="true" /> Sign Out
          </Button>
        )}
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center p-6 text-xs text-slate-400">Loading access status...</div>
      }
    >
      <UnauthorizedContent />
    </Suspense>
  );
}
