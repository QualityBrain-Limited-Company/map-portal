import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import 'leaflet/dist/leaflet.css'
import SessionProvider from "./components/SessionProvider";
import Navbar from "./components/Navbar";
import { getServerSession } from "next-auth";
import authOptions from "./lib/configs/auth/authOptions";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = { 
  title: "SDN Map-portal",
  description: "SDN Map-portal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="th">
      <body className={`${inter.variable}`}>
        <SessionProvider session={session}>
          <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
            <Navbar />
          </header>
          <main className="pt-16">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}