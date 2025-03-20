import { Sidebar } from '@/components/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <Sidebar />
        <main className="h-screen flex-1">{children}</main>
      </SidebarProvider>
    </div>
  );
}
