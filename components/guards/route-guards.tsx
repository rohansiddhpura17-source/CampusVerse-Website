'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { UserRole, User } from '@/types/auth';

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

export const ADMINISTRATIVE_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'MODERATOR',
  'CONTENT_MANAGER',
  'SUPPORT_ADMIN',
  'ANALYTICS_ADMIN',
];

/**
 * Checks whether the user has effective administrative access based on:
 * 1. Granular RBAC roles (SUPER_ADMIN, ADMIN, MODERATOR, CONTENT_MANAGER, SUPPORT_ADMIN, ANALYTICS_ADMIN)
 * 2. Granted administrative permissions
 * 3. Legacy role 'ADMIN' with isAdminAuthorized === true
 */
export function hasAdministrativeAccess(user?: User | null): boolean {
  if (!user) return false;
  if (user.role === 'ADMIN' && user.isAdminAuthorized) return true;
  if (user.roles && user.roles.some((r: string) => ADMINISTRATIVE_ROLES.includes(r.toUpperCase()))) {
    return true;
  }
  if (user.permissions && user.permissions.length > 0) {
    return true;
  }
  return false;
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

export function getUserDashboard(user: User): string {
  if (hasAdministrativeAccess(user)) {
    return '/admin/dashboard';
  }
  return getRoleDashboard(user.role);
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
      if (user.role === 'ADMIN' && !user.isAdminAuthorized && !hasAdministrativeAccess(user)) {
        return;
      }
      const targetDashboard = getUserDashboard(user);
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
      const isAllowed =
        allowedRoles.includes(user.role) ||
        (allowedRoles.includes('ADMIN') && hasAdministrativeAccess(user));

      if (!isAllowed) {
        router.replace('/auth/unauthorized');
        return;
      }

      // Strict check for unverified legacy Admin without granular roles
      if (user.role === 'ADMIN' && !user.isAdminAuthorized && !hasAdministrativeAccess(user)) {
        router.replace('/auth/unauthorized?reason=admin_authorization_required');
      }
    }
  }, [status, user, allowedRoles, router, pathname]);

  if (status === 'loading') {
    return <LoadingScreen message="Checking permissions..." />;
  }

  const isAllowed =
    user &&
    (allowedRoles.includes(user.role) ||
      (allowedRoles.includes('ADMIN') && hasAdministrativeAccess(user)));

  if (status === 'unauthenticated' || !user || !isAllowed) {
    return null;
  }

  if (user.role === 'ADMIN' && !user.isAdminAuthorized && !hasAdministrativeAccess(user)) {
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
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (status === 'authenticated' && user) {
      if (!hasAdministrativeAccess(user)) {
        router.replace('/auth/unauthorized');
      }
    }
  }, [status, user, router, pathname]);

  if (status === 'loading') {
    return <LoadingScreen message="Checking administrative permissions..." />;
  }

  if (status === 'unauthenticated' || !user || !hasAdministrativeAccess(user)) {
    return null;
  }

  return <>{children}</>;
}
