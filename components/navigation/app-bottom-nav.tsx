'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Compass,
  Users,
  Briefcase,
  UserCheck,
  ShieldCheck,
  Settings,
} from 'lucide-react';

export const AppBottomNav: React.FC = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const getBottomLinks = () => {
    switch (user.role) {
      case 'STUDENT':
        return [
          { label: 'Home', href: '/student/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: 'Courses', href: '/student/academics', icon: <BookOpen className="w-5 h-5" /> },
          { label: 'Market', href: '/student/marketplace', icon: <ShoppingBag className="w-5 h-5" /> },
          { label: 'Profile', href: '/student/profile', icon: <Settings className="w-5 h-5" /> },
        ];
      case 'ASPIRANT':
        return [
          { label: 'Home', href: '/aspirant/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: 'Colleges', href: '/aspirant/colleges', icon: <Compass className="w-5 h-5" /> },
          { label: 'Profile', href: '/aspirant/profile', icon: <Settings className="w-5 h-5" /> },
        ];
      case 'ALUMNI':
        return [
          { label: 'Home', href: '/alumni/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: 'Network', href: '/alumni/network', icon: <Users className="w-5 h-5" /> },
          { label: 'Careers', href: '/alumni/careers', icon: <Briefcase className="w-5 h-5" /> },
          { label: 'Mentors', href: '/alumni/mentorship', icon: <UserCheck className="w-5 h-5" /> },
        ];
      case 'ADMIN':
        return [
          { label: 'Metrics', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: 'Users', href: '/admin/users', icon: <Users className="w-5 h-5" /> },
          { label: 'Verify', href: '/admin/verifications', icon: <ShieldCheck className="w-5 h-5" /> },
        ];
      default:
        return [];
    }
  };

  const links = getBottomLinks();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 backdrop-blur px-2 shadow-lg">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <a
            key={link.href}
            href={link.href}
            className={cn(
              'flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium transition-colors',
              isActive ? 'text-brand-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
            )}
          >
            {link.icon}
            <span className="mt-1">{link.label}</span>
          </a>
        );
      })}
    </nav>
  );
};
