'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Avatar } from '@/components/ui/avatar';
import { Dropdown } from '@/components/ui/dropdown';
import { Bell, Search as SearchIcon, LogOut, User as UserIcon, Settings } from 'lucide-react';

export const AppTopbar: React.FC<{ onMenuToggle?: () => void }> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const rolePrefix = user?.role ? `/${user.role.toLowerCase()}` : '';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 shadow-xs">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <span className="sr-only">Toggle sidebar</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div className="relative hidden sm:block w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Quick search courses, notes..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href={`${rolePrefix}/notifications`}
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600" />
        </Link>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        {user && (
          <Dropdown
            trigger={
              <div className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <Avatar name={user.name} size="sm" />
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {user.role}
                  </p>
                </div>
              </div>
            }
            items={[
              {
                label: 'View Profile',
                icon: <UserIcon className="w-4 h-4 text-brand-600" />,
                onClick: () => router.push(`${rolePrefix}/profile`),
              },
              {
                label: 'Account Settings',
                icon: <Settings className="w-4 h-4 text-slate-600" />,
                onClick: () => router.push(`${rolePrefix}/settings`),
              },
              {
                label: 'Sign Out',
                icon: <LogOut className="w-4 h-4 text-rose-500" />,
                danger: true,
                onClick: async () => {
                  await logout();
                  router.push('/auth/login');
                },
              },
            ]}
          />
        )}
      </div>
    </header>
  );
};
