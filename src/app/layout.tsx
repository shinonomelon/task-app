import type { Metadata } from 'next';

import { UserProvider } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

import { Toaster } from '@/components/ui/sonner';

import './globals.css';

export const metadata: Metadata = {
  title: 'Task App',
  description: 'Created by Next.js and Supabase'
};

const getUser = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <UserProvider userPromise={getUser()}>{children}</UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
