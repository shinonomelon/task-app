import { Sidebar } from './_components/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className="p-6 pb-24 pl-24 md:pl-72">{children}</div>
      </main>
    </div>
  );
}
