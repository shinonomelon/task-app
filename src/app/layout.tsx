import type { Metadata } from 'next';

import { UserProvider } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

import { Toaster } from '@/components/ui/sonner';

import { SITE_METADATA } from '@/constants/metadata';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: SITE_METADATA.title,
    template: '%s | ' + SITE_METADATA.title
  },
  description: SITE_METADATA.description
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
