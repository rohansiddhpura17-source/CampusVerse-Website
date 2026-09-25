'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Library,
  Bot,
  Calendar,
  Users,
  ShoppingBag,
  Compass,
  Scale,
  Award,
  Briefcase,
  UserCheck,
  MessageSquare,
  TrendingUp,
  ShieldAlert,
  Settings,
  LayoutDashboard,
  CheckCircle2,
  FileSpreadsheet,
  Megaphone,
  Bell,
  UserCircle,
  Sparkles,
} from 'lucide-react';

import { hasAdministrativeAccess } from '@/components/guards/route-guards';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  requiredPermission?: string;
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Admin Telemetry', href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, requiredPermission: 'analytics.read' },
  { label: 'User Directory', href: '/admin/users', icon: <Users className="w-4 h-4" />, requiredPermission: 'users.read' },
  { label: 'Verifications', href: '/admin/verification', icon: <CheckCircle2 className="w-4 h-4" />, requiredPermission: 'users.update' },
  { label: 'Moderation Queue', href: '/admin/moderation', icon: <ShieldAlert className="w-4 h-4" />, requiredPermission: 'moderation.read' },
  { label: 'Safety Reports', href: '/admin/reports', icon: <FileText className="w-4 h-4" />, requiredPermission: 'moderation.read' },
  { label: 'Marketplace', href: '/admin/marketplace', icon: <ShoppingBag className="w-4 h-4" />, requiredPermission: 'moderation.read' },
  { label: 'Campus Events', href: '/admin/events', icon: <Calendar className="w-4 h-4" />, requiredPermission: 'events.read' },
  { label: 'Jobs & Careers', href: '/admin/jobs', icon: <Briefcase className="w-4 h-4" />, requiredPermission: 'moderation.read' },
  { label: 'Mentorship', href: '/admin/mentorship', icon: <UserCheck className="w-4 h-4" />, requiredPermission: 'mentorship.read' },
  { label: 'Announcements', href: '/admin/announcements', icon: <Megaphone className="w-4 h-4" />, requiredPermission: 'events.read' },
  { label: 'Analytics & BI', href: '/admin/analytics', icon: <TrendingUp className="w-4 h-4" />, requiredPermission: 'analytics.read' },
  { label: 'Admin Profile', href: '/admin/profile', icon: <UserCircle className="w-4 h-4" /> },
  { label: 'Platform Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" />, requiredPermission: 'settings.manage' },
];

export const AppSidebar: React.FC<{ className?: string }> = ({ className }) => {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const getFilteredAdminNav = (): NavItem[] => {
    const isSuperAdmin = user.roles?.some((r) => r.toUpperCase() === 'SUPER_ADMIN');
    // If super admin or legacy verified admin without granular permissions assigned, grant all
    if (isSuperAdmin || (user.role === 'ADMIN' && user.isAdminAuthorized && (!user.permissions || user.permissions.length === 0))) {
      return ADMIN_NAV_ITEMS;
    }
    const perms = new Set(user.permissions || []);
    return ADMIN_NAV_ITEMS.filter((item) => {
      if (!item.requiredPermission) return true;
      return perms.has(item.requiredPermission);
    });
  };

  const getNavItems = (): NavItem[] => {
    // If in the /admin section and user has administrative access, render filtered admin navigation
    if (pathname.startsWith('/admin') && hasAdministrativeAccess(user)) {
      return getFilteredAdminNav();
    }

    switch (user.role) {
      case 'STUDENT':
        return [
          { label: 'Dashboard', href: '/student/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Academics', href: '/student/academics', icon: <BookOpen className="w-4 h-4" /> },
          { label: 'Notes Hub', href: '/student/notes', icon: <FileText className="w-4 h-4" /> },
          { label: 'Library', href: '/student/library', icon: <Library className="w-4 h-4" /> },
          { label: 'Marketplace', href: '/student/marketplace', icon: <ShoppingBag className="w-4 h-4" /> },
          { label: 'Events', href: '/student/events', icon: <Calendar className="w-4 h-4" /> },
          { label: 'Community', href: '/student/community', icon: <Users className="w-4 h-4" /> },
          { label: 'AI Study Tutor', href: '/student/ai-study', icon: <Bot className="w-4 h-4" /> },
          { label: 'Notifications', href: '/student/notifications', icon: <Bell className="w-4 h-4" /> },
          { label: 'Profile', href: '/student/profile', icon: <UserCircle className="w-4 h-4" /> },
          { label: 'Settings', href: '/student/settings', icon: <Settings className="w-4 h-4" /> },
        ];
      case 'ASPIRANT':
        return [
          { label: 'Dashboard', href: '/aspirant/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'College Explorer', href: '/aspirant/colleges', icon: <Compass className="w-4 h-4" /> },
          { label: 'Compare Colleges', href: '/aspirant/compare', icon: <Scale className="w-4 h-4" /> },
          { label: 'Admission Predictor', href: '/aspirant/predictor', icon: <TrendingUp className="w-4 h-4" /> },
          { label: 'Scholarships', href: '/aspirant/scholarships', icon: <Award className="w-4 h-4" /> },
          { label: 'Saved Scholarships', href: '/aspirant/saved-scholarships', icon: <Award className="w-4 h-4" /> },
          { label: 'Recommendations', href: '/aspirant/recommendations', icon: <Sparkles className="w-4 h-4" /> },
          { label: 'Notifications', href: '/aspirant/notifications', icon: <Bell className="w-4 h-4" /> },
          { label: 'Profile', href: '/aspirant/profile', icon: <UserCircle className="w-4 h-4" /> },
          { label: 'Settings', href: '/aspirant/settings', icon: <Settings className="w-4 h-4" /> },
        ];
      case 'ALUMNI':
        return [
          { label: 'Dashboard', href: '/alumni/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Alumni Network', href: '/alumni/network', icon: <Users className="w-4 h-4" /> },
          { label: 'Careers & Jobs', href: '/alumni/careers', icon: <Briefcase className="w-4 h-4" /> },
          { label: 'My Applications', href: '/alumni/applications', icon: <FileSpreadsheet className="w-4 h-4" /> },
          { label: 'Mentorship Hub', href: '/alumni/mentorship', icon: <UserCheck className="w-4 h-4" /> },
          { label: 'Messages', href: '/alumni/messages', icon: <MessageSquare className="w-4 h-4" /> },
          { label: 'Career AI & Roadmap', href: '/alumni/career-ai', icon: <Sparkles className="w-4 h-4" /> },
          { label: 'Events & Reunions', href: '/alumni/events', icon: <Calendar className="w-4 h-4" /> },
          { label: 'Notifications', href: '/alumni/notifications', icon: <Bell className="w-4 h-4" /> },
          { label: 'Profile', href: '/alumni/profile', icon: <UserCircle className="w-4 h-4" /> },
          { label: 'Settings', href: '/alumni/settings', icon: <Settings className="w-4 h-4" /> },
        ];
      case 'ADMIN':
        return getFilteredAdminNav();
      default:
        return hasAdministrativeAccess(user) ? getFilteredAdminNav() : [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside
      className={cn(
        'w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 h-screen sticky top-0',
        className
      )}
    >
      <div className="overflow-y-auto">
        <Link href="/" className="flex items-center gap-2.5 px-6 h-16 border-b border-slate-100 hover:bg-slate-50 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-slate-900 leading-none block">CampusVerse</span>
            <span className="text-[10px] font-semibold text-brand-600 tracking-wider uppercase">
              {pathname.startsWith('/admin') ? 'ADMIN CONSOLE' : `${user.role} PORTAL`}
            </span>
          </div>
        </Link>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/student/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                )}
              >
                <span className={cn(isActive ? 'text-brand-600' : 'text-slate-400')}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400 bg-white">
        <p>CampusVerse Web v1.0.0</p>
        <p>© 2026 CampusVerse Ecosystem</p>
      </div>
    </aside>
  );
};
