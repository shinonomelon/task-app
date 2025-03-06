import { Header } from '@/components/top/header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f2f9f2]">
      <Header />
      {children}
    </main>
  );
}
