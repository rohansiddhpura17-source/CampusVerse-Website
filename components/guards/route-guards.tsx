'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/types/auth';

interface GuardProps {
  children: React.ReactNode;
}

export function LoadingScreen({ message = 'Loading CampusVerse...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-700">
      <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
}

export function getRoleDashboard(role: UserRole): string {
  switch (role) {
    case 'STUDENT':
      return '/student/dashboard';
    case 'ASPIRANT':
      return '/aspirant/dashboard';
    case 'ALUMNI':
      return '/alumni/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/';
  }
}

/**
 * PublicRoute:
 * Accessible to anyone. If user is already authenticated and attempts to visit an auth page (/auth/*),
 * redirects them to their respective role dashboard, EXCEPT for /auth/unauthorized.
 */
export function PublicRoute({ children }: GuardProps) {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (
      status === 'authenticated' &&
      user &&
      pathname.startsWith('/auth/') &&
      pathname !== '/auth/unauthorized'
    ) {
      if (user.role === 'ADMIN' && !user.isAdminAuthorized) {
        return;
      }
      const targetDashboard = getRoleDashboard(user.role);
      router.replace(targetDashboard);
    }
  }, [status, user, pathname, router]);

  return <>{children}</>;
}

/**
 * AuthenticatedRoute:
 * Enforces valid active session. Redirects unauthenticated visitors to /auth/login.
 */
export function AuthenticatedRoute({ children }: GuardProps) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  if (status === 'loading') {
    return <LoadingScreen message="Verifying session credentials..." />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
}

/**
 * Role-Based Route Guards:
 * Checks authenticated user role. Redirects unauthorized access to /auth/unauthorized.
 */
export function RoleRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}) {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (status === 'authenticated' && user) {
      if (!allowedRoles.includes(user.role)) {
        router.replace('/auth/unauthorized');
        return;
      }

      // Strict check for Admin elevation
      if (user.role === 'ADMIN' && !user.isAdminAuthorized) {
        router.replace('/auth/unauthorized?reason=admin_authorization_required');
      }
    }
  }, [status, user, allowedRoles, router, pathname]);

  if (status === 'loading') {
    return <LoadingScreen message="Checking permissions..." />;
  }

  if (status === 'unauthenticated' || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  if (user.role === 'ADMIN' && !user.isAdminAuthorized) {
    return null;
  }

  return <>{children}</>;
}

export function StudentRoute({ children }: GuardProps) {
  return <RoleRoute allowedRoles={['STUDENT', 'ADMIN']}>{children}</RoleRoute>;
}

export function AspirantRoute({ children }: GuardProps) {
  return <RoleRoute allowedRoles={['ASPIRANT', 'ADMIN']}>{children}</RoleRoute>;
}

export function AlumniRoute({ children }: GuardProps) {
  return <RoleRoute allowedRoles={['ALUMNI', 'ADMIN']}>{children}</RoleRoute>;
}

export function AdminRoute({ children }: GuardProps) {
  return <RoleRoute allowedRoles={['ADMIN']}>{children}</RoleRoute>;
}
