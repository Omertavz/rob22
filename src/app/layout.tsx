'use client';

import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { AnimatePresence } from 'framer-motion';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
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
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </body>
    </html>
  );
}
