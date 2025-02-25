'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnimatePresence } from 'framer-motion';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <head>
        <title>BOP - Bouw Op Perfectie</title>
        <meta name="description" content="Luxe renovaties en verbouwingen met oog voor detail" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </body>
    </html>
  );
}
