import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import React from "react";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js with TanStack Query',
  description: 'Using TanStack Query with JSONPlaceholder API',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <body className={inter.className}>
      <Providers>
        <main className="container mx-auto p-4 max-w-4xl">
          {children}
        </main>
      </Providers>
      </body>
      </html>
  );
}