'use client';

import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "BOP - Bouw Op Perfectie",
  description: "Luxe renovaties en verbouwingen met oog voor detail",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="antialiased bg-[#0C0C0C]">
        {children}
      </body>
    </html>
  );
}
