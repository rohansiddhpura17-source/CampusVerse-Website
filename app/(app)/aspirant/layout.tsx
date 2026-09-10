'use client';

import React, { useState } from 'react';
import { AspirantRoute } from '@/components/guards/route-guards';
import { AppSidebar } from '@/components/navigation/app-sidebar';
import { AppTopbar } from '@/components/navigation/app-topbar';
import { AppBottomNav } from '@/components/navigation/app-bottom-nav';
import { Drawer } from '@/components/ui/drawer';

export default function AspirantLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AspirantRoute>
      <div className="min-h-screen flex bg-slate-50 text-slate-900">
        <div className="hidden lg:block">
          <AppSidebar />
        </div>

        <Drawer
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          title="Aspirant Navigation"
          className="p-0"
        >
          <AppSidebar className="w-full border-r-0 h-auto" />
        </Drawer>

        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
          <AppTopbar onMenuToggle={() => setMobileMenuOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>

        <AppBottomNav />
      </div>
    </AspirantRoute>
  );
}
