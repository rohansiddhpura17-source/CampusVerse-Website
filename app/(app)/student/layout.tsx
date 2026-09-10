'use client';

import React, { useState } from 'react';
import { StudentRoute } from '@/components/guards/route-guards';
import { AppSidebar } from '@/components/navigation/app-sidebar';
import { AppTopbar } from '@/components/navigation/app-topbar';
import { AppBottomNav } from '@/components/navigation/app-bottom-nav';
import { Drawer } from '@/components/ui/drawer';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <StudentRoute>
      <div className="min-h-screen flex bg-slate-50 text-slate-900">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AppSidebar />
        </div>

        {/* Mobile Slide-over Drawer */}
        <Drawer
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          title="Student Navigation"
          className="p-0"
        >
          <AppSidebar className="w-full border-r-0 h-auto" />
        </Drawer>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
          <AppTopbar onMenuToggle={() => setMobileMenuOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>

        {/* Mobile Sticky Bottom Nav */}
        <AppBottomNav />
      </div>
    </StudentRoute>
  );
}
