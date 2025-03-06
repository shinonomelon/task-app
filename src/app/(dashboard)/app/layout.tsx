import { Sidebar } from '@/components/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </SidebarProvider>
    </div>
  );
}
