import { UserRole } from '@/types/auth';

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
 * Open Redirect Protection & Role Verification:
 * Validates that redirect URL is strictly internal, not protocol-relative,
 * not an auth route, and permitted for the authenticated user's role.
 */
export function getSafeRedirectUrl(
  redirectUrl: string | null,
  userRole: UserRole,
  isAdminAuthorized: boolean
): string {
  if (!redirectUrl) return getRoleDashboard(userRole);

  const clean = redirectUrl.trim();

  // 1. Must be a strictly internal relative path starting with '/' and NOT '//' or '/\'
  if (!clean.startsWith('/') || clean.startsWith('//') || clean.startsWith('/\\') || clean.startsWith('\\')) {
    return getRoleDashboard(userRole);
  }

  // 2. Reject URLs with protocol schemes or colon anywhere in path
  const pathPart = clean.split('?')[0];
  if (pathPart.includes(':') || clean.toLowerCase().includes('javascript:') || clean.toLowerCase().includes('data:')) {
    return getRoleDashboard(userRole);
  }

  // 3. Reject URL-encoded slashes or backslashes (%2f, %5c)
  if (clean.includes('%2f') || clean.includes('%2F') || clean.includes('%5c') || clean.includes('%5C')) {
    return getRoleDashboard(userRole);
  }

  // 4. Reject internal auth paths to avoid redirect loops
  if (clean.startsWith('/auth/')) {
    return getRoleDashboard(userRole);
  }

  // 5. Verify user has permission for the requested route
  if (clean.startsWith('/admin')) {
    if (userRole !== 'ADMIN' || !isAdminAuthorized) {
      return getRoleDashboard(userRole);
    }
  }
  if (clean.startsWith('/student') && userRole !== 'STUDENT' && userRole !== 'ADMIN') {
    return getRoleDashboard(userRole);
  }
  if (clean.startsWith('/aspirant') && userRole !== 'ASPIRANT' && userRole !== 'ADMIN') {
    return getRoleDashboard(userRole);
  }
  if (clean.startsWith('/alumni') && userRole !== 'ALUMNI' && userRole !== 'ADMIN') {
    return getRoleDashboard(userRole);
  }

  return clean;
}
