import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata = {
  title: "BOP - Bouw Op Perfectie",
  description: "Luxe renovaties en verbouwingen met oog voor detail",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${inter.variable} ${robotoMono.variable} dark`}>
      <body className="antialiased bg-[#0C0C0C] min-h-screen">
        <div className="bg-[#0C0C0C] min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
