'use client';

import { DashboardProvider, useDashboard } from '@/app/contexts/DashboardContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, isMobile } = useDashboard();

  const mainContentMarginClass = isMobile
    ? 'pb-16'
    : sidebarCollapsed
    ? 'ml-20'
    : 'ml-64';

  return (
    <section id="dashboard" className="bg-gray-50 min-h-screen flex">
      <DashboardSidebar />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${mainContentMarginClass}`}>
        <DashboardHeader />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvider>
  );
}
