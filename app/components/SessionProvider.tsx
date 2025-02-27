'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

interface Props {
  children: React.ReactNode;
  session: Session | null;
}

export default function SessionProvider({ children, session }: Props) {
  return (
    <NextAuthSessionProvider 
      session={session}
      refetchInterval={5 * 60} // รีเฟรช session ทุก 5 นาที
      refetchOnWindowFocus={false} // ไม่รีเฟรชเมื่อกลับมาที่หน้าต่าง
    >
      {children}
    </NextAuthSessionProvider>
  );
}