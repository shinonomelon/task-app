'use client';

import { Sidebar } from './components/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {children}
    </div>
  );
}
